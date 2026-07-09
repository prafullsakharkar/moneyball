import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, TrendingUp, TrendingDown, Search, X, Zap, Gauge, Heart,
  Moon, Droplet, Scale, Ruler, Calendar, Award,
} from 'lucide-react';
import { GlassCard, KPIWidget } from '../../../components/ui/GlassCard';
import { LineChart, RadarChart, BarChart } from '../../../components/ui/Charts';
import { FitnessCard } from '../components';
import { trainingPlayers, mockFitnessMetrics, mockFitnessTrend } from '../services/mock-data';
import { chartColors } from '../../../lib/mock-data';
import type { FitnessMetrics, Player } from '../types';
import { cn } from '../../../lib/utils';

export function FitnessTracking() {
  const [query, setQuery] = React.useState('');
  const [selectedPlayer, setSelectedPlayer] = React.useState<{ player: Player; metrics: FitnessMetrics } | null>(null);

  const playersWithMetrics = trainingPlayers.slice(0, 12).map((p, i) => ({
    player: p,
    metrics: mockFitnessMetrics[i],
  }));

  const filtered = playersWithMetrics.filter(({ player }) =>
    !query || player.name.toLowerCase().includes(query.toLowerCase())
  );

  const avgScore = Math.round(mockFitnessMetrics.reduce((sum, m) => sum + m.fitnessScore, 0) / mockFitnessMetrics.length);
  const avgBMI = (mockFitnessMetrics.reduce((sum, m) => sum + m.bmi, 0) / mockFitnessMetrics.length).toFixed(1);
  const topScore = Math.max(...mockFitnessMetrics.map(m => m.fitnessScore));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Fitness Tracking</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor player fitness, BMI, and athletic metrics</p>
      </div>

      {/* KPI widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Avg Fitness Score" value={avgScore} icon={<Activity className="w-6 h-6" />} color={chartColors.success} delay={0} trend={{ value: 8, type: 'up' }} />
        <KPIWidget title="Avg BMI" value={avgBMI} icon={<Scale className="w-6 h-6" />} color={chartColors.primary} delay={1} />
        <KPIWidget title="Top Score" value={topScore} icon={<Award className="w-6 h-6" />} color={chartColors.warning} delay={2} />
        <KPIWidget title="Players Tracked" value={mockFitnessMetrics.length} icon={<Heart className="w-6 h-6" />} color={chartColors.cyan} delay={3} />
      </div>

      {/* Trend chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Fitness Score Trend (12 Weeks)</h3>
          <LineChart
            series={[
              { name: 'Fitness Score', data: mockFitnessTrend.map(t => t.fitnessScore), color: chartColors.success },
              { name: 'Strength', data: mockFitnessTrend.map(t => t.strength), color: chartColors.primary },
            ]}
            categories={mockFitnessTrend.map(t => t.week)}
            height={280}
          />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Athletic Profile</h3>
          <RadarChart
            categories={['Sprint', 'Endurance', 'Agility', 'Reaction', 'Sleep', 'Hydration']}
            data={[72, 85, 68, 78, 65, 82]}
            color={chartColors.primary}
            height={280}
          />
        </GlassCard>
      </div>

      {/* Comparison chart */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Player Fitness Comparison</h3>
        <BarChart
          data={playersWithMetrics.map(({ player, metrics }) => ({
            name: player.initials,
            value: metrics.fitnessScore,
            color: metrics.fitnessScore >= 80 ? chartColors.success : metrics.fitnessScore >= 65 ? chartColors.warning : chartColors.error,
          }))}
          height={250}
        />
      </GlassCard>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 max-w-md">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search players..."
          className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none"
        />
        {query && <button onClick={() => setQuery('')}><X className="w-3.5 h-3.5 text-slate-400" /></button>}
      </div>

      {/* Player fitness cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(({ player, metrics }, i) => (
          <FitnessCard
            key={player.id}
            player={player}
            metrics={metrics}
            index={i}
            onClick={() => setSelectedPlayer({ player, metrics })}
          />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Activity className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-400 text-lg">No players found</p>
        </div>
      )}

      {/* Player detail modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setSelectedPlayer(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto z-50"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="relative p-5 bg-gradient-to-br from-primary-500/10 to-cyan-500/10">
                  <button
                    onClick={() => setSelectedPlayer(null)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                  <div className="flex items-center gap-4">
                    <img src={selectedPlayer.player.photoUrl} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedPlayer.player.name}</h3>
                      <p className="text-sm text-slate-500">{selectedPlayer.player.team} • {selectedPlayer.player.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: selectedPlayer.metrics.fitnessScore >= 80 ? chartColors.success : selectedPlayer.metrics.fitnessScore >= 65 ? chartColors.warning : chartColors.error }}>
                          Score: {selectedPlayer.metrics.fitnessScore}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                  {/* Body metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <MetricBox icon={<Scale className="w-4 h-4" />} label="BMI" value={selectedPlayer.metrics.bmi.toString()} color={chartColors.primary} />
                    <MetricBox icon={<Scale className="w-4 h-4" />} label="Weight" value={`${selectedPlayer.metrics.weight}kg`} color={chartColors.cyan} />
                    <MetricBox icon={<Ruler className="w-4 h-4" />} label="Height" value={`${selectedPlayer.metrics.height}cm`} color={chartColors.purple} />
                  </div>

                  {/* Athletic metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <MetricBox icon={<Zap className="w-4 h-4" />} label="Sprint (100m)" value={`${selectedPlayer.metrics.sprint}s`} color={chartColors.primary} />
                    <MetricBox icon={<Activity className="w-4 h-4" />} label="Endurance" value={`Level ${selectedPlayer.metrics.endurance}`} color={chartColors.cyan} />
                    <MetricBox icon={<Gauge className="w-4 h-4" />} label="Agility (T-test)" value={`${selectedPlayer.metrics.agility}s`} color={chartColors.purple} />
                    <MetricBox icon={<Heart className="w-4 h-4" />} label="Reaction Time" value={`${selectedPlayer.metrics.reactionTime}ms`} color={chartColors.error} />
                  </div>

                  {/* Recovery metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <MetricBox icon={<Moon className="w-4 h-4" />} label="Avg Sleep" value={`${selectedPlayer.metrics.sleep}h`} color={chartColors.warning} />
                    <MetricBox icon={<Droplet className="w-4 h-4" />} label="Hydration" value={`${selectedPlayer.metrics.hydration}L`} color={chartColors.success} />
                  </div>

                  {/* Trend chart */}
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">12-Week Trend</p>
                    <LineChart
                      series={[{ name: 'Fitness Score', data: mockFitnessTrend.map(t => t.fitnessScore), color: chartColors.success }]}
                      categories={mockFitnessTrend.map(t => t.week)}
                      height={180}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricBox({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

export default FitnessTracking;
