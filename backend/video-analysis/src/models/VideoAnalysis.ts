// Models for Video Analysis Service

export interface VideoAnalysisSession {
  id: string;
  matchId?: string;
  playerId?: string;
  videoUrl: string;
  analysisType: AnalysisType;
  status: SessionStatus;
  resultUrl?: string;
  confidenceScore?: number;
  duration?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface VideoAnalysisResult {
  id: string;
  sessionId: string;
  analysisType: AnalysisType;
  metricName: string;
  metricValue: number;
  metricUnit?: string;
  confidenceScore: number;
  timestampRange?: Record<string, any>;
  insights: string[];
  recommendations: string[];
  createdAt: string;
}

export interface VideoAnnotation {
  id: string;
  sessionId: string;
  annotationType: AnnotationType;
  timestampStart: number;
  timestampEnd: number;
  description?: string;
  tags: string[];
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface VideoHighlight {
  id: string;
  sessionId: string;
  highlightType: HighlightType;
  timestampStart: number;
  timestampEnd: number;
  title: string;
  description?: string;
  isFeatured: boolean;
  createdAt: string;
}

export interface VideoTag {
  id: string;
  sessionId: string;
  tag: string;
  confidence: number;
  createdAt: string;
}

// Enums
export enum AnalysisType {
  BattingTechnique = 'BattingTechnique',
  BowlingAction = 'BowlingAction',
  FieldingPosition = 'FieldingPosition',
  MatchAnalysis = 'MatchAnalysis',
  PerformanceReview = 'PerformanceReview',
  TrainingDrill = 'TrainingDrill'
}

export enum SessionStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
  Cancelled = 'Cancelled'
}

export enum AnnotationType {
  Shot = 'Shot',
  Delivery = 'Delivery',
  FieldingPosition = 'FieldingPosition',
  Wicket = 'Wicket',
  Boundary = 'Boundary',
  Session = 'Session'
}

export enum HighlightType {
  Six = 'Six',
  Four = 'Four',
  Wicket = 'Wicket',
  Century = 'Century',
  HatTrick = 'HatTrick',
  BestBowling = 'BestBowling',
  Catch = 'Catch',
  Stumping = 'Stumping',
  RunOut = 'RunOut',
  SuperOver = 'SuperOver'
}

// Input types
export interface VideoAnalysisSessionCreateInput {
  matchId?: string;
  playerId?: string;
  videoUrl: string;
  analysisType: AnalysisType;
  metadata?: Record<string, any>;
}

export interface VideoAnalysisSessionUpdateInput {
  status?: SessionStatus;
  resultUrl?: string;
  confidenceScore?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface VideoAnalysisResultCreateInput {
  sessionId: string;
  analysisType: AnalysisType;
  metricName: string;
  metricValue: number;
  metricUnit?: string;
  confidenceScore: number;
  timestampRange?: Record<string, any>;
  insights?: string[];
  recommendations?: string[];
}

export interface VideoAnnotationCreateInput {
  sessionId: string;
  annotationType: AnnotationType;
  timestampStart: number;
  timestampEnd: number;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface VideoHighlightCreateInput {
  sessionId: string;
  highlightType: HighlightType;
  timestampStart: number;
  timestampEnd: number;
  title: string;
  description?: string;
  isFeatured?: boolean;
}

export interface VideoTagCreateInput {
  sessionId: string;
  tag: string;
  confidence: number;
}
