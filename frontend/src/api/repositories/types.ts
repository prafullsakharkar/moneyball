/**
 * Repository Interfaces
 * ============================================
 * Define the contract for all data operations.
 * Components → Hooks → TanStack Query → Repository Interface → Implementation.
 *
 * These interfaces are backend-agnostic — they work with both mock and REST.
 */
import type { PaginatedResponse } from '../types';
import type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  RefreshResponse,
  SessionListResponse,
  SwitchOrganizationRequest,
  SwitchOrganizationResponse,
  Organization,
  OrganizationMember,
  OrganizationRole,
  Department,
  OrganizationTeam,
  OrganizationCompetition,
  Facility,
  OrganizationStats,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  MemberInviteRequest,
  MemberUpdateRequest,
  CreateDepartmentRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '@domain/index';

/* ── Pagination Filter ────────────────────────────────── */

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  ordering?: string;
  [key: string]: unknown;
}

/* ── Identity Repository ──────────────────────────────── */

export interface IdentityRepository {
  login(data: LoginRequest): Promise<LoginResponse>;
  register(data: RegisterRequest): Promise<RegisterResponse>;
  refresh(refreshToken: string): Promise<RefreshResponse>;
  logout(refreshToken: string): Promise<void>;
  getMe(): Promise<{ user: User }>;
  forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }>;
  resetPassword(data: ResetPasswordRequest): Promise<{ message: string }>;
  verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }>;
  resendVerification(email: string): Promise<{ message: string }>;
  getSessions(): Promise<SessionListResponse>;
  revokeSession(sessionId: string): Promise<void>;
  switchOrganization(data: SwitchOrganizationRequest): Promise<SwitchOrganizationResponse>;
}

/* ── Organization Repository ──────────────────────────── */

export interface OrganizationRepository {
  list(params?: ListParams): Promise<PaginatedResponse<Organization>>;
  get(orgId: string): Promise<Organization>;
  create(data: CreateOrganizationRequest): Promise<Organization>;
  update(orgId: string, data: UpdateOrganizationRequest): Promise<Organization>;
  delete(orgId: string): Promise<void>;
  getStats(orgId: string): Promise<OrganizationStats>;

  // Members
  getMembers(orgId: string, params?: ListParams & { role?: string; status?: string }): Promise<PaginatedResponse<OrganizationMember>>;
  getMember(orgId: string, memberId: string): Promise<OrganizationMember>;
  inviteMember(orgId: string, data: MemberInviteRequest): Promise<OrganizationMember>;
  updateMember(orgId: string, memberId: string, data: MemberUpdateRequest): Promise<OrganizationMember>;
  removeMember(orgId: string, memberId: string): Promise<void>;

  // Roles
  getRoles(orgId: string): Promise<OrganizationRole[]>;
  getRole(orgId: string, roleId: string): Promise<OrganizationRole>;
  createRole(orgId: string, data: CreateRoleRequest): Promise<OrganizationRole>;
  updateRole(orgId: string, roleId: string, data: UpdateRoleRequest): Promise<OrganizationRole>;
  deleteRole(orgId: string, roleId: string): Promise<void>;

  // Departments
  getDepartments(orgId: string): Promise<Department[]>;
  createDepartment(orgId: string, data: CreateDepartmentRequest): Promise<Department>;
  updateDepartment(orgId: string, deptId: string, data: Partial<CreateDepartmentRequest>): Promise<Department>;
  deleteDepartment(orgId: string, deptId: string): Promise<void>;

  // Teams
  getTeams(orgId: string, params?: ListParams): Promise<PaginatedResponse<OrganizationTeam>>;

  // Competitions
  getCompetitions(orgId: string, params?: ListParams): Promise<PaginatedResponse<OrganizationCompetition>>;

  // Facilities
  getFacilities(orgId: string): Promise<Facility[]>;
}
