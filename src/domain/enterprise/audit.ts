import { Identifiable, Timestamped } from '../shared';

// Audit types
export type AuditAction = 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'access' | 'export';
export type AuditCategory = 'user' | 'organization' | 'tournament' | 'match' | 'fantasy' | 'financial' | 'system' | 'other';
export type AuditLevel = 'info' | 'warning' | 'error' | 'critical';
export type AuditSource = 'web' | 'api' | 'mobile' | 'admin' | 'batch' | 'scheduled';

export interface AuditLog extends Identifiable, Timestamped {
  action: AuditAction;
  category: AuditCategory;
  level: AuditLevel;
  
  // User
  userId?: string;
  userName?: string;
  
  // Target
  targetId?: string;
  targetName?: string;
  targetType?: string;
  
  // Context
  source: AuditSource;
  ipAddress: string;
  userAgent?: string;
  
  // Details
  description?: string;
  dataBefore?: any;
  dataAfter?: any;
  
  // Status
  isSuccess: boolean;
  errorMessage?: string;
  
  // Additional
  metadata?: Record<string, any>;
}

export interface AuditTrail extends Identifiable, Timestamped {
  id: string;
  action: AuditAction;
  category: AuditCategory;
  
  // User
  userId: string;
  userName: string;
  
  // Target
  targetId?: string;
  targetType?: string;
  
  // Context
  source: AuditSource;
  ipAddress: string;
  
  // Timing
  occurredAt: string;
  processedAt: string;
  
  // Status
  isSuccess: boolean;
}

export interface AuditReport extends Identifiable, Timestamped {
  title: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  
  // Summary
  totalLogs: number;
  byCategory: CategoryBreakdown[];
  byAction: ActionBreakdown[];
  byLevel: LevelBreakdown[];
  
  // Security
  failedActions: number;
  criticalEvents: number;
  uniqueUsers: number;
}

export interface CategoryBreakdown {
  category: AuditCategory;
  count: number;
  percentage: number;
}

export interface ActionBreakdown {
  action: AuditAction;
  count: number;
  percentage: number;
}

export interface LevelBreakdown {
  level: AuditLevel;
  count: number;
  percentage: number;
}

export interface AuditSettings extends Identifiable, Timestamped {
  orgId?: string;
  
  // Retention
  retentionDays: number;
  archiveEnabled: boolean;
  
  // Categories to track
  trackCategories: AuditCategory[];
  trackActions: AuditAction[];
  
  // Notification
  alertOnCritical: boolean;
  alertOnFailed: boolean;
  alertEmail?: string;
}