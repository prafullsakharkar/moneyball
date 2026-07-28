/**
 * Monetization Routes Configuration
 * ==================================
 * 
 * Contains routes for billing, subscriptions, and monetization.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const MonetizationDashboard = React.lazy(() => import('../features/monetization/pages/MonetizationDashboard'));
const BillingPage = React.lazy(() => import('../features/monetization/pages/BillingPage'));
const SubscriptionPage = React.lazy(() => import('../features/monetization/pages/SubscriptionPage'));

// ─── MONETIZATION ROUTES ────────────────────────────────────────────────────────
export const monetizationRoutes: RouteObject[] = [
  {
    path: '/monetization',
    element: <MonetizationDashboard />,
  },
];

// ─── BILLING ROUTES ─────────────────────────────────────────────────────────────
export const billingRoutes: RouteObject[] = [
  {
    path: '/monetization/billing',
    element: <BillingPage />,
  },
];

// ─── SUBSCRIPTION ROUTES ────────────────────────────────────────────────────────
export const subscriptionRoutes: RouteObject[] = [
  {
    path: '/monetization/subscriptions',
    element: <SubscriptionPage />,
  },
];