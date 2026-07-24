// Shared domain types
export * from './currency';

// Common value objects
export type Gender = 'male' | 'female';
export type Status = 'active' | 'inactive' | 'pending' | 'suspended' | 'archived';

// Identity types
export type EntityId = string;
export type UserId = string;
export type TeamId = string;
export type TournamentId = string;
export type PlayerId = string;

// Time types
export type Timestamp = string; // ISO 8601
export type DateRange = {
  start: string;
  end: string;
};

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Audit types
export interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  entity: string;
  entityId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  timestamp: Timestamp;
  ip?: string;
  userAgent?: string;
}

// Common interfaces
export interface Identifiable {
  id: EntityId;
}

export interface Timestamped {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;
}

export interface Nameable {
  name: string;
  displayName?: string;
  shortName?: string;
}

export interface Descriptionable {
  description?: string;
  notes?: string;
}

// File types
export interface FileMetadata {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  bucket?: string;
}

// Result types
export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface OperationResult extends Result<unknown> {
  affectedRows?: number;
}

// Common enums
export type Sport = 'cricket' | 'football' | 'basketball' | 'tennis' | 'other';

export type VenueType = 'outdoor' | 'indoor' | 'mixed';
export type MatchFormat = 'T20' | 'ODI' | 'Test' | 'First-class' | 'Other';
export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'abandoned' | 'cancelled';