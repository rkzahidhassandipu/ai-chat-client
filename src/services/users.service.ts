import { api } from '@/lib/axios';
import { ApiResponse, User, PaginatedResponse } from '@/types';
import type { UpdateProfileInput } from '@/validations/auth.schema';

export const usersService = {
  getMe: () => api.get<ApiResponse<User>>('/users/me'),

  updateProfile: (data: UpdateProfileInput) =>
    api.patch<ApiResponse<User>>('/users/update-profile', data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post<ApiResponse<{ avatar: string }>>('/users/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  searchUsers: (q: string, page = 1, limit = 10) =>
    api.get<ApiResponse<PaginatedResponse<User>>>(`/users?q=${q}&page=${page}&limit=${limit}`),

  getUserById: (id: string) =>
    api.get<ApiResponse<User>>(`/users/${id}`),

  blockUser: (id: string) => api.post(`/users/block/${id}`),

  unblockUser: (id: string) => api.delete(`/users/block/${id}`),

  getBlockedUsers: () => api.get<ApiResponse<User[]>>('/users/blocked'),

  updateStatus: (status: 'ONLINE' | 'OFFLINE' | 'AWAY') =>
    api.patch('/users/status', { status }),
};
