// Permission model for Identity Service

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  createdAt: string;
}

export interface PermissionCreateInput {
  name: string;
  description?: string;
  resource: string;
  action: string;
}

export interface PermissionUpdateInput {
  name?: string;
  description?: string;
  resource?: string;
  action?: string;
}
