import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { QUERY_KEYS, ROUTES } from '@/constants';
import type { LoginRequest, RegisterRequest, User } from '@/types';

// ─── Get Current User ─────────────────────────────────────────────────────────

export function useCurrentUser() {
  const { accessToken, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: authService.getMe,
    enabled: isAuthenticated && !!accessToken,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
}

// ─── Login ────────────────────────────────────────────────────────────────────
export function useLogin() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),

    onSuccess: (response) => {
      const authData = response.data;

      const user: User = {
        id: authData.id,
        email: authData.email,
        firstName: authData.firstName,
        lastName: authData.lastName,
        role: authData.role,
        isEmailVerified: authData.isEmailVerified,
      };

      setAuth(user, authData.accessToken);

      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, user);

      toast.success(`Welcome back, ${user.firstName}!`);

      const role = user.role;

      if (role === 'ADMIN') {
        navigate(ROUTES.ADMIN.DASHBOARD);
      } else if (role === 'INSTRUCTOR') {
        navigate(ROUTES.INSTRUCTOR.DASHBOARD);
      } else {
        navigate(ROUTES.STUDENT.DASHBOARD);
      }
    },

    onError: () => {
      // handled globally
    },
  });
}


// ─── Register ─────────────────────────────────────────────────────────────────

export function useRegister() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, data.user);
      toast.success('Account created! Please verify your email.');
      navigate(ROUTES.STUDENT.DASHBOARD);
    },
  });
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      logout();
      queryClient.clear();
      navigate(ROUTES.LOGIN);
    },
  });
}
