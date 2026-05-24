import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/globals.css';
import { Providers } from '@/providers/Providers';
import { AppRouter } from '@/app/routes/AppRouter';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <Providers>
      <AppRouter />
    </Providers>
  </StrictMode>
);
