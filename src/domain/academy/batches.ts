import { Identifiable, Timestamped, Nameable, Descriptionable } from '../shared';
import { CourseLevel } from './students';

// Batch types
export type BatchStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type BatchType = 'group' | 'private' | 'semi_private' | 'masterclass';
export type BatchScheduleType = 'fixed' | 'flexible' | 'self_paced';

export interface Batch extends Identifiable, Timestamped, Nameable, Descriptionable {
  shortName: string;
  status: BatchStatus;
  type: BatchType;
  level: CourseLevel;
  
  // Schedule
  scheduleType: BatchScheduleType;
  scheduledDays: DaySchedule[];
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  
  // Dates
  startDate: string;
  endDate: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  
  // Location
  venueId: string;
  venueName?: string;
  
  // Staff
  coachId: string;
  coachName?: string;
  assistantCoaches: AssistantCoach[];
  
  // Capacity
  maxCapacity: number;
  currentEnrollment: number;
  waitlistCount: number;
  
  // Pricing
  fee: number;
  feeStructure: FeeStructure;
  
  // Curriculum
  curriculumId?: string;
  curriculumName?: string;
  
  // Stats
  avgAttendance: number;
  avgProgress: number;
  completionRate: number;
  
  // Settings
  isActive: boolean;
  allowSelfEnrollment: boolean;
  enrollmentOpenDate?: string;
  enrollmentCloseDate?: string;
}

export interface DaySchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isActive: boolean;
}

export interface AssistantCoach {
  coachId: string;
  coachName: string;
  role: 'head_coach' | 'assistant' | 'specialist';
  hoursPerWeek: number;
}

export interface FeeStructure {
  totalFee: number;
  installments: Installment[];
  discount?: Discount;
}

export interface Installment {
  number: number;
  amount: number;
  dueDate: string;
  paid: boolean;
  paidDate?: string;
}

export interface Discount {
  type: 'early_bird' | 'siblings' | 'merit' | 'need_based' | 'corporate';
  percentage: number;
  amount?: number;
  code?: string;
}