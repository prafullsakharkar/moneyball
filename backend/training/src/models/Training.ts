// Models for Training Service

export interface TrainingSession {
  id: string;
  teamId?: string;
  coachId?: string;
  title: string;
  description?: string;
  sessionType: SessionType;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  venueId?: string;
  status: SessionStatus;
  durationMinutes?: number;
  equipment?: Record<string, any>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingSessionPlayer {
  id: string;
  sessionId: string;
  playerId: string;
  attendanceStatus: AttendanceStatus;
  performanceNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingDrill {
  id: string;
  name: string;
  description?: string;
  drillType: DrillType;
  difficultyLevel: DifficultyLevel;
  durationMinutes: number;
  equipmentRequired: string[];
  objectives: string[];
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingSessionDrill {
  id: string;
  sessionId: string;
  drillId: string;
  orderNumber: number;
  durationMinutes: number;
  notes?: string;
  createdAt: string;
}

export interface PlayerFitness {
  id: string;
  playerId: string;
  sessionId?: string;
  date: string;
  fitnessType: FitnessType;
  value: number;
  unit: string;
  notes?: string;
  createdAt: string;
}

export interface TrainingReport {
  id: string;
  sessionId: string;
  reportType: ReportType;
  data: Record<string, any>;
  generatedAt: string;
}

// Enums
export enum SessionType {
  Practice = 'Practice',
  MatchPreparation = 'MatchPreparation',
  Recovery = 'Recovery',
  Strength = 'Strength',
  Conditioning = 'Conditioning',
  SkillDevelopment = 'SkillDevelopment',
  Tactical = 'Tactical',
  TeamBuilding = 'TeamBuilding'
}

export enum SessionStatus {
  Scheduled = 'Scheduled',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Postponed = 'Postponed'
}

export enum AttendanceStatus {
  Attended = 'Attended',
  Absent = 'Absent',
  Late = 'Late',
  Injured = 'Injured',
  Excused = 'Excused',
  NotScheduled = 'NotScheduled'
}

export enum DrillType {
  Batting = 'Batting',
  Bowling = 'Bowling',
  Fielding = 'Fielding',
  WicketKeeping = 'WicketKeeping',
  Fitness = 'Fitness',
  Tactical = 'Tactical',
  Mental = 'Mental',
  Recovery = 'Recovery'
}

export enum DifficultyLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert'
}

export enum FitnessType {
  Speed = 'Speed',
  Strength = 'Strength',
  Endurance = 'Endurance',
  Agility = 'Agility',
  Flexibility = 'Flexibility',
  Balance = 'Balance',
  Power = 'Power',
  Cardio = 'Cardio'
}

export enum ReportType {
  Attendance = 'Attendance',
  Performance = 'Performance',
  FitnessTrend = 'FitnessTrend',
  DrillEffectiveness = 'DrillEffectiveness'
}

// Input types
export interface TrainingSessionCreateInput {
  teamId?: string;
  coachId?: string;
  title: string;
  description?: string;
  sessionType: SessionType;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  venueId?: string;
  durationMinutes?: number;
  equipment?: Record<string, any>;
  notes?: string;
}

export interface TrainingSessionUpdateInput {
  title?: string;
  description?: string;
  sessionType?: SessionType;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  venueId?: string;
  status?: SessionStatus;
  durationMinutes?: number;
  equipment?: Record<string, any>;
  notes?: string;
}

export interface TrainingSessionPlayerCreateInput {
  sessionId: string;
  playerId: string;
  attendanceStatus?: AttendanceStatus;
  performanceNotes?: string;
}

export interface TrainingDrillCreateInput {
  name: string;
  description?: string;
  drillType: DrillType;
  difficultyLevel: DifficultyLevel;
  durationMinutes: number;
  equipmentRequired: string[];
  objectives: string[];
  instructions?: string;
}

export interface TrainingDrillUpdateInput {
  name?: string;
  description?: string;
  drillType?: DrillType;
  difficultyLevel?: DifficultyLevel;
  durationMinutes?: number;
  equipmentRequired?: string[];
  objectives?: string[];
  instructions?: string;
}

export interface TrainingSessionDrillCreateInput {
  sessionId: string;
  drillId: string;
  orderNumber: number;
  durationMinutes: number;
  notes?: string;
}

export interface PlayerFitnessCreateInput {
  playerId: string;
  sessionId?: string;
  date: string;
  fitnessType: FitnessType;
  value: number;
  unit: string;
  notes?: string;
}

export interface TrainingReportCreateInput {
  sessionId: string;
  reportType: ReportType;
  data: Record<string, any>;
}
