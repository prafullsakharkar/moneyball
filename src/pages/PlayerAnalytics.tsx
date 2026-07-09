import React from 'react';
import { motion } from 'framer-motion';
import { User, TrendingUp, Target, Shield, BarChart3, Star, Activity, Zap } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { AreaChart, BarChart, RadarChart, LineChart } from '../components/ui/Charts';
import { mockPlayers, mockTeams, chartColors, topBatsmen, topBowlers } from '../lib/mock-data';
import { cn, getInitials } from '../lib/utils';

// Player Analytics Data
const battingStats = {
  basic: { matches: 14, innings: 14, runs: 890, avg: 47.5, sr: 152.3, hs: '104*', notOuts: 3 },
  advanced: { ballsFaced: 585, boundaryPct: 18.5, dotBallPct: 35, singlesPct: 28, boundaryRunsPct: 48, controlPct: 82, impactScore: 178 },
  milestones: { thirtyPlus: 8, fiftyPlus: 5, hundreds: 2, ducks: 1 },
  situational: { chaseAvg: 52.3, battingFirstAvg: 42.8, pressureRuns: 285, powerplaySR: 142, deathOversSR: 195 },
  consistency: { trend: 'upward', consistencyScore: 78, formIndex: 85 },
};

const bowlingStats = {
  basic: { overs: 52.4, maidens: 2, wickets: 28, economy: 6.8, avg: 16.5, sr: 14.2 },
  advanced: { dotBallPct: 42, boundaryConcededPct: 12, wicketsPerMatch: 2.3, deathEcon: 8.2, powerplayEcon: 5.8 },
  situational: { bowlingFirstAvg: 14.8, defendingAvg: 18.2, impact: 156 },
};

const fieldingStats = {
  catches: 12,
  runOuts: 3,
  directHitPct: 75,
  stumpings: 0,
  impactScore: 68,
};

// Sub-components
function PlayerBattingStats() {
  const player = mockPlayers[6];

  return (
    <div className="space-y-6">
      {/* Player Card */}
      <GlassCard gradient>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-2xl">
            {getInitials(player.full_name)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{player.full_name}</h2>
            <p className="text-slate-500">{mockTeams[7].name} | {player.player_type}</p>
            <p className="text-sm text-slate-400 mt-1">{player.batting_style} | {player.bowling_style || 'N/A'}</p>
          </div>
          <div className="ml-auto text-right">
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-bold">Orange Cap Holder</span>
          </div>
        </div>
      </GlassCard>

      {/* Basic Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Matches" value={battingStats.basic.matches} icon={<User className="w-6 h-6" />} />
        <KPIWidget title="Runs" value={battingStats.basic.runs} icon={<TrendingUp className="w-6 h-6" />} accent />
        <KPIWidget title="Average" value={battingStats.basic.avg} />
        <KPIWidget title="Strike Rate" value={battingStats.basic.sr} />
      </div>

      {/* Advanced Stats */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Advanced Batting Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Balls Faced', value: battingStats.advanced.ballsFaced },
            { label: 'Boundary %', value: `${battingStats.advanced.boundaryPct}%` },
            { label: 'Dot Ball %', value: `${battingStats.advanced.dotBallPct}%` },
            { label: 'Control %', value: `${battingStats.advanced.controlPct}%` },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Milestones */}
      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Milestones</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: '30+', value: battingStats.milestones.thirtyPlus, color: 'bg-slate-100 text-slate-600' },
            { label: '50s', value: battingStats.milestones.fiftyPlus, color: 'bg-primary-100 text-primary-600' },
            { label: '100s', value: battingStats.milestones.hundreds, color: 'bg-success-100 text-success-600' },
            { label: 'Ducks', value: battingStats.milestones.ducks, color: 'bg-error-100 text-error-500' },
          ].map((stat) => (
            <div key={stat.label} className={cn('p-4 rounded-xl text-center', stat.color)}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Situational Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Situational Performance</h3>
          <div className="space-y-4">
            {[
              { label: 'Chase Average', value: battingStats.situational.chaseAvg, bar: true },
              { label: 'Batting First Avg', value: battingStats.situational.battingFirstAvg, bar: true },
              { label: 'Powerplay SR', value: battingStats.situational.powerplaySR },
              { label: 'Death Overs SR', value: battingStats.situational.deathOversSR },
            ].map((stat) => (
              <div key={stat.label} className="flex justify-between items-center">
                <span className="text-slate-500">{stat.label}</span>
                <span className="font-bold text-slate-900 dark:text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Runs Trend</h3>
          <div className="h-48">
            <LineChart
              data={[45, 62, 78, 52, 104, 89, 45, 72, 68, 95]}
              categories={['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10']}
              title=""
              height={180}
            />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function PlayerBowlingStats() {
  const player = mockPlayers[1];

  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl">
            {getInitials(player.full_name)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{player.full_name}</h2>
            <p className="text-slate-500">{mockTeams[1].name} | {player.player_type}</p>
            <p className="text-sm text-slate-400 mt-1">{player.bowling_style}</p>
          </div>
          <div className="ml-auto text-right">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 font-bold">Purple Cap Holder</span>
          </div>
        </div>
      </GlassCard>

      {/* Basic Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Wickets" value={bowlingStats.basic.wickets} icon={<Target className="w-6 h-6" />} accent />
        <KPIWidget title="Economy" value={bowlingStats.basic.economy} suffix="rpo" />
        <KPIWidget title="Bowling Avg" value={bowlingStats.basic.avg} />
        <KPIWidget title="Strike Rate" value={bowlingStats.basic.sr} />
      </div>

      {/* Advanced Stats */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Advanced Bowling Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Dot Ball %', value: `${bowlingStats.advanced.dotBallPct}%`, accent: true },
            { label: 'Boundary Conceded', value: `${bowlingStats.advanced.boundaryConcededPct}%` },
            { label: 'Wickets/Match', value: bowlingStats.advanced.wicketsPerMatch },
            { label: 'Death Econ', value: bowlingStats.advanced.deathEcon },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className={cn('text-xl font-bold mt-1', stat.accent ? 'text-success-600' : 'text-slate-900 dark:text-white')}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Phase-wise Economy */}
      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Economy by Phase</h3>
        <div className="h-48">
          <BarChart
            data={[bowlingStats.advanced.powerplayEcon, 7.2, bowlingStats.advanced.deathEcon]}
            categories={['Powerplay', 'Middle', 'Death']}
            title=""
            height={180}
          />
        </div>
      </GlassCard>
    </div>
  );
}

function PlayerFieldingStats() {
  const player = mockPlayers[2];

  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-success-500 to-emerald-500 flex items-center justify-center text-white font-bold text-2xl">
            {getInitials(player.full_name)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{player.full_name}</h2>
            <p className="text-slate-500">{mockTeams[0].name} | {player.player_type}</p>
          </div>
          <div className="ml-auto text-right">
            <span className="px-3 py-1 rounded-full bg-success-100 text-success-600 font-bold">Best Keeper</span>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Catches" value={fieldingStats.catches} icon={<Shield className="w-6 h-6" />} accent />
        <KPIWidget title="Run Outs" value={fieldingStats.runOuts} />
        <KPIWidget title="Direct Hits" value={`${fieldingStats.directHitPct}%`} />
        <KPIWidget title="Stumpings" value={fieldingStats.stumpings} />
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Fielding Performance Radar</h3>
        <div className="h-64">
          <RadarChart
            categories={['Catches', 'Run Outs', 'Stumpings', 'Direct Hits', 'Efficiency']}
            data={[85, 65, 90, 75, 88]}
            color={chartColors.success}
          />
        </div>
      </GlassCard>
    </div>
  );
}

export function PlayerAnalyticsPage() {
  const [activeTab, setActiveTab] = React.useState('batting');

  const tabs = [
    { id: 'batting', label: 'Batting', icon: TrendingUp },
    { id: 'bowling', label: 'Bowling', icon: Target },
    { id: 'fielding', label: 'Fielding', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Player Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Detailed player performance metrics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-bold">
          <Star className="w-5 h-5" />
          Player Stats
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
        {activeTab === 'batting' && <PlayerBattingStats />}
        {activeTab === 'bowling' && <PlayerBowlingStats />}
        {activeTab === 'fielding' && <PlayerFieldingStats />}
      </motion.div>
    </div>
  );
}

export default PlayerAnalyticsPage;
