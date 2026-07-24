import { useQuery } from '@tanstack/react-query';
import { getTeams, getTeamById } from '../api/services/teams';
import type { Team, PaginatedTeams, TeamFilters } from '../api/services/teams';
import type { PaginatedParams } from '../api/client';

export function useTeams(params?: PaginatedParams & TeamFilters) {
  return useQuery({
    queryKey: ['teams', params],
    queryFn: () => getTeams(params || {}),
  });
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: ['team', id],
    queryFn: () => getTeamById(id),
  });
}