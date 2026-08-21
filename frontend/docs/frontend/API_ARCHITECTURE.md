# CricketOS API Architecture

## Overview

The frontend communicates with the backend through a layered API architecture that enforces separation of concerns and enables easy testing with MSW.

## Layers

### 1. API Client (Ky Instance)
**File:** `src/api/client.ts`

- Configured Ky instance with base URL, timeout, and interceptors
- Automatic JWT token injection via `beforeRequest` hook
- 401 handling via `afterResponse` hook (token refresh + redirect)
- Components never import this directly

### 2. Adapter Layer
**File:** `src/api/adapter.ts`

- Transforms Django REST response shapes into the application's canonical types
- `unwrap()` — extracts `data` from `ApiResponse<T>`
- `transformPagination()` — maps Django pagination to `PaginatedResponse<T>`
- `transformResource()` / `transformList()` — field mapping
- `extractValidationErrors()` — normalizes field errors for forms
- `buildFilterParams()` — builds query-string filter params

### 3. Repository Layer
**Files:** `src/api/repositories/<domain>.ts`

- Concrete HTTP calls via the API client
- Applies adapter transformations to responses
- Adds `X-Organization-Id` header for tenant isolation
- Implements the repository interface from `src/api/repositories/types.ts`
- No business logic — just HTTP + transformation

### 4. Service Layer
**Files:** `src/api/services/<domain>Service.ts`

- Business logic and tenant-isolation enforcement
- Every organization-scoped method requires an explicit `orgId`
- Delegates to the matching repository
- Implements the same interface as the repository (e.g. `OrganizationRepository`)
- Consumed by hooks, never by components directly

### 5. Hook Layer
**Files:** `src/hooks/use<Domain>.ts` (or `src/modules/<domain>/hooks/`)

- TanStack Query `useQuery` / `useMutation` wrappers
- Organization-scoped query keys
- Loading/error state management
- The only layer components import from

## Request Flow

```
Component → useOrganizationMembers() → useQuery(['org', orgId, 'members']) → organizationService.getMembers(orgId) → organizationRepository.getMembers(orgId) → apiClient.get('organizations/:orgId/members') → adapter.transformPagination()
```

## Authentication

- Access token stored in localStorage (`cricketos_access_token`)
- Refresh token stored in localStorage (`cricketos_refresh_token`)
- Ky interceptor attaches `Authorization: Bearer <token>` to all requests
- 401 responses trigger automatic token refresh
- If refresh fails, user is logged out and redirected to `/auth/login`

## Organization Scoping

All API calls are scoped to the current organization. The active org is
provided by the `OrganizationProvider` context (see `src/providers/OrganizationProvider.tsx`),
which exposes `orgId`, `organization`, `organizations`, `membership`, `role`,
`permissions`, `isReady`, and `isSwitching`.

```typescript
// In service — tenant isolation enforced at the boundary
getMembers(orgId: string, params?: ListParams) {
  return organizationRepository.getMembers(orgId, params);
}

// In hook — reads org from context, scopes query key
export function useOrganizationMembers(params?: ListParams) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: useOrgQueryKey('organization', 'members', params),
    queryFn: () => organizationService.getMembers(orgId!, params),
    enabled: !!orgId,
  });
}
```

When the organization switches, the `orgId` changes, query keys change, and all
org-scoped queries automatically refetch with the new tenant context.

## MSW Integration

During development and testing, MSW intercepts API calls:

- **Browser:** `src/mocks/browser.ts` — Service worker setup
- **Tests:** `src/mocks/server.ts` — Node.js server setup
- **Handlers:** `src/mocks/handlers.ts` — All mock API responses

MSW handlers are organized by domain and return realistic mock data.
