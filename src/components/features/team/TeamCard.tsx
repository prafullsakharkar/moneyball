import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Trophy, Users, Award, TrendingUp } from 'lucide-react';

export interface TeamCardProps {
  id: string;
  name: string;
  coach: string;
  captain: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  points: number;
  logo?: string;
  className?: string;
  onClick?: () => void;
}

export function TeamCard({ 
  id, 
  name, 
  coach, 
  captain, 
  matchesPlayed, 
  wins, 
  losses, 
  points,
  logo,
  className,
  onClick
}: TeamCardProps) {
  const winRate = matchesPlayed > 0 ? Math.round((wins / matchesPlayed) * 100) : 0;

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
        {/* Team Logo */}
        <div className="h-32 relative overflow-hidden bg-gradient-to-br from-primary-500 to-cyan-500">
          {logo ? (
            <img 
              src={logo} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Trophy className="w-16 h-16 text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Users className="w-3 h-3" />
              <span>{matchesPlayed} matches • {wins} wins</span>
            </div>
          </div>
        </div>

        {/* Team Info */}
        <div className="px-5 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Award className="w-3 h-3" />
                <span>Coach</span>
              </div>
              <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{coach}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <TrendingUp className="w-3 h-3" />
                <span>Captain</span>
              </div>
              <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{captain}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-500">{wins}</div>
              <div className="text-xs text-slate-500">Wins</div>
            </div>
            <div className="text-center border-l border-slate-100 dark:border-slate-800">
              <div className="text-lg font-bold text-slate-900 dark:text-white">{matchesPlayed - wins - losses}</div>
              <div className="text-xs text-slate-500">NR</div>
            </div>
            <div className="text-center border-l border-slate-100 dark:border-slate-800">
              <div className="text-lg font-bold text-red-500">{losses}</div>
              <div className="text-xs text-slate-500">Loss</div>
            </div>
          </div>

          {/* Points */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-slate-500">Points</div>
            <div className="text-xl font-bold text-primary-500">{points}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}