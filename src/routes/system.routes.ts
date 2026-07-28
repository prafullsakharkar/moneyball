/**
 * System Routes Configuration
 * ============================
 * 
 * Contains routes for authentication, public pages, and system-level functionality.
 * Uses PublicLayout and AuthLayout for appropriate page rendering.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const PublicPage = React.lazy(() => import('../pages/Welcome'));

// ─── PUBLIC ROUTES (PublicLayout) ───────────────────────────────────────────────
// Routes that don't require authentication
export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicPage />,
  },
];

// ─── AUTHENTICATION ROUTES (AuthLayout) ─────────────────────────────────────────
// Routes for authentication flows
export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    lazy: () => import('../features/auth/pages/LoginPage'),
  },
  {
    path: '/register',
    lazy: () => import('../features/auth/pages/RegisterPage'),
  },
  {
    path: '/forgot-password',
    lazy: () => import('../features/auth/pages/ForgotPasswordPage'),
  },
  {
    path: '/reset-password',
    lazy: () => import('../features/auth/pages/ResetPasswordPage'),
  },
  {
    path: '/verify-email',
    lazy: () => import('../features/auth/pages/VerifyEmailPage'),
  },
  {
    path: '/two-factor',
    lazy: () => import('../features/auth/pages/TwoFactorPage'),
  },
  {
    path: '/logout',
    lazy: () => import('../features/auth/pages/LogoutPage'),
  },
];

// ─── SYSTEM ROUTES ──────────────────────────────────────────────────────────────
// Error handling, health checks, webhooks
export const systemRoutes: RouteObject[] = [
  {
    path: '/health',
    lazy: () => import('../pages/admin/SystemHealth'),
  },
  {
    path: '/maintenance',
    lazy: () => import('../pages/admin/Maintenance'),
  },
  {
    path: '/webhooks',
    lazy: () => import('../pages/admin/WebhookReceiver'),
  },
  {
    path: '/sitemap.xml',
    lazy: () => import('../pages/admin/SitemapGenerator'),
  },
  {
    path: '/robots.txt',
    lazy: () => import('../pages/admin/RobotsGenerator'),
  },
  {
    path: '/cookie-policy',
    lazy: () => import('../pages/cookie/CookiePolicy'),
  },
  {
    path: '/privacy-policy',
    lazy: () => import('../pages/privacy/PrivacyPolicy'),
  },
  {
    path: '/terms-of-service',
    lazy: () => import('../pages/terms/TermsOfService'),
  },
  {
    path: '/api-docs',
    lazy: () => import('../pages/docs/ApiDocumentation'),
  },
  {
    path: '/status',
    lazy: () => import('../pages/system/StatusPage'),
  },
];