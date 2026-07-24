// React hook for authentication state management

import { useState, useEffect, useCallback } from 'react';
import { Result } from '../types/common';

// Auth types
export interface User {
  id: string;
  email: string;
  userName: string;
  displayName: string;
  role: string;
  permissions: string[];
  profileImage?: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthState {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UseAuthReturn {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<Result<User>>;
  logout: () => void;
  refreshToken: () => Promise<Result<AuthToken>>;
  updateProfile: (profile: Partial<User>) => Promise<Result<User>>;
  checkPermission: (permission: string) => boolean;
}

const STORAGE_KEYS = {
  USER: 'moneyball_user',
  TOKEN: 'moneyball_token',
};

/**
 * Custom hook for authentication state management
 * Handles user login, logout, token refresh, and permission checking
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<AuthToken | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user and token from storage on mount
  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = useCallback(async (): Promise<void> => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

      if (storedUser && storedToken) {
        const userData: User = JSON.parse(storedUser);
        const tokenData: AuthToken = JSON.parse(storedToken);

        // Check if token is expired
        if (isTokenExpired(tokenData)) {
          // Try to refresh token
          const refreshResult = await refreshToken();
          if (!refreshResult.success) {
            clearAuth();
          }
        } else {
          setUser(userData);
          setToken(tokenData);
        }
      }
    } catch (err) {
      console.error('Failed to load auth state:', err);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isTokenExpired = (tokenData: AuthToken): boolean => {
    try {
      const payload = JSON.parse(atob(tokenData.accessToken.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  };

  const clearAuth = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  };

  const saveAuthState = (userData: User, tokenData: AuthToken): void => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(tokenData));
  };

  const login = async (email: string, password: string): Promise<Result<User>> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });

      // if (!response.ok) {
      //   throw new Error('Invalid credentials');
      // }

      // For demo purposes, creating a mock user
      const mockUser: User = {
        id: '1',
        email,
        userName: email.split('@')[0],
        displayName: 'User',
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'admin'],
        profileImage: '',
      };

      const mockToken: AuthToken = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600,
        tokenType: 'Bearer',
      };

      saveAuthState(mockUser, mockToken);
      
      return { success: true, data: mockUser };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback((): void => {
    clearAuth();
    // TODO: Add navigation redirect after logout
    // navigate('/login');
  }, []);

  const refreshToken = async (): Promise<Result<AuthToken>> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/refresh', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ refreshToken: token?.refreshToken }),
      // });

      // if (!response.ok) {
      //   throw new Error('Token refresh failed');
      // }

      // For demo purposes
      const newToken: AuthToken = {
        accessToken: 'new-mock-access-token',
        refreshToken: token?.refreshToken || 'mock-refresh-token',
        expiresIn: 3600,
        tokenType: 'Bearer',
      };

      setToken(newToken);
      localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(newToken));

      return { success: true, data: newToken };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Token refresh failed';
      clearAuth();
      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (profile: Partial<User>): Promise<Result<User>> => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const updatedUser: User = { ...user, ...profile };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

      return { success: true, data: updatedUser };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  };

  const checkPermission = useCallback((permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  }, [user]);

  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    error,
    login,
    logout,
    refreshToken,
    updateProfile,
    checkPermission,
  };
}