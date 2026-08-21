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

/* ── Services ────────────────────────────────────────── */
// Services are the ONLY layer hooks/components may depend on.
// Component → Feature Hook → TanStack Query → Service → Repository → API Client → Adapter → MSW
export { identityService, organizationService } from './services';
