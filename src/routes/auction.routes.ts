/**
 * Auction Routes Configuration
 * ============================
 * 
 * Contains routes for cricket auction management.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const AuctionDashboard = React.lazy(() => import('../features/auction/pages/AuctionDashboard'));
const AuctionList = React.lazy(() => import('../features/auction/pages/AuctionList'));
const AuctionAnalytics = React.lazy(() => import('../features/auction/pages/AuctionAnalytics'));

// ─── AUCTION ROUTES (AuctionLayout) ─────────────────────────────────────────────
export const auctionRoutes: RouteObject[] = [
  {
    path: '/auction',
    element: <AuctionDashboard />,
  },
];

// ─── AUCTION LIST ROUTES ────────────────────────────────────────────────────────
export const auctionListRoutes: RouteObject[] = [
  {
    path: '/auction/list',
    element: <AuctionList />,
  },
];

// ─── AUCTION ANALYTICS ROUTES ───────────────────────────────────────────────────
export const auctionAnalyticsRoutes: RouteObject[] = [
  {
    path: '/auction/analytics',
    element: <AuctionAnalytics />,
  },
];