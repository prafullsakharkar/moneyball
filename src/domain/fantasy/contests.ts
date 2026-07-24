import { Identifiable, Timestamped } from '../shared';

// Contest types
export type ContestType = 'head_to_head' | 'league' | 'mega' | 'super' | 'small';
export type ContestEntryType = 'fixed' | 'variable';
export type ContestStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface FantasyContest extends Identifiable, Timestamped {
  name: string;
  type: ContestType;
  status: ContestStatus;
  
  // League context
  leagueId: string;
  leagueName: string;
  tournamentId: string;
  tournamentName: string;
  
  // Settings
  entryFee: number;
  prizePool: number;
  maxEntries: number;
  currentEntries: number;
  
  // Prize structure
  prizes: ContestPrize[];
  firstPrize: number;
  lastPrize: number;
  
  // Timing
  startTime: string;
  endTime: string;
  registrationOpen: string;
  registrationClose: string;
  
  // Settings
  isPublic: boolean;
  isFeatured: boolean;
  isPremium: boolean;
  
  // Stats
  prizeDistributed: number;
}

export interface ContestPrize {
  rankFrom: number;
  rankTo: number;
  amount: number;
  description?: string;
}

export interface ContestTeam extends Identifiable, Timestamped {
  contestId: string;
  contestName: string;
  
  teamId: string;
  teamName: string;
  ownerName: string;
  ownerEmail?: string;
  
  // Score
  totalPoints: number;
  rank: number;
  rankChange?: 'up' | 'down' | 'same';
  
  // Roster
  players: FantasyPlayerSelection[];
  budgetSpent: number;
  
  // Prize
  prizeWon?: number;
  prizePosition?: number;
  
  // Status
  isWinner: boolean;
  isDisqualified: boolean;
  isEligible: boolean;
}

export interface FantasyPlayerSelection extends Identifiable {
  playerId: string;
  playerName: string;
  playerTeam: string;
  playerRole: string;
  
  // Position
  position: 'batsman' | 'bowler' | 'all_rounder' | 'wicketkeeper';
  isCaptain: boolean;
  isViceCaptain: boolean;
  
  // Price
  credit: number;
  
  // Stats
  projectedPoints: number;
  actualPoints?: number;
}

export interface ContestLeaderboard {
  contestId: string;
  contestName: string;
  tournamentId: string;
  
  entries: ContestLeaderboardEntry[];
  totalEntries: number;
  prizeDistributed: number;
}

export interface ContestLeaderboardEntry extends Identifiable {
  rank: number;
  teamId: string;
  teamName: string;
  ownerName: string;
  
  totalPoints: number;
  pointsBreakdown: PointsBreakdown[];
  
  // Prize
  prize?: number;
  prizePosition?: number;
}

export interface PointsBreakdown {
  player: string;
  runs: number;
  wickets: number;
  catches: number;
  stumps: number;
  runOuts: number;
  bonus: number;
  total: number;
}