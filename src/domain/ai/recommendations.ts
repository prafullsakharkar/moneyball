import { Identifiable, Timestamped } from '../shared';

// Recommendation types
export type RecommendationType =
  | 'training_plan'
  | 'player_dev'
  | 'team_strategy'
  | 'recruitment'
  | 'tactical'
  | 'opponent_analysis'
  | 'nutrition'
  | 'recovery';

export type RecommendationStatus = 'pending' | 'viewed' | 'actioned' | 'dismissed';

export interface Recommendation extends Identifiable, Timestamped {
  playerId?: string;
  playerName?: string;
  teamId?: string;
  teamName?: string;
  
  type: RecommendationType;
  title: string;
  description: string;
  
  // Context
  matchId?: string;
  matchName?: string;
  matchDate?: string;
  tournamentId?: string;
  tournamentName?: string;
  
  // Score
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  impactScore?: number; // 0-100
  
  // Evidence
  evidence: RecommendationEvidence[];
  
  // Actions
  recommendedActions: string[];
  resources?: RecommendationResource[];
  
  // Status
  status: RecommendationStatus;
  viewedAt?: string;
  actionTaken?: string;
  actionedAt?: string;
  
  // Stats
  points?: number;
  isHighlighted: boolean;
}

export interface RecommendationEvidence {
  label: string;
  value: number;
  historicalAverage?: number;
  benchmark?: number;
  comparison?: string;
}

export interface RecommendationResource {
  title: string;
  type: 'video' | 'article' | 'drill' | 'tutorial' | 'plan';
  url?: string;
  duration?: number;
}

export interface TrainingPlanRecommendation {
  playerId: string;
  playerName: string;
  playerInitials: string;
  
  duration: string; // e.g., "4 weeks"
  focusAreas: string[];
  weeklySchedule: WeeklyPlan;
  
  // Goals
  goals: Goal[];
  
  // Resources
  equipment: string[];
  recommendedReading?: string[];
  
  // Review
  reviewDates: string[];
  progressMetrics: string[];
}

export interface WeeklyPlan {
  days: DayPlan[];
}

export interface DayPlan {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  focus: string[];
  drills: string[];
  intensity: 'low' | 'medium' | 'high';
  duration: number; // minutes
  rest: boolean;
}

export interface Goal {
  name: string;
  target: number;
  current: number;
  timeline: string;
  isMilestone: boolean;
}

export interface PlayerDevelopmentRecommendation {
  playerId: string;
  playerName: string;
  
  strengths: string[];
  areasForImprovement: string[];
  skillGaps: string[];
  
  // Development plan
  recommendedTraining: string[];
  suggestedDrills: DrillRecommendation[];
  
  // Progress
  targetLevel: string;
  estimatedTimeline: string;
  successProbability: number;
}

export interface DrillRecommendation {
  name: string;
  category: 'batting' | 'bowling' | 'fielding' | 'fitness' | 'mental';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  equipment: string[];
  duration: number;
  description: string;
}