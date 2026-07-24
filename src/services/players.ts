// Players Service - Handles all player-related API requests

import { apiClient, handleApiResponse } from '../api/client';
import { Player } from '../lib/mock-data';

/**
 * Player interface
 */
export interface PlayerService {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  nationality: string;
  batting_style: string;
  bowling_style: string;
  player_type: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  matches: number;
  runs: number;
  wickets: number;
  average: number;
}

/**
 * Pagination response interface
 */
export interface PaginationResponse {
  data: Player[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Get players with pagination
 */
export async function getPlayers({
  page = 1,
  limit = 12,
  search = '',
  type = '',
}: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}): Promise<PaginationResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
    type,
  });

  const response = await handleApiResponse<PaginationResponse>(apiClient.get(`/players?${params}`));
  return response.data;
}

/**
 * Get player by ID
 */
export async function getPlayerById(id: string): Promise<Player | null> {
  try {
    const response = await handleApiResponse<Player>(apiClient.get(`/players/${id}`));
    return response.data;
  } catch {
    return null;
  }
}