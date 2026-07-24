import { Identifiable, Timestamped } from '../shared';

// Analysis types
export type AnalysisType = 'video' | 'performance' | 'tactical' | 'opponent' | 'pattern';
export type AnalysisStatus = 'pending' | 'processing' | 'complete' | 'failed';

export interface AIAnalysis extends Identifiable, Timestamped {
  title: string;
  type: AnalysisType;
  status: AnalysisStatus;
  
  // Input
  videoId?: string;
  matchId?: string;
  playerId?: string;
  teamId?: string;
  
  // Output
  results: AnalysisResult[];
  summary?: string;
  insights?: string[];
  
  // Processing
  processingTimeMs?: number;
  error?: string;
  
  // Settings
  confidenceThreshold: number;
  includeVisuals: boolean;
  
  // Stats
  views: number;
  isFeatured: boolean;
}

export interface AnalysisResult {
  type: 'shot' | 'delivery' | 'pattern' | 'trend' | 'insight' | 'recommendation';
  label: string;
  description: string;
  confidence: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  timestamp?: number; // seconds in video
  videoUrl?: string;
}

export interface VideoAnalysis extends Identifiable, Timestamped {
  videoId: string;
  videoTitle?: string;
  
  // Analysis types
  shotAnalysis?: ShotAnalysisResult;
  deliveryAnalysis?: DeliveryAnalysisResult;
  patternAnalysis?: PatternAnalysisResult;
  playerPerformance?: PlayerPerformanceAnalysis;
  
  // Summary
  summary: string;
  keyFindings: string[];
  
  // Stats
  processingTimeMs: number;
  framesAnalyzed: number;
}

export interface ShotAnalysisResult {
  shotsDetected: number;
  shotDistribution: Record<string, number>;
  mostFrequentShot: string;
  mostEffectiveShot: string;
  weaknesses: string[];
  recommendations: string[];
  
  // By direction
  shotsByDirection: Record<string, number>;
  runsByDirection: Record<string, number>;
}

export interface DeliveryAnalysisResult {
  deliveriesBowled: number;
  deliveryDistribution: Record<string, number>;
  mostEffectiveDelivery: string;
  vulnerabilities: string[];
  recommendations: string[];
  
  // By type
  deliveriesByType: Record<string, number>;
  runsConcededByType: Record<string, number>;
  wicketsByType: number;
}

export interface PatternAnalysisResult {
  patternsFound: number;
  patterns: Pattern[];
  teamTendencies: Record<string, string>;
  opponentTendencies: Record<string, string>;
}

export interface Pattern {
  type: 'batting_order' | 'bowling_attack' | 'fielding_position' | 'toss_decision';
  pattern: string;
  successRate: number;
  frequency: number;
}

export interface PlayerPerformanceAnalysis {
  playerId: string;
  playerName: string;
  role: string;
  
  metrics: PerformanceMetric[];
  strengths: string[];
  weaknesses: string[];
  rating: number;
  
  // Comparison
  seasonAverage: number;
  percentile: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  seasonAverage: number;
  benchmark: number;
  rating: number; // 0-100
  trend: 'up' | 'down' | 'stable';
}