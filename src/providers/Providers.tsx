import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { AuthInitializer } from './AuthInitializer';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: '0.75rem',
            border: '1px solid var(--color-border)',
            background: 'var(--color-popover)',
            color: 'var(--color-popover-foreground)',
          },
        }}
      />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
