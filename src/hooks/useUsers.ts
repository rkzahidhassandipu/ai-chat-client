'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/users.service';
import { useAuthStore } from '@/store/authStore';

export const USER_KEYS = {
  me: ['users', 'me'] as const,
  byId: (id: string) => ['users', id] as const,
  search: (q: string) => ['users', 'search', q] as const,
  blocked: ['users', 'blocked'] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: USER_KEYS.me,
    queryFn: () => usersService.getMe().then((r) => r.data.data),
  });
}

export function useUserById(id: string) {
  return useQuery({
    queryKey: USER_KEYS.byId(id),
    queryFn: () => usersService.getUserById(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useSearchUsers(q: string) {
  return useQuery({
    queryKey: USER_KEYS.search(q),
    queryFn: () => usersService.searchUsers(q).then((r) => r.data.data),
    enabled: q.length > 0,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: usersService.updateProfile,
    onSuccess: (res) => {
      const user = res.data.data;
      updateUser(user);
      queryClient.invalidateQueries({ queryKey: USER_KEYS.me });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (file: File) => usersService.uploadAvatar(file),
    onSuccess: (res) => {
      const { avatar } = res.data.data;
      updateUser({ avatar });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.me });
    },
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.blockUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_KEYS.blocked }),
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.unblockUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_KEYS.blocked }),
  });
}
