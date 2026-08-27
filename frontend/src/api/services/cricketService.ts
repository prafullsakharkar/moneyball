/**
 * Cricket Service
 * ============================================
 * Business-logic layer for the Competition, Participants, Media, and
 * Intelligence domains (matches, teams, tournaments, analytics, AI, media).
 *
 * Layered data flow (Frontend Architecture Rule):
 *   Component → Feature Hook → TanStack Query → Service → Repository → API Client → Adapter → MSW
 *
 * Hooks and components must never call repositories directly.
 */
import {
  matchRepository,
  teamRepository,
  tournamentRepository,
  analyticsRepository,
  aiRepository,
  mediaRepository,
} from '../repositories/cricket';
import type {
  MatchRepository,
  TeamRepository,
  TournamentRepository,
  AnalyticsRepository,
  AiRepository,
  MediaRepository,
  ListParams,
} from '../repositories/types';

/**
 * Cricket services exposing the same contract as their repositories.
 */
export const matchService: MatchRepository = {
  list: (params?: ListParams) => matchRepository.list(params),
  get: (matchId: string) => matchRepository.get(matchId),
  getLive: (params?: ListParams) => matchRepository.getLive(params),
  getUpcoming: (params?: ListParams) => matchRepository.getUpcoming(params),
  getRecent: (params?: ListParams) => matchRepository.getRecent(params),
};

export const teamService: TeamRepository = {
  list: (params?: ListParams) => teamRepository.list(params),
  get: (teamId: string) => teamRepository.get(teamId),
};

export const tournamentService: TournamentRepository = {
  list: (params?: ListParams) => tournamentRepository.list(params),
  get: (tournamentId: string) => tournamentRepository.get(tournamentId),
  getStandings: (tournamentId: string) => tournamentRepository.getStandings(tournamentId),
};

export const analyticsService: AnalyticsRepository = {
  getQuestions: (params?: ListParams) => analyticsRepository.getQuestions(params),
  getInsights: (params?: ListParams) => analyticsRepository.getInsights(params),
};

export const aiService: AiRepository = {
  getInsights: (params?: ListParams) => aiRepository.getInsights(params),
  getConversation: (params?: ListParams) => aiRepository.getConversation(params),
  ask: (question: string) => aiRepository.ask(question),
};

export const mediaService: MediaRepository = {
  listAssets: (params?: ListParams) => mediaRepository.listAssets(params),
  getAsset: (assetId: string) => mediaRepository.getAsset(assetId),
  listVideos: (params?: ListParams) => mediaRepository.listVideos(params),
  getVideo: (videoId: string) => mediaRepository.getVideo(videoId),
};
