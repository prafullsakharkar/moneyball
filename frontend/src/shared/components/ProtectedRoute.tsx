import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '@providers/AuthProvider';
import { useAuthStore } from '@stores/authStore';
import type { UserRole } from '@domain/index';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  requireEmailVerified?: boolean;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, requiredRoles, requireEmailVerified = false, fallback }: ProtectedRouteProps) {
  const { isInitialized, isAuthenticated } = useAuth();
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!isInitialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requireEmailVerified && user && !user.emailVerified) {
    return <Navigate to="/auth/verify-email" state={{ email: user.email }} replace />;
  }

  if (requiredRoles && user) {
    const payload = useAuthStore.getState().getTokenPayload();
    const userRole = payload?.role;
    if (userRole && !requiredRoles.includes(userRole)) {
      if (fallback) return <>{fallback}</>;
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
