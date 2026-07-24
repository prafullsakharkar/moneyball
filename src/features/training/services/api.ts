import { apiService, ApiResponse } from '../../../shared/services/api';

// Training types
export interface TrainingSession {
  id: string;
  name: string;
  description: string;
  academyId: string;
  batchId: string;
  coachId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  intensity: 'low' | 'medium' | 'high';
  focus: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingActivity {
  id: string;
  sessionId: string;
  name: string;
  description: string;
  duration: number; // in minutes
  order: number;
  equipment: string[];
  intensity: 'low' | 'medium' | 'high';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerPerformance {
  id: string;
  sessionId: string;
  playerId: string;
  attendance: 'present' | 'absent' | 'late' | 'early';
  performanceScore: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoachReport {
  id: string;
  sessionId: string;
  coachId: string;
  summary: string;
  observations: {
    strength: string[];
    improvement: string[];
  };
  recommendations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentUsage {
  id: string;
  sessionId: string;
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  condition: 'good' | 'fair' | 'poor';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Training Session API
export const trainingSessionApi = {
  getTrainingSessions: async (params?: { academyId?: string; batchId?: string; coachId?: string; date?: string }) => {
    const response = await apiService.get<TrainingSession[]>('/training-sessions', { params });
    return extractData(response);
  },

  getTrainingSessionById: async (id: string) => {
    const response = await apiService.get<TrainingSession>(`/training-sessions/${id}`);
    return extractData(response);
  },

  createTrainingSession: async (session: Omit<TrainingSession, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<TrainingSession>('/training-sessions', { body: session });
    return extractData(response);
  },

  updateTrainingSession: async (id: string, session: Partial<TrainingSession>) => {
    const response = await apiService.put<TrainingSession>(`/training-sessions/${id}`, { body: session });
    return extractData(response);
  },

  deleteTrainingSession: async (id: string) => {
    const response = await apiService.delete(`/training-sessions/${id}`);
    return extractData(response);
  },

  startSession: async (id: string) => {
    const response = await apiService.post<{ success: boolean }>(`/training-sessions/${id}/start`, {});
    return extractData(response);
  },

  completeSession: async (id: string) => {
    const response = await apiService.post<{ success: boolean }>(`/training-sessions/${id}/complete`, {});
    return extractData(response);
  },

  cancelSession: async (id: string, reason: string) => {
    const response = await apiService.post<{ success: boolean }>(`/training-sessions/${id}/cancel`, {
      body: { reason },
    });
    return extractData(response);
  },
};

// Training Activity API
export const trainingActivityApi = {
  getTrainingActivities: async (params?: { sessionId?: string }) => {
    const response = await apiService.get<TrainingActivity[]>('/training-activities', { params });
    return extractData(response);
  },

  getTrainingActivityById: async (id: string) => {
    const response = await apiService.get<TrainingActivity>(`/training-activities/${id}`);
    return extractData(response);
  },

  createTrainingActivity: async (activity: Omit<TrainingActivity, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<TrainingActivity>('/training-activities', { body: activity });
    return extractData(response);
  },

  updateTrainingActivity: async (id: string, activity: Partial<TrainingActivity>) => {
    const response = await apiService.put<TrainingActivity>(`/training-activities/${id}`, { body: activity });
    return extractData(response);
  },

  deleteTrainingActivity: async (id: string) => {
    const response = await apiService.delete(`/training-activities/${id}`);
    return extractData(response);
  },

  reorderActivities: async (sessionId: string, activityIds: string[]) => {
    const response = await apiService.post<TrainingActivity[]>(`/training-sessions/${sessionId}/reorder`, {
      body: { activityIds },
    });
    return extractData(response);
  },
};

// Player Performance API
export const playerPerformanceApi = {
  getPlayerPerformances: async (params?: { sessionId?: string; playerId?: string }) => {
    const response = await apiService.get<PlayerPerformance[]>('/player-performances', { params });
    return extractData(response);
  },

  getPlayerPerformanceById: async (id: string) => {
    const response = await apiService.get<PlayerPerformance>(`/player-performances/${id}`);
    return extractData(response);
  },

  createPlayerPerformance: async (performance: Omit<PlayerPerformance, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<PlayerPerformance>('/player-performances', { body: performance });
    return extractData(response);
  },

  updatePlayerPerformance: async (id: string, performance: Partial<PlayerPerformance>) => {
    const response = await apiService.put<PlayerPerformance>(`/player-performances/${id}`, { body: performance });
    return extractData(response);
  },

  deletePlayerPerformance: async (id: string) => {
    const response = await apiService.delete(`/player-performances/${id}`);
    return extractData(response);
  },

  markAttendance: async (sessionId: string, playerId: string, attendance: PlayerPerformance['attendance']) => {
    const response = await apiService.post<PlayerPerformance>('/player-performances/mark-attendance', {
      body: { sessionId, playerId, attendance },
    });
    return extractData(response);
  },
};

// Coach Report API
export const coachReportApi = {
  getCoachReports: async (params?: { sessionId?: string; coachId?: string }) => {
    const response = await apiService.get<CoachReport[]>('/coach-reports', { params });
    return extractData(response);
  },

  getCoachReportById: async (id: string) => {
    const response = await apiService.get<CoachReport>(`/coach-reports/${id}`);
    return extractData(response);
  },

  createCoachReport: async (report: Omit<CoachReport, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<CoachReport>('/coach-reports', { body: report });
    return extractData(response);
  },

  updateCoachReport: async (id: string, report: Partial<CoachReport>) => {
    const response = await apiService.put<CoachReport>(`/coach-reports/${id}`, { body: report });
    return extractData(response);
  },

  deleteCoachReport: async (id: string) => {
    const response = await apiService.delete(`/coach-reports/${id}`);
    return extractData(response);
  },
};

// Equipment Usage API
export const equipmentUsageApi = {
  getEquipmentUsages: async (params?: { sessionId?: string }) => {
    const response = await apiService.get<EquipmentUsage[]>('/equipment-usages', { params });
    return extractData(response);
  },

  getEquipmentUsageById: async (id: string) => {
    const response = await apiService.get<EquipmentUsage>(`/equipment-usages/${id}`);
    return extractData(response);
  },

  createEquipmentUsage: async (usage: Omit<EquipmentUsage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiService.post<EquipmentUsage>('/equipment-usages', { body: usage });
    return extractData(response);
  },

  updateEquipmentUsage: async (id: string, usage: Partial<EquipmentUsage>) => {
    const response = await apiService.put<EquipmentUsage>(`/equipment-usages/${id}`, { body: usage });
    return extractData(response);
  },

  deleteEquipmentUsage: async (id: string) => {
    const response = await apiService.delete(`/equipment-usages/${id}`);
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