import { Identifiable, Timestamped, Nameable, Descriptionable } from '../shared';
import { CourseCategory } from './courses';
import { CourseLevel } from './students';

// Coach types
export type CoachStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';
export type CoachType = 'head_coach' | 'assistant_coach' | 'specialist_coach' | 'guest_coach' | 'mentor';

export interface Coach extends Identifiable, Timestamped, Nameable, Descriptionable {
  photoUrl?: string;
  status: CoachStatus;
  coachType: CoachType;
  email: string;
  phone: string;
  
  // Specialization
  specializations: CourseCategory[];
  expertise: string[];
  certifications: Certification[];
  
  // Experience
  experienceYears: number;
  previousTeams: PreviousTeam[];
  coachingPhilosophy?: string;
  
  // Stats
  rating: number;
  totalStudents: number;
  totalBatches: number;
  successRate: number;
  
  // Availability
  maxStudents: number;
  currentStudents: number;
  availableDays: DayAvailability[];
  maxHoursPerWeek: number;
  
  // Contact
  address?: string;
  timezone: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  expiryDate?: string;
  certificateUrl?: string;
}

export interface PreviousTeam {
  teamId: string;
  teamName: string;
  role: string;
  startDate: string;
  endDate?: string;
  achievements: string[];
}

export interface DayAvailability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
  sessionsPerDay?: number;
}