import React from 'react';
import { motion } from 'framer-motion';
import { Swords, Users, Target, TrendingUp, Crown, Trophy, BarChart2, Activity } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { AreaChart, BarChart, LineChart, DonutChart, RadarChart } from '../components/ui/Charts';
import { mockTeams, mockPlayers, chartColors } from '../lib/mock-data';
import { cn, getInitials } from '../lib/utils';

// H2H mock data
const teamVsTeam = {
  team1: mockTeams[0],
  team2: mockTeams[1],
  totalMatches: 38,
  team1Wins: 22,
  team2Wins: 16,
  noResult: 0,
  recentMatches: [
    { date: '2024-05-15', winner: mockTeams[0], venue: 'Chennai', margin: '6 wickets' },
    { date: '2024-04-08', winner: mockTeams[1], venue: 'Mumbai', margin: '18 runs' },
    { date: '2023-08-20', winner: mockTeams[0], venue: 'Dubai', margin: '4 wickets' },
  ],
  venueStats: {
    chennai: { matches: 15, team1Wins: 12, team2Wins: 3 },
    mumbai: { matches: 16, team1Wins: 8, team2Wins: 8 },
    neutral: { matches: 7, team1Wins: 2, team2Wins: 5 },
  },
};

const playerVsTeam = [
  { player: mockPlayers[0], vsTeam: mockTeams[1], matches: 28, runs: 987, avg: 45.3, sr: 138.5, best: '92*', fifties: 8, hundreds: 2 },
  { player: mockPlayers[6], vsTeam: mockTeams[1], matches: 12, runs: 456, avg: 38.0, sr: 142.3, best: '84', fifties: 4, hundreds: 0 },
  { player: mockPlayers[1], vsTeam: mockTeams[0], matches: 15, wickets: 28, avg: 18.2, economy: 7.1, best: '5/21', fourWickets: 3 },
  { player: mockPlayers[7], vsTeam: mockTeams[0], matches: 18, wickets: 22, avg: 21.5, economy: 7.8, best: '4/18', fourWickets: 2 },
];

const playerVsBowler = [
  { batsman: mockPlayers[0], bowler: mockPlayers[1], balls: 45, runs: 56, dismissals: 2, dots: 18, boundaries: 6, sr: 124.4 },
  { batsman: mockPlayers[3], bowler: mockPlayers[7], balls: 38, runs: 42, dismissals: 3, dots: 15, boundaries: 4, sr: 110.5 },
  { batsman: mockPlayers[6], bowler: mockPlayers[5], balls: 52, runs: 68, dismissals: 1, dots: 12, boundaries: 8, sr: 130.8 },
];

const powerplayComparison = {
  team1: { avg_runs: 48.5, avg_wickets: 0.8, boundary_pct: 42 },
  team2: { avg_runs: 52.3, avg_wickets: 1.2, boundary_pct: 38 },
};

const deathOversComparison = {
  team1: { avg_runs: 48.0, avg_wickets: 1.5, boundary_pct: 38, economy: 9.6 },
  team2: { avg_runs: 44.5, avg_wickets: 1.8, boundary_pct: 42, economy: 8.9 },
};

// Sub-components
function TeamVsTeamTab() {
  const winPct = ((teamVsTeam.team1Wins / teamVsTeam.totalMatches) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Head-to-Head Summary */}
      <GlassCard gradient>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500">
            <Swords className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Head-to-Head Record</h3>
            <p className="text-sm text-slate-500">All-time rivalry statistics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Team 1 */}
          <div className="text-center p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-warning-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
              {teamVsTeam.team1.short_name}
            </div>
            <p className="mt-4 font-bold text-slate-900 dark:text-white">{teamVsTeam.team1.name}</p>
            <p className="text-4xl font-bold text-success-600 mt-2">{teamVsTeam.team1Wins}</p>
            <p className="text-sm text-slate-500">wins</p>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white">
              <div>
                <p className="text-3xl font-bold">{teamVsTeam.totalMatches}</p>
                <p className="text-xs opacity-80">Total</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-primary-600 font-medium">{winPct}% in favor of {teamVsTeam.team1.short_name}</p>
          </div>

          {/* Team 2 */}
          <div className="text-center p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl">
              {teamVsTeam.team2.short_name}
            </div>
            <p className="mt-4 font-bold text-slate-900 dark:text-white">{teamVsTeam.team2.name}</p>
            <p className="text-4xl font-bold text-slate-600 mt-2">{teamVsTeam.team2Wins}</p>
            <p className="text-sm text-slate-500">wins</p>
          </div>
        </div>
      </GlassCard>

      {/* Venue-wise Stats */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Venue-wise Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(teamVsTeam.venueStats).map(([venue, stats]) => (
            <div key={venue} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="font-medium text-slate-900 dark:text-white capitalize mb-3">{venue}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Matches</span>
                  <span className="font-medium text-slate-900 dark:text-white">{stats.matches}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warning-600">{teamVsTeam.team1.short_name}</span>
                  <span className="font-medium text-success-600">{stats.team1Wins}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-600">{teamVsTeam.team2.short_name}</span>
                  <span className="font-medium text-slate-600">{stats.team2Wins}</span>
                </div>
              </div>
              <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-warning-500"
                  style={{ width: `${(stats.team1Wins / stats.matches) * 100}%` }}
                />
                <div
                  className="h-full bg-primary-500"
                  style={{ width: `${(stats.team2Wins / stats.matches) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Phase-wise Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Powerplay Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-warning-500/10">
              <p className="text-xs text-warning-600 font-medium">{teamVsTeam.team1.short_name}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="text-slate-500">Avg Runs:</span> <span className="font-bold text-slate-900 dark:text-white">{powerplayComparison.team1.avg_runs}</span></p>
                <p><span className="text-slate-500">Avg Wkts:</span> <span className="font-bold text-slate-900 dark:text-white">{powerplayComparison.team1.avg_wickets}</span></p>
                <p><span className="text-slate-500">Boundary%:</span> <span className="font-bold text-slate-900 dark:text-white">{powerplayComparison.team1.boundary_pct}%</span></p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-primary-500/10">
              <p className="text-xs text-primary-600 font-medium">{teamVsTeam.team2.short_name}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="text-slate-500">Avg Runs:</span> <span className="font-bold text-slate-900 dark:text-white">{powerplayComparison.team2.avg_runs}</span></p>
                <p><span className="text-slate-500">Avg Wkts:</span> <span className="font-bold text-slate-900 dark:text-white">{powerplayComparison.team2.avg_wickets}</span></p>
                <p><span className="text-slate-500">Boundary%:</span> <span className="font-bold text-slate-900 dark:text-white">{powerplayComparison.team2.boundary_pct}%</span></p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Death Overs Stats (16-20)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-warning-500/10">
              <p className="text-xs text-warning-600 font-medium">{teamVsTeam.team1.short_name}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="text-slate-500">Avg Runs:</span> <span className="font-bold text-slate-900 dark:text-white">{deathOversComparison.team1.avg_runs}</span></p>
                <p><span className="text-slate-500">Economy:</span> <span className="font-bold text-error-500">{deathOversComparison.team1.economy}</span></p>
                <p><span className="text-slate-500">Boundary%:</span> <span className="font-bold text-slate-900 dark:text-white">{deathOversComparison.team1.boundary_pct}%</span></p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-primary-500/10">
              <p className="text-xs text-primary-600 font-medium">{teamVsTeam.team2.short_name}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="text-slate-500">Avg Runs:</span> <span className="font-bold text-slate-900 dark:text-white">{deathOversComparison.team2.avg_runs}</span></p>
                <p><span className="text-slate-500">Economy:</span> <span className="font-bold text-success-600">{deathOversComparison.team2.economy}</span></p>
                <p><span className="text-slate-500">Boundary%:</span> <span className="font-bold text-slate-900 dark:text-white">{deathOversComparison.team2.boundary_pct}%</span></p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Matches */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Encounters</h3>
        <div className="space-y-3">
          {teamVsTeam.recentMatches.map((match, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold',
                  match.winner.id === teamVsTeam.team1.id ? 'bg-warning-500' : 'bg-primary-500'
                )}>
                  {match.winner.short_name}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{match.winner.name} won</p>
                  <p className="text-sm text-slate-500">{match.venue} | {match.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary-600">by {match.margin}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function PlayerVsTeamTab() {
  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Player vs Team Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-2">Player</th>
                <th className="text-left py-3 px-2">vs Team</th>
                <th className="text-center py-3 px-2">Mat</th>
                <th className="text-center py-3 px-2">Runs/Wkts</th>
                <th className="text-center py-3 px-2">Avg</th>
                <th className="text-center py-3 px-2">SR/Econ</th>
                <th className="text-center py-3 px-2">Best</th>
                <th className="text-center py-3 px-2">50s/4w</th>
              </tr>
            </thead>
            <tbody>
              {playerVsTeam.map((p, i) => {
                const isBatsman = 'runs' in p;
                return (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                          {getInitials(p.player.full_name)}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{p.player.full_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="px-2 py-1 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-xs font-medium">
                        {p.vsTeam.short_name}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center text-slate-600">{p.matches}</td>
                    <td className="py-4 px-2 text-center font-bold text-primary-600">
                      {isBatsman ? p.runs : p.wickets}
                    </td>
                    <td className="py-4 px-2 text-center text-slate-600">{p.avg}</td>
                    <td className="py-4 px-2 text-center font-medium text-cyan-600">
                      {isBatsman ? p.sr : p.economy}
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="px-2 py-1 rounded bg-success-100 text-success-600 text-xs font-medium">
                        {p.best}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center text-success-600 font-bold">
                      {isBatsman ? p.fifties : p.fourWickets}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Batsmen Performance</h3>
          <div className="h-64">
            <BarChart
              data={playerVsTeam.filter(p => 'runs' in p).map(p => p.runs)}
              categories={playerVsTeam.filter(p => 'runs' in p).map(p => p.player.last_name)}
              title=""
              height={240}
            />
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Bowlers Performance</h3>
          <div className="h-64">
            <BarChart
              data={playerVsTeam.filter(p => 'wickets' in p).map(p => p.wickets)}
              categories={playerVsTeam.filter(p => 'wickets' in p).map(p => p.player.last_name)}
              title=""
              height={240}
            />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function PlayerVsBowlerTab() {
  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-error-500 to-warning-500">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Player vs Bowler Matchups</h3>
            <p className="text-sm text-slate-500">Individual battle statistics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {playerVsBowler.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                    {getInitials(m.batsman.full_name)}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Batsman</p>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{m.batsman.full_name}</p>
                  </div>
                </div>
                <div className="text-slate-400">vs</div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-xs text-slate-500 text-right">Bowler</p>
                    <p className="font-medium text-slate-900 dark:text-white text-sm text-right">{m.bowler.full_name}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-error-500 to-warning-500 flex items-center justify-center text-white text-sm font-bold">
                    {getInitials(m.bowler.full_name)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded bg-white dark:bg-slate-700">
                  <p className="text-xs text-slate-500">Balls</p>
                  <p className="font-bold text-slate-900 dark:text-white">{m.balls}</p>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-700">
                  <p className="text-xs text-slate-500">Runs</p>
                  <p className="font-bold text-error-500">{m.runs}</p>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-700">
                  <p className="text-xs text-slate-500">Dots</p>
                  <p className="font-bold text-success-600">{m.dots}</p>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-700">
                  <p className="text-xs text-slate-500">Outs</p>
                  <p className="font-bold text-error-500">{m.dismissals}</p>
                </div>
              </div>

              <div className="mt-3 p-2 rounded bg-white dark:bg-slate-700 text-center">
                <p className="text-xs text-slate-500">Strike Rate</p>
                <p className={cn(
                  'text-lg font-bold',
                  m.sr > 130 ? 'text-success-600' : m.sr > 100 ? 'text-warning-500' : 'text-error-500'
                )}>
                  {m.sr.toFixed(1)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Radar Comparison */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Matchup Analysis Radar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {playerVsBowler.slice(0, 2).map((m, i) => (
            <RadarChart
              key={i}
              categories={['Runs', 'Boundaries', 'SR', 'Dots %', 'Dismissal Rate']}
              data={[m.runs, m.boundaries * 10, m.sr, (m.dots / m.balls) * 100, m.dismissals * 33]}
              color={i === 0 ? chartColors.primary : chartColors.cyan}
              height={200}
            />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export function H2HAnalyticsDetailedPage() {
  const [activeTab, setActiveTab] = React.useState('team-vs-team');

  const tabs = [
    { id: 'team-vs-team', label: 'Team vs Team', icon: Swords },
    { id: 'player-vs-team', label: 'Player vs Team', icon: Users },
    { id: 'player-vs-bowler', label: 'Player vs Bowler', icon: Target },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Head-to-Head Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Comprehensive rivalry insights</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-error-500 to-warning-500 text-white font-bold">
          <TrendingUp className="w-5 h-5" />
          H2H Analysis
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
                ? 'bg-gradient-to-r from-primary-500 to-cyan-500 text-white shadow-lg'
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
        {activeTab === 'team-vs-team' && <TeamVsTeamTab />}
        {activeTab === 'player-vs-team' && <PlayerVsTeamTab />}
        {activeTab === 'player-vs-bowler' && <PlayerVsBowlerTab />}
      </motion.div>
    </div>
  );
}

export default H2HAnalyticsDetailedPage;
