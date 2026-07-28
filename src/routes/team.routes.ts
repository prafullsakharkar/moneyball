/**
 * Team Routes Configuration
 * =========================
 * 
 * Contains routes for team management and analytics.
 * Nested under /teams path.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const TeamList = React.lazy(() => import('../pages/Teams').then((m) => ({ default: m.default })));
const TeamAnalytics = React.lazy(() => import('../pages/TeamAnalytics').then((m) => ({ default: m.default })));

// ─── TEAM INDEX ROUTE (Nested under /teams) ─────────────────────────────────────
export const teamRoutes: RouteObject[] = [
  {
    index: true,
    element: <TeamList />,
  },
];

// ─── TEAM ANALYTICS ROUTES (Nested under /teams) ────────────────────────────────
export const teamAnalyticsRoutes: RouteObject[] = [
  {
    path: 'analytics',
    element: <TeamAnalytics />,
  },
];