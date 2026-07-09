import React from 'react';
import { motion } from 'framer-motion';
import { Film, Tag, Users, Sparkles, HardDrive, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { GlassCard, KPIWidget } from '../../../components/ui/GlassCard';
import { BarChart, DonutChart, AreaChart } from '../../../components/ui/Charts';
import { chartColors } from '../../../lib/mock-data';
import {
  videoDashboardMetrics,
  mockAIJobs,
  videosPerMatch,
  videosPerPlayer,
  aiProcessingStatus,
} from '../services/mock-data';
import type { AIJob } from '../types';
import { cn } from '../../../lib/utils';

const jobTypeLabels: Record<string, string> = {
  highlights: 'Highlights Generation',
  shot_detection: 'Shot Detection',
  player_tracking: 'Player Tracking',
  auto_tagging: 'Auto Tagging',
  clip_generation: 'Clip Generation',
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  completed: { label: 'Completed', color: chartColors.success, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  processing: { label: 'Processing', color: chartColors.warning, icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
  pending: { label: 'Pending', color: chartColors.primary, icon: <Clock className="w-3.5 h-3.5" /> },
  failed: { label: 'Failed', color: chartColors.error, icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

export function VideoAnalysisDashboard() {
  const storagePct = (videoDashboardMetrics.storageUsed / videoDashboardMetrics.storageTotal) * 100;
  const recentJobs = mockAIJobs.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Video Analysis Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">AI-powered video tagging, clip generation, and highlights</p>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPIWidget title="Total Videos" value={videoDashboardMetrics.totalVideos} icon={<Film className="w-6 h-6" />} color={chartColors.primary} delay={0} />
        <KPIWidget title="Tagged Balls" value={videoDashboardMetrics.taggedBalls} icon={<Tag className="w-6 h-6" />} color={chartColors.cyan} delay={1} trend={{ value: 12, type: 'up' }} />
        <KPIWidget title="Tagged Players" value={videoDashboardMetrics.taggedPlayers} icon={<Users className="w-6 h-6" />} color={chartColors.success} delay={2} />
        <KPIWidget title="AI Clips" value={videoDashboardMetrics.aiClips} icon={<Sparkles className="w-6 h-6" />} color={chartColors.purple} delay={3} trend={{ value: 8, type: 'up' }} />
        <KPIWidget title="Storage Used" value={`${videoDashboardMetrics.storageUsed} GB`} subtitle={`of ${videoDashboardMetrics.storageTotal} GB`} icon={<HardDrive className="w-6 h-6" />} color={chartColors.warning} delay={4} />
      </div>

      {/* Storage bar */}
      <GlassCard>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Storage Usage</h3>
          <span className="text-sm text-slate-500">
            {videoDashboardMetrics.storageUsed} GB / {videoDashboardMetrics.storageTotal} GB
          </span>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${storagePct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full',
              storagePct > 80 ? 'bg-red-500' : storagePct > 60 ? 'bg-amber-500' : 'bg-primary-500'
            )}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{storagePct.toFixed(1)}% used — {videoDashboardMetrics.storageTotal - videoDashboardMetrics.storageUsed} GB available</p>
      </GlassCard>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Videos per Match</h3>
          <BarChart data={videosPerMatch} height={260} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">AI Processing Status</h3>
          <DonutChart data={aiProcessingStatus} height={260} />
        </GlassCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Videos per Player</h3>
          <BarChart data={videosPerPlayer} horizontal height={260} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tagging Activity (Last 12 Weeks)</h3>
          <AreaChart
            data={Array.from({ length: 12 }, (_, i) => ({ x: `W${i + 1}`, y: Math.floor(Math.random() * 500) + 200 }))}
            color={chartColors.cyan}
            height={260}
          />
        </GlassCard>
      </div>

      {/* Recent AI Jobs */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent AI Jobs</h3>
          <span className="text-sm text-primary-500 font-medium cursor-pointer hover:underline">View all</span>
        </div>
        <div className="space-y-2">
          {recentJobs.map((job, i) => {
            const sc = statusConfig[job.status];
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${sc.color}20` }}>
                  <span style={{ color: sc.color }}>{sc.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {jobTypeLabels[job.type] || job.type}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{job.videoTitle}</p>
                </div>
                {job.status === 'processing' && (
                  <div className="w-24">
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${job.progress}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 text-center">{job.progress}%</p>
                  </div>
                )}
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase whitespace-nowrap"
                  style={{ backgroundColor: `${sc.color}20`, color: sc.color }}
                >
                  {sc.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

export default VideoAnalysisDashboard;
