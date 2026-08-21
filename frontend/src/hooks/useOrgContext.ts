/**
 * Tenant isolation hook.
 * ============================================
 * Provides the current organization context for all org-scoped queries and
 * mutations. This is the public API over the OrganizationContext provider.
 *
 * Components must use this to ensure they never display cross-tenant data.
 * The underlying state is provided by <OrganizationProvider> (see
 * `@providers/OrganizationProvider`).
 */
import { useOrganizationContext } from '@providers/OrganizationProvider';

/**
 * Returns the current organization context.
 * Every organization-aware component must use this hook.
 */
export function useOrgContext() {
  return useOrganizationContext();
}

/**
 * Returns org-scoped query key prefix.
 * Use this to ensure all queries are scoped to the current organization.
 */
export function useOrgQueryKey<T extends readonly unknown[]>(...suffix: T): readonly unknown[] {
  const { orgId } = useOrgContext();
  // TanStack Query performs deep equality on query keys, so a fresh array is safe.
  return ['org', orgId, ...suffix] as const;
}
