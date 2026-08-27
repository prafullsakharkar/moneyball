/* ── API Client ──────────────────────────────────────── */
export { apiClient, setUnauthorizedHandler, uploadFile, downloadFile, batchRequest, buildUrl } from './client';
export { ApiRequestError } from './client';
export type { ApiError } from './client';

/* ── Adapter ─────────────────────────────────────────── */
export { unwrap, transformPagination, buildFilterParams } from './adapter';

/* ── Types ───────────────────────────────────────────── */
export type { ApiResponse, ApiErrorResponse, PaginatedResponse, PaginationParams } from './types';

/* ── Repositories ────────────────────────────────────── */
export {
  identityRepository,
  organizationRepository,
  playerRepository,
  matchRepository,
  teamRepository,
  tournamentRepository,
  analyticsRepository,
  aiRepository,
  mediaRepository,
} from './repositories';
export type {
  IdentityRepository,
  OrganizationRepository,
  PlayerRepository,
  MatchRepository,
  TeamRepository,
  TournamentRepository,
  AnalyticsRepository,
  AiRepository,
  MediaRepository,
  ListParams,
} from './repositories';

/* ── Services ────────────────────────────────────────── */
// Services are the ONLY layer hooks/components may depend on.
// Component → Feature Hook → TanStack Query → Service → Repository → API Client → Adapter → MSW
export {
  identityService,
  organizationService,
  playerService,
  matchService,
  teamService,
  tournamentService,
  analyticsService,
  aiService,
  mediaService,
} from './services';
