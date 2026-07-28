/**
 * Tournament Routes Configuration
 * ===============================
 * 
 * Contains routes for tournament management, analytics, and standings.
 * Routes are used in src/app/router.tsx with nested structure.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── ROUTE CONFIGURATION FOR NESTED USE ──────────────────────────────────────────
// These are route configurations that can be spread into router.children

// Tournament analytics route (nested under /tournaments)
export const tournamentAnalyticsRoutes: RouteObject[] = [
  {
    path: 'analytics',
    lazy: () => import('../pages/TournamentAnalytics'),
  },
];

// Tournament standings route (nested under /tournaments)
export const tournamentStandingsRoutes: RouteObject[] = [
  {
    path: 'standings',
    lazy: () => import('../pages/TournamentStandings'),
  },
];