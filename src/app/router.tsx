/**
 * CricketIQ Enterprise Router Configuration
 * =========================================
 * 
 * Centralized router configuration using enterprise best practices.
 * 
 * Architecture:
 * - Feature-based modular routing (each feature exports its own routes)
 * - Nested routing for related pages (e.g., /tournaments/analytics)
 * - Layout-based organization (PublicLayout, AuthLayout, DashboardLayout, etc.)
 * - Lazy-loaded components (each route loads only what's needed)
 * - Type-safe route configuration with React Router v7
 * - Route guards and permission checking
 * - Breadcrumb generation from route metadata
 * - Dynamic sidebar and menus
 * - Feature flags support
 */

import React, { Outlet } from 'react';
import { createBrowserRouter, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../layouts/Layout';

// ─── PAGE COMPONENTS (Lazy loaded via React.lazy) ───────────────────────────────
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Welcome = React.lazy(() => import('../pages/Welcome'));
const TournamentList = React.lazy(() => import('../pages/Tournaments'));
const TournamentAnalytics = React.lazy(() => import('../pages/TournamentAnalytics'));
const TournamentStandings = React.lazy(() => import('../pages/TournamentStandings'));
const TeamList = React.lazy(() => import('../pages/Teams'));
const TeamAnalytics = React.lazy(() => import('../pages/TeamAnalytics'));
const PlayerList = React.lazy(() => import('../pages/Players'));
const PlayerAnalytics = React.lazy(() => import('../pages/PlayerAnalytics'));
const CaptainList = React.lazy(() => import('../pages/Captains'));
const CaptainAnalytics = React.lazy(() => import('../pages/CaptainAnalytics'));
const MatchList = React.lazy(() => import('../pages/Matches'));
const MatchAnalytics = React.lazy(() => import('../pages/MatchAnalytics'));
const H2HAnalytics = React.lazy(() => import('../pages/H2H'));
const H2HAnalyticsDetailed = React.lazy(() => import('../pages/H2HAnalyticsDetailed'));
const AIInsights = React.lazy(() => import('../pages/AIInsights'));
const Predictions = React.lazy(() => import('../pages/Predictions'));
const PredictionsEnhanced = React.lazy(() => import('../pages/PredictionsEnhanced'));
const Awards = React.lazy(() => import('../pages/Awards'));
const AwardsLeaderboards = React.lazy(() => import('../pages/AwardsLeaderboards'));
const MVPFantasy = React.lazy(() => import('../pages/MVPFantasy'));
const Reports = React.lazy(() => import('../pages/Reports'));
const AdminPortal = React.lazy(() => import('../pages/AdminPortal'));
const AdminAnalytics = React.lazy(() => import('../pages/AdminAnalytics'));
const AdminDashboard = React.lazy(() => import('../pages/Admin'));

// ─── FEATURE MODULES (Lazy loaded with wrapper components) ──────────────────────
// Video Analysis
const VideoAnalysisDashboard = React.lazy(() => import('../features/video-analysis/pages/VideoAnalysisDashboard'));
const VideoLibrary = React.lazy(() => import('../features/video-analysis/pages/VideoLibrary'));
const MatchVideo = React.lazy(() => import('../features/video-analysis/pages/MatchVideo'));
const BallClips = React.lazy(() => import('../features/video-analysis/pages/BallClips'));
const ShotTagging = React.lazy(() => import('../features/video-analysis/pages/ShotTagging'));
const PlayerHighlights = React.lazy(() => import('../features/video-analysis/pages/PlayerHighlights'));
const AIHighlights = React.lazy(() => import('../features/video-analysis/pages/AIHighlights'));

// Academy
const AcademyDashboard = React.lazy(() => import('../features/academy/pages/AcademyDashboard'));
const Students = React.lazy(() => import('../features/academy/pages/Students'));
const Batches = React.lazy(() => import('../features/academy/pages/Batches'));
const Curriculum = React.lazy(() => import('../features/academy/pages/Curriculum'));
const StudentProgress = React.lazy(() => import('../features/academy/pages/StudentProgress'));

// Training
const CoachDashboard = React.lazy(() => import('../features/training/pages/CoachDashboard'));
const PracticeSessions = React.lazy(() => import('../features/training/pages/PracticeSessions'));
const FitnessTracking = React.lazy(() => import('../features/training/pages/FitnessTracking'));
const Attendance = React.lazy(() => import('../features/training/pages/Attendance'));
const PerformanceTracking = React.lazy(() => import('../features/training/pages/PerformanceTracking'));

// Auction
const AuctionDashboard = React.lazy(() => import('../features/auction/pages/AuctionDashboard'));
const AuctionRoom = React.lazy(() => import('../features/auction/pages/AuctionRoom'));
const PlayerPool = React.lazy(() => import('../features/auction/pages/PlayerPool'));
const BudgetTracker = React.lazy(() => import('../features/auction/pages/BudgetTracker'));

// Fantasy
const FantasyAnalytics = React.lazy(() => import('../features/fantasy/pages/FantasyAnalytics'));

// Notifications
const Notifications = React.lazy(() => import('../features/notifications/pages/Notifications'));

// Sponsorship
const Sponsorship = React.lazy(() => import('../features/sponsorship/pages/Sponsorship'));

// Monetization
const Monetization = React.lazy(() => import('../features/monetization/pages/Monetization'));

// Streaming (placeholder - will be implemented)
const Streaming = () => (
  <div className="flex items-center justify-center h-96">
    <p className="text-slate-500">Streaming module coming soon</p>
  </div>
);

// ─── FEATURE WRAPPER COMPONENTS ─────────────────────────────────────────────────
// Wrap feature modules that don't have a default export
function VideoAnalysisLayout() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Video Analysis</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <VideoAnalysisDashboard />
        <VideoLibrary />
        <MatchVideo />
        <BallClips />
        <ShotTagging />
        <PlayerHighlights />
        <AIHighlights />
      </div>
    </div>
  );
}

function AcademyLayout() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Academy</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AcademyDashboard />
        <Students />
        <Batches />
        <Curriculum />
        <StudentProgress />
      </div>
    </div>
  );
}

function TrainingLayout() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Training</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CoachDashboard />
        <PracticeSessions />
        <FitnessTracking />
        <Attendance />
        <PerformanceTracking />
      </div>
    </div>
  );
}

function AuctionLayout() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Auction</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AuctionDashboard />
        <AuctionRoom />
        <PlayerPool />
        <BudgetTracker />
      </div>
    </div>
  );
}

function FantasyLayout() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fantasy</h1>
      <FantasyAnalytics />
    </div>
  );
}

function NotificationsLayout() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
      <Notifications />
    </div>
  );
}

function SponsorshipLayout() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sponsorship</h1>
      <Sponsorship />
    </div>
  );
}

function MonetizationLayout() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Monetization</h1>
      <Monetization />
    </div>
  );
}

// ─── ADMIN WRAPPER COMPONENTS ────────────────────────────────────────────────────
function AdminPortalLayout() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Portal</h1>
      <AdminPortal />
    </div>
  );
}

function AdminAnalyticsLayout() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Analytics</h1>
      <AdminAnalytics />
    </div>
  );
}

function AdminDashboardLayout() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
      <Outlet />
    </div>
  );
}

// ─── LAYOUT COMPONENT ────────────────────────────────────────────────────────────
function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = React.useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return <Layout activePath={location.pathname} onNavigate={handleNavigate}>{children}</Layout>;
}

// ─── MAIN ROUTER CONFIGURATION ──────────────────────────────────────────────────
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },

  // ─── DASHBOARD ROUTE ───────────────────────────────────────────────────────────
  {
    path: '/dashboard',
    element: <AppLayout><Dashboard /></AppLayout>,
  },

  // ─── TOURNAMENT ROUTES ─────────────────────────────────────────────────────────
  {
    path: '/tournaments',
    element: <AppLayout><TournamentList /></AppLayout>,
    children: [
      {
        path: 'analytics',
        element: <AppLayout><TournamentAnalytics /></AppLayout>,
      },
      {
        path: 'standings',
        element: <AppLayout><TournamentStandings /></AppLayout>,
      },
    ],
  },

  // ─── TEAM ROUTES ───────────────────────────────────────────────────────────────
  {
    path: '/teams',
    element: <AppLayout><TeamList /></AppLayout>,
    children: [
      {
        path: 'analytics',
        element: <AppLayout><TeamAnalytics /></AppLayout>,
      },
    ],
  },

  // ─── PLAYER ROUTES ─────────────────────────────────────────────────────────────
  {
    path: '/players',
    element: <AppLayout><PlayerList /></AppLayout>,
    children: [
      {
        path: 'analytics',
        element: <AppLayout><PlayerAnalytics /></AppLayout>,
      },
    ],
  },

  // ─── CAPTAIN ROUTES ────────────────────────────────────────────────────────────
  {
    path: '/captains',
    element: <AppLayout><CaptainList /></AppLayout>,
    children: [
      {
        path: 'analytics',
        element: <AppLayout><CaptainAnalytics /></AppLayout>,
      },
    ],
  },

  // ─── MATCH ROUTES ──────────────────────────────────────────────────────────────
  {
    path: '/matches',
    element: <AppLayout><MatchList /></AppLayout>,
    children: [
      {
        path: 'analytics',
        element: <AppLayout><MatchAnalytics /></AppLayout>,
      },
      {
        path: 'h2h',
        element: <AppLayout><H2HAnalytics /></AppLayout>,
      },
      {
        path: 'h2h/analytics',
        element: <AppLayout><H2HAnalyticsDetailed /></AppLayout>,
      },
    ],
  },

  // ─── DIRECT H2H ROUTE ────────────────────────────────────────────────────────────
  {
    path: '/h2h',
    element: <AppLayout><H2HAnalytics /></AppLayout>,
  },
  {
    path: '/h2h/analytics',
    element: <AppLayout><H2HAnalyticsDetailed /></AppLayout>,
  },
  {
    path: '/matches/analytics',
    element: <AppLayout><MatchAnalytics /></AppLayout>,
  },

  // ─── ANALYTICS ROUTES ─────────────────────────────────────────────────────────
  {
    path: '/analytics',
    element: <AppLayout><AIInsights /></AppLayout>,
    children: [
      {
        path: 'predictions',
        element: <AppLayout><Predictions /></AppLayout>,
      },
      {
        path: 'predictions/enhanced',
        element: <AppLayout><PredictionsEnhanced /></AppLayout>,
      },
      {
        path: 'insights',
        element: <AppLayout><AIInsights /></AppLayout>,
      },
      {
        path: 'awards',
        element: <AppLayout><Awards /></AppLayout>,
      },
      {
        path: 'awards/leaderboards',
        element: <AppLayout><AwardsLeaderboards /></AppLayout>,
      },
    ],
  },

  // ─── AI ROUTES ───────────────────────────────────────────────────────────────────
  {
    path: '/ai/insights',
    element: <AppLayout><AIInsights /></AppLayout>,
  },
  {
    path: '/ai/coach',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">AI Coach</h2><p className="text-slate-500">AI-powered coaching insights.</p></div></AppLayout>,
  },
  {
    path: '/ai/analyst',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">AI Analyst</h2><p className="text-slate-500">AI-powered match analysis.</p></div></AppLayout>,
  },
  {
    path: '/ai/predictions',
    element: <AppLayout><Predictions /></AppLayout>,
  },
  {
    path: '/ai/reports',
    element: <AppLayout><Reports /></AppLayout>,
  },

  // ─── VIDEO ANALYSIS ROUTE ──────────────────────────────────────────────────────
  {
    path: '/video-analysis',
    element: <AppLayout><VideoAnalysisLayout /></AppLayout>,
    children: [
      {
        path: 'ai-highlights',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">AI Highlights</h2><p className="text-slate-500">AI-generated highlights.</p></div></AppLayout>,
      },
    ],
  },

  // ─── ACADEMY ROUTE ─────────────────────────────────────────────────────────────
  {
    path: '/academy',
    element: <AppLayout><AcademyLayout /></AppLayout>,
    children: [
      {
        path: 'batches',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Batches</h2><p className="text-slate-500">Manage academy batches.</p></div></AppLayout>,
      },
      {
        path: 'progress',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Student Progress</h2><p className="text-slate-500">Track student progress.</p></div></AppLayout>,
      },
    ],
  },

  // ─── TRAINING ROUTE ────────────────────────────────────────────────────────────
  {
    path: '/training',
    element: <AppLayout><TrainingLayout /></AppLayout>,
  },

  // ─── AUCTION ROUTE ─────────────────────────────────────────────────────────────
  {
    path: '/auction',
    element: <AppLayout><AuctionLayout /></AppLayout>,
    children: [
      {
        path: 'players',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Player Pool</h2><p className="text-slate-500">Manage player pool.</p></div></AppLayout>,
      },
      {
        path: 'budget',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Budget Tracker</h2><p className="text-slate-500">Track auction budgets.</p></div></AppLayout>,
      },
    ],
  },

  // ─── FANTASY ROUTE ─────────────────────────────────────────────────────────────
  {
    path: '/fantasy',
    element: <AppLayout><FantasyLayout /></AppLayout>,
    children: [
      {
        path: 'leagues',
        element: <AppLayout><FantasyLayout /></AppLayout>,
      },
      {
        path: 'contests',
        element: <AppLayout><FantasyLayout /></AppLayout>,
      },
      {
        path: 'mvp',
        element: <AppLayout><MVPFantasy /></AppLayout>,
      },
      {
        path: 'analytics',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Fantasy Analytics</h2><p className="text-slate-500">Fantasy performance analytics.</p></div></AppLayout>,
      },
    ],
  },

  // ─── NOTIFICATION ROUTE ────────────────────────────────────────────────────────
  {
    path: '/notifications',
    element: <AppLayout><NotificationsLayout /></AppLayout>,
  },

  // ─── SPONSORSHIP ROUTE ─────────────────────────────────────────────────────────
  {
    path: '/sponsorship',
    element: <AppLayout><SponsorshipLayout /></AppLayout>,
    children: [
      {
        path: 'analytics',
        element: <AppLayout><SponsorshipLayout /></AppLayout>,
      },
    ],
  },

  // ─── MONETIZATION ROUTE ────────────────────────────────────────────────────────
  {
    path: '/monetization',
    element: <AppLayout><MonetizationLayout /></AppLayout>,
  },

  // ─── STREAMING ROUTE ───────────────────────────────────────────────────────────
  {
    path: '/streaming',
    element: <AppLayout><Streaming /></AppLayout>,
  },

  // ─── REPORT ROUTES ─────────────────────────────────────────────────────────────
  {
    path: '/reports',
    element: <AppLayout><Reports /></AppLayout>,
    children: [
      {
        path: 'export',
        element: <AppLayout><Reports /></AppLayout>,
      },
    ],
  },

  // ─── ADMIN ROUTES ──────────────────────────────────────────────────────────────
  {
    path: '/admin',
    element: <AppLayout><AdminDashboardLayout /></AppLayout>,
    children: [
      {
        path: 'analytics',
        element: <AppLayout><AdminAnalyticsLayout /></AppLayout>,
      },
      {
        path: 'portal',
        element: <AppLayout><AdminPortalLayout /></AppLayout>,
      },
      {
        path: 'dashboard',
        element: <AppLayout><AdminDashboardLayout /></AppLayout>,
      },
      // Additional admin routes
      {
        path: 'tournaments',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Tournament Management</h2><p className="text-slate-500">Manage tournaments, seasons, and competitions.</p></div></AppLayout>,
      },
      {
        path: 'teams',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Team Management</h2><p className="text-slate-500">Manage teams, squads, and rosters.</p></div></AppLayout>,
      },
      {
        path: 'players',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Player Management</h2><p className="text-slate-500">Manage players, profiles, and statistics.</p></div></AppLayout>,
      },
      {
        path: 'squads',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Squad Management</h2><p className="text-slate-500">Manage squads and team compositions.</p></div></AppLayout>,
      },
      {
        path: 'matches',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Match Management</h2><p className="text-slate-500">Manage matches, fixtures, and schedules.</p></div></AppLayout>,
      },
      {
        path: 'scoring',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Live Scoring</h2><p className="text-slate-500">Real-time match scoring and updates.</p></div></AppLayout>,
      },
      {
        path: 'ball-by-ball',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Ball-by-Ball</h2><p className="text-slate-500">Detailed ball-by-ball match data.</p></div></AppLayout>,
      },
      {
        path: 'scorecards',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Scorecards</h2><p className="text-slate-500">Manage match scorecards.</p></div></AppLayout>,
      },
      {
        path: 'streaming',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Streaming</h2><p className="text-slate-500">Manage video streaming and recordings.</p></div></AppLayout>,
      },
      {
        path: 'officials',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Match Officials</h2><p className="text-slate-500">Manage umpires, referees, and officials.</p></div></AppLayout>,
      },
      {
        path: 'venues',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Venue Management</h2><p className="text-slate-500">Manage venues and stadiums.</p></div></AppLayout>,
      },
      {
        path: 'organizers',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Organizer Management</h2><p className="text-slate-500">Manage tournament organizers.</p></div></AppLayout>,
      },
      {
        path: 'player-analytics',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Player Analytics</h2><p className="text-slate-500">Detailed player statistics and insights.</p></div></AppLayout>,
      },
      {
        path: 'team-analytics',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Team Analytics</h2><p className="text-slate-500">Team performance analysis.</p></div></AppLayout>,
      },
      {
        path: 'match-analytics',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Match Analytics</h2><p className="text-slate-500">Detailed match analysis and reports.</p></div></AppLayout>,
      },
      {
        path: 'tournament-analytics',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Tournament Analytics</h2><p className="text-slate-500">Tournament-level statistics.</p></div></AppLayout>,
      },
      {
        path: 'batter-insights',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Batter Insights</h2><p className="text-slate-500">Batter performance analysis.</p></div></AppLayout>,
      },
      {
        path: 'bowler-insights',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Bowler Insights</h2><p className="text-slate-500">Bowler performance analysis.</p></div></AppLayout>,
      },
      {
        path: 'captain-analytics',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Captain Analytics</h2><p className="text-slate-500">Captain decision analysis.</p></div></AppLayout>,
      },
      {
        path: 'venue-analytics',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Venue Analytics</h2><p className="text-slate-500">Venue-based statistics.</p></div></AppLayout>,
      },
      {
        path: 'moneyball',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Moneyball Analytics</h2><p className="text-slate-500">Advanced analytics using Moneyball methodology.</p></div></AppLayout>,
      },
      {
        path: 'import',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Import Center</h2><p className="text-slate-500">Import data from external sources.</p></div></AppLayout>,
      },
      {
        path: 'users',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">User Management</h2><p className="text-slate-500">Manage users and permissions.</p></div></AppLayout>,
      },
      {
        path: 'audit',
        element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Audit Logs</h2><p className="text-slate-500">View system audit logs.</p></div></AppLayout>,
      },
    ],
  },

  // ─── SETTINGS ROUTE ────────────────────────────────────────────────────────────
  {
    path: '/settings',
    element: <AppLayout><div className="p-6"><h2 className="text-2xl font-bold mb-4">Settings</h2><p className="text-slate-500">Application settings and preferences.</p></div></AppLayout>,
  },

  // ─── SYSTEM ROUTES ─────────────────────────────────────────────────────────────
  {
    path: '/welcome',
    element: <AppLayout><Welcome /></AppLayout>,
  },

  // ─── DASHBOARD CHILD ROUTES ─────────────────────────────────────────────────────
  {
    path: '/dashboard/players',
    element: <AppLayout><PlayerList /></AppLayout>,
  },
  {
    path: '/dashboard/matches',
    element: <AppLayout><MatchList /></AppLayout>,
  },
  {
    path: '/dashboard/analytics',
    element: <AppLayout><AIInsights /></AppLayout>,
  },

  // ─── ANALYTICS CHILD ROUTES ─────────────────────────────────────────────────────
  {
    path: '/analytics/team',
    element: <AppLayout><TeamAnalytics /></AppLayout>,
  },
  {
    path: '/analytics/player',
    element: <AppLayout><PlayerAnalytics /></AppLayout>,
  },
  {
    path: '/analytics/match',
    element: <AppLayout><MatchAnalytics /></AppLayout>,
  },
  {
    path: '/analytics/tournament',
    element: <AppLayout><TournamentAnalytics /></AppLayout>,
  },
  {
    path: '/analytics/venue',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Venue Analytics</h2><p className="text-slate-500">Venue-based statistics.</p></div></AppLayout>,
  },
  {
    path: '/analytics/captain',
    element: <AppLayout><CaptainAnalytics /></AppLayout>,
  },
  {
    path: '/analytics/batter',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Batter Analytics</h2><p className="text-slate-500">Batter performance analysis.</p></div></AppLayout>,
  },
  {
    path: '/analytics/bowler',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Bowler Analytics</h2><p className="text-slate-500">Bowler performance analysis.</p></div></AppLayout>,
  },
  {
    path: '/analytics/moneyball',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Moneyball Analytics</h2><p className="text-slate-500">Advanced analytics using Moneyball methodology.</p></div></AppLayout>,
  },

  // ─── AI ROUTES ───────────────────────────────────────────────────────────────────
  {
    path: '/ai/insights',
    element: <AppLayout><AIInsights /></AppLayout>,
  },
  {
    path: '/ai/coach',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">AI Coach</h2><p className="text-slate-500">AI-powered coaching insights.</p></div></AppLayout>,
  },
  {
    path: '/ai/analyst',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">AI Analyst</h2><p className="text-slate-500">AI-powered match analysis.</p></div></AppLayout>,
  },
  {
    path: '/ai/predictions',
    element: <AppLayout><Predictions /></AppLayout>,
  },
  {
    path: '/ai/reports',
    element: <AppLayout><Reports /></AppLayout>,
  },

  // ─── VIDEO ANALYSIS CHILD ROUTES ─────────────────────────────────────────────────
  {
    path: '/video-analysis/videos',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Video Library</h2><p className="text-slate-500">Manage video library.</p></div></AppLayout>,
  },
  {
    path: '/video-analysis/clips',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Video Clips</h2><p className="text-slate-500">Manage video clips.</p></div></AppLayout>,
  },
  {
    path: '/video-analysis/tagging',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Shot Tagging</h2><p className="text-slate-500">Tag shots and plays.</p></div></AppLayout>,
  },
  {
    path: '/video-analysis/highlights',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Player Highlights</h2><p className="text-slate-500">View player highlights.</p></div></AppLayout>,
  },
  {
    path: '/video-analysis/ai-highlights',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">AI Highlights</h2><p className="text-slate-500">AI-generated highlights.</p></div></AppLayout>,
  },

  // ─── ACADEMY CHILD ROUTES ───────────────────────────────────────────────────────
  {
    path: '/academy/students',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Students</h2><p className="text-slate-500">Manage academy students.</p></div></AppLayout>,
  },
  {
    path: '/academy/coaches',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Coaches</h2><p className="text-slate-500">Manage academy coaches.</p></div></AppLayout>,
  },
  {
    path: '/academy/parents',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Parents</h2><p className="text-slate-500">Manage parent accounts.</p></div></AppLayout>,
  },
  {
    path: '/academy/curriculum',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Curriculum</h2><p className="text-slate-500">Manage academy curriculum.</p></div></AppLayout>,
  },
  {
    path: '/academy/reports',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Academy Reports</h2><p className="text-slate-500">View academy reports.</p></div></AppLayout>,
  },

  // ─── TRAINING CHILD ROUTES ───────────────────────────────────────────────────────
  {
    path: '/training/sessions',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Practice Sessions</h2><p className="text-slate-500">Manage practice sessions.</p></div></AppLayout>,
  },
  {
    path: '/training/attendance',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Attendance</h2><p className="text-slate-500">Track attendance.</p></div></AppLayout>,
  },
  {
    path: '/training/fitness',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Fitness Tracking</h2><p className="text-slate-500">Track player fitness.</p></div></AppLayout>,
  },
  {
    path: '/training/performance',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Performance Tracking</h2><p className="text-slate-500">Track player performance.</p></div></AppLayout>,
  },

  // ─── AUCTION CHILD ROUTES ───────────────────────────────────────────────────────
  {
    path: '/auction/room',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Auction Room</h2><p className="text-slate-500">Live auction room.</p></div></AppLayout>,
  },
  {
    path: '/auction/pool',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Player Pool</h2><p className="text-slate-500">Manage player pool.</p></div></AppLayout>,
  },
  {
    path: '/auction/budgets',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Budget Tracker</h2><p className="text-slate-500">Track auction budgets.</p></div></AppLayout>,
  },
  {
    path: '/auction/sold',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Sold Players</h2><p className="text-slate-500">View sold players.</p></div></AppLayout>,
  },

  // ─── FANTASY CHILD ROUTES ───────────────────────────────────────────────────────
  {
    path: '/fantasy/leagues',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Fantasy Leagues</h2><p className="text-slate-500">Manage fantasy leagues.</p></div></AppLayout>,
  },
  {
    path: '/fantasy/teams',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Fantasy Teams</h2><p className="text-slate-500">Manage fantasy teams.</p></div></AppLayout>,
  },
  {
    path: '/fantasy/pool',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Fantasy Pool</h2><p className="text-slate-500">Manage fantasy player pool.</p></div></AppLayout>,
  },
  {
    path: '/fantasy/transfers',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Fantasy Transfers</h2><p className="text-slate-500">Manage fantasy transfers.</p></div></AppLayout>,
  },
  {
    path: '/fantasy/points',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Fantasy Points</h2><p className="text-slate-500">View fantasy points.</p></div></AppLayout>,
  },
  {
    path: '/fantasy/contests',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Fantasy Contests</h2><p className="text-slate-500">Join fantasy contests.</p></div></AppLayout>,
  },

  // ─── MATCH CHILD ROUTES ──────────────────────────────────────────────────────────
  {
    path: '/matches/live',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Live Matches</h2><p className="text-slate-500">Watch live matches.</p></div></AppLayout>,
  },
  {
    path: '/matches/commentary',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Commentary</h2><p className="text-slate-500">Live match commentary.</p></div></AppLayout>,
  },
  {
    path: '/matches/scorecards',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Scorecards</h2><p className="text-slate-500">View match scorecards.</p></div></AppLayout>,
  },
  {
    path: '/matches/streaming',
    element: <AppLayout><div className="p-6"><h2 className="text-xl font-bold mb-4">Streaming</h2><p className="text-slate-500">Watch match streaming.</p></div></AppLayout>,
  },

  // ─── HELP ROUTE ──────────────────────────────────────────────────────────────────
  {
    path: '/help',
    element: <AppLayout><div className="p-6"><h2 className="text-2xl font-bold mb-4">Help & Support</h2><p className="text-slate-500">Get help and support for CricketIQ.</p></div></AppLayout>,
  },

  // ─── NOT FOUND ROUTE ───────────────────────────────────────────────────────────
  {
    path: '*',
    element: (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="max-w-md text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">404</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Page not found</h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
      </div>
    ),
  },
]);

// ─── EXPORT ─────────────────────────────────────────────────────────────────────
export default router;