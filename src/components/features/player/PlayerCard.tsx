import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Trophy, Star } from 'lucide-react';

export interface PlayerCardProps {
  id: string;
  name: string;
  team: string;
  role: string;
  rating: number;
  matches: number;
  runs?: number;
  wickets?: number;
  image?: string;
  className?: string;
  onClick?: () => void;
}

export function PlayerCard({ 
  id, 
  name, 
  team, 
  role, 
  rating, 
  matches, 
  runs, 
  wickets,
  image,
  className,
  onClick
}: PlayerCardProps) {
  const getRoleColor = () => {
    switch (role.toLowerCase()) {
      case 'batsman':
      case 'batsman':
        return 'text-orange-500';
      case 'bowler':
      case 'bowler':
        return 'text-red-500';
      case 'all-rounder':
      case 'all-rounder':
        return 'text-green-500';
      case 'wicket-keeper':
      case 'wicket-keeper':
        return 'text-blue-500';
      default:
        return 'text-slate-500';
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
        {/* Player Image */}
        <div className="h-32 relative overflow-hidden">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">{rating}</span>
            </div>
          </div>
        </div>

        {/* Player Info */}
        <div className="px-5 py-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn('text-xs font-medium', getRoleColor())}>
                  {role}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{team}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 dark:text-slate-400">{matches} matches</div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {runs !== undefined && (
              <div className="flex-1 text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-white">{runs}</div>
                <div className="text-xs text-slate-500">Runs</div>
              </div>
            )}
            {wickets !== undefined && (
              <div className="flex-1 text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-white">{wickets}</div>
                <div className="text-xs text-slate-500">Wkts</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}