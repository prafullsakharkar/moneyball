import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '@providers/AuthProvider';

interface GuestRouteProps {
  children: ReactNode;
  /** Where to redirect authenticated users. Defaults to '/'. */
  redirectTo?: string;
}

/**
 * Restricts access to unauthenticated users only.
 * Authenticated users are redirected away (e.g., from login/register pages).
 */
export function GuestRoute({ children, redirectTo = '/' }: GuestRouteProps) {
  const { isInitialized, isAuthenticated } = useAuth();
  const location = useLocation();

  // Still initializing — show spinner
  if (!isInitialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Already authenticated — redirect away from auth pages
  if (isAuthenticated) {
    // If there's a "from" location in state (e.g., from ProtectedRoute redirect),
    // go there instead of the default
    const from = (location.state as { from?: Location })?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
