// Role model for Identity Service

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleCreateInput {
  name: string;
  description?: string;
  permissions: string[];
  isSystem?: boolean;
}

export interface RoleUpdateInput {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface UserRoleAssignment {
  userId: string;
  roleId: string;
  assignedBy?: string;
  assignedAt: string;
}
