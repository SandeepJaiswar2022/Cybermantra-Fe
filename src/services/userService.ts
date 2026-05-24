import apiClient from '@/lib/axios';
import type { User, PaginatedResponse } from '@/types';

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  website?: string;
  avatarUrl?: string;
}

export interface AdminUserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export const userService = {
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const res = await apiClient.patch<User>('/users/me', data);
    return res.data;
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await apiClient.post<{ avatarUrl: string }>('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/users/me/change-password', { currentPassword, newPassword });
  },

  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/users/me');
  },

  // Admin
  adminGetUsers: async (filters?: AdminUserFilters): Promise<PaginatedResponse<User>> => {
    const res = await apiClient.get<PaginatedResponse<User>>('/admin/users', { params: filters });
    return res.data;
  },

  adminUpdateUserRole: async (userId: string, role: string): Promise<User> => {
    const res = await apiClient.patch<User>(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  adminSuspendUser: async (userId: string): Promise<void> => {
    await apiClient.post(`/admin/users/${userId}/suspend`);
  },

  adminReactivateUser: async (userId: string): Promise<void> => {
    await apiClient.post(`/admin/users/${userId}/reactivate`);
  },
};
