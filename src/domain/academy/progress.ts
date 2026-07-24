import { Identifiable } from '../shared';

// Progress types
export type ProgressArea = 'batting' | 'bowling' | 'fielding' | 'fitness' | 'match_awareness' | 'mental' | 'technical' | 'tactical';
export type ProgressTrend = 'up' | 'down' | 'stable';
export type AssessmentType = 'quiz' | 'practical' | 'demo' | 'physical_test';

export interface ProgressRecord extends Identifiable {
  studentId: string;
  studentName?: string;
  area: ProgressArea;
  current: number; // 0-100
  previous: number; // 0-100
  target: number; // 0-100
  trend: ProgressTrend;
  asOfDate: string;
  assessmentType?: AssessmentType;
  assessorId?: string;
  assessorName?: string;
  notes?: string;
}

export interface ProgressHistory {
  studentId: string;
  studentName?: string;
  weeks: WeeklyProgress[];
}

export interface WeeklyProgress {
  week: string; // ISO week start date
  batting: number;
  bowling: number;
  fielding: number;
  fitness: number;
  matchAwareness: number;
  totalScore: number;
  attendancePct: number;
  sessionsAttended: number;
  sessionsScheduled: number;
}

export interface SkillAssessment extends Identifiable {
  studentId: string;
  studentName?: string;
  skill: string;
  category: 'batting' | 'bowling' | 'fielding' | 'fitness';
  score: number; // 0-100
  level: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  date: string;
  assessorId?: string;
  assessorName?: string;
  notes?: string;
}

export interface AttendanceSummary {
  studentId: string;
  studentName?: string;
  period: string; // month or week
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendancePct: number;
  streak: number;
}