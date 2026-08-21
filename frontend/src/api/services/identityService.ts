/**
 * Identity Service
 * ============================================
 * Business-logic layer for authentication & identity operations.
 *
 * Layered data flow (Frontend Architecture Rule):
 *   Component → Feature Hook → TanStack Query → Service → Repository → API Client → Adapter → MSW
 *
 * Services orchestrate repositories and may add cross-cutting concerns
 * (org scoping, caching hints, validation, composition). Components and
 * hooks must NEVER import repositories or the API client directly — they
 * depend on services.
 */
import { identityRepository } from '../repositories/identity';
import type { IdentityRepository } from '../repositories/types';
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  SwitchOrganizationRequest,
} from '@domain/index';

/**
 * Identity service exposing the same contract as the repository.
 * Kept thin for now — add orchestration/validation here as the domain grows.
 */
export const identityService: IdentityRepository = {
  login: (data: LoginRequest) => identityRepository.login(data),
  register: (data: RegisterRequest) => identityRepository.register(data),
  refresh: (refreshToken: string) => identityRepository.refresh(refreshToken),
  logout: (refreshToken: string) => identityRepository.logout(refreshToken),
  getMe: () => identityRepository.getMe(),
  forgotPassword: (data: ForgotPasswordRequest) => identityRepository.forgotPassword(data),
  resetPassword: (data: ResetPasswordRequest) => identityRepository.resetPassword(data),
  verifyEmail: (data: VerifyEmailRequest) => identityRepository.verifyEmail(data),
  resendVerification: (email: string) => identityRepository.resendVerification(email),
  getSessions: () => identityRepository.getSessions(),
  revokeSession: (sessionId: string) => identityRepository.revokeSession(sessionId),
  switchOrganization: (data: SwitchOrganizationRequest) => identityRepository.switchOrganization(data),
};
