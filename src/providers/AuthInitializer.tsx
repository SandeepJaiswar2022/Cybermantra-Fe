import { useEffect, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { API_BASE_URL } from '@/constants';
import { AuthResponse } from '@/types';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  const { setAuth, logout, setInitialized } = useAuthStore();
  const { theme } = useUIStore();
  const initializedRef = useRef(false);

  // Apply theme + listen for system preference changes
  useEffect(() => {
    const root = document.documentElement;

    function applyTheme(prefersDark: boolean) {
      const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
      root.classList.toggle('dark', isDark);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    applyTheme(mediaQuery.matches);

    // Only attach listener when following system preference
    if (theme === 'system') {
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  // Silent refresh on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let cancelled = false;

    // Fix: use a separate boolean to track auth init, not initializedRef
    let authSettled = false;

    function markInitialized() {
      // if (!cancelled) {
      authSettled = true;
      setInitialized(true);
      // }
    }

    // Fallback: if request hangs past 6s, unblock the app
    const timeoutId = setTimeout(() => {
      if (!authSettled) {
        console.warn('Auth initialization timed out — proceeding as guest');
        markInitialized();
      }
    }, 6000);

    async function initAuth() {
      try {
        const response = await axios.post<AuthResponse>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true, timeout: 5000 }
        );

        const { accessToken, expiresIn, user } = response.data.data;

        // Remove the cancelled check — setAuth is idempotent, safe to call after unmount
        setAuth(user, accessToken, expiresIn);
        console.log('[AuthInit] setAuth called');

      } catch (error) {
        if (cancelled) return; // ← keep here — don't logout on stale error

        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          logout();
        } else {
          console.warn('[AuthInit] Non-auth error:', error);
        }
      } finally {
        clearTimeout(timeoutId);
        markInitialized();
        console.log('[AuthInit] Final store state:', useAuthStore.getState());
      }
    }

    initAuth();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}