import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Trophy, Activity, Target, TrendingUp, Zap, Users } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { AreaChart, BarChart, RadarChart, LineChart } from '../components/ui/Charts';
import { mockPlayers, mockTeams, captainStats, chartColors } from '../lib/mock-data';
import { cn, getInitials } from '../lib/utils';

// Captain Impact Score Formula
// impact_score = (win_percentage * 0.40) + (chase_success * 0.20) + (defense_success * 0.20) + (team_run_rate * 0.20)

const extendedCaptainStats = [
  {
    player: mockPlayers[2], team: mockTeams[0],
    matches: 14, wins: 10, losses: 4, winPct: 71.4,
    tossWon: 8, tossLost: 6, electedBat: 3, electedBowl: 5,
    successfulChases: 5, chaseAttempts: 6, chaseSuccess: 83.3,
    defendedTotals: 5, defendedAttempts: 7, defenseSuccess: 71.4,
    avgWinMargin: 32.5, avgLossMargin: 18.2,
    teamRunRate: 8.9, impactScore: 87.5
  },
  {
    player: mockPlayers[4], team: mockTeams[7],
    matches: 14, wins: 9, losses: 5, winPct: 64.3,
    tossWon: 6, tossLost: 8, electedBat: 2, electedBowl: 6,
    successfulChases: 4, chaseAttempts: 5, chaseSuccess: 80,
    defendedTotals: 5, defendedAttempts: 8, defenseSuccess: 62.5,
    avgWinMargin: 28.4, avgLossMargin: 22.1,
    teamRunRate: 8.5, impactScore: 82.1
  },
  {
    player: mockPlayers[3], team: mockTeams[1],
    matches: 14, wins: 7, losses: 7, winPct: 50,
    tossWon: 7, tossLost: 7, electedBat: 4, electedBowl: 3,
    successfulChases: 3, chaseAttempts: 5, chaseSuccess: 60,
    defendedTotals: 4, defendedAttempts: 8, defenseSuccess: 50,
    avgWinMargin: 24.2, avgLossMargin: 28.5,
    teamRunRate: 8.2, impactScore: 72.3
  },
];

export function CaptainAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Captain Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Premium Leadership Intelligence Dashboard</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-warning-500 to-orange-500 text-white font-bold">
          <Crown className="w-5 h-5" />
          Flagship Feature
        </div>
      </div>

      {/* Impact Score Legend */}
      <GlassCard gradient>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-warning-500 to-orange-500">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Captain Impact Score Formula</h3>
            <p className="text-sm text-slate-500">Multi-dimensional leadership assessment</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { metric: 'Win Percentage', weight: '40%', color: chartColors.primary },
            { metric: 'Chase Success', weight: '20%', color: chartColors.success },
            { metric: 'Defense Success', weight: '20%', color: chartColors.cyan },
            { metric: 'Team Run Rate', weight: '20%', color: chartColors.warning },
          ].map((item) => (
            <div key={item.metric} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-xs text-slate-500">{item.metric}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: item.color }}>{item.weight}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
          <code className="text-sm text-slate-600 dark:text-slate-400">
            impact_score = (win_percentage × 0.40) + (chase_success × 0.20) + (defense_success × 0.20) + (team_run_rate × 0.20)
          </code>
        </div>
      </GlassCard>

      {/* Top 3 Captains */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {extendedCaptainStats.slice(0, 3).map((captain, index) => (
          <motion.div
            key={captain.player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard
              gradient
              className={`text-center ${index === 0 ? 'ring-2 ring-warning-500' : ''}`}
            >
              <div className={cn(
                'w-16 h-16 mx-auto rounded-full flex items-center justify-center font-bold text-2xl',
                index === 0 ? 'bg-gradient-to-br from-warning-500 to-orange-500 text-white' :
                index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' :
                'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
              )}>
                {index + 1}
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{captain.player.full_name}</h3>
              <p className="text-sm text-slate-500">{captain.team.short_name}</p>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-3xl font-bold text-primary-600">{captain.impactScore}</p>
                <p className="text-xs text-slate-500">Impact Score</p>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-1 text-xs">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50">
                  <p className="font-bold text-primary-600">{captain.winPct}%</p>
                  <p className="text-slate-400">Win%</p>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50">
                  <p className="font-bold text-success-600">{captain.chaseSuccess}%</p>
                  <p className="text-slate-400">Chase</p>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50">
                  <p className="font-bold text-cyan-600">{captain.defenseSuccess}%</p>
                  <p className="text-slate-400">Defense</p>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50">
                  <p className="font-bold text-warning-400">{captain.teamRunRate}</p>
                  <p className="text-slate-400">NRR</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Detailed Captain Table */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Complete Captain Rankings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-2">#</th>
                <th className="text-left py-3 px-2">Captain</th>
                <th className="text-center py-3 px-2">Matches</th>
                <th className="text-center py-3 px-2">Wins</th>
                <th className="text-center py-3 px-2">Win%</th>
                <th className="text-center py-3 px-2">Toss Won</th>
                <th className="text-center py-3 px-2">Chase%</th>
                <th className="text-center py-3 px-2">Defense%</th>
                <th className="text-center py-3 px-2">RR</th>
                <th className="text-center py-3 px-2">Impact</th>
              </tr>
            </thead>
            <tbody>
              {extendedCaptainStats.map((captain, index) => (
                <motion.tr
                  key={captain.player.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="py-4 px-2">
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      index < 3 ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    )}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(captain.player.full_name)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{captain.player.full_name}</p>
                        <p className="text-xs text-slate-500">{captain.team.short_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center text-slate-600">{captain.matches}</td>
                  <td className="py-4 px-2 text-center text-success-600 font-bold">{captain.wins}</td>
                  <td className="py-4 px-2 text-center font-bold text-primary-600">{captain.winPct}%</td>
                  <td className="py-4 px-2 text-center text-slate-600">{captain.tossWon}/{captain.tossLost}</td>
                  <td className="py-4 px-2 text-center text-success-600">{captain.chaseSuccess}%</td>
                  <td className="py-4 px-2 text-center text-cyan-600">{captain.defenseSuccess}%</td>
                  <td className="py-4 px-2 text-center text-warning-500">{captain.teamRunRate}</td>
                  <td className="py-4 px-2 text-center font-bold text-primary-600">{captain.impactScore}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Toss & Tactical Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Toss Analytics</h3>
          <div className="space-y-4">
            {extendedCaptainStats.map((captain) => (
              <div key={captain.player.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-900 dark:text-white">{captain.player.full_name}</span>
                  <span className="text-sm text-slate-500">Won: {captain.tossWon} | Lost: {captain.tossLost}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-primary-100 text-primary-600">Bat: {captain.electedBat}</span>
                  <span className="px-2 py-1 rounded bg-cyan-100 text-cyan-600">Bowl: {captain.electedBowl}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance Radars</h3>
          <div className="space-y-4">
            {extendedCaptainStats.slice(0, 2).map((captain, i) => (
              <RadarChart
                key={captain.player.id}
                categories={['Wins', 'Toss', 'Chase', 'Defense', 'Team NRR']}
                data={[captain.winPct, (captain.tossWon / captain.matches) * 100, captain.chaseSuccess, captain.defenseSuccess, captain.teamRunRate * 10]}
                color={i === 0 ? chartColors.warning : chartColors.cyan}
                height={180}
              />
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default CaptainAnalyticsPage;
