/**
 * MSW handlers for all API endpoints.
 * Auth + Organization handlers for development and testing.
 */
import { http, HttpResponse } from 'msw';
import type {
  User,
  Membership,
  AuthTokens,
  Organization,
  OrganizationMember,
  OrganizationRole,
  Department,
  OrganizationTeam,
  OrganizationCompetition,
  Facility,
  OrganizationStats,
  Player,
  CreatePlayerRequest,
  UpdatePlayerRequest,
  AiConversationMessage,
} from '@domain/index';
import {
  mockTeams as cricketMockTeams,
  mockMatches,
  mockTournaments,
  mockAnalyticsQuestions,
  mockAnalyticsInsights,
  mockAiInsights,
  mockAiConversation,
  mockMediaAssets,
  mockVideoAssets,
} from './cricketData';

/* ── Mock Data ─────────────────────────────────────────── */

const mockUser: User = {
  id: 'usr_001',
  email: 'admin@cricketos.com',
  firstName: 'John',
  lastName: 'Smith',
  avatarUrl: undefined,
  emailVerified: true,
  mfaEnabled: false,
  lastLoginAt: new Date().toISOString(),
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockOrg1: Organization = {
  id: 'org_001',
  name: 'Cricket Australia',
  slug: 'cricket-australia',
  logoUrl: undefined,
  type: 'national_board',
  memberCount: 120,
  teamCount: 18,
  competitionCount: 8,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockOrg2: Organization = {
  id: 'org_002',
  name: 'Mumbai Cricket Association',
  slug: 'mumbai-ca',
  logoUrl: undefined,
  type: 'state_association',
  memberCount: 85,
  teamCount: 12,
  competitionCount: 5,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockOrg3: Organization = {
  id: 'org_003',
  name: 'Sydney Thunder Academy',
  slug: 'sydney-thunder-academy',
  logoUrl: undefined,
  type: 'academy',
  memberCount: 45,
  teamCount: 4,
  competitionCount: 2,
  isActive: true,
  createdAt: '2024-03-01T00:00:00Z',
  updatedAt: '2024-03-01T00:00:00Z',
};

const allMockOrgs = [mockOrg1, mockOrg2, mockOrg3];

const mockMembership: Membership = {
  id: 'mem_001',
  userId: 'usr_001',
  organizationId: 'org_001',
  organization: mockOrg1,
  role: 'admin',
  permissions: [
    { id: 'perm_001', resource: 'player', action: 'manage' },
    { id: 'perm_002', resource: 'team', action: 'manage' },
    { id: 'perm_003', resource: 'competition', action: 'manage' },
    { id: 'perm_004', resource: 'match', action: 'manage' },
    { id: 'perm_005', resource: 'training', action: 'manage' },
    { id: 'perm_006', resource: 'facility', action: 'manage' },
    { id: 'perm_007', resource: 'media', action: 'manage' },
    { id: 'perm_008', resource: 'analytics', action: 'manage' },
    { id: 'perm_009', resource: 'insights', action: 'manage' },
    { id: 'perm_010', resource: 'organization', action: 'manage' },
    { id: 'perm_011', resource: 'settings', action: 'manage' },
  ],
  status: 'active',
  joinedAt: '2024-01-01T00:00:00Z',
};

const mockMembership2: Membership = {
  id: 'mem_002',
  userId: 'usr_001',
  organizationId: 'org_002',
  organization: mockOrg2,
  role: 'coach',
  permissions: [{ id: 'perm_003', resource: 'player', action: 'read' }],
  status: 'active',
  joinedAt: '2024-06-01T00:00:00Z',
};

function generateTokens(): AuthTokens {
  return {
    accessToken: 'mock_access_token_' + Date.now(),
    refreshToken: 'mock_refresh_token_' + Date.now(),
    expiresIn: 3600,
    tokenType: 'Bearer',
  };
}

const mockMembers: OrganizationMember[] = [
  {
    id: 'mbr_001',
    userId: 'usr_001',
    user: mockUser,
    organizationId: 'org_001',
    role: 'admin',
    permissions: [{ id: 'perm_001', resource: 'players', action: 'manage' }],
    status: 'active',
    joinedAt: '2024-01-01T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: 'mbr_002',
    userId: 'usr_002',
    user: { ...mockUser, id: 'usr_002', firstName: 'Sarah', lastName: 'Jones', email: 'sarah@cricketos.com' },
    organizationId: 'org_001',
    role: 'coach',
    permissions: [{ id: 'perm_004', resource: 'players', action: 'read' }],
    status: 'active',
    joinedAt: '2024-02-15T00:00:00Z',
    lastActiveAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'mbr_003',
    userId: 'usr_003',
    user: { ...mockUser, id: 'usr_003', firstName: 'David', lastName: 'Wilson', email: 'david@cricketos.com' },
    organizationId: 'org_001',
    role: 'player',
    permissions: [],
    status: 'active',
    joinedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 'mbr_004',
    userId: 'usr_004',
    user: { ...mockUser, id: 'usr_004', firstName: 'Emma', lastName: 'Brown', email: 'emma@cricketos.com' },
    organizationId: 'org_001',
    role: 'viewer',
    permissions: [],
    status: 'invited',
    joinedAt: '2024-12-01T00:00:00Z',
  },
];

const mockRoles: OrganizationRole[] = [
  {
    id: 'role_001',
    name: 'Owner',
    description: 'Full platform access',
    organizationId: 'org_001',
    permissions: [{ id: 'perm_all', resource: '*', action: 'manage' }],
    memberCount: 1,
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role_002',
    name: 'Admin',
    description: 'Administrative access',
    organizationId: 'org_001',
    permissions: [
      { id: 'perm_001', resource: 'players', action: 'manage' },
      { id: 'perm_002', resource: 'teams', action: 'manage' },
    ],
    memberCount: 3,
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role_003',
    name: 'Coach',
    description: 'Team and player management',
    organizationId: 'org_001',
    permissions: [{ id: 'perm_004', resource: 'players', action: 'read' }],
    memberCount: 12,
    isSystem: false,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'role_004',
    name: 'Player',
    description: 'View own data',
    organizationId: 'org_001',
    permissions: [],
    memberCount: 85,
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role_005',
    name: 'Viewer',
    description: 'Read-only access',
    organizationId: 'org_001',
    permissions: [],
    memberCount: 19,
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockDepartments: Department[] = [
  { id: 'dept_001', name: 'Coaching', description: 'Head coaching staff', organizationId: 'org_001', memberCount: 15, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'dept_002', name: 'Administration', description: 'Org admin team', organizationId: 'org_001', memberCount: 8, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'dept_003', name: 'Analytics', description: 'Data and performance', organizationId: 'org_001', memberCount: 6, createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-02-01T00:00:00Z' },
];

const mockTeams: OrganizationTeam[] = [
  { id: 'team_001', name: 'Australia Men', shortName: 'AUS', organizationId: 'org_001', sport: 'cricket', gender: 'male', level: 'professional', playerCount: 16, coachCount: 4, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'team_002', name: 'Australia Women', shortName: 'AUS-W', organizationId: 'org_001', sport: 'cricket', gender: 'female', level: 'professional', playerCount: 15, coachCount: 3, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'team_003', name: 'Australia U19', shortName: 'AUS-U19', organizationId: 'org_001', sport: 'cricket', gender: 'male', level: 'youth', playerCount: 16, coachCount: 2, isActive: true, createdAt: '2024-06-01T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
];

const mockCompetitions: OrganizationCompetition[] = [
  { id: 'comp_001', name: 'Sheffield Shield 2024', organizationId: 'org_001', type: 'tournament', status: 'completed', teamCount: 6, matchCount: 31, startDate: '2024-10-01T00:00:00Z', endDate: '2025-03-01T00:00:00Z' },
  { id: 'comp_002', name: 'Big Bash League 2024', organizationId: 'org_001', type: 'tournament', status: 'active', teamCount: 8, matchCount: 42, startDate: '2024-12-15T00:00:00Z', endDate: '2025-02-15T00:00:00Z' },
  { id: 'comp_003', name: 'One Day Cup 2025', organizationId: 'org_001', type: 'tournament', status: 'upcoming', teamCount: 6, matchCount: 0, startDate: '2025-04-01T00:00:00Z' },
];

const mockFacilities: Facility[] = [
  { id: 'fac_001', name: 'Melbourne Cricket Ground', organizationId: 'org_001', type: 'ground', capacity: 100000, hasFloodlights: true, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'fac_002', name: 'Sydney Cricket Ground', organizationId: 'org_001', type: 'ground', capacity: 48000, hasFloodlights: true, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

const mockStats: OrganizationStats = {
  memberCount: 120,
  teamCount: 18,
  playerCount: 85,
  coachCount: 12,
  competitionCount: 8,
  matchCount: 42,
  facilityCount: 2,
};

/* ── Players ───────────────────────────────────────────── */

const mockPlayers: Player[] = [
  {
    id: 'ply_001',
    organizationId: 'org_001',
    firstName: 'Virat',
    lastName: 'Kohli',
    displayName: 'V. Kohli',
    email: 'virat@cricketos.com',
    dateOfBirth: '1988-11-05',
    nationality: 'India',
    role: 'batsman',
    battingStyle: 'right_hand',
    bowlingStyle: 'right_arm_medium',
    status: 'active',
    availability: 'available',
    teamId: 'team_001',
    teamName: 'Australia Men',
    jerseyNumber: 18,
    price: 1500000,
    ranking: 2,
    stats: {
      matches: 280, innings: 270, runs: 12898, ballsFaced: 13900, notOuts: 40,
      highestScore: 183, hundreds: 46, fifties: 65,
      ballsBowled: 640, wickets: 4, runsConceded: 680, bestBowling: '1/15', fiveWicketHauls: 0,
      catches: 140, stumpings: 0,
    },
    tags: ['captain', 'batsman'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ply_002',
    organizationId: 'org_001',
    firstName: 'Jasprit',
    lastName: 'Bumrah',
    displayName: 'J. Bumrah',
    email: 'bumrah@cricketos.com',
    dateOfBirth: '1993-12-06',
    nationality: 'India',
    role: 'bowler',
    battingStyle: 'right_hand',
    bowlingStyle: 'right_arm_fast',
    status: 'active',
    availability: 'available',
    teamId: 'team_001',
    teamName: 'Australia Men',
    jerseyNumber: 93,
    price: 1200000,
    ranking: 1,
    stats: {
      matches: 89, innings: 40, runs: 120, ballsFaced: 180, notOuts: 20,
      highestScore: 16, hundreds: 0, fifties: 0,
      ballsBowled: 4800, wickets: 149, runsConceded: 3800, bestBowling: '6/19', fiveWicketHauls: 3,
      catches: 18, stumpings: 0,
    },
    tags: ['bowler', 'death'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ply_003',
    organizationId: 'org_001',
    firstName: 'Ravindra',
    lastName: 'Jadeja',
    displayName: 'R. Jadeja',
    email: 'jadeja@cricketos.com',
    dateOfBirth: '1988-12-06',
    nationality: 'India',
    role: 'all_rounder',
    battingStyle: 'left_hand',
    bowlingStyle: 'left_arm_orthodox',
    status: 'active',
    availability: 'available',
    teamId: 'team_001',
    teamName: 'Australia Men',
    jerseyNumber: 8,
    price: 900000,
    ranking: 4,
    stats: {
      matches: 197, innings: 160, runs: 2756, ballsFaced: 3200, notOuts: 40,
      highestScore: 77, hundreds: 0, fifties: 13,
      ballsBowled: 9800, wickets: 220, runsConceded: 7200, bestBowling: '5/36', fiveWicketHauls: 2,
      catches: 100, stumpings: 0,
    },
    tags: ['all-rounder', 'fielder'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ply_004',
    organizationId: 'org_001',
    firstName: 'MS',
    lastName: 'Dhoni',
    displayName: 'MS Dhoni',
    email: 'dhoni@cricketos.com',
    dateOfBirth: '1981-07-07',
    nationality: 'India',
    role: 'wicket_keeper',
    battingStyle: 'right_hand',
    bowlingStyle: 'none',
    status: 'retired',
    availability: 'unavailable',
    teamId: 'team_001',
    teamName: 'Australia Men',
    jerseyNumber: 7,
    price: 0,
    ranking: 0,
    stats: {
      matches: 350, innings: 297, runs: 10773, ballsFaced: 12300, notOuts: 84,
      highestScore: 183, hundreds: 10, fifties: 73,
      ballsBowled: 36, wickets: 1, runsConceded: 40, bestBowling: '1/14', fiveWicketHauls: 0,
      catches: 321, stumpings: 123,
    },
    tags: ['keeper', 'captain'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ply_005',
    organizationId: 'org_001',
    firstName: 'Rohit',
    lastName: 'Sharma',
    displayName: 'R. Sharma',
    email: 'rohit@cricketos.com',
    dateOfBirth: '1987-04-30',
    nationality: 'India',
    role: 'batsman',
    battingStyle: 'right_hand',
    bowlingStyle: 'right_arm_off_break',
    status: 'active',
    availability: 'probable',
    teamId: 'team_001',
    teamName: 'Australia Men',
    jerseyNumber: 45,
    price: 1100000,
    ranking: 3,
    stats: {
      matches: 262, innings: 254, runs: 10709, ballsFaced: 11800, notOuts: 36,
      highestScore: 264, hundreds: 31, fifties: 55,
      ballsBowled: 600, wickets: 8, runsConceded: 700, bestBowling: '2/27', fiveWicketHauls: 0,
      catches: 120, stumpings: 0,
    },
    tags: ['captain', 'opener'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ply_006',
    organizationId: 'org_001',
    firstName: 'KL',
    lastName: 'Rahul',
    displayName: 'KL Rahul',
    email: 'rahul@cricketos.com',
    dateOfBirth: '1992-04-18',
    nationality: 'India',
    role: 'wicket_keeper',
    battingStyle: 'right_hand',
    bowlingStyle: 'none',
    status: 'injured',
    availability: 'unavailable',
    teamId: 'team_001',
    teamName: 'Australia Men',
    jerseyNumber: 1,
    price: 700000,
    ranking: 8,
    stats: {
      matches: 54, innings: 50, runs: 2205, ballsFaced: 2500, notOuts: 8,
      highestScore: 112, hundreds: 6, fifties: 12,
      ballsBowled: 0, wickets: 0, runsConceded: 0, bestBowling: undefined, fiveWicketHauls: 0,
      catches: 40, stumpings: 5,
    },
    tags: ['keeper', 'opener'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

let mockPlayersState = [...mockPlayers];

/* ── Handlers ──────────────────────────────────────────── */

const API = 'http://localhost:3000/api/v1';

export const handlers = [
  // ── Auth ────────────────────────────────────────────────
  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' } },
        { status: 400 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: {
        user: mockUser,
        tokens: generateTokens(),
        memberships: [mockMembership, mockMembership2],
      },
    });
  }),

  http.post(`${API}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    return HttpResponse.json({
      success: true,
      data: {
        user: { ...mockUser, firstName: body.firstName, lastName: body.lastName, email: body.email },
        tokens: generateTokens(),
        membership: mockMembership,
      },
    });
  }),

  http.post(`${API}/auth/refresh`, () => {
    return HttpResponse.json({ success: true, data: { tokens: generateTokens() } });
  }),

  http.post(`${API}/auth/logout`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.get(`${API}/auth/me`, () => {
    return HttpResponse.json({ success: true, data: { user: mockUser } });
  }),

  http.get(`${API}/auth/sessions`, () => {
    return HttpResponse.json({ success: true, data: { sessions: [], currentSessionId: 'sess_001' } });
  }),

  http.post(`${API}/auth/switch-organization`, async ({ request }) => {
    const body = (await request.json()) as { organizationId: string };
    const memberships = [mockMembership, mockMembership2];
    const membership = memberships.find((m) => m.organizationId === body.organizationId);
    return HttpResponse.json({
      success: true,
      data: { tokens: generateTokens(), membership: membership ?? mockMembership },
    });
  }),

  http.post(`${API}/auth/forgot-password`, () => {
    return HttpResponse.json({ success: true, data: { message: 'Reset email sent' } });
  }),

  http.post(`${API}/auth/reset-password`, () => {
    return HttpResponse.json({ success: true, data: { message: 'Password reset successfully' } });
  }),

  http.post(`${API}/auth/verify-email`, () => {
    return HttpResponse.json({ success: true, data: { message: 'Email verified' } });
  }),

  http.post(`${API}/auth/resend-verification`, () => {
    return HttpResponse.json({ success: true, data: { message: 'Verification email sent' } });
  }),

  // ── Organizations ───────────────────────────────────────

  http.get(`${API}/organizations`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    const type = url.searchParams.get('type');
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const limit = parseInt(url.searchParams.get('limit') ?? '10', 10);

    let filtered = [...allMockOrgs];
    if (search) filtered = filtered.filter((o) => o.name.toLowerCase().includes(search));
    if (type) filtered = filtered.filter((o) => o.type === type);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      data: { data: paginated, total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) },
    });
  }),

  http.get(`${API}/organizations/:orgId`, ({ params }) => {
    const org = allMockOrgs.find((o) => o.id === params.orgId);
    if (!org) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Organization not found' } }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: org });
  }),

  http.post(`${API}/organizations`, async ({ request }) => {
    const body = (await request.json()) as { name: string; slug: string; type: string };
    const newOrg: Organization = {
      id: 'org_' + Date.now(),
      name: body.name,
      slug: body.slug,
      type: body.type as Organization['type'],
      memberCount: 0,
      teamCount: 0,
      competitionCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    allMockOrgs.push(newOrg);
    return HttpResponse.json({ success: true, data: newOrg });
  }),

  http.patch(`${API}/organizations/:orgId`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<Organization>;
    const idx = allMockOrgs.findIndex((o) => o.id === params.orgId);
    if (idx === -1) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Organization not found' } }, { status: 404 });
    }
    allMockOrgs[idx] = { ...allMockOrgs[idx], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: allMockOrgs[idx] });
  }),

  http.get(`${API}/organizations/:orgId/stats`, () => {
    return HttpResponse.json({ success: true, data: mockStats });
  }),

  // ── Members ─────────────────────────────────────────────

  http.get(`${API}/organizations/:orgId/members`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    const role = url.searchParams.get('role');
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const limit = parseInt(url.searchParams.get('limit') ?? '10', 10);

    let filtered = [...mockMembers];
    if (search) filtered = filtered.filter((m) =>
      m.user.firstName.toLowerCase().includes(search) ||
      m.user.lastName.toLowerCase().includes(search) ||
      m.user.email.toLowerCase().includes(search)
    );
    if (role) filtered = filtered.filter((m) => m.role === role);
    if (status) filtered = filtered.filter((m) => m.status === status);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      data: { data: paginated, total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) },
    });
  }),

  http.get(`${API}/organizations/:orgId/members/:memberId`, ({ params }) => {
    const member = mockMembers.find((m) => m.id === params.memberId);
    if (!member) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Member not found' } }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: member });
  }),

  http.post(`${API}/organizations/:orgId/members`, async ({ request }) => {
    const body = (await request.json()) as { email: string; role: string };
    const newMember: OrganizationMember = {
      id: 'mbr_' + Date.now(),
      userId: 'usr_' + Date.now(),
      user: { ...mockUser, id: 'usr_' + Date.now(), email: body.email, firstName: 'New', lastName: 'Member' },
      organizationId: 'org_001',
      role: body.role as OrganizationMember['role'],
      permissions: [],
      status: 'invited',
      joinedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, data: newMember });
  }),

  http.patch(`${API}/organizations/:orgId/members/:memberId`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<OrganizationMember>;
    const member = mockMembers.find((m) => m.id === params.memberId);
    if (!member) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Member not found' } }, { status: 404 });
    }
    const updated = { ...member, ...body };
    return HttpResponse.json({ success: true, data: updated });
  }),

  http.delete(`${API}/organizations/:orgId/members/:memberId`, () => {
    return HttpResponse.json({ success: true });
  }),

  // ── Roles ───────────────────────────────────────────────

  http.get(`${API}/organizations/:orgId/roles`, () => {
    return HttpResponse.json({ success: true, data: mockRoles });
  }),

  http.get(`${API}/organizations/:orgId/roles/:roleId`, ({ params }) => {
    const role = mockRoles.find((r) => r.id === params.roleId);
    if (!role) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Role not found' } }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: role });
  }),

  http.post(`${API}/organizations/:orgId/roles`, async ({ request }) => {
    const body = (await request.json()) as { name: string; description?: string; permissionIds: string[] };
    const newRole: OrganizationRole = {
      id: 'role_' + Date.now(),
      name: body.name,
      description: body.description,
      organizationId: 'org_001',
      permissions: body.permissionIds.map((id) => ({ id, resource: '*', action: 'read' as const })),
      memberCount: 0,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, data: newRole });
  }),

  http.patch(`${API}/organizations/:orgId/roles/:roleId`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<OrganizationRole>;
    const role = mockRoles.find((r) => r.id === params.roleId);
    if (!role) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Role not found' } }, { status: 404 });
    }
    const updated = { ...role, ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: updated });
  }),

  http.delete(`${API}/organizations/:orgId/roles/:roleId`, () => {
    return HttpResponse.json({ success: true });
  }),

  // ── Departments ─────────────────────────────────────────

  http.get(`${API}/organizations/:orgId/departments`, () => {
    return HttpResponse.json({ success: true, data: mockDepartments });
  }),

  http.post(`${API}/organizations/:orgId/departments`, async ({ request }) => {
    const body = (await request.json()) as { name: string; description?: string };
    const newDept: Department = {
      id: 'dept_' + Date.now(),
      name: body.name,
      description: body.description,
      organizationId: 'org_001',
      memberCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, data: newDept });
  }),

  http.delete(`${API}/organizations/:orgId/departments/:deptId`, () => {
    return HttpResponse.json({ success: true });
  }),

  // ── Teams ───────────────────────────────────────────────

  http.get(`${API}/organizations/:orgId/teams`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    let filtered = [...mockTeams];
    if (search) filtered = filtered.filter((t) => t.name.toLowerCase().includes(search));
    return HttpResponse.json({
      success: true,
      data: { data: filtered, total: filtered.length, page: 1, limit: 10, totalPages: 1 },
    });
  }),

  // ── Competitions ────────────────────────────────────────

  http.get(`${API}/organizations/:orgId/competitions`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    let filtered = [...mockCompetitions];
    if (search) filtered = filtered.filter((c) => c.name.toLowerCase().includes(search));
    return HttpResponse.json({
      success: true,
      data: { data: filtered, total: filtered.length, page: 1, limit: 10, totalPages: 1 },
    });
  }),

  // ── Facilities ──────────────────────────────────────────

  http.get(`${API}/organizations/:orgId/facilities`, () => {
    return HttpResponse.json({ success: true, data: mockFacilities });
  }),

  // ── Players ─────────────────────────────────────────────

  http.get(`${API}/players`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    const role = url.searchParams.get('role');
    const status = url.searchParams.get('status');
    const teamId = url.searchParams.get('teamId');
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const limit = parseInt(url.searchParams.get('limit') ?? '10', 10);

    let filtered = [...mockPlayersState];
    if (search) {
      filtered = filtered.filter((p) =>
        p.firstName.toLowerCase().includes(search) ||
        p.lastName.toLowerCase().includes(search) ||
        p.displayName.toLowerCase().includes(search) ||
        p.nationality?.toLowerCase().includes(search)
      );
    }
    if (role) filtered = filtered.filter((p) => p.role === role);
    if (status) filtered = filtered.filter((p) => p.status === status);
    if (teamId) filtered = filtered.filter((p) => p.teamId === teamId);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      data: { data: paginated, total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) },
    });
  }),

  http.get(`${API}/players/:playerId`, ({ params }) => {
    const player = mockPlayersState.find((p) => p.id === params.playerId);
    if (!player) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Player not found' } }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: player });
  }),

  http.post(`${API}/players`, async ({ request }) => {
    const body = (await request.json()) as CreatePlayerRequest;
    const now = new Date().toISOString();
    const newPlayer: Player = {
      id: 'ply_' + Date.now(),
      organizationId: 'org_001',
      firstName: body.firstName,
      lastName: body.lastName,
      displayName: `${body.firstName.charAt(0)}. ${body.lastName}`,
      email: body.email,
      phone: body.phone,
      dateOfBirth: body.dateOfBirth,
      nationality: body.nationality,
      role: body.role,
      battingStyle: body.battingStyle,
      bowlingStyle: body.bowlingStyle,
      status: body.status ?? 'active',
      availability: 'available',
      teamId: body.teamId,
      teamName: mockTeams.find((t) => t.id === body.teamId)?.name,
      jerseyNumber: body.jerseyNumber,
      price: body.price,
      ranking: body.ranking,
      stats: {
        matches: 0, innings: 0, runs: 0, ballsFaced: 0, notOuts: 0,
        highestScore: 0, hundreds: 0, fifties: 0,
        ballsBowled: 0, wickets: 0, runsConceded: 0, bestBowling: undefined, fiveWicketHauls: 0,
        catches: 0, stumpings: 0,
      },
      tags: body.tags ?? [],
      createdAt: now,
      updatedAt: now,
    };
    mockPlayersState.push(newPlayer);
    return HttpResponse.json({ success: true, data: newPlayer });
  }),

  http.patch(`${API}/players/:playerId`, async ({ params, request }) => {
    const body = (await request.json()) as UpdatePlayerRequest;
    const idx = mockPlayersState.findIndex((p) => p.id === params.playerId);
    if (idx === -1) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Player not found' } }, { status: 404 });
    }
    mockPlayersState[idx] = { ...mockPlayersState[idx], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: mockPlayersState[idx] });
  }),

  http.delete(`${API}/players/:playerId`, ({ params }) => {
    mockPlayersState = mockPlayersState.filter((p) => p.id !== params.playerId);
    return HttpResponse.json({ success: true });
  }),

  http.post(`${API}/players/bulk-update`, async ({ request }) => {
    const body = (await request.json()) as { ids: string[]; data: UpdatePlayerRequest };
    const updated: Player[] = [];
    mockPlayersState = mockPlayersState.map((p) => {
      if (body.ids.includes(p.id)) {
        const next = { ...p, ...body.data, updatedAt: new Date().toISOString() };
        updated.push(next);
        return next;
      }
      return p;
    });
    return HttpResponse.json({ success: true, data: updated });
  }),

  http.post(`${API}/players/bulk-delete`, async ({ request }) => {
    const body = (await request.json()) as { ids: string[] };
    mockPlayersState = mockPlayersState.filter((p) => !body.ids.includes(p.id));
    return HttpResponse.json({ success: true });
  }),

  // ── Matches ─────────────────────────────────────────────

  http.get(`${API}/matches`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    const state = url.searchParams.get('state');
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const limit = parseInt(url.searchParams.get('limit') ?? '10', 10);

    let filtered = [...mockMatches];
    if (search) {
      filtered = filtered.filter((m) =>
        m.teams.some((t) => t.name.toLowerCase().includes(search)) ||
        m.venue.toLowerCase().includes(search)
      );
    }
    if (state) filtered = filtered.filter((m) => m.state === state);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    return HttpResponse.json({
      success: true,
      data: { data: paginated, total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) },
    });
  }),

  http.get(`${API}/matches/live`, () => {
    const live = mockMatches.filter((m) => m.isLive);
    return HttpResponse.json({ success: true, data: { data: live, total: live.length, page: 1, limit: 10, totalPages: 1 } });
  }),

  http.get(`${API}/matches/upcoming`, () => {
    const upcoming = mockMatches.filter((m) => m.state === 'scheduled');
    return HttpResponse.json({ success: true, data: { data: upcoming, total: upcoming.length, page: 1, limit: 10, totalPages: 1 } });
  }),

  http.get(`${API}/matches/recent`, () => {
    const recent = mockMatches.filter((m) => m.state === 'completed');
    return HttpResponse.json({ success: true, data: { data: recent, total: recent.length, page: 1, limit: 10, totalPages: 1 } });
  }),

  http.get(`${API}/matches/:matchId`, ({ params }) => {
    const match = mockMatches.find((m) => m.id === params.matchId);
    if (!match) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Match not found' } }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: match });
  }),

  // ── Teams ───────────────────────────────────────────────

  http.get(`${API}/teams`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const limit = parseInt(url.searchParams.get('limit') ?? '10', 10);

    let filtered = [...cricketMockTeams];
    if (search) filtered = filtered.filter((t) => t.name.toLowerCase().includes(search));

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    return HttpResponse.json({
      success: true,
      data: { data: paginated, total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) },
    });
  }),

  http.get(`${API}/teams/:teamId`, ({ params }) => {
    const team = cricketMockTeams.find((t) => t.id === params.teamId);
    if (!team) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Team not found' } }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: team });
  }),

  // ── Tournaments ─────────────────────────────────────────

  http.get(`${API}/tournaments`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const limit = parseInt(url.searchParams.get('limit') ?? '10', 10);

    let filtered = [...mockTournaments];
    if (search) filtered = filtered.filter((t) => t.name.toLowerCase().includes(search));

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    return HttpResponse.json({
      success: true,
      data: { data: paginated, total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) },
    });
  }),

  http.get(`${API}/tournaments/:tournamentId`, ({ params }) => {
    const tournament = mockTournaments.find((t) => t.id === params.tournamentId);
    if (!tournament) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Tournament not found' } }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: tournament });
  }),

  http.get(`${API}/tournaments/:tournamentId/standings`, ({ params }) => {
    const tournament = mockTournaments.find((t) => t.id === params.tournamentId);
    if (!tournament) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Tournament not found' } }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: tournament.standings });
  }),

  // ── Analytics ───────────────────────────────────────────

  http.get(`${API}/analytics/questions`, () => {
    return HttpResponse.json({ success: true, data: mockAnalyticsQuestions });
  }),

  http.get(`${API}/analytics/insights`, () => {
    return HttpResponse.json({ success: true, data: mockAnalyticsInsights });
  }),

  // ── AI / Insights ───────────────────────────────────────

  http.get(`${API}/ai/insights`, () => {
    return HttpResponse.json({ success: true, data: mockAiInsights });
  }),

  http.get(`${API}/ai/conversation`, () => {
    return HttpResponse.json({ success: true, data: mockAiConversation });
  }),

  http.post(`${API}/ai/ask`, async ({ request }) => {
    const body = (await request.json()) as { question: string };
    const reply: AiConversationMessage = {
      id: 'msg_' + Date.now(),
      role: 'assistant',
      content: `Based on the available data, here is an analysis of "${body.question}". This is a generated insight and should be validated against verified statistics.`,
      source: 'generated',
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, data: reply });
  }),

  // ── Media ───────────────────────────────────────────────

  http.get(`${API}/media/assets`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    const kind = url.searchParams.get('kind');
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const limit = parseInt(url.searchParams.get('limit') ?? '10', 10);

    let filtered = [...mockMediaAssets];
    if (search) filtered = filtered.filter((a) => a.title.toLowerCase().includes(search));
    if (kind) filtered = filtered.filter((a) => a.kind === kind);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    return HttpResponse.json({
      success: true,
      data: { data: paginated, total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) },
    });
  }),

  http.get(`${API}/media/assets/:assetId`, ({ params }) => {
    const asset = mockMediaAssets.find((a) => a.id === params.assetId);
    if (!asset) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Asset not found' } }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: asset });
  }),

  http.get(`${API}/media/videos`, () => {
    return HttpResponse.json({ success: true, data: { data: mockVideoAssets, total: mockVideoAssets.length, page: 1, limit: 10, totalPages: 1 } });
  }),

  http.get(`${API}/media/videos/:videoId`, ({ params }) => {
    const video = mockVideoAssets.find((v) => v.id === params.videoId);
    if (!video) {
      return HttpResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Video not found' } }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: video });
  }),
];
