/**
 * Training Routes Configuration
 * =============================
 * 
 * Contains routes for training management and session tracking.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const TrainingDashboard = React.lazy(() => import('../features/training/pages/TrainingDashboard'));
const SessionList = React.lazy(() => import('../features/training/pages/SessionList'));
const TrainingAnalytics = React.lazy(() => import('../features/training/pages/TrainingAnalytics'));

// ─── TRAINING ROUTES ────────────────────────────────────────────────────────────
export const trainingRoutes: RouteObject[] = [
  {
    path: '/training',
    element: <TrainingDashboard />,
  },
];

// ─── TRAINING SESSION ROUTES ────────────────────────────────────────────────────
export const trainingSessionRoutes: RouteObject[] = [
  {
    path: '/training/sessions',
    element: <SessionList />,
  },
];

// ─── TRAINING ANALYTICS ROUTES ──────────────────────────────────────────────────
export const trainingAnalyticsRoutes: RouteObject[] = [
  {
    path: '/training/analytics',
    element: <TrainingAnalytics />,
  },
];