import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

export interface AnalyticsCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ElementType;
  color?: string;
  className?: string;
}

export function AnalyticsCard({ 
  title, 
  value, 
  change, 
  trend = 'neutral',
  icon: Icon = BarChart3,
  color = 'bg-primary-500',
  className
}: AnalyticsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn('cursor-pointer', className)}
    >
      <div className={cn(
        'relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300'
      )}>
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</div>
            </div>
            <div className={cn('p-3 rounded-xl', color)}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>

          {change && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              {trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
              {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
              {trend === 'neutral' && <span className="w-4 h-4" />}
              <span className={cn('text-sm font-medium',
                trend === 'up' ? 'text-emerald-500' :
                trend === 'down' ? 'text-red-500' : 'text-slate-500'
              )}>
                {change}
              </span>
              <span className="text-xs text-slate-400">vs previous</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}