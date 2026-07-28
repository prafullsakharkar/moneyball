/**
 * Match Routes Configuration
 * ==========================
 * 
 * Contains routes for match center, analytics, and head-to-head.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const MatchCenter = React.lazy(() => import('../pages/Matches'));
const MatchAnalytics = React.lazy(() => import('../pages/MatchAnalytics'));
const H2HAnalytics = React.lazy(() => import('../pages/H2H'));
const H2HAnalyticsDetailed = React.lazy(() => import('../pages/H2HAnalyticsDetailed'));

// ─── MATCH ROUTES ───────────────────────────────────────────────────────────────
export const matchRoutes: RouteObject[] = [
  {
    path: '/matches',
    element: <MatchCenter />,
  },
];

// ─── MATCH ANALYTICS ROUTES ─────────────────────────────────────────────────────
export const matchAnalyticsRoutes: RouteObject[] = [
  {
    path: '/matches/analytics',
    element: <MatchAnalytics />,
  },
];

// ─── HEAD TO HEAD ROUTES ────────────────────────────────────────────────────────
export const h2hRoutes: RouteObject[] = [
  {
    path: '/h2h',
    element: <H2HAnalytics />,
  },
];

// ─── HEAD TO HEAD ANALYTICS ROUTES ──────────────────────────────────────────────
export const h2hAnalyticsRoutes: RouteObject[] = [
  {
    path: '/h2h/analytics',
    element: <H2HAnalyticsDetailed />,
  },
];