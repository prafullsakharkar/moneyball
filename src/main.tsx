import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/components/ui/Toast';
import App from '@/App';
import '@/index.css';
import { startMockServer } from './mocks';

// ─── CONFIGURE QUERY CLIENT ────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// ─── REGISTER SERVICE WORKER (PWA) ────────────────────────────────────────────────
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((registrationError) => {
        console.error('SW registration failed:', registrationError);
      });
  });
}

// ─── INIT MOCK SERVER (DEV ONLY) ───────────────────────────────────────────────────
if (import.meta.env.DEV) {
  startMockServer().then(() => {
    console.log('[MSW] Mock server started');
  }).catch((err) => {
    console.error('[MSW] Failed to start:', err);
  });
}

// ─── RENDER APP ────────────────────────────────────────────────────────────────────
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
