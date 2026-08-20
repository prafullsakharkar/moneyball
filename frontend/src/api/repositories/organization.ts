/**
 * Organization Repository Implementation
 * All requests include X-Organization-Id header for tenant isolation.
 */
import { apiClient } from '../client';
import { unwrap, transformPagination } from '../adapter';
import type { ApiResponse } from '../types';
import type { OrganizationRepository } from './types';
import type {
  Organization,
  OrganizationMember,
  OrganizationRole,
  Department,
  OrganizationTeam,
  OrganizationCompetition,
  Facility,
  OrganizationStats,
} from '@domain/index';

function orgPath(orgId: string, path: string): string {
  return `organizations/${orgId}/${path}`;
}

function qs(params?: Record<string, unknown>): string {
  if (!params) return '';
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export const organizationRepository: OrganizationRepository = {
  async list(params) {
    const resp = await apiClient.get(`organizations${qs(params)}`).json<{ data?: unknown }>();
    return transformPagination<Organization>(resp.data ?? resp, params?.page, params?.limit);
  },

  async get(orgId) {
    const resp = await apiClient.get(`organizations/${orgId}`).json<ApiResponse<Organization>>();
    return unwrap(resp);
  },

  async create(data) {
    const resp = await apiClient.post('organizations', { json: data }).json<ApiResponse<Organization>>();
    return unwrap(resp);
  },

  async update(orgId, data) {
    const resp = await apiClient.patch(`organizations/${orgId}`, { json: data }).json<ApiResponse<Organization>>();
    return unwrap(resp);
  },

  async delete(orgId) {
    await apiClient.delete(`organizations/${orgId}`);
  },

  async getStats(orgId) {
    const resp = await apiClient.get(orgPath(orgId, 'stats')).json<ApiResponse<OrganizationStats>>();
    return unwrap(resp);
  },

  async getMembers(orgId, params) {
    const resp = await apiClient.get(orgPath(orgId, 'members') + qs(params as Record<string, unknown>)).json<{ data?: unknown }>();
    return transformPagination<OrganizationMember>(resp.data ?? resp, params?.page, params?.limit);
  },

  async getMember(orgId, memberId) {
    const resp = await apiClient.get(orgPath(orgId, `members/${memberId}`)).json<ApiResponse<OrganizationMember>>();
    return unwrap(resp);
  },

  async inviteMember(orgId, data) {
    const resp = await apiClient.post(orgPath(orgId, 'members'), { json: data }).json<ApiResponse<OrganizationMember>>();
    return unwrap(resp);
  },

  async updateMember(orgId, memberId, data) {
    const resp = await apiClient.patch(orgPath(orgId, `members/${memberId}`), { json: data }).json<ApiResponse<OrganizationMember>>();
    return unwrap(resp);
  },

  async removeMember(orgId, memberId) {
    await apiClient.delete(orgPath(orgId, `members/${memberId}`));
  },

  async getRoles(orgId) {
    const resp = await apiClient.get(orgPath(orgId, 'roles')).json<ApiResponse<OrganizationRole[]>>();
    return unwrap(resp);
  },

  async getRole(orgId, roleId) {
    const resp = await apiClient.get(orgPath(orgId, `roles/${roleId}`)).json<ApiResponse<OrganizationRole>>();
    return unwrap(resp);
  },

  async createRole(orgId, data) {
    const resp = await apiClient.post(orgPath(orgId, 'roles'), { json: data }).json<ApiResponse<OrganizationRole>>();
    return unwrap(resp);
  },

  async updateRole(orgId, roleId, data) {
    const resp = await apiClient.patch(orgPath(orgId, `roles/${roleId}`), { json: data }).json<ApiResponse<OrganizationRole>>();
    return unwrap(resp);
  },

  async deleteRole(orgId, roleId) {
    await apiClient.delete(orgPath(orgId, `roles/${roleId}`));
  },

  async getDepartments(orgId) {
    const resp = await apiClient.get(orgPath(orgId, 'departments')).json<ApiResponse<Department[]>>();
    return unwrap(resp);
  },

  async createDepartment(orgId, data) {
    const resp = await apiClient.post(orgPath(orgId, 'departments'), { json: data }).json<ApiResponse<Department>>();
    return unwrap(resp);
  },

  async updateDepartment(orgId, deptId, data) {
    const resp = await apiClient.patch(orgPath(orgId, `departments/${deptId}`), { json: data }).json<ApiResponse<Department>>();
    return unwrap(resp);
  },

  async deleteDepartment(orgId, deptId) {
    await apiClient.delete(orgPath(orgId, `departments/${deptId}`));
  },

  async getTeams(orgId, params) {
    const resp = await apiClient.get(orgPath(orgId, 'teams') + qs(params as Record<string, unknown>)).json<{ data?: unknown }>();
    return transformPagination<OrganizationTeam>(resp.data ?? resp, params?.page, params?.limit);
  },

  async getCompetitions(orgId, params) {
    const resp = await apiClient.get(orgPath(orgId, 'competitions') + qs(params as Record<string, unknown>)).json<{ data?: unknown }>();
    return transformPagination<OrganizationCompetition>(resp.data ?? resp, params?.page, params?.limit);
  },

  async getFacilities(orgId) {
    const resp = await apiClient.get(orgPath(orgId, 'facilities')).json<ApiResponse<Facility[]>>();
    return unwrap(resp);
  },
};
