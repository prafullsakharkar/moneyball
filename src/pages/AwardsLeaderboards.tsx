import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Trophy, Medal, Star, Target, TrendingUp, Award, Zap, Users, CircleDot } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { BarChart, AreaChart, DonutChart } from '../components/ui/Charts';
import { mockPlayers, mockTeams, topBatsmen, topBowlers, chartColors } from '../lib/mock-data';
import { cn, getInitials } from '../lib/utils';

// Extended awards data
const awardCategories = [
  {
    title: 'Orange Cap',
    description: 'Most Runs',
    leader: { player: mockPlayers[6], value: 890, team: mockTeams[7] },
    icon: Target,
    color: 'from-orange-500 to-red-500',
    previousWinners: [
      { player: mockPlayers[0], value: 973, year: 2016 },
      { player: mockPlayers[6], value: 890, year: 2023 },
    ],
  },
  {
    title: 'Purple Cap',
    description: 'Most Wickets',
    leader: { player: mockPlayers[1], value: 32, team: mockTeams[1] },
    icon: Zap,
    color: 'from-purple-500 to-indigo-500',
    previousWinners: [
      { player: mockPlayers[7], value: 32, year: 2022 },
    ],
  },
  {
    title: 'Most Sixes',
    description: 'Maximum Hits',
    leader: { player: mockPlayers[3], value: 52, team: mockTeams[1] },
    icon: TrendingUp,
    color: 'from-primary-500 to-cyan-500',
    previousWinners: [],
  },
  {
    title: 'Best Strike Rate',
    description: 'Min 100 balls',
    leader: { player: mockPlayers[4], value: 156.7, team: mockTeams[7] },
    icon: Zap,
    color: 'from-success-500 to-emerald-500',
    previousWinners: [],
  },
  {
    title: 'Best Economy',
    description: 'Min 30 overs',
    leader: { player: mockPlayers[1], value: 6.8, team: mockTeams[1] },
    icon: Target,
    color: 'from-cyan-500 to-blue-500',
    previousWinners: [],
  },
  {
    title: 'Most Catches',
    description: 'Fielding Excellence',
    leader: { player: mockPlayers[2], value: 18, team: mockTeams[0] },
    icon: Star,
    color: 'from-warning-500 to-orange-500',
    previousWinners: [],
  },
];

const seasonLeaderboards = {
  batting: topBatsmen.slice(0, 5),
  bowling: topBowlers.slice(0, 5),
  allRounder: [
    { rank: 1, player: mockPlayers[4], team: mockTeams[7], score: 886 },
    { rank: 2, player: mockPlayers[5], team: mockTeams[0], score: 808 },
    { rank: 3, player: mockPlayers[0], team: mockTeams[2], score: 710 },
    { rank: 4, player: mockPlayers[3], team: mockTeams[1], score: 624 },
    { rank: 5, player: mockPlayers[6], team: mockTeams[7], score: 598 },
  ],
};

const milestoneTracker = [
  { player: mockPlayers[6], milestone: '1000 runs', current: 890, target: 1000, progress: 89 },
  { player: mockPlayers[1], milestone: '35 wickets', current: 32, target: 35, progress: 91.4 },
  { player: mockPlayers[3], milestone: '60 sixes', current: 52, target: 60, progress: 86.7 },
  { player: mockPlayers[0], milestone: '10 centuries', current: 8, target: 10, progress: 80 },
];

const hallOfFame = [
  { player: mockPlayers[2], achievement: 'Best Captain - 5 IPL Titles', year: 2023, team: mockTeams[0] },
  { player: mockPlayers[0], achievement: 'Most Runs in IPL History - 8000+', year: 2023, team: mockTeams[2] },
  { player: mockPlayers[1], achievement: 'Best Economy Rate in a Season', year: 2020, team: mockTeams[1] },
];

// Sub-components
function AwardsOverview() {
  return (
    <div className="space-y-6">
      {/* Award Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {awardCategories.map((award, index) => (
          <motion.div
            key={award.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard gradient className="h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br',
                  award.color
                )}>
                  <award.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{award.title}</h3>
                  <p className="text-sm text-slate-500">{award.description}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {getInitials(award.leader.player.full_name)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{award.leader.player.full_name}</p>
                    <p className="text-xs text-slate-500">{award.leader.team.short_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">{award.leader.value}</p>
                    <p className="text-xs text-slate-500">Leader</p>
                  </div>
                </div>
              </div>

              {award.previousWinners.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-slate-500 font-medium">Previous Winners</p>
                  {award.previousWinners.map((winner, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">{winner.player.full_name}</span>
                      <span className="font-medium text-slate-900 dark:text-white">{winner.value} ({winner.year})</span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Milestone Tracker */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Milestone Tracker</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestoneTracker.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(m.player.full_name)}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{m.player.full_name}</p>
                  <p className="text-xs text-slate-500">{m.milestone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-medium text-slate-900 dark:text-white">{m.current}/{m.target}</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      m.progress >= 90 ? 'bg-success-500' : m.progress >= 70 ? 'bg-warning-500' : 'bg-primary-500'
                    )}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
                <p className="text-xs text-center text-slate-500">{m.progress}% Complete</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Hall of Fame */}
      <GlassCard gradient>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-warning-500 to-orange-500">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Hall of Fame</h3>
            <p className="text-sm text-slate-500">Legendary achievements</p>
          </div>
        </div>

        <div className="space-y-4">
          {hallOfFame.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-gradient-to-r from-warning-500/10 to-orange-500/10 border border-warning-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warning-500 to-orange-500 flex items-center justify-center text-white font-bold">
                  {getInitials(entry.player.full_name)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white">{entry.player.full_name}</p>
                  <p className="text-sm text-slate-500">{entry.achievement}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-warning-500">{entry.year}</p>
                  <p className="text-xs text-slate-500">{entry.team.short_name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function BattingLeaderboard() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Batsmen - Season 2024</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-2">#</th>
                <th className="text-left py-3 px-2">Player</th>
                <th className="text-center py-3 px-2">Runs</th>
                <th className="text-center py-3 px-2">Avg</th>
                <th className="text-center py-3 px-2">SR</th>
                <th className="text-center py-3 px-2">HS</th>
              </tr>
            </thead>
            <tbody>
              {seasonLeaderboards.batting.map((b, index) => (
                <motion.tr
                  key={b.player.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="py-4 px-2">
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      index < 3 ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    )}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(b.player.full_name)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{b.player.full_name}</p>
                        <p className="text-xs text-slate-500">{b.team.short_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center font-bold text-orange-500">{b.runs}</td>
                  <td className="py-4 px-2 text-center text-slate-600">{b.avg}</td>
                  <td className="py-4 px-2 text-center text-cyan-600">{b.sr}</td>
                  <td className="py-4 px-2 text-center text-success-600">-</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Average Comparison</h3>
          <div className="h-64">
            <BarChart
              data={seasonLeaderboards.batting.map(b => b.avg)}
              categories={seasonLeaderboards.batting.map(b => b.player.last_name)}
              title=""
              height={240}
            />
          </div>
        </GlassCard>

        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Strike Rate Comparison</h3>
          <div className="h-64">
            <BarChart
              data={seasonLeaderboards.batting.map(b => b.sr)}
              categories={seasonLeaderboards.batting.map(b => b.player.last_name)}
              title=""
              height={240}
            />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function BowlingLeaderboard() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Bowlers - Season 2024</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-2">#</th>
                <th className="text-left py-3 px-2">Player</th>
                <th className="text-center py-3 px-2">Wickets</th>
                <th className="text-center py-3 px-2">Avg</th>
                <th className="text-center py-3 px-2">Econ</th>
                <th className="text-center py-3 px-2">Best</th>
              </tr>
            </thead>
            <tbody>
              {seasonLeaderboards.bowling.map((b, index) => (
                <motion.tr
                  key={b.player.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="py-4 px-2">
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      index < 3 ? 'bg-purple-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    )}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(b.player.full_name)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{b.player.full_name}</p>
                        <p className="text-xs text-slate-500">{b.team.short_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center font-bold text-purple-500">{b.wickets}</td>
                  <td className="py-4 px-2 text-center text-slate-600">{b.avg}</td>
                  <td className="py-4 px-2 text-center text-cyan-600">{b.economy}</td>
                  <td className="py-4 px-2 text-center text-success-600">-</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Wickets Distribution</h3>
          <div className="h-64">
            <DonutChart
              data={seasonLeaderboards.bowling.map(b => b.wickets)}
              labels={seasonLeaderboards.bowling.map(b => b.player.last_name)}
              title=""
              height={240}
            />
          </div>
        </GlassCard>

        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Economy Comparison</h3>
          <div className="h-64">
            <BarChart
              data={seasonLeaderboards.bowling.map(b => b.economy)}
              categories={seasonLeaderboards.bowling.map(b => b.player.last_name)}
              title=""
              height={240}
            />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function AllRounderLeaderboard() {
  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top All-Rounders - Season 2024</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {seasonLeaderboards.allRounder.map((ar, index) => (
            <motion.div
              key={ar.player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center"
            >
              <div className={cn(
                'w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold text-white',
                index === 0 ? 'bg-gradient-to-br from-warning-500 to-orange-500' :
                index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400' :
                index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                'bg-slate-200 dark:bg-slate-700 text-slate-600'
              )}>
                {index + 1}
              </div>

              <div className="w-14 h-14 mx-auto mt-3 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                {getInitials(ar.player.full_name)}
              </div>

              <p className="mt-2 font-medium text-slate-900 dark:text-white text-sm">{ar.player.full_name}</p>
              <p className="text-xs text-slate-500">{ar.team.short_name}</p>

              <div className="mt-3 p-2 rounded bg-white dark:bg-slate-700">
                <p className="text-xl font-bold text-primary-600">{ar.score}</p>
                <p className="text-xs text-slate-500">Points</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">All-Rounder Performance</h3>
        <div className="h-64">
          <BarChart
            data={seasonLeaderboards.allRounder.map(ar => ar.score)}
            categories={seasonLeaderboards.allRounder.map(ar => ar.player.last_name)}
            title=""
            height={240}
          />
        </div>
      </GlassCard>
    </div>
  );
}

export function AwardsLeaderboardsPage() {
  const [activeTab, setActiveTab] = React.useState('awards');

  const tabs = [
    { id: 'awards', label: 'Awards', icon: Crown },
    { id: 'batting', label: 'Batting', icon: Target },
    { id: 'bowling', label: 'Bowling', icon: CircleDot },
    { id: 'allrounder', label: 'All-Rounders', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Awards & Leaderboards</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Season achievements and rankings</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-warning-500 to-orange-500 text-white font-bold">
          <Trophy className="w-5 h-5" />
          Season 2024
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
        {activeTab === 'awards' && <AwardsOverview />}
        {activeTab === 'batting' && <BattingLeaderboard />}
        {activeTab === 'bowling' && <BowlingLeaderboard />}
        {activeTab === 'allrounder' && <AllRounderLeaderboard />}
      </motion.div>
    </div>
  );
}

export default AwardsLeaderboardsPage;
