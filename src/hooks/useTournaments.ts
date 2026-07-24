// React Query hooks for tournament data

import { useQuery, QueryKey } from '@tanstack/react-query';
import * as tournamentService from '../api/services/tournaments';
import { PaginatedParams } from '../api/client';

// ─── QUERY KEYS ───────────────────────────────────────────────────────────────────
export const tournamentQueryKeys = {
  all: ['tournaments'] as QueryKey,
  lists: (params: PaginatedParams & tournamentService.TournamentFilters) => 
    [...tournamentQueryKeys.all, 'list', params] as QueryKey,
  details: () => [...tournamentQueryKeys.all, 'detail'] as QueryKey,
  detail: (id: string) => [...tournamentQueryKeys.details(), id] as QueryKey,
  stats: (id: string) => [...tournamentQueryKeys.detail(id), 'stats'] as QueryKey,
} as const;

// ─── HOOKS ────────────────────────────────────────────────────────────────────────
/**
 * Hook to fetch paginated list of tournaments
 */
export function useTournaments(params: PaginatedParams & tournamentService.TournamentFilters = {}) {
  return useQuery({
    queryKey: tournamentQueryKeys.lists(params),
    queryFn: () => tournamentService.getTournaments(params),
  });
}

/**
 * Hook to fetch a single tournament by ID
 */
export function useTournament(id: string) {
  return useQuery({
    queryKey: tournamentQueryKeys.detail(id),
    queryFn: () => tournamentService.getTournamentById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch tournament statistics
 */
export function useTournamentStats(id: string) {
  return useQuery({
    queryKey: tournamentQueryKeys.stats(id),
    queryFn: () => tournamentService.getTournamentStats(id),
    enabled: !!id,
  });
}

/**
 * Hook to search tournaments
 */
export function useSearchTournaments(searchQuery: string, params: PaginatedParams = {}) {
  return useQuery({
    queryKey: tournamentQueryKeys.lists({ search: searchQuery, ...params }),
    queryFn: () => tournamentService.searchTournaments(searchQuery, params),
    enabled: !!searchQuery,
  });
}

/**
 * Hook to get tournaments by format
 */
export function useTournamentsByFormat(format: string, params: PaginatedParams = {}) {
  return useQuery({
    queryKey: tournamentQueryKeys.lists({ format, ...params }),
    queryFn: () => tournamentService.getTournamentsByFormat(format, params),
    enabled: !!format,
  });
}

// ─── EXPORTS ────────────────────────────────────────────────────────────────────
export default {
  useTournaments,
  useTournament,
  useTournamentStats,
  useSearchTournaments,
  useTournamentsByFormat,
};