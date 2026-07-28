/**
 * Analytics Routes Configuration
 * ==============================
 * 
 * Contains routes for comprehensive analytics, predictions, and insights.
 * Uses AnalyticsLayout for consistent UI.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const AIInsights = React.lazy(() => import('../pages/AIInsights'));
const PredictionsPage = React.lazy(() => import('../pages/Predictions'));
const PredictionsEnhanced = React.lazy(() => import('../pages/PredictionsEnhanced'));
const ReportsPage = React.lazy(() => import('../pages/Reports'));
const AIPage = React.lazy(() => import('../pages/AI'));

// ─── ANALYTICS ROUTES (AnalyticsLayout) ─────────────────────────────────────────
export const analyticsRoutes: RouteObject[] = [
  {
    path: '/analytics',
    element: <AIInsights />,
  },
];

// ─── PREDICTIONS ROUTES ─────────────────────────────────────────────────────────
export const predictionsRoutes: RouteObject[] = [
  {
    path: '/analytics/predictions',
    element: <PredictionsPage />,
  },
];

// ─── ENHANCED PREDICTIONS ROUTES ────────────────────────────────────────────────
export const predictionsEnhancedRoutes: RouteObject[] = [
  {
    path: '/analytics/predictions/enhanced',
    element: <PredictionsEnhanced />,
  },
];

// ─── INSIGHTS & REPORTS ROUTES ──────────────────────────────────────────────────
export const insightsRoutes: RouteObject[] = [
  {
    path: '/analytics/insights',
    element: <ReportsPage />,
  },
];

// ─── AI ROUTES ──────────────────────────────────────────────────────────────────
export const aiRoutes: RouteObject[] = [
  {
    path: '/analytics/ai',
    element: <AIPage />,
  },
];

// ─── Improved URL Structure (Per Requirement 7) ──────────────────────────────────
// /analytics/player instead of /admin/player-analytics
// /analytics/team instead of /admin/team-analytics
// /analytics/match instead of /admin/match-analytics