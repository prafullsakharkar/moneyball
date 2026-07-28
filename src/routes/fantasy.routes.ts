/**
 * Fantasy Routes Configuration
 * ============================
 * 
 * Contains routes for fantasy cricket management.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const FantasyDashboard = React.lazy(() => import('../features/fantasy/pages/FantasyDashboard'));
const FantasyLeagues = React.lazy(() => import('../features/fantasy/pages/FantasyLeagues'));
const FantasyContests = React.lazy(() => import('../features/fantasy/pages/FantasyContests'));
const MVPFantasy = React.lazy(() => import('../pages/MVPFantasy'));

// ─── FANTASY ROUTES ─────────────────────────────────────────────────────────────
export const fantasyRoutes: RouteObject[] = [
  {
    path: '/fantasy',
    element: <FantasyDashboard />,
  },
];

// ─── FANTASY LEAGUE ROUTES ──────────────────────────────────────────────────────
export const fantasyLeagueRoutes: RouteObject[] = [
  {
    path: '/fantasy/leagues',
    element: <FantasyLeagues />,
  },
];

// ─── FANTASY CONTEST ROUTES ─────────────────────────────────────────────────────
export const fantasyContestRoutes: RouteObject[] = [
  {
    path: '/fantasy/contests',
    element: <FantasyContests />,
  },
];

// ─── MVP FANTASY ROUTES ─────────────────────────────────────────────────────────
export const mvpFantasyRoutes: RouteObject[] = [
  {
    path: '/fantasy/mvp',
    element: <MVPFantasy />,
  },
];