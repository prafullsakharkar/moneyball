// Match API Service - Typed wrapper for match endpoints

import { apiClient } from '../client';
import { handleApiResponse, ApiError, PaginatedParams, buildQueryString } from '../client';

// ─── TYPES ──────────────────────────────────────────────────────────────────────
export interface Match {
  id: string;
  tournament_id: string;
  team1: string;
  team2: string;
  venue: string;
  date: string;
  time: string;
  status: 'scheduled' | 'live' | 'completed' | 'abandoned';
  score1?: string;
  score2?: string;
  result?: string;
  player_of_the_match?: string;
}

export interface MatchStats {
  id: string;
  team1_runs: number;
  team1_wickets: number;
  team1_overs: number;
  team2_runs: number;
  team2_wickets: number;
  team2_overs: number;
  target?: number;
  margin?: string;
  super_over?: boolean;
}

export interface MatchFilters {
  tournament_id?: string;
  team1?: string;
  team2?: string;
  status?: 'scheduled' | 'live' | 'completed' | 'abandoned';
}

export interface PaginatedMatches {
  data: Match[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── SERVICE METHODS ─────────────────────────────────────────────────────────────
/**
 * Get paginated list of matches with optional filters
 */
export async function getMatches(params: PaginatedParams & MatchFilters = {}): Promise<PaginatedMatches> {
  const queryString = buildQueryString(params);
  const url = `/api/v1/matches${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await apiClient.get(url);
    const result = await handleApiResponse<PaginatedMatches>(response);
    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to fetch matches', 500);
  }
}

/**
 * Get match by ID
 */
export async function getMatchById(id: string): Promise<Match> {
  try {
    const response = await apiClient.get(`/api/v1/matches/${id}`);
    const result = await handleApiResponse<Match>(response);
    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new ApiError(`Match with id "${id}" not found`, 404);
      }
      throw error;
    }
    throw new ApiError('Failed to fetch match', 500);
  }
}

/**
 * Get match statistics
 */
export async function getMatchStats(id: string): Promise<MatchStats> {
  try {
    const response = await apiClient.get(`/api/v1/matches/${id}/stats`);
    const result = await handleApiResponse<MatchStats>(response);
    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new ApiError(`Match with id "${id}" not found`, 404);
      }
      throw error;
    }
    throw new ApiError('Failed to fetch match stats', 500);
  }
}

/**
 * Get matches by tournament
 */
export async function getMatchesByTournament(tournamentId: string, params: PaginatedParams = {}): Promise<PaginatedMatches> {
  return getMatches({ tournament_id: tournamentId, ...params });
}

/**
 * Get live matches
 */
export async function getLiveMatches(params: PaginatedParams = {}): Promise<PaginatedMatches> {
  return getMatches({ status: 'live', ...params });
}

/**
 * Get completed matches
 */
export async function getCompletedMatches(params: PaginatedParams = {}): Promise<PaginatedMatches> {
  return getMatches({ status: 'completed', ...params });
}

// ─── EXPORTS ────────────────────────────────────────────────────────────────────
export default {
  getMatches,
  getMatchById,
  getMatchStats,
  getMatchesByTournament,
  getLiveMatches,
  getCompletedMatches,
};