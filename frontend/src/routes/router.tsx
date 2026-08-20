import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@layouts/AppShell';
import { AuthLayout } from '@layouts/AuthLayout';
import { ErrorBoundary } from '@providers/ErrorBoundary';
import { ProtectedRoute } from '@shared/components/ProtectedRoute';
import { GuestRoute } from '@shared/components/GuestRoute';
import { CircularProgress, Box } from '@mui/material';

const HomePage = lazy(() => import('../pages/HomePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('../pages/VerifyEmailPage'));
const OrganizationListPage = lazy(() => import('../pages/organizations/OrganizationListPage'));
const OrganizationDetailPage = lazy(() => import('../pages/organizations/OrganizationDetailPage'));

function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  /* ── Protected Routes (authenticated) ─────────────────── */
  {
    path: '/',
    element: <ProtectedRoute><AppShell /></ProtectedRoute>,
    children: [
      { index: true, element: <PageSuspense><HomePage /></PageSuspense> },

      /* Organization routes */
      { path: 'organizations', element: <PageSuspense><OrganizationListPage /></PageSuspense> },
      { path: 'organizations/:orgId', element: <PageSuspense><OrganizationDetailPage /></PageSuspense> },

      /* Domain placeholder routes */
      { path: 'players', element: <PageSuspense><Box sx={{ py: 4 }}><h2>Players</h2><p>Coming soon</p></Box></PageSuspense> },
      { path: 'teams', element: <PageSuspense><Box sx={{ py: 4 }}><h2>Teams</h2><p>Coming soon</p></Box></PageSuspense> },
      { path: 'matches', element: <PageSuspense><Box sx={{ py: 4 }}><h2>Matches</h2><p>Coming soon</p></Box></PageSuspense> },
      { path: 'competitions', element: <PageSuspense><Box sx={{ py: 4 }}><h2>Competitions</h2><p>Coming soon</p></Box></PageSuspense> },
      { path: 'analytics', element: <PageSuspense><Box sx={{ py: 4 }}><h2>Analytics</h2><p>Coming soon</p></Box></PageSuspense> },
      { path: 'training', element: <PageSuspense><Box sx={{ py: 4 }}><h2>Training</h2><p>Coming soon</p></Box></PageSuspense> },
      { path: 'settings', element: <PageSuspense><Box sx={{ py: 4 }}><h2>Settings</h2><p>Coming soon</p></Box></PageSuspense> },
    ],
  },

  /* ── Guest Routes (unauthenticated only) ──────────────── */
  {
    path: '/auth',
    element: <GuestRoute><AuthLayout /></GuestRoute>,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login', element: <PageSuspense><LoginPage /></PageSuspense> },
      { path: 'register', element: <PageSuspense><RegisterPage /></PageSuspense> },
      { path: 'forgot-password', element: <PageSuspense><ForgotPasswordPage /></PageSuspense> },
      { path: 'reset-password', element: <PageSuspense><ResetPasswordPage /></PageSuspense> },
      { path: 'verify-email', element: <PageSuspense><VerifyEmailPage /></PageSuspense> },
    ],
  },

  /* ── Public Routes ────────────────────────────────────── */
  { path: '*', element: <PageSuspense><NotFoundPage /></PageSuspense> },
]);
