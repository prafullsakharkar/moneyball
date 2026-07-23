import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Award, Activity } from 'lucide-react';
import { GlassCard, KPIWidget } from '../../../components/ui/GlassCard';
import { LineChart, RadarChart, BarChart, GaugeChart } from '../../../components/ui/Charts';
import { chartColors } from '../../../lib/mock-data';
import {
  academyStudents,
  mockProgressRecords,
  mockProgressHistory,
  getProgressByStudent,
} from '../services/mock-data';
import { cn } from '../../../lib/utils';

const areaLabels: Record<string, string> = {
  batting: 'Batting',
  bowling: 'Bowling',
  fielding: 'Fielding',
  fitness: 'Fitness',
  match_awareness: 'Match Awareness',
};

const areaColors: Record<string, string> = {
  batting: '#6366f1',
  bowling: '#06b6d4',
  fielding: '#22c55e',
  fitness: '#f59e0b',
  match_awareness: '#a855f7',
};

export function StudentProgress() {
  const [selectedStudentId, setSelectedStudentId] = React.useState(academyStudents[0]?.id || '');

  const selectedStudent = academyStudents.find(s => s.id === selectedStudentId);
  const studentProgress = getProgressByStudent(selectedStudentId);
  const overallProgress = selectedStudent?.overallProgress || 0;

  const avgProgress = Math.round(
    academyStudents.reduce((s, st) => s + st.overallProgress, 0) / academyStudents.length
  );
  const avgAttendance = Math.round(
    academyStudents.reduce((s, st) => s + st.attendancePct, 0) / academyStudents.length
  );
  const topPerformer = [...academyStudents].sort((a, b) => b.overallProgress - a.overallProgress)[0];
  const mostImproved = [...academyStudents].sort((a, b) => b.attendancePct - a.attendancePct)[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Student Progress</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track performance across all skill areas</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Avg Progress" value={`${avgProgress}%`} icon={<TrendingUp className="w-6 h-6" />} color={chartColors.primary} delay={0} trend={{ value: 8, type: 'up' }} />
        <KPIWidget title="Avg Attendance" value={`${avgAttendance}%`} icon={<Activity className="w-6 h-6" />} color={chartColors.success} delay={1} trend={{ value: 5, type: 'up' }} />
        <KPIWidget title="Top Performer" value={topPerformer?.initials || '-'} subtitle={topPerformer?.name} icon={<Award className="w-6 h-6" />} color={chartColors.warning} delay={2} />
        <KPIWidget title="Most Consistent" value={mostImproved?.initials || '-'} subtitle={mostImproved?.name} icon={<Target className="w-6 h-6" />} color={chartColors.cyan} delay={3} />
      </div>

      {/* Student selector */}
      <GlassCard className="!p-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {academyStudents.slice(0, 12).map(student => (
            <button
              key={student.id}
              onClick={() => setSelectedStudentId(student.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl transition-all flex-shrink-0',
                selectedStudentId === student.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              <img src={student.photoUrl} alt={student.name} className="w-6 h-6 rounded-full object-cover" />
              <span className="text-xs font-medium whitespace-nowrap">{student.name}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Selected student overview */}
      {selectedStudent && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="flex flex-col items-center justify-center">
              <img src={selectedStudent.photoUrl} alt={selectedStudent.name} className="w-16 h-16 rounded-2xl object-cover mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedStudent.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Age {selectedStudent.age} • {selectedStudent.level}</p>
              <div className="mt-4 w-full">
                <GaugeChart value={overallProgress} height={180} />
                <p className="text-sm text-slate-500 text-center mt-1">Overall Progress</p>
              </div>
            </GlassCard>

            <GlassCard className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Skill Radar</h3>
              <RadarChart
                categories={studentProgress.map(p => areaLabels[p.area] || p.area)}
                data={studentProgress.map(p => p.current)}
                color={chartColors.primary}
                height={240}
              />
            </GlassCard>
          </div>

          {/* Progress by area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentProgress.map((record, i) => {
              const color = areaColors[record.area] || chartColors.primary;
              const change = record.current - record.previous;
              const isPositive = change > 0;
              const progressToTarget = Math.round((record.current / record.target) * 100);
              return (
                <motion.div
                  key={record.area}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 shadow-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
                        <Target className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{areaLabels[record.area] || record.area}</span>
                    </div>
                    <div className={cn(
                      'flex items-center gap-1 text-xs font-bold',
                      isPositive ? 'text-green-500' : 'text-red-500'
                    )}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(change)}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{record.current}<span className="text-sm text-slate-400">/{record.target}</span></p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Prev: {record.previous}</span>
                      <span>{progressToTarget}% to target</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progressToTarget, 100)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Progress trend chart */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Progress History (12 Weeks)</h3>
            <LineChart
              series={[
                { name: 'Batting', data: mockProgressHistory.map(h => h.batting), color: chartColors.primary },
                { name: 'Bowling', data: mockProgressHistory.map(h => h.bowling), color: chartColors.cyan },
                { name: 'Fielding', data: mockProgressHistory.map(h => h.fielding), color: chartColors.success },
                { name: 'Fitness', data: mockProgressHistory.map(h => h.fitness), color: chartColors.warning },
                { name: 'Match Awareness', data: mockProgressHistory.map(h => h.matchAwareness), color: chartColors.purple },
              ]}
              categories={mockProgressHistory.map(h => h.week)}
              height={300}
            />
          </GlassCard>

          {/* Area comparison bar chart */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Current vs Target by Area</h3>
            <BarChart
              data={studentProgress.map(p => ({
                name: areaLabels[p.area] || p.area,
                value: p.current,
                color: areaColors[p.area] || chartColors.primary,
              }))}
              height={260}
            />
          </GlassCard>
        </>
      )}
    </div>
  );
}

export default StudentProgress;
