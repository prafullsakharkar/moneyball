import { Identifiable, Timestamped } from '../shared';

// Prediction types
export type PredictionType = 'match_outcome' | 'player_performance' | 'team_performance' | 'score_forecast' | 'wicket_predictor';
export type PredictionOutcome = 'correct' | 'incorrect' | 'pending' | 'partial';
export type ConfidenceLevel = 'low' | 'medium' | 'high' | 'very_high';

export interface Prediction extends Identifiable, Timestamped {
  matchId: string;
  matchName?: string;
  matchDate?: string;
  
  predictionType: PredictionType;
  predictionLabel: string;
  
  // Prediction details
  predictedOutcome: string;
  confidence: number; // 0-100
  confidenceLevel: ConfidenceLevel;
  
  // Actual outcome
  actualOutcome?: string;
  outcome?: PredictionOutcome;
  margin?: number; // difference from actual
  
  // Model info
  modelVersion?: string;
  modelAccuracy?: number;
  featuresUsed?: string[];
  
  // Probability breakdown
  probabilities?: Record<string, number>;
  
  // Timing
  madeAt: string;
  resolvedAt?: string;
  
  // Stats
  points?: number;
  isHighlighted: boolean;
}

export interface MatchOutcomePrediction extends Identifiable, Timestamped {
  matchId: string;
  matchName?: string;
  team1Id: string;
  team1Name: string;
  team2Id: string;
  team2Name: string;
  
  predictedWinnerId: string;
  predictedWinnerName: string;
  winProbability: number;
  marginPrediction?: number;
  
  // Factors
  keyFactors: PredictionFactor[];
  
  // Accuracy
  outcome?: PredictionOutcome;
  correctSide?: boolean;
}

export interface PlayerPerformancePrediction extends Identifiable, Timestamped {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName?: string;
  
  matchId: string;
  matchName?: string;
  
  metric: string; // e.g., 'runs', 'wickets', 'catches'
  predictedValue: number;
  predictedRange: { min: number; max: number };
  confidence: number;
  
  // Comparison
  seasonAverage: number;
  matchAverage?: number;
  
  // Outcome
  actualValue?: number;
  deviation?: number;
}

export interface PredictionFactor {
  label: string;
  value: number;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description?: string;
}

export interface PredictionAnalytics {
  modelId?: string;
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;
  averageConfidence: number;
  averageDeviation?: number;
  
  // By type
  byType: Record<PredictionType, PredictionStats>;
  
  // By team
  byTeam?: Record<string, TeamPredictionStats>;
}

export interface PredictionStats {
  total: number;
  correct: number;
  incorrect: number;
  pending: number;
  accuracy: number;
}

export interface TeamPredictionStats {
  total: number;
  correct: number;
  accuracy: number;
  averagePoints: number;
}