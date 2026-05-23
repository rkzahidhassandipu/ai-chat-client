// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  role: 'USER' | 'ADMIN';
  status: UserStatus;
  isActive: boolean;
  isEmailVerified: boolean;
  preferredLanguage: string;
  lastSeen: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserStatus = 'ONLINE' | 'OFFLINE' | 'AWAY';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
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
  isRead: boolean;
  createdAt: string;
}

export type MessageType = 'text' | 'image' | 'file' | 'audio';

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  users: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ─── Shared Media ─────────────────────────────────────────────────────────────
export interface SharedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  sentAt: string;
}
