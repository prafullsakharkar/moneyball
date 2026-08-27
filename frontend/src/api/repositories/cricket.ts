/**
 * Cricket Repository Implementations
 * ============================================
 * Data operations for the Competition, Participants, Media, and Intelligence
 * domains (matches, teams, tournaments, analytics, AI, media).
 *
 * Follows the layered architecture: Repository → API Client → Adapter → MSW.
 */
import { apiClient } from '../client';
import { unwrap, transformPagination } from '../adapter';
import type { ApiResponse } from '../types';
import type {
  MatchRepository,
  TeamRepository,
  TournamentRepository,
  AnalyticsRepository,
  AiRepository,
  MediaRepository,
} from './types';
import type {
  Match,
  Team,
  Tournament,
  AnalyticsQuestion,
  AnalyticsInsight,
  AiInsight,
  AiConversationMessage,
  MediaAsset,
  VideoAsset,
} from '@domain/index';

function qs(params?: Record<string, unknown>): string {
  if (!params) return '';
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

/* ── Match Repository ─────────────────────────────────── */

export const matchRepository: MatchRepository = {
  async list(params) {
    const resp = await apiClient.get(`matches${qs(params as Record<string, unknown>)}`).json<{ data?: unknown }>();
    return transformPagination<Match>(resp.data ?? resp, params?.page, params?.limit);
  },

  async get(matchId) {
    const resp = await apiClient.get(`matches/${matchId}`).json<ApiResponse<Match>>();
    return unwrap(resp);
  },

  async getLive(params) {
    const resp = await apiClient.get(`matches/live${qs(params as Record<string, unknown>)}`).json<{ data?: unknown }>();
    return transformPagination<Match>(resp.data ?? resp, params?.page, params?.limit);
  },

  async getUpcoming(params) {
    const resp = await apiClient.get(`matches/upcoming${qs(params as Record<string, unknown>)}`).json<{ data?: unknown }>();
    return transformPagination<Match>(resp.data ?? resp, params?.page, params?.limit);
  },

  async getRecent(params) {
    const resp = await apiClient.get(`matches/recent${qs(params as Record<string, unknown>)}`).json<{ data?: unknown }>();
    return transformPagination<Match>(resp.data ?? resp, params?.page, params?.limit);
  },
};

/* ── Team Repository ──────────────────────────────────── */

export const teamRepository: TeamRepository = {
  async list(params) {
    const resp = await apiClient.get(`teams${qs(params as Record<string, unknown>)}`).json<{ data?: unknown }>();
    return transformPagination<Team>(resp.data ?? resp, params?.page, params?.limit);
  },

  async get(teamId) {
    const resp = await apiClient.get(`teams/${teamId}`).json<ApiResponse<Team>>();
    return unwrap(resp);
  },
};

/* ── Tournament Repository ────────────────────────────── */

export const tournamentRepository: TournamentRepository = {
  async list(params) {
    const resp = await apiClient.get(`tournaments${qs(params as Record<string, unknown>)}`).json<{ data?: unknown }>();
    return transformPagination<Tournament>(resp.data ?? resp, params?.page, params?.limit);
  },

  async get(tournamentId) {
    const resp = await apiClient.get(`tournaments/${tournamentId}`).json<ApiResponse<Tournament>>();
    return unwrap(resp);
  },

  async getStandings(tournamentId) {
    const resp = await apiClient.get(`tournaments/${tournamentId}/standings`).json<ApiResponse<Tournament['standings']>>();
    return unwrap(resp);
  },
};

/* ── Analytics Repository ─────────────────────────────── */

export const analyticsRepository: AnalyticsRepository = {
  async getQuestions(params) {
    const resp = await apiClient.get(`analytics/questions${qs(params as Record<string, unknown>)}`).json<ApiResponse<AnalyticsQuestion[]>>();
    return unwrap(resp);
  },

  async getInsights(params) {
    const resp = await apiClient.get(`analytics/insights${qs(params as Record<string, unknown>)}`).json<ApiResponse<AnalyticsInsight[]>>();
    return unwrap(resp);
  },
};

/* ── AI / Insights Repository ─────────────────────────── */

export const aiRepository: AiRepository = {
  async getInsights(params) {
    const resp = await apiClient.get(`ai/insights${qs(params as Record<string, unknown>)}`).json<ApiResponse<AiInsight[]>>();
    return unwrap(resp);
  },

  async getConversation(params) {
    const resp = await apiClient.get(`ai/conversation${qs(params as Record<string, unknown>)}`).json<ApiResponse<AiConversationMessage[]>>();
    return unwrap(resp);
  },

  async ask(question) {
    const resp = await apiClient.post('ai/ask', { json: { question } }).json<ApiResponse<AiConversationMessage>>();
    return unwrap(resp);
  },
};

/* ── Media Repository ─────────────────────────────────── */

export const mediaRepository: MediaRepository = {
  async listAssets(params) {
    const resp = await apiClient.get(`media/assets${qs(params as Record<string, unknown>)}`).json<{ data?: unknown }>();
    return transformPagination<MediaAsset>(resp.data ?? resp, params?.page, params?.limit);
  },

  async getAsset(assetId) {
    const resp = await apiClient.get(`media/assets/${assetId}`).json<ApiResponse<MediaAsset>>();
    return unwrap(resp);
  },

  async listVideos(params) {
    const resp = await apiClient.get(`media/videos${qs(params as Record<string, unknown>)}`).json<{ data?: unknown }>();
    return transformPagination<VideoAsset>(resp.data ?? resp, params?.page, params?.limit);
  },

  async getVideo(videoId) {
    const resp = await apiClient.get(`media/videos/${videoId}`).json<ApiResponse<VideoAsset>>();
    return unwrap(resp);
  },
};
