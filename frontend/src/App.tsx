import { Routes, Route } from 'react-router-dom';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import PlayersPage from './features/player/pages/PlayersPage';
import TeamsPage from './features/team/pages/TeamsPage';
import MatchesPage from './features/match/pages/MatchesPage';
import TournamentsPage from './features/tournament/pages/TournamentsPage';
import AnalyticsPage from './features/analytics/pages/AnalyticsPage';
import VideoAnalysisPage from './features/video-analysis/pages/VideoAnalysisDashboard';
import TrainingPage from './features/training/pages/TrainingDashboard';
import ScoutingPage from './features/scouting/pages/ScoutingDashboard';
import AuctionPage from './features/auction/pages/AuctionDashboard';
import SponsorshipPage from './features/sponsorship/pages/Sponsorship';
import MonetizationPage from './features/monetization/pages/Monetization';
import AdminPage from './pages/Admin';
import AdminAnalyticsPage from './pages/AdminAnalytics';
import AdminPortalPage from './pages/AdminPortal';
import NotificationsPage from './features/notifications/pages/NotificationsPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import SettingsPage from './features/settings/pages/SettingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/players" element={<PlayersPage />} />
      <Route path="/teams" element={<TeamsPage />} />
      <Route path="/matches" element={<MatchesPage />} />
      <Route path="/tournaments" element={<TournamentsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/video-analysis" element={<VideoAnalysisPage />} />
      <Route path="/training" element={<TrainingPage />} />
      <Route path="/scouting" element={<ScoutingPage />} />
      <Route path="/auction" element={<AuctionPage />} />
      <Route path="/sponsorship" element={<SponsorshipPage />} />
      <Route path="/monetization" element={<MonetizationPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
      <Route path="/admin/portal" element={<AdminPortalPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default App;
