import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Clock, CheckCircle2, AlertCircle, Loader2, Trash2, RotateCcw, Sparkles, Film, Tag, Users, Video } from 'lucide-react';
import { GlassCard, KPIWidget } from '../../../components/ui/GlassCard';
import { DonutChart } from '../../../components/ui/Charts';
import { chartColors } from '../../../lib/mock-data';
import { mockAIJobs, aiProcessingStatus } from '../services/mock-data';
import type { AIJob, AIJobStatus, AIJobType } from '../types';
import { cn } from '../../../lib/utils';

const jobTypeConfig: Record<AIJobType, { label: string; icon: React.ReactNode; color: string }> = {
  highlights: { label: 'Highlights Generation', icon: <Sparkles className="w-4 h-4" />, color: chartColors.primary },
  shot_detection: { label: 'Shot Detection', icon: <Film className="w-4 h-4" />, color: chartColors.cyan },
  player_tracking: { label: 'Player Tracking', icon: <Users className="w-4 h-4" />, color: chartColors.success },
  auto_tagging: { label: 'Auto Tagging', icon: <Tag className="w-4 h-4" />, color: chartColors.warning },
  clip_generation: { label: 'Clip Generation', icon: <Video className="w-4 h-4" />, color: chartColors.purple },
};

const statusConfig: Record<AIJobStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  completed: { label: 'Completed', color: chartColors.success, bg: 'bg-green-500/10 text-green-600 dark:text-green-400', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  processing: { label: 'Processing', color: chartColors.warning, bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
  pending: { label: 'Pending', color: chartColors.primary, bg: 'bg-primary-500/10 text-primary-600 dark:text-primary-400', icon: <Clock className="w-3.5 h-3.5" /> },
  failed: { label: 'Failed', color: chartColors.error, bg: 'bg-red-500/10 text-red-600 dark:text-red-400', icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

type Tab = AIJobStatus | 'all';

export function AIHighlights() {
  const [tab, setTab] = React.useState<Tab>('all');
  const [jobs, setJobs] = React.useState(mockAIJobs);
  const [showCreate, setShowCreate] = React.useState(false);

  const filtered = React.useMemo(() => {
    if (tab === 'all') return jobs;
    return jobs.filter((j) => j.status === tab);
  }, [jobs, tab]);

  const counts = React.useMemo(() => ({
    all: jobs.length,
    pending: jobs.filter((j) => j.status === 'pending').length,
    processing: jobs.filter((j) => j.status === 'processing').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
    failed: jobs.filter((j) => j.status === 'failed').length,
  }), [jobs]);

  const handleRetry = (job: AIJob) => {
    setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, status: 'pending', progress: 0, error: undefined } : j));
  };

  const handleDelete = (job: AIJob) => {
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'processing', label: 'Processing', count: counts.processing },
    { key: 'completed', label: 'Completed', count: counts.completed },
    { key: 'failed', label: 'Failed', count: counts.failed },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Highlights</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">AI-powered video analysis jobs and processing</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-lg shadow-primary-500/25"
        >
          <Plus className="w-4 h-4" />
          New Job
        </button>
      </div>

      {/* KPI widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Total Jobs" value={counts.all} icon={<Sparkles className="w-6 h-6" />} color={chartColors.primary} delay={0} />
        <KPIWidget title="Completed" value={counts.completed} icon={<CheckCircle2 className="w-6 h-6" />} color={chartColors.success} delay={1} />
        <KPIWidget title="Processing" value={counts.processing} icon={<Loader2 className="w-6 h-6" />} color={chartColors.warning} delay={2} />
        <KPIWidget title="Failed" value={counts.failed} icon={<AlertCircle className="w-6 h-6" />} color={chartColors.error} delay={3} />
      </div>

      {/* Status chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Job Status Distribution</h3>
          <DonutChart data={aiProcessingStatus} height={220} />
        </GlassCard>

        {/* Job list */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
                  tab === t.key
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                {t.label}
                <span className={cn(
                  'px-1.5 py-0.5 rounded-md text-[10px] font-bold',
                  tab === t.key ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
                )}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Job cards */}
          <div className="space-y-3">
            {filtered.map((job, i) => {
              const tc = jobTypeConfig[job.type];
              const sc = statusConfig[job.status];
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                >
                  <GlassCard className="!p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="p-2.5 rounded-xl flex-shrink-0" style={{ backgroundColor: `${tc.color}20` }}>
                        <span style={{ color: tc.color }}>{tc.icon}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{tc.label}</h3>
                            <p className="text-xs text-slate-400 truncate">{job.videoTitle}</p>
                          </div>
                          <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase whitespace-nowrap', sc.bg)}>
                            {sc.icon}
                            {sc.label}
                          </span>
                        </div>

                        {/* Progress bar */}
                        {job.status === 'processing' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-400">Processing...</span>
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{job.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${job.progress}%` }}
                                className="h-full bg-amber-500 rounded-full"
                              />
                            </div>
                          </div>
                        )}

                        {/* Error */}
                        {job.status === 'failed' && job.error && (
                          <div className="mt-2 flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span>{job.error}</span>
                          </div>
                        )}

                        {/* Result count */}
                        {job.status === 'completed' && job.resultCount !== undefined && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                            <CheckCircle2 className="w-3 h-3 inline mr-1" />
                            {job.resultCount} clips generated
                          </p>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-xs text-slate-400">
                            {new Date(job.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div className="flex items-center gap-1">
                            {job.status === 'failed' && (
                              <button
                                onClick={() => handleRetry(job)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary-500 hover:bg-primary-500/10 transition-colors"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Retry
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(job)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-lg">No jobs found</p>
            </div>
          )}
        </div>
      </div>

      {/* Create job modal */}
      <CreateJobModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}

function CreateJobModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [type, setType] = React.useState<AIJobType>('highlights');
  const [videoTitle, setVideoTitle] = React.useState('');

  const inputClass = 'w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-primary-500 transition-colors';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">Create AI Job</h3>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Job Type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(jobTypeConfig).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => setType(key as AIJobType)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border',
                          type === key
                            ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/30'
                            : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        )}
                      >
                        <span style={{ color: cfg.color }}>{cfg.icon}</span>
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Video Title</label>
                  <input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Select or search video..." className={inputClass} />
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={onClose}
                  disabled={!videoTitle}
                  className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                  Create Job
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AIHighlights;
