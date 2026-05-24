import { useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { API_BASE_URL } from '@/constants';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * Attempts a silent token refresh on mount using the HttpOnly refresh token cookie.
 * This keeps users logged in across page reloads without storing tokens in localStorage.
 */
export function AuthInitializer({ children }: AuthInitializerProps) {
  const { setAuth, logout, setInitialized } = useAuthStore();
  const { theme } = useUIStore();

  // Apply theme on mount
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', isDark);
  }, [theme]);

  // Silent refresh on mount
  useEffect(() => {
    let cancelled = false;

    async function initAuth() {
      try {
        const response = await axios.post<{
          accessToken: string;
          user: import('@/types').User;
        }>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (!cancelled) {
          setAuth(response.data.user, response.data.accessToken);
        }
      } catch {
        // No valid refresh token — that's fine, user is just not logged in
        if (!cancelled) {
          logout();
        }
      } finally {
        if (!cancelled) {
          setInitialized(true);
        }
      }
    }

    initAuth();

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
