import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  expiresAt: number | null; // epoch ms — when access token expires
  isAuthenticated: boolean;
  isInitialized: boolean;

  // Actions
  setAuth: (user: User, accessToken: string, expiresIn: number) => void;
  setAccessToken: (token: string, expiresIn: number) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set) => ({
    user: null,
    accessToken: null,
    expiresAt: null,
    isAuthenticated: false,
    isInitialized: false,

    setAuth: (user, accessToken, expiresIn) =>
      set({
        user,
        accessToken,
        expiresAt: Date.now() + expiresIn * 1000,
        isAuthenticated: true,
      }),

    setAccessToken: (accessToken, expiresIn) =>
      set({
        accessToken,
        expiresAt: Date.now() + expiresIn * 1000,
      }),

    setUser: (user) => set({ user }),

    logout: () =>
      set({
        user: null,
        accessToken: null,
        expiresAt: null,
        isAuthenticated: false,
      }),

    setInitialized: (isInitialized) => set({ isInitialized }),
  }))
);