/**
 * Organization module tests.
 * Tests for: switching, context, permissions, tenant isolation.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import React from 'react';

import { AppProvider } from '../providers/AppProvider';
import { AuthProvider, useAuth } from '../providers/AuthProvider';
import { useAuthStore } from '../stores/authStore';
import { useOrganizationStore } from '../stores/organizationStore';
import { setStoredTokens, STORAGE_KEYS } from '../core/storage';

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

const memberships = [
  {
    id: 'mem_001', userId: 'usr_001', organizationId: 'org_001',
    organization: { id: 'org_001', name: 'Cricket Australia', slug: 'cricket-australia', type: 'national_board' as const, memberCount: 120, teamCount: 18, competitionCount: 5, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    role: 'admin' as const, permissions: [], status: 'active' as const, joinedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mem_002', userId: 'usr_001', organizationId: 'org_002',
    organization: { id: 'org_002', name: 'Mumbai Cricket Association', slug: 'mumbai-ca', type: 'state_association' as const, memberCount: 85, teamCount: 12, competitionCount: 3, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    role: 'coach' as const, permissions: [], status: 'active' as const, joinedAt: '2024-06-01T00:00:00Z',
  },
];

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

function OrgSwitcherStub() {
  const { switchOrganization } = useAuth();
  const orgs = useOrganizationStore((s) => s.organizations);
  const current = useOrganizationStore((s) => s.currentOrganization);

  return (
    <div>
      <span data-testid="current-org">{current?.name ?? 'none'}</span>
      <span data-testid="current-org-id">{current?.id ?? 'none'}</span>
      <span data-testid="org-count">{String(orgs.length)}</span>
      {orgs.map((org) => (
        <button key={org.id} onClick={() => switchOrganization(org.id)}>
          Switch to {org.name}
        </button>
      ))}
    </div>
  );
}

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

/* ── Organization switching ──────────────────────────────── */

describe('Organization switching', () => {
  it('switches between organizations successfully', async () => {
    const user = userEvent.setup();

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

    expect(screen.getByTestId('current-org-id').textContent).toBe('org_001');

    await user.click(screen.getByRole('button', { name: /Switch to Mumbai/ }));

    await waitFor(() => {
      expect(screen.getByTestId('current-org-id').textContent).toBe('org_002');
    });

    expect(screen.getByTestId('current-org').textContent).toBe('Mumbai Cricket Association');
  });

  it('returns without changing when switching to invalid org', async () => {
    setStoredTokens(createValidToken(), 'valid_refresh_token');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));

    render(
      <TestAuthProvider>
        <OrgSwitcherStub />
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-org-id').textContent).toBe('org_001');
    });

    const invalidMembership = useOrganizationStore.getState().switchOrganization('org_invalid');
    expect(invalidMembership).toBeNull();
    expect(useOrganizationStore.getState().currentOrganization?.id).toBe('org_001');
  });
});

/* ── Organization context ────────────────────────────────── */

describe('Organization context', () => {
  it('initializes organization from memberships', async () => {
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

    expect(screen.getByTestId('org-count').textContent).toBe('2');
    expect(useOrganizationStore.getState().currentOrganization?.id).toBe('org_001');
    expect(useOrganizationStore.getState().memberships).toHaveLength(2);
  });

  it('restores organization from storage', async () => {
    localStorage.setItem('cricketos_current_org', 'org_002');
    setStoredTokens(createValidToken(), 'valid_refresh_token');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));

    render(
      <TestAuthProvider>
        <OrgSwitcherStub />
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-org-id').textContent).toBe('org_002');
    });
  });
});

/* ── Tenant isolation ────────────────────────────────────── */

describe('Tenant isolation', () => {
  it('organization store clears on logout', async () => {
    setStoredTokens(createValidToken(), 'valid_refresh_token');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));

    render(
      <TestAuthProvider>
        <OrgSwitcherStub />
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(useOrganizationStore.getState().currentOrganization).not.toBeNull();
    });

    expect(useOrganizationStore.getState().organizations.length).toBeGreaterThan(0);

    useOrganizationStore.getState().clear();

    expect(useOrganizationStore.getState().currentOrganization).toBeNull();
    expect(useOrganizationStore.getState().organizations).toHaveLength(0);
    expect(useOrganizationStore.getState().memberships).toHaveLength(0);
  });

  it('only active memberships are available for org switching', async () => {
    setStoredTokens(createValidToken(), 'valid_refresh_token');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));

    render(
      <TestAuthProvider>
        <OrgSwitcherStub />
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('org-count').textContent).toBe('2');
    });

    useOrganizationStore.getState().memberships.forEach((m) => {
      expect(m.status).toBe('active');
    });
  });
});

/* ── Permission changes on org switch ────────────────────── */

describe('Permission changes on org switch', () => {
  it('role changes when switching organizations', async () => {
    setStoredTokens(createValidToken(), 'valid_refresh_token');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));

    render(
      <TestAuthProvider>
        <OrgSwitcherStub />
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(useOrganizationStore.getState().currentOrganization?.id).toBe('org_001');
    });

    // Initially admin in org_001
    let membership = useOrganizationStore.getState().memberships.find(
      (m) => m.organizationId === 'org_001'
    );
    expect(membership?.role).toBe('admin');

    // Switch to org_002 where user is a coach
    useOrganizationStore.getState().switchOrganization('org_002');

    membership = useOrganizationStore.getState().memberships.find(
      (m) => m.organizationId === 'org_002'
    );
    expect(membership?.role).toBe('coach');
    expect(useOrganizationStore.getState().currentOrganization?.id).toBe('org_002');
  });
});

/* ── Organization data fetching ──────────────────────────── */

describe('Organization data fetching', () => {
  it('fetches members for the current organization', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);

    const { organizationRepository } = await import('@api/repositories/organization');
    const members = await organizationRepository.getMembers('org_001');

    expect(members.data).toHaveLength(4);
    expect(members.total).toBe(4);
    members.data.forEach((m) => {
      expect(m.organizationId).toBe('org_001');
    });
  });

  it('fetches roles for the current organization', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);

    const { organizationRepository } = await import('@api/repositories/organization');
    const roles = await organizationRepository.getRoles('org_001');

    expect(roles.length).toBeGreaterThan(0);
    roles.forEach((r) => {
      expect(r.organizationId).toBe('org_001');
    });
  });

  it('fetches departments for the current organization', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);

    const { organizationRepository } = await import('@api/repositories/organization');
    const departments = await organizationRepository.getDepartments('org_001');

    expect(departments).toHaveLength(3);
  });

  it('fetches organization stats', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);

    const { organizationRepository } = await import('@api/repositories/organization');
    const stats = await organizationRepository.getStats('org_001');

    expect(stats.memberCount).toBe(120);
    expect(stats.teamCount).toBe(18);
    expect(stats.competitionCount).toBe(8);
  });
});

/* ── Organization list and search ────────────────────────── */

describe('Organization list and search', () => {
  it('fetches organizations with pagination', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);

    const { organizationRepository } = await import('@api/repositories/organization');
    const result = await organizationRepository.list({ page: 1, limit: 10 });

    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  it('searches organizations by name', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);

    const { organizationRepository } = await import('@api/repositories/organization');
    const result = await organizationRepository.list({ search: 'Cricket Australia' });

    expect(result.data.length).toBe(1);
    expect(result.data[0].name).toBe('Cricket Australia');
  });

  it('filters organizations by type', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);

    const { organizationRepository } = await import('@api/repositories/organization');
    const result = await organizationRepository.list({ type: 'academy' });

    expect(result.data.length).toBe(1);
    expect(result.data[0].type).toBe('academy');
  });
});
