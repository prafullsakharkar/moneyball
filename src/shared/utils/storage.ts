// Local and session storage utilities

// Storage type
export type StorageType = 'localStorage' | 'sessionStorage';

// Storage options interface
export interface StorageOptions {
  type?: StorageType;
  expire?: number; // Expiration time in minutes
}

// Storage item with metadata
export interface StorageItem<T> {
  value: T;
  timestamp: number;
  expire?: number;
}

/**
 * Get storage instance based on type
 * 
 * @param type - Storage type (localStorage or sessionStorage)
 * @returns Storage API instance
 */
function getStorage(type: StorageType = 'localStorage'): Storage {
  switch (type) {
    case 'sessionStorage':
      return window.sessionStorage;
    default:
      return window.localStorage;
  }
}

/**
 * Check if storage is available
 * 
 * @param type - Storage type
 * @returns True if storage is available
 */
export function isStorageAvailable(type: StorageType = 'localStorage'): boolean {
  try {
    const storage = getStorage(type);
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if storage is available for both localStorage and sessionStorage
 * 
 * @returns Object with storage availability flags
 */
export function checkStorageAvailability(): {
  localStorage: boolean;
  sessionStorage: boolean;
} {
  return {
    localStorage: isStorageAvailable('localStorage'),
    sessionStorage: isStorageAvailable('sessionStorage'),
  };
}

/**
 * Get item from storage
 * 
 * @param key - Storage key
 * @param options - Storage options
 * @returns Stored value or null
 */
export function getItem<T = any>(
  key: string,
  options: StorageOptions = {}
): T | null {
  const { type = 'localStorage' } = options;
  
  if (!isStorageAvailable(type)) return null;
  
  try {
    const storage = getStorage(type);
    const item = storage.getItem(key);
    
    if (!item) return null;
    
    const parsed: StorageItem<T> = JSON.parse(item);
    
    // Check if expired
    if (parsed.expire && parsed.timestamp) {
      const now = Date.now();
      const expiryTime = parsed.timestamp + (parsed.expire * 60 * 1000);
      
      if (now > expiryTime) {
        removeItem(key, { type });
        return null;
      }
    }
    
    return parsed.value;
  } catch (e) {
    console.error(`Error getting item "${key}":`, e);
    return null;
  }
}

/**
 * Set item in storage
 * 
 * @param key - Storage key
 * @param value - Value to store
 * @param options - Storage options
 */
export function setItem<T>(
  key: string,
  value: T,
  options: StorageOptions = {}
): void {
  const { type = 'localStorage', expire } = options;
  
  if (!isStorageAvailable(type)) return;
  
  try {
    const storage = getStorage(type);
    const item: StorageItem<T> = {
      value,
      timestamp: Date.now(),
      expire,
    };
    
    storage.setItem(key, JSON.stringify(item));
  } catch (e) {
    console.error(`Error setting item "${key}":`, e);
  }
}

/**
 * Remove item from storage
 * 
 * @param key - Storage key
 * @param options - Storage options
 */
export function removeItem(
  key: string,
  options: StorageOptions = {}
): void {
  const { type = 'localStorage' } = options;
  
  if (!isStorageAvailable(type)) return;
  
  try {
    const storage = getStorage(type);
    storage.removeItem(key);
  } catch (e) {
    console.error(`Error removing item "${key}":`, e);
  }
}

/**
 * Clear all items from storage
 * 
 * @param options - Storage options
 */
export function clearStorage(options: StorageOptions = {}): void {
  const { type = 'localStorage' } = options;
  
  if (!isStorageAvailable(type)) return;
  
  try {
    const storage = getStorage(type);
    storage.clear();
  } catch (e) {
    console.error(`Error clearing storage (${type}):`, e);
  }
}

/**
 * Get storage key prefix
 * 
 * @param options - Storage options
 * @returns Storage key prefix
 */
export function getStoragePrefix(options: StorageOptions = {}): string {
  const { type = 'localStorage' } = options;
  const prefix = type === 'localStorage' ? 'ls:' : 'ss:';
  
  return prefix;
}

/**
 * Get full storage key with prefix
 * 
 * @param key - Storage key
 * @param options - Storage options
 * @returns Full storage key
 */
export function getFullKey(key: string, options: StorageOptions = {}): string {
  const prefix = getStoragePrefix(options);
  return `${prefix}${key}`;
}

/**
 * Set item with prefixed key
 * 
 * @param key - Storage key
 * @param value - Value to store
 * @param options - Storage options
 */
export function setItemPrefixed<T>(
  key: string,
  value: T,
  options: StorageOptions = {}
): void {
  const fullKey = getFullKey(key, options);
  setItem(fullKey, value, options);
}

/**
 * Get item with prefixed key
 * 
 * @param key - Storage key
 * @param options - Storage options
 * @returns Stored value or null
 */
export function getItemPrefixed<T>(
  key: string,
  options: StorageOptions = {}
): T | null {
  const fullKey = getFullKey(key, options);
  return getItem<T>(fullKey, options);
}

/**
 * Remove item with prefixed key
 * 
 * @param key - Storage key
 * @param options - Storage options
 */
export function removeItemPrefixed(
  key: string,
  options: StorageOptions = {}
): void {
  const fullKey = getFullKey(key, options);
  removeItem(fullKey, options);
}

/**
 * Get all keys matching pattern
 * 
 * @param pattern - Key pattern
 * @param options - Storage options
 * @returns Array of matching keys
 */
export function getKeysByPattern(
  pattern: string,
  options: StorageOptions = {}
): string[] {
  const { type = 'localStorage' } = options;
  
  if (!isStorageAvailable(type)) return [];
  
  try {
    const storage = getStorage(type);
    const keys: string[] = [];
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.includes(pattern)) {
        keys.push(key);
      }
    }
    
    return keys;
  } catch (e) {
    console.error(`Error getting keys by pattern "${pattern}":`, e);
    return [];
  }
}

/**
 * Count items in storage
 * 
 * @param options - Storage options
 * @returns Number of items
 */
export function countItems(options: StorageOptions = {}): number {
  const { type = 'localStorage' } = options;
  
  if (!isStorageAvailable(type)) return 0;
  
  try {
    const storage = getStorage(type);
    return storage.length;
  } catch (e) {
    console.error(`Error counting items (${type}):`, e);
    return 0;
  }
}

/**
 * Check if storage has items
 * 
 * @param options - Storage options
 * @returns True if storage has items
 */
export function hasItems(options: StorageOptions = {}): boolean {
  return countItems(options) > 0;
}

/**
 * Store JSON object with expiration
 * 
 * @param key - Storage key
 * @param value - Object to store
 * @param expire - Expiration time in minutes
 * @param options - Storage options
 */
export function setItemWithExpiration<T>(
  key: string,
  value: T,
  expire: number,
  options: StorageOptions = {}
): void {
  setItem<T>(key, value, { ...options, expire });
}

/**
 * Get JSON object with expiration check
 * 
 * @param key - Storage key
 * @param options - Storage options
 * @returns Stored value or null if expired
 */
export function getItemWithExpiration<T>(
  key: string,
  options: StorageOptions = {}
): T | null {
  return getItem<T>(key, options);
}

/**
 * Store user preferences
 * 
 * @param key - Preference key
 * @param value - Preference value
 */
export function savePreference<T>(key: string, value: T): void {
  setItemPrefixed<T>(key, value, { type: 'localStorage' });
}

/**
 * Get user preference
 * 
 * @param key - Preference key
 * @returns Preference value or null
 */
export function getPreference<T>(key: string): T | null {
  return getItemPrefixed<T>(key, { type: 'localStorage' });
}

/**
 * Remove user preference
 * 
 * @param key - Preference key
 */
export function removePreference(key: string): void {
  removeItemPrefixed(key, { type: 'localStorage' });
}

/**
 * Clear all user preferences
 */
export function clearPreferences(): void {
  clearStorage({ type: 'localStorage' });
}

/**
 * Store authentication token
 * 
 * @param token - Authentication token
 * @param expire - Expiration time in minutes
 */
export function saveAuthToken(token: string, expire: number = 60): void {
  setItemWithExpiration('auth_token', token, expire, { type: 'localStorage' });
}

/**
 * Get authentication token
 * 
 * @returns Authentication token or null
 */
export function getAuthToken(): string | null {
  return getItemWithExpiration<string>('auth_token', { type: 'localStorage' });
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  removeItem('auth_token', { type: 'localStorage' });
}

/**
 * Check if authentication token is valid
 * 
 * @returns True if token exists and is not expired
 */
export function isAuthTokenValid(): boolean {
  return getAuthToken() !== null;
}

/**
 * Store theme preference
 * 
 * @param theme - Theme name (light/dark/system)
 */
export function saveTheme(theme: string): void {
  setItemPrefixed('theme', theme, { type: 'localStorage' });
}

/**
 * Get theme preference
 * 
 * @returns Theme name or null
 */
export function getTheme(): string | null {
  return getItemPrefixed<string>('theme', { type: 'localStorage' });
}

/**
 * Store user settings
 * 
 * @param settings - User settings object
 */
export function saveUserSettings(settings: Record<string, any>): void {
  setItemPrefixed('user_settings', settings, { type: 'localStorage' });
}

/**
 * Get user settings
 * 
 * @returns User settings object or null
 */
export function getUserSettings(): Record<string, any> | null {
  return getItemPrefixed<Record<string, any>>('user_settings', {
    type: 'localStorage',
  });
}