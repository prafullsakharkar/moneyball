/**
 * Players data workspace tests.
 * Covers the player repository contract (list/search/filter/CRUD/bulk) and
 * the PlayersPage integration (table render, search, selection, drawer, form).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import React from 'react';

import { AppProvider } from '../providers/AppProvider';
import { AuthProvider } from '../providers/AuthProvider';
import { useAuthStore } from '../stores/authStore';
import { useOrganizationStore } from '../stores/organizationStore';
import { setStoredTokens, STORAGE_KEYS } from '../core/storage';
import PlayersPage from '../pages/players/PlayersPage';

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
    role: 'admin' as const,
    permissions: [
      { id: 'perm_001', resource: 'player', action: 'manage' as const },
      { id: 'perm_002', resource: 'team', action: 'manage' as const },
      { id: 'perm_003', resource: 'competition', action: 'manage' as const },
      { id: 'perm_004', resource: 'organization', action: 'manage' as const },
      { id: 'perm_005', resource: 'media', action: 'manage' as const },
    ],
    status: 'active' as const, joinedAt: '2024-01-01T00:00:00Z',
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

function seedAuth() {
  setStoredTokens(createValidToken(), 'valid_refresh_token');
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
  localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));
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

/* ── Repository contract ─────────────────────────────────── */

describe('Player repository', () => {
  it('lists players with pagination', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);
    const { playerRepository } = await import('@api/repositories/player');
    const result = await playerRepository.list({ page: 1, limit: 10 });
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
    expect(result.data[0]).toHaveProperty('id');
  });

  it('searches players by name', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);
    const { playerRepository } = await import('@api/repositories/player');
    const result = await playerRepository.list({ search: 'Kohli' });
    expect(result.data.length).toBe(1);
    expect(result.data[0].displayName).toBe('V. Kohli');
  });

  it('filters players by role', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);
    const { playerRepository } = await import('@api/repositories/player');
    const result = await playerRepository.list({ role: 'bowler' });
    expect(result.data.length).toBeGreaterThan(0);
    result.data.forEach((p) => expect(p.role).toBe('bowler'));
  });

  it('filters players by status', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);
    const { playerRepository } = await import('@api/repositories/player');
    const result = await playerRepository.list({ status: 'retired' });
    expect(result.data.length).toBeGreaterThan(0);
    result.data.forEach((p) => expect(p.status).toBe('retired'));
  });

  it('fetches a single player', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);
    const { playerRepository } = await import('@api/repositories/player');
    const player = await playerRepository.get('ply_001');
    expect(player.id).toBe('ply_001');
    expect(player.displayName).toBe('V. Kohli');
  });

  it('creates a player', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);
    const { playerRepository } = await import('@api/repositories/player');
    const created = await playerRepository.create({
      firstName: 'Steve', lastName: 'Smith', role: 'batsman',
      battingStyle: 'right_hand', bowlingStyle: 'right_arm_off_break',
    });
    expect(created.firstName).toBe('Steve');
    expect(created.displayName).toBe('S. Smith');
  });

  it('updates a player', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);
    const { playerRepository } = await import('@api/repositories/player');
    const updated = await playerRepository.update('ply_001', { status: 'injured' });
    expect(updated.status).toBe('injured');
  });

  it('deletes a player', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);
    const { playerRepository } = await import('@api/repositories/player');
    await playerRepository.delete('ply_006');
    const result = await playerRepository.list({ search: 'Rahul' });
    expect(result.data.length).toBe(0);
  });

  it('bulk updates players', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);
    const { playerRepository } = await import('@api/repositories/player');
    const updated = await playerRepository.bulkUpdate({
      ids: ['ply_001', 'ply_002'], data: { status: 'suspended' },
    });
    expect(updated.length).toBe(2);
    updated.forEach((p) => expect(p.status).toBe('suspended'));
  });

  it('bulk deletes players', async () => {
    render(<TestAuthProvider><div /></TestAuthProvider>);
    const { playerRepository } = await import('@api/repositories/player');
    await playerRepository.bulkDelete(['ply_003', 'ply_004']);
    const result = await playerRepository.list({ page: 1, limit: 100 });
    const ids = result.data.map((p) => p.id);
    expect(ids).not.toContain('ply_003');
    expect(ids).not.toContain('ply_004');
  });
});

/* ── PlayersPage integration ─────────────────────────────── */

describe('PlayersPage', () => {
  it('renders the players table with data', async () => {
    seedAuth();
    render(
      <TestAuthProvider>
        <PlayersPage />
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('V. Kohli')).toBeInTheDocument();
    });
    expect(screen.getByText('J. Bumrah')).toBeInTheDocument();
    expect(screen.getByText('Players')).toBeInTheDocument();
  });

  it('searches players by name', async () => {
    const user = userEvent.setup();
    seedAuth();
    render(
      <TestAuthProvider>
        <PlayersPage />
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('V. Kohli')).toBeInTheDocument();
    });

    const searchInput = screen.getAllByPlaceholderText('Search players...')[0];
    await user.type(searchInput, 'Bumrah');

    await waitFor(() => {
      expect(screen.getByText('J. Bumrah')).toBeInTheDocument();
    });
    expect(screen.queryByText('V. Kohli')).not.toBeInTheDocument();
  });

  it('opens the detail drawer on row click', async () => {
    const user = userEvent.setup();
    seedAuth();
    render(
      <TestAuthProvider>
        <PlayersPage />
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('V. Kohli')).toBeInTheDocument();
    });

    await user.click(screen.getByText('V. Kohli'));

    // The drawer footer's Edit button is unique to the open detail drawer.
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });
    // Runs appear in both the table column and the drawer detail field.
    expect(screen.getAllByText('12,898').length).toBeGreaterThan(0);
  });

  it('selects rows and shows the bulk action bar', async () => {
    const user = userEvent.setup();
    seedAuth();
    render(
      <TestAuthProvider>
        <PlayersPage />
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('V. Kohli')).toBeInTheDocument();
    });

    const table = screen.getByRole('table', { name: 'Players table' });
    const checkboxes = within(table).getAllByRole('checkbox');
    // First checkbox is the "select all" header checkbox.
    await user.click(checkboxes[1]);

    await waitFor(() => {
      expect(screen.getByText(/1 player selected/)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Delete/ })).toBeInTheDocument();
  });

  it('opens the create form dialog', async () => {
    const user = userEvent.setup();
    seedAuth();
    render(
      <TestAuthProvider>
        <PlayersPage />
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('V. Kohli')).toBeInTheDocument();
    });

    await user.click(screen.getAllByRole('button', { name: /New Player/ })[0]);

    await waitFor(() => {
      expect(screen.getByText('New player')).toBeInTheDocument();
    });
    expect(screen.getByText('First name')).toBeInTheDocument();
    expect(screen.getByText('Last name')).toBeInTheDocument();
  });

  it('creates a new player via the form', async () => {
    const user = userEvent.setup();
    seedAuth();
    render(
      <TestAuthProvider>
        <PlayersPage />
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('V. Kohli')).toBeInTheDocument();
    });

    await user.click(screen.getAllByRole('button', { name: /New Player/ })[0]);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Virat')).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('Virat'), 'Steve');
    await user.type(screen.getByPlaceholderText('Kohli'), 'Smith');
    await user.click(screen.getByRole('button', { name: /Create player/ }));

    await waitFor(() => {
      expect(screen.getByText('S. Smith')).toBeInTheDocument();
    });
  });
});
