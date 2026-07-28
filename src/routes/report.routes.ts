/**
 * Report Routes Configuration
 * ===========================
 * 
 * Contains routes for reports and analytics exports.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const ReportsPage = React.lazy(() => import('../pages/Reports'));
const ReportExport = React.lazy(() => import('../pages/admin/ReportExport'));

// ─── REPORT ROUTES ──────────────────────────────────────────────────────────────
export const reportRoutes: RouteObject[] = [
  {
    path: '/reports',
    element: <ReportsPage />,
  },
];

// ─── REPORT EXPORT ROUTES ───────────────────────────────────────────────────────
export const reportExportRoutes: RouteObject[] = [
  {
    path: '/reports/export',
    element: <ReportExport />,
  },
];