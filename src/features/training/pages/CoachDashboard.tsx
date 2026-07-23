import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Users, Activity, Clock, FileText, TrendingUp, Dumbbell,
  CheckCircle2, ChevronRight, MapPin,
} from 'lucide-react';
import { GlassCard, KPIWidget } from '../../../components/ui/GlassCard';
import { BarChart, DonutChart, LineChart } from '../../../components/ui/Charts';
import { chartColors } from '../../../lib/mock-data';
import {
  trainingDashboardMetrics,
  todaySessions,
  upcomingSessions,
  attendanceChartData,
  fitnessChartData,
  performanceChartData,
  trainingHoursChartData,
  sessionTypeDistribution,
} from '../services/mock-data';
import { SessionCard } from '../components';
import { cn } from '../../../lib/utils';

export function CoachDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Coach Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Training sessions, fitness, and performance overview</p>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPIWidget title="Today's Sessions" value={trainingDashboardMetrics.todaySessions} icon={<Calendar className="w-6 h-6" />} color={chartColors.primary} delay={0} />
        <KPIWidget title="Attendance" value={`${trainingDashboardMetrics.attendancePct}%`} icon={<CheckCircle2 className="w-6 h-6" />} color={chartColors.success} delay={1} trend={{ value: 5, type: 'up' }} />
        <KPIWidget title="Avg Fitness" value={trainingDashboardMetrics.avgFitnessScore} icon={<Activity className="w-6 h-6" />} color={chartColors.warning} delay={2} trend={{ value: 8, type: 'up' }} />
        <KPIWidget title="Upcoming" value={trainingDashboardMetrics.upcomingPractices} icon={<Clock className="w-6 h-6" />} color={chartColors.cyan} delay={3} />
        <KPIWidget title="Pending Reports" value={trainingDashboardMetrics.pendingReports} icon={<FileText className="w-6 h-6" />} color={chartColors.error} delay={4} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Weekly Attendance</h3>
          <BarChart data={attendanceChartData} height={260} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Fitness Score Trend</h3>
          <LineChart
            series={[{ name: 'Fitness Score', data: fitnessChartData.map(d => d.value), color: chartColors.warning }]}
            categories={fitnessChartData.map(d => d.name)}
            height={260}
          />
        </GlassCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance by Category</h3>
          <BarChart data={performanceChartData} height={220} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Session Distribution</h3>
          <DonutChart data={sessionTypeDistribution} height={220} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Training Hours</h3>
          <BarChart data={trainingHoursChartData} height={220} />
        </GlassCard>
      </div>

      {/* Today's sessions */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Today's Sessions</h3>
          <span className="text-sm text-primary-500 font-medium cursor-pointer hover:underline">View all</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {todaySessions.slice(0, 6).map((session, i) => (
            <SessionCard key={session.id} session={session} index={i} compact />
          ))}
        </div>
      </GlassCard>

      {/* Upcoming sessions timeline */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Upcoming Practice Schedule</h3>
        <div className="space-y-2">
          {upcomingSessions.map((session, i) => {
            const date = new Date(session.date);
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex-shrink-0">
                  <span className="text-xs font-bold">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="text-lg font-bold leading-none">{date.getDate()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{session.title}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{session.startTime}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{session.ground}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{session.players.length}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

export default CoachDashboard;
