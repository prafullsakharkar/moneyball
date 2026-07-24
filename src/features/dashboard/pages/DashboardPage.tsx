import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Users, User, Target, TrendingUp, Zap, Flame, Calendar,
  Crown, Brain, ChevronRight, Award, Activity
} from 'lucide-react';
import { GlassCard, KPIWidget } from '../../../components/ui/GlassCard';
import { AreaChart, BarChart, DonutChart, LineChart } from '../../../components/ui/Charts';
import {
  dashboardMetrics, teamStandings, topBatsmen, topBowlers, mvpPlayers,
  aiInsights, generateChartData, chartColors
} from '../../../lib/mock-data';
import { cn } from '../../../lib/utils';

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Cricket Analytics & Tournament Intelligence</p>
        </div>
        <select className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300">
          <option>IPL 2024</option>
          <option>BBL 2023-24</option>
          <option>World Cup 2023</option>
        </select>
      </div>

      {/* KPI Widgets Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Total Tournaments" value={dashboardMetrics.totalTournaments} icon={<Trophy className="w-6 h-6" />} color={chartColors.primary} delay={0} trend={{ value: 10, type: 'up' }} />
        <KPIWidget title="Total Teams" value={dashboardMetrics.totalTeams} icon={<Users className="w-6 h-6" />} color={chartColors.cyan} delay={1} trend={{ value: 5, type: 'up' }} />
        <KPIWidget title="Total Players" value={dashboardMetrics.totalPlayers} icon={<User className="w-6 h-6" />} color={chartColors.purple} delay={2} trend={{ value: 8, type: 'up' }} />
        <KPIWidget title="Total Matches" value={dashboardMetrics.totalMatches} icon={<Calendar className="w-6 h-6" />} color={chartColors.success} delay={3} trend={{ value: 15, type: 'up' }} />
      </div>

      {/* KPI Widgets Row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Total Runs" value={dashboardMetrics.totalRuns} icon={<TrendingUp className="w-6 h-6" />} color={chartColors.primary} delay={4} />
        <KPIWidget title="Total Wickets" value={dashboardMetrics.totalWickets} icon={<Target className="w-6 h-6" />} color={chartColors.error} delay={5} />
        <KPIWidget title="Total Boundaries" value={dashboardMetrics.totalBoundaries} icon={<Zap className="w-6 h-6" />} color={chartColors.warning} delay={6} />
        <KPIWidget title="Total Sixes" value={dashboardMetrics.totalSixes} icon={<Flame className="w-6 h-6" />} color={chartColors.success} delay={7} trend={{ value: 12, type: 'up' }} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tournament Activity</h3>
          <AreaChart data={generateChartData().map((d, i) => ({ x: d.month, y: d.value }))} color={chartColors.primary} height={250} />
        </GlassCard>

        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Live Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500">Live Matches</p>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-1">3</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500">Avg Run Rate</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">8.4</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500">Avg Score</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">175</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500">Avg Win Margin</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">45</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* AI Insights & Team Standings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <GlassCard gradient>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {aiInsights.slice(0, 3).map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-l-4"
                style={{ borderColor: insight.priority === 'high' ? chartColors.error : insight.priority === 'medium' ? chartColors.warning : chartColors.cyan }}
              >
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">{insight.type}</p>
                <p className="font-medium text-slate-900 dark:text-white text-sm mt-1">{insight.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{insight.description}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Team Standings */}
        <GlassCard className="lg:col-span-2" hover>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Team Standings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2">#</th>
                  <th className="text-left py-2">Team</th>
                  <th className="text-center py-2">P</th>
                  <th className="text-center py-2">W</th>
                  <th className="text-center py-2">L</th>
                  <th className="text-center py-2">Pts</th>
                  <th className="text-center py-2">NRR</th>
                </tr>
              </thead>
              <tbody>
                {teamStandings.map((standing, index) => (
                  <tr key={standing.team_id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3">
                      <span className={cn(
                        'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                        index < 2 ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      )}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: `linear-gradient(135deg, ${standing.team.primary_color}, ${standing.team.secondary_color})` }}>
                          {standing.team.short_name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{standing.team.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center text-slate-600 dark:text-slate-400">{standing.matches}</td>
                    <td className="py-3 text-center text-success-600 font-medium">{standing.wins}</td>
                    <td className="py-3 text-center text-error-600 font-medium">{standing.losses}</td>
                    <td className="py-3 text-center font-bold text-slate-900 dark:text-white">{standing.points}</td>
                    <td className={cn('py-3 text-center font-medium', standing.nrr >= 0 ? 'text-success-600' : 'text-error-600')}>
                      {standing.nrr >= 0 ? '+' : ''}{standing.nrr.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orange Cap */}
        <GlassCard hover>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-warning-100 dark:bg-warning-900/30">
              <Award className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Orange Cap</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Top Run Scorers</p>
            </div>
          </div>
          <div className="space-y-3">
            {topBatsmen.slice(0, 5).map((item, index) => (
              <div key={item.player.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <span className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                  index === 0 ? 'bg-warning-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                )}>
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{item.player.full_name}</p>
                  <p className="text-xs text-slate-500">{item.team.short_name}</p>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">{item.runs}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Purple Cap */}
        <GlassCard hover>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-accent-purple-100 dark:bg-accent-purple-900/30">
              <Target className="w-5 h-5 text-accent-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Purple Cap</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Top Wicket Takers</p>
            </div>
          </div>
          <div className="space-y-3">
            {topBowlers.slice(0, 5).map((item, index) => (
              <div key={item.player.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <span className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                  index === 0 ? 'bg-accent-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                )}>
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{item.player.full_name}</p>
                  <p className="text-xs text-slate-500">{item.team.short_name}</p>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">{item.wickets}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* MVP Rankings */}
      <GlassCard gradient>
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-6 h-6 text-warning-500" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">MVP Rankings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {mvpPlayers.map((item, index) => (
            <motion.div
              key={item.player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50"
            >
              <div className={cn(
                'w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg',
                index === 0 ? 'bg-gradient-to-br from-warning-500 to-orange-500' : 'bg-gradient-to-br from-slate-400 to-slate-500'
              )}>
                {index + 1}
              </div>
              <p className="font-medium text-slate-900 dark:text-white mt-2 text-sm">{item.player.full_name}</p>
              <p className="text-xs text-slate-500">{item.team.short_name}</p>
              <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-2">{item.total}</p>
              <p className="text-xs text-slate-400">MVP Points</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export default Dashboard;