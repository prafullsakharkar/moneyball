/**
 * Organization Domain Types
 * Multi-tenant organization system for CricketOS.
 * Core Organization type lives in identity.ts — these are domain-specific extensions.
 */

import type {
  User,
  UserRole,
  Permission,
  Organization,
  OrganizationType,
  MembershipStatus,
} from './identity';

/* ── Re-export the core types so consumers can import from here ── */

export type { Organization, OrganizationType, MembershipStatus };

/* ── Members ───────────────────────────────────────────── */

export interface OrganizationMember {
  id: string;
  userId: string;
  user: User;
  organizationId: string;
  role: UserRole;
  permissions: Permission[];
  status: MembershipStatus;
  department?: Department;
  joinedAt: string;
  lastActiveAt?: string;
}

export interface MemberInviteRequest {
  email: string;
  role: UserRole;
  departmentId?: string;
  message?: string;
}

export interface MemberUpdateRequest {
  role?: UserRole;
  departmentId?: string;
  status?: MembershipStatus;
  permissions?: string[];
}

/* ── Departments ───────────────────────────────────────── */

export interface Department {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  headUserId?: string;
  memberCount: number;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  headUserId?: string;
  parentId?: string;
}

/* ── Roles ─────────────────────────────────────────────── */

export interface OrganizationRole {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  permissions: Permission[];
  memberCount: number;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissionIds: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissionIds?: string[];
}

/* ── Teams ─────────────────────────────────────────────── */

export interface OrganizationTeam {
  id: string;
  name: string;
  shortName?: string;
  logoUrl?: string;
  organizationId: string;
  sport: string;
  gender: 'male' | 'female' | 'mixed';
  level: 'professional' | 'semi_professional' | 'amateur' | 'youth' | 'junior';
  playerCount: number;
  coachCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ── Competitions ──────────────────────────────────────── */

export interface OrganizationCompetition {
  id: string;
  name: string;
  organizationId: string;
  type: 'tournament' | 'league' | 'series' | 'friendly';
  status: 'draft' | 'upcoming' | 'active' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  teamCount: number;
  matchCount: number;
}

/* ── Facilities ────────────────────────────────────────── */

export interface Facility {
  id: string;
  name: string;
  organizationId: string;
  type: 'ground' | 'indoor' | 'nets' | 'gym' | 'other';
  address?: string;
  capacity?: number;
  hasFloodlights: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ── Organization Request/Response ─────────────────────── */

export interface CreateOrganizationRequest {
  name: string;
  slug: string;
  type: OrganizationType;
  description?: string;
  website?: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: { street?: string; city?: string; state?: string; country: string; postalCode?: string };
  settings?: Partial<Organization['settings']>;
  branding?: Partial<Organization['branding']>;
}

export interface OrganizationListParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: OrganizationType;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrganizationStats {
  memberCount: number;
  teamCount: number;
  playerCount: number;
  coachCount: number;
  competitionCount: number;
  matchCount: number;
  facilityCount: number;
}
