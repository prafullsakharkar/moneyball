import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import type { TimelineEvent } from '../types';

interface TimelineProps {
  duration: number;
  current: number;
  events: TimelineEvent[];
  onSeek: (time: number) => void;
}

const eventConfig: Record<TimelineEvent['type'], { color: string; label: string }> = {
  six: { color: '#ef4444', label: 'Six' },
  boundary: { color: '#22c55e', label: 'Boundary' },
  wicket: { color: '#f59e0b', label: 'Wicket' },
  dot: { color: '#94a3b8', label: 'Dot' },
  wide: { color: '#a855f7', label: 'Wide' },
  no_ball: { color: '#ec4899', label: 'No Ball' },
  review: { color: '#06b6d4', label: 'Review' },
  timeout: { color: '#64748b', label: 'Timeout' },
};

export function Timeline({ duration, current, events, onSeek }: TimelineProps) {
  const [hovered, setHovered] = React.useState<TimelineEvent | null>(null);
  const progress = duration > 0 ? (current / duration) * 100 : 0;

  const positionFor = (time: number) => (duration > 0 ? (time / duration) * 100 : 0);

  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {(['six', 'boundary', 'wicket', 'dot'] as const).map((key) => {
          const cfg = eventConfig[key];
          return (
            <div key={key} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
              <span className="text-xs text-slate-500 dark:text-slate-400">{cfg.label}</span>
            </div>
          );
        })}
      </div>

      {/* Timeline track */}
      <div
        className="relative h-16 bg-slate-100 dark:bg-slate-800/60 rounded-xl cursor-pointer overflow-hidden"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          onSeek(((e.clientX - rect.left) / rect.width) * duration);
        }}
      >
        {/* Progress overlay */}
        <div
          className="absolute top-0 left-0 h-full bg-primary-500/10"
          style={{ width: `${progress}%` }}
        />

        {/* Current time indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary-500 z-20 pointer-events-none"
          style={{ left: `${progress}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary-500 shadow-lg" />
        </div>

        {/* Event markers */}
        {events.map((evt, i) => {
          const cfg = eventConfig[evt.type];
          const left = positionFor(evt.time);
          if (left < 0 || left > 100) return null;
          return (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.01, 0.3) }}
              onMouseEnter={() => setHovered(evt)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSeek(evt.time);
              }}
              className="absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer group"
              style={{ left: `${left}%` }}
            >
              <div
                className="w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-800 group-hover:scale-150 transition-transform"
                style={{ backgroundColor: cfg.color }}
              />
            </motion.div>
          );
        })}

        {/* Hover tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -top-12 z-30 pointer-events-none"
              style={{ left: `${positionFor(hovered.time)}%`, transform: 'translateX(-50%)' }}
            >
              <div className="px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-xs whitespace-nowrap shadow-xl">
                <span className="font-medium">{hovered.label}</span>
                {hovered.description && (
                  <p className="text-[10px] text-slate-300 mt-0.5">{hovered.description}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Time labels */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>0:00</span>
        <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
      </div>
    </div>
  );
}
