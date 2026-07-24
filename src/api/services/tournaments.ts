// Tournament API Service - Typed wrapper for tournament endpoints

import { apiClient } from '../client';
import { handleApiResponse, ApiError, PaginatedParams, buildQueryString } from '../client';

// ─── TYPES ──────────────────────────────────────────────────────────────────────
export interface Tournament {
  id: string;
  name: string;
  year: number;
  format: string;
  start_date: string;
  end_date: string;
  location: string;
  teams: string[];
}

export interface TournamentStats {
  id: string;
  total_matches: number;
  total_teams: number;
  total_players: number;
  total_runs: number;
  total_wickets: number;
}

export interface TournamentFilters {
  search?: string;
  format?: string;
  year?: string;
}

export interface PaginatedTournaments {
  data: Tournament[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── SERVICE METHODS ─────────────────────────────────────────────────────────────
/**
 * Get paginated list of tournaments with optional filters
 */
export async function getTournaments(params: PaginatedParams & TournamentFilters = {}): Promise<PaginatedTournaments> {
  const queryString = buildQueryString(params);
  const url = `/api/v1/tournaments${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await apiClient.get(url);
    const result = await handleApiResponse<PaginatedTournaments>(response);
    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to fetch tournaments', 500);
  }
}

/**
 * Get tournament by ID
 */
export async function getTournamentById(id: string): Promise<Tournament> {
  try {
    const response = await apiClient.get(`/api/v1/tournaments/${id}`);
    const result = await handleApiResponse<Tournament>(response);
    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new ApiError(`Tournament with id "${id}" not found`, 404);
      }
      throw error;
    }
    throw new ApiError('Failed to fetch tournament', 500);
  }
}

/**
 * Get tournament statistics
 */
export async function getTournamentStats(id: string): Promise<TournamentStats> {
  try {
    const response = await apiClient.get(`/api/v1/tournaments/${id}/stats`);
    const result = await handleApiResponse<TournamentStats>(response);
    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new ApiError(`Tournament with id "${id}" not found`, 404);
      }
      throw error;
    }
    throw new ApiError('Failed to fetch tournament stats', 500);
  }
}

/**
 * Search tournaments by name
 */
export async function searchTournaments(searchQuery: string, params: PaginatedParams = {}): Promise<PaginatedTournaments> {
  return getTournaments({ search: searchQuery, ...params });
}

/**
 * Get tournaments by format
 */
export async function getTournamentsByFormat(format: string, params: PaginatedParams = {}): Promise<PaginatedTournaments> {
  return getTournaments({ format, ...params });
}

// ─── EXPORTS ────────────────────────────────────────────────────────────────────
export default {
  getTournaments,
  getTournamentById,
  getTournamentStats,
  searchTournaments,
  getTournamentsByFormat,
};