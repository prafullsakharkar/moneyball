import React from 'react';
import { motion } from 'framer-motion';
import { Users, BarChart3, Target, TrendingUp, Shield, Zap, Activity, Crown } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { AreaChart, BarChart, RadarChart, LineChart } from '../components/ui/Charts';
import { mockTeams, chartColors, teamStandings } from '../lib/mock-data';
import { cn } from '../lib/utils';

// Team Analytics Data
const teamMetrics = {
  matches: 14,
  wins: 10,
  losses: 4,
  ties: 0,
  noResult: 0,
  points: 20,
  winPct: 71.4,
};

const battingMetrics = {
  totalRuns: 2845,
  avgRuns: 203.2,
  highestScore: 235,
  lowestScore: 142,
  runRate: 8.9,
  boundaryPct: 45.2,
  dotBallPct: 38.5,
  powerplayRR: 9.2,
  deathOversRR: 11.5,
};

const bowlingMetrics = {
  wicketsTaken: 78,
  bowlingAvg: 24.5,
  economyRate: 7.8,
  dotBallPct: 42.3,
  wicketFreq: 32.5,
  extrasGiven: 156,
};

const fieldingMetrics = {
  catches: 45,
  runOuts: 12,
  stumpings: 8,
  catchEfficiency: 92.5,
};

// Sub-components
function TeamSummary() {
  const team = mockTeams[0];

  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-warning-500 to-orange-500 flex items-center justify-center text-white font-bold text-2xl">
            {team.short_name}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{team.name}</h2>
            <p className="text-slate-500">{team.city} | Founded {team.founded_year}</p>
            <p className="text-sm text-slate-400 mt-1">{team.home_venue}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
          {[
            { label: 'Matches', value: teamMetrics.matches },
            { label: 'Wins', value: teamMetrics.wins, color: 'text-success-600' },
            { label: 'Losses', value: teamMetrics.losses, color: 'text-error-500' },
            { label: 'Ties', value: teamMetrics.ties },
            { label: 'NR', value: teamMetrics.noResult },
            { label: 'Points', value: teamMetrics.points, color: 'text-primary-600' },
            { label: 'Win %', value: `${teamMetrics.winPct}%` },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className={cn('text-xl font-bold mt-1', stat.color || 'text-slate-900 dark:text-white')}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPIWidget title="NRR" value="+0.756" icon={<TrendingUp className="w-6 h-6" />} accent />
        <KPIWidget title="Last 5" value={4} suffix="/5 wins" />
        <KPIWidget title="Home Wins" value="75" suffix="%" />
        <KPIWidget title="Away Wins" value="66" suffix="%" />
      </div>
    </div>
  );
}

function TeamBattingMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Total Runs" value={battingMetrics.totalRuns.toLocaleString()} icon={<TrendingUp className="w-6 h-6" />} accent />
        <KPIWidget title="Avg Score" value={battingMetrics.avgRuns} suffix="runs" />
        <KPIWidget title="Highest" value={battingMetrics.highestScore} />
        <KPIWidget title="Lowest" value={battingMetrics.lowestScore} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Run Rate by Phase</h3>
          <div className="space-y-4">
            {[
              { phase: 'Powerplay (1-6)', rr: battingMetrics.powerplayRR, color: 'bg-primary-500' },
              { phase: 'Middle (7-15)', rr: 8.5, color: 'bg-cyan-500' },
              { phase: 'Death (16-20)', rr: battingMetrics.deathOversRR, color: 'bg-warning-500' },
            ].map((item) => (
              <div key={item.phase}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">{item.phase}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.rr} rpo</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', item.color)} style={{ width: `${(item.rr / 12) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Boundary Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-xs text-slate-500">Boundary %</p>
              <p className="text-3xl font-bold text-success-600 mt-1">{battingMetrics.boundaryPct}%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-xs text-slate-500">Dot Ball %</p>
              <p className="text-3xl font-bold text-warning-500 mt-1">{battingMetrics.dotBallPct}%</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Runs Trend</h3>
        <div className="h-64">
          <LineChart
            data={[195, 212, 185, 235, 198, 175, 220, 245, 190, 215]}
            categories={['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10']}
            title=""
            height={240}
          />
        </div>
      </GlassCard>
    </div>
  );
}

function TeamBowlingMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Wickets" value={bowlingMetrics.wicketsTaken} icon={<Target className="w-6 h-6" />} accent />
        <KPIWidget title="Bowling Avg" value={bowlingMetrics.bowlingAvg} />
        <KPIWidget title="Economy" value={bowlingMetrics.economyRate} suffix="rpo" />
        <KPIWidget title="Dot Ball %" value={bowlingMetrics.dotBallPct} suffix="%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Economy by Phase</h3>
          <div className="space-y-4">
            {[
              { phase: 'Powerplay', econ: 6.2, color: 'bg-success-500' },
              { phase: 'Middle Overs', econ: 7.5, color: 'bg-warning-500' },
              { phase: 'Death Overs', econ: 9.8, color: 'bg-error-500' },
            ].map((item) => (
              <div key={item.phase}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">{item.phase}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.econ} rpo</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', item.color)} style={{ width: `${(item.econ / 12) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Extras Analysis</h3>
          <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
            <p className="text-xs text-slate-500">Total Extras Conceded</p>
            <p className="text-4xl font-bold text-warning-500 mt-2">{bowlingMetrics.extrasGiven}</p>
            <p className="text-sm text-slate-500 mt-1">Avg {(bowlingMetrics.extrasGiven / teamMetrics.matches).toFixed(1)} per match</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function TeamFieldingMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Catches" value={fieldingMetrics.catches} icon={<Shield className="w-6 h-6" />} accent />
        <KPIWidget title="Run Outs" value={fieldingMetrics.runOuts} />
        <KPIWidget title="Stumpings" value={fieldingMetrics.stumpings} />
        <KPIWidget title="Catch Efficiency" value={fieldingMetrics.catchEfficiency} suffix="%" />
      </div>

      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Fielding Performance Radar</h3>
        <div className="h-64">
          <RadarChart
            categories={['Catches', 'Run Outs', 'Stumpings', 'Efficiency', 'Drops Saved']}
            data={[85, 72, 80, 92, 78]}
            color={chartColors.success}
            height={240}
          />
        </div>
      </GlassCard>
    </div>
  );
}

function TeamComparisonTab() {
  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Team Standings Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-2">#</th>
                <th className="text-left py-3 px-2">Team</th>
                <th className="text-center py-3 px-2">M</th>
                <th className="text-center py-3 px-2">W</th>
                <th className="text-center py-3 px-2">L</th>
                <th className="text-center py-3 px-2">Pts</th>
                <th className="text-center py-3 px-2">NRR</th>
              </tr>
            </thead>
            <tbody>
              {teamStandings.map((team, index) => (
                <motion.tr
                  key={team.team_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="py-4 px-2">
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      index < 4 ? 'bg-success-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    )}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        {team.team.short_name}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">{team.team.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center text-slate-600">{team.matches}</td>
                  <td className="py-4 px-2 text-center text-success-600 font-bold">{team.wins}</td>
                  <td className="py-4 px-2 text-center text-slate-600">{team.losses}</td>
                  <td className="py-4 px-2 text-center font-bold text-primary-600">{team.points}</td>
                  <td className="py-4 px-2 text-center">
                    <span className={cn(
                      'font-medium',
                      team.nrr >= 0 ? 'text-success-600' : 'text-error-500'
                    )}>
                      {team.nrr >= 0 ? '+' : ''}{team.nrr.toFixed(3)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Points Comparison</h3>
        <div className="h-64">
          <BarChart
            data={teamStandings.map(t => t.points)}
            categories={teamStandings.map(t => t.team.short_name)}
            title=""
            height={240}
          />
        </div>
      </GlassCard>
    </div>
  );
}

export function TeamAnalyticsPage() {
  const [activeTab, setActiveTab] = React.useState('summary');

  const tabs = [
    { id: 'summary', label: 'Summary', icon: Users },
    { id: 'batting', label: 'Batting', icon: TrendingUp },
    { id: 'bowling', label: 'Bowling', icon: Target },
    { id: 'fielding', label: 'Fielding', icon: Shield },
    { id: 'comparison', label: 'Comparison', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Team Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Detailed team performance metrics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-warning-500 to-orange-500 text-white font-bold">
          <Crown className="w-5 h-5" />
          {mockTeams[0].name}
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
        {activeTab === 'summary' && <TeamSummary />}
        {activeTab === 'batting' && <TeamBattingMetrics />}
        {activeTab === 'bowling' && <TeamBowlingMetrics />}
        {activeTab === 'fielding' && <TeamFieldingMetrics />}
        {activeTab === 'comparison' && <TeamComparisonTab />}
      </motion.div>
    </div>
  );
}

export default TeamAnalyticsPage;
