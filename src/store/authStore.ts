"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types";
import { setAuthToken } from "@/lib/axios";

interface AuthState {
  user: User | null;
  accessToken: string | null; // memory only — NOT in localStorage
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setAuth: (user: User, token: string) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user }),

      setToken: (accessToken) => {
        setAuthToken(accessToken); // axios default header এ set করো
        set({ accessToken });
      },

      setAuth: (user, accessToken) => {
        setAuthToken(accessToken); // axios header এ set করো
        set({ user, accessToken, isAuthenticated: true });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      logout: () => {
        setAuthToken(null); // axios header clear করো
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "ai-chat-auth",
      storage: createJSONStorage(() => sessionStorage), // sessionStorage — tab বন্ধ হলে clear
      partialize: (state) => ({
        // accessToken store করা হচ্ছে না
        // শুধু user info আর isAuthenticated রাখছি
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.isAuthenticated && !state?.accessToken) {
          import("@/services/auth.service").then(({ authService }) => {
            authService
              .refreshToken()
              .then(({ data }) => {
                const token = data.data.accessToken;
                state.setToken(token);

                // ✅ chatService এ সাথে সাথে token set করুন
                import("@/services/chat.service").then(({ chatService }) => {
                  chatService.setToken(token);
                });
              })
              .catch(() => {
                state.logout();
              });
          });
        }
      },
    },
  ),
);
