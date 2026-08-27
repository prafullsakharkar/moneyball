/**
 * Player query hooks using TanStack Query.
 * ============================================
 * All hooks are tenant-isolated — they use the current org context.
 * Layered data flow: Component → Feature Hook → TanStack Query → Service → Repository.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { playerService } from '@api/services/playerService';
import { useOrgContext } from './useOrgContext';
import type { ListParams } from '@api/repositories/types';
import type {
  CreatePlayerRequest,
  UpdatePlayerRequest,
  BulkPlayerUpdateRequest,
} from '@domain/index';

export const playerQueryKeys = {
  all: (orgId: string) => ['org', orgId, 'players'] as const,
  list: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'players', 'list', params] as const,
  detail: (orgId: string, playerId: string) => ['org', orgId, 'players', playerId] as const,
};

/* ── List ─────────────────────────────────────────────── */

export function usePlayers(params?: ListParams) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: playerQueryKeys.list(orgId, params as Record<string, unknown>),
    queryFn: () => playerService.list(params),
    enabled: Boolean(orgId),
  });
}

export function usePlayer(playerId: string) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: playerQueryKeys.detail(orgId, playerId),
    queryFn: () => playerService.get(playerId),
    enabled: Boolean(orgId) && Boolean(playerId),
  });
}

/* ── Mutations ───────────────────────────────────────── */

export function useCreatePlayer() {
  const { orgId } = useOrgContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePlayerRequest) => playerService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playerQueryKeys.list(orgId) });
    },
  });
}

export function useUpdatePlayer() {
  const { orgId } = useOrgContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ playerId, data }: { playerId: string; data: UpdatePlayerRequest }) =>
      playerService.update(playerId, data),
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: playerQueryKeys.list(orgId) });
      qc.invalidateQueries({ queryKey: playerQueryKeys.detail(orgId, variables.playerId) });
    },
  });
}

export function useDeletePlayer() {
  const { orgId } = useOrgContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (playerId: string) => playerService.delete(playerId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playerQueryKeys.list(orgId) });
    },
  });
}

export function useBulkUpdatePlayers() {
  const { orgId } = useOrgContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: BulkPlayerUpdateRequest) => playerService.bulkUpdate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playerQueryKeys.list(orgId) });
    },
  });
}

export function useBulkDeletePlayers() {
  const { orgId } = useOrgContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => playerService.bulkDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playerQueryKeys.list(orgId) });
    },
  });
}
