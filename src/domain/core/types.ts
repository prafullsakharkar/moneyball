// =============================================================================
// CricketIQ - Core Domain Types
// =============================================================================
// This file contains the foundational types used across all domain models.
// Each file is capped at ~500 lines for maintainability.
// =============================================================================

// ============================================================================
// Base Types
// ============================================================================

export type ID = string;
export type UUID = string;
export type Timestamp = string; // ISO 8601 format

export interface BaseEntity {
  id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: number;
}

export interface AuditEntity extends BaseEntity {
  createdBy: ID;
  updatedBy: ID;
}

export interface SoftDeleteEntity extends BaseEntity {
  deletedAt: Timestamp | null;
  deletedBy: ID | null;
}

// ============================================================================
// Common Value Objects
// ============================================================================

export interface Money {
  amount: number;
  currency: string; // ISO 4217 currency code
  formatted: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
  alternatePhone?: string;
  socialMedia?: SocialMediaLink[];
}

export interface SocialMediaLink {
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok';
  url: string;
  handle: string;
}

export interface MediaReference {
  id: ID;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnailUrl?: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: Timestamp;
  uploadedBy: ID;
}

export interface Location {
  name: string;
  address: Address;
  capacity?: number;
  facilities?: string[];
}

// ============================================================================
// Cricket-Specific Types
// ============================================================================

export type CricketFormat = 'test' | 'odi' | 't20' | 't10' | 'first-class' | 'list-a' | 'other';

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
}

// ============================================================================
// Status and State Types
// ============================================================================

export type EntityStatus = 
  | 'draft' 
  | 'pending' 
  | 'active' 
  | 'inactive' 
  | 'suspended' 
  | 'archived' 
  | 'deleted';

export type MatchStatus = 
  | 'scheduled' 
  | 'warmup' 
  | 'first-innings' 
  | 'second-innings' 
  | 'innings-break' 
  | 'match-completed' 
  | 'abandoned' 
  | 'cancelled' 
  | 'postponed' 
  | 'timeout' 
  | 'tied' 
  | 'no-result';

export type ScoringStatus = 
  | 'not-started' 
  | 'in-progress' 
  | 'paused' 
  | 'completed' 
  | 'cancelled';

export type PlayerStatus = 
  | 'available' 
  | 'injured' 
  | 'suspended' 
  | 'unavailable' 
  | 'retired' 
  | 'transferred';

export type TeamStatus = 
  | 'active' 
  | 'inactive' 
  | 'suspended' 
  | 'disbanded';

export type TournamentStatus = 
  | 'planning' 
  | 'registration-open' 
  | 'registration-closed' 
  | 'in-progress' 
  | 'completed' 
  | 'cancelled';

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationResult;
}

// ============================================================================
// Filter and Sort Types
// ============================================================================

export type FilterOperator = 
  | 'eq' 
  | 'ne' 
  | 'lt' 
  | 'lte' 
  | 'gt' 
  | 'gte' 
  | 'contains' 
  | 'in' 
  | 'not-in' 
  | 'like' 
  | 'null' 
  | 'not-null';

export interface Filter {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export interface Sort {
  field: string;
  order: 'asc' | 'desc';
}

export interface QueryOptions {
  filters?: Filter[];
  sorts?: Sort[];
  pagination?: PaginationParams;
  include?: string[];
  exclude?: string[];
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: Timestamp;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  field?: string;
}

export interface ListResponse<T> {
  data: T[];
  meta: PaginationResult;
}

// ============================================================================
// Event and Audit Types
// ============================================================================

export type AuditAction = 
  | 'create' 
  | 'read' 
  | 'update' 
  | 'delete' 
  | 'login' 
  | 'logout' 
  | 'permission-change' 
  | 'status-change' 
  | 'import' 
  | 'export';

export interface AuditLog extends AuditEntity {
  action: AuditAction;
  entityType: string;
  entityId: ID;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'system' 
  | 'match' 
  | 'scoring' 
  | 'team' 
  | 'player' 
  | 'tournament' 
  | 'payment' 
  | 'reminder';

export type NotificationChannel = 
  | 'email' 
  | 'sms' 
  | 'push' 
  | 'in-app' 
  | 'whatsapp';

export interface Notification {
  id: ID;
  userId: ID;
  type: NotificationType;
  title: string;
  message: string;
  channel: NotificationChannel;
  isRead: boolean;
  readAt?: Timestamp;
  metadata?: Record<string, unknown>;
  relatedEntity?: {
    type: string;
    id: ID;
  };
}

// ============================================================================
// File Upload Types
// ============================================================================

export interface FileUpload {
  id: ID;
  file: File;
  url?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface UploadResponse {
  id: ID;
  url: string;
  thumbnailUrl?: string;
  name: string;
  size: number;
  mimeType: string;
}

// ============================================================================
// Search Types
// ============================================================================

export interface SearchQuery {
  query: string;
  filters?: Filter[];
  limit?: number;
  offset?: number;
}

export interface SearchResult<T> {
  id: ID;
  score: number;
  data: T;
  highlights?: Record<string, string[]>;
}

export interface SearchResponse<T> {
  results: SearchResult<T>[];
  total: number;
  took: number; // milliseconds
  facets?: Record<string, Record<string, number>>;
}
