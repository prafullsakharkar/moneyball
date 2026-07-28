/**
 * Sponsorship Routes Configuration
 * ================================
 * 
 * Contains routes for sponsorship management.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const SponsorshipDashboard = React.lazy(() => import('../features/sponsorship/pages/SponsorshipDashboard'));
const SponsorshipAnalytics = React.lazy(() => import('../features/sponsorship/pages/SponsorshipAnalytics'));

// ─── SPONSORSHIP ROUTES ─────────────────────────────────────────────────────────
export const sponsorshipRoutes: RouteObject[] = [
  {
    path: '/sponsorship',
    element: <SponsorshipDashboard />,
  },
];

// ─── SPONSORSHIP ANALYTICS ROUTES ───────────────────────────────────────────────
export const sponsorshipAnalyticsRoutes: RouteObject[] = [
  {
    path: '/sponsorship/analytics',
    element: <SponsorshipAnalytics />,
  },
];