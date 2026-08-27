/**
 * Identity & Authentication Types
 * Global multi-tenant identity system for CricketOS.
 */

/* ── User ──────────────────────────────────────────────────── */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

/* ── Profile ───────────────────────────────────────────────── */

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  location?: string;
  avatarUrl?: string;
  coverUrl?: string;
  socialLinks?: {
    website?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  preferences?: {
    language?: string;
    timezone?: string;
    theme?: 'light' | 'dark' | 'system';
    notifications?: Record<string, boolean>;
  };
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'owner' | 'admin' | 'coach' | 'manager' | 'player' | 'viewer';

/* ── Organization ──────────────────────────────────────────── */

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  coverUrl?: string;
  type: OrganizationType;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: OrganizationAddress;
  branding?: OrgBranding;
  settings?: OrgSettings;
  memberCount: number;
  teamCount: number;
  competitionCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrganizationType =
  | 'national_board'
  | 'state_association'
  | 'league'
  | 'franchise'
  | 'professional_club'
  | 'amateur_club'
  | 'academy'
  | 'school'
  | 'university'
  | 'corporate'
  | 'media';

export interface OrganizationAddress {
  street?: string;
  city?: string;
  state?: string;
  country: string;
  postalCode?: string;
}

export interface OrgBranding {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  faviconUrl?: string;
  coverUrl?: string;
  customDomain?: string;
  tagline?: string;
}

export interface OrgSettings {
  allowPublicRegistration: boolean;
  requireEmailVerification: boolean;
  mfaRequired: boolean;
  sessionTimeoutMinutes: number;
  maxMembers: number;
  timezone: string;
  locale: string;
  features: OrgFeatures;
}

export interface OrgFeatures {
  analytics: boolean;
  training: boolean;
  videoAnalysis: boolean;
  scouting: boolean;
  finance: boolean;
  competitions: boolean;
  media: boolean;
}

/* ── Membership ────────────────────────────────────────────── */

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  organization: Organization;
  role: UserRole;
  permissions: Permission[];
  status: MembershipStatus;
  joinedAt: string;
}

export type MembershipStatus = 'active' | 'inactive' | 'pending' | 'suspended' | 'invited';

/* ── Organization Membership ───────────────────────────────── */

export interface OrganizationMembership {
  id: string;
  userId: string;
  organizationId: string;
  organization: Organization;
  role: UserRole;
  permissions: Permission[];
  status: MembershipStatus;
  joinedAt: string;
  isDefault?: boolean;
}

/* ── Role ──────────────────────────────────────────────────── */

export interface Role {
  id: string;
  organizationId: string;
  name: string;
  key: string;
  description?: string;
  permissions: Permission[];
  isSystem?: boolean;
  memberCount?: number;
  createdAt: string;
  updatedAt: string;
}

/* ── Permission ────────────────────────────────────────────── */

export interface Permission {
  id: string;
  resource: string;
  action: PermissionAction;
}

export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'manage'
  | 'export'
  | 'import';

/* ── Session ───────────────────────────────────────────────── */

export interface Session {
  id: string;
  userId: string;
  device: Device;
  ipAddress: string;
  userAgent: string;
  organizationId: string;
  lastActiveAt: string;
  createdAt: string;
  expiresAt: string;
}

/* ── Device ────────────────────────────────────────────────── */

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  os: string;
  browser: string;
  isTrusted: boolean;
}

export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'unknown';

/* ── Security Event ────────────────────────────────────────── */

export interface SecurityEvent {
  id: string;
  userId: string;
  type: SecurityEventType;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type SecurityEventType =
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'password_changed'
  | 'password_reset_requested'
  | 'password_reset_completed'
  | 'mfa_enabled'
  | 'mfa_disabled'
  | 'mfa_challenge'
  | 'email_verified'
  | 'account_locked'
  | 'session_created'
  | 'session_revoked'
  | 'organization_switched';

/* ── Auth Tokens ───────────────────────────────────────────── */

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;       // seconds
  tokenType: 'Bearer';
}

export interface TokenPayload {
  sub: string;            // user ID
  email: string;
  organizationId: string;
  role: UserRole;
  permissions: string[];  // permission IDs
  iat: number;
  exp: number;
}

/* ── Auth Requests ─────────────────────────────────────────── */

export interface LoginRequest {
  email: string;
  password: string;
  organizationSlug?: string;
  device?: DevicePayload;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName?: string;
  organizationSlug?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface MfaVerifyRequest {
  code: string;
  sessionToken: string;
}

export interface DevicePayload {
  name: string;
  type: DeviceType;
  os: string;
  browser: string;
}

/* ── Auth Responses ────────────────────────────────────────── */

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  memberships: Membership[];
  mfaRequired?: boolean;
  mfaSessionToken?: string;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
  membership: Membership;
}

export interface RefreshResponse {
  tokens: AuthTokens;
}

export interface SessionListResponse {
  sessions: Session[];
  currentSessionId: string;
}

/* ── Switch Organization ───────────────────────────────────── */

export interface SwitchOrganizationRequest {
  organizationId: string;
}

export interface SwitchOrganizationResponse {
  tokens: AuthTokens;
  membership: Membership;
}
