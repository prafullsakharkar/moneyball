import React from 'react';
import { createBrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../layouts/Layout';

// Tournament standings page
import TournamentStandings from '../pages/TournamentStandings';

// Public pages (to be moved to features/dashboard/pages)
import Dashboard from '../pages/Dashboard';
import Welcome from '../pages/Welcome';
import TournamentList from '../pages/Tournaments';
import TournamentAnalyticsPage from '../pages/TournamentAnalytics';
import TeamList from '../pages/Teams';
import TeamAnalyticsPage from '../pages/TeamAnalytics';
import PlayerList from '../pages/Players';
import PlayerAnalyticsPage from '../pages/PlayerAnalytics';
import CaptainDashboard from '../pages/Captains';
import CaptainAnalyticsPage from '../pages/CaptainAnalytics';
import MatchCenter from '../pages/Matches';
import MatchAnalyticsPage from '../pages/MatchAnalytics';
import H2HAnalytics from '../pages/H2H';
import H2HAnalyticsDetailedPage from '../pages/H2HAnalyticsDetailed';
import OrangeCap from '../pages/Awards';
import AwardsLeaderboardsPage from '../pages/AwardsLeaderboards';
import MVPFantasyPage from '../pages/MVPFantasy';
import AIAnalytics from '../pages/AI';
import AIInsightsPage from '../pages/AIInsights';
import Predictions from '../pages/Predictions';
import PredictionsEnhancedPage from '../pages/PredictionsEnhanced';

// Fantasy module
import { FantasyAnalytics } from '../features/fantasy';

// Notifications module
import { Notifications } from '../features/notifications';

// Sponsorship module
import { Sponsorship } from '../features/sponsorship';

// Monetization module
import { Monetization } from '../features/monetization';

// Reports page (root level)
import ReportsPage from '../pages/Reports';

// Video Analysis module (moved to features)
import {
  VideoAnalysisDashboard,
  VideoLibrary,
  MatchVideo,
  BallClips,
  ShotTagging,
  PlayerHighlights,
  AIHighlights,
} from '../features/video-analysis';

// Training module (moved to features)
import {
  CoachDashboard,
  PracticeSessions,
  FitnessTracking,
  Attendance,
  PerformanceTracking,
} from '../features/training';

// Academy module (moved to features)
import {
  AcademyDashboard,
  Students,
  Batches,
  Curriculum,
  StudentProgress,
} from '../features/academy';

// Auction module (moved to features)
import {
  AuctionDashboard,
  AuctionRoom,
  PlayerPool,
  BudgetTracker,
} from '../features/auction';

// Admin pages
import AdminDashboard from '../pages/Admin';
import AdminAnalyticsPage from '../pages/AdminAnalytics';
import AdminPortal from '../pages/AdminPortal';
import TournamentManagement from '../pages/admin/TournamentManagement';
import TournamentDetail from '../pages/admin/TournamentDetail';
import TeamManagement from '../pages/admin/TeamManagement';
import PlayerManagement from '../pages/admin/PlayerManagement';
import MatchManagement from '../pages/admin/MatchManagement';
import LiveScoring from '../pages/admin/LiveScoring';
import ImportCenter from '../pages/admin/ImportCenter';
import UserManagement from '../pages/admin/UserManagement';
import AuditLogs from '../pages/admin/AuditLogs';
import VenueManagement from '../pages/admin/VenueManagement';
import MatchOfficials from '../pages/admin/MatchOfficials';
import ScorecardManagement from '../pages/admin/ScorecardManagement';
import SquadManagement from '../pages/admin/SquadManagement';
import LeaderboardManagement from '../pages/admin/LeaderboardManagement';
import StreamingDetails from '../pages/admin/StreamingDetails';
import OrganizerManagement from '../pages/admin/OrganizerManagement';
import Reports from '../pages/admin/Reports';
import BallByBallScoring from '../pages/admin/BallByBallScoring';
import LiveDashboard from '../pages/admin/LiveDashboard';
import Insights from '../pages/admin/Insights';
import PlayerAnalyticsDashboard from '../pages/admin/PlayerAnalyticsDashboard';
import TeamAnalyticsDashboard from '../pages/admin/TeamAnalyticsDashboard';
import MatchAnalyticsDashboard from '../pages/admin/MatchAnalyticsDashboard';
import TournamentAnalyticsDashboard from '../pages/admin/TournamentAnalyticsDashboard';
import BatterInsights from '../pages/admin/BatterInsights';
import BowlerInsights from '../pages/admin/BowlerInsights';
import MVPAnalytics from '../pages/admin/MVPAnalytics';
import CaptainAnalyticsDashboard from '../pages/admin/CaptainAnalyticsDashboard';
import VenueAnalyticsDashboard from '../pages/admin/VenueAnalyticsDashboard';
import MoneyballAnalytics from '../pages/admin/MoneyballAnalytics';

interface LayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = React.useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );

  return <Layout activePath={location.pathname} onNavigate={handleNavigate}>{children}</Layout>;
}

function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">404</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Page not found</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout>
        <Welcome />
      </AppLayout>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <AppLayout>
        <Dashboard />
      </AppLayout>
    ),
  },
  {
    path: '/tournaments',
    element: (
      <AppLayout>
        <TournamentList />
      </AppLayout>
    ),
  },
  {
    path: '/tournaments/analytics',
    element: (
      <AppLayout>
        <TournamentAnalyticsPage />
      </AppLayout>
    ),
  },
  {
    path: '/tournaments/standings',
    element: (
      <AppLayout>
        <TournamentStandings />
      </AppLayout>
    ),
  },
  {
    path: '/teams',
    element: (
      <AppLayout>
        <TeamList />
      </AppLayout>
    ),
  },
  {
    path: '/teams/analytics',
    element: (
      <AppLayout>
        <TeamAnalyticsPage />
      </AppLayout>
    ),
  },
  {
    path: '/players',
    element: (
      <AppLayout>
        <PlayerList />
      </AppLayout>
    ),
  },
  {
    path: '/players/analytics',
    element: (
      <AppLayout>
        <PlayerAnalyticsPage />
      </AppLayout>
    ),
  },
  {
    path: '/captains',
    element: (
      <AppLayout>
        <CaptainDashboard />
      </AppLayout>
    ),
  },
  {
    path: '/captains/analytics',
    element: (
      <AppLayout>
        <CaptainAnalyticsPage />
      </AppLayout>
    ),
  },
  {
    path: '/matches',
    element: (
      <AppLayout>
        <MatchCenter />
      </AppLayout>
    ),
  },
  {
    path: '/matches/analytics',
    element: (
      <AppLayout>
        <MatchAnalyticsPage />
      </AppLayout>
    ),
  },
  {
    path: '/h2h',
    element: (
      <AppLayout>
        <H2HAnalytics />
      </AppLayout>
    ),
  },
  {
    path: '/h2h/analytics',
    element: (
      <AppLayout>
        <H2HAnalyticsDetailedPage />
      </AppLayout>
    ),
  },
  {
    path: '/awards',
    element: (
      <AppLayout>
        <OrangeCap />
      </AppLayout>
    ),
  },
  {
    path: '/awards/leaderboards',
    element: (
      <AppLayout>
        <AwardsLeaderboardsPage />
      </AppLayout>
    ),
  },
  {
    path: '/mvp',
    element: (
      <AppLayout>
        <MVPFantasyPage />
      </AppLayout>
    ),
  },
  {
    path: '/ai',
    element: (
      <AppLayout>
        <AIAnalytics />
      </AppLayout>
    ),
  },
  {
    path: '/ai/insights',
    element: (
      <AppLayout>
        <AIInsightsPage />
      </AppLayout>
    ),
  },
  {
    path: '/predictions',
    element: (
      <AppLayout>
        <Predictions />
      </AppLayout>
    ),
  },
  {
    path: '/predictions/detailed',
    element: (
      <AppLayout>
        <PredictionsEnhancedPage />
      </AppLayout>
    ),
  },
  // Fantasy module
  {
    path: '/fantasy/analytics',
    element: (
      <AppLayout>
        <FantasyAnalytics />
      </AppLayout>
    ),
  },
  // Notifications module
  {
    path: '/notifications',
    element: (
      <AppLayout>
        <Notifications />
      </AppLayout>
    ),
  },
  // Sponsorship module
  {
    path: '/sponsorship',
    element: (
      <AppLayout>
        <Sponsorship />
      </AppLayout>
    ),
  },
  // Monetization module
  {
    path: '/monetization',
    element: (
      <AppLayout>
        <Monetization />
      </AppLayout>
    ),
  },
  // Reports (root level)
  {
    path: '/reports',
    element: (
      <AppLayout>
        <ReportsPage />
      </AppLayout>
    ),
  },
  // Video Analysis module
  {
    path: '/video-analysis',
    element: (
      <AppLayout>
        <VideoAnalysisDashboard />
      </AppLayout>
    ),
  },
  {
    path: '/video-analysis/videos',
    element: (
      <AppLayout>
        <VideoLibrary />
      </AppLayout>
    ),
  },
  {
    path: '/video-analysis/match/:id',
    element: (
      <AppLayout>
        <MatchVideo />
      </AppLayout>
    ),
  },
  {
    path: '/video-analysis/clips',
    element: (
      <AppLayout>
        <BallClips />
      </AppLayout>
    ),
  },
  {
    path: '/video-analysis/tagging',
    element: (
      <AppLayout>
        <ShotTagging />
      </AppLayout>
    ),
  },
  {
    path: '/video-analysis/highlights',
    element: (
      <AppLayout>
        <PlayerHighlights />
      </AppLayout>
    ),
  },
  {
    path: '/video-analysis/ai',
    element: (
      <AppLayout>
        <AIHighlights />
      </AppLayout>
    ),
  },
  // Training module
  {
    path: '/training',
    element: (
      <AppLayout>
        <CoachDashboard />
      </AppLayout>
    ),
  },
  {
    path: '/training/sessions',
    element: (
      <AppLayout>
        <PracticeSessions />
      </AppLayout>
    ),
  },
  {
    path: '/training/fitness',
    element: (
      <AppLayout>
        <FitnessTracking />
      </AppLayout>
    ),
  },
  {
    path: '/training/attendance',
    element: (
      <AppLayout>
        <Attendance />
      </AppLayout>
    ),
  },
  {
    path: '/training/performance',
    element: (
      <AppLayout>
        <PerformanceTracking />
      </AppLayout>
    ),
  },
  // Academy
  {
    path: '/academy',
    element: (
      <AppLayout>
        <AcademyDashboard />
      </AppLayout>
    ),
  },
  {
    path: '/academy/students',
    element: (
      <AppLayout>
        <Students />
      </AppLayout>
    ),
  },
  {
    path: '/academy/batches',
    element: (
      <AppLayout>
        <Batches />
      </AppLayout>
    ),
  },
  {
    path: '/academy/curriculum',
    element: (
      <AppLayout>
        <Curriculum />
      </AppLayout>
    ),
  },
  {
    path: '/academy/progress',
    element: (
      <AppLayout>
        <StudentProgress />
      </AppLayout>
    ),
  },
  // Auction
  {
    path: '/auction',
    element: (
      <AppLayout>
        <AuctionDashboard />
      </AppLayout>
    ),
  },
  {
    path: '/auction/room',
    element: (
      <AppLayout>
        <AuctionRoom />
      </AppLayout>
    ),
  },
  {
    path: '/auction/players',
    element: (
      <AppLayout>
        <PlayerPool />
      </AppLayout>
    ),
  },
  {
    path: '/auction/budget',
    element: (
      <AppLayout>
        <BudgetTracker />
      </AppLayout>
    ),
  },
  // Admin
  {
    path: '/admin',
    element: (
      <AppLayout>
        <AdminDashboard />
      </AppLayout>
    ),
  },
  {
    path: '/admin/analytics',
    element: (
      <AppLayout>
        <AdminAnalyticsPage />
      </AppLayout>
    ),
  },
  {
    path: '/admin/portal',
    element: (
      <AppLayout>
        <AdminPortal />
      </AppLayout>
    ),
  },
  {
    path: '/admin/live-dashboard',
    element: (
      <AppLayout>
        <LiveDashboard />
      </AppLayout>
    ),
  },
  {
    path: '/admin/tournaments',
    element: (
      <AppLayout>
        <TournamentManagement />
      </AppLayout>
    ),
  },
  {
    path: '/admin/tournaments/:id',
    element: (
      <AppLayout>
        <TournamentDetail />
      </AppLayout>
    ),
  },
  {
    path: '/admin/teams',
    element: (
      <AppLayout>
        <TeamManagement />
      </AppLayout>
    ),
  },
  {
    path: '/admin/players',
    element: (
      <AppLayout>
        <PlayerManagement />
      </AppLayout>
    ),
  },
  {
    path: '/admin/squads',
    element: (
      <AppLayout>
        <SquadManagement />
      </AppLayout>
    ),
  },
  {
    path: '/admin/venues',
    element: (
      <AppLayout>
        <VenueManagement />
      </AppLayout>
    ),
  },
  {
    path: '/admin/organizers',
    element: (
      <AppLayout>
        <OrganizerManagement />
      </AppLayout>
    ),
  },
  {
    path: '/admin/matches',
    element: (
      <AppLayout>
        <MatchManagement />
      </AppLayout>
    ),
  },
  {
    path: '/admin/officials',
    element: (
      <AppLayout>
        <MatchOfficials />
      </AppLayout>
    ),
  },
  {
    path: '/admin/scoring',
    element: (
      <AppLayout>
        <LiveScoring />
      </AppLayout>
    ),
  },
  {
    path: '/admin/ball-by-ball',
    element: (
      <AppLayout>
        <BallByBallScoring />
      </AppLayout>
    ),
  },
  {
    path: '/admin/scorecards',
    element: (
      <AppLayout>
        <ScorecardManagement />
      </AppLayout>
    ),
  },
  {
    path: '/admin/streaming',
    element: (
      <AppLayout>
        <StreamingDetails />
      </AppLayout>
    ),
  },
  {
    path: '/admin/insights',
    element: (
      <AppLayout>
        <Insights />
      </AppLayout>
    ),
  },
  {
    path: '/admin/player-analytics',
    element: (
      <AppLayout>
        <PlayerAnalyticsDashboard />
      </AppLayout>
    ),
  },
  {
    path: '/admin/team-analytics',
    element: (
      <AppLayout>
        <TeamAnalyticsDashboard />
      </AppLayout>
    ),
  },
  {
    path: '/admin/match-analytics/:id?',
    element: (
      <AppLayout>
        <MatchAnalyticsDashboard />
      </AppLayout>
    ),
  },
  {
    path: '/admin/tournament-dashboard',
    element: (
      <AppLayout>
        <TournamentAnalyticsDashboard />
      </AppLayout>
    ),
  },
  {
    path: '/admin/batter-insights',
    element: (
      <AppLayout>
        <BatterInsights />
      </AppLayout>
    ),
  },
  {
    path: '/admin/bowler-insights',
    element: (
      <AppLayout>
        <BowlerInsights />
      </AppLayout>
    ),
  },
  {
    path: '/admin/mvp-analytics',
    element: (
      <AppLayout>
        <MVPAnalytics />
      </AppLayout>
    ),
  },
  {
    path: '/admin/captain-analytics',
    element: (
      <AppLayout>
        <CaptainAnalyticsDashboard />
      </AppLayout>
    ),
  },
  {
    path: '/admin/venue-analytics',
    element: (
      <AppLayout>
        <VenueAnalyticsDashboard />
      </AppLayout>
    ),
  },
  {
    path: '/admin/moneyball',
    element: (
      <AppLayout>
        <MoneyballAnalytics />
      </AppLayout>
    ),
  },
  {
    path: '/admin/leaderboards',
    element: (
      <AppLayout>
        <LeaderboardManagement />
      </AppLayout>
    ),
  },
  {
    path: '/admin/reports',
    element: (
      <AppLayout>
        <Reports />
      </AppLayout>
    ),
  },
  {
    path: '/admin/import',
    element: (
      <AppLayout>
        <ImportCenter />
      </AppLayout>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <AppLayout>
        <UserManagement />
      </AppLayout>
    ),
  },
  {
    path: '/admin/audit',
    element: (
      <AppLayout>
        <AuditLogs />
      </AppLayout>
    ),
  },
  {
    path: '*',
    element: (
      <AppLayout>
        <NotFound />
      </AppLayout>
    ),
  },
]);

export default router;