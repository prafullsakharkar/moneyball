/**
 * Player Service
 * ============================================
 * Business-logic layer for the Participants domain (players).
 *
 * Layered data flow (Frontend Architecture Rule):
 *   Component → Feature Hook → TanStack Query → Service → Repository → API Client → Adapter → MSW
 *
 * Hooks and components must never call repositories directly.
 */
import { playerRepository } from '../repositories/player';
import type { PlayerRepository, ListParams } from '../repositories/types';
import type {
  CreatePlayerRequest,
  UpdatePlayerRequest,
  BulkPlayerUpdateRequest,
} from '@domain/index';

/**
 * Player service exposing the same contract as the repository.
 */
export const playerService: PlayerRepository = {
  list: (params?: ListParams) => playerRepository.list(params),
  get: (playerId: string) => playerRepository.get(playerId),
  create: (data: CreatePlayerRequest) => playerRepository.create(data),
  update: (playerId: string, data: UpdatePlayerRequest) => playerRepository.update(playerId, data),
  delete: (playerId: string) => playerRepository.delete(playerId),
  bulkUpdate: (data: BulkPlayerUpdateRequest) => playerRepository.bulkUpdate(data),
  bulkDelete: (ids: string[]) => playerRepository.bulkDelete(ids),
};
