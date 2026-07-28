/**
 * CricketIQ Enterprise Routing Architecture
 * ==========================================
 * 
 * This module exports all feature-based route configurations
 * for the Cricket Analytics and Tournament Management Platform.
 * 
 * Architecture:
 * - Feature-based modular routing
 * - Nested routing for related pages
 * - Layout-based organization
 * - Lazy-loaded components
 * - Type-safe route configuration
 */

// ─── EXPORT ALL FEATURE ROUTES ──────────────────────────────────────────────────
export { authRoutes, publicRoutes, systemRoutes } from './system.routes';

export { dashboardRoutes } from './dashboard.routes';

export { 
  tournamentRoutes, 
  tournamentAnalyticsRoutes, 
  tournamentStandingsRoutes 
} from './tournament.routes';

export { 
  teamRoutes, 
  teamAnalyticsRoutes 
} from './team.routes';

export { 
  playerRoutes, 
  playerAnalyticsRoutes 
} from './player.routes';

export { 
  captainRoutes,
  captainAnalyticsRoutes 
} from './captain.routes';

export { 
  matchRoutes, 
  matchAnalyticsRoutes, 
  h2hRoutes, 
  h2hAnalyticsRoutes 
} from './match.routes';

export { 
  analyticsRoutes,
  analyticsDashboardRoutes 
} from './analytics.routes';

export { 
  videoAnalysisRoutes 
} from './video.routes';

export { 
  academyRoutes 
} from './academy.routes';

export { 
  trainingRoutes 
} from './training.routes';

export { 
  auctionRoutes 
} from './auction.routes';

export { 
  fantasyRoutes 
} from './fantasy.routes';

export { 
  notificationRoutes 
} from './notification.routes';

export { 
  sponsorshipRoutes 
} from './sponsorship.routes';

export { 
  monetizationRoutes 
} from './monetization.routes';

export { 
  streamingRoutes 
} from './streaming.routes';

export { 
  reportRoutes 
} from './report.routes';

export { 
  adminRoutes 
} from './admin.routes';

export { 
  settingsRoutes,
  profileSettingsRoutes,
  organizationSettingsRoutes 
} from './settings.routes';
