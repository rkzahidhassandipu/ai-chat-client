import { api } from '@/lib/axios';
import { ApiResponse, AuthResponse, User } from '@/types';
import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from '@/validations/auth.schema';

export const authService = {
  register: (data: RegisterInput) =>
    api.post<ApiResponse<User>>('/auth/register', data),

  login: (data: LoginInput) =>
    // withCredentials: true — backend refreshToken cookie set করে
    api.post<ApiResponse<AuthResponse>>('/auth/login', data),

  logout: () =>
    // withCredentials: true — backend cookie clear করে
    api.post('/auth/logout'),

  refreshToken: () =>
    // Cookie automatically পাঠায় — নতুন accessToken আসে
    api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh-token'),

  forgotPassword: (data: ForgotPasswordInput) =>
    api.post('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordInput) =>
    api.post('/auth/reset-password', {
      token: data.token,
      newPassword: data.newPassword,
    }),

  changePassword: (data: ChangePasswordInput) =>
    api.patch('/auth/change-password', {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    }),

  verifyEmail: (token: string) =>
    api.get(`/auth/verify-email?token=${token}`),

  getMe: () =>
    api.get<ApiResponse<User>>('/auth/me'),
};
