/**
 * Notification Routes Configuration
 * =================================
 * 
 * Contains routes for notification management.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const NotificationDashboard = React.lazy(() => import('../features/notifications/pages/NotificationDashboard'));

// ─── NOTIFICATION ROUTES ────────────────────────────────────────────────────────
export const notificationRoutes: RouteObject[] = [
  {
    path: '/notifications',
    element: <NotificationDashboard />,
  },
];