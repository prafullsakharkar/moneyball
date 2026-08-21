/**
 * Organization query hooks using TanStack Query.
 * All hooks are tenant-isolated — they use the current org context.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '@api/services/organizationService';
import { useOrgContext } from './useOrgContext';
import type {
  MemberInviteRequest,
  MemberUpdateRequest,
  CreateDepartmentRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  UpdateOrganizationRequest,
} from '@domain/index';

export const orgQueryKeys = {
  all: (orgId: string) => ['org', orgId] as const,
  detail: (orgId: string) => ['org', orgId, 'detail'] as const,
  stats: (orgId: string) => ['org', orgId, 'stats'] as const,
  members: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'members', params] as const,
  member: (orgId: string, memberId: string) => ['org', orgId, 'members', memberId] as const,
  roles: (orgId: string) => ['org', orgId, 'roles'] as const,
  departments: (orgId: string) => ['org', orgId, 'departments'] as const,
  teams: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'teams', params] as const,
  competitions: (orgId: string, params?: Record<string, unknown>) => ['org', orgId, 'competitions', params] as const,
  facilities: (orgId: string) => ['org', orgId, 'facilities'] as const,
};

/* ── Organization ─────────────────────────────────────── */

export function useOrganizationDetail() {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: orgQueryKeys.detail(orgId),
    queryFn: () => organizationService.get(orgId),
    enabled: Boolean(orgId),
  });
}

export function useOrganizationStats() {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: orgQueryKeys.stats(orgId),
    queryFn: () => organizationService.getStats(orgId),
    enabled: Boolean(orgId),
  });
}

/* ── Members ──────────────────────────────────────────── */

export function useOrganizationMembers(params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: orgQueryKeys.members(orgId, params as Record<string, unknown>),
    queryFn: () => organizationService.getMembers(orgId, params),
    enabled: Boolean(orgId),
  });
}

export function useOrganizationMember(memberId: string) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: orgQueryKeys.member(orgId, memberId),
    queryFn: () => organizationService.getMember(orgId, memberId),
    enabled: Boolean(orgId) && Boolean(memberId),
  });
}

export function useInviteMember() {
  const { orgId } = useOrgContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MemberInviteRequest) => organizationService.inviteMember(orgId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orgQueryKeys.members(orgId) });
      qc.invalidateQueries({ queryKey: orgQueryKeys.stats(orgId) });
    },
  });
}

export function useUpdateMember() {
  const { orgId } = useOrgContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, data }: { memberId: string; data: MemberUpdateRequest }) =>
      organizationService.updateMember(orgId, memberId, data),
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: orgQueryKeys.members(orgId) });
      qc.invalidateQueries({ queryKey: orgQueryKeys.member(orgId, variables.memberId) });
    },
  });
}

export function useRemoveMember() {
  const { orgId } = useOrgContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => organizationService.removeMember(orgId, memberId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orgQueryKeys.members(orgId) });
      qc.invalidateQueries({ queryKey: orgQueryKeys.stats(orgId) });
    },
  });
}

/* ── Roles ────────────────────────────────────────────── */

export function useOrganizationRoles() {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: orgQueryKeys.roles(orgId),
    queryFn: () => organizationService.getRoles(orgId),
    enabled: Boolean(orgId),
  });
}

export function useCreateRole() {
  const { orgId } = useOrgContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoleRequest) => organizationService.createRole(orgId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgQueryKeys.roles(orgId) }),
  });
}

export function useUpdateRole() {
  const { orgId } = useOrgContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: UpdateRoleRequest }) =>
      organizationService.updateRole(orgId, roleId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgQueryKeys.roles(orgId) }),
  });
}

export function useDeleteRole() {
  const { orgId } = useOrgContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (roleId: string) => organizationService.deleteRole(orgId, roleId),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgQueryKeys.roles(orgId) }),
  });
}

/* ── Departments ──────────────────────────────────────── */

export function useOrganizationDepartments() {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: orgQueryKeys.departments(orgId),
    queryFn: () => organizationService.getDepartments(orgId),
    enabled: Boolean(orgId),
  });
}

export function useCreateDepartment() {
  const { orgId } = useOrgContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDepartmentRequest) => organizationService.createDepartment(orgId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgQueryKeys.departments(orgId) }),
  });
}

export function useDeleteDepartment() {
  const { orgId } = useOrgContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deptId: string) => organizationService.deleteDepartment(orgId, deptId),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgQueryKeys.departments(orgId) }),
  });
}

/* ── Settings ─────────────────────────────────────────── */

export function useUpdateOrganization() {
  const { orgId } = useOrgContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateOrganizationRequest) => organizationService.update(orgId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgQueryKeys.detail(orgId) }),
  });
}

/* ── Teams / Competitions / Facilities ─────────────────── */

export function useOrganizationTeams(params?: { page?: number; limit?: number; search?: string }) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: orgQueryKeys.teams(orgId, params as Record<string, unknown>),
    queryFn: () => organizationService.getTeams(orgId, params),
    enabled: Boolean(orgId),
  });
}

export function useOrganizationCompetitions(params?: { page?: number; limit?: number; search?: string }) {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: orgQueryKeys.competitions(orgId, params as Record<string, unknown>),
    queryFn: () => organizationService.getCompetitions(orgId, params),
    enabled: Boolean(orgId),
  });
}

export function useOrganizationFacilities() {
  const { orgId } = useOrgContext();
  return useQuery({
    queryKey: orgQueryKeys.facilities(orgId),
    queryFn: () => organizationService.getFacilities(orgId),
    enabled: Boolean(orgId),
  });
}
