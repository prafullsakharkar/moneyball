export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type SessionType =
  | 'batting'
  | 'bowling'
  | 'fielding'
  | 'fitness'
  | 'strength'
  | 'recovery'
  | 'match_sim'
  | 'warmup';

export type SessionIntensity = 'low' | 'medium' | 'high';

export interface PracticeSession {
  id: string;
  title: string;
  type: SessionType;
  date: string; // ISO
  startTime: string; // "07:00"
  endTime: string; // "09:00"
  coach: string;
  ground: string;
  players: string[];
  equipment: string[];
  notes: string;
  intensity: SessionIntensity;
  attendance: number; // % attended
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface FitnessMetrics {
  playerId: string;
  bmi: number;
  weight: number; // kg
  height: number; // cm
  sprint: number; // seconds (100m)
  endurance: number; // beep test level
  agility: number; // seconds (T-test)
  reactionTime: number; // ms
  sleep: number; // hours avg
  hydration: number; // liters
  fitnessScore: number; // 0-100
}

export interface FitnessTrend {
  week: string;
  fitnessScore: number;
  sprint: number;
  endurance: number;
  agility: number;
  strength: number;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  playerId: string;
  playerName: string;
  playerInitials: string;
  status: AttendanceStatus;
  date: string;
  checkInTime?: string;
  notes?: string;
}

export interface PerformanceKPI {
  category: 'batting' | 'bowling' | 'fielding' | 'fitness';
  label: string;
  current: number;
  previous: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface TrainingDashboardMetrics {
  todaySessions: number;
  attendancePct: number;
  avgFitnessScore: number;
  upcomingPractices: number;
  pendingReports: number;
  totalPlayers: number;
  totalCoaches: number;
  weeklyTrainingHours: number;
}

export interface Player {
  id: string;
  name: string;
  initials: string;
  team: string;
  role: string;
  age: number;
  photoUrl: string;
}
