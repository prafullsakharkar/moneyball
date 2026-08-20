/**
 * Identity Repository Implementation
 * Uses the Ky API client and adapter to communicate with the backend.
 */
import { apiClient } from '../client';
import { unwrap } from '../adapter';
import type { ApiResponse } from '../types';
import type { IdentityRepository } from './types';
import type {
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
  SessionListResponse,
  SwitchOrganizationResponse,
  User,
} from '@domain/index';

export const identityRepository: IdentityRepository = {
  async login(data) {
    const resp = await apiClient.post('auth/login', { json: data }).json<ApiResponse<LoginResponse>>();
    return unwrap(resp);
  },

  async register(data) {
    const resp = await apiClient.post('auth/register', { json: data }).json<ApiResponse<RegisterResponse>>();
    return unwrap(resp);
  },

  async refresh(refreshToken) {
    const resp = await apiClient.post('auth/refresh', { json: { refreshToken } }).json<ApiResponse<RefreshResponse>>();
    return unwrap(resp);
  },

  async logout(refreshToken) {
    await apiClient.post('auth/logout', { json: { refreshToken } });
  },

  async getMe() {
    const resp = await apiClient.get('auth/me').json<ApiResponse<{ user: User }>>();
    return unwrap(resp);
  },

  async forgotPassword(data) {
    const resp = await apiClient.post('auth/forgot-password', { json: data }).json<ApiResponse<{ message: string }>>();
    return unwrap(resp);
  },

  async resetPassword(data) {
    const resp = await apiClient.post('auth/reset-password', { json: data }).json<ApiResponse<{ message: string }>>();
    return unwrap(resp);
  },

  async verifyEmail(data) {
    const resp = await apiClient.post('auth/verify-email', { json: data }).json<ApiResponse<{ message: string }>>();
    return unwrap(resp);
  },

  async resendVerification(email) {
    const resp = await apiClient.post('auth/resend-verification', { json: { email } }).json<ApiResponse<{ message: string }>>();
    return unwrap(resp);
  },

  async getSessions() {
    const resp = await apiClient.get('auth/sessions').json<ApiResponse<SessionListResponse>>();
    return unwrap(resp);
  },

  async revokeSession(sessionId) {
    await apiClient.delete(`auth/sessions/${sessionId}`);
  },

  async switchOrganization(data) {
    const resp = await apiClient.post('auth/switch-organization', { json: data }).json<ApiResponse<SwitchOrganizationResponse>>();
    return unwrap(resp);
  },
};
