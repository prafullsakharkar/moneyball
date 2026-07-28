/**
 * Dashboard Routes Configuration
 * ==============================
 * 
 * Contains routes for the main dashboard and related pages.
 * Uses DashboardLayout for consistent UI.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const DashboardPage = React.lazy(() => import('../pages/Dashboard'));

// ─── DASHBOARD ROUTES (DashboardLayout) ─────────────────────────────────────────
export const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/',
    element: <DashboardPage />,
  },
];