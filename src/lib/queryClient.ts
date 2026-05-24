import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error) => {
        const axiosError = error as AxiosError;
        // Don't retry on 401, 403, 404
        if (
          axiosError.response?.status === 401 ||
          axiosError.response?.status === 403 ||
          axiosError.response?.status === 404
        ) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        const message =
          axiosError.response?.data?.message ||
          axiosError.message ||
          'Something went wrong. Please try again.';

        // Don't show toast for auth errors — handled by interceptor
        if (axiosError.response?.status !== 401) {
          toast.error(message);
        }
      },
    },
  },
});
