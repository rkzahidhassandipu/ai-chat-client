"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { formatTime } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useMessages, CHAT_KEYS, useChatWindow } from "@/hooks/useChat";
import { chatService, Message } from "@/services/chat.service";
import { useQueryClient } from "@tanstack/react-query";

interface ChatWindowProps {
  chatId: string | null;
  chatUser: {
    id: string;
    name: string;
    avatar?: string | null;
    status?: string;
    preferredLanguage?: string;
  } | null;
}

export function ChatWindow({ chatId, chatUser }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [showTranslation, setShowTranslation] = useState<Record<string, boolean>>({});
  const endRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useMessages(chatId);
  const { isTyping } = useChatWindow(chatId); // ✅ useEffect সরানো হয়েছে

  // Auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = useCallback(() => {
    if (!input.trim() || !chatId || !user) return;

    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      conversationId: chatId,
      senderId: user.id,
      content: input.trim(),
      type: "TEXT",
      isEdited: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      sender: { id: user.id, name: user.name, avatar: user.avatar },
      readReceipts: [],
    };

    queryClient.setQueryData(
      CHAT_KEYS.messages(chatId),
      (old: Message[] = []) => [...old, tempMsg],
    );

    chatService.sendMessage(chatId, input.trim());
    setInput("");
    chatService.stopTyping(chatId);
  }, [input, chatId, user, queryClient]);

  // Typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!chatId) return;

    chatService.startTyping(chatId);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      chatService.stopTyping(chatId);
    }, 2000);
  };

  // File upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatId) return;
    try {
      await chatService.sendFileMessage(chatId, file);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  if (!chatId || !chatUser) {
    return (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "var(--bg)", gap: 12,
      }}>
        <div style={{ fontSize: 48 }}>💬</div>
        <div style={{ color: "var(--text)", fontWeight: 700, fontSize: 18 }}>Select a conversation</div>
        <div style={{ color: "var(--text-muted)", fontSize: 14 }}>Choose from your messages on the left</div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

      {/* Header */}
      <div style={{
        padding: "13px 20px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 12,
        background: "var(--sidebar)", flexShrink: 0,
      }}>
        <Avatar name={chatUser.name} src={chatUser.avatar} size={40} radius={12} status={chatUser.status as any} showStatus />
        <div style={{ flex: 1 }}>
          <div style={{ color: "var(--text)", fontWeight: 700, fontSize: 15, letterSpacing: -0.3 }}>{chatUser.name}</div>
          <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
            {chatUser.status === "ONLINE" ? "🟢 Active now" : chatUser.status === "AWAY" ? "🟡 Away" : "⚫ Offline"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["📞", "📹", "🔍"].map((icon) => (
            <button key={icon} style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "7px 11px", cursor: "pointer", fontSize: 15,
            }}>{icon}</button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "20px 24px",
        display: "flex", flexDirection: "column", gap: 2,
        background: "var(--bg)",
      }}>
        {isLoading && (
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, padding: 20 }}>
            Loading messages...
          </div>
        )}

        <div style={{ textAlign: "center", margin: "4px 0 16px" }}>
          <span style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            color: "var(--text-muted)", fontSize: 11,
            padding: "3px 14px", borderRadius: 20,
          }}>Today</span>
        </div>

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isMe={msg.senderId === user?.id}
            showTrans={!!showTranslation[msg.id]}
            onToggleTrans={() => setShowTranslation((p) => ({ ...p, [msg.id]: !p[msg.id] }))}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0" }}>
            <div style={{
              background: "var(--msg-them)", padding: "10px 14px",
              borderRadius: "16px 16px 16px 4px",
              display: "flex", gap: 4, alignItems: "center",
            }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: 6, height: 6, background: "var(--text-muted)",
                  borderRadius: "50%",
                  animation: `bounce-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
            <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{chatUser.name} is typing...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "14px 20px", borderTop: "1px solid var(--border)",
        background: "var(--sidebar)", flexShrink: 0,
      }}>
        <div style={{
          display: "flex", alignItems: "center",
          background: "var(--input-bg)", border: "1px solid var(--border)",
          borderRadius: 16, padding: "4px 6px 4px 14px", gap: 6,
        }}>
          <input
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={`Message ${chatUser.name}...`}
            style={{
              flex: 1, background: "transparent", border: "none",
              outline: "none", color: "var(--text)", fontSize: 14, padding: "8px 0",
            }}
          />
          <label style={{ cursor: "pointer", fontSize: 17, padding: "4px 6px", color: "var(--text-muted)" }}>
            📎
            <input type="file" onChange={handleFileUpload} style={{ display: "none" }} />
          </label>
          <button
            onClick={sendMessage}
            style={{
              background: input.trim() ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "var(--surface)",
              border: `1px solid ${input.trim() ? "transparent" : "var(--border)"}`,
              borderRadius: 12, padding: "8px 16px",
              cursor: "pointer", fontSize: 16,
              color: input.trim() ? "#fff" : "var(--text-muted)",
              fontWeight: 600, transition: "all 0.2s",
            }}
          >➤</button>
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, isMe, showTrans, onToggleTrans }: {
  msg: Message; isMe: boolean; showTrans: boolean; onToggleTrans: () => void;
}) {
  const isDeleted = msg.isDeleted;
  const isImage = msg.type === "IMAGE";
  const isFile = msg.type === "FILE" || msg.type === "AUDIO" || msg.type === "VIDEO" || msg.type === "VOICE";

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: isMe ? "flex-end" : "flex-start",
      marginBottom: 6,
    }}>
      <div style={{ maxWidth: "60%", display: "flex", flexDirection: "column", gap: 3 }}>

        {isImage && !isDeleted && (
          <img src={msg.content} alt="image" style={{
            maxWidth: 240,
            borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            cursor: "pointer", border: "1px solid var(--border)",
          }} />
        )}

        {isFile && !isDeleted && (
          <a href={msg.content} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <div style={{
              background: isMe ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "var(--msg-them)",
              borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
            }}>
              <div style={{
                width: 36, height: 36,
                background: isMe ? "rgba(255,255,255,0.15)" : "var(--surface)",
                borderRadius: 8, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 18, flexShrink: 0,
              }}>
                {msg.type === "AUDIO" ? "🎵" : msg.type === "VIDEO" ? "🎬" : msg.type === "VOICE" ? "🎤" : "📄"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: isMe ? "#fff" : "var(--text)", fontSize: 13, fontWeight: 600 }}>
                  {msg.content.split("/").pop()}
                </div>
                <div style={{ color: isMe ? "rgba(255,255,255,0.6)" : "var(--text-muted)", fontSize: 11 }}>
                  {msg.type}
                </div>
              </div>
              <span style={{ color: isMe ? "rgba(255,255,255,0.7)" : "var(--text-muted)", fontSize: 16 }}>⬇</span>
            </div>
          </a>
        )}

        {(msg.type === "TEXT" || msg.type === "LINK" || isDeleted) && (
          <div style={{
            background: isDeleted ? "var(--surface)" : isMe ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "var(--msg-them)",
            color: isDeleted ? "var(--text-muted)" : isMe ? "#fff" : "var(--msg-them-text)",
            padding: "10px 14px",
            borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            fontSize: 14, lineHeight: 1.5,
            fontStyle: isDeleted ? "italic" : "normal",
            wordBreak: "break-word",
          }}>
            {msg.content}
          </div>
        )}

        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "0 4px",
          flexDirection: isMe ? "row-reverse" : "row",
        }}>
          <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{formatTime(msg.createdAt)}</span>
          {msg.isEdited && !isDeleted && (
            <span style={{ color: "var(--text-muted)", fontSize: 10 }}>edited</span>
          )}
          {isMe && !isDeleted && <span style={{ color: "var(--accent)", fontSize: 11 }}>✓✓</span>}
        </div>
      </div>
    </div>
  );
}