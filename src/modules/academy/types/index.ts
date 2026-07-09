export type StudentStatus = 'active' | 'graduated' | 'on_leave' | 'dropped';

export type BatchStatus = 'upcoming' | 'ongoing' | 'completed';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export type CourseCategory = 'batting' | 'bowling' | 'fielding' | 'fitness' | 'mental' | 'match_strategy';

export type EnrollmentStatus = 'enrolled' | 'completed' | 'in_progress' | 'waitlist';

export type ProgressArea = 'batting' | 'bowling' | 'fielding' | 'fitness' | 'match_awareness';

export interface Student {
  id: string;
  name: string;
  initials: string;
  age: number;
  gender: 'male' | 'female';
  photoUrl: string;
  email: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  batchId: string;
  status: StudentStatus;
  enrollmentDate: string;
  level: CourseLevel;
  overallProgress: number;
  attendancePct: number;
  coachId: string;
}

export interface Coach {
  id: string;
  name: string;
  initials: string;
  photoUrl: string;
  specialization: CourseCategory[];
  experienceYears: number;
  rating: number;
  assignedBatches: string[];
  bio: string;
}

export interface Batch {
  id: string;
  name: string;
  level: CourseLevel;
  coachId: string;
  startDate: string;
  endDate: string;
  schedule: string;
  capacity: number;
  enrolledCount: number;
  status: BatchStatus;
  venue: string;
  description: string;
}

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  durationWeeks: number;
  sessionsPerWeek: number;
  description: string;
  modules: CourseModule[];
  instructorId: string;
  enrolledCount: number;
  rating: number;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  durationMins: number;
  skills: string[];
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number;
  enrolledDate: string;
  completedDate?: string;
  grade?: string;
}

export interface ProgressRecord {
  studentId: string;
  area: ProgressArea;
  current: number;
  previous: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ProgressHistory {
  week: string;
  batting: number;
  bowling: number;
  fielding: number;
  fitness: number;
  matchAwareness: number;
}

export interface AcademyDashboardMetrics {
  totalStudents: number;
  activeBatches: number;
  totalCoaches: number;
  totalCourses: number;
  avgAttendance: number;
  avgProgress: number;
  graduationRate: number;
  newEnrollmentsThisMonth: number;
}
