import { useState } from "react";
import { NavTab } from "./RightNavbar";
import { useAuthStore } from "@/store/authStore";
import { CHAT_KEYS, useChatInit, useConversations } from "@/hooks/useChat";
import ChatConvItem from "./ChatConvItem";
import { chatService } from "@/services/chat.service";
import { useQueryClient } from "@tanstack/react-query";

interface ChatSidebarProps {
  activeTab: NavTab;
  activeChat: string | null;
  onSelectChat: (id: string, user: any) => void;
}

export const ChatSidebar = ({
  activeTab,
  activeChat,
  onSelectChat,
}: ChatSidebarProps) => {
  const [search, setSearch] = useState("");
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  useChatInit();

  const { data: conversations = [], isLoading } = useConversations();

  const privateConvs = conversations
    .filter((c) => c.type === "PRIVATE")
    .filter((c) =>
      c.members.some(
        (m) =>
          m.userId !== user?.id &&
          m.user.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      ),
    );

  const groupConvs = conversations
    .filter((c) => c.type === "GROUP")
    .filter((c) =>
      c.name?.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
    );

  const handleMouseEnter = (conversationId: string) => {
    queryClient.prefetchQuery({
      queryKey: CHAT_KEYS.messages(conversationId),
      queryFn: () => chatService.getMessages(conversationId),
      staleTime: 5 * 60_000,
    });
  };

  return (
    <aside
      style={{
        width: 300,
        background: "var(--sidebar)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 16px 14px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            color: "var(--text)",
            fontWeight: 800,
            fontSize: 18,
            marginBottom: 12,
            letterSpacing: -0.5,
          }}
        >
          {activeTab === "messages"
            ? "Messages"
            : activeTab === "groups"
              ? "Groups"
              : activeTab === "friends"
                ? "Add Friends"
                : activeTab === "profile"
                  ? "My Profile"
                  : "Settings"}
        </div>

        {(activeTab === "messages" || activeTab === "groups") && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "8px 12px",
            }}
          >
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text)",
                fontSize: 13,
                width: "100%",
              }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Loading */}
        {isLoading && (
          <div
            style={{
              padding: 20,
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 13,
            }}
          >
            Loading...
          </div>
        )}

        {/* Messages list */}
        {activeTab === "messages" &&
          !isLoading &&
          privateConvs.map((conv) => {
            const otherMember = conv.members.find((m) => m.userId !== user?.id);
            return (
              <ChatConvItem
                key={conv.id}
                id={conv.id}
                name={otherMember?.user.name || "Unknown"}
                avatar={otherMember?.user.avatar || null}
                status={otherMember?.user.status}
                lastMsg={
                  conv.messages[0]?.isDeleted
                    ? "This message was deleted"
                    : conv.messages[0]?.content || "No messages yet"
                }
                time={conv.messages[0]?.createdAt || ""}
                unread={0}
                isActive={activeChat === conv.id}
                onClick={() => onSelectChat(conv.id, otherMember?.user)}
              />
            );
          })}

        {/* Groups list */}
        {activeTab === "groups" &&
          !isLoading &&
          groupConvs.map((conv) => (
            <ChatConvItem
              key={conv.id}
              id={conv.id}
              name={conv.name || "Group"}
              avatar={conv.avatar}
              lastMsg={conv.messages[0]?.content || "No messages yet"}
              time={conv.messages[0]?.createdAt || ""}
              unread={0}
              isActive={activeChat === conv.id}
              onClick={() =>
                onSelectChat(conv.id, { name: conv.name, id: conv.id })
              }
              subLabel={`${conv.members.length} members`}
              onMouseEnter={() => handleMouseEnter(conv.id)}
            />
          ))}

        {/* Empty state */}
        {activeTab === "messages" &&
          !isLoading &&
          privateConvs.length === 0 && (
            <div
              style={{
                padding: 20,
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 13,
              }}
            >
              No conversations yet
            </div>
          )}
      </div>
    </aside>
  );
};
