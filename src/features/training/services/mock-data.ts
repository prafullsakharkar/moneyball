import type {
  PracticeSession,
  FitnessMetrics,
  FitnessTrend,
  AttendanceRecord,
  PerformanceKPI,
  TrainingDashboardMetrics,
  Player,
  AttendanceStatus,
  SessionType,
} from '../types';

const PHOTO = (seed: string) => `https://picsum.photos/seed/${seed}/80/80`;

// ─── Players ──────────────────────────────────────────────────────────────────
export const trainingPlayers: Player[] = [
  { id: 'tp-1', name: 'Virat Kohli', initials: 'VK', team: 'RCB', role: 'Batsman', age: 35, photoUrl: PHOTO('tp1') },
  { id: 'tp-2', name: 'Jasprit Bumrah', initials: 'JB', team: 'MI', role: 'Bowler', age: 30, photoUrl: PHOTO('tp2') },
  { id: 'tp-3', name: 'MS Dhoni', initials: 'MD', team: 'CSK', role: 'Wicket-keeper', age: 42, photoUrl: PHOTO('tp3') },
  { id: 'tp-4', name: 'Rohit Sharma', initials: 'RS', team: 'MI', role: 'Batsman', age: 37, photoUrl: PHOTO('tp4') },
  { id: 'tp-5', name: 'Hardik Pandya', initials: 'HP', team: 'GT', role: 'All-rounder', age: 30, photoUrl: PHOTO('tp5') },
  { id: 'tp-6', name: 'Ravindra Jadeja', initials: 'RJ', team: 'CSK', role: 'All-rounder', age: 35, photoUrl: PHOTO('tp6') },
  { id: 'tp-7', name: 'Shubman Gill', initials: 'SG', team: 'GT', role: 'Batsman', age: 24, photoUrl: PHOTO('tp7') },
  { id: 'tp-8', name: 'Yuzvendra Chahal', initials: 'YC', team: 'SRH', role: 'Bowler', age: 33, photoUrl: PHOTO('tp8') },
  { id: 'tp-9', name: 'Rishabh Pant', initials: 'RP', team: 'DC', role: 'Wicket-keeper', age: 26, photoUrl: PHOTO('tp9') },
  { id: 'tp-10', name: 'Jasprit Bumrah', initials: 'JB', team: 'MI', role: 'Bowler', age: 30, photoUrl: PHOTO('tp10') },
  { id: 'tp-11', name: 'KL Rahul', initials: 'KL', team: 'LSG', role: 'Batsman', age: 31, photoUrl: PHOTO('tp11') },
  { id: 'tp-12', name: 'Mohammed Siraj', initials: 'MS', team: 'RCB', role: 'Bowler', age: 30, photoUrl: PHOTO('tp12') },
];

export const coaches = ['Coach Ravi', 'Coach Mike', 'Coach Stephen', 'Coach Biju'];
export const grounds = ['Main Ground', 'Practice Net 1', 'Practice Net 2', 'Gym', 'Indoor Facility', 'Fielding Zone'];
export const equipmentList = ['Stumps', 'Balls (24)', 'Cones', 'Batting Tee', 'Throw-downs', 'Speed Radar', 'Fitness Bands', 'Water Bottles'];

const sessionTypes: SessionType[] = ['batting', 'bowling', 'fielding', 'fitness', 'strength', 'recovery', 'match_sim', 'warmup'];
const intensities = ['low', 'medium', 'high'] as const;

// ─── Dashboard Metrics ────────────────────────────────────────────────────────
export const trainingDashboardMetrics: TrainingDashboardMetrics = {
  todaySessions: 4,
  attendancePct: 87,
  avgFitnessScore: 78.5,
  upcomingPractices: 12,
  pendingReports: 3,
  totalPlayers: 24,
  totalCoaches: 4,
  weeklyTrainingHours: 36,
};

// ─── Practice Sessions ────────────────────────────────────────────────────────
function generateSessions(): PracticeSession[] {
  const sessions: PracticeSession[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + Math.floor(i / 3) - 5);
    const type = sessionTypes[i % sessionTypes.length];
    const status =
      date < today ? 'completed' :
      date.toDateString() === today.toDateString() ? (i % 2 === 0 ? 'ongoing' : 'scheduled') :
      'scheduled';
    const playerCount = Math.floor(Math.random() * 8) + 8;
    const players = Array.from({ length: playerCount }, (_, j) => trainingPlayers[j % trainingPlayers.length].name);
    const eqCount = Math.floor(Math.random() * 4) + 2;
    const equipment = Array.from({ length: eqCount }, (_, j) => equipmentList[j % equipmentList.length]);

    sessions.push({
      id: `ses-${i + 1}`,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Session`,
      type,
      date: date.toISOString(),
      startTime: `0${6 + (i % 4)}:00`,
      endTime: `0${8 + (i % 4)}:00`,
      coach: coaches[i % coaches.length],
      ground: grounds[i % grounds.length],
      players,
      equipment,
      notes: i % 3 === 0 ? 'Focus on power hitting and death bowling.' : i % 5 === 0 ? 'Recovery and light stretching.' : '',
      intensity: intensities[i % 3],
      attendance: status === 'completed' ? Math.floor(Math.random() * 20) + 75 : 0,
      status,
    });
  }
  return sessions;
}

export const mockSessions: PracticeSession[] = generateSessions();

export const todaySessions = mockSessions.filter(s => {
  const d = new Date(s.date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
});

export const upcomingSessions = mockSessions
  .filter(s => s.status === 'scheduled')
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .slice(0, 6);

// ─── Fitness Metrics ──────────────────────────────────────────────────────────
export const mockFitnessMetrics: FitnessMetrics[] = trainingPlayers.slice(0, 12).map((p, i) => ({
  playerId: p.id,
  bmi: Math.round((20 + Math.random() * 6) * 10) / 10,
  weight: Math.round((65 + Math.random() * 20) * 10) / 10,
  height: 170 + Math.floor(Math.random() * 20),
  sprint: Math.round((10 + Math.random() * 3) * 100) / 100,
  endurance: Math.round((10 + Math.random() * 5) * 10) / 10,
  agility: Math.round((9 + Math.random() * 3) * 100) / 100,
  reactionTime: Math.floor(Math.random() * 100) + 180,
  sleep: Math.round((6 + Math.random() * 3) * 10) / 10,
  hydration: Math.round((2 + Math.random() * 2) * 10) / 10,
  fitnessScore: Math.floor(Math.random() * 25) + 65,
}));

// ─── Fitness Trend ────────────────────────────────────────────────────────────
export const mockFitnessTrend: FitnessTrend[] = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  fitnessScore: Math.floor(65 + Math.random() * 20 + i * 0.5),
  sprint: Math.round((12 - i * 0.1 + Math.random()) * 100) / 100,
  endurance: Math.round((10 + i * 0.2 + Math.random()) * 10) / 10,
  agility: Math.round((11 - i * 0.08 + Math.random()) * 100) / 100,
  strength: Math.floor(60 + i * 1.5 + Math.random() * 10),
}));

// ─── Attendance ───────────────────────────────────────────────────────────────
const attendanceStatuses: AttendanceStatus[] = ['present', 'absent', 'late', 'excused'];

export const mockAttendance: AttendanceRecord[] = [];
mockSessions.filter(s => s.status === 'completed').forEach(session => {
  trainingPlayers.slice(0, 12).forEach((player, j) => {
    mockAttendance.push({
      id: `att-${session.id}-${player.id}`,
      sessionId: session.id,
      playerId: player.id,
      playerName: player.name,
      playerInitials: player.initials,
      status: attendanceStatuses[Math.floor(Math.random() * (j % 5 === 0 ? 4 : 2))],
      date: session.date,
      checkInTime: j % 5 === 0 ? undefined : session.startTime,
    });
  });
});

export function getAttendanceByDateRange(days: number): AttendanceRecord[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return mockAttendance.filter(a => new Date(a.date) >= cutoff);
}

export function getAttendanceStats(records: AttendanceRecord[]) {
  const total = records.length;
  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const late = records.filter(r => r.status === 'late').length;
  const excused = records.filter(r => r.status === 'excused').length;
  return {
    total,
    present,
    absent,
    late,
    excused,
    attendancePct: total ? Math.round(((present + late) / total) * 100) : 0,
  };
}

// ─── Performance KPIs ─────────────────────────────────────────────────────────
export const mockPerformanceKPIs: PerformanceKPI[] = [
  { category: 'batting', label: 'Batting Average', current: 42.5, previous: 38.2, target: 50, unit: '', trend: 'up' },
  { category: 'batting', label: 'Strike Rate', current: 145.3, previous: 138.7, target: 155, unit: '', trend: 'up' },
  { category: 'batting', label: 'Boundary %', current: 18.2, previous: 16.5, target: 22, unit: '%', trend: 'up' },
  { category: 'bowling', label: 'Bowling Average', current: 22.1, previous: 24.8, target: 18, unit: '', trend: 'up' },
  { category: 'bowling', label: 'Economy Rate', current: 7.2, previous: 8.1, target: 6.5, unit: '', trend: 'up' },
  { category: 'bowling', label: 'Wicket %', current: 32.5, previous: 28.3, target: 40, unit: '%', trend: 'up' },
  { category: 'fielding', label: 'Catch Success', current: 85, previous: 78, target: 92, unit: '%', trend: 'up' },
  { category: 'fielding', label: 'Run Out Rate', current: 12, previous: 8, target: 18, unit: '%', trend: 'up' },
  { category: 'fielding', label: 'Fielding Errors', current: 3.2, previous: 5.1, target: 2, unit: '', trend: 'up' },
  { category: 'fitness', label: 'Fitness Score', current: 78.5, previous: 72.3, target: 85, unit: '', trend: 'up' },
  { category: 'fitness', label: 'Sprint Speed', current: 11.2, previous: 12.1, target: 10.5, unit: 's', trend: 'up' },
  { category: 'fitness', label: 'Endurance', current: 13.5, previous: 11.8, target: 15, unit: 'lvl', trend: 'up' },
];

// ─── Chart Data ──────────────────────────────────────────────────────────────
export const attendanceChartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
  name: day,
  value: Math.floor(Math.random() * 20) + 75,
}));

export const fitnessChartData = mockFitnessTrend.map(t => ({
  name: t.week,
  value: t.fitnessScore,
}));

export const performanceChartData = ['Batting', 'Bowling', 'Fielding', 'Fitness'].map((name, i) => ({
  name,
  value: [42, 38, 85, 78][i],
  color: ['#6366f1', '#06b6d4', '#22c55e', '#f59e0b'][i],
}));

export const trainingHoursChartData = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'].map((week, i) => ({
  name: week,
  value: Math.floor(Math.random() * 10) + 28,
}));

export const sessionTypeDistribution = [
  { name: 'Batting', value: 8, color: '#6366f1' },
  { name: 'Bowling', value: 6, color: '#06b6d4' },
  { name: 'Fielding', value: 5, color: '#22c55e' },
  { name: 'Fitness', value: 4, color: '#f59e0b' },
  { name: 'Strength', value: 3, color: '#ef4444' },
  { name: 'Recovery', value: 2, color: '#a855f7' },
];
