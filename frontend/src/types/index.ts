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
  Organization,
  OrganizationType,
  OrganizationAddress,
  OrgBranding,
  OrgSettings,
  OrgFeatures,
  Membership,
  MembershipStatus,
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

/* ── Domain Registry ───────────────────────────────────────── */

export type {
  CricketDomainSlug,
  CricketDomain,
} from './domain';
export { CRICKET_DOMAINS, getDomain, ALL_DOMAIN_RESOURCES } from './domain';
