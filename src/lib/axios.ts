import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://ai-chat-server-8ifp.onrender.com/api/v1',
  withCredentials: true, // ← সব request এ cookie পাঠায়
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request: accessToken memory থেকে নেয় (cookie নয়) ───────────────────────
// accessToken short-lived (15min) তাই memory তে রাখা safe
// refreshToken HttpOnly cookie তে থাকে — JS access করতে পারে না
api.interceptors.request.use((config) => {
  // Zustand store থেকে token নেবে (নিচে দেখো)
  // এখানে কিছু করতে হবে না — store থেকে inject হবে
  return config;
});

// ─── Response: 401 হলে refresh করে নেয় ──────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        // Backend refresh token cookie পাঠায়, নতুন accessToken আসে
        const { data } = await api.post('/auth/refresh-token');
        const newToken = data.data.accessToken;

        // Memory store এ save করো (zustand)
        const { useAuthStore } = await import('@/store/authStore');
        useAuthStore.getState().setToken(newToken);

        // Retry original request
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        // Refresh failed — logout
        const { useAuthStore } = await import('@/store/authStore');
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

// ─── Token inject করার helper ─────────────────────────────────────────────────
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}
