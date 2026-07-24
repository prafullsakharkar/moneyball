import { Identifiable, Timestamped, Nameable, Descriptionable } from '../shared';
import { CourseLevel } from './students';

// Course types
export type CourseCategory = 'batting' | 'bowling' | 'fielding' | 'fitness' | 'mental' | 'match_strategy' | 'wicketkeeping' | 'coaching';
export type CourseFormat = 'in_person' | 'online' | 'hybrid';
export type CourseDuration = 'short_term' | 'medium_term' | 'long_term';

export interface Course extends Identifiable, Timestamped, Nameable, Descriptionable {
  shortName: string;
  category: CourseCategory;
  level: CourseLevel;
  format: CourseFormat;
  
  // Duration
  durationWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  sessionDurationMins: number;
  
  // Pricing
  fee: number;
  currency: string;
  
  // Instructor
  instructorId: string;
  instructorName?: string;
  coInstructors: CoInstructor[];
  
  // Prerequisites
  prerequisites: string[];
  recommendedFor: string[];
  
  // Materials
  requiredEquipment: string[];
  providedMaterials: string[];
  
  // Schedule
  scheduledDays: DaySchedule[];
  scheduledTime: string; // HH:mm format
  
  // Enrollment
  maxEnrollment: number;
  currentEnrollment: number;
  enrollmentOpen: boolean;
  enrollmentOpenDate?: string;
  enrollmentCloseDate?: string;
  
  // Content
  modules: CourseModule[];
  assessments: Assessment[];
  
  // Stats
  avgRating: number;
  completedCount: number;
  activeCount: number;
}

export interface CoInstructor {
  coachId: string;
  coachName: string;
  role: 'primary' | 'co' | 'guest';
  sessionsAssigned: number;
}

export interface DaySchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isActive: boolean;
}

export interface CourseModule extends Identifiable {
  title: string;
  description: string;
  durationMins: number;
  skills: string[];
  objectives: string[];
  content: ModuleContent[];
  assignment?: ModuleAssignment;
}

export interface ModuleContent {
  type: 'video' | 'article' | 'demo' | 'practice';
  title: string;
  contentUrl?: string;
  durationMins?: number;
}

export interface ModuleAssignment {
  type: 'homework' | 'quiz' | 'project' | 'practice';
  title: string;
  description: string;
  dueDate: string;
  points: number;
}

export interface Assessment extends Identifiable {
  title: string;
  type: 'quiz' | 'practical' | 'written' | 'demo';
  description: string;
  weight: number; // percentage
  dueDate: string;
  maxScore: number;
  passingScore: number;
}