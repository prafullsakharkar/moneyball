/**
 * Player Repository Implementation
 * ============================================
 * Data operations for the Participants domain (players).
 * Follows the layered architecture: Repository → API Client → Adapter → MSW.
 */
import { apiClient } from '../client';
import { unwrap, transformPagination } from '../adapter';
import type { ApiResponse } from '../types';
import type { PlayerRepository } from './types';
import type { Player } from '@domain/index';

function qs(params?: Record<string, unknown>): string {
  if (!params) return '';
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export const playerRepository: PlayerRepository = {
  async list(params) {
    const resp = await apiClient.get(`players${qs(params as Record<string, unknown>)}`).json<{ data?: unknown }>();
    return transformPagination<Player>(resp.data ?? resp, params?.page, params?.limit);
  },

  async get(playerId) {
    const resp = await apiClient.get(`players/${playerId}`).json<ApiResponse<Player>>();
    return unwrap(resp);
  },

  async create(data) {
    const resp = await apiClient.post('players', { json: data }).json<ApiResponse<Player>>();
    return unwrap(resp);
  },

  async update(playerId, data) {
    const resp = await apiClient.patch(`players/${playerId}`, { json: data }).json<ApiResponse<Player>>();
    return unwrap(resp);
  },

  async delete(playerId) {
    await apiClient.delete(`players/${playerId}`);
  },

  async bulkUpdate(data) {
    const resp = await apiClient.post('players/bulk-update', { json: data }).json<ApiResponse<Player[]>>();
    return unwrap(resp);
  },

  async bulkDelete(ids) {
    await apiClient.post('players/bulk-delete', { json: { ids } });
  },
};
