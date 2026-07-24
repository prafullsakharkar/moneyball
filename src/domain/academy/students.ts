import { Identifiable, Timestamped, Nameable } from '../shared';

// Student types
export type StudentStatus = 'active' | 'graduated' | 'on_leave' | 'dropped' | 'suspended';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';
export type EnrollmentStatus = 'enrolled' | 'completed' | 'in_progress' | 'waitlist';

export interface Student extends Identifiable, Timestamped, Nameable {
  photoUrl?: string;
  status: StudentStatus;
  dateOfBirth: string;
  age: number;
  gender: 'male' | 'female';
  email: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  address?: string;
  medicalInfo?: MedicalInfo;
  
  // Academic
  currentBatchId?: string;
  currentBatchName?: string;
  enrolledCourses: EnrolledCourse[];
  level: CourseLevel;
  overallProgress: number;
  attendancePct: number;
  
  // Performance
  battingScore?: number;
  bowlingScore?: number;
  fieldingScore?: number;
  fitnessScore?: number;
  totalScore?: number;
  
  // Coach
  coachId?: string;
  coachName?: string;
  
  // Enrollment
  enrollmentDate: string;
  expectedGraduation?: string;
  graduationDate?: string;
  notes?: string;
}

export interface EnrolledCourse extends Identifiable {
  courseId: string;
  courseName: string;
  status: EnrollmentStatus;
  progress: number;
  enrolledDate: string;
  completedDate?: string;
  grade?: string;
  rating?: number;
}

export interface MedicalInfo {
  bloodType: string;
  allergies?: string[];
  conditions?: string[];
  medications?: string[];
  emergencyContact: EmergencyContact;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}