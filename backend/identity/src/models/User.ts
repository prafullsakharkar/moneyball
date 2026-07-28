// User model for Identity Service

import { BaseModel, NameModel, ContactModel, UserStatus, UserRole, UserGender } from '@shared/types';

export interface User extends BaseModel, NameModel, ContactModel {
  passwordHash: string;
  displayName?: string;
  gender?: UserGender;
  dateOfBirth?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin?: string;
  profileImage?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      inApp: boolean;
      whatsapp: boolean;
    };
    privacy: {
      profileVisibility: 'Public' | 'Private' | 'Organization' | 'Team';
      statsVisibility: 'Public' | 'Private' | 'Organization' | 'Team';
      contactVisibility: 'Public' | 'Private' | 'Organization' | 'Team';
    };
  };
}

export interface UserCreateInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: UserGender;
  dateOfBirth?: string;
  role?: UserRole;
  profileImage?: string;
}

export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  gender?: UserGender;
  dateOfBirth?: string;
  profileImage?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    timezone?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
      inApp?: boolean;
      whatsapp?: boolean;
    };
    privacy?: {
      profileVisibility?: 'Public' | 'Private' | 'Organization' | 'Team';
      statsVisibility?: 'Public' | 'Private' | 'Organization' | 'Team';
      contactVisibility?: 'Public' | 'Private' | 'Organization' | 'Team';
    };
  };
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserRegisterInput extends UserCreateInput {
  confirmPassword: string;
}

export interface PasswordResetInput {
  email: string;
}

export interface PasswordResetConfirmInput {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface MfaVerifyInput {
  code: string;
}

export interface Session {
  id: string;
  userId: string;
  refreshToken: string;
  refreshTokenExpiry: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  revokedAt?: string;
  revokedBy?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  displayName?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  permissions: string[];
}
