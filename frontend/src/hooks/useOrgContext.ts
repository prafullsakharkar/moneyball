/**
 * Tenant isolation hook.
 * Provides current organization context for all org-scoped queries and mutations.
 * Components must use this to ensure they never display cross-tenant data.
 */
import { useMemo } from 'react';
import { useOrganizationStore } from '@stores/organizationStore';
import { useAuthStore } from '@stores/authStore';

/**
 * Returns the current organization context.
 * Every organization-aware component must use this hook.
 */
export function useOrgContext() {
  const currentOrganization = useOrganizationStore((s) => s.currentOrganization);
  const memberships = useAuthStore((s) => s.memberships);

  const currentMembership = useMemo(() => {
    if (!currentOrganization) return null;
    return memberships.find(
      (m) => m.organizationId === currentOrganization.id && m.status === 'active'
    ) ?? null;
  }, [currentOrganization, memberships]);

  const orgId = currentOrganization?.id ?? '';
  const isReady = Boolean(currentOrganization);

  return {
    orgId,
    organization: currentOrganization,
    membership: currentMembership,
    role: currentMembership?.role ?? null,
    permissions: currentMembership?.permissions ?? [],
    isReady,
  };
}

/**
 * Returns org-scoped query key prefix.
 * Use this to ensure all queries are scoped to the current organization.
 */
export function useOrgQueryKey<T extends readonly unknown[]>(...suffix: T): readonly unknown[] {
  const { orgId } = useOrgContext();
  return useMemo(() => ['org', orgId, ...suffix] as const, [orgId, ...suffix]);
}
