import { Identifiable, Timestamped } from '../shared';

// Insight types
export type InsightType = 'batting' | 'bowling' | 'fielding' | 'match' | 'trend' | 'pattern' | 'opportunity';
export type InsightCategory = 'technical' | 'tactical' | 'physical' | 'mental' | 'strategic';
export type InsightSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Insight extends Identifiable, Timestamped {
  playerId?: string;
  playerName?: string;
  teamId?: string;
  teamName?: string;
  
  type: InsightType;
  category: InsightCategory;
  title: string;
  description: string;
  
  // Score
  severity: InsightSeverity;
  confidence: number; // 0-100
  impactScore?: number; // 0-100
  
  // Data context
  dataPoints?: InsightDataPoint[];
  comparisons?: InsightComparison[];
  
  // Context
  matchId?: string;
  matchName?: string;
  matchDate?: string;
  tournamentId?: string;
  tournamentName?: string;
  
  // Actions
  recommendedActions?: string[];
  resources?: InsightResource[];
  
  // Status
  isRead: boolean;
  isActioned: boolean;
  actionTaken?: string;
}

export interface InsightDataPoint {
  label: string;
  value: number;
  historicalAverage?: number;
  benchmark?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface InsightComparison {
  label: string;
  myValue: number;
  comparisonValue: number;
  advantage: 'me' | 'opponent' | 'even';
}

export interface InsightResource {
  title: string;
  type: 'video' | 'article' | 'drill' | 'tutorial';
  url?: string;
  duration?: number;
}

export interface PlayerTrend extends Identifiable, Timestamped {
  playerId: string;
  playerName: string;
  playerInitials: string;
  
  metric: string; // e.g., 'batting_average', 'strike_rate', 'economy'
  currentValue: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  
  // Context
  period: 'week' | 'month' | 'season' | 'career';
  startDate: string;
  endDate: string;
  
  // Analysis
  insight?: string;
  factors?: string[];
}

export interface MatchPattern extends Identifiable, Timestamped {
  matchId: string;
  matchName?: string;
  teamId: string;
  teamName?: string;
  
  patternType: 'batting_order' | 'bowling_attack' | 'fielding_positions' | 'toss_decision' | 'venue_performance';
  pattern: string;
  successRate: number;
  sampleSize: number;
  
  // Recommendation
  recommendation?: string;
  confidence: number;
}