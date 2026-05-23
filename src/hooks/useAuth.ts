'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import type { LoginInput, RegisterInput } from '@/validations/auth.schema';

export const AUTH_KEYS = {
  me: ['auth', 'me'] as const,
};

// ─── Get current user ──────────────────────────────────────────────────────────
export function useMe() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: () => authService.getMe().then((r) => r.data.data),
    enabled: isAuthenticated,
    retry: false,
  });
}

// ─── Login ─────────────────────────────────────────────────────────────────────
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginInput) =>
      authService.login(data).then((r) => r.data.data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      queryClient.setQueryData(AUTH_KEYS.me, data.user);
      router.push('/chat');
    },
  });
}

// ─── Register ──────────────────────────────────────────────────────────────────
export function useRegister() {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: RegisterInput) =>
      authService.register(data).then((r) => r.data),
    onSuccess: () => router.push('/login?registered=true'),
  });
}

// ─── Logout ────────────────────────────────────────────────────────────────────
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: () => authService.logout(), // backend cookie clear করে
    onSettled: () => {
      logout();          // memory + sessionStorage clear
      queryClient.clear();
      router.push('/login');
    },
  });
}

// ─── Forgot Password ───────────────────────────────────────────────────────────
export function useForgotPassword() {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
}

// ─── Reset Password ────────────────────────────────────────────────────────────
export function useResetPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => router.push('/login?reset=true'),
  });
}

// ─── Change Password ───────────────────────────────────────────────────────────
export function useChangePassword() {
  const { logout } = useAuthStore();
  const router = useRouter();
  return useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      logout();
      router.push('/login?changed=true');
    },
  });
}
