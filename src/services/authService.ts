import apiClient from '@/lib/axios';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refresh: async (): Promise<{ accessToken: string }> => {
    const res = await apiClient.post<{ accessToken: string }>('/auth/refresh');
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<User>('/users/me');
    return res.data;
  },

  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.get(`/auth/verify-email/${token}`);
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { token, password });
  },
};
