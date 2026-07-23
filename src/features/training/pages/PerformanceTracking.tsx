import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Target, Award, Activity, Dumbbell,
  Zap, ChevronRight, Trophy, Target as TargetIcon,
} from 'lucide-react';
import { GlassCard, KPIWidget } from '../../../components/ui/GlassCard';
import { LineChart, BarChart, RadarChart, GaugeChart } from '../../../components/ui/Charts';
import { mockPerformanceKPIs, mockFitnessTrend } from '../services/mock-data';
import { chartColors } from '../../../lib/mock-data';
import type { PerformanceKPI } from '../types';
import { cn } from '../../../lib/utils';

type Category = 'all' | 'batting' | 'bowling' | 'fielding' | 'fitness';

const categoryConfig: Record<Exclude<Category, 'all'>, { label: string; icon: React.ElementType; color: string }> = {
  batting: { label: 'Batting', icon: Trophy, color: '#6366f1' },
  bowling: { label: 'Bowling', icon: TargetIcon, color: '#06b6d4' },
  fielding: { label: 'Fielding', icon: Activity, color: '#22c55e' },
  fitness: { label: 'Fitness', icon: Dumbbell, color: '#f59e0b' },
};

export function PerformanceTracking() {
  const [activeCategory, setActiveCategory] = React.useState<Category>('all');

  const filteredKPIs = activeCategory === 'all'
    ? mockPerformanceKPIs
    : mockPerformanceKPIs.filter(k => k.category === activeCategory);

  const categories = Object.keys(categoryConfig) as Exclude<Category, 'all'>[];

  // Calculate overall progress
  const overallProgress = Math.round(
    mockPerformanceKPIs.reduce((sum, kpi) => {
      const progress = kpi.target > kpi.previous
        ? ((kpi.current - kpi.previous) / (kpi.target - kpi.previous)) * 100
        : 0;
      return sum + Math.min(progress, 100);
    }, 0) / mockPerformanceKPIs.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Performance Tracking</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track player progress across batting, bowling, fielding, and fitness</p>
      </div>

      {/* Overall KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Batting Progress" value="85%" icon={<Trophy className="w-6 h-6" />} color={chartColors.primary} delay={0} trend={{ value: 12, type: 'up' }} />
        <KPIWidget title="Bowling Progress" value="78%" icon={<TargetIcon className="w-6 h-6" />} color={chartColors.cyan} delay={1} trend={{ value: 8, type: 'up' }} />
        <KPIWidget title="Fielding Progress" value="82%" icon={<Activity className="w-6 h-6" />} color={chartColors.success} delay={2} trend={{ value: 6, type: 'up' }} />
        <KPIWidget title="Fitness Progress" value="91%" icon={<Dumbbell className="w-6 h-6" />} color={chartColors.warning} delay={3} trend={{ value: 15, type: 'up' }} />
      </div>

      {/* Overall gauge + radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Overall Progress</h3>
          <GaugeChart value={overallProgress} height={200} />
          <p className="text-sm text-slate-500 mt-2">Towards target goals</p>
        </GlassCard>
        <GlassCard className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance Radar</h3>
          <RadarChart
            categories={['Batting Avg', 'Strike Rate', 'Bowling Avg', 'Economy', 'Catch %', 'Fitness']}
            data={[85, 92, 78, 72, 88, 91]}
            color={chartColors.primary}
            height={220}
          />
        </GlassCard>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            'px-3 py-2 rounded-xl text-sm font-medium transition-colors',
            activeCategory === 'all'
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          )}
        >
          All Categories
        </button>
        {categories.map(cat => {
          const config = categoryConfig[cat];
          const Icon = config.icon;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? 'all' : cat)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                activeCategory === cat
                  ? 'text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
              style={activeCategory === cat ? { backgroundColor: config.color } : undefined}
            >
              <Icon className="w-3.5 h-3.5" />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredKPIs.map((kpi, i) => (
          <KPICard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Progress charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Fitness Progress Trend</h3>
          <LineChart
            series={[
              { name: 'Fitness Score', data: mockFitnessTrend.map(t => t.fitnessScore), color: chartColors.warning },
              { name: 'Strength', data: mockFitnessTrend.map(t => t.strength), color: chartColors.primary },
              { name: 'Endurance', data: mockFitnessTrend.map(t => t.endurance * 5), color: chartColors.cyan },
            ]}
            categories={mockFitnessTrend.map(t => t.week)}
            height={260}
          />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Category Comparison</h3>
          <BarChart
            data={[
              { name: 'Batting', value: 85, color: chartColors.primary },
              { name: 'Bowling', value: 78, color: chartColors.cyan },
              { name: 'Fielding', value: 82, color: chartColors.success },
              { name: 'Fitness', value: 91, color: chartColors.warning },
            ]}
            height={260}
          />
        </GlassCard>
      </div>

      {/* Improvement areas */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Key Improvement Areas</h3>
        <div className="space-y-3">
          {mockPerformanceKPIs.filter(k => k.current < k.target * 0.85).map((kpi, i) => {
            const config = categoryConfig[kpi.category];
            const Icon = config.icon;
            const gap = Math.round(kpi.target - kpi.current);
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{kpi.label}</p>
                  <p className="text-xs text-slate-500">Current: {kpi.current}{kpi.unit} • Target: {kpi.target}{kpi.unit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%`,
                        backgroundColor: config.color,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500">{gap} {kpi.unit} to go</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

function KPICard({ kpi, index }: { kpi: PerformanceKPI; index: number }) {
  const config = categoryConfig[kpi.category];
  const Icon = config.icon;
  const progress = kpi.target > kpi.previous
    ? Math.min(((kpi.current - kpi.previous) / (kpi.target - kpi.previous)) * 100, 100)
    : 0;
  const change = kpi.current - kpi.previous;
  const isPositive = change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -4 }}
      className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 shadow-lg p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium text-slate-500 capitalize">{kpi.category}</span>
        </div>
        <div className={cn(
          'flex items-center gap-1 text-xs font-bold',
          isPositive ? 'text-green-500' : 'text-red-500'
        )}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(change).toFixed(1)}
        </div>
      </div>

      {/* Value */}
      <p className="text-2xl font-bold text-slate-900 dark:text-white">
        {kpi.current}{kpi.unit}
      </p>
      <p className="text-sm text-slate-500 mt-0.5">{kpi.label}</p>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Prev: {kpi.previous}{kpi.unit}</span>
          <span>Target: {kpi.target}{kpi.unit}</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: config.color }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1 text-right">{progress.toFixed(0)}% to target</p>
      </div>
    </motion.div>
  );
}

export default PerformanceTracking;
