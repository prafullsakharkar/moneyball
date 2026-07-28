/**
 * Streaming Routes Configuration
 * ==============================
 * 
 * Contains routes for live streaming and video content.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const StreamingDashboard = React.lazy(() => import('../features/streaming/pages/StreamingDashboard'));
const LiveMatchStream = React.lazy(() => import('../features/streaming/pages/LiveMatchStream'));

// ─── STREAMING ROUTES ───────────────────────────────────────────────────────────
export const streamingRoutes: RouteObject[] = [
  {
    path: '/streaming',
    element: <StreamingDashboard />,
  },
];

// ─── LIVE MATCH STREAM ROUTES ───────────────────────────────────────────────────
export const liveStreamRoutes: RouteObject[] = [
  {
    path: '/streaming/live',
    element: <LiveMatchStream />,
  },
];