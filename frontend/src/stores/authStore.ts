import { create } from 'zustand';
import type { User, AuthTokens, Membership, TokenPayload } from '@domain/index';
import {
  getStoredTokens, setStoredTokens, removeStoredTokens,
  getStoredUser, setStoredUser, removeStoredUser,
  getStoredMemberships, setStoredMemberships, removeStoredMemberships,
  getStoredRememberMe, setStoredRememberMe,
  sessionAdaptiveStorage, STORAGE_KEYS,
} from '@core/storage';

/* ── JWT Helpers ───────────────────────────────────────────── */

function parseJwtPayload(token: string): TokenPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload) as TokenPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload) return true;
  return Date.now() >= (payload.exp - 30) * 1000;
}

/* ── State ─────────────────────────────────────────────────── */

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  memberships: Membership[];
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  login: (user: User, tokens: AuthTokens, memberships: Membership[], remember?: boolean) => void;
  logout: () => void;
  setTokens: (tokens: AuthTokens, remember?: boolean) => void;
  updateUser: (user: Partial<User>) => void;
  setMemberships: (memberships: Membership[]) => void;
  setInitialized: (initialized: boolean) => void;
  setLoading: (loading: boolean) => void;

  getAccessToken: () => string | null;
  getTokenPayload: () => TokenPayload | null;
  isTokenValid: () => boolean;
  restoreSession: () => boolean;
}

/* ── Store ─────────────────────────────────────────────────── */

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tokens: null,
  memberships: [],
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  login: (user, tokens, memberships, remember = true) => {
    setStoredRememberMe(remember);
    if (remember) {
      setStoredTokens(tokens.accessToken, tokens.refreshToken);
    } else {
      sessionAdaptiveStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
      sessionAdaptiveStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    }
    setStoredUser(user);
    setStoredMemberships(memberships);

    set({ user, tokens, memberships, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    removeStoredTokens();
    sessionAdaptiveStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionAdaptiveStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    removeStoredUser();
    removeStoredMemberships();

    set({ user: null, tokens: null, memberships: [], isAuthenticated: false, isLoading: false });
  },

  setTokens: (tokens, remember = getStoredRememberMe()) => {
    if (remember) {
      setStoredTokens(tokens.accessToken, tokens.refreshToken);
    } else {
      sessionAdaptiveStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
      sessionAdaptiveStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    }
    set({ tokens });
  },

  updateUser: (partial) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...partial };
    setStoredUser(updated);
    set({ user: updated });
  },

  setMemberships: (memberships) => {
    setStoredMemberships(memberships);
    set({ memberships });
  },

  setInitialized: (initialized) => set({ isInitialized: initialized }),
  setLoading: (loading) => set({ isLoading: loading }),

  getAccessToken: () => {
    return get().tokens?.accessToken ?? getStoredTokens().accessToken;
  },

  getTokenPayload: () => {
    const token = get().tokens?.accessToken ?? getStoredTokens().accessToken;
    if (!token) return null;
    return parseJwtPayload(token);
  },

  isTokenValid: () => {
    const token = get().tokens?.accessToken ?? getStoredTokens().accessToken;
    if (!token) return false;
    return !isTokenExpired(token);
  },

  restoreSession: () => {
    const persistent = getStoredTokens();
    const sessionAccess = sessionAdaptiveStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const sessionRefresh = sessionAdaptiveStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const accessToken = persistent.accessToken ?? sessionAccess;
    const refreshToken = persistent.refreshToken ?? sessionRefresh;
    const user = getStoredUser<User>();
    const memberships = getStoredMemberships<Membership>();

    if (!accessToken || !refreshToken || !user) return false;

    // If access token is expired but refresh token exists, return false to trigger refresh
    if (isTokenExpired(accessToken)) return false;

    set({
      user,
      tokens: { accessToken, refreshToken, expiresIn: 0, tokenType: 'Bearer' },
      memberships,
      isAuthenticated: true,
    });

    return true;
  },
}));
