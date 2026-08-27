import { useEffect, useRef, useCallback, createContext, useContext, type ReactNode } from 'react';
import { useAuthStore } from '@stores/authStore';
import { useOrganizationStore } from '@stores/organizationStore';
import { useSessionStore } from '@stores/sessionStore';
import { identityService, setUnauthorizedHandler } from '@api/index';

/* ── Context ───────────────────────────────────────────────── */

interface AuthContextValue {
  login: (email: string, password: string, organizationSlug?: string, remember?: boolean) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  switchOrganization: (organizationId: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  isInitialized: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ── Provider Component ────────────────────────────────────── */

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setInitialized, setLoading } = useAuthStore();
  const { initialize: initializeOrg, clear: clearOrg } = useOrganizationStore();
  const { clear: clearSessions } = useSessionStore();
  const interceptorSetup = useRef(false);

  // Setup unauthorized handler (redirect to login)
  useEffect(() => {
    if (!interceptorSetup.current) {
      setUnauthorizedHandler(() => {
        useAuthStore.getState().logout();
        useOrganizationStore.getState().clear();
        useSessionStore.getState().clear();
        window.location.href = '/auth/login';
      });
      interceptorSetup.current = true;
    }
  }, []);

  // Session restoration on mount
  useEffect(() => {
    async function restore() {
      setLoading(true);
      const restored = useAuthStore.getState().restoreSession();
      if (restored) {
        initializeOrg(useAuthStore.getState().memberships);
      }
      setInitialized(true);
      setLoading(false);
    }
    restore();
  }, [setInitialized, setLoading, initializeOrg]);

  /* ── Actions ──────────────────────────────────────────────── */

  const login = useCallback(
    async (email: string, password: string, organizationSlug?: string, remember = true) => {
      setLoading(true);
      try {
        const response = await identityService.login({ email, password, organizationSlug });
        const { user, tokens, memberships, mfaRequired } = response;
        if (mfaRequired) throw new Error('MFA required');
        useAuthStore.getState().login(user, tokens, memberships, remember);
        initializeOrg(memberships);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    [setLoading, initializeOrg]
  );

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      organizationName?: string;
    }) => {
      setLoading(true);
      try {
        const response = await identityService.register(data);
        const { user, tokens, membership } = response;
        useAuthStore.getState().login(user, tokens, [membership]);
        initializeOrg([membership]);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    [setLoading, initializeOrg]
  );

  const logout = useCallback(async () => {
    const refreshToken = useAuthStore.getState().tokens?.refreshToken;
    if (refreshToken) {
      try { await identityService.logout(refreshToken); } catch { /* best-effort */ }
    }
    useAuthStore.getState().logout();
    clearOrg();
    clearSessions();
  }, [clearOrg, clearSessions]);

  const switchOrganization = useCallback(async (organizationId: string) => {
    const membership = useOrganizationStore.getState().switchOrganization(organizationId);
    if (!membership) return;
    try {
      const response = await identityService.switchOrganization({ organizationId });
      useAuthStore.getState().setTokens(response.tokens);
    } catch {
      const prevOrgId = useOrganizationStore.getState().currentOrganization?.id;
      if (prevOrgId) useOrganizationStore.getState().switchOrganization(prevOrgId);
      throw new Error('Failed to switch organization');
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await identityService.forgotPassword({ email });
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    await identityService.resetPassword({ token, password });
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    await identityService.verifyEmail({ token });
    useAuthStore.getState().updateUser({ emailVerified: true });
  }, []);

  const authState = useAuthStore();

  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        logout,
        switchOrganization,
        forgotPassword,
        resetPassword,
        verifyEmail,
        isInitialized: authState.isInitialized,
        isLoading: authState.isLoading,
        isAuthenticated: authState.isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
