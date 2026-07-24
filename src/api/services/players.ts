// Player API Service - Typed wrapper for player endpoints

import { apiClient } from '../client';
import { handleApiResponse, ApiError, PaginatedParams, buildQueryString } from '../client';

// ─── TYPES ──────────────────────────────────────────────────────────────────────
export interface Player {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  nationality: string;
  batting_style: string;
  bowling_style?: string;
  player_type: string;
  matches?: number;
  runs?: number;
  wickets?: number;
  average?: number;
}

export interface PlayerStats {
  id: string;
  total_matches: number;
  total_runs: number;
  total_wickets: number;
  batting_average: number;
  strike_rate: number;
  economy_rate: number;
}

export interface PlayerFilters {
  search?: string;
  nationality?: string;
  batting_style?: string;
  bowling_style?: string;
  player_type?: string;
}

export interface PaginatedPlayers {
  data: Player[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── SERVICE METHODS ─────────────────────────────────────────────────────────────
/**
 * Get paginated list of players with optional filters
 */
export async function getPlayers(params: PaginatedParams & PlayerFilters = {}): Promise<PaginatedPlayers> {
  const queryString = buildQueryString(params);
  const url = `/api/v1/players${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await apiClient.get(url);
    const result = await handleApiResponse<PaginatedPlayers>(response);
    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to fetch players', 500);
  }
}

/**
 * Get player by ID
 */
export async function getPlayerById(id: string): Promise<Player> {
  try {
    const response = await apiClient.get(`/api/v1/players/${id}`);
    const result = await handleApiResponse<Player>(response);
    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new ApiError(`Player with id "${id}" not found`, 404);
      }
      throw error;
    }
    throw new ApiError('Failed to fetch player', 500);
  }
}

/**
 * Get player statistics
 */
export async function getPlayerStats(id: string): Promise<PlayerStats> {
  try {
    const response = await apiClient.get(`/api/v1/players/${id}/stats`);
    const result = await handleApiResponse<PlayerStats>(response);
    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new ApiError(`Player with id "${id}" not found`, 404);
      }
      throw error;
    }
    throw new ApiError('Failed to fetch player stats', 500);
  }
}

/**
 * Search players by name
 */
export async function searchPlayers(searchQuery: string, params: PaginatedParams = {}): Promise<PaginatedPlayers> {
  return getPlayers({ search: searchQuery, ...params });
}

/**
 * Get players by nationality
 */
export async function getPlayersByNationality(nationality: string, params: PaginatedParams = {}): Promise<PaginatedPlayers> {
  return getPlayers({ nationality, ...params });
}

// ─── EXPORTS ────────────────────────────────────────────────────────────────────
export default {
  getPlayers,
  getPlayerById,
  getPlayerStats,
  searchPlayers,
  getPlayersByNationality,
};