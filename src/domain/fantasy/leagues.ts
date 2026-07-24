import { Identifiable, Timestamped } from '../shared';

// League types
export type LeagueType = 'public' | 'private' | 'premium' | 'corporate';
export type LeagueFormat = 'classic' | 'head_to_head' | 'points' | 'category';
export type LeagueStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface FantasyLeague extends Identifiable, Timestamped {
  name: string;
  type: LeagueType;
  format: LeagueFormat;
  status: LeagueStatus;
  
  // Tournament context
  tournamentId: string;
  tournamentName: string;
  year: number;
  
  // Settings
  entryFee: number;
  prizePool: number;
  maxTeams: number;
  currentTeams: number;
  
  // Timing
  startTime: string;
  endTime: string;
  registrationOpen: string;
  registrationClose: string;
  
  // Rules
  budget: number;
  minPlayersPerTeam: number;
  maxPlayersPerTeam: number;
  totalPlayers: number;
  
  // Settings
  isPublic: boolean;
  isFeatured: boolean;
  leaderboardType: 'weekly' | 'overall';
  
  // Stats
  totalPrize: number;
  prizes?: Prize[];
}

export interface Prize {
  rank: number;
  amount: number;
  description?: string;
}

export interface LeagueTeam extends Identifiable, Timestamped {
  leagueId: string;
  leagueName: string;
  
  teamId: string;
  teamName: string;
  ownerName: string;
  ownerEmail?: string;
  
  // Roster
  players: FantasyPlayerSelection[];
  budgetSpent: number;
  remainingBudget: number;
  
  // Stats
  points: number;
  rank: number;
  rankChange?: 'up' | 'down' | 'same';
  
  // Settings
  isCaptainSelected: boolean;
  isViceCaptainSelected: boolean;
  
  // Status
  isEligible: boolean;
  isDisqualified: boolean;
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

export interface LeagueSettings {
  budget: number;
  maxTeams: number;
  entryFee: number;
  prizePool: number;
  
  // Roster rules
  minBatsmen: number;
  maxBatsmen: number;
  minBowlers: number;
  maxBowlers: number;
  minAllRounders: number;
  maxAllRounders: number;
  minWicketKeepers: number;
  maxWicketKeepers: number;
  minTeamsPerRoster: number;
  maxTeamsPerRoster: number;
  
  // Captain rules
  hasCaptain: boolean;
  hasViceCaptain: boolean;
  captainPointsMultiplier: number;
  viceCaptainPointsMultiplier: number;
}