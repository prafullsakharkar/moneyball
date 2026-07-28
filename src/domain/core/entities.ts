// =============================================================================
// CricketIQ - Core Entities
// =============================================================================
// Base entity types for all domain models
// =============================================================================

import type { ID, Timestamp, EntityStatus, CricketFormat, Money, MediaReference, ContactInfo, SocialMediaLink, Address } from './types';

// ============================================================================
// Domain Entities
// ============================================================================

export interface DomainEntity {
  id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: number;
}

export interface AuditEntity extends DomainEntity {
  createdBy: ID;
  updatedBy: ID;
}

export interface SoftDeleteEntity extends DomainEntity {
  deletedAt: Timestamp | null;
  deletedBy: ID | null;
}

export interface AggregateRoot extends DomainEntity {
  // Base interface for aggregate roots
}

export interface ValueObject {
  // Base interface for value objects
}

// ============================================================================
// User and Identity Entities
// ============================================================================

export interface User extends AuditEntity, SoftDeleteEntity {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  lastLoginAt?: Timestamp;
  lastLoginIp?: string;
  preferences: UserPreferences;
  settings: UserSettings;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
}

export interface UserSettings {
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  security: SecuritySettings;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  whatsapp: boolean;
  digest: boolean;
  digestFrequency: 'instant' | 'daily' | 'weekly';
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'registered' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showAddress: boolean;
  allowSearch: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  screenReader: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  reduceMotion: boolean;
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginAttempts: number;
}

// ============================================================================
// Role and Permission Entities
// ============================================================================

export interface Role extends AuditEntity {
  name: string;
  code: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  level: number; // For hierarchy
  scope: 'global' | 'organization' | 'team' | 'player';
}

export interface Permission extends AuditEntity {
  name: string;
  code: string;
  description: string;
  category: string;
  resource: string;
  action: string;
}

export interface UserRoleAssignment extends AuditEntity {
  userId: ID;
  roleId: ID;
  scopeType: 'global' | 'organization' | 'team' | 'player';
  scopeId: ID;
  assignedBy: ID;
  assignedAt: Timestamp;
  expiresAt?: Timestamp;
  isActive: boolean;
}

// ============================================================================
// Organization Entities
// ============================================================================

export interface Organization extends AuditEntity, SoftDeleteEntity {
  id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: number;
  createdBy: ID;
  updatedBy: ID;
  deletedAt: Timestamp | null;
  deletedBy: ID | null;
  name: string;
  shortName: string;
  code: string;
  type: 'association' | 'league' | 'club' | 'academy' | 'school' | 'company' | 'other';
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  contact: ContactInfo;
  address: Address;
  website?: string;
  socialMedia: SocialMediaLink[];
  status: EntityStatus;
  settings: OrganizationSettings;
  hierarchy: OrganizationHierarchy;
  financial: FinancialInfo;
}

export interface OrganizationSettings {
  currency: string;
  timezone: string;
  language: string;
  cricketFormat: CricketFormat;
  matchScoring: MatchScoringSettings;
  playerRegistration: PlayerRegistrationSettings;
  payment: PaymentSettings;
  notification: NotificationSettings;
  privacy: PrivacySettings;
}

export interface OrganizationHierarchy {
  parentOrganizationId?: ID;
  ancestors: ID[];
  descendants: ID[];
  level: number;
  path: string;
}

export interface FinancialInfo {
  accountNumber: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  panNumber: string;
  gstNumber?: string;
  taxRate: number;
  paymentMethods: string[];
}

export interface MatchScoringSettings {
  autoScoring: boolean;
  ballByBall: boolean;
  liveUpdate: boolean;
  requireUmpireApproval: boolean;
  scorecardTemplate: string;
}

export interface PlayerRegistrationSettings {
  requirePhoto: boolean;
  requireIdProof: boolean;
  requireMedical: boolean;
  requireConsent: boolean;
  autoApprove: boolean;
  registrationFee: Money;
}

export interface PaymentSettings {
  enabled: boolean;
  methods: string[];
  currency: string;
  taxEnabled: boolean;
  invoicePrefix: string;
  paymentTerms: string;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  whatsappEnabled: boolean;
  digestEnabled: boolean;
}

// ============================================================================
// Location Entities
// ============================================================================

export interface Location extends AuditEntity, SoftDeleteEntity {
  id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: number;
  createdBy: ID;
  updatedBy: ID;
  deletedAt: Timestamp | null;
  deletedBy: ID | null;
  name: string;
  type: 'ground' | 'stadium' | 'venue' | 'office' | 'training-center' | 'other';
  address: Address;
  contact: ContactInfo;
  capacity?: number;
  facilities: string[];
  images: MediaReference[];
  status: EntityStatus;
}

// ============================================================================
// Cricket Ground and Venue Entities
// ============================================================================

export interface CricketPitch {
  type: 'dried' | 'green' | 'hard' | 'soft' | 'dry' | 'cricket' | 'artificial';
  condition: 'excellent' | 'good' | 'average' | 'poor' | 'bad';
  pace: 'fast' | 'medium' | 'slow';
  bounce: 'high' | 'medium' | 'low';
  carry: 'good' | 'average' | 'poor';
  spin: 'gravel' | 'clay' | 'sand' | 'loam';
}

export interface CricketGround extends Location {
  pitch: CricketPitch;
  dimensions: {
    boundaryDistance: number; // in meters
    squareLength: number;
    squareWidth: number;
  };
  floodlights: {
    intensity: number; // lux
    available: boolean;
  };
  dressingRooms: number;
  medicalFacilities: boolean;
  tvCameras: boolean;
  seating: SeatingArrangement[];
}

export interface SeatingArrangement {
  section: string;
  rows: number;
  seatsPerRow: number;
  type: 'covered' | 'uncovered' | 'vip' | 'general';
  price: Money;
}
