import React from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { AuthProvider } from '../shared/context/AuthContext';
import { ThemeProvider } from '../shared/context/ThemeContext';
import { ToastProvider } from '../shared/context/ToastContext';
import { ModalProvider } from '../shared/context/ModalContext';
import { LoadingProvider } from '../shared/context/LoadingContext';
import { PermissionProvider } from '../shared/context/PermissionContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PermissionProvider>
            <ThemeProvider>
              <ToastProvider>
                <ModalProvider>
                  <LoadingProvider>
                    <RouterProvider router={router} />
                  </LoadingProvider>
                </ModalProvider>
              </ToastProvider>
            </ThemeProvider>
          </PermissionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;