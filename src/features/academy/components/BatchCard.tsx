import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import type { Batch } from '../types';
import { batchStatusConfig, levelConfig, getCoachById } from '../services/mock-data';
import { cn } from '../../../lib/utils';

interface BatchCardProps {
  batch: Batch;
  index: number;
  onClick?: () => void;
}

export function BatchCard({ batch, index, onClick }: BatchCardProps) {
  const coach = getCoachById(batch.coachId);
  const status = batchStatusConfig[batch.status];
  const level = levelConfig[batch.level];
  const fillPct = Math.round((batch.enrolledCount / batch.capacity) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 shadow-lg p-5 cursor-pointer transition-shadow hover:shadow-xl"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">{batch.name}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{coach?.name || 'Unassigned'}</p>
        </div>
        <span className={cn('px-2 py-0.5 text-[10px] font-bold rounded-full', status.bg)}>{status.label}</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={cn('px-2 py-0.5 text-[10px] font-medium rounded-md', level.bg)}>{level.label}</span>
      </div>

      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{batch.description}</p>

      <div className="space-y-1.5 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{new Date(batch.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(batch.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">{batch.schedule}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{batch.venue}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="flex items-center gap-1 text-slate-500"><Users className="w-3.5 h-3.5" /> Enrollment</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">{batch.enrolledCount}/{batch.capacity}</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fillPct}%` }}
            transition={{ duration: 0.8, delay: index * 0.05, ease: 'easeOut' }}
            className={cn('h-full rounded-full', fillPct >= 90 ? 'bg-amber-500' : 'bg-gradient-to-r from-primary-500 to-cyan-500')}
          />
        </div>
      </div>
    </motion.div>
  );
}
