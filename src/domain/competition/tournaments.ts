import { Identifiable, Timestamped, Nameable, Descriptionable } from '../shared';

// Tournament types
export type TournamentStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';
export type TournamentFormat = 'T20' | 'ODI' | 'Test' | 'First-class' | 'League';
export type TournamentType = 'international' | 'domestic' | 'franchise' | 'club' | 'academy' | 'friendly';

export interface Tournament extends Identifiable, Timestamped, Nameable, Descriptionable {
  shortName: string;
  format: TournamentFormat;
  type: TournamentType;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  venueId: string;
  country: string;
  bannerUrl?: string;
  logoUrl?: string;
  prizeMoney?: number;
  prizeBreakdown?: PrizeBreakdown[];
  organizerId: string;
  maxTeams: number;
  currentTeamCount: number;
  rules?: string;
  schedule?: ScheduleConfig;
}

export interface PrizeBreakdown {
  position: number;
  amount: number;
  description: string;
}

export interface ScheduleConfig {
  matchesPerDay: number;
  restDays: string[]; // ISO dates
  breakPeriods: {
    start: string;
    end: string;
    reason: string;
  }[];
}

// Tournament team assignment
export interface TournamentTeam extends Identifiable {
  tournamentId: string;
  teamId: string;
  registeredAt: string;
  squad: PlayerSquadMember[];
  captainId?: string;
  coachId?: string;
  status: 'registered' | 'confirmed' | 'withdrawn';
}

export interface PlayerSquadMember extends Identifiable {
  playerId: string;
  name: string;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicketkeeper';
  status: 'active' | 'injured' | 'rested';
  jerseyNumber?: number;
}

// Tournament standings
export interface TournamentStandings {
  tournamentId: string;
  teams: TeamStanding[];
}

export interface TeamStanding {
  teamId: string;
  teamName: string;
  teamShort: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  byes: number;
  wickets: number;
  runsScored: number;
  runsConceded: number;
  netRunRate: number;
  points: number;
  status: 'qualified' | 'eliminated' | 'pending';
  lastUpdated: string;
}

// Tournament match schedule
export interface TournamentSchedule {
  tournamentId: string;
  rounds: RoundSchedule[];
}

export interface RoundSchedule {
  roundId: string;
  roundName: string;
  matches: MatchSchedule[];
}

export interface MatchSchedule extends Identifiable {
  matchId: string;
  team1Id: string;
  team2Id: string;
  team1Name?: string;
  team2Name?: string;
  team1Logo?: string;
  team2Logo?: string;
  venueId: string;
  venueName?: string;
  startTime: string;
  format: TournamentFormat;
  status: 'scheduled' | 'live' | 'completed' | 'abandoned';
  tossWinner?: string;
  innings?: InningsScore[];
}

export interface InningsScore {
  innings: number;
  teamId: string;
  runs: number;
  wickets: number;
  overs: number;
  target?: number;
}