/**
 * Storage abstraction layer.
 * Components must never access localStorage/sessionStorage directly.
 * All storage access goes through this module.
 */

interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

function createSafeStorage(storage: Storage): StorageAdapter {
  return {
    getItem(key: string): string | null {
      try {
        return storage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key: string, value: string): void {
      try {
        storage.setItem(key, value);
      } catch {
        // Storage full or unavailable — silent fail
      }
    },
    removeItem(key: string): void {
      try {
        storage.removeItem(key);
      } catch {
        // Ignore
      }
    },
    clear(): void {
      try {
        storage.clear();
      } catch {
        // Ignore
      }
    },
  };
}

/**
 * Persistent storage (survives page reloads).
 * Uses localStorage when available, falls back to memory storage.
 */
export const persistentStorage: StorageAdapter =
  typeof window !== 'undefined'
    ? createSafeStorage(localStorage)
    : createMemoryStorage();

/**
 * Session storage (cleared when tab closes).
 * Uses sessionStorage when available, falls back to memory storage.
 */
export const sessionAdaptiveStorage: StorageAdapter =
  typeof window !== 'undefined'
    ? createSafeStorage(sessionStorage)
    : createMemoryStorage();

/**
 * In-memory storage fallback (for SSR/testing).
 */
function createMemoryStorage(): StorageAdapter {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

/* ── Named Keys ───────────────────────────────────────────── */

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'cricketos_access_token',
  REFRESH_TOKEN: 'cricketos_refresh_token',
  USER: 'cricketos_user',
  MEMBERSHIPS: 'cricketos_memberships',
  CURRENT_ORG: 'cricketos_current_org',
  REMEMBER_ME: 'cricketos_remember_me',
} as const;

/* ── Typed Accessors ──────────────────────────────────────── */

export function getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
  return {
    accessToken: persistentStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
    refreshToken: persistentStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  };
}

export function setStoredTokens(accessToken: string, refreshToken: string): void {
  persistentStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  persistentStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
}

export function removeStoredTokens(): void {
  persistentStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  persistentStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export function getStoredUser<T>(): T | null {
  const raw = persistentStorage.getItem(STORAGE_KEYS.USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setStoredUser<T>(user: T): void {
  persistentStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function removeStoredUser(): void {
  persistentStorage.removeItem(STORAGE_KEYS.USER);
}

export function getStoredMemberships<T>(): T[] {
  const raw = persistentStorage.getItem(STORAGE_KEYS.MEMBERSHIPS);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export function setStoredMemberships<T>(memberships: T[]): void {
  persistentStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));
}

export function removeStoredMemberships(): void {
  persistentStorage.removeItem(STORAGE_KEYS.MEMBERSHIPS);
}

export function getStoredOrgId(): string | null {
  return persistentStorage.getItem(STORAGE_KEYS.CURRENT_ORG);
}

export function setStoredOrgId(orgId: string): void {
  persistentStorage.setItem(STORAGE_KEYS.CURRENT_ORG, orgId);
}

export function removeStoredOrgId(): void {
  persistentStorage.removeItem(STORAGE_KEYS.CURRENT_ORG);
}

export function clearAllAuthStorage(): void {
  removeStoredTokens();
  removeStoredUser();
  removeStoredMemberships();
  removeStoredOrgId();
}
