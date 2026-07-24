import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingSessionApi, TrainingSession, trainingActivityApi, TrainingActivity, playerPerformanceApi, PlayerPerformance, coachReportApi, CoachReport, equipmentUsageApi, EquipmentUsage } from '../services/api';

// Training Session hooks
export const useTrainingSessions = (params?: { academyId?: string; batchId?: string; coachId?: string; date?: string }) => {
  return useQuery({
    queryKey: ['training-sessions', params],
    queryFn: () => trainingSessionApi.getTrainingSessions(params),
  });
};

export const useTrainingSessionById = (id: string) => {
  return useQuery({
    queryKey: ['training-session', id],
    queryFn: () => trainingSessionApi.getTrainingSessionById(id),
  });
};

export const useCreateTrainingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trainingSessionApi.createTrainingSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-sessions'] });
    },
  });
};

export const useUpdateTrainingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TrainingSession> }) =>
      trainingSessionApi.updateTrainingSession(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['training-session', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['training-sessions'] });
    },
  });
};

export const useDeleteTrainingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trainingSessionApi.deleteTrainingSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-sessions'] });
    },
  });
};

export const useStartTrainingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trainingSessionApi.startSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-sessions'] });
    },
  });
};

export const useCompleteTrainingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trainingSessionApi.completeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-sessions'] });
    },
  });
};

export const useCancelTrainingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      trainingSessionApi.cancelSession(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-sessions'] });
    },
  });
};

// Training Activity hooks
export const useTrainingActivities = (params?: { sessionId?: string }) => {
  return useQuery({
    queryKey: ['training-activities', params],
    queryFn: () => trainingActivityApi.getTrainingActivities(params),
  });
};

export const useTrainingActivityById = (id: string) => {
  return useQuery({
    queryKey: ['training-activity', id],
    queryFn: () => trainingActivityApi.getTrainingActivityById(id),
  });
};

export const useCreateTrainingActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trainingActivityApi.createTrainingActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-activities'] });
    },
  });
};

export const useUpdateTrainingActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TrainingActivity> }) =>
      trainingActivityApi.updateTrainingActivity(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['training-activity', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['training-activities'] });
    },
  });
};

export const useDeleteTrainingActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trainingActivityApi.deleteTrainingActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-activities'] });
    },
  });
};

export const useReorderTrainingActivities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, activityIds }: { sessionId: string; activityIds: string[] }) =>
      trainingActivityApi.reorderActivities(sessionId, activityIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-activities'] });
    },
  });
};

// Player Performance hooks
export const usePlayerPerformances = (params?: { sessionId?: string; playerId?: string }) => {
  return useQuery({
    queryKey: ['player-performances', params],
    queryFn: () => playerPerformanceApi.getPlayerPerformances(params),
  });
};

export const usePlayerPerformanceById = (id: string) => {
  return useQuery({
    queryKey: ['player-performance', id],
    queryFn: () => playerPerformanceApi.getPlayerPerformanceById(id),
  });
};

export const useCreatePlayerPerformance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playerPerformanceApi.createPlayerPerformance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-performances'] });
    },
  });
};

export const useUpdatePlayerPerformance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PlayerPerformance> }) =>
      playerPerformanceApi.updatePlayerPerformance(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['player-performance', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['player-performances'] });
    },
  });
};

export const useDeletePlayerPerformance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playerPerformanceApi.deletePlayerPerformance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-performances'] });
    },
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { sessionId: string; playerId: string; attendance: PlayerPerformance['attendance'] }) =>
      playerPerformanceApi.markAttendance(params.sessionId, params.playerId, params.attendance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-performances'] });
    },
  });
};

// Coach Report hooks
export const useCoachReports = (params?: { sessionId?: string; coachId?: string }) => {
  return useQuery({
    queryKey: ['coach-reports', params],
    queryFn: () => coachReportApi.getCoachReports(params),
  });
};

export const useCoachReportById = (id: string) => {
  return useQuery({
    queryKey: ['coach-report', id],
    queryFn: () => coachReportApi.getCoachReportById(id),
  });
};

export const useCreateCoachReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coachReportApi.createCoachReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-reports'] });
    },
  });
};

export const useUpdateCoachReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CoachReport> }) =>
      coachReportApi.updateCoachReport(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coach-report', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['coach-reports'] });
    },
  });
};

export const useDeleteCoachReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coachReportApi.deleteCoachReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-reports'] });
    },
  });
};

// Equipment Usage hooks
export const useEquipmentUsages = (params?: { sessionId?: string }) => {
  return useQuery({
    queryKey: ['equipment-usages', params],
    queryFn: () => equipmentUsageApi.getEquipmentUsages(params),
  });
};

export const useEquipmentUsageById = (id: string) => {
  return useQuery({
    queryKey: ['equipment-usage', id],
    queryFn: () => equipmentUsageApi.getEquipmentUsageById(id),
  });
};

export const useCreateEquipmentUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: equipmentUsageApi.createEquipmentUsage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-usages'] });
    },
  });
};

export const useUpdateEquipmentUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EquipmentUsage> }) =>
      equipmentUsageApi.updateEquipmentUsage(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equipment-usage', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['equipment-usages'] });
    },
  });
};

export const useDeleteEquipmentUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: equipmentUsageApi.deleteEquipmentUsage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-usages'] });
    },
  });
};