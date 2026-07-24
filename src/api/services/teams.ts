// Team API Service - Typed wrapper for team endpoints

import { apiClient } from '../client';
import { handleApiResponse, ApiError, PaginatedParams, buildQueryString } from '../client';

// ─── TYPES ──────────────────────────────────────────────────────────────────────
export interface Team {
  id: string;
  name: string;
  short_name: string;
  city: string;
  home_venue: string;
  primary_color: string;
  secondary_color: string;
  founded_year: number;
  coach: string;
  captain: string;
  total_matches?: number;
  total_wins?: number;
  total_losses?: number;
  win_percentage?: number;
  nrr?: number;
  current_streak?: string;
}

export interface TeamFilters {
  search?: string;
  city?: string;
}

export type { PaginatedParams } from '../client';

export interface PaginatedTeams {
  data: Team[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── SERVICE METHODS ─────────────────────────────────────────────────────────────
/**
 * Get paginated list of teams with optional filters
 */
export async function getTeams(params: PaginatedParams & TeamFilters = {}): Promise<PaginatedTeams> {
  const queryString = buildQueryString(params);
  const url = `/api/v1/teams${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await apiClient.get(url);
    const result = await handleApiResponse<PaginatedTeams>(response);
    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to fetch teams', 500);
  }
}

/**
 * Get team by ID
 */
export async function getTeamById(id: string): Promise<Team> {
  try {
    const response = await apiClient.get(`/api/v1/teams/${id}`);
    const result = await handleApiResponse<Team>(response);
    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new ApiError(`Team with id "${id}" not found`, 404);
      }
      throw error;
    }
    throw new ApiError('Failed to fetch team', 500);
  }
}

// ─── EXPORTS ────────────────────────────────────────────────────────────────────
export default {
  getTeams,
  getTeamById,
};
