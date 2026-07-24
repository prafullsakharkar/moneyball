// React Query hooks for player data

import { useQuery, useInfiniteQuery, QueryKey, useQueryClient } from '@tanstack/react-query';
import * as playerService from '../api/services/players';
import { PaginatedParams } from '../api/client';

// ─── QUERY KEYS ───────────────────────────────────────────────────────────────────
export const playerQueryKeys = {
  all: ['players'] as QueryKey,
  lists: (params: PaginatedParams & playerService.PlayerFilters) => 
    [...playerQueryKeys.all, 'list', params] as QueryKey,
  details: () => [...playerQueryKeys.all, 'detail'] as QueryKey,
  detail: (id: string) => [...playerQueryKeys.details(), id] as QueryKey,
  stats: (id: string) => [...playerQueryKeys.detail(id), 'stats'] as QueryKey,
} as const;

// ─── HOOKS ────────────────────────────────────────────────────────────────────────
/**
 * Hook to fetch paginated list of players
 */
export function usePlayers(params: PaginatedParams & playerService.PlayerFilters = {}) {
  return useQuery({
    queryKey: playerQueryKeys.lists(params),
    queryFn: () => playerService.getPlayers(params),
  });
}

/**
 * Hook to fetch a single player by ID
 */
export function usePlayer(id: string) {
  return useQuery({
    queryKey: playerQueryKeys.detail(id),
    queryFn: () => playerService.getPlayerById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch player statistics
 */
export function usePlayerStats(id: string) {
  return useQuery({
    queryKey: playerQueryKeys.stats(id),
    queryFn: () => playerService.getPlayerStats(id),
    enabled: !!id,
  });
}

/**
 * Hook to search players
 */
export function useSearchPlayers(searchQuery: string, params: PaginatedParams = {}) {
  return useQuery({
    queryKey: playerQueryKeys.lists({ search: searchQuery, ...params }),
    queryFn: () => playerService.searchPlayers(searchQuery, params),
    enabled: !!searchQuery,
  });
}

/**
 * Hook to get players by nationality
 */
export function usePlayersByNationality(nationality: string, params: PaginatedParams = {}) {
  return useQuery({
    queryKey: playerQueryKeys.lists({ nationality, ...params }),
    queryFn: () => playerService.getPlayersByNationality(nationality, params),
    enabled: !!nationality,
  });
}

// ─── EXPORTS ────────────────────────────────────────────────────────────────────
export default {
  usePlayers,
  usePlayer,
  usePlayerStats,
  useSearchPlayers,
  usePlayersByNationality,
};