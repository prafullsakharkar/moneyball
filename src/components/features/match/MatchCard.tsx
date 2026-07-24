import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Calendar, Trophy, Users, Clock } from 'lucide-react';

export interface MatchCardProps {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'completed';
  date: string;
  time: string;
  venue: string;
  tournament: string;
  className?: string;
  onClick?: () => void;
}

export function MatchCard({ 
  id, 
  homeTeam, 
  awayTeam, 
  homeScore, 
  awayScore, 
  status, 
  date, 
  time, 
  venue, 
  tournament,
  className,
  onClick
}: MatchCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'live':
        return 'bg-emerald-500';
      case 'upcoming':
        return 'bg-amber-500';
      case 'completed':
        return 'bg-slate-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'live':
        return 'LIVE';
      case 'upcoming':
        return 'UPCOMING';
      case 'completed':
        return 'FINISHED';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn('group cursor-pointer', className)}
      onClick={onClick}
    >
      <div className={cn(
        'relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300'
      )}>
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold text-white',
            getStatusColor()
          )}>
            {getStatusLabel()}
          </span>
        </div>

        {/* Tournament Info */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
            <Trophy className="w-3 h-3" />
            <span>{tournament}</span>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="text-lg font-bold text-slate-900 dark:text-white">{homeTeam}</div>
              {homeScore !== undefined && status === 'completed' && (
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{homeScore}</div>
              )}
            </div>

            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">VS</div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                <span>{time}</span>
              </div>
            </div>

            <div className="flex-1 text-right space-y-2">
              <div className="text-lg font-bold text-slate-900 dark:text-white">{awayTeam}</div>
              {awayScore !== undefined && status === 'completed' && (
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{awayScore}</div>
              )}
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Users className="w-4 h-4" />
              <span>{venue}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}