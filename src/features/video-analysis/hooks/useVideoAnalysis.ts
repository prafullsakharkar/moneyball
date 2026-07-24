import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { videoAnalysisApi, VideoAnalysis, analysisSegmentApi, AnalysisSegment, keyMomentApi, KeyMoment, performanceMetricApi, PerformanceMetric, tacticalPatternApi, TacticalPattern, playerMetricApi, PlayerMetric } from '../services/api';

// Video Analysis hooks
export const useVideoAnalyses = (params?: { matchId?: string; teamId?: string; playerId?: string; type?: string }) => {
  return useQuery({
    queryKey: ['video-analyses', params],
    queryFn: () => videoAnalysisApi.getVideoAnalyses(params),
  });
};

export const useVideoAnalysisById = (id: string) => {
  return useQuery({
    queryKey: ['video-analysis', id],
    queryFn: () => videoAnalysisApi.getVideoAnalysisById(id),
  });
};

export const useCreateVideoAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: videoAnalysisApi.createVideoAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-analyses'] });
    },
  });
};

export const useUpdateVideoAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VideoAnalysis> }) =>
      videoAnalysisApi.updateVideoAnalysis(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['video-analysis', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['video-analyses'] });
    },
  });
};

export const useDeleteVideoAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: videoAnalysisApi.deleteVideoAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-analyses'] });
    },
  });
};

export const useStartVideoAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: videoAnalysisApi.startAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-analyses'] });
    },
  });
};

export const useCancelVideoAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: videoAnalysisApi.cancelAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-analyses'] });
    },
  });
};

// Analysis Segment hooks
export const useAnalysisSegments = (params?: { analysisId?: string }) => {
  return useQuery({
    queryKey: ['analysis-segments', params],
    queryFn: () => analysisSegmentApi.getAnalysisSegments(params),
  });
};

export const useAnalysisSegmentById = (id: string) => {
  return useQuery({
    queryKey: ['analysis-segment', id],
    queryFn: () => analysisSegmentApi.getAnalysisSegmentById(id),
  });
};

export const useCreateAnalysisSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: analysisSegmentApi.createAnalysisSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysis-segments'] });
    },
  });
};

export const useUpdateAnalysisSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AnalysisSegment> }) =>
      analysisSegmentApi.updateAnalysisSegment(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['analysis-segment', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['analysis-segments'] });
    },
  });
};

export const useDeleteAnalysisSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: analysisSegmentApi.deleteAnalysisSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysis-segments'] });
    },
  });
};

export const useReorderAnalysisSegments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ analysisId, segmentIds }: { analysisId: string; segmentIds: string[] }) =>
      analysisSegmentApi.reorderSegments(analysisId, segmentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysis-segments'] });
    },
  });
};

// Key Moment hooks
export const useKeyMoments = (params?: { analysisId?: string }) => {
  return useQuery({
    queryKey: ['key-moments', params],
    queryFn: () => keyMomentApi.getKeyMoments(params),
  });
};

export const useKeyMomentById = (id: string) => {
  return useQuery({
    queryKey: ['key-moment', id],
    queryFn: () => keyMomentApi.getKeyMomentById(id),
  });
};

export const useCreateKeyMoment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: keyMomentApi.createKeyMoment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['key-moments'] });
    },
  });
};

export const useUpdateKeyMoment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<KeyMoment> }) =>
      keyMomentApi.updateKeyMoment(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['key-moment', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['key-moments'] });
    },
  });
};

export const useDeleteKeyMoment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: keyMomentApi.deleteKeyMoment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['key-moments'] });
    },
  });
};

// Performance Metric hooks
export const usePerformanceMetrics = (params?: { analysisId?: string; metricType?: string }) => {
  return useQuery({
    queryKey: ['performance-metrics', params],
    queryFn: () => performanceMetricApi.getPerformanceMetrics(params),
  });
};

export const usePerformanceMetricById = (id: string) => {
  return useQuery({
    queryKey: ['performance-metric', id],
    queryFn: () => performanceMetricApi.getPerformanceMetricById(id),
  });
};

export const useCreatePerformanceMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: performanceMetricApi.createPerformanceMetric,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-metrics'] });
    },
  });
};

export const useUpdatePerformanceMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PerformanceMetric> }) =>
      performanceMetricApi.updatePerformanceMetric(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['performance-metric', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['performance-metrics'] });
    },
  });
};

export const useDeletePerformanceMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: performanceMetricApi.deletePerformanceMetric,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-metrics'] });
    },
  });
};

// Tactical Pattern hooks
export const useTacticalPatterns = (params?: { analysisId?: string; patternType?: string }) => {
  return useQuery({
    queryKey: ['tactical-patterns', params],
    queryFn: () => tacticalPatternApi.getTacticalPatterns(params),
  });
};

export const useTacticalPatternById = (id: string) => {
  return useQuery({
    queryKey: ['tactical-pattern', id],
    queryFn: () => tacticalPatternApi.getTacticalPatternById(id),
  });
};

export const useCreateTacticalPattern = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tacticalPatternApi.createTacticalPattern,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tactical-patterns'] });
    },
  });
};

export const useUpdateTacticalPattern = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TacticalPattern> }) =>
      tacticalPatternApi.updateTacticalPattern(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tactical-pattern', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tactical-patterns'] });
    },
  });
};

export const useDeleteTacticalPattern = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tacticalPatternApi.deleteTacticalPattern,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tactical-patterns'] });
    },
  });
};

// Player Metric hooks
export const usePlayerMetrics = (params?: { analysisId?: string; playerId?: string; metricType?: string }) => {
  return useQuery({
    queryKey: ['player-metrics', params],
    queryFn: () => playerMetricApi.getPlayerMetrics(params),
  });
};

export const usePlayerMetricById = (id: string) => {
  return useQuery({
    queryKey: ['player-metric', id],
    queryFn: () => playerMetricApi.getPlayerMetricById(id),
  });
};

export const useCreatePlayerMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playerMetricApi.createPlayerMetric,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-metrics'] });
    },
  });
};

export const useUpdatePlayerMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PlayerMetric> }) =>
      playerMetricApi.updatePlayerMetric(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['player-metric', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['player-metrics'] });
    },
  });
};

export const useDeletePlayerMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playerMetricApi.deletePlayerMetric,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-metrics'] });
    },
  });
};