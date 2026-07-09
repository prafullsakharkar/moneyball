import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Clock, Star } from 'lucide-react';
import { GlassCard, KPIWidget } from '../../../components/ui/GlassCard';
import { BarChart, DonutChart } from '../../../components/ui/Charts';
import { chartColors } from '../../../lib/mock-data';
import {
  academyBatches,
  academyCoaches,
  academyStudents,
  batchStatusConfig,
  levelConfig,
  getCoachById,
  getStudentsByBatch,
  batchDistributionData,
} from '../services/mock-data';
import { BatchCard } from '../components';
import type { BatchStatus } from '../types';
import { cn } from '../../../lib/utils';

export function Batches() {
  const [statusFilter, setStatusFilter] = React.useState<BatchStatus | 'all'>('all');

  const filtered = academyBatches.filter(b => statusFilter === 'all' || b.status === statusFilter);
  const statusOptions: (BatchStatus | 'all')[] = ['all', 'ongoing', 'upcoming', 'completed'];

  const totalCapacity = academyBatches.reduce((s, b) => s + b.capacity, 0);
  const totalEnrolled = academyBatches.reduce((s, b) => s + b.enrolledCount, 0);
  const ongoingCount = academyBatches.filter(b => b.status === 'ongoing').length;
  const upcomingCount = academyBatches.filter(b => b.status === 'upcoming').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Batches</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage training batches and schedules</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Total Batches" value={academyBatches.length} icon={<Calendar className="w-6 h-6" />} color={chartColors.primary} delay={0} />
        <KPIWidget title="Ongoing" value={ongoingCount} icon={<Clock className="w-6 h-6" />} color={chartColors.success} delay={1} />
        <KPIWidget title="Upcoming" value={upcomingCount} icon={<Calendar className="w-6 h-6" />} color={chartColors.cyan} delay={2} />
        <KPIWidget title="Total Enrolled" value={totalEnrolled} icon={<Users className="w-6 h-6" />} color={chartColors.warning} delay={3} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Enrollment by Batch</h3>
          <BarChart
            data={academyBatches.map(b => ({
              name: b.name.split(' ').slice(0, 2).join(' '),
              value: b.enrolledCount,
              color: b.status === 'ongoing' ? chartColors.success : b.status === 'upcoming' ? chartColors.cyan : chartColors.primary,
            }))}
            height={260}
          />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Batch Distribution</h3>
          <DonutChart data={batchDistributionData} height={260} />
        </GlassCard>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {statusOptions.map(opt => (
          <button
            key={opt}
            onClick={() => setStatusFilter(opt)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors',
              statusFilter === opt ? 'bg-white dark:bg-slate-700 text-primary-500 shadow' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            {opt === 'all' ? 'All' : batchStatusConfig[opt as BatchStatus]?.label}
          </button>
        ))}
      </div>

      {/* Batch grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((batch, i) => (
          <BatchCard key={batch.id} batch={batch} index={i} />
        ))}
      </div>

      {/* Coach assignments */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Coach Assignments</h3>
        <div className="space-y-2">
          {academyCoaches.map((coach, i) => {
            const assignedBatches = academyBatches.filter(b => coach.assignedBatches.includes(b.id));
            return (
              <motion.div
                key={coach.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <img src={coach.photoUrl} alt={coach.name} className="w-10 h-10 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{coach.name}</p>
                  <p className="text-xs text-slate-500">{coach.specialization.map(s => s.replace('_', ' ')).join(', ')}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{coach.rating}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {assignedBatches.map(b => (
                    <span key={b.id} className="px-2 py-0.5 text-[10px] rounded-md bg-primary-500/10 text-primary-500">
                      {b.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

export default Batches;
