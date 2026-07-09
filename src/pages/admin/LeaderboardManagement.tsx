import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Award, Star, TrendingUp, Search, Filter, ChevronDown, X,
  Medal, Target, Activity, Users, BarChart3, RefreshCw
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface Performance {
  id: string;
  match_id: string;
  player_id: string;
  player_name: string;
  team: string;
  type: 'batting' | 'bowling' | 'all_round';
  rating: number;
  runs?: number;
  wickets?: number;
  catches?: number;
  match_impact: number;
  tournament: string;
  date: string;
}

interface MVPScore {
  player_id: string;
  player_name: string;
  team: string;
  total_points: number;
  batting_points: number;
  bowling_points: number;
  fielding_points: number;
  matches: number;
  avg_points: number;
  rank: number;
}

const mvpScores: MVPScore[] = [
  { player_id: 'p1', player_name: 'Virat Kohli', team: 'RCB', total_points: 856, batting_points: 642, bowling_points: 0, fielding_points: 214, matches: 14, avg_points: 61.1, rank: 1 },
  { player_id: 'p2', player_name: 'Ruturaj Gaikwad', team: 'CSK', total_points: 724, batting_points: 580, bowling_points: 24, fielding_points: 120, matches: 14, avg_points: 51.7, rank: 2 },
  { player_id: 'p3', player_name: 'Jasprit Bumrah', team: 'MI', total_points: 682, batting_points: 12, bowling_points: 654, fielding_points: 16, matches: 14, avg_points: 48.7, rank: 3 },
  { player_id: 'p4', player_name: 'Ravindra Jadeja', team: 'CSK', total_points: 645, batting_points: 312, bowling_points: 258, fielding_points: 75, matches: 14, avg_points: 46.1, rank: 4 },
  { player_id: 'p5', player_name: 'Varun Chakravarthy', team: 'KKR', total_points: 598, batting_points: 8, bowling_points: 582, fielding_points: 8, matches: 13, avg_points: 46.0, rank: 5 },
];

const bestPerformances: Performance[] = [
  { id: 'bp1', match_id: 'M45', player_id: 'p1', player_name: 'Virat Kohli', team: 'RCB', type: 'batting', rating: 98.5, runs: 113, match_impact: 95, tournament: 'IPL 2024', date: '2024-04-15' },
  { id: 'bp2', match_id: 'M42', player_id: 'p3', player_name: 'Jasprit Bumrah', team: 'MI', type: 'bowling', rating: 96.2, wickets: 5, match_impact: 92, tournament: 'IPL 2024', date: '2024-04-12' },
  { id: 'bp3', match_id: 'M38', player_id: 'p4', player_name: 'Ravindra Jadeja', team: 'CSK', type: 'all_round', rating: 94.8, runs: 45, wickets: 3, catches: 2, match_impact: 90, tournament: 'IPL 2024', date: '2024-04-08' },
  { id: 'bp4', match_id: 'M35', player_id: 'p5', player_name: 'Ruturaj Gaikwad', team: 'CSK', type: 'batting', rating: 93.5, runs: 108, match_impact: 88, tournament: 'IPL 2024', date: '2024-04-05' },
];

export function LeaderboardManagement() {
  const [activeTab, setActiveTab] = React.useState<'mvp' | 'performances'>('mvp');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);

  const getPerformanceIcon = (type: string) => {
    switch (type) {
      case 'batting': return Target;
      case 'bowling': return Activity;
      case 'all_round': return Star;
      default: return Medal;
    }
  };

  const getPerformanceColor = (type: string) => {
    switch (type) {
      case 'batting': return 'bg-primary-100 text-primary-600';
      case 'bowling': return 'bg-cyan-100 text-cyan-600';
      case 'all_round': return 'bg-warning-100 text-warning-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { bg: 'bg-gradient-to-r from-yellow-400 to-yellow-500', color: 'text-white', icon: '🥇' };
    if (rank === 2) return { bg: 'bg-gradient-to-r from-slate-300 to-slate-400', color: 'text-white', icon: '🥈' };
    if (rank === 3) return { bg: 'bg-gradient-to-r from-amber-600 to-amber-700', color: 'text-white', icon: '🥉' };
    return { bg: 'bg-slate-100 dark:bg-slate-800', color: 'text-slate-600 dark:text-slate-400', icon: '' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Leaderboards & MVP</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track MVP scores and best performances</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 font-medium hover:bg-slate-50">
          <RefreshCw className="w-4 h-4" />
          Recalculate
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'mvp', label: 'MVP Standings', icon: Trophy },
          { id: 'performances', label: 'Best Performances', icon: Star },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-primary-500 to-cyan-500 text-white shadow-lg'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* MVP Tab */}
      {activeTab === 'mvp' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Top 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mvpScores.slice(0, 3).map((player, i) => (
              <motion.div
                key={player.player_id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'relative p-6 rounded-2xl overflow-hidden',
                  i === 0 ? 'bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 border-2 border-yellow-400' :
                  i === 1 ? 'bg-gradient-to-br from-slate-200/50 to-slate-300/50 border-2 border-slate-300 dark:from-slate-700/50 dark:to-slate-600/50 dark:border-slate-600' :
                  'bg-gradient-to-br from-amber-600/20 to-amber-700/20 border-2 border-amber-600'
                )}
              >
                <div className="absolute -top-2 -right-2 text-5xl opacity-20">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                </div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                      {player.player_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{player.player_name}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{player.team}</p>
                    </div>
                    <div className="ml-auto text-4xl font-bold text-primary-600">#{player.rank}</div>
                  </div>

                  <div className="text-center mb-4">
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">{player.total_points}</p>
                    <p className="text-sm text-slate-500">Total Points</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                      <p className="text-lg font-bold text-primary-600">{player.batting_points}</p>
                      <p className="text-xs text-slate-500">Bat</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                      <p className="text-lg font-bold text-cyan-600">{player.bowling_points}</p>
                      <p className="text-xs text-slate-500">Bowl</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                      <p className="text-lg font-bold text-success-600">{player.fielding_points}</p>
                      <p className="text-xs text-slate-500">Field</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-500">{player.matches} matches</span>
                    <span className="font-medium">{player.avg_points} avg</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Full Table */}
          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4">Rank</th>
                    <th className="text-left py-3 px-4">Player</th>
                    <th className="text-center py-3 px-4">Points</th>
                    <th className="text-center py-3 px-4">Batting</th>
                    <th className="text-center py-3 px-4">Bowling</th>
                    <th className="text-center py-3 px-4">Fielding</th>
                    <th className="text-center py-3 px-4">Matches</th>
                    <th className="text-center py-3 px-4">Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {mvpScores.map((player) => {
                    const badge = getRankBadge(player.rank);
                    const Icon = getPerformanceIcon('all_round');
                    return (
                      <tr key={player.player_id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-4 px-4">
                          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center font-bold', badge.bg, badge.color)}>
                            {player.rank}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                              {player.player_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{player.player_name}</p>
                              <p className="text-xs text-slate-500">{player.team}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-slate-900 dark:text-white text-lg">{player.total_points}</td>
                        <td className="py-4 px-4 text-center text-primary-600">{player.batting_points}</td>
                        <td className="py-4 px-4 text-center text-cyan-600">{player.bowling_points}</td>
                        <td className="py-4 px-4 text-center text-success-600">{player.fielding_points}</td>
                        <td className="py-4 px-4 text-center text-slate-600">{player.matches}</td>
                        <td className="py-4 px-4 text-center font-medium">{player.avg_points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Performances Tab */}
      {activeTab === 'performances' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {bestPerformances.map((perf, i) => {
            const Icon = getPerformanceIcon(perf.type);
            return (
              <motion.div
                key={perf.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', getPerformanceColor(perf.type))}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{perf.player_name}</h3>
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs">{perf.team}</span>
                      </div>
                      <p className="text-sm text-slate-500 capitalize">{perf.type.replace('_', '-')} performance</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      {perf.runs !== undefined && (
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary-600">{perf.runs}</p>
                          <p className="text-xs text-slate-500">Runs</p>
                        </div>
                      )}
                      {perf.wickets !== undefined && (
                        <div className="text-center">
                          <p className="text-lg font-bold text-cyan-600">{perf.wickets}</p>
                          <p className="text-xs text-slate-500">Wickets</p>
                        </div>
                      )}
                      {perf.catches !== undefined && (
                        <div className="text-center">
                          <p className="text-lg font-bold text-success-600">{perf.catches}</p>
                          <p className="text-xs text-slate-500">Catches</p>
                        </div>
                      )}
                    </div>

                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-warning-400 to-warning-500 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-lg font-bold text-white">{perf.rating}</p>
                        <p className="text-xs text-white/80">Rating</p>
                      </div>
                    </div>

                    <div className="w-16">
                      <div className="text-center mb-1">
                        <span className="text-sm font-medium text-slate-600">Impact</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-cyan-500" style={{ width: `${perf.match_impact}%` }} />
                      </div>
                      <p className="text-xs text-center mt-1 text-slate-500">{perf.match_impact}%</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-600">{perf.tournament}</p>
                      <p className="text-xs text-slate-500">{perf.date}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

export default LeaderboardManagement;
