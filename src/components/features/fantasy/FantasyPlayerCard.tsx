import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Star, TrendingUp, TrendingDown, Users } from 'lucide-react';

export interface FantasyPlayerCardProps {
  id: string;
  name: string;
  team: string;
  role: string;
  points: number;
  form: 'hot' | 'warm' | 'cold';
  price: string;
  image?: string;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
}

export function FantasyPlayerCard({ 
  id, 
  name, 
  team, 
  role, 
  points, 
  form,
  price,
  image,
  selected = false,
  className,
  onClick
}: FantasyPlayerCardProps) {
  const getFormColor = () => {
    switch (form) {
      case 'hot':
        return 'text-orange-500';
      case 'warm':
        return 'text-emerald-500';
      case 'cold':
        return 'text-red-500';
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
        'relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-300',
        selected 
          ? 'border-primary-500 ring-2 ring-primary-500/20' 
          : 'border-slate-200 dark:border-slate-800 shadow-sm'
      )}>
        {/* Selected Badge */}
        {selected && (
          <div className="absolute top-3 left-3 z-10">
            <div className="w-3 h-3 rounded-full bg-primary-500" />
          </div>
        )}

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
          
          {/* Form Badge */}
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
            <div className="flex items-center gap-1">
              {form === 'hot' && <TrendingUp className="w-3 h-3 text-orange-500" />}
              {form === 'warm' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
              {form === 'cold' && <TrendingDown className="w-3 h-3 text-red-500" />}
              <span className={cn('text-xs font-bold text-white', getFormColor())}>
                {form.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Player Info */}
        <div className="px-5 py-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">{role}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{team}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-slate-900 dark:text-white">{price}</div>
              <div className="text-xs text-slate-500">Credits</div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex-1 text-center">
              <div className="text-lg font-bold text-primary-500">{points}</div>
              <div className="text-xs text-slate-500">Points</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-lg font-bold text-slate-900 dark:text-white">{Math.round(points / 5)}</div>
              <div className="text-xs text-slate-500">Avg</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-lg font-bold text-slate-900 dark:text-white">{Math.round(points / 3)}</div>
              <div className="text-xs text-slate-500">Matches</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}