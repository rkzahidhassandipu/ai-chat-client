import { io, Socket } from "socket.io-client";

// ==========================================
// Types
// ==========================================

export type MessageType =
  | "TEXT"
  | "IMAGE"
  | "FILE"
  | "VIDEO"
  | "AUDIO"
  | "VOICE"
  | "LINK";

export interface User {
  id: string;
  name: string;
  avatar: string | null;
  status: "ONLINE" | "OFFLINE" | "AWAY";
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  translated?: string;
  translation?: string;
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  sender: Pick<User, "id" | "name" | "avatar">;
  readReceipts: ReadReceipt[];
}

export interface ReadReceipt {
  userId: string;
  readAt: string;
  user: Pick<User, "id" | "name">;
}

export interface Conversation {
  id: string;
  type: "PRIVATE" | "GROUP";
  name: string | null;
  avatar: string | null;
  members: ConversationMember[];
  messages: Message[];
}

export interface ConversationMember {
  id: string;
  userId: string;
  role: "ADMIN" | "MEMBER";
  joinedAt: string;
  lastReadAt: string | null;
  user: User;
}

export interface UploadResult {
  success: boolean;
  url: string;
  publicId: string;
  type: MessageType;
}

// ==========================================
// Event Callbacks
// ==========================================

export interface ChatEvents {
  onNewMessage?: (message: Message) => void;
  onMessageEdited?: (message: Message) => void;
  onMessageDeleted?: (data: {
    messageId: string;
    conversationId: string;
  }) => void;
  onMessageRead?: (data: {
    conversationId: string;
    messageId: string;
    userId: string;
    readAt: string;
  }) => void;
  onUserTyping?: (data: {
    conversationId: string;
    userId: string;
    userName: string;
  }) => void;
  onUserStopTyping?: (data: { conversationId: string; userId: string }) => void;
  onUserOnline?: (data: {
    userId: string;
    name: string;
    avatar: string | null;
  }) => void;
  onUserOffline?: (data: { userId: string; lastSeen: string }) => void;
  onJoined?: (data: { conversationId: string }) => void;
  onError?: (error: { message: string }) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

// ==========================================
// Chat Service
// ==========================================

class ChatService {
  private socket: Socket | null = null;
  private baseUrl: string;
  private token: string | null = null;
  private events: ChatEvents = {};

  constructor(baseUrl: string = "http://localhost:5000") {
    this.baseUrl = baseUrl;
  }

  // ==========================================
  // Connection
  // ==========================================

  connect(token: string, callbacks: ChatEvents = {}): void {
    this.token = token;
    this.events = callbacks;

    this.socket = io(this.baseUrl, {
      transports: ["websocket", "polling"],
      query: { token },
    });

    this.socket.on("connect", () => {
      console.log("WebSocket connected");
      this.events.onConnect?.();
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
      this.events.onDisconnect?.();
    });

    this.socket.on("new_message", (message: Message) => {
      this.events.onNewMessage?.(message);
    });

    this.socket.on("message_edited", (message: Message) => {
      this.events.onMessageEdited?.(message);
    });

    this.socket.on("message_deleted", (data) => {
      this.events.onMessageDeleted?.(data);
    });

    this.socket.on("message_read", (data) => {
      this.events.onMessageRead?.(data);
    });

    this.socket.on("user_typing", (data) => {
      this.events.onUserTyping?.(data);
    });

    this.socket.on("user_stop_typing", (data) => {
      this.events.onUserStopTyping?.(data);
    });

    this.socket.on("user_online", (data) => {
      this.events.onUserOnline?.(data);
    });

    this.socket.on("user_offline", (data) => {
      this.events.onUserOffline?.(data);
    });

    this.socket.on("joined", (data) => {
      this.events.onJoined?.(data);
    });

    this.socket.on("chat_error", (error) => {
      console.error("Chat error:", error);
      this.events.onError?.(error);
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  setToken(token: string): void {
    this.token = token;
  }

  // ==========================================
  // WebSocket Events
  // ==========================================

  joinConversation(conversationId: string): void {
    this.socket?.emit("join_conversation", { conversationId });
  }

  leaveConversation(conversationId: string): void {
    this.socket?.emit("leave_conversation", { conversationId });
  }

  sendMessage(
  conversationId: string,
  content: string,
  type: MessageType = "TEXT",
): void {
  this.socket?.emit("send_message", {
    conversationId,
    content,
    type,
  });
}

  editMessage(messageId: string, content: string): void {
    this.socket?.emit("edit_message", { messageId, content });
  }

  deleteMessage(messageId: string): void {
    this.socket?.emit("delete_message", { messageId });
  }

  startTyping(conversationId: string): void {
    this.socket?.emit("typing_start", { conversationId });
  }

  stopTyping(conversationId: string): void {
    this.socket?.emit("typing_stop", { conversationId });
  }

  markRead(conversationId: string, messageId: string): void {
    this.socket?.emit("mark_read", { conversationId, messageId });
  }

  // ==========================================
  // REST API — Conversations
  // ==========================================

  async getConversations(): Promise<Conversation[]> {
    const res = await this.fetchApi("/chat/conversations");
    return res.data;
  }

  async createPrivateConversation(targetUserId: string): Promise<Conversation> {
    const res = await this.fetchApi("/chat/conversations/private", {
      method: "POST",
      body: JSON.stringify({ targetUserId }),
    });
    return res.data;
  }

  async createGroupConversation(
    name: string,
    memberIds: string[],
  ): Promise<Conversation> {
    const res = await this.fetchApi("/chat/conversations/group", {
      method: "POST",
      body: JSON.stringify({ name, memberIds }),
    });
    return res.data;
  }

  async getMessages(
    conversationId: string,
    cursor?: string,
  ): Promise<Message[]> {
    const query = cursor ? `?cursor=${cursor}` : "";
    const res = await this.fetchApi(
      `/chat/conversations/${conversationId}/messages${query}`,
    );
    return res.data;
  }

  // ==========================================
  // REST API — File Upload
  // ==========================================

  async uploadFile(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${this.baseUrl}/api/v1/chat/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Upload failed");
    }

    return res.json();
  }

  // Upload file and send as message in one step
  async sendFileMessage(conversationId: string, file: File): Promise<void> {
    const uploaded = await this.uploadFile(file);
    this.sendMessage(
      conversationId,
      uploaded.url,
      uploaded.type as MessageType,
    );
  }

  // ==========================================
  // REST API — Auth
  // ==========================================

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const res = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await res.json();
    this.token = data.data.accessToken;
    return data.data;
  }

  // ==========================================
  // Private helpers
  // ==========================================

  private async fetchApi(
    path: string,
    options: RequestInit = {},
  ): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/v1${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
        ...options.headers,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Request failed");
    }

    return res.json();
  }
}

// ==========================================
// Export singleton
// ==========================================

export const chatService = new ChatService("http://localhost:5000");
export default ChatService;
