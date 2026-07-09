import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Trophy, Target, TrendingUp, Activity, Award } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { RadarChart, AreaChart } from '../components/ui/Charts';
import { mockPlayers, mockTeams, captainStats, generateChartData, chartColors } from '../lib/mock-data';
import { cn, getInitials } from '../lib/utils';

export function CaptainDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Captain Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Premier leadership intelligence</p>
        </div>
      </div>

      {/* Top 3 Captains */}
      <GlassCard gradient>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-warning-500 to-orange-500">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Captain Rankings</h3>
            <p className="text-sm text-slate-500">Based on Leadership Score</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {captainStats.slice(0, 3).map((captain, index) => (
            <motion.div
              key={captain.player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 rounded-2xl border-2"
              style={{ borderColor: index === 0 ? '#f59e0b' : '#cbd5e1' }}
            >
              <div className={cn(
                'w-16 h-16 mx-auto rounded-full flex items-center justify-center font-bold text-2xl',
                index === 0 ? 'bg-gradient-to-br from-warning-500 to-orange-500 text-white' :
                index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' :
                'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
              )}>
                {index + 1}
              </div>
              <p className="mt-4 font-bold text-slate-900 dark:text-white">{captain.player.full_name}</p>
              <p className="text-sm text-slate-500">{captain.team.short_name}</p>
              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-2xl font-bold text-primary-600">{captain.score}</p>
                <p className="text-xs text-slate-500">Leadership Score</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Captain Table */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">All Captains</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4">Captain</th>
                <th className="text-center py-3 px-3">Team</th>
                <th className="text-center py-3 px-3">Matches</th>
                <th className="text-center py-3 px-3">Wins</th>
                <th className="text-center py-3 px-3">Losses</th>
                <th className="text-center py-3 px-3">Win %</th>
                <th className="text-center py-3 px-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {captainStats.map((captain, index) => (
                <tr key={captain.player.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(captain.player.full_name)}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">{captain.player.full_name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 text-sm">{captain.team.short_name}</span>
                  </td>
                  <td className="py-4 px-3 text-center text-slate-600 dark:text-slate-400">{captain.matches}</td>
                  <td className="py-4 px-3 text-center text-success-600 font-medium">{captain.wins}</td>
                  <td className="py-4 px-3 text-center text-error-600 font-medium">{captain.losses}</td>
                  <td className="py-4 px-3 text-center">
                    <span className={cn('font-bold', captain.winPct >= 60 ? 'text-success-600' : captain.winPct >= 50 ? 'text-warning-600' : 'text-error-600')}>
                      {captain.winPct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className="px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 font-bold">{captain.score}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Leadership Radar</h3>
          <RadarChart categories={['Wins', 'Toss', 'Chase', 'Defense', 'Adaptation']} data={[85, 72, 88, 76, 82]} color={chartColors.warning} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Win Rate Trend</h3>
          <AreaChart data={generateChartData().slice(0, 8).map((d, i) => ({ x: i + 1, y: d.value }))} color={chartColors.success} height={250} />
        </GlassCard>
      </div>
    </div>
  );
}

export default CaptainDashboard;
