import { Identifiable, Timestamped } from '../shared';

export interface FantasyScoreboard extends Identifiable, Timestamped {
  leagueId: string;
  leagueName: string;
  contestId?: string;
  contestName?: string;
  
  // Player points
  playerPoints: PlayerScore[];
  
  // Team points
  teamPoints: TeamScore[];
  
  // Meta
  week?: string;
  matchId?: string;
  matchName?: string;
  generationTime: string;
  
  // Settings
  isFinal: boolean;
  isUpdated: boolean;
  lastUpdate: string;
}

export interface PlayerScore extends Identifiable {
  playerId: string;
  playerName: string;
  playerTeam: string;
  playerRole: string;
  
  // Score
  runs: number;
  wickets: number;
  catches: number;
  stumpings: number;
  runOuts: number;
  bonus: number;
  penalty: number;
  
  // Multipliers
  isCaptain: boolean;
  isViceCaptain: boolean;
  captainMultiplier: number;
  viceCaptainMultiplier: number;
  
  // Total
  basePoints: number;
  multiplierPoints: number;
  totalPoints: number;
}

export interface TeamScore extends Identifiable {
  teamId: string;
  teamName: string;
  ownerName: string;
  ownerEmail?: string;
  
  // Roster
  players: PlayerScore[];
  
  // Stats
  totalPoints: number;
  rank: number;
  rankChange?: 'up' | 'down' | 'same';
  
  // Prize
  prize?: number;
  
  // Status
  isEligible: boolean;
  isDisqualified: boolean;
  isWinner: boolean;
}

export interface ScoreboardLeaderboard {
  scoreboardId: string;
  
  // Entries
  entries: LeaderboardEntry[];
  totalEntries: number;
  
  // Prizes
  totalPrize: number;
  prizeDistributed: number;
}

export interface LeaderboardEntry extends Identifiable {
  rank: number;
  teamId: string;
  teamName: string;
  ownerName: string;
  
  totalPoints: number;
  pointsDifference: number;
  
  // Prize
  prize?: number;
  prizePosition?: number;
  
  // History
  previousRank?: number;
}

export interface ScoreboardStats {
  totalPlayers: number;
  totalTeams: number;
  
  // Points
  averagePoints: number;
  medianPoints: number;
  maxPoints: number;
  minPoints: number;
  
  // Participation
  activeTeams: number;
  disqualifiedTeams: number;
  winnerTeams: number;
}