import { type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider as CricketThemeProvider, useTheme } from './ThemeProvider';
import { ErrorBoundary } from './ErrorBoundary';
import { AuthProvider } from './AuthProvider';
import { OrganizationProvider } from './OrganizationProvider';
import { ToastProvider } from '@shared/components/feedback';
import { queryClient } from '@core/queryClient';
import { lightTheme, darkTheme } from '@core/theme';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Inner provider that reads the resolved theme and passes the correct MUI theme.
 */
function MuiThemeBridge({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const muiTheme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

/**
 * Top-level provider composition.
 * Order matters: ErrorBoundary wraps everything, QueryClient must be before AuthProvider.
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorBoundary>
      <CricketThemeProvider>
        <MuiThemeBridge>
          <MotionConfig reducedMotion="user">
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <OrganizationProvider>
                  <ToastProvider>
                    {children}
                  </ToastProvider>
                </OrganizationProvider>
              </AuthProvider>
            </QueryClientProvider>
          </MotionConfig>
        </MuiThemeBridge>
      </CricketThemeProvider>
    </ErrorBoundary>
  );
}
