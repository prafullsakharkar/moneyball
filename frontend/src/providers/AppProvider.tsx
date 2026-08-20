import { type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider as CricketThemeProvider, useTheme } from './ThemeProvider';
import { ErrorBoundary } from './ErrorBoundary';
import { AuthProvider } from './AuthProvider';
import { queryClient } from '@core/queryClient';
import { lightTheme, darkTheme } from '@design/theme';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto-mono/400.css';

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
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryClientProvider>
        </MuiThemeBridge>
      </CricketThemeProvider>
    </ErrorBoundary>
  );
}
