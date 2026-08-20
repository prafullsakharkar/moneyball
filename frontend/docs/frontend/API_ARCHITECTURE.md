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

### 2. Service Layer
**Files:** `src/api/identity.ts`, `src/api/<domain>.ts`

- Thin wrappers around API client calls
- Typed request/response interfaces
- One service per domain area (identity, players, teams, etc.)
- No business logic — just HTTP calls

### 3. Repository Layer
**Files:** `src/modules/<domain>/services/repository.ts`

- Business logic and data transformation
- TanStack Query key management
- Cache invalidation strategies
- Used by hooks, never by components directly

### 4. Hook Layer
**Files:** `src/modules/<domain>/hooks/use<Domain>.ts`

- TanStack Query `useQuery` / `useMutation` wrappers
- Organization-scoped query keys
- Loading/error state management
- The only layer components import from

## Request Flow

```
Component → usePlayers() → useQuery(['players', orgId]) → playerRepository.list(orgId) → playerService.list(orgId) → apiClient.get('players')
```

## Authentication

- Access token stored in localStorage (`cricketos_access_token`)
- Refresh token stored in localStorage (`cricketos_refresh_token`)
- Ky interceptor attaches `Authorization: Bearer <token>` to all requests
- 401 responses trigger automatic token refresh
- If refresh fails, user is logged out and redirected to `/auth/login`

## Organization Scoping

All API calls are scoped to the current organization:

```typescript
// In repository
listPlayers(orgId: string, params: PaginationParams) {
  return playerService.list(orgId, params);
}

// In hook
export function usePlayers(params?: PaginationParams) {
  const orgId = useOrganizationStore(s => s.currentOrganization?.id);
  return useQuery({
    queryKey: queryKeys.players.list(orgId!, params),
    queryFn: () => playerRepository.list(orgId!, params),
    enabled: !!orgId,
  });
}
```

## MSW Integration

During development and testing, MSW intercepts API calls:

- **Browser:** `src/mocks/browser.ts` — Service worker setup
- **Tests:** `src/mocks/server.ts` — Node.js server setup
- **Handlers:** `src/mocks/handlers.ts` — All mock API responses

MSW handlers are organized by domain and return realistic mock data.
