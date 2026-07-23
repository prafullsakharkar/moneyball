import React from 'react';
import { motion } from 'framer-motion';
import { Play, Bookmark, MessageSquare, Tag, Clock, Gauge } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { BallClip, BallOutcome } from '../types';

const outcomeConfig: Record<BallOutcome, { label: string; color: string; bg: string }> = {
  dot: { label: 'Dot', color: '#64748b', bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' },
  single: { label: '1 Run', color: '#06b6d4', bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  double: { label: '2 Runs', color: '#06b6d4', bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  triple: { label: '3 Runs', color: '#06b6d4', bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  four: { label: 'FOUR', color: '#22c55e', bg: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  six: { label: 'SIX', color: '#ef4444', bg: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  wicket: { label: 'WICKET', color: '#f59e0b', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  wide: { label: 'Wide', color: '#a855f7', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  no_ball: { label: 'No Ball', color: '#ec4899', bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
  bye: { label: 'Bye', color: '#14b8a6', bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
  leg_bye: { label: 'Leg Bye', color: '#14b8a6', bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
};

interface BallClipCardProps {
  clip: BallClip;
  index?: number;
  onPlay?: (clip: BallClip) => void;
  onBookmark?: (clip: BallClip) => void;
  onTag?: (clip: BallClip) => void;
  compact?: boolean;
}

export function BallClipCard({ clip, index = 0, onPlay, onBookmark, onTag, compact }: BallClipCardProps) {
  const oc = outcomeConfig[clip.outcome];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 shadow-lg overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <img
          src={clip.thumbnailUrl}
          alt={clip.ballLabel}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Play button */}
        <button
          onClick={() => onPlay?.(clip)}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </button>

        {/* Ball label */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-bold">
          {clip.ballLabel}
        </div>

        {/* Outcome badge */}
        <div className={cn('absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase', oc.bg)}>
          {oc.label}
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px]">
          <Clock className="w-2.5 h-2.5" />
          {clip.length}s
        </div>

        {/* Speed */}
        {clip.speedKph && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px]">
            <Gauge className="w-2.5 h-2.5" />
            {clip.speedKph} kph
          </div>
        )}

        {/* Bookmark */}
        <button
          onClick={() => onBookmark?.(clip)}
          className={cn(
            'absolute top-2 right-2 p-1 rounded-md transition-colors',
            clip.bookmarked ? 'text-amber-400' : 'text-white/60 hover:text-white opacity-0 group-hover:opacity-100'
          )}
          style={{ top: 'auto', bottom: '2px', right: '2px' }}
        >
          <Bookmark className={cn('w-3.5 h-3.5', clip.bookmarked && 'fill-amber-400')} />
        </button>
      </div>

      {/* Content */}
      <div className={cn('p-3', compact && 'p-2.5')}>
        {/* Players */}
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{clip.batsman || '—'}</span>
          <span className="text-slate-400">vs</span>
          <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{clip.bowler || '—'}</span>
        </div>

        {/* Tags */}
        {clip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {clip.tags.slice(0, compact ? 2 : 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 rounded-md bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[10px] font-medium"
              >
                {tag}
              </span>
            ))}
            {clip.tags.length > (compact ? 2 : 3) && (
              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px]">
                +{clip.tags.length - (compact ? 2 : 3)}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {clip.comments.length}
            </span>
            <span className="font-medium text-slate-600 dark:text-slate-300">{clip.runs} run{clip.runs !== 1 ? 's' : ''}</span>
          </div>
          {onTag && (
            <button
              onClick={() => onTag(clip)}
              className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              <Tag className="w-3 h-3" />
              Tag
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export { outcomeConfig };
