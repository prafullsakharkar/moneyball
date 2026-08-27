/**
 * Common application types.
 */

/* ── Pagination ────────────────────────────────────────────── */

export interface PaginatedRequest {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ── API ───────────────────────────────────────────────────── */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/* ── Navigation ────────────────────────────────────────────── */

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

/* ── Identity (re-exports) ─────────────────────────────────── */

export type {
  User,
  UserRole,
  Profile,
  Organization,
  OrganizationType,
  OrganizationAddress,
  OrgBranding,
  OrgSettings,
  OrgFeatures,
  Membership,
  MembershipStatus,
  OrganizationMembership,
  Role,
  Permission,
  PermissionAction,
  Session,
  Device,
  DeviceType,
  SecurityEvent,
  SecurityEventType,
  AuthTokens,
  TokenPayload,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  MfaVerifyRequest,
  DevicePayload,
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
  SessionListResponse,
  SwitchOrganizationRequest,
  SwitchOrganizationResponse,
} from './identity';

/* ── Organization (re-exports) ─────────────────────────────── */

export type {
  OrganizationMember,
  MemberInviteRequest,
  MemberUpdateRequest,
  Department,
  CreateDepartmentRequest,
  OrganizationRole,
  CreateRoleRequest,
  UpdateRoleRequest,
  OrganizationTeam,
  OrganizationCompetition,
  Facility,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationListParams,
  OrganizationStats,
} from './organization';

/* ── Player (re-exports) ──────────────────────────────────── */

export type {
  Player,
  PlayerRole,
  BattingStyle,
  BowlingStyle,
  PlayerStatus,
  PlayerAvailability,
  PlayerStats,
  PlayerMetrics,
  CreatePlayerRequest,
  UpdatePlayerRequest,
  PlayerListParams,
  BulkPlayerUpdateRequest,
} from './player';
export {
  PLAYER_ROLE_LABELS,
  PLAYER_STATUS_LABELS,
  BATTING_STYLE_LABELS,
  BOWLING_STYLE_LABELS,
} from './player';

/* ── Cricket (re-exports) ─────────────────────────────────── */

export type {
  MatchFormat,
  MatchState,
  InningsNumber,
  MatchTeam,
  MatchInnings,
  BattingCardEntry,
  BowlingCardEntry,
  FallOfWicket,
  Partnership,
  Extras,
  Powerplay,
  CommentaryEntry,
  Match,
  Team,
  FormResult,
  TeamSquadMember,
  TournamentFormat,
  Tournament,
  StandingRow,
  TrendPoint,
  ComparisonDatum,
  AnalyticsQuestion,
  AnalyticsInsight,
  InsightSource,
  AiInsight,
  AiConversationMessage,
  MediaKind,
  MediaAsset,
  VideoEvent,
  VideoClip,
  VideoAsset,
} from './cricket';
export {
  MATCH_FORMAT_LABELS,
  MATCH_STATE_LABELS,
  TOURNAMENT_STATUS_LABELS,
} from './cricket';

/* ── Domain Registry ───────────────────────────────────────── */

export type {
  CricketDomainSlug,
  CricketDomain,
} from './domain';
export { CRICKET_DOMAINS, getDomain, ALL_DOMAIN_RESOURCES } from './domain';
