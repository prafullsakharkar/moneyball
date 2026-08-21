/**
 * OrganizationContext Provider
 * ============================================
 * React Context that exposes the current organization, available
 * organizations, membership, role, and permissions — with strict tenant
 * isolation.
 *
 * Every organization-aware component must consume this context via
 * `useOrgContext()`. This guarantees components never read cross-tenant
 * data and never reach into stores directly.
 *
 * The provider is a thin, reactive projection over the Zustand stores:
 *   - `organizationStore`  → current organization + switching state
 *   - `authStore`          → memberships (available orgs + permissions)
 */
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useOrganizationStore } from '@stores/organizationStore';
import { useAuthStore } from '@stores/authStore';
import type { Organization, Membership, UserRole, Permission } from '@domain/index';

export interface OrganizationContextValue {
  /** Current organization id ('' when none selected). */
  orgId: string;
  /** Current organization entity. */
  organization: Organization | null;
  /** All organizations the user is an active member of. */
  organizations: Organization[];
  /** Active membership for the current organization. */
  membership: Membership | null;
  /** Role within the current organization. */
  role: UserRole | null;
  /** Permissions within the current organization. */
  permissions: Permission[];
  /** True once a current organization is resolved. */
  isReady: boolean;
  /** True while an organization switch is in flight. */
  isSwitching: boolean;
}

const OrganizationContext = createContext<OrganizationContextValue | undefined>(undefined);

interface OrganizationProviderProps {
  children: ReactNode;
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const currentOrganization = useOrganizationStore((s) => s.currentOrganization);
  const organizations = useOrganizationStore((s) => s.organizations);
  const isSwitching = useOrganizationStore((s) => s.isSwitching);
  const memberships = useAuthStore((s) => s.memberships);

  const value = useMemo<OrganizationContextValue>(() => {
    const orgId = currentOrganization?.id ?? '';

    const membership =
      currentOrganization
        ? memberships.find(
            (m) => m.organizationId === currentOrganization.id && m.status === 'active'
          ) ?? null
        : null;

    return {
      orgId,
      organization: currentOrganization,
      organizations,
      membership,
      role: membership?.role ?? null,
      permissions: membership?.permissions ?? [],
      isReady: Boolean(currentOrganization),
      isSwitching,
    };
  }, [currentOrganization, organizations, memberships, isSwitching]);

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
}

export function useOrganizationContext(): OrganizationContextValue {
  const ctx = useContext(OrganizationContext);
  if (!ctx) {
    throw new Error('useOrganizationContext must be used within an OrganizationProvider');
  }
  return ctx;
}
