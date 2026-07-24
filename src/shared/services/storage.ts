// Storage Service - Wrapper for storage operations with utilities

import { LOCAL_STORAGE_KEYS, SESSION_STORAGE_KEYS, STORAGE_TTL } from '../constants/storage';

/**
 * Storage type
 */
export type StorageType = 'local' | 'session';

/**
 * Storage item interface
 */
export interface StorageItem<T> {
  value: T;
  expiry?: number; // Unix timestamp
}

/**
 * Storage service class
 */
class StorageService {
  /**
   * Get storage instance
   */
  private getStorage(type: StorageType): Storage {
    return type === 'local' ? localStorage : sessionStorage;
  }

  /**
   * Get storage key with prefix
   */
  private getKey(key: string): string {
    return key;
  }

  /**
   * Check if item exists in storage
   */
  hasItem(key: string, type: StorageType = 'local'): boolean {
    try {
      const storage = this.getStorage(type);
      return storage.getItem(this.getKey(key)) !== null;
    } catch {
      return false;
    }
  }

  /**
   * Get item from storage
   */
  getItem<T>(key: string, type: StorageType = 'local'): T | null {
    try {
      const storage = this.getStorage(type);
      const item = storage.getItem(this.getKey(key));

      if (!item) {
        return null;
      }

      const parsed: StorageItem<T> = JSON.parse(item);

      // Check if item has expired
      if (parsed.expiry && Date.now() > parsed.expiry) {
        this.removeItem(key, type);
        return null;
      }

      return parsed.value;
    } catch {
      return null;
    }
  }

  /**
   * Set item in storage
   */
  setItem<T>(key: string, value: T, ttl?: number, type: StorageType = 'local'): boolean {
    try {
      const storage = this.getStorage(type);
      const item: StorageItem<T> = { value };

      // Add expiry if TTL provided
      if (ttl) {
        item.expiry = Date.now() + ttl;
      }

      storage.setItem(this.getKey(key), JSON.stringify(item));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Remove item from storage
   */
  removeItem(key: string, type: StorageType = 'local'): boolean {
    try {
      const storage = this.getStorage(type);
      storage.removeItem(this.getKey(key));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clear all items from storage
   */
  clear(type: StorageType = 'local'): boolean {
    try {
      const storage = this.getStorage(type);
      storage.clear();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all keys from storage
   */
  getKeys(type: StorageType = 'local'): string[] {
    try {
      const storage = this.getStorage(type);
      const keys: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        keys.push(storage.key(i) || '');
      }
      return keys;
    } catch {
      return [];
    }
  }

  /**
   * Get storage size
   */
  getSize(type: StorageType = 'local'): number {
    try {
      const storage = this.getStorage(type);
      return storage.length;
    } catch {
      return 0;
    }
  }
}

// Create storage service instance
export const storageService = new StorageService();

// Convenience functions for common operations
export function getStorageItem<T>(key: string): T | null {
  return storageService.getItem<T>(key, 'local');
}

export function setStorageItem<T>(key: string, value: T, ttl?: number): boolean {
  return storageService.setItem<T>(key, value, ttl, 'local');
}

export function removeStorageItem(key: string): boolean {
  return storageService.removeItem(key, 'local');
}

export function hasStorageItem(key: string): boolean {
  return storageService.hasItem(key, 'local');
}

// Session storage convenience functions
export function getSessionItem<T>(key: string): T | null {
  return storageService.getItem<T>(key, 'session');
}

export function setSessionItem<T>(key: string, value: T, ttl?: number): boolean {
  return storageService.setItem<T>(key, value, ttl, 'session');
}

export function removeSessionItem(key: string): boolean {
  return storageService.removeItem(key, 'session');
}

export function hasSessionItem(key: string): boolean {
  return storageService.hasItem(key, 'session');
}

// Cache functions
export function getCacheItem<T>(key: string): T | null {
  return storageService.getItem<T>(key, 'local');
}

export function setCacheItem<T>(key: string, value: T, ttl: number = STORAGE_TTL.veryLong): boolean {
  return storageService.setItem<T>(key, value, ttl, 'local');
}

export function removeCacheItem(key: string): boolean {
  return storageService.removeItem(key, 'local');
}

export function clearCache(): boolean {
  return storageService.clear('local');
}

// Auth storage functions
export function getAuthItem<T>(key: keyof typeof LOCAL_STORAGE_KEYS.auth): T | null {
  return storageService.getItem<T>(LOCAL_STORAGE_KEYS.auth[key], 'local');
}

export function setAuthItem<T>(key: keyof typeof LOCAL_STORAGE_KEYS.auth, value: T, ttl?: number): boolean {
  return storageService.setItem<T>(LOCAL_STORAGE_KEYS.auth[key], value, ttl, 'local');
}

export function removeAuthItem(key: keyof typeof LOCAL_STORAGE_KEYS.auth): boolean {
  return storageService.removeItem(LOCAL_STORAGE_KEYS.auth[key], 'local');
}

// Clear all auth data
export function clearAuthData(): void {
  Object.values(LOCAL_STORAGE_KEYS.auth).forEach((key) => {
    removeStorageItem(key);
  });
}