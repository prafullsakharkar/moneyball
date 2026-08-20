/* ── API Client ──────────────────────────────────────── */
export { apiClient, setUnauthorizedHandler, uploadFile, downloadFile, batchRequest, buildUrl } from './client';
export { ApiRequestError } from './client';
export type { ApiError } from './client';

/* ── Adapter ─────────────────────────────────────────── */
export { unwrap, transformPagination, buildFilterParams } from './adapter';

/* ── Types ───────────────────────────────────────────── */
export type { ApiResponse, ApiErrorResponse, PaginatedResponse, PaginationParams } from './types';

/* ── Repositories ────────────────────────────────────── */
export { identityRepository, organizationRepository } from './repositories';
export type { IdentityRepository, OrganizationRepository, ListParams } from './repositories';

/* ── Legacy exports (backward compat) ────────────────── */
// These point to repository implementations for existing hooks/pages.
// Remove once all consumers migrate to repository imports.
import { identityRepository } from './repositories/identity';
import { organizationRepository } from './repositories/organization';

export const identityService = identityRepository;
export const organizationService = organizationRepository;
