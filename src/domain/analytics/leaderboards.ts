import { Identifiable, Timestamped, Nameable } from '../shared';

// Leaderboard types
export type LeaderboardType = 'batting' | 'bowling' | 'fielding' | 'all_round' | 'team' | 'tournament';
export type LeaderboardPeriod = 'all_time' | 'season' | 'year' | 'month' | 'current';

export interface Leaderboard extends Identifiable, Timestamped, Nameable {
  type: LeaderboardType;
  period: LeaderboardPeriod;
  year?: number;
  season?: string;
  
  // Settings
  minMatches: number;
  filterBy?: {
    teamId?: string;
    tournamentId?: string;
    role?: string;
  };
  
  // Entries
  entries: LeaderboardEntry[];
  lastUpdated: string;
}

export interface LeaderboardEntry extends Identifiable {
  playerId: string;
  playerName: string;
  playerInitials: string;
  teamId?: string;
  teamName?: string;
  teamShort?: string;
  
  // Stats
  value: number;
  matches: number;
  rank: number;
  rankChange?: 'up' | 'down' | 'same'; // from previous period
  
  // Details
  details?: LeaderboardDetails;
}

export interface LeaderboardDetails {
  // Batting
  runs?: number;
  average?: number;
  strikeRate?: number;
  centuries?: number;
  halfCenturies?: number;
  highestScore?: string;
  
  // Bowling
  wickets?: number;
  economy?: number;
  bowlingAverage?: number;
  bestBowling?: string;
  fiveWickets?: number;
  
  // Fielding
  catches?: number;
  stumpings?: number;
  runOuts?: number;
  
  // All round
  points?: number;
}

export interface TeamLeaderboardEntry extends Identifiable {
  teamId: string;
  teamName: string;
  teamShort: string;
  
  // Stats
  points: number;
  matches: number;
  won: number;
  lost: number;
  tied: number;
  nrr?: number;
  rank: number;
  rankChange?: 'up' | 'down' | 'same';
}

export interface PlayerRanking extends Identifiable {
  playerId: string;
  playerName: string;
  playerInitials: string;
  
  // Rankings
  batting?: Ranking;
  bowling?: Ranking;
  allRound?: Ranking;
  fielding?: Ranking;
  
  lastUpdated: string;
}

export interface Ranking {
  rank: number;
  points: number;
  matchesPlayed: number;
  previousRank?: number;
  trend: 'up' | 'down' | 'same';
  nextPlayer?: string;
  pointsToNext: number;
}