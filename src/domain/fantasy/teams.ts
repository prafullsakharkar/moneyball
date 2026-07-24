import { Identifiable, Timestamped } from '../shared';

export interface FantasyTeam extends Identifiable, Timestamped {
  name: string;
  ownerId: string;
  ownerName: string;
  
  // Tournament context
  tournamentId: string;
  tournamentName: string;
  
  // Roster
  players: FantasyTeamPlayer[];
  budgetSpent: number;
  remainingBudget: number;
  
  // Settings
  captainId: string;
  viceCaptainId: string;
  
  // Stats
  totalPoints: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  pointsPercentage: number;
  
  // League participation
  leagueIds: string[];
  contestIds: string[];
  
  // Status
  isEligible: boolean;
  isDisqualified: boolean;
}

export interface FantasyTeamPlayer extends Identifiable {
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
  pointsBreakdown?: PlayerPointsBreakdown;
}

export interface PlayerPointsBreakdown {
  runs: number;
  wickets: number;
  catches: number;
  stumpings: number;
  runOuts: number;
  bonus: number;
  penalty: number;
  total: number;
}

export interface TeamPerformance {
  teamId: string;
  tournamentId: string;
  
  // Weekly stats
  weeklyStats: Record<string, WeeklyStats>;
  
  // Overall stats
  totalMatches: number;
  totalPoints: number;
  averagePoints: number;
  peakPoints: number;
  
  // Rank
  currentRank: number;
  bestRank: number;
  rankChangeTrend: 'up' | 'down' | 'stable';
}

export interface WeeklyStats {
  week: string;
  matches: number;
  points: number;
  rank: number;
  leaderboardPosition: number;
  prizeWon: number;
}