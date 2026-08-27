import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@layouts/AppShell';
import { AuthLayout } from '@layouts/AuthLayout';
import { ErrorBoundary } from '@providers/ErrorBoundary';
import { ProtectedRoute } from '@shared/components/ProtectedRoute';
import { GuestRoute } from '@shared/components/GuestRoute';
import { CircularProgress, Box, Typography } from '@mui/material';

const HomePage = lazy(() => import('../pages/HomePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('../pages/VerifyEmailPage'));
const OrganizationListPage = lazy(() => import('../pages/organizations/OrganizationListPage'));
const OrganizationDetailPage = lazy(() => import('../pages/organizations/OrganizationDetailPage'));
const PlayersPage = lazy(() => import('../pages/players/PlayersPage'));
const PlayerWorkspacePage = lazy(() => import('../pages/players/PlayerWorkspacePage'));
const MatchCenterPage = lazy(() => import('../pages/matches/MatchCenterPage'));
const TeamWorkspacePage = lazy(() => import('../pages/teams/TeamWorkspacePage'));
const TournamentWorkspacePage = lazy(() => import('../pages/tournaments/TournamentWorkspacePage'));
const AnalyticsWorkspacePage = lazy(() => import('../pages/analytics/AnalyticsWorkspacePage'));
const AiWorkspacePage = lazy(() => import('../pages/ai/AiWorkspacePage'));
const MediaWorkspacePage = lazy(() => import('../pages/media/MediaWorkspacePage'));
const VideoAnalysisPage = lazy(() => import('../pages/video/VideoAnalysisPage'));

function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

/** Placeholder for domain routes that are not yet implemented. */
function Placeholder({ title }: { title: string }) {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">Coming soon</Typography>
    </Box>
  );
}

/** Domain placeholder routes rendered inside the AppShell. */
const DOMAIN_PLACEHOLDERS: { path: string; title: string }[] = [
  { path: 'leagues', title: 'Leagues' },
  { path: 'seasons', title: 'Seasons' },
  { path: 'fixtures', title: 'Fixtures' },
  { path: 'scoring', title: 'Scoring' },
  { path: 'officials', title: 'Officials' },
  { path: 'squads', title: 'Squads' },
  { path: 'coaches', title: 'Coaches' },
  { path: 'staff', title: 'Staff' },
  { path: 'selectors', title: 'Selectors' },
  { path: 'academy', title: 'Academy' },
  { path: 'fitness', title: 'Fitness' },
  { path: 'medical', title: 'Medical' },
  { path: 'performance', title: 'Performance' },
  { path: 'scouting', title: 'Scouting' },
  { path: 'grounds', title: 'Grounds' },
  { path: 'facilities', title: 'Facilities' },
  { path: 'equipment', title: 'Equipment' },
  { path: 'inventory', title: 'Inventory' },
  { path: 'devices', title: 'Devices' },
  { path: 'maintenance', title: 'Maintenance' },
  { path: 'streaming', title: 'Streaming' },
  { path: 'gallery', title: 'Gallery' },
  { path: 'cms', title: 'CMS' },
  { path: 'statistics', title: 'Statistics' },
  { path: 'reports', title: 'Reports' },
  { path: 'search', title: 'Search' },
  { path: 'membership', title: 'Membership' },
  { path: 'sponsorship', title: 'Sponsorship' },
  { path: 'ticketing', title: 'Ticketing' },
  { path: 'marketplace', title: 'Marketplace' },
  { path: 'merchandise', title: 'Merchandise' },
  { path: 'billing', title: 'Billing' },
  { path: 'finance', title: 'Finance' },
  { path: 'fantasy', title: 'Fantasy' },
  { path: 'rewards', title: 'Rewards' },
  { path: 'loyalty', title: 'Loyalty' },
  { path: 'community', title: 'Community' },
  { path: 'engagement', title: 'Engagement' },
  { path: 'notifications', title: 'Notifications' },
  { path: 'workflow', title: 'Workflow' },
  { path: 'integrations', title: 'Integrations' },
  { path: 'documents', title: 'Documents' },
  { path: 'calendar', title: 'Calendar' },
  { path: 'events', title: 'Events' },
  { path: 'whitelabel', title: 'Whitelabel' },
  { path: 'help', title: 'Help' },
];

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

      /* Existing domain routes */
      { path: 'players', element: <PageSuspense><PlayersPage /></PageSuspense> },
      { path: 'players/:playerId', element: <PageSuspense><PlayerWorkspacePage /></PageSuspense> },
      { path: 'teams', element: <PageSuspense><TeamWorkspacePage /></PageSuspense> },
      { path: 'teams/:teamId', element: <PageSuspense><TeamWorkspacePage /></PageSuspense> },
      { path: 'matches', element: <PageSuspense><MatchCenterPage /></PageSuspense> },
      { path: 'tournaments', element: <PageSuspense><TournamentWorkspacePage /></PageSuspense> },
      { path: 'tournaments/:tournamentId', element: <PageSuspense><TournamentWorkspacePage /></PageSuspense> },
      { path: 'competitions', element: <PageSuspense><Placeholder title="Competitions" /></PageSuspense> },
      { path: 'analytics', element: <PageSuspense><AnalyticsWorkspacePage /></PageSuspense> },
      { path: 'ai', element: <PageSuspense><AiWorkspacePage /></PageSuspense> },
      { path: 'media', element: <PageSuspense><MediaWorkspacePage /></PageSuspense> },
      { path: 'video', element: <PageSuspense><VideoAnalysisPage /></PageSuspense> },
      { path: 'training', element: <PageSuspense><Placeholder title="Training" /></PageSuspense> },
      { path: 'settings', element: <PageSuspense><Placeholder title="Settings" /></PageSuspense> },

      /* New domain placeholder routes */
      ...DOMAIN_PLACEHOLDERS.map(({ path, title }) => ({
        path,
        element: <PageSuspense><Placeholder title={title} /></PageSuspense>,
      })),
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
