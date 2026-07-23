import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, Users, Calendar, BookOpen, Activity, TrendingUp,
  ChevronRight, Star, Award, UserPlus,
} from 'lucide-react';
import { GlassCard, KPIWidget } from '../../../components/ui/GlassCard';
import { BarChart, DonutChart, LineChart } from '../../../components/ui/Charts';
import { chartColors } from '../../../lib/mock-data';
import {
  academyDashboardMetrics,
  academyCoaches,
  academyBatches,
  academyStudents,
  academyCourses,
  enrollmentTrendData,
  batchDistributionData,
  courseCategoryDistribution,
  monthlyProgressData,
  getCoachById,
} from '../services/mock-data';
import { BatchCard } from '../components';
import { cn } from '../../../lib/utils';

export function AcademyDashboard() {
  const ongoingBatches = academyBatches.filter(b => b.status === 'ongoing');
  const topStudents = [...academyStudents].sort((a, b) => b.overallProgress - a.overallProgress).slice(0, 5);
  const topCourses = [...academyCourses].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Academy Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage students, batches, curriculum, and progress</p>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Total Students" value={academyDashboardMetrics.totalStudents} icon={<Users className="w-6 h-6" />} color={chartColors.primary} delay={0} trend={{ value: 12, type: 'up' }} />
        <KPIWidget title="Active Batches" value={academyDashboardMetrics.activeBatches} icon={<Calendar className="w-6 h-6" />} color={chartColors.cyan} delay={1} />
        <KPIWidget title="Total Courses" value={academyDashboardMetrics.totalCourses} icon={<BookOpen className="w-6 h-6" />} color={chartColors.success} delay={2} />
        <KPIWidget title="Graduation Rate" value={`${academyDashboardMetrics.graduationRate}%`} icon={<GraduationCap className="w-6 h-6" />} color={chartColors.warning} delay={3} trend={{ value: 8, type: 'up' }} />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Avg Attendance" value={`${academyDashboardMetrics.avgAttendance}%`} icon={<Activity className="w-6 h-6" />} color={chartColors.success} delay={4} />
        <KPIWidget title="Avg Progress" value={`${academyDashboardMetrics.avgProgress}%`} icon={<TrendingUp className="w-6 h-6" />} color={chartColors.primary} delay={5} trend={{ value: 6, type: 'up' }} />
        <KPIWidget title="Total Coaches" value={academyDashboardMetrics.totalCoaches} icon={<Star className="w-6 h-6" />} color={chartColors.cyan} delay={6} />
        <KPIWidget title="New This Month" value={academyDashboardMetrics.newEnrollmentsThisMonth} icon={<UserPlus className="w-6 h-6" />} color={chartColors.error} delay={7} trend={{ value: 15, type: 'up' }} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Enrollment Trend</h3>
          <LineChart
            series={[{ name: 'New Enrollments', data: enrollmentTrendData.map(d => d.value), color: chartColors.primary }]}
            categories={enrollmentTrendData.map(d => d.name)}
            height={260}
          />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Batch Distribution</h3>
          <DonutChart data={batchDistributionData} height={260} />
        </GlassCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Course Categories</h3>
          <DonutChart data={courseCategoryDistribution} height={220} />
        </GlassCard>
        <GlassCard className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monthly Progress Trend</h3>
          <BarChart data={monthlyProgressData} height={220} />
        </GlassCard>
      </div>

      {/* Ongoing Batches */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ongoing Batches</h3>
          <span className="text-sm text-primary-500 font-medium cursor-pointer hover:underline">View all</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ongoingBatches.slice(0, 3).map((batch, i) => (
            <BatchCard key={batch.id} batch={batch} index={i} />
          ))}
        </div>
      </GlassCard>

      {/* Top Students & Top Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Performing Students</h3>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-2">
            {topStudents.map((student, i) => {
              const batch = academyBatches.find(b => b.id === student.batchId);
              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                    i === 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
                    i === 1 ? 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-200' :
                    i === 2 ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' :
                    'bg-slate-100 text-slate-400 dark:bg-slate-700'
                  )}>
                    {i + 1}
                  </div>
                  <img src={student.photoUrl} alt={student.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{student.name}</p>
                    <p className="text-xs text-slate-500">{batch?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary-500">{student.overallProgress}%</p>
                    <p className="text-[10px] text-slate-400">{student.attendancePct}% att</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Rated Courses</h3>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div className="space-y-2">
            {topCourses.map((course, i) => {
              const coach = getCoachById(course.instructorId);
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{course.title}</p>
                    <p className="text-xs text-slate-500">{coach?.name} • {course.durationWeeks} weeks</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{course.rating}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Coach overview */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Academy Coaches</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {academyCoaches.map((coach, i) => (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 text-center"
            >
              <img src={coach.photoUrl} alt={coach.name} className="w-14 h-14 rounded-2xl object-cover mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-2">{coach.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{coach.experienceYears} years exp</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{coach.rating}</span>
              </div>
              <div className="flex items-center justify-center gap-1 mt-2 flex-wrap">
                {coach.specialization.slice(0, 2).map(s => (
                  <span key={s} className="px-1.5 py-0.5 text-[9px] rounded bg-primary-500/10 text-primary-500 capitalize">
                    {s.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export default AcademyDashboard;
