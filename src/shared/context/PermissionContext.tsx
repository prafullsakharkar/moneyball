import React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

type Permission = 'read' | 'write' | 'delete' | 'admin' | 'view_analytics' | 'edit_analytics' | 'manage_users' | 'manage_teams' | 'manage_players' | 'manage_matches' | 'manage_academy' | 'manage_auction' | 'manage_video' | 'manage_training';

interface PermissionContextType {
  hasPermission: (permission: Permission | Permission[]) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  checkRole: (role: string | string[]) => boolean;
  isLoading: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

const DEFAULT_PERMISSIONS: Record<string, Permission[]> = {
  admin: ['read', 'write', 'delete', 'admin', 'view_analytics', 'edit_analytics', 'manage_users', 'manage_teams', 'manage_players', 'manage_matches', 'manage_academy', 'manage_auction', 'manage_video', 'manage_training'] as Permission[],
  manager: ['read', 'write', 'view_analytics', 'edit_analytics', 'manage_teams', 'manage_players', 'manage_matches', 'manage_academy'] as Permission[],
  coach: ['read', 'write', 'view_analytics', 'edit_analytics', 'manage_academy', 'manage_training'] as Permission[],
  player: ['read', 'view_analytics', 'manage_training'] as Permission[],
  analyst: ['read', 'view_analytics', 'edit_analytics'] as Permission[],
  scout: ['read', 'write', 'view_analytics', 'manage_players'] as Permission[],
};

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isPermissionLoading, setIsPermissionLoading] = useState(true);

  useEffect(() => {
    if (user && isAuthenticated) {
      const userPermissions = user.permissions || [];
      if (userPermissions.length > 0) {
        setPermissions(userPermissions);
      } else if (user.role) {
        setPermissions(DEFAULT_PERMISSIONS[user.role] || []);
      }
      setIsPermissionLoading(false);
    } else {
      setPermissions([]);
      setIsPermissionLoading(false);
    }
  }, [user, isAuthenticated, loading]);

  const hasPermission = useCallback((permission: Permission | Permission[]): boolean => {
    if (!isAuthenticated) return false;
    
    const permissionArray = Array.isArray(permission) ? permission : [permission];
    
    // Admin has all permissions
    if (permissions.includes('admin')) return true;
    
    return permissionArray.every(p => permissions.includes(p));
  }, [permissions, isAuthenticated]);

  const hasAnyPermission = useCallback((permissionsList: Permission[]): boolean => {
    if (!isAuthenticated) return false;
    
    // Admin has all permissions
    if (permissions.includes('admin')) return true;
    
    return permissionsList.some(p => permissions.includes(p));
  }, [permissions, isAuthenticated]);

  const hasAllPermissions = useCallback((permissionsList: Permission[]): boolean => {
    if (!isAuthenticated) return false;
    
    // Admin has all permissions
    if (permissions.includes('admin')) return true;
    
    return permissionsList.every(p => permissions.includes(p));
  }, [permissions, isAuthenticated]);

  const checkRole = useCallback((role: string | string[]): boolean => {
    if (!user) return false;
    
    const roleArray = Array.isArray(role) ? role : [role];
    return roleArray.includes(user.role);
  }, [user]);

  return (
    <PermissionContext.Provider
      value={{
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        checkRole,
        isLoading: isPermissionLoading,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermission() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
}

export default PermissionContext;