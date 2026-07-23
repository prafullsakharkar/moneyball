import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, User, Users, Dumbbell, ChevronRight, Circle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { PracticeSession, SessionType, SessionIntensity } from '../types';

const typeConfig: Record<SessionType, { color: string; bg: string; label: string }> = {
  batting: { color: '#6366f1', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', label: 'Batting' },
  bowling: { color: '#06b6d4', bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400', label: 'Bowling' },
  fielding: { color: '#22c55e', bg: 'bg-green-500/10 text-green-600 dark:text-green-400', label: 'Fielding' },
  fitness: { color: '#f59e0b', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'Fitness' },
  strength: { color: '#ef4444', bg: 'bg-red-500/10 text-red-600 dark:text-red-400', label: 'Strength' },
  recovery: { color: '#a855f7', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', label: 'Recovery' },
  match_sim: { color: '#ec4899', bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400', label: 'Match Sim' },
  warmup: { color: '#14b8a6', bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400', label: 'Warm-up' },
};

const intensityConfig: Record<SessionIntensity, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-green-500' },
  medium: { label: 'Medium', color: 'text-amber-500' },
  high: { label: 'High', color: 'text-red-500' },
};

const statusConfig: Record<string, { label: string; bg: string }> = {
  scheduled: { label: 'Scheduled', bg: 'bg-primary-500/10 text-primary-600 dark:text-primary-400' },
  ongoing: { label: 'Ongoing', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  completed: { label: 'Completed', bg: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-500/10 text-red-600 dark:text-red-400' },
};

interface SessionCardProps {
  session: PracticeSession;
  index?: number;
  onClick?: (session: PracticeSession) => void;
  compact?: boolean;
}

export function SessionCard({ session, index = 0, onClick, compact }: SessionCardProps) {
  const tc = typeConfig[session.type];
  const ic = intensityConfig[session.intensity];
  const sc = statusConfig[session.status];
  const date = new Date(session.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -4 }}
      onClick={() => onClick?.(session)}
      className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 shadow-lg cursor-pointer overflow-hidden"
    >
      {/* Color bar */}
      <div className="h-1.5" style={{ backgroundColor: tc.color }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold uppercase', tc.bg)}>
                {tc.label}
              </span>
              <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold uppercase', sc.bg)}>
                {sc.label}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{session.title}</h3>
          </div>
          <span className={cn('text-xs font-medium', ic.color)}>{ic.label}</span>
        </div>

        {/* Time & location */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            <span>•</span>
            <span>{session.startTime} — {session.endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>{session.ground}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <User className="w-3.5 h-3.5" />
            <span>{session.coach}</span>
          </div>
        </div>

        {/* Footer */}
        {!compact && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Users className="w-3.5 h-3.5" />
              <span>{session.players.length} players</span>
            </div>
            {session.status === 'completed' && (
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${session.attendance}%` }} />
                </div>
                <span className="text-xs text-slate-500">{session.attendance}%</span>
              </div>
            )}
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export { typeConfig, intensityConfig, statusConfig };
