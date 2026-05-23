import { chatService, Message } from "@/services/chat.service";
import { useAuthStore } from "@/store/authStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const CHAT_KEYS = {
  conversations: ["chat", "conversations"] as const,
  messages: (id: string) => ["chat", "messages", id] as const,
};

export const useChatInit = () => {
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (accessToken) {
      chatService.setToken(accessToken);
    }
  }, [accessToken]); // ✅ এখানে ছিল bug — ), [accessToken] আলাদা ছিল
};

export const useConversations = () => {
  const { isAuthenticated, accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: CHAT_KEYS.conversations,
    queryFn: () => chatService.getConversations(),
    enabled: isAuthenticated && !!accessToken,
    staleTime: 30_000,
  });

  // Conversations load হলে সব messages prefetch করুন
  useEffect(() => {
    if (!query.data || query.data.length === 0) return;
    query.data.forEach((conv) => {
      queryClient.prefetchQuery({
        queryKey: CHAT_KEYS.messages(conv.id),
        queryFn: () => chatService.getMessages(conv.id),
        staleTime: 5 * 60_000,
      });
    });
  }, [query.data]);

  return query;
};

export const useMessages = (conversationId: string | null) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: CHAT_KEYS.messages(conversationId!),
    queryFn: () => chatService.getMessages(conversationId!),
    enabled: isAuthenticated && !!conversationId,

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,

    refetchOnWindowFocus: false,
    refetchOnMount: false,

    retry: 1,
  });
};

export const useChatWindow = (chatId: string | null) => {
  const { user, accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!chatId || !accessToken) return;

    chatService.connect(accessToken, {
      onNewMessage: (message: Message) => {
        if (message.conversationId === chatId) {
          queryClient.setQueryData(
            CHAT_KEYS.messages(chatId),
            (old: Message[] = []) => {
              const filtered = old.filter((m) => !m.id.startsWith("temp-"));
              return [...filtered, message];
            },
          );
        }

        queryClient.invalidateQueries({
          queryKey: CHAT_KEYS.conversations,
        });
      },

      onMessageEdited: (message: Message) => {
        queryClient.setQueryData(
          CHAT_KEYS.messages(chatId),
          (old: Message[] = []) =>
            old.map((m) => (m.id === message.id ? message : m)),
        );
      },

      onMessageDeleted: ({ messageId }) => {
        queryClient.setQueryData(
          CHAT_KEYS.messages(chatId),
          (old: Message[] = []) =>
            old.map((m) =>
              m.id === messageId
                ? { ...m, isDeleted: true, content: "This message was deleted" }
                : m,
            ),
        );
      },

      onUserTyping: ({ userId }) => {
        if (userId !== user?.id) setIsTyping(true);
      },

      onUserStopTyping: ({ userId }) => {
        if (userId !== user?.id) setIsTyping(false);
      },
    });

    chatService.joinConversation(chatId);

    return () => {
      chatService.leaveConversation(chatId);
      chatService.disconnect?.();
    };
  }, [chatId, accessToken, queryClient, user?.id]);

  useEffect(() => {
    if (!chatId) return;

    queryClient.invalidateQueries({
      queryKey: CHAT_KEYS.messages(chatId),
    });
  }, [chatId, queryClient]);
  return { isTyping };
};
