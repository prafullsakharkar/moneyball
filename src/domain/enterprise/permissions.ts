import { Identifiable, Timestamped } from '../shared';

// Permission types
export type PermissionScope = 'global' | 'org' | 'tournament' | 'team' | 'user';
export type PermissionAction = 'read' | 'write' | 'delete' | 'manage' | 'approve';
export type PermissionLevel = 'none' | 'view' | 'edit' | 'admin';

export interface Permission extends Identifiable, Timestamped {
  name: string;
  description?: string;
  
  // Scope
  scope: PermissionScope;
  scopeId?: string; // orgId, tournamentId, etc.
  
  // Action
  action: PermissionAction;
  
  // Resource
  resourceType?: string;
  resourceId?: string;
}

export interface Role extends Identifiable, Timestamped {
  name: string;
  description?: string;
  
  // Permissions
  permissions: RolePermission[];
  
  // Scope
  scope: PermissionScope;
  scopeId?: string;
  
  // Status
  isDefault: boolean;
  isActive: boolean;
  
  // Assigned to
  assignedCount: number;
}

export interface RolePermission extends Identifiable {
  permissionId: string;
  permissionName: string;
  
  action: PermissionAction;
  level: PermissionLevel;
}

export interface UserRoleAssignment extends Identifiable, Timestamped {
  userId: string;
  userName: string;
  
  roleId: string;
  roleName: string;
  
  // Scope
  scope: PermissionScope;
  scopeId?: string;
  scopeName?: string;
  
  // Status
  isActive: boolean;
  
  // Timing
  assignedAt: string;
  expiresAt?: string;
}

export interface PermissionAudit extends Identifiable, Timestamped {
  userId: string;
  userName: string;
  
  action: 'permission_grant' | 'permission_revoke' | 'role_assign' | 'role_remove';
  targetUserId?: string;
  targetUserName?: string;
  
  // Details
  permissionId?: string;
  permissionName?: string;
  roleId?: string;
  roleName?: string;
  
  // Scope
  scope: PermissionScope;
  scopeId?: string;
  
  // Context
  ipAddress: string;
  deviceInfo?: string;
}

export interface PermissionTree {
  global: PermissionGroup;
  organizations: Record<string, PermissionGroup>;
  tournaments: Record<string, PermissionGroup>;
  teams: Record<string, PermissionGroup>;
}

export interface PermissionGroup {
  read: boolean;
  write: boolean;
  delete: boolean;
  manage: boolean;
  approve: boolean;
}