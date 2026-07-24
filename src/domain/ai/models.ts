import { Identifiable, Timestamped } from '../shared';

// Model types
export type ModelType = 'predictive' | 'classification' | 'regression' | 'recommendation' | 'image_analysis' | 'nlp';
export type ModelStatus = 'training' | 'ready' | 'deployed' | 'deprecated' | 'error';

export interface AIModel extends Identifiable, Timestamped {
  name: string;
  modelType: ModelType;
  status: ModelStatus;
  
  // Versioning
  version: string;
  trainedAt: string;
  lastUpdated: string;
  
  // Configuration
  parameters: Record<string, unknown>;
  features: string[];
  hyperparameters?: Record<string, unknown>;
  
  // Performance
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  auc?: number;
  
  // Data
  trainingDataset?: string;
  trainingSamples?: number;
  validationDataset?: string;
  
  // Usage
  active: boolean;
  usageCount: number;
  avgInferenceTimeMs?: number;
  
  // Deployment
  environment: 'dev' | 'staging' | 'production';
  endpointUrl?: string;
}

export interface ModelPerformance {
  modelId: string;
  modelVersion: string;
  period: string;
  
  // Metrics
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;
  
  // By category
  byCategory?: Record<string, CategoryMetrics>;
  byDate?: Record<string, DailyMetrics>;
}

export interface CategoryMetrics {
  total: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  avgConfidence: number;
}

export interface DailyMetrics {
  date: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface ModelFeature {
  name: string;
  type: 'numeric' | 'categorical' | 'boolean' | 'text';
  importance?: number;
  description: string;
}