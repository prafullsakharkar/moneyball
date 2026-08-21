/**
 * Organization Service
 * ============================================
 * Business-logic layer for organization-scoped operations.
 *
 * Layered data flow (Frontend Architecture Rule):
 *   Component → Feature Hook → TanStack Query → Service → Repository → API Client → Adapter → MSW
 *
 * This service enforces tenant isolation at the service boundary: every
 * operation is scoped to an explicit `orgId`. Hooks and components must
 * never call repositories directly.
 */
import { organizationRepository } from '../repositories/organization';
import type { OrganizationRepository, ListParams } from '../repositories/types';
import type {
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  MemberInviteRequest,
  MemberUpdateRequest,
  CreateDepartmentRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '@domain/index';

/**
 * Organization service exposing the same contract as the repository.
 * All methods require an explicit `orgId` to guarantee tenant isolation.
 */
export const organizationService: OrganizationRepository = {
  list: (params?: ListParams) => organizationRepository.list(params),
  get: (orgId: string) => organizationRepository.get(orgId),
  create: (data: CreateOrganizationRequest) => organizationRepository.create(data),
  update: (orgId: string, data: UpdateOrganizationRequest) => organizationRepository.update(orgId, data),
  delete: (orgId: string) => organizationRepository.delete(orgId),
  getStats: (orgId: string) => organizationRepository.getStats(orgId),

  // Members
  getMembers: (orgId: string, params?: ListParams & { role?: string; status?: string }) =>
    organizationRepository.getMembers(orgId, params),
  getMember: (orgId: string, memberId: string) => organizationRepository.getMember(orgId, memberId),
  inviteMember: (orgId: string, data: MemberInviteRequest) => organizationRepository.inviteMember(orgId, data),
  updateMember: (orgId: string, memberId: string, data: MemberUpdateRequest) =>
    organizationRepository.updateMember(orgId, memberId, data),
  removeMember: (orgId: string, memberId: string) => organizationRepository.removeMember(orgId, memberId),

  // Roles
  getRoles: (orgId: string) => organizationRepository.getRoles(orgId),
  getRole: (orgId: string, roleId: string) => organizationRepository.getRole(orgId, roleId),
  createRole: (orgId: string, data: CreateRoleRequest) => organizationRepository.createRole(orgId, data),
  updateRole: (orgId: string, roleId: string, data: UpdateRoleRequest) =>
    organizationRepository.updateRole(orgId, roleId, data),
  deleteRole: (orgId: string, roleId: string) => organizationRepository.deleteRole(orgId, roleId),

  // Departments
  getDepartments: (orgId: string) => organizationRepository.getDepartments(orgId),
  createDepartment: (orgId: string, data: CreateDepartmentRequest) =>
    organizationRepository.createDepartment(orgId, data),
  updateDepartment: (orgId: string, deptId: string, data: Partial<CreateDepartmentRequest>) =>
    organizationRepository.updateDepartment(orgId, deptId, data),
  deleteDepartment: (orgId: string, deptId: string) => organizationRepository.deleteDepartment(orgId, deptId),

  // Teams / Competitions / Facilities
  getTeams: (orgId: string, params?: ListParams) => organizationRepository.getTeams(orgId, params),
  getCompetitions: (orgId: string, params?: ListParams) => organizationRepository.getCompetitions(orgId, params),
  getFacilities: (orgId: string) => organizationRepository.getFacilities(orgId),
};
