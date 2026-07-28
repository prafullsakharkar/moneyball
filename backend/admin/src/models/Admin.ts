// Models for Admin Service

export enum LogLevel {
  Debug = 'Debug',
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
  Critical = 'Critical'
}

export enum LogCategory {
  System = 'System',
  Database = 'Database',
  API = 'API',
  Authentication = 'Authentication',
  Authorization = 'Authorization',
  Cache = 'Cache',
  Queue = 'Queue',
  FileUpload = 'FileUpload',
  Email = 'Email',
  SMS = 'SMS',
  Payment = 'Payment',
  Other = 'Other'
}

export enum CacheType {
  Player = 'Player',
  Team = 'Team',
  Match = 'Match',
  Tournament = 'Tournament',
  Analytics = 'Analytics',
  User = 'User',
  Session = 'Session',
  Config = 'Config',
  Other = 'Other'
}

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface SystemSetting {
  id: string;
  settingKey: string;
  settingValue: Record<string, unknown>;
  settingType: string;
  description: string | null;
  isLocked: boolean;
  updatedBy: string | null;
  updatedAt: string;
}

export interface SystemLog {
  id: string;
  logLevel: string;
  logCategory: string;
  message: string;
  stackTrace: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface CacheInvalidation {
  id: string;
  cacheKey: string;
  cacheType: string;
  invalidatedAt: string;
}

export interface ApiRateLimit {
  id: string;
  ipAddress: string;
  endpoint: string;
  requestCount: number;
  windowStart: string;
}

export interface Migration {
  id: string;
  name: string;
  executedAt: string;
}

// Input types for CRUD operations
export interface AuditLogCreateInput {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface SystemSettingCreateInput {
  settingKey: string;
  settingValue: Record<string, unknown>;
  settingType: string;
  description?: string;
  isLocked?: boolean;
  updatedBy?: string;
}

export interface SystemSettingUpdateInput {
  settingValue?: Record<string, unknown>;
  description?: string;
  isLocked?: boolean;
}

export interface SystemLogCreateInput {
  logLevel: string;
  logCategory: string;
  message: string;
  stackTrace?: string;
  metadata?: Record<string, unknown>;
}

export interface CacheInvalidationCreateInput {
  cacheKey: string;
  cacheType: string;
}

export interface ApiRateLimitCreateInput {
  ipAddress: string;
  endpoint: string;
  requestCount?: number;
}

export interface MigrationCreateInput {
  name: string;
}
