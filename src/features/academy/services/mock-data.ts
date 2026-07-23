import type {
  Student,
  Coach,
  Batch,
  Course,
  Enrollment,
  ProgressRecord,
  ProgressHistory,
  AcademyDashboardMetrics,
  StudentStatus,
  BatchStatus,
  CourseLevel,
  CourseCategory,
} from '../types';

const PHOTO = (seed: string) => `https://picsum.photos/seed/${seed}/80/80`;

// ─── Coaches ──────────────────────────────────────────────────────────────────
export const academyCoaches: Coach[] = [
  {
    id: 'coach-1',
    name: 'Rahul Dravid',
    initials: 'RD',
    photoUrl: PHOTO('acad-coach1'),
    specialization: ['batting', 'mental', 'match_strategy'],
    experienceYears: 18,
    rating: 4.9,
    assignedBatches: ['batch-1', 'batch-3'],
    bio: 'Former international cricketer specializing in batting technique and mental conditioning.',
  },
  {
    id: 'coach-2',
    name: 'Anil Kumble',
    initials: 'AK',
    photoUrl: PHOTO('acad-coach2'),
    specialization: ['bowling', 'match_strategy'],
    experienceYears: 15,
    rating: 4.8,
    assignedBatches: ['batch-2'],
    bio: 'Legendary spinner with expertise in bowling mechanics and match tactics.',
  },
  {
    id: 'coach-3',
    name: 'Jonty Rhodes',
    initials: 'JR',
    photoUrl: PHOTO('acad-coach3'),
    specialization: ['fielding', 'fitness'],
    experienceYears: 12,
    rating: 4.7,
    assignedBatches: ['batch-1', 'batch-4'],
    bio: 'World-class fielding coach known for agility training and fielding drills.',
  },
  {
    id: 'coach-4',
    name: 'Trevor Penney',
    initials: 'TP',
    photoUrl: PHOTO('acad-coach4'),
    specialization: ['batting', 'fielding'],
    experienceYears: 10,
    rating: 4.6,
    assignedBatches: ['batch-2', 'batch-3'],
    bio: 'All-round coaching specialist with focus on youth development.',
  },
];

// ─── Batches ──────────────────────────────────────────────────────────────────
export const academyBatches: Batch[] = [
  {
    id: 'batch-1',
    name: 'Foundation Batch A',
    level: 'beginner',
    coachId: 'coach-1',
    startDate: '2025-06-01',
    endDate: '2025-12-15',
    schedule: 'Mon, Wed, Fri — 6:00 AM to 8:00 AM',
    capacity: 20,
    enrolledCount: 18,
    status: 'ongoing',
    venue: 'Main Academy Ground',
    description: 'Fundamentals of cricket for ages 8-12. Focus on basic batting stance, grip, and bowling action.',
  },
  {
    id: 'batch-2',
    name: 'Intermediate Batch B',
    level: 'intermediate',
    coachId: 'coach-2',
    startDate: '2025-05-15',
    endDate: '2025-11-30',
    schedule: 'Tue, Thu, Sat — 7:00 AM to 9:00 AM',
    capacity: 18,
    enrolledCount: 16,
    status: 'ongoing',
    venue: 'Practice Net 1 & 2',
    description: 'Intermediate skills development for ages 13-16. Advanced bowling variations and batting techniques.',
  },
  {
    id: 'batch-3',
    name: 'Elite Performance Batch',
    level: 'elite',
    coachId: 'coach-1',
    startDate: '2025-07-01',
    endDate: '2026-03-31',
    schedule: 'Mon-Fri — 5:30 AM to 8:30 AM',
    capacity: 15,
    enrolledCount: 12,
    status: 'ongoing',
    venue: 'Main Ground + Gym',
    description: 'High-performance training for competitive cricketers. Match simulation and mental conditioning.',
  },
  {
    id: 'batch-4',
    name: 'Summer Camp 2025',
    level: 'beginner',
    coachId: 'coach-3',
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    schedule: 'Daily — 8:00 AM to 11:00 AM',
    capacity: 30,
    enrolledCount: 28,
    status: 'ongoing',
    venue: 'Indoor Facility + Ground',
    description: 'Intensive summer camp covering all cricket basics with fun activities for ages 8-14.',
  },
  {
    id: 'batch-5',
    name: 'Advanced Winter Batch',
    level: 'advanced',
    coachId: 'coach-4',
    startDate: '2025-12-01',
    endDate: '2026-02-28',
    schedule: 'Mon, Wed, Fri — 6:00 AM to 8:00 AM',
    capacity: 16,
    enrolledCount: 0,
    status: 'upcoming',
    venue: 'Main Academy Ground',
    description: 'Advanced winter training focusing on power hitting, death bowling, and match scenarios.',
  },
  {
    id: 'batch-6',
    name: 'Spring Foundation 2025',
    level: 'beginner',
    coachId: 'coach-3',
    startDate: '2025-02-01',
    endDate: '2025-05-31',
    schedule: 'Tue, Thu — 6:00 AM to 8:00 AM',
    capacity: 20,
    enrolledCount: 20,
    status: 'completed',
    venue: 'Main Academy Ground',
    description: 'Spring foundation batch completed. 15 students graduated to intermediate level.',
  },
];

// ─── Students ─────────────────────────────────────────────────────────────────
const studentNames = [
  'Aarav Sharma', 'Vihaan Patel', 'Aditya Reddy', 'Arjun Nair', 'Reyansh Gupta',
  'Krishna Iyer', 'Sai Verma', 'Kabir Singh', 'Dhruv Joshi', 'Rohan Mehta',
  'Ayaan Khan', 'Ishaan Das', 'Vivaan Rao', 'Atharv Pillai', 'Arnav Bose',
  'Parth Saxena', 'Laksh Yadav', 'Nakul Malhotra', 'Aryan Chopra', 'Dev Agarwal',
  'Kiara Reddy', 'Ananya Rao', 'Diya Patel', 'Saanvi Iyer',
];

const statuses: StudentStatus[] = ['active', 'active', 'active', 'active', 'active', 'active', 'active', 'graduated', 'on_leave', 'dropped'];
const levels: CourseLevel[] = ['beginner', 'intermediate', 'advanced', 'elite'];

export const academyStudents: Student[] = studentNames.map((name, i) => {
  const initials = name.split(' ').map(n => n[0]).join('');
  const batchId = `batch-${(i % 4) + 1}`;
  const status = i < 20 ? 'active' : statuses[i % statuses.length];
  return {
    id: `stu-${i + 1}`,
    name,
    initials,
    age: 8 + (i % 12),
    gender: i >= 20 ? 'female' : 'male',
    photoUrl: PHOTO(`acad-stu${i}`),
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@academy.edu`,
    phone: `+91 98${String(10000000 + i * 137).slice(0, 8)}`,
    guardianName: `Parent of ${initials}`,
    guardianPhone: `+91 99${String(20000000 + i * 211).slice(0, 8)}`,
    batchId,
    status,
    enrollmentDate: new Date(2025, (i % 12), (i % 28) + 1).toISOString(),
    level: levels[i % levels.length],
    overallProgress: Math.floor(40 + (i * 7) % 55),
    attendancePct: Math.floor(70 + (i * 3) % 28),
    coachId: academyBatches.find(b => b.id === batchId)?.coachId || 'coach-1',
  };
});

// ─── Courses ──────────────────────────────────────────────────────────────────
export const academyCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Batting Fundamentals',
    category: 'batting',
    level: 'beginner',
    durationWeeks: 8,
    sessionsPerWeek: 3,
    description: 'Master the basics of batting: grip, stance, backlift, and shot selection.',
    instructorId: 'coach-1',
    enrolledCount: 24,
    rating: 4.8,
    modules: [
      { id: 'mod-1-1', title: 'Grip & Stance', description: 'Proper bat grip and batting stance fundamentals.', durationMins: 90, skills: ['Grip', 'Stance', 'Balance'] },
      { id: 'mod-1-2', title: 'Backlift & Footwork', description: 'Developing correct backlift and foot movement.', durationMins: 90, skills: ['Backlift', 'Front foot', 'Back foot'] },
      { id: 'mod-1-3', title: 'Front Foot Shots', description: 'Driving, defending, and playing off the front foot.', durationMins: 120, skills: ['Cover drive', 'Straight drive', 'Defense'] },
      { id: 'mod-1-4', title: 'Back Foot Shots', description: 'Cut, pull, and playing off the back foot.', durationMins: 120, skills: ['Cut shot', 'Pull shot', 'Back foot defense'] },
      { id: 'mod-1-5', title: 'Running Between Wickets', description: 'Quick singles, turning, and calling.', durationMins: 60, skills: ['Calling', 'Turning', 'Slide'] },
    ],
  },
  {
    id: 'course-2',
    title: 'Fast Bowling Mastery',
    category: 'bowling',
    level: 'intermediate',
    durationWeeks: 10,
    sessionsPerWeek: 3,
    description: 'Advanced fast bowling techniques including swing, seam, and pace variations.',
    instructorId: 'coach-2',
    enrolledCount: 16,
    rating: 4.9,
    modules: [
      { id: 'mod-2-1', title: 'Run-Up & Action', description: 'Developing a smooth, repeatable bowling action.', durationMins: 90, skills: ['Run-up', 'Action', 'Follow-through'] },
      { id: 'mod-2-2', title: 'Swing Bowling', description: 'Conventional and reverse swing techniques.', durationMins: 120, skills: ['Outswing', 'Inswing', 'Reverse swing'] },
      { id: 'mod-2-3', title: 'Seam & Cut', description: 'Seam positioning and cutters.', durationMins: 90, skills: ['Seam position', 'Off cutter', 'Leg cutter'] },
      { id: 'mod-2-4', title: 'Pace Variations', description: 'Slower balls and change of pace.', durationMins: 90, skills: ['Slower ball', 'Knuckle ball', 'Bouncer'] },
      { id: 'mod-2-5', title: 'Death Bowling', description: 'Bowling in the final overs under pressure.', durationMins: 120, skills: ['Yorker', 'Wide line', 'Pressure management'] },
    ],
  },
  {
    id: 'course-3',
    title: 'Fielding Excellence',
    category: 'fielding',
    level: 'beginner',
    durationWeeks: 6,
    sessionsPerWeek: 4,
    description: 'Become a complete fielder: catching, throwing, and ground fielding.',
    instructorId: 'coach-3',
    enrolledCount: 28,
    rating: 4.7,
    modules: [
      { id: 'mod-3-1', title: 'Catching Basics', description: 'High catches, slip catching, and close-in fielding.', durationMins: 75, skills: ['High catch', 'Slip catch', 'Reflexes'] },
      { id: 'mod-3-2', title: 'Ground Fielding', description: 'Approaching the ball and picking up cleanly.', durationMins: 75, skills: ['Approach', 'Pickup', 'Transfer'] },
      { id: 'mod-3-3', title: 'Throwing & Targeting', description: 'Throwing accuracy and quick releases.', durationMins: 90, skills: ['Throw', 'Target', 'Quick release'] },
      { id: 'mod-3-4', title: 'Diving & Agility', description: 'Diving saves and agility drills.', durationMins: 60, skills: ['Dive', 'Agility', 'Recovery'] },
    ],
  },
  {
    id: 'course-4',
    title: 'Mental Toughness & Match Strategy',
    category: 'mental',
    level: 'advanced',
    durationWeeks: 4,
    sessionsPerWeek: 2,
    description: 'Develop the mental game: concentration, pressure handling, and match awareness.',
    instructorId: 'coach-1',
    enrolledCount: 12,
    rating: 4.9,
    modules: [
      { id: 'mod-4-1', title: 'Concentration Skills', description: 'Maintaining focus through long innings.', durationMins: 60, skills: ['Focus', 'Routine', 'Switch on/off'] },
      { id: 'mod-4-2', title: 'Pressure Situations', description: 'Performing under match pressure.', durationMins: 60, skills: ['Pressure', 'Composure', 'Decision-making'] },
      { id: 'mod-4-3', title: 'Match Awareness', description: 'Reading the game and situational play.', durationMins: 90, skills: ['Game reading', 'Situational awareness', 'Adaptation'] },
    ],
  },
  {
    id: 'course-5',
    title: 'Spin Bowling Specialization',
    category: 'bowling',
    level: 'advanced',
    durationWeeks: 8,
    sessionsPerWeek: 3,
    description: 'Specialized spin bowling: off-spin, leg-spin, and variations.',
    instructorId: 'coach-2',
    enrolledCount: 10,
    rating: 4.8,
    modules: [
      { id: 'mod-5-1', title: 'Off-Spin Basics', description: 'Grip, release, and flight for off-spinners.', durationMins: 90, skills: ['Grip', 'Release', 'Flight'] },
      { id: 'mod-5-2', title: 'Leg-Spin Techniques', description: 'Wrist spin mechanics and leg-spin variations.', durationMins: 120, skills: ['Wrist position', 'Leg break', 'Googly'] },
      { id: 'mod-5-3', title: 'Variations & Deception', description: 'Carrom ball, slider, and top spinner.', durationMins: 90, skills: ['Carrom ball', 'Slider', 'Top spinner'] },
      { id: 'mod-5-4', title: 'Flight & Drift', description: 'Using flight and drift to beat the batter.', durationMins: 75, skills: ['Flight', 'Drift', 'Loop'] },
    ],
  },
  {
    id: 'course-6',
    title: 'Elite Fitness & Conditioning',
    category: 'fitness',
    level: 'elite',
    durationWeeks: 12,
    sessionsPerWeek: 5,
    description: 'Professional-grade fitness training for competitive cricketers.',
    instructorId: 'coach-3',
    enrolledCount: 14,
    rating: 4.9,
    modules: [
      { id: 'mod-6-1', title: 'Strength Training', description: 'Position-specific strength development.', durationMins: 90, skills: ['Core', 'Lower body', 'Upper body'] },
      { id: 'mod-6-2', title: 'Speed & Agility', description: 'Sprint training and quick direction changes.', durationMins: 75, skills: ['Sprint', 'Agility', 'Acceleration'] },
      { id: 'mod-6-3', title: 'Endurance', description: 'Building cricket-specific stamina.', durationMins: 90, skills: ['Stamina', 'Recovery', 'VO2 max'] },
      { id: 'mod-6-4', title: 'Injury Prevention', description: 'Prehab and mobility work.', durationMins: 60, skills: ['Mobility', 'Prehab', 'Flexibility'] },
      { id: 'mod-6-5', title: 'Recovery Protocols', description: 'Post-training and post-match recovery.', durationMins: 45, skills: ['Recovery', 'Nutrition', 'Sleep'] },
    ],
  },
];

// ─── Enrollments ──────────────────────────────────────────────────────────────
export const academyEnrollments: Enrollment[] = [];
academyStudents.forEach(student => {
  const numCourses = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...academyCourses].sort(() => 0.5 - Math.random());
  for (let i = 0; i < numCourses; i++) {
    const course = shuffled[i];
    const progress = Math.floor(Math.random() * 100);
    academyEnrollments.push({
      id: `enr-${student.id}-${course.id}`,
      studentId: student.id,
      courseId: course.id,
      status: progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'enrolled',
      progress,
      enrolledDate: student.enrollmentDate,
      completedDate: progress === 100 ? new Date().toISOString() : undefined,
      grade: progress === 100 ? ['A+', 'A', 'B+'][Math.floor(Math.random() * 3)] : undefined,
    });
  }
});

// ─── Progress Records ────────────────────────────────────────────────────────
const progressAreas: ProgressRecord['area'][] = ['batting', 'bowling', 'fielding', 'fitness', 'match_awareness'];

export const mockProgressRecords: ProgressRecord[] = academyStudents.slice(0, 12).flatMap(student =>
  progressAreas.map((area, j) => ({
    studentId: student.id,
    area,
    current: Math.floor(40 + (student.overallProgress * 0.5) + (j * 7) % 50),
    previous: Math.floor(30 + (student.overallProgress * 0.4) + (j * 5) % 40),
    target: 90,
    trend: 'up' as const,
  }))
);

export const mockProgressHistory: ProgressHistory[] = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  batting: Math.floor(45 + i * 2 + Math.random() * 10),
  bowling: Math.floor(40 + i * 1.5 + Math.random() * 10),
  fielding: Math.floor(50 + i * 1.8 + Math.random() * 8),
  fitness: Math.floor(55 + i * 2.5 + Math.random() * 8),
  matchAwareness: Math.floor(35 + i * 2.2 + Math.random() * 12),
}));

// ─── Dashboard Metrics ───────────────────────────────────────────────────────
export const academyDashboardMetrics: AcademyDashboardMetrics = {
  totalStudents: academyStudents.length,
  activeBatches: academyBatches.filter(b => b.status === 'ongoing').length,
  totalCoaches: academyCoaches.length,
  totalCourses: academyCourses.length,
  avgAttendance: Math.round(academyStudents.reduce((s, st) => s + st.attendancePct, 0) / academyStudents.length),
  avgProgress: Math.round(academyStudents.reduce((s, st) => s + st.overallProgress, 0) / academyStudents.length),
  graduationRate: 82,
  newEnrollmentsThisMonth: 7,
};

// ─── Chart Data ───────────────────────────────────────────────────────────────
export const enrollmentTrendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, i) => ({
  name: month,
  value: Math.floor(15 + i * 4 + Math.random() * 8),
}));

export const batchDistributionData = [
  { name: 'Foundation', value: 18, color: '#6366f1' },
  { name: 'Intermediate', value: 16, color: '#06b6d4' },
  { name: 'Elite', value: 12, color: '#f59e0b' },
  { name: 'Summer Camp', value: 28, color: '#22c55e' },
];

export const courseCategoryDistribution: { name: string; value: number; color: string }[] = [
  { name: 'Batting', value: 24, color: '#6366f1' },
  { name: 'Bowling', value: 26, color: '#06b6d4' },
  { name: 'Fielding', value: 28, color: '#22c55e' },
  { name: 'Fitness', value: 14, color: '#f59e0b' },
  { name: 'Mental', value: 12, color: '#ef4444' },
  { name: 'Strategy', value: 8, color: '#a855f7' },
];

export const monthlyProgressData = mockProgressHistory.map(h => ({
  name: h.week,
  value: Math.round((h.batting + h.bowling + h.fielding + h.fitness + h.matchAwareness) / 5),
}));

// ─── Helper Functions ────────────────────────────────────────────────────────
export function getCoachById(id: string): Coach | undefined {
  return academyCoaches.find(c => c.id === id);
}

export function getBatchById(id: string): Batch | undefined {
  return academyBatches.find(b => b.id === id);
}

export function getStudentsByBatch(batchId: string): Student[] {
  return academyStudents.filter(s => s.batchId === batchId);
}

export function getEnrollmentsByStudent(studentId: string): Enrollment[] {
  return academyEnrollments.filter(e => e.studentId === studentId);
}

export function getCourseById(id: string): Course | undefined {
  return academyCourses.find(c => c.id === id);
}

export function getProgressByStudent(studentId: string): ProgressRecord[] {
  return mockProgressRecords.filter(p => p.studentId === studentId);
}

export const statusConfig: Record<StudentStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#22c55e', bg: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400' },
  graduated: { label: 'Graduated', color: '#6366f1', bg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400' },
  on_leave: { label: 'On Leave', color: '#f59e0b', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' },
  dropped: { label: 'Dropped', color: '#ef4444', bg: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400' },
};

export const batchStatusConfig: Record<BatchStatus, { label: string; color: string; bg: string }> = {
  upcoming: { label: 'Upcoming', color: '#06b6d4', bg: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400' },
  ongoing: { label: 'Ongoing', color: '#22c55e', bg: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400' },
  completed: { label: 'Completed', color: '#64748b', bg: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
};

export const levelConfig: Record<CourseLevel, { label: string; color: string; bg: string }> = {
  beginner: { label: 'Beginner', color: '#22c55e', bg: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400' },
  intermediate: { label: 'Intermediate', color: '#06b6d4', bg: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400' },
  advanced: { label: 'Advanced', color: '#f59e0b', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' },
  elite: { label: 'Elite', color: '#ef4444', bg: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400' },
};

export const categoryConfig: Record<CourseCategory, { label: string; icon: string }> = {
  batting: { label: 'Batting', icon: 'Trophy' },
  bowling: { label: 'Bowling', icon: 'Target' },
  fielding: { label: 'Fielding', icon: 'Activity' },
  fitness: { label: 'Fitness', icon: 'Dumbbell' },
  mental: { label: 'Mental', icon: 'Brain' },
  match_strategy: { label: 'Match Strategy', icon: 'Strategy' },
};
