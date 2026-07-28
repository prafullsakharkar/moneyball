// Mock Service Worker - MSW Setup
// This file sets up the mock API layer using MSW

import { http, HttpResponse } from 'msw';
import { setupWorker, type SetupWorker } from 'msw/browser';

// ─── MOCK DATA IMPORTS ────────────────────────────────────────────────────────────
// Import all mock data from JSON files
import playersData from './data/players.json';
import teamsData from './data/teams.json';
import tournamentsData from './data/tournaments.json';
import matchesData from './data/matches.json';

// ─── TYPES ────────────────────────────────────────────────────────────────────────
export interface Player {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  nationality: string;
  batting_style: string;
  bowling_style?: string;
  player_type: string;
  matches?: number;
  runs?: number;
  wickets?: number;
  average?: number;
}

export interface Team {
  id: string;
  name: string;
  short_name: string;
  city: string;
  home_venue: string;
  primary_color: string;
  secondary_color: string;
  founded_year: number;
  coach: string;
  captain: string;
}

export interface Tournament {
  id: string;
  name: string;
  year: number | string;
  format: string;
  start_date: string;
  end_date: string;
  location: string;
  teams: string[];
}

export interface Match {
  id: string;
  tournament_id: string;
  team1: string;
  team2: string;
  venue: string;
  date: string;
  time: string;
  status: string;
  score1?: string;
  score2?: string;
  result?: string;
  player_of_the_match?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── MSW WORKER ──────────────────────────────────────────────────────────────────
let worker: SetupWorker | null = null;

async function startMockServer() {
  if (worker) {
    return worker;
  }

  worker = setupWorker(...handlers);
  
  if (import.meta.env.DEV) {
    await worker.start({
      serviceWorker: {
        url: new URL('./mock-service-worker.js', import.meta.url).href,
      },
      quiet: false,
    });
  }
  
  return worker;
}

// ─── REQUEST HANDLERS ─────────────────────────────────────────────────────────────
const handlers = [
  // ─── PLAYERS ────────────────────────────────────────────────────────────────
  http.get('/api/v1/players', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '12', 10);
    const search = url.searchParams.get('search') || '';
    const nationality = url.searchParams.get('nationality') || '';
    const battingStyle = url.searchParams.get('batting_style') || '';
    const bowlingStyle = url.searchParams.get('bowling_style') || '';
    const playerType = url.searchParams.get('player_type') || '';

    let filteredPlayers = [...playersData.players] as Player[];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPlayers = filteredPlayers.filter(
        (p) =>
          p.full_name.toLowerCase().includes(searchLower) ||
          p.first_name.toLowerCase().includes(searchLower) ||
          p.last_name.toLowerCase().includes(searchLower)
      );
    }

    if (nationality) {
      filteredPlayers = filteredPlayers.filter((p) => p.nationality.toLowerCase() === nationality.toLowerCase());
    }

    if (battingStyle) {
      filteredPlayers = filteredPlayers.filter((p) => p.batting_style.toLowerCase() === battingStyle.toLowerCase());
    }

    if (bowlingStyle) {
      filteredPlayers = filteredPlayers.filter((p) => p.bowling_style?.toLowerCase() === bowlingStyle.toLowerCase());
    }

    if (playerType) {
      filteredPlayers = filteredPlayers.filter((p) => p.player_type.toLowerCase() === playerType.toLowerCase());
    }

    const total = filteredPlayers.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPlayers = filteredPlayers.slice(start, end);

    return HttpResponse.json({
      data: paginatedPlayers,
      total,
      page,
      limit,
      totalPages,
    } as PaginatedResponse<Player>);
  }),

  http.get('/api/v1/players/:id', async ({ params }) => {
    const { id } = params;
    const player = playersData.players.find((p: Player) => p.id === id);
    if (player) {
      return HttpResponse.json(player);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // ─── TEAMS ──────────────────────────────────────────────────────────────────
  http.get('/api/v1/teams', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '12', 10);
    const search = url.searchParams.get('search') || '';
    const nationality = url.searchParams.get('nationality') || '';

    let filteredTeams = [...teamsData.teams] as Team[];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTeams = filteredTeams.filter((t) =>
        t.name.toLowerCase().includes(searchLower) ||
        t.short_name.toLowerCase().includes(searchLower) ||
        t.city.toLowerCase().includes(searchLower)
      );
    }

    if (nationality) {
      filteredTeams = filteredTeams.filter((t) =>
        t.city.toLowerCase().includes(nationality.toLowerCase())
      );
    }

    const total = filteredTeams.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTeams = filteredTeams.slice(start, end);

    return HttpResponse.json({
      data: paginatedTeams,
      total,
      page,
      limit,
      totalPages,
    } as PaginatedResponse<Team>);
  }),

  http.get('/api/v1/teams/:id', async ({ params }) => {
    const { id } = params;
    const team = teamsData.teams.find((t: Team) => t.id === id);
    if (team) {
      return HttpResponse.json(team);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // ─── TOURNAMENTS ────────────────────────────────────────────────────────────
  http.get('/api/v1/tournaments', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const search = url.searchParams.get('search') || '';
    const format = url.searchParams.get('format') || '';
    const year = url.searchParams.get('year') || '';

    let filteredTournaments = [...tournamentsData.tournaments] as Tournament[];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTournaments = filteredTournaments.filter((t) =>
        t.name.toLowerCase().includes(searchLower)
      );
    }

    if (format) {
      filteredTournaments = filteredTournaments.filter((t) =>
        t.format.toLowerCase() === format.toLowerCase()
      );
    }

    if (year) {
      filteredTournaments = filteredTournaments.filter((t) =>
        t.year.toString() === year
      );
    }

    const total = filteredTournaments.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTournaments = filteredTournaments.slice(start, end);

    return HttpResponse.json({
      data: paginatedTournaments,
      total,
      page,
      limit,
      totalPages,
    } as PaginatedResponse<Tournament>);
  }),

  http.get('/api/v1/tournaments/:id', async ({ params }) => {
    const { id } = params;
    const tournament = tournamentsData.tournaments.find((t: Tournament) => t.id === id);
    if (tournament) {
      return HttpResponse.json(tournament);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // ─── MATCHES ────────────────────────────────────────────────────────────────
  http.get('/api/v1/matches', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '12', 10);
    const tournamentId = url.searchParams.get('tournament_id') || '';
    const team1 = url.searchParams.get('team1') || '';
    const team2 = url.searchParams.get('team2') || '';
    const status = url.searchParams.get('status') || '';

    let filteredMatches = [...matchesData.matches] as Match[];

    if (tournamentId) {
      filteredMatches = filteredMatches.filter((m) => m.tournament_id === tournamentId);
    }

    if (team1) {
      filteredMatches = filteredMatches.filter((m) =>
        m.team1.toLowerCase() === team1.toLowerCase()
      );
    }

    if (team2) {
      filteredMatches = filteredMatches.filter((m) =>
        m.team2.toLowerCase() === team2.toLowerCase()
      );
    }

    if (status) {
      filteredMatches = filteredMatches.filter((m) => m.status === status);
    }

    const total = filteredMatches.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedMatches = filteredMatches.slice(start, end);

    return HttpResponse.json({
      data: paginatedMatches,
      total,
      page,
      limit,
      totalPages,
    } as PaginatedResponse<Match>);
  }),

  http.get('/api/v1/matches/:id', async ({ params }) => {
    const { id } = params;
    const match = matchesData.matches.find((m) => m.id === id) as Match | undefined;
    if (match) {
      return HttpResponse.json(match);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // ─── SIMULATED ERROR RESPONSES ──────────────────────────────────────────────
  http.get('/api/v1/error/404', () => {
    return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
  }),

  http.get('/api/v1/error/500', () => {
    return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
  }),

  http.get('/api/v1/error/401', () => {
    return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
  }),

  // ─── FALLBACK ───────────────────────────────────────────────────────────────
  http.all('/api/*', () => {
    return new HttpResponse(null, { status: 404 });
  }),

  // ─── PLAYER STATS ──────────────────────────────────────────────────────────────
  http.get('/api/v1/players/:id/stats', async ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      total_matches: 150,
      total_runs: 5200,
      total_wickets: 85,
      batting_average: 38.5,
      strike_rate: 125.4,
      economy_rate: 7.2,
      highest_score: '145*',
      best_bowling: '5/24',
      centuries: 12,
      fifties: 34,
      wickets_5: 8,
    });
  }),

  // ─── PLAYER ANALYTICS ──────────────────────────────────────────────────────────
  http.get('/api/v1/players/:id/analytics', async ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      career_summary: {
        matches: 150,
        runs: 5200,
        wickets: 85,
        average: 38.5,
      },
      recent_form: [
        { date: '2024-01-15', runs: 85, wickets: 0 },
        { date: '2024-01-10', runs: 120, wickets: 0 },
        { date: '2024-01-05', runs: 45, wickets: 1 },
      ],
      performance_by_format: {
        T20: { matches: 80, runs: 3200, average: 42.0 },
        ODI: { matches: 50, runs: 1800, average: 35.5 },
        Test: { matches: 20, runs: 1200, average: 40.0 },
      },
      performance_by_team: [
        { team: 'Mumbai Indians', matches: 25, runs: 750, average: 35.0 },
        { team: 'Chennai Super Kings', matches: 20, runs: 580, average: 32.5 },
      ],
    });
  }),

  // ─── MATCH STATS ───────────────────────────────────────────────────────────────
  http.get('/api/v1/matches/:id/stats', async ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      match_id: id,
      teams: { team1: 'Mumbai Indians', team2: 'Chennai Super Kings' },
      scorecard: {
        team1: { runs: 185, wickets: 8, overs: 20 },
        team2: { runs: 178, wickets: 6, overs: 20 },
      },
      player_of_the_match: 'player-001',
      man_of_the_series: null,
    });
  }),

  // ─── H2H ANALYTICS ──────────────────────────────────────────────────────────────
  http.get('/api/v1/h2h', async ({ request }) => {
    const url = new URL(request.url);
    const team1 = url.searchParams.get('team1') || 'Mumbai Indians';
    const team2 = url.searchParams.get('team2') || 'Chennai Super Kings';

    return HttpResponse.json({
      team1,
      team2,
      matches_played: 32,
      team1_wins: 18,
      team2_wins: 13,
      no_results: 1,
      last_5_matches: [
        { date: '2024-04-10', winner: team1 },
        { date: '2024-03-25', winner: team2 },
        { date: '2024-03-10', winner: team1 },
        { date: '2024-02-28', winner: team2 },
        { date: '2024-02-15', winner: team1 },
      ],
      venue_history: [
        { venue: 'Wankhede Stadium', team1_wins: 8, team2_wins: 4 },
        { venue: 'Chepauk Stadium', team1_wins: 3, team2_wins: 7 },
      ],
    });
  }),

  // ─── TOURNAMENT ANALYTICS ───────────────────────────────────────────────────────
  http.get('/api/v1/tournaments/:id/analytics', async ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      tournament_id: id,
      name: 'Indian Premier League 2024',
      format: 'T20',
      teams_count: 10,
      matches_played: 74,
      total_runs: 125000,
      total_wickets: 580,
      top_batsmen: [
        { player_id: 'player-001', name: 'Rohit Sharma', runs: 632, average: 42.1 },
        { player_id: 'player-002', name: 'Suryakumar Yadav', runs: 598, average: 38.9 },
        { player_id: 'player-003', name: 'Virat Kohli', runs: 575, average: 44.2 },
      ],
      top_bowlers: [
        { player_id: 'player-004', name: 'Jasprit Bumrah', wickets: 32, economy: 7.2 },
        { player_id: 'player-005', name: 'Yuzvendra Chahal', wickets: 28, economy: 6.8 },
        { player_id: 'player-006', name: 'Mohammed Shami', wickets: 26, economy: 7.5 },
      ],
      team_stats: [
        { team_id: 'team-001', name: 'Mumbai Indians', matches: 14, wins: 10, points: 20 },
        { team_id: 'team-002', name: 'Chennai Super Kings', matches: 14, wins: 9, points: 18 },
      ],
    });
  }),

  // ─── TEAM ANALYTICS ──────────────────────────────────────────────────────────────
  http.get('/api/v1/teams/:id/analytics', async ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      team_id: id,
      name: 'Mumbai Indians',
      matches_played: 14,
      wins: 10,
      losses: 4,
      points: 20,
      net_run_rate: 0.85,
      form: ['W', 'W', 'L', 'W', 'W'],
      top_performers: [
        { player_id: 'player-001', name: 'Rohit Sharma', runs: 450, average: 45.0 },
        { player_id: 'player-004', name: 'Jasprit Bumrah', wickets: 18, economy: 7.8 },
      ],
      home_away_stats: {
        home: { matches: 7, wins: 6, loss: 1 },
        away: { matches: 7, wins: 4, loss: 3 },
      },
    });
  }),

  // ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────────
  http.get('/api/v1/admin/dashboard', () => {
    return HttpResponse.json({
      total_players: 250,
      total_teams: 10,
      total_tournaments: 5,
      total_matches: 156,
      total_revenue: 12500000,
      active_users: 15000,
      recent_activity: [
        { action: 'match_created', timestamp: '2024-04-10T14:30:00Z' },
        { action: 'player_registered', timestamp: '2024-04-10T12:15:00Z' },
        { action: 'tournament_started', timestamp: '2024-04-10T10:00:00Z' },
      ],
    });
  }),

  // ─── ADMIN TOURNAMENT MANAGEMENT ─────────────────────────────────────────────────
  http.get('/api/v1/admin/tournaments', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    return HttpResponse.json({
      data: tournamentsData.tournaments.slice(0, 10).map((t: Tournament, i: number) => ({ ...t, id: `admin-tournament-${i}` })),
      total: 10,
      page,
      limit,
      totalPages: 1,
    });
  }),

  http.get('/api/v1/admin/tournaments/:id', async ({ params }) => {
    const { id } = params;
    const tournament = tournamentsData.tournaments.find((t: Tournament) => t.id === id);
    if (tournament) {
      return HttpResponse.json({ ...tournament, id: `admin-${tournament.id}` });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // ─── ADMIN TEAM MANAGEMENT ───────────────────────────────────────────────────────
  http.get('/api/v1/admin/teams', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    return HttpResponse.json({
      data: teamsData.teams.slice(0, 10).map((t: Team, i: number) => ({ ...t, id: `admin-team-${i}` })),
      total: 10,
      page,
      limit,
      totalPages: 1,
    });
  }),

  http.get('/api/v1/admin/teams/:id', async ({ params }) => {
    const { id } = params;
    const team = teamsData.teams.find((t: Team) => t.id === id);
    if (team) {
      return HttpResponse.json({ ...team, id: `admin-${team.id}` });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // ─── ADMIN PLAYER MANAGEMENT ─────────────────────────────────────────────────────
  http.get('/api/v1/admin/players', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    return HttpResponse.json({
      data: playersData.players.slice(0, 10).map((p: Player, i: number) => ({ ...p, id: `admin-player-${i}` })),
      total: 10,
      page,
      limit,
      totalPages: 1,
    });
  }),

  http.get('/api/v1/admin/players/:id', async ({ params }) => {
    const { id } = params;
    const player = playersData.players.find((p: Player) => p.id === id);
    if (player) {
      return HttpResponse.json({ ...player, id: `admin-${player.id}` });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // ─── ADMIN MATCH MANAGEMENT ──────────────────────────────────────────────────────
  http.get('/api/v1/admin/matches', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    return HttpResponse.json({
      data: matchesData.matches.slice(0, 10).map((m: Match, i: number) => ({ ...m, id: `admin-match-${i}` })),
      total: 10,
      page,
      limit,
      totalPages: 1,
    });
  }),

  // ─── SPONSORSHIP ────────────────────────────────────────────────────────────────
  http.get('/api/v1/sponsorship', async ({ request }) => {
    return HttpResponse.json({
      total_sponsors: 15,
      total_value: 5000000,
      active_deals: 12,
      deals: [
        { id: 'sponsor-001', name: 'Reliance Industries', value: 1000000, status: 'active' },
        { id: 'sponsor-002', name: 'Adidas', value: 800000, status: 'active' },
        { id: 'sponsor-003', name: 'Vivo', value: 750000, status: 'active' },
      ],
    });
  }),

  // ─── MONETIZATION ───────────────────────────────────────────────────────────────
  http.get('/api/v1/monetization', async ({ request }) => {
    return HttpResponse.json({
      total_revenue: 2500000,
      subscriptions: 5000,
      avg_revenue_per_user: 500,
      revenue_by_source: {
        subscriptions: 1500000,
        ads: 500000,
        sponsorships: 500000,
      },
    });
  }),

  // ─── NOTIFICATIONS ───────────────────────────────────────────────────────────────
  http.get('/api/v1/notifications', async ({ request }) => {
    return HttpResponse.json({
      notifications: [
        { id: 'notif-001', title: 'New Match Scheduled', message: 'MI vs CSK match scheduled for April 15', read: false },
        { id: 'notif-002', title: 'Player Transfer', message: 'Player X has been transferred to Team Y', read: false },
        { id: 'notif-003', title: 'Tournament Started', message: 'IPL 2024 has started', read: true },
      ],
      total: 3,
      unread: 2,
    });
  }),

  // ─── FANTASY LEAGUES ─────────────────────────────────────────────────────────────
  http.get('/api/v1/fantasy/leagues', async ({ request }) => {
    return HttpResponse.json({
      leagues: [
        { id: 'league-001', name: 'IPL 2024 Master League', entries: 5000, prize_pool: 1000000 },
        { id: 'league-002', name: 'IPL 2024 Pro League', entries: 10000, prize_pool: 500000 },
      ],
    });
  }),

  // ─── STREAMING ───────────────────────────────────────────────────────────────────
  http.get('/api/v1/streaming', async ({ request }) => {
    return HttpResponse.json({
      streams: [
        { id: 'stream-001', name: 'MI vs CSK', status: 'live', viewers: 5000000 },
        { id: 'stream-002', name: 'RCB vsKKR', status: 'scheduled', viewers: 0 },
      ],
    });
  }),

  // ─── VIDEO ANALYSIS ──────────────────────────────────────────────────────────────
  http.get('/api/v1/video-analysis', async ({ request }) => {
    return HttpResponse.json({
      videos: [
        { id: 'video-001', title: 'Best Balls 2024', match_id: 'match-001', duration: '120s' },
        { id: 'video-002', title: 'Sixes 2024', match_id: 'match-002', duration: '90s' },
      ],
      clips: [
        { id: 'clip-001', title: 'Rohit Sharma 6es', match_id: 'match-001', duration: '30s' },
        { id: 'clip-002', title: 'Bumrah Wickets', match_id: 'match-002', duration: '45s' },
      ],
    });
  }),

  // ─── ACADEMY ─────────────────────────────────────────────────────────────────────
  http.get('/api/v1/academy/students', async ({ request }) => {
    return HttpResponse.json({
      students: [
        { id: 'student-001', name: 'Rahul Sharma', batch: '2024', progress: 75 },
        { id: 'student-002', name: 'Amit Patel', batch: '2024', progress: 60 },
      ],
      total: 50,
    });
  }),

  // ─── TRAINING ────────────────────────────────────────────────────────────────────
  http.get('/api/v1/training/sessions', async ({ request }) => {
    return HttpResponse.json({
      sessions: [
        { id: 'session-001', name: 'Batting Practice', date: '2024-04-10', players: 15 },
        { id: 'session-002', name: 'Bowling Practice', date: '2024-04-11', players: 12 },
      ],
    });
  }),

  // ─── REPORTS ─────────────────────────────────────────────────────────────────────
  http.get('/api/v1/reports', async ({ request }) => {
    return HttpResponse.json({
      reports: [
        { id: 'report-001', name: 'Player Performance', type: 'pdf', size: '2.5MB' },
        { id: 'report-002', name: 'Team Statistics', type: 'xlsx', size: '1.2MB' },
      ],
    });
  }),
];

// ─── EXPORTS ──────────────────────────────────────────────────────────────────────
export { handlers, startMockServer };
