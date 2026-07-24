// Mock Service Worker - MSW Setup
// This file sets up the mock API layer using MSW

import { http, HttpResponse, HttpRequest } from 'msw';
import { setupWorker, type SetupWorker } from 'msw/browser';

// ─── MOCK DATA IMPORTS ────────────────────────────────────────────────────────────
// Import all mock data from JSON files
import { mockPlayers } from './data/players.json';
import { mockTeams } from './data/teams.json';
import { mockTournaments } from './data/tournaments.json';
import { mockMatches } from './data/matches.json';

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
  year: number;
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
  status: 'scheduled' | 'live' | 'completed' | 'abandoned';
  score1?: string;
  score2?: string;
  result?: string;
  player_of_the_match?: string;
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

export async function startMockServer() {
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

    let filteredPlayers = [...mockPlayers.players] as Player[];

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
    const player = mockPlayers.players.find((p: Player) => p.id === id);
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

    let filteredTeams = [...mockTeams.teams] as Team[];

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
    const team = mockTeams.teams.find((t: Team) => t.id === id);
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

    let filteredTournaments = [...mockTournaments.tournaments] as Tournament[];

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
    const tournament = mockTournaments.tournaments.find((t: Tournament) => t.id === id);
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

    let filteredMatches = [...mockMatches.matches] as Match[];

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
    const match = mockMatches.matches.find((m: Match) => m.id === id);
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
];

// ─── EXPORTS ──────────────────────────────────────────────────────────────────────
export { handlers, startMockServer };