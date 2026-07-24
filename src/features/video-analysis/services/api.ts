import { apiService, ApiResponse } from '../../../shared/services/api';

// Video Analysis types
export interface VideoAnalysis {
  id: string;
  name: string;
  description: string;
  videoId: string;
  videoUrl: string;
  matchId: string;
  teamId: string;
  playerId: string;
  analysisType: 'tactical' | 'technical' | 'physical' | 'psychological' | 'opponent' | 'self';
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  duration: number; // in seconds
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisSegment {
  id: string;
  analysisId: string;
  startTime: number;
  endTime: number;
  description: string;
  tags: string[];
  labels: {
    [key: string]: string | number | boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface KeyMoment {
  id: string;
  analysisId: string;
  momentType: 'goal' | 'foul' | 'card' | 'substitution' | 'corner' | 'freekick' | 'penalty' | 'save' | 'assist' | 'other';
  timestamp: number;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceMetric {
  id: string;
  analysisId: string;
  metricType: string; // e.g., 'distance', 'speed', 'heartRate', 'touches', 'passes'
  values: {
    timestamp: number;
    value: number;
  }[];
  average: number;
  max: number;
  min: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface TacticalPattern {
  id: string;
  analysisId: string;
  patternType: string; // e.g., 'possession', 'counter-attack', 'set-piece', 'pressing'
  description: string;
  frequency: number;
  successRate: number;
  effectiveness: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}

export interface PlayerMetric {
  id: string;
  analysisId: string;
  playerId: string;
  metricType: string;
  value: number;
  unit: string;
  percentiles: {
    [key: string]: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Video Analysis API
export const videoAnalysisApi = {
  getVideoAnalyses: async (params?: { matchId?: string; teamId?: string; playerId?: string; type?: string }) => {
    const response = await apiService.get<VideoAnalysis[]>('/video-analyses', { params });
    return extractData(response);
  },

  getVideoAnalysisById: async (id: string) => {
    const response = await apiService.get<VideoAnalysis>(`/video-analyses/${id}`);
    return extractData(response);
  },

  createVideoAnalysis: async (analysis: Omit<VideoAnalysis, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<VideoAnalysis>('/video-analyses', { body: analysis });
    return extractData(response);
  },

  updateVideoAnalysis: async (id: string, analysis: Partial<VideoAnalysis>) => {
    const response = await apiService.put<VideoAnalysis>(`/video-analyses/${id}`, { body: analysis });
    return extractData(response);
  },

  deleteVideoAnalysis: async (id: string) => {
    const response = await apiService.delete(`/video-analyses/${id}`);
    return extractData(response);
  },

  startAnalysis: async (id: string) => {
    const response = await apiService.post<{ success: boolean }>(`/video-analyses/${id}/start-analysis`, {});
    return extractData(response);
  },

  cancelAnalysis: async (id: string) => {
    const response = await apiService.post<{ success: boolean }>(`/video-analyses/${id}/cancel-analysis`, {});
    return extractData(response);
  },
};

// Analysis Segment API
export const analysisSegmentApi = {
  getAnalysisSegments: async (params?: { analysisId?: string }) => {
    const response = await apiService.get<AnalysisSegment[]>('/analysis-segments', { params });
    return extractData(response);
  },

  getAnalysisSegmentById: async (id: string) => {
    const response = await apiService.get<AnalysisSegment>(`/analysis-segments/${id}`);
    return extractData(response);
  },

  createAnalysisSegment: async (segment: Omit<AnalysisSegment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<AnalysisSegment>('/analysis-segments', { body: segment });
    return extractData(response);
  },

  updateAnalysisSegment: async (id: string, segment: Partial<AnalysisSegment>) => {
    const response = await apiService.put<AnalysisSegment>(`/analysis-segments/${id}`, { body: segment });
    return extractData(response);
  },

  deleteAnalysisSegment: async (id: string) => {
    const response = await apiService.delete(`/analysis-segments/${id}`);
    return extractData(response);
  },

  reorderSegments: async (analysisId: string, segmentIds: string[]) => {
    const response = await apiService.post<AnalysisSegment[]>(`/video-analyses/${analysisId}/reorder-segments`, {
      body: { segmentIds },
    });
    return extractData(response);
  },
};

// Key Moment API
export const keyMomentApi = {
  getKeyMoments: async (params?: { analysisId?: string }) => {
    const response = await apiService.get<KeyMoment[]>('/key-moments', { params });
    return extractData(response);
  },

  getKeyMomentById: async (id: string) => {
    const response = await apiService.get<KeyMoment>(`/key-moments/${id}`);
    return extractData(response);
  },

  createKeyMoment: async (moment: Omit<KeyMoment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<KeyMoment>('/key-moments', { body: moment });
    return extractData(response);
  },

  updateKeyMoment: async (id: string, moment: Partial<KeyMoment>) => {
    const response = await apiService.put<KeyMoment>(`/key-moments/${id}`, { body: moment });
    return extractData(response);
  },

  deleteKeyMoment: async (id: string) => {
    const response = await apiService.delete(`/key-moments/${id}`);
    return extractData(response);
  },
};

// Performance Metric API
export const performanceMetricApi = {
  getPerformanceMetrics: async (params?: { analysisId?: string; metricType?: string }) => {
    const response = await apiService.get<PerformanceMetric[]>('/performance-metrics', { params });
    return extractData(response);
  },

  getPerformanceMetricById: async (id: string) => {
    const response = await apiService.get<PerformanceMetric>(`/performance-metrics/${id}`);
    return extractData(response);
  },

  createPerformanceMetric: async (metric: Omit<PerformanceMetric, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<PerformanceMetric>('/performance-metrics', { body: metric });
    return extractData(response);
  },

  updatePerformanceMetric: async (id: string, metric: Partial<PerformanceMetric>) => {
    const response = await apiService.put<PerformanceMetric>(`/performance-metrics/${id}`, { body: metric });
    return extractData(response);
  },

  deletePerformanceMetric: async (id: string) => {
    const response = await apiService.delete(`/performance-metrics/${id}`);
    return extractData(response);
  },
};

// Tactical Pattern API
export const tacticalPatternApi = {
  getTacticalPatterns: async (params?: { analysisId?: string; patternType?: string }) => {
    const response = await apiService.get<TacticalPattern[]>('/tactical-patterns', { params });
    return extractData(response);
  },

  getTacticalPatternById: async (id: string) => {
    const response = await apiService.get<TacticalPattern>(`/tactical-patterns/${id}`);
    return extractData(response);
  },

  createTacticalPattern: async (pattern: Omit<TacticalPattern, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<TacticalPattern>('/tactical-patterns', { body: pattern });
    return extractData(response);
  },

  updateTacticalPattern: async (id: string, pattern: Partial<TacticalPattern>) => {
    const response = await apiService.put<TacticalPattern>(`/tactical-patterns/${id}`, { body: pattern });
    return extractData(response);
  },

  deleteTacticalPattern: async (id: string) => {
    const response = await apiService.delete(`/tactical-patterns/${id}`);
    return extractData(response);
  },
};

// Player Metric API
export const playerMetricApi = {
  getPlayerMetrics: async (params?: { analysisId?: string; playerId?: string; metricType?: string }) => {
    const response = await apiService.get<PlayerMetric[]>('/player-metrics', { params });
    return extractData(response);
  },

  getPlayerMetricById: async (id: string) => {
    const response = await apiService.get<PlayerMetric>(`/player-metrics/${id}`);
    return extractData(response);
  },

  createPlayerMetric: async (metric: Omit<PlayerMetric, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<PlayerMetric>('/player-metrics', { body: metric });
    return extractData(response);
  },

  updatePlayerMetric: async (id: string, metric: Partial<PlayerMetric>) => {
    const response = await apiService.put<PlayerMetric>(`/player-metrics/${id}`, { body: metric });
    return extractData(response);
  },

  deletePlayerMetric: async (id: string) => {
    const response = await apiService.delete(`/player-metrics/${id}`);
    return extractData(response);
  },
};

// Helper to extract data from response
const extractData = <T>(response: ApiResponse<T> | { error: any }): T => {
  if ('error' in response) {
    throw response.error;
  }
  return response.data;
};