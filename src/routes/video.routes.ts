/**
 * Video Analysis Routes Configuration
 * ===================================
 * 
 * Contains routes for video analysis and review.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const VideoAnalysis = React.lazy(() => import('../features/video-analysis/pages/VideoAnalysisPage'));

// ─── VIDEO ANALYSIS ROUTES ──────────────────────────────────────────────────────
export const videoRoutes: RouteObject[] = [
  {
    path: '/video-analysis',
    element: <VideoAnalysis />,
  },
];