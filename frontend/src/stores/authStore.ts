import { create } from 'zustand';
import type { User, AuthTokens, Membership, TokenPayload } from '@domain/index';
import {
  getStoredTokens, setStoredTokens, removeStoredTokens,
  getStoredUser, setStoredUser, removeStoredUser,
  getStoredMemberships, setStoredMemberships, removeStoredMemberships,
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

  login: (user: User, tokens: AuthTokens, memberships: Membership[]) => void;
  logout: () => void;
  setTokens: (tokens: AuthTokens) => void;
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

  login: (user, tokens, memberships) => {
    setStoredTokens(tokens.accessToken, tokens.refreshToken);
    setStoredUser(user);
    setStoredMemberships(memberships);

    set({ user, tokens, memberships, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    removeStoredTokens();
    removeStoredUser();
    removeStoredMemberships();

    set({ user: null, tokens: null, memberships: [], isAuthenticated: false, isLoading: false });
  },

  setTokens: (tokens) => {
    setStoredTokens(tokens.accessToken, tokens.refreshToken);
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
    const { accessToken, refreshToken } = getStoredTokens();
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
