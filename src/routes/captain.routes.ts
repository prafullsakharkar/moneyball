/**
 * Captain Routes Configuration
 * ============================
 * 
 * Contains routes for captain dashboard and analytics.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const CaptainDashboard = React.lazy(() => import('../pages/Captains'));
const CaptainAnalytics = React.lazy(() => import('../pages/CaptainAnalytics'));

// ─── CAPTAIN ROUTES ─────────────────────────────────────────────────────────────
export const captainRoutes: RouteObject[] = [
  {
    path: '/captains',
    element: <CaptainDashboard />,
  },
];

// ─── CAPTAIN ANALYTICS ROUTES ───────────────────────────────────────────────────
export const captainAnalyticsRoutes: RouteObject[] = [
  {
    path: '/captains/analytics',
    element: <CaptainAnalytics />,
  },
];