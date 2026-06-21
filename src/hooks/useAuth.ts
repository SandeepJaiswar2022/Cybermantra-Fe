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
      const { accessToken, expiresIn, user } = response.data;

      console.log("response.data after login :: ", response.data);


      setAuth(user, accessToken, expiresIn); // pass expiresIn to store
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, user);
      toast.success(`Welcome back, ${user.firstName}!`);

      if (user.role === 'ADMIN') navigate(ROUTES.ADMIN.DASHBOARD);
      else if (user.role === 'INSTRUCTOR') navigate(ROUTES.INSTRUCTOR.DASHBOARD);
      else navigate(ROUTES.STUDENT.DASHBOARD);
    },
  });
}


// ─── Register ─────────────────────────────────────────────────────────────────

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      // Register only returns email now — no auth data
      toast.success('Account created! Please verify your email.');
      navigate(ROUTES.LOGIN);
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
