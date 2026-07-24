import { Identifiable, Timestamped } from '../shared';
import { PlayerRole } from '../competition/players';

export interface FantasyPlayer extends Identifiable, Timestamped {
  playerId: string;
  playerName: string;
  playerInitials: string;
  teamId: string;
  teamName: string;
  
  // Info
  role: PlayerRole;
  battingStyle: string;
  bowlingStyle: string;
  
  // Pricing
  credit: number;
  price: number;
  priceChange: number;
  
  // Stats
  matchesPlayed: number;
  runs: number;
  wickets: number;
  catches: number;
  stumpings: number;
  points: number;
  averagePoints: number;
  peakPoints: number;
  
  // Form
  form: string[];
  recentMatches: MatchPerformance[];
  
  // Status
  isAvailable: boolean;
  isCaptainEligible: boolean;
  isViceCaptainEligible: boolean;
  isInjured: boolean;
  isInDreamTeam: boolean;
}

export interface MatchPerformance extends Identifiable {
  matchId: string;
  matchName?: string;
  matchDate: string;
  
  // Innings
  batting?: BattingPerformance;
  bowling?: BowlingPerformance;
  fielding?: FieldingPerformance;
  
  // Overall
  points: number;
  rank?: number;
}

export interface BattingPerformance {
  runs: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissal?: string;
}

export interface BowlingPerformance {
  wickets: number;
  oversBowled: number;
  runsConceded: number;
  economy: number;
  maidens: number;
  bestBowling?: string;
}

export interface FieldingPerformance {
  catches: number;
  stumpings: number;
  runOuts: number;
  directHits: number;
}

export interface PlayerTrend extends Identifiable, Timestamped {
  playerId: string;
  playerName: string;
  
  metric: string;
  currentValue: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  
  period: 'week' | 'month' | 'season';
  confidence: number;
}