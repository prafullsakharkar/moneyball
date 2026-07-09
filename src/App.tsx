import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';

// Public pages
import Dashboard from './pages/Dashboard';
import TournamentList from './pages/Tournaments';
import TournamentAnalyticsPage from './pages/TournamentAnalytics';
import TeamList from './pages/Teams';
import TeamAnalyticsPage from './pages/TeamAnalytics';
import PlayerList from './pages/Players';
import PlayerAnalyticsPage from './pages/PlayerAnalytics';
import CaptainDashboard from './pages/Captains';
import CaptainAnalyticsPage from './pages/CaptainAnalytics';
import MatchCenter from './pages/Matches';
import MatchAnalyticsPage from './pages/MatchAnalytics';
import H2HAnalytics from './pages/H2H';
import H2HAnalyticsDetailedPage from './pages/H2HAnalyticsDetailed';
import OrangeCap from './pages/Awards';
import AwardsLeaderboardsPage from './pages/AwardsLeaderboards';
import MVPFantasyPage from './pages/MVPFantasy';
import AIAnalytics from './pages/AI';
import AIInsightsPage from './pages/AIInsights';
import Predictions from './pages/Predictions';
import PredictionsEnhancedPage from './pages/PredictionsEnhanced';

// Video Analysis module
import {
  VideoAnalysisDashboard,
  VideoLibrary,
  MatchVideo,
  BallClips,
  ShotTagging,
  PlayerHighlights,
  AIHighlights,
} from './modules/video-analysis';

// Training module
import {
  CoachDashboard,
  PracticeSessions,
  FitnessTracking,
  Attendance,
  PerformanceTracking,
} from './modules/training';

// Academy module
import {
  AcademyDashboard,
  Students,
  Batches,
  Curriculum,
  StudentProgress,
} from './modules/academy';

// Auction module
import {
  AuctionDashboard,
  AuctionRoom,
  PlayerPool,
  BudgetTracker,
} from './modules/auction';

// Admin pages
import AdminDashboard from './pages/Admin';
import AdminAnalyticsPage from './pages/AdminAnalytics';
import AdminPortal from './pages/AdminPortal';
import TournamentManagement from './pages/admin/TournamentManagement';
import TournamentDetail from './pages/admin/TournamentDetail';
import TeamManagement from './pages/admin/TeamManagement';
import PlayerManagement from './pages/admin/PlayerManagement';
import MatchManagement from './pages/admin/MatchManagement';
import LiveScoring from './pages/admin/LiveScoring';
import ImportCenter from './pages/admin/ImportCenter';
import UserManagement from './pages/admin/UserManagement';
import AuditLogs from './pages/admin/AuditLogs';
import VenueManagement from './pages/admin/VenueManagement';
import MatchOfficials from './pages/admin/MatchOfficials';
import ScorecardManagement from './pages/admin/ScorecardManagement';
import SquadManagement from './pages/admin/SquadManagement';
import LeaderboardManagement from './pages/admin/LeaderboardManagement';
import StreamingDetails from './pages/admin/StreamingDetails';
import OrganizerManagement from './pages/admin/OrganizerManagement';
import Reports from './pages/admin/Reports';
import BallByBallScoring from './pages/admin/BallByBallScoring';
import LiveDashboard from './pages/admin/LiveDashboard';
import Insights from './pages/admin/Insights';
import PlayerAnalyticsDashboard from './pages/admin/PlayerAnalyticsDashboard';
import TeamAnalyticsDashboard from './pages/admin/TeamAnalyticsDashboard';
import MatchAnalyticsDashboard from './pages/admin/MatchAnalyticsDashboard';
import TournamentAnalyticsDashboard from './pages/admin/TournamentAnalyticsDashboard';
import BatterInsights from './pages/admin/BatterInsights';
import BowlerInsights from './pages/admin/BowlerInsights';
import MVPAnalytics from './pages/admin/MVPAnalytics';
import CaptainAnalyticsDashboard from './pages/admin/CaptainAnalyticsDashboard';
import VenueAnalyticsDashboard from './pages/admin/VenueAnalyticsDashboard';
import MoneyballAnalytics from './pages/admin/MoneyballAnalytics';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } },
});

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

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout activePath={location.pathname} onNavigate={navigate}>
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/tournaments" element={<TournamentList />} />
        <Route path="/tournaments/analytics" element={<TournamentAnalyticsPage />} />
        <Route path="/teams" element={<TeamList />} />
        <Route path="/teams/analytics" element={<TeamAnalyticsPage />} />
        <Route path="/players" element={<PlayerList />} />
        <Route path="/players/analytics" element={<PlayerAnalyticsPage />} />
        <Route path="/captains" element={<CaptainDashboard />} />
        <Route path="/captains/analytics" element={<CaptainAnalyticsPage />} />
        <Route path="/matches" element={<MatchCenter />} />
        <Route path="/matches/analytics" element={<MatchAnalyticsPage />} />
        <Route path="/h2h" element={<H2HAnalytics />} />
        <Route path="/h2h/analytics" element={<H2HAnalyticsDetailedPage />} />
        <Route path="/awards" element={<OrangeCap />} />
        <Route path="/awards/leaderboards" element={<AwardsLeaderboardsPage />} />
        <Route path="/mvp" element={<MVPFantasyPage />} />
        <Route path="/ai" element={<AIAnalytics />} />
        <Route path="/ai/insights" element={<AIInsightsPage />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/predictions/detailed" element={<PredictionsEnhancedPage />} />

        {/* Video Analysis module */}
        <Route path="/video-analysis" element={<VideoAnalysisDashboard />} />
        <Route path="/video-analysis/videos" element={<VideoLibrary />} />
        <Route path="/video-analysis/match/:id" element={<MatchVideo />} />
        <Route path="/video-analysis/clips" element={<BallClips />} />
        <Route path="/video-analysis/tagging" element={<ShotTagging />} />
        <Route path="/video-analysis/highlights" element={<PlayerHighlights />} />
        <Route path="/video-analysis/ai" element={<AIHighlights />} />

        {/* Training module */}
        <Route path="/training" element={<CoachDashboard />} />
        <Route path="/training/sessions" element={<PracticeSessions />} />
        <Route path="/training/fitness" element={<FitnessTracking />} />
        <Route path="/training/attendance" element={<Attendance />} />
        <Route path="/training/performance" element={<PerformanceTracking />} />
        {/* Academy */}
        <Route path="/academy" element={<AcademyDashboard />} />
        <Route path="/academy/students" element={<Students />} />
        <Route path="/academy/batches" element={<Batches />} />
        <Route path="/academy/curriculum" element={<Curriculum />} />
        <Route path="/academy/progress" element={<StudentProgress />} />
        {/* Auction */}
        <Route path="/auction" element={<AuctionDashboard />} />
        <Route path="/auction/room" element={<AuctionRoom />} />
        <Route path="/auction/players" element={<PlayerPool />} />
        <Route path="/auction/budget" element={<BudgetTracker />} />

        {/* ── Admin ── */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        <Route path="/admin/portal" element={<AdminPortal />} />
        <Route path="/admin/live-dashboard" element={<LiveDashboard />} />
        <Route path="/admin/tournaments" element={<TournamentManagement />} />
        <Route path="/admin/tournaments/:id" element={<TournamentDetail />} />
        <Route path="/admin/teams" element={<TeamManagement />} />
        <Route path="/admin/players" element={<PlayerManagement />} />
        <Route path="/admin/squads" element={<SquadManagement />} />
        <Route path="/admin/venues" element={<VenueManagement />} />
        <Route path="/admin/organizers" element={<OrganizerManagement />} />
        <Route path="/admin/matches" element={<MatchManagement />} />
        <Route path="/admin/officials" element={<MatchOfficials />} />
        <Route path="/admin/scoring" element={<LiveScoring />} />
        <Route path="/admin/ball-by-ball" element={<BallByBallScoring />} />
        <Route path="/admin/scorecards" element={<ScorecardManagement />} />
        <Route path="/admin/streaming" element={<StreamingDetails />} />
        <Route path="/admin/insights" element={<Insights />} />
        <Route path="/admin/player-analytics" element={<PlayerAnalyticsDashboard />} />
        <Route path="/admin/team-analytics" element={<TeamAnalyticsDashboard />} />
        <Route path="/admin/match-analytics/:id?" element={<MatchAnalyticsDashboard />} />
        <Route path="/admin/tournament-dashboard" element={<TournamentAnalyticsDashboard />} />
        <Route path="/admin/batter-insights" element={<BatterInsights />} />
        <Route path="/admin/bowler-insights" element={<BowlerInsights />} />
        <Route path="/admin/mvp-analytics" element={<MVPAnalytics />} />
        <Route path="/admin/captain-analytics" element={<CaptainAnalyticsDashboard />} />
        <Route path="/admin/venue-analytics" element={<VenueAnalyticsDashboard />} />
        <Route path="/admin/moneyball" element={<MoneyballAnalytics />} />
        <Route path="/admin/leaderboards" element={<LeaderboardManagement />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/import" element={<ImportCenter />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/audit" element={<AuditLogs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
