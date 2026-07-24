// React Query hooks for match data

import { useQuery, QueryKey } from '@tanstack/react-query';
import * as matchService from '../api/services/matches';
import { PaginatedParams } from '../api/client';

// ─── QUERY KEYS ───────────────────────────────────────────────────────────────────
export const matchQueryKeys = {
  all: ['matches'] as QueryKey,
  lists: (params: PaginatedParams & matchService.MatchFilters) => 
    [...matchQueryKeys.all, 'list', params] as QueryKey,
  details: () => [...matchQueryKeys.all, 'detail'] as QueryKey,
  detail: (id: string) => [...matchQueryKeys.details(), id] as QueryKey,
  stats: (id: string) => [...matchQueryKeys.detail(id), 'stats'] as QueryKey,
} as const;

// ─── HOOKS ────────────────────────────────────────────────────────────────────────
/**
 * Hook to fetch paginated list of matches
 */
export function useMatches(params: PaginatedParams & matchService.MatchFilters = {}) {
  return useQuery({
    queryKey: matchQueryKeys.lists(params),
    queryFn: () => matchService.getMatches(params),
  });
}

/**
 * Hook to fetch a single match by ID
 */
export function useMatch(id: string) {
  return useQuery({
    queryKey: matchQueryKeys.detail(id),
    queryFn: () => matchService.getMatchById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch match statistics
 */
export function useMatchStats(id: string) {
  return useQuery({
    queryKey: matchQueryKeys.stats(id),
    queryFn: () => matchService.getMatchStats(id),
    enabled: !!id,
  });
}

/**
 * Hook to get matches by tournament
 */
export function useMatchesByTournament(tournamentId: string, params: PaginatedParams = {}) {
  return useQuery({
    queryKey: matchQueryKeys.lists({ tournament_id: tournamentId, ...params }),
    queryFn: () => matchService.getMatchesByTournament(tournamentId, params),
    enabled: !!tournamentId,
  });
}

/**
 * Hook to get live matches
 */
export function useLiveMatches(params: PaginatedParams = {}) {
  return useQuery({
    queryKey: matchQueryKeys.lists({ status: 'live', ...params }),
    queryFn: () => matchService.getLiveMatches(params),
  });
}

/**
 * Hook to get completed matches
 */
export function useCompletedMatches(params: PaginatedParams = {}) {
  return useQuery({
    queryKey: matchQueryKeys.lists({ status: 'completed', ...params }),
    queryFn: () => matchService.getCompletedMatches(params),
  });
}

// ─── EXPORTS ────────────────────────────────────────────────────────────────────
export default {
  useMatches,
  useMatch,
  useMatchStats,
  useMatchesByTournament,
  useLiveMatches,
  useCompletedMatches,
};