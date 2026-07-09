import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Zap, Target, TrendingUp, DollarSign, Users, Award, Calculator } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { BarChart, DonutChart, RadarChart, LineChart } from '../components/ui/Charts';
import { mockPlayers, mockTeams, mvpPlayers, chartColors } from '../lib/mock-data';
import { cn, getInitials } from '../lib/utils';

// MVP Formula: runs + (wickets × 25) + (catches × 8) + (runouts × 12) + (stumpings × 12)

const mvpRankings = [
  { player: mockPlayers[4], team: mockTeams[7], runs: 498, wickets: 12, catches: 8, runouts: 2, stumpings: 0, batting: 498, bowling: 300, fielding: 88, total: 886 },
  { player: mockPlayers[5], team: mockTeams[0], runs: 234, wickets: 18, catches: 11, runouts: 3, stumpings: 0, batting: 234, bowling: 450, fielding: 124, total: 808 },
  { player: mockPlayers[6], team: mockTeams[7], runs: 890, wickets: 0, catches: 6, runouts: 0, stumpings: 0, batting: 890, bowling: 0, fielding: 48, total: 938 },
  { player: mockPlayers[3], team: mockTeams[1], runs: 756, wickets: 0, catches: 7, runouts: 1, stumpings: 0, batting: 756, bowling: 0, fielding: 68, total: 824 },
  { player: mockPlayers[1], team: mockTeams[1], runs: 24, wickets: 28, catches: 2, runouts: 0, stumpings: 0, batting: 24, bowling: 700, fielding: 16, total: 740 },
  { player: mockPlayers[2], team: mockTeams[0], runs: 340, wickets: 0, catches: 18, runouts: 2, stumpings: 4, batting: 340, bowling: 0, fielding: 184, total: 524 },
  { player: mockPlayers[7], team: mockTeams[6], runs: 12, wickets: 24, catches: 3, runouts: 1, stumpings: 0, batting: 12, bowling: 600, fielding: 36, total: 648 },
  { player: mockPlayers[0], team: mockTeams[2], runs: 678, wickets: 0, catches: 4, runouts: 0, stumpings: 0, batting: 678, bowling: 0, fielding: 32, total: 710 },
];

const fantasyStats = {
  totalPoints: { batting: 3456, bowling: 2292, fielding: 694 },
  avgPointsPerMatch: { top: 89.5, mid: 52.3, budget: 28.7 },
  credits: { total: 100, used: 94, remaining: 6 },
};

const fantasyTeams = [
  {
    name: 'Power Hitters XI',
    players: [mockPlayers[6], mockPlayers[3], mockPlayers[0]],
    totalPoints: 892,
    credits: 94.5,
    winRate: 78.5,
  },
  {
    name: 'All-Rounder Special',
    players: [mockPlayers[4], mockPlayers[5]],
    totalPoints: 756,
    credits: 88.0,
    winRate: 65.2,
  },
];

const playerPerformance = [
  { match: 1, points: 95, runs: 45, wickets: 2, catches: 1 },
  { match: 2, points: 78, runs: 23, wickets: 3, catches: 2 },
  { match: 3, points: 112, runs: 89, wickets: 0, catches: 0 },
  { match: 4, points: 88, runs: 34, wickets: 2, catches: 1 },
  { match: 5, points: 72, runs: 12, wickets: 1, catches: 3 },
];

// Sub-components
function MVPRankingsTab() {
  return (
    <div className="space-y-6">
      {/* MVP Formula Card */}
      <GlassCard gradient>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-warning-500 to-orange-500">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">MVP Formula</h3>
            <p className="text-sm text-slate-500">Multi-dimensional player valuation</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { metric: 'Runs', factor: 'x1', color: 'bg-primary-100 text-primary-600' },
            { metric: 'Wickets', factor: 'x25', color: 'bg-cyan-100 text-cyan-600' },
            { metric: 'Catches', factor: 'x8', color: 'bg-success-100 text-success-600' },
            { metric: 'Run Outs', factor: 'x12', color: 'bg-warning-100 text-warning-600' },
            { metric: 'Stumpings', factor: 'x12', color: 'bg-purple-100 text-purple-600' },
          ].map((item) => (
            <div key={item.metric} className={cn('p-3 rounded-xl text-center', item.color)}>
              <p className="text-xs font-medium">{item.metric}</p>
              <p className="text-xl font-bold">{item.factor}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
          <code className="text-sm text-slate-600 dark:text-slate-400">
            MVP Score = runs + (wickets x 25) + (catches x 8) + (runouts x 12) + (stumpings x 12)
          </code>
        </div>
      </GlassCard>

      {/* Top 3 MVPs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mvpRankings.slice(0, 3).map((mvp, index) => (
          <motion.div
            key={mvp.player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard
              gradient
              className={cn(
                'text-center',
                index === 0 ? 'ring-2 ring-warning-500' : ''
              )}
            >
              <div className={cn(
                'w-16 h-16 mx-auto rounded-full flex items-center justify-center font-bold text-2xl',
                index === 0 ? 'bg-gradient-to-br from-warning-500 to-orange-500 text-white' :
                index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' :
                'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
              )}>
                {index + 1}
              </div>

              <div className="w-20 h-20 mx-auto mt-4 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl">
                {getInitials(mvp.player.full_name)}
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{mvp.player.full_name}</h3>
              <p className="text-sm text-slate-500">{mvp.team.short_name}</p>

              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-4xl font-bold text-warning-500">{mvp.total}</p>
                <p className="text-xs text-slate-500">MVP Points</p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="p-2 rounded bg-primary-100 dark:bg-primary-900/30">
                  <p className="text-sm font-bold text-primary-600">{mvp.batting}</p>
                  <p className="text-xs text-slate-500">Bat</p>
                </div>
                <div className="p-2 rounded bg-cyan-100 dark:bg-cyan-900/30">
                  <p className="text-sm font-bold text-cyan-600">{mvp.bowling}</p>
                  <p className="text-xs text-slate-500">Bowl</p>
                </div>
                <div className="p-2 rounded bg-success-100 dark:bg-success-900/30">
                  <p className="text-sm font-bold text-success-600">{mvp.fielding}</p>
                  <p className="text-xs text-slate-500">Field</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Complete Rankings */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Complete MVP Rankings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-2">#</th>
                <th className="text-left py-3 px-2">Player</th>
                <th className="text-center py-3 px-2">Runs</th>
                <th className="text-center py-3 px-2">Wkts</th>
                <th className="text-center py-3 px-2">Cat</th>
                <th className="text-center py-3 px-2">RO</th>
                <th className="text-center py-3 px-2">St</th>
                <th className="text-center py-3 px-2">Batting</th>
                <th className="text-center py-3 px-2">Bowling</th>
                <th className="text-center py-3 px-2">Fielding</th>
                <th className="text-center py-3 px-2">MVP</th>
              </tr>
            </thead>
            <tbody>
              {mvpRankings.map((mvp, index) => (
                <motion.tr
                  key={mvp.player.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="py-4 px-2">
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      index < 3 ? 'bg-warning-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    )}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(mvp.player.full_name)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{mvp.player.full_name}</p>
                        <p className="text-xs text-slate-500">{mvp.team.short_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center text-slate-600">{mvp.runs}</td>
                  <td className="py-4 px-2 text-center text-slate-600">{mvp.wickets}</td>
                  <td className="py-4 px-2 text-center text-slate-600">{mvp.catches}</td>
                  <td className="py-4 px-2 text-center text-slate-600">{mvp.runouts}</td>
                  <td className="py-4 px-2 text-center text-slate-600">{mvp.stumpings}</td>
                  <td className="py-4 px-2 text-center font-bold text-primary-600">{mvp.batting}</td>
                  <td className="py-4 px-2 text-center font-bold text-cyan-600">{mvp.bowling}</td>
                  <td className="py-4 px-2 text-center font-bold text-success-600">{mvp.fielding}</td>
                  <td className="py-4 px-2 text-center">
                    <span className="px-2 py-1 rounded bg-warning-100 text-warning-600 font-bold">
                      {mvp.total}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

function FantasyStatsTab() {
  return (
    <div className="space-y-6">
      {/* Fantasy Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPIWidget
          title="Total Points"
          value={fantasyStats.totalPoints.batting + fantasyStats.totalPoints.bowling + fantasyStats.totalPoints.fielding}
          icon={<Star className="w-6 h-6" />}
          accent
        />
        <KPIWidget
          title="Avg Top Pick"
          value={fantasyStats.avgPointsPerMatch.top}
          suffix="pts"
        />
        <KPIWidget
          title="Credits Used"
          value={fantasyStats.credits.used}
          suffix={`/${fantasyStats.credits.total}`}
        />
        <KPIWidget
          title="Win Rate"
          value="72.4"
          suffix="%"
        />
      </div>

      {/* Points Distribution */}
      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Points Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <DonutChart
              data={[fantasyStats.totalPoints.batting, fantasyStats.totalPoints.bowling, fantasyStats.totalPoints.fielding]}
              labels={['Batting', 'Bowling', 'Fielding']}
              title=""
              height={240}
            />
          </div>
          <div className="space-y-4">
            {[
              { label: 'Batting Points', value: fantasyStats.totalPoints.batting, color: 'bg-primary-500', pct: 54 },
              { label: 'Bowling Points', value: fantasyStats.totalPoints.bowling, color: 'bg-cyan-500', pct: 35 },
              { label: 'Fielding Points', value: fantasyStats.totalPoints.fielding, color: 'bg-success-500', pct: 11 },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', item.color)}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Fantasy Teams */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Fantasy Teams</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fantasyTeams.map((team, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-gradient-to-br from-primary-500/10 to-cyan-500/10 border border-primary-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/20">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{team.name}</h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-success-100 text-success-600 text-sm font-medium">
                  {team.winRate}% Win
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">{team.totalPoints}</p>
                  <p className="text-xs text-slate-500">Total Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning-500">{team.credits}</p>
                  <p className="text-xs text-slate-500">Credits</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{team.players.length}</p>
                  <p className="text-xs text-slate-500">Players</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function PlayerValueTab() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Player Performance Over Time</h3>
        <div className="h-64">
          <LineChart
            data={playerPerformance.map(p => p.points)}
            categories={['MVP Points']}
            title=""
            height={240}
          />
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Value Analysis</h3>
          <div className="h-64">
            <RadarChart
              categories={['Consistency', 'Peak Points', 'Avg Points', 'Impact', 'Form']}
              data={[85, 92, 78, 88, 75]}
              color={chartColors.primary}
              height={240}
            />
          </div>
        </GlassCard>

        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Credit Value vs Points</h3>
          <div className="space-y-4">
            {mvpRankings.slice(0, 5).map((mvp, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-900 dark:text-white">{mvp.player.full_name}</span>
                  <span className="text-primary-600 font-bold">{mvp.total} pts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Credits: 9.5</span>
                  <span className="text-sm text-slate-400">|</span>
                  <span className="text-sm text-success-600 font-medium">
                    Value: {(mvp.total / 9.5).toFixed(1)} per credit
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export function MVPFantasyPage() {
  const [activeTab, setActiveTab] = React.useState('mvp');

  const tabs = [
    { id: 'mvp', label: 'MVP Rankings', icon: Crown },
    { id: 'fantasy', label: 'Fantasy Stats', icon: DollarSign },
    { id: 'value', label: 'Player Value', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">MVP & Fantasy Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Player valuation and fantasy insights</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-warning-500 to-orange-500 text-white font-bold">
          <Crown className="w-5 h-5" />
          Premium Feature
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-warning-500 to-orange-500 text-white shadow-lg'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'mvp' && <MVPRankingsTab />}
        {activeTab === 'fantasy' && <FantasyStatsTab />}
        {activeTab === 'value' && <PlayerValueTab />}
      </motion.div>
    </div>
  );
}

export default MVPFantasyPage;
