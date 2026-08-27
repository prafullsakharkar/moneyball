/**
 * Service Layer
 * ============================================
 * Business-logic layer between TanStack Query hooks and repositories.
 *
 * Layered data flow (Frontend Architecture Rule):
 *   Component → Feature Hook → TanStack Query → Service → Repository → API Client → Adapter → MSW
 *
 * Components and hooks depend on services — never on repositories or the
 * API client directly.
 */
export { identityService } from './identityService';
export { organizationService } from './organizationService';
export { playerService } from './playerService';
export {
  matchService,
  teamService,
  tournamentService,
  analyticsService,
  aiService,
  mediaService,
} from './cricketService';
