/**
 * Settings Routes Configuration
 * =============================
 * 
 * Contains routes for application settings and preferences.
 */

import { RouteObject } from 'react-router-dom';
import React from 'react';

// ─── LAZY IMPORTS ───────────────────────────────────────────────────────────────
const SettingsDashboard = React.lazy(() => import('../pages/admin/SettingsDashboard'));
const ProfileSettings = React.lazy(() => import('../pages/admin/ProfileSettings'));
const OrganizationSettings = React.lazy(() => import('../pages/admin/OrganizationSettings'));

// ─── SETTINGS ROUTES ────────────────────────────────────────────────────────────
export const settingsRoutes: RouteObject[] = [
  {
    path: '/settings',
    element: <SettingsDashboard />,
  },
];

// ─── PROFILE SETTINGS ROUTES ────────────────────────────────────────────────────
export const profileSettingsRoutes: RouteObject[] = [
  {
    path: '/settings/profile',
    element: <ProfileSettings />,
  },
];

// ─── ORGANIZATION SETTINGS ROUTES ───────────────────────────────────────────────
export const organizationSettingsRoutes: RouteObject[] = [
  {
    path: '/settings/organization',
    element: <OrganizationSettings />,
  },
];