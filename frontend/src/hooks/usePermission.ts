import { useMemo } from 'react';
import { useAuthStore } from '@stores/authStore';
import { useOrganizationStore } from '@stores/organizationStore';
import type { UserRole, PermissionAction } from '@domain/index';

/**
 * Get the current user's role in the active organization.
 */
export function useCurrentRole(): UserRole | null {
  const payload = useAuthStore((s) => s.getTokenPayload());
  return payload?.role ?? null;
}

/**
 * Check if the current user has a specific role (or higher).
 * Role hierarchy: owner > admin > coach > manager > player > viewer
 */
export function useHasRole(requiredRole: UserRole): boolean {
  const currentRole = useCurrentRole();
  if (!currentRole) return false;

  const hierarchy: UserRole[] = ['owner', 'admin', 'coach', 'manager', 'player', 'viewer'];
  const currentIndex = hierarchy.indexOf(currentRole);
  const requiredIndex = hierarchy.indexOf(requiredRole);

  // Lower index = higher role
  return currentIndex <= requiredIndex;
}

/**
 * Check if the current user has any of the specified roles.
 */
export function useHasAnyRole(roles: UserRole[]): boolean {
  const currentRole = useCurrentRole();
  if (!currentRole) return false;
  return roles.includes(currentRole);
}

/**
 * Check if the current user has a specific permission on a resource.
 * Permissions are scoped to the current organization.
 */
export function useHasPermission(resource: string, action: PermissionAction): boolean {
  const memberships = useAuthStore((s) => s.memberships);
  const currentOrg = useOrganizationStore((s) => s.currentOrganization);

  return useMemo(() => {
    if (!currentOrg) return false;

    const membership = memberships.find(
      (m) => m.organizationId === currentOrg.id && m.status === 'active'
    );

    if (!membership) return false;

    // Owner has all permissions
    if (membership.role === 'owner') return true;

    return membership.permissions.some(
      (p) => p.resource === resource && (p.action === action || p.action === 'manage')
    );
  }, [memberships, currentOrg, resource, action]);
}

/**
 * Check if the current user has any permission on a resource.
 */
export function useHasAnyPermission(resource: string): boolean {
  const memberships = useAuthStore((s) => s.memberships);
  const currentOrg = useOrganizationStore((s) => s.currentOrganization);

  return useMemo(() => {
    if (!currentOrg) return false;

    const membership = memberships.find(
      (m) => m.organizationId === currentOrg.id && m.status === 'active'
    );

    if (!membership) return false;
    if (membership.role === 'owner') return true;

    return membership.permissions.some((p) => p.resource === resource);
  }, [memberships, currentOrg, resource]);
}

/**
 * Get all permissions for the current user in the active organization.
 */
export function useCurrentPermissions() {
  const memberships = useAuthStore((s) => s.memberships);
  const currentOrg = useOrganizationStore((s) => s.currentOrganization);

  return useMemo(() => {
    if (!currentOrg) return [];

    const membership = memberships.find(
      (m) => m.organizationId === currentOrg.id && m.status === 'active'
    );

    return membership?.permissions ?? [];
  }, [memberships, currentOrg]);
}
