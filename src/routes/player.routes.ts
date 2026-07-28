/**
 * Player Routes Configuration
 * ===========================
 * 
 * Contains routes for player management and analytics.
 * Nested under /players path.
 */

import { RouteObject } from 'react-router-dom';

// ─── PLAYER INDEX ROUTE (Nested under /players) ─────────────────────────────────
export const playerRoutes: RouteObject[] = [
  {
    index: true,
    lazy: () => import('../pages/Players'),
  },
];

// ─── PLAYER ANALYTICS ROUTES (Nested under /players) ────────────────────────────
export const playerAnalyticsRoutes: RouteObject[] = [
  {
    path: 'analytics',
    lazy: () => import('../pages/PlayerAnalytics'),
  },
];