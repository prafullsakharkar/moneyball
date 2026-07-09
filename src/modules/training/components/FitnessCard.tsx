import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Droplet, Moon, Zap, Gauge, Heart } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { FitnessMetrics, Player } from '../types';

interface FitnessCardProps {
  player: Player;
  metrics: FitnessMetrics;
  index?: number;
  onClick?: () => void;
}

export function FitnessCard({ player, metrics, index = 0, onClick }: FitnessCardProps) {
  const scoreColor =
    metrics.fitnessScore >= 80 ? '#22c55e' :
    metrics.fitnessScore >= 65 ? '#f59e0b' : '#ef4444';

  const bmiCategory =
    metrics.bmi < 18.5 ? { label: 'Underweight', color: 'text-amber-500' } :
    metrics.bmi < 25 ? { label: 'Normal', color: 'text-green-500' } :
    metrics.bmi < 30 ? { label: 'Overweight', color: 'text-amber-500' } :
    { label: 'Obese', color: 'text-red-500' };

  const metricItems = [
    { icon: Zap, label: 'Sprint', value: `${metrics.sprint}s`, color: '#6366f1' },
    { icon: Activity, label: 'Endurance', value: `Lvl ${metrics.endurance}`, color: '#06b6d4' },
    { icon: Gauge, label: 'Agility', value: `${metrics.agility}s`, color: '#a855f7' },
    { icon: Heart, label: 'Reaction', value: `${metrics.reactionTime}ms`, color: '#ef4444' },
    { icon: Moon, label: 'Sleep', value: `${metrics.sleep}h`, color: '#8b5cf6' },
    { icon: Droplet, label: 'Hydration', value: `${metrics.hydration}L`, color: '#3b82f6' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 shadow-lg overflow-hidden cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <div className="relative">
          <img src={player.photoUrl} alt={player.name} className="w-12 h-12 rounded-xl object-cover" />
          <div
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white dark:border-slate-900"
            style={{ backgroundColor: scoreColor }}
          >
            {metrics.fitnessScore}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{player.name}</h3>
          <p className="text-xs text-slate-500">{player.team} • {player.role}</p>
        </div>
      </div>

      {/* BMI bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500">BMI: {metrics.bmi}</span>
          <span className={cn('text-xs font-medium', bmiCategory.color)}>{bmiCategory.label}</span>
        </div>
        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min((metrics.bmi / 35) * 100, 100)}%`,
              backgroundColor: scoreColor,
            }}
          />
        </div>
        <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-400">
          <span>{metrics.weight}kg</span>
          <span>•</span>
          <span>{metrics.height}cm</span>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-px bg-slate-100 dark:bg-slate-800">
        {metricItems.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white dark:bg-slate-900 p-2.5 text-center">
              <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: item.color }} />
              <p className="text-xs font-bold text-slate-900 dark:text-white">{item.value}</p>
              <p className="text-[10px] text-slate-400">{item.label}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
