/**
 * Admin Routes Configuration
 * ==========================
 * 
 * Contains routes for admin portal and system administration.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const AdminPortal = React.lazy(() => import('../pages/AdminPortal'));
const AdminAnalytics = React.lazy(() => import('../pages/AdminAnalytics'));
const AdminPage = React.lazy(() => import('../pages/Admin'));

// ─── ADMIN ROUTES (AdminLayout) ─────────────────────────────────────────────────
export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminPortal />,
  },
];

// ─── ADMIN ANALYTICS ROUTES ─────────────────────────────────────────────────────
export const adminAnalyticsRoutes: RouteObject[] = [
  {
    path: '/admin/analytics',
    element: <AdminAnalytics />,
  },
];

// ─── ADMIN PORTAL ROUTES ────────────────────────────────────────────────────────
export const adminPortalRoutes: RouteObject[] = [
  {
    path: '/admin/portal',
    element: <AdminPage />,
  },
];