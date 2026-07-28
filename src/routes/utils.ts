/**
 * Route Utility Functions
 * =======================
 * 
 * Helper functions for consistent route configuration across the application.
 * Implements enterprise best practices for routing, guards, permissions, and SEO.
 */

import { RouteObject, Navigate, useLocation, useMatches } from 'react-router-dom';
import React, { useEffect } from 'react';

// ─── TYPES ────────────────────────────────────────────────────────────────────────

/**
 * Breadcrumb item for display
 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ElementType;
}

/**
 * User roles for role-based access control
 */
export type UserRole = 'admin' | 'manager' | 'coach' | 'player' | 'fan' | 'guest';

/**
 * Feature flags for incremental feature rollouts
 */
export type FeatureFlag = {
  enabled: boolean;
  rollout?: number; // Percentage (0-100)
  expires?: Date;
};

/**
 * Route metadata for SEO and page configuration
 */
export interface PageMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonical?: string;
}

/**
 * Breadcrumb metadata
 */
export interface BreadcrumbMeta {
  label: string;
  icon?: React.ElementType;
  hide?: boolean;
  path?: string;
}

/**
 * Sidebar menu item configuration
 */
export interface SidebarItem {
  icon: React.ElementType;
  label: string;
  order: number;
  visible?: boolean;
  badge?: string;
}

/**
 * Feature flag configuration
 */
export interface FeatureConfig {
  enabled: boolean;
  flags: Record<string, boolean>;
}

// ─── FEATURE FLAG STORE ───────────────────────────────────────────────────────────
// Mock implementation - replace with your state management (Zustand, Redux, etc.)
const featureFlags: Record<string, boolean> = {
  'streaming_enabled': false,
  'ai_analytics_enabled': true,
  'video_analysis_enabled': true,
  'academy_enabled': false,
  'auction_enabled': true,
  'fantasy_enabled': true,
  'sponsorship_enabled': false,
  'monetization_enabled': false,
  'developer_portal_enabled': false,
};

export const getFeatureFlag = (flagName: string): boolean => {
  return featureFlags[flagName] ?? false;
};

export const isFeatureEnabled = (feature: string, userRole?: UserRole): boolean => {
  const baseEnabled = featureFlags[feature] ?? false;
  if (!baseEnabled) return false;
  
  // Add role-based restrictions if needed
  if (feature === 'admin_features' && userRole !== 'admin') return false;
  
  return true;
};

export const getEnabledFeatures = (userRole?: UserRole): string[] => {
  return Object.entries(featureFlags)
    .filter(([_, enabled]) => {
      if (!enabled) return false;
      if (userRole === 'admin') return true;
      // Filter for non-admin roles
      return !['admin_features', 'billing'].includes(_);
    })
    .map(([name]) => name);
};

// ─── PERMISSION UTILITIES ─────────────────────────────────────────────────────────

/**
 * Role-based permissions
 */
export const rolePermissions: Record<UserRole, string[]> = {
  admin: ['read', 'write', 'delete', 'admin', 'manage_users', 'manage_settings'],
  manager: ['read', 'write', 'manage_teams', 'manage_players'],
  coach: ['read', 'write', 'manage_team', 'manage_players'],
  player: ['read', 'write', 'manage_self'],
  fan: ['read'],
  guest: ['read', 'limited'],
};

/**
 * Check if user has required permissions
 */
export function hasPermission(
  userPermissions: string[] = [],
  requiredPermissions: string[] | string
): boolean {
  const permissions = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions];
  
  return permissions.every(permission => userPermissions.includes(permission));
}

/**
 * Check if user has any of the required permissions
 */
export function hasAnyPermission(
  userPermissions: string[] = [],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.some(permission => userPermissions.includes(permission));
}

/**
 * Check if user has required role
 */
export function hasRole(userRoles: UserRole | string[], requiredRole: UserRole): boolean {
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  return roles.includes(requiredRole);
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(userRoles: UserRole | string[], requiredRoles: UserRole[]): boolean {
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  return requiredRoles.some(role => roles.includes(role));
}

// ─── LAZY COMPONENT WRAPPER ─────────────────────────────────────────────────────
/**
 * Creates a lazy-loaded component with proper error boundaries.
 * @param importFn - The dynamic import function for the component
 * @returns A React component
 */
export const lazyLoad = <T extends React.ComponentType<any>>(importFn: () => Promise<{ default: T }>) => {
  return React.lazy(importFn);
};

// ─── LAZY COMPONENT WITH FALLBACK ───────────────────────────────────────────────
/**
 * Creates a lazy-loaded component with a fallback loading indicator.
 * @param importFn - The dynamic import function for the component
 * @param loadingElement - Optional custom loading component
 * @returns A React component wrapped in Suspense
 */
export const createLazyRoute = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  loadingElement?: React.ReactNode
) => {
  const LazyComponent = React.lazy(importFn);
  
  return (props: any) => (
    <React.Suspense fallback={loadingElement ?? <DefaultLoading />}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};

// ─── DEFAULT LOADING COMPONENT ──────────────────────────────────────────────────
const DefaultLoading = () => (
  <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

// ─── INDEX REDIRECT ROUTE ───────────────────────────────────────────────────────
/**
 * Creates a route that redirects to an index page.
 * @param path - The path to redirect from
 * @param indexRoute - The route to redirect to
 * @returns A redirect route configuration
 */
export const indexRedirect = (path: string, indexRoute: RouteObject) => ({
  path,
  children: [indexRoute, { index: true, element: <Navigate to={indexRoute.path!} replace /> }],
});

// ─── ROUTE WITH PERMISSIONS ─────────────────────────────────────────────────────
/**
 * Creates a route with optional permission checking.
 * @param config - Route configuration with optional permissions
 * @returns A route configuration object
 */
export interface PermissionRouteConfig extends RouteObject {
  permissions?: string[];
  roles?: string[];
  requireAuth?: boolean;
}

// ─── BREADCRUMB METADATA ────────────────────────────────────────────────────────
/**
 * Route metadata for breadcrumb generation.
 */
export interface BreadcrumbMeta {
  label: string;
  icon?: React.ElementType;
  hide?: boolean;
}

export const withBreadcrumb = (route: RouteObject, meta: BreadcrumbMeta): RouteObject => ({
  ...route,
  handle: { breadcrumb: meta, ...route.handle },
});

// ─── PAGE METADATA ──────────────────────────────────────────────────────────────
/**
 * Route metadata for SEO and page configuration.
 */
export interface PageMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export const withMetadata = (route: RouteObject, meta: PageMetadata): RouteObject => ({
  ...route,
  handle: { metadata: meta, ...route.handle },
});

// ─── BREADCRUMB HOOK ────────────────────────────────────────────────────────────
/**
 * Hook to get breadcrumbs for current route.
 * @returns Array of breadcrumb items
 */
export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const location = useLocation();
  const matches = useMatches();
  
  const breadcrumbs = React.useMemo(() => {
    const breadcrumbItems: BreadcrumbItem[] = [];
    
    for (const match of matches) {
      const handle = match.handle as { breadcrumb?: BreadcrumbMeta } | undefined;
      if (handle?.breadcrumb) {
        const breadcrumb = handle.breadcrumb;
        if (!breadcrumb.hide) {
          breadcrumbItems.push({
            label: breadcrumb.label,
            path: breadcrumb.path,
            icon: breadcrumb.icon,
          });
        }
      }
    }
    
    return breadcrumbItems;
  }, [location, matches]);
  
  return breadcrumbs;
};

// ─── SEO MANAGER COMPONENT ──────────────────────────────────────────────────────
/**
 * Component that manages page SEO metadata.
 */
export interface SEOMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export function SEOManager({ title, description, keywords, ogImage, ogTitle, ogDescription }: SEOMetadata) {
  useEffect(() => {
    document.title = title;
    
    const updateMeta = (name: string, content: string | undefined) => {
      let meta = document.head.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      if (content) {
        meta.setAttribute('content', content);
      }
    };
    
    updateMeta('description', description);
    updateMeta('keywords', keywords?.join(', '));
    updateMeta('og:title', ogTitle || title);
    updateMeta('og:description', ogDescription || description);
    updateMeta('og:image', ogImage);
    
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
  }, [title, description, keywords, ogImage, ogTitle, ogDescription]);
  
  return null;
}

// ─── FEATURE FLAG HOOK ──────────────────────────────────────────────────────────
/**
 * Hook to check feature flag status.
 */
export function useFeatureFlag(flag: string): boolean {
  const [enabled, setEnabled] = React.useState(getFeatureFlag(flag));
  
  React.useEffect(() => {
    setEnabled(getFeatureFlag(flag));
  }, [flag]);
  
  return enabled;
}
