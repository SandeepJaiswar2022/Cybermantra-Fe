import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  // Actions
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isInitialized: false,

    setAuth: (user, accessToken) =>
      set({ user, accessToken, isAuthenticated: true }),

    setAccessToken: (accessToken) =>
      set({ accessToken }),

    setUser: (user) =>
      set({ user }),

    logout: () =>
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      }),

    setInitialized: (isInitialized) =>
      set({ isInitialized }),
  }))
);
