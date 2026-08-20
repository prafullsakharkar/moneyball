import { QueryClient } from '@tanstack/react-query';

/**
 * Global QueryClient configuration.
 * Stale time and retry behavior tuned for enterprise use.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 minutes
      gcTime: 30 * 60 * 1000,        // 30 minutes (garbage collection)
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 0,
    },
  },
});

/**
 * Query key factory for consistent key management.
 * Usage: queryKeys.players.list({ orgId, page })
 */
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
    sessions: () => [...queryKeys.auth.all, 'sessions'] as const,
  },
  organizations: {
    all: ['organizations'] as const,
    list: () => [...queryKeys.organizations.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.organizations.all, 'detail', id] as const,
  },
  players: {
    all: ['players'] as const,
    list: (orgId: string, params?: Record<string, unknown>) =>
      [...queryKeys.players.all, 'list', orgId, params] as const,
    detail: (orgId: string, id: string) =>
      [...queryKeys.players.all, 'detail', orgId, id] as const,
  },
  teams: {
    all: ['teams'] as const,
    list: (orgId: string, params?: Record<string, unknown>) =>
      [...queryKeys.teams.all, 'list', orgId, params] as const,
    detail: (orgId: string, id: string) =>
      [...queryKeys.teams.all, 'detail', orgId, id] as const,
  },
  matches: {
    all: ['matches'] as const,
    list: (orgId: string, params?: Record<string, unknown>) =>
      [...queryKeys.matches.all, 'list', orgId, params] as const,
    detail: (orgId: string, id: string) =>
      [...queryKeys.matches.all, 'detail', orgId, id] as const,
  },
  competitions: {
    all: ['competitions'] as const,
    list: (orgId: string, params?: Record<string, unknown>) =>
      [...queryKeys.competitions.all, 'list', orgId, params] as const,
    detail: (orgId: string, id: string) =>
      [...queryKeys.competitions.all, 'detail', orgId, id] as const,
  },
} as const;
