/**
 * Cricket query hooks using TanStack Query.
 * ============================================
 * All hooks are tenant-isolated — they use the current org context.
 * Layered data flow: Component → Feature Hook → TanStack Query → Service → Repository.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  matchService,
  teamService,
  tournamentService,
  analyticsService,
  aiService,
  mediaService,
} from '@api/services/cricketService';
import { useOrgContext } from './useOrgContext';
import type { ListParams } from '@api/repositories/types';

/* ── Query Keys ───────────────────────────────────────── */

export const matchQueryKeys = {
  all: (orgId: string) => ['org', orgId, 'matches'] as const,
  list: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'matches', 'list', params] as const,
  detail: (orgId: string, matchId: string) => ['org', orgId, 'matches', matchId] as const,
  live: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'matches', 'live', params] as const,
  upcoming: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'matches', 'upcoming', params] as const,
  recent: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'matches', 'recent', params] as const,
};

export const teamQueryKeys = {
  all: (orgId: string) => ['org', orgId, 'teams'] as const,
  list: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'teams', 'list', params] as const,
  detail: (orgId: string, teamId: string) => ['org', orgId, 'teams', teamId] as const,
};

export const tournamentQueryKeys = {
  all: (orgId: string) => ['org', orgId, 'tournaments'] as const,
  list: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'tournaments', 'list', params] as const,
  detail: (orgId: string, tournamentId: string) => ['org', orgId, 'tournaments', tournamentId] as const,
  standings: (orgId: string, tournamentId: string) => ['org', orgId, 'tournaments', tournamentId, 'standings'] as const,
};

export const analyticsQueryKeys = {
  all: (orgId: string) => ['org', orgId, 'analytics'] as const,
  questions: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'analytics', 'questions', params] as const,
  insights: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'analytics', 'insights', params] as const,
};

export const aiQueryKeys = {
  all: (orgId: string) => ['org', orgId, 'ai'] as const,
  insights: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'ai', 'insights', params] as const,
  conversation: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'ai', 'conversation', params] as const,
};

export const mediaQueryKeys = {
  all: (orgId: string) => ['org', orgId, 'media'] as const,
  assets: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'media', 'assets', params] as const,
  asset: (orgId: string, assetId: string) => ['org', orgId, 'media', 'assets', assetId] as const,
  videos: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'media', 'videos', params] as const,
  video: (orgId: string, videoId: string) => ['org', orgId, 'media', 'videos', videoId] as const,
};

/* ── Matches ──────────────────────────────────────────── */

export function useMatches(params?: ListParams) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: matchQueryKeys.list(orgId, params as Record<string, unknown>),
    queryFn: () => matchService.list(params),
    enabled: Boolean(orgId),
  });
}

export function useMatch(matchId: string) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: matchQueryKeys.detail(orgId, matchId),
    queryFn: () => matchService.get(matchId),
    enabled: Boolean(orgId) && Boolean(matchId),
  });
}

export function useLiveMatches(params?: ListParams) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: matchQueryKeys.live(orgId, params as Record<string, unknown>),
    queryFn: () => matchService.getLive(params),
    enabled: Boolean(orgId),
  });
}

export function useUpcomingMatches(params?: ListParams) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: matchQueryKeys.upcoming(orgId, params as Record<string, unknown>),
    queryFn: () => matchService.getUpcoming(params),
    enabled: Boolean(orgId),
  });
}

export function useRecentMatches(params?: ListParams) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: matchQueryKeys.recent(orgId, params as Record<string, unknown>),
    queryFn: () => matchService.getRecent(params),
    enabled: Boolean(orgId),
  });
}

/* ── Teams ────────────────────────────────────────────── */

export function useTeams(params?: ListParams) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: teamQueryKeys.list(orgId, params as Record<string, unknown>),
    queryFn: () => teamService.list(params),
    enabled: Boolean(orgId),
  });
}

export function useTeam(teamId: string) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: teamQueryKeys.detail(orgId, teamId),
    queryFn: () => teamService.get(teamId),
    enabled: Boolean(orgId) && Boolean(teamId),
  });
}

/* ── Tournaments ──────────────────────────────────────── */

export function useTournaments(params?: ListParams) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: tournamentQueryKeys.list(orgId, params as Record<string, unknown>),
    queryFn: () => tournamentService.list(params),
    enabled: Boolean(orgId),
  });
}

export function useTournament(tournamentId: string) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: tournamentQueryKeys.detail(orgId, tournamentId),
    queryFn: () => tournamentService.get(tournamentId),
    enabled: Boolean(orgId) && Boolean(tournamentId),
  });
}

export function useTournamentStandings(tournamentId: string) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: tournamentQueryKeys.standings(orgId, tournamentId),
    queryFn: () => tournamentService.getStandings(tournamentId),
    enabled: Boolean(orgId) && Boolean(tournamentId),
  });
}

/* ── Analytics ────────────────────────────────────────── */

export function useAnalyticsQuestions(params?: ListParams) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: analyticsQueryKeys.questions(orgId, params as Record<string, unknown>),
    queryFn: () => analyticsService.getQuestions(params),
    enabled: Boolean(orgId),
  });
}

export function useAnalyticsInsights(params?: ListParams) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: analyticsQueryKeys.insights(orgId, params as Record<string, unknown>),
    queryFn: () => analyticsService.getInsights(params),
    enabled: Boolean(orgId),
  });
}

/* ── AI / Insights ────────────────────────────────────── */

export function useAiInsights(params?: ListParams) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: aiQueryKeys.insights(orgId, params as Record<string, unknown>),
    queryFn: () => aiService.getInsights(params),
    enabled: Boolean(orgId),
  });
}

export function useAiConversation(params?: ListParams) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: aiQueryKeys.conversation(orgId, params as Record<string, unknown>),
    queryFn: () => aiService.getConversation(params),
    enabled: Boolean(orgId),
  });
}

export function useAiAsk() {
  const { orgId } = useOrgContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (question: string) => aiService.ask(question),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: aiQueryKeys.conversation(orgId) });
    },
  });
}

/* ── Media ────────────────────────────────────────────── */

export function useMediaAssets(params?: ListParams) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: mediaQueryKeys.assets(orgId, params as Record<string, unknown>),
    queryFn: () => mediaService.listAssets(params),
    enabled: Boolean(orgId),
  });
}

export function useMediaAsset(assetId: string) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: mediaQueryKeys.asset(orgId, assetId),
    queryFn: () => mediaService.getAsset(assetId),
    enabled: Boolean(orgId) && Boolean(assetId),
  });
}

export function useMediaVideos(params?: ListParams) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: mediaQueryKeys.videos(orgId, params as Record<string, unknown>),
    queryFn: () => mediaService.listVideos(params),
    enabled: Boolean(orgId),
  });
}

export function useMediaVideo(videoId: string) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: mediaQueryKeys.video(orgId, videoId),
    queryFn: () => mediaService.getVideo(videoId),
    enabled: Boolean(orgId) && Boolean(videoId),
  });
}
