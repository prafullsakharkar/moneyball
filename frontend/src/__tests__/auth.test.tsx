import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { server } from '../mocks/server';
import { AppProvider } from '../providers/AppProvider';
import { AuthProvider, useAuth } from '../providers/AuthProvider';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { GuestRoute } from '../shared/components/GuestRoute';
import { useAuthStore } from '../stores/authStore';
import { useOrganizationStore } from '../stores/organizationStore';
import { setStoredTokens, getStoredUser, STORAGE_KEYS } from '../core/storage';

const API = 'http://localhost:3000/api/v1';

/* ── Helpers ──────────────────────────────────────────────── */

function createValidToken(expOffsetSeconds = 3600) {
  const payload = {
    sub: 'usr_001', email: 'admin@cricketos.com', organizationId: 'org_001',
    role: 'admin', permissions: [],
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expOffsetSeconds,
  };
  return 'header.' + btoa(JSON.stringify(payload)) + '.signature';
}

const mockUser = {
  id: 'usr_001', email: 'admin@cricketos.com', firstName: 'John', lastName: 'Smith',
  emailVerified: true, mfaEnabled: false, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
};

function TestAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter initialEntries={['/']}>
      <AppProvider>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={children} />
          </Routes>
        </AuthProvider>
      </AppProvider>
    </MemoryRouter>
  );
}

function LoginPageStub() {
  const { login, isLoading } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await login(form.get('email') as string, form.get('password') as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" defaultValue="admin@cricketos.com" />
      <input name="password" type="password" defaultValue="password123" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
      {error && <div role="alert">{error}</div>}
    </form>
  );
}

function AuthStatus() {
  const { isAuthenticated, isInitialized } = useAuth();
  return (
    <div>
      <span data-testid="initialized">{String(isInitialized)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
    </div>
  );
}

function OrgSwitcherStub() {
  const { switchOrganization } = useAuth();
  const orgs = useOrganizationStore((s) => s.organizations);
  const current = useOrganizationStore((s) => s.currentOrganization);

  return (
    <div>
      <span data-testid="current-org">{current?.name ?? 'none'}</span>
      {orgs.map((org) => (
        <button key={org.id} onClick={() => switchOrganization(org.id)}>
          Switch to {org.name}
        </button>
      ))}
    </div>
  );
}

/* ── Setup ────────────────────────────────────────────────── */

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({
    user: null, tokens: null, memberships: [],
    isAuthenticated: false, isLoading: false, isInitialized: false,
  });
  useOrganizationStore.setState({
    currentOrganization: null, organizations: [], memberships: [], isSwitching: false,
  });
});

/* ── Login Tests ──────────────────────────────────────────── */

describe('Authentication - Login', () => {
  it('logs in successfully with valid credentials', async () => {
    const user = userEvent.setup();
    render(
      <TestAuthProvider>
        <LoginPageStub />
      </TestAuthProvider>
    );

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user?.email).toBe('admin@cricketos.com');
    });
  });

  it('stores tokens and user in storage after login', async () => {
    const user = userEvent.setup();
    render(
      <TestAuthProvider>
        <LoginPageStub />
      </TestAuthProvider>
    );

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeTruthy();
      expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBeTruthy();
      expect(getStoredUser()).toBeTruthy();
    });
  });

  it('shows error for invalid credentials', async () => {
    const user = userEvent.setup();

    server.use(
      http.post(`${API}/auth/login`, () => {
        return HttpResponse.json(
          { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } },
          { status: 401 }
        );
      })
    );

    render(
      <TestAuthProvider>
        <LoginPageStub />
      </TestAuthProvider>
    );

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeDefined();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});

/* ── Token Refresh Tests ──────────────────────────────────── */

describe('Authentication - Token Refresh', () => {
  it('clears auth state when refresh token is invalid', async () => {
    // Pre-set tokens — the expired access token triggers refresh,
    // which fails because the refresh token is invalid
    setStoredTokens('expired_access_token', 'invalid_refresh_token');

    server.use(
      http.post(`${API}/auth/refresh`, () => {
        return HttpResponse.json(
          { success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid refresh token' } },
          { status: 401 }
        );
      })
    );

    render(
      <TestAuthProvider>
        <AuthStatus />
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('initialized').textContent).toBe('true');
    });

    // Session restore fails (expired token), refresh fails (invalid refresh token)
    // The onUnauthorized handler should clear storage
    // Note: the handler runs async, so we wait a bit
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('false');
    }, { timeout: 5000 });
  });
});

/* ── Logout Tests ─────────────────────────────────────────── */

describe('Authentication - Logout', () => {
  it('logs out and clears all storage', async () => {
    const user = userEvent.setup();

    function LogoutStub() {
      const { login, logout } = useAuth();
      const [ready, setReady] = React.useState(false);

      React.useEffect(() => {
        login('admin@cricketos.com', 'password123').then(() => setReady(true));
      }, [login]);

      return (
        <button onClick={logout} disabled={!ready}>Logout</button>
      );
    }

    render(
      <TestAuthProvider>
        <LogoutStub />
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    await user.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
    });
  });
});

/* ── Protected Route Tests ────────────────────────────────── */

describe('ProtectedRoute', () => {
  it('redirects to login when not authenticated', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppProvider>
          <AuthProvider>
            <Routes>
              <Route path="/dashboard" element={
                <ProtectedRoute><div>Protected Content</div></ProtectedRoute>
              } />
              <Route path="/auth/login" element={<div>Login Page</div>} />
            </Routes>
          </AuthProvider>
        </AppProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeDefined();
    });
  });

  it('renders children when authenticated', async () => {
    // Pre-populate storage so session restoration works
    setStoredTokens(createValidToken(), 'valid_refresh_token');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify([]));

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppProvider>
          <AuthProvider>
            <Routes>
              <Route path="/dashboard" element={
                <ProtectedRoute><div>Protected Content</div></ProtectedRoute>
              } />
              <Route path="/auth/login" element={<div>Login Page</div>} />
            </Routes>
          </AuthProvider>
        </AppProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeDefined();
    });
  });
});

/* ── Guest Route Tests ────────────────────────────────────── */

describe('GuestRoute', () => {
  it('renders children when not authenticated', async () => {
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <AppProvider>
          <AuthProvider>
            <Routes>
              <Route path="/auth/login" element={
                <GuestRoute><div>Guest Content</div></GuestRoute>
              } />
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </AuthProvider>
        </AppProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Guest Content')).toBeDefined();
    });
  });
});

/* ── Session Restoration Tests ────────────────────────────── */

describe('Session Restoration', () => {
  it('restores session from storage on mount', async () => {
    setStoredTokens(createValidToken(), 'valid_refresh_token');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify([]));

    render(
      <TestAuthProvider>
        <AuthStatus />
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('initialized').textContent).toBe('true');
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
      expect(useAuthStore.getState().user?.email).toBe('admin@cricketos.com');
    });
  });
});

/* ── Organization Switching Tests ─────────────────────────── */

describe('Organization Switching', () => {
  it('switches organization and updates current org', async () => {
    const user = userEvent.setup();

    // Pre-populate storage with memberships for multiple orgs
    const memberships = [
      {
        id: 'mem_001', userId: 'usr_001', organizationId: 'org_001',
        organization: { id: 'org_001', name: 'Cricket Australia', slug: 'cricket-australia', type: 'national_board', createdAt: '', updatedAt: '' },
        role: 'admin', permissions: [], status: 'active', joinedAt: '',
      },
      {
        id: 'mem_002', userId: 'usr_001', organizationId: 'org_002',
        organization: { id: 'org_002', name: 'Mumbai Cricket Association', slug: 'mumbai-ca', type: 'state_association', createdAt: '', updatedAt: '' },
        role: 'coach', permissions: [], status: 'active', joinedAt: '',
      },
    ];

    setStoredTokens(createValidToken(), 'valid_refresh_token');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));

    render(
      <TestAuthProvider>
        <OrgSwitcherStub />
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-org').textContent).not.toBe('none');
    });

    expect(screen.getByTestId('current-org').textContent).toBe('Cricket Australia');

    await user.click(screen.getByRole('button', { name: /Switch to Mumbai/ }));

    await waitFor(() => {
      expect(screen.getByTestId('current-org').textContent).toBe('Mumbai Cricket Association');
    });
  });
});
