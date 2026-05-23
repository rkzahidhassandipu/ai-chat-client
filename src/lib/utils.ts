import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString();
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const AVATAR_GRADIENT: Record<string, [string, string]> = {
  A: ['#6366f1', '#8b5cf6'],
  B: ['#06b6d4', '#3b82f6'],
  C: ['#ec4899', '#f43f5e'],
  D: ['#22c55e', '#10b981'],
  E: ['#f59e0b', '#ef4444'],
  F: ['#8b5cf6', '#6366f1'],
  G: ['#14b8a6', '#06b6d4'],
  default: ['#6366f1', '#8b5cf6'],
};

export function getAvatarGradient(name: string): [string, string] {
  const key = name?.[0]?.toUpperCase() || 'default';
  return AVATAR_GRADIENT[key] || AVATAR_GRADIENT.default;
}

export const STATUS_COLOR: Record<string, string> = {
  ONLINE: '#22c55e',
  AWAY: '#f59e0b',
  OFFLINE: '#52525b',
};

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || 'Something went wrong';
  }
  return 'Something went wrong';
}
