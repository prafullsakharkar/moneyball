import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, BarChart3, Users, Target, Activity, Calendar } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { AreaChart, BarChart, LineChart } from '../components/ui/Charts';
import { mockTournaments, mockTeams, mockPlayers, dashboardMetrics, chartColors, generateChartData } from '../lib/mock-data';
import { cn } from '../lib/utils';

// Tournament Analytics Data
const tournamentMetrics = {
  totalRuns: 128456,
  totalWickets: 3892,
  totalBoundaries: 18456,
  totalSixes: 6823,
  totalFours: 11633,
  runRate: 8.45,
  avgTeamScore: 165.8,
};

const tournamentInsights = {
  highestTeamScore: { team: mockTeams[2], score: 263, against: mockTeams[5] },
  lowestTeamScore: { team: mockTeams[5], score: 49, against: mockTeams[0] },
  biggestWinMargin: { winner: mockTeams[0], margin: '146 runs', loser: mockTeams[5] },
  closestMatch: { winner: mockTeams[7], margin: '1 run', loser: mockTeams[2] },
  mostSuccessfulChase: { team: mockTeams[2], target: 224, against: mockTeams[6] },
  highestRunChaseFailed: { team: mockTeams[3], target: 219, made: 215 },
};

const trendData = generateChartData(12);

// Sub-components
function TournamentOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Total Runs" value={tournamentMetrics.totalRuns.toLocaleString()} icon={<TrendingUp className="w-6 h-6" />} accent />
        <KPIWidget title="Total Wickets" value={tournamentMetrics.totalWickets.toLocaleString()} icon={<Target className="w-6 h-6" />} />
        <KPIWidget title="Total Boundaries" value={tournamentMetrics.totalBoundaries.toLocaleString()} icon={<BarChart3 className="w-6 h-6" />} />
        <KPIWidget title="Tournament RR" value={tournamentMetrics.runRate} suffix="rpo" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Total Sixes" value={tournamentMetrics.totalSixes.toLocaleString()} icon={<Activity className="w-6 h-6" />} />
        <KPIWidget title="Total Fours" value={tournamentMetrics.totalFours.toLocaleString()} />
        <KPIWidget title="Avg Team Score" value={tournamentMetrics.avgTeamScore} suffix="runs" />
        <KPIWidget title="Total Matches" value={dashboardMetrics.totalMatches} icon={<Calendar className="w-6 h-6" />} />
      </div>

      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tournament Progress</h3>
        <div className="h-64">
          <AreaChart
            data={trendData.map(d => d.value)}
            categories={trendData.map(d => d.month)}
            title=""
            height={240}
          />
        </div>
      </GlassCard>
    </div>
  );
}

function TournamentInsightsTab() {
  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-warning-500 to-orange-500">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Tournament Insights</h3>
            <p className="text-sm text-slate-500">Key milestones and records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 mb-2">Highest Team Score</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  {tournamentInsights.highestTeamScore.team.short_name}
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{tournamentInsights.highestTeamScore.team.name}</span>
              </div>
              <span className="text-2xl font-bold text-success-600">{tournamentInsights.highestTeamScore.score}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">vs {tournamentInsights.highestTeamScore.against.short_name}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 mb-2">Lowest Team Score</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-error-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                  {tournamentInsights.lowestTeamScore.team.short_name}
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{tournamentInsights.lowestTeamScore.team.name}</span>
              </div>
              <span className="text-2xl font-bold text-error-500">{tournamentInsights.lowestTeamScore.score}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">vs {tournamentInsights.lowestTeamScore.against.short_name}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 mb-2">Biggest Win Margin</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  {tournamentInsights.biggestWinMargin.winner.short_name}
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{tournamentInsights.biggestWinMargin.winner.name}</span>
              </div>
              <span className="text-lg font-bold text-success-600">{tournamentInsights.biggestWinMargin.margin}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">vs {tournamentInsights.biggestWinMargin.loser.short_name}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 mb-2">Closest Match</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  {tournamentInsights.closestMatch.winner.short_name}
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{tournamentInsights.closestMatch.winner.name}</span>
              </div>
              <span className="text-lg font-bold text-warning-500">{tournamentInsights.closestMatch.margin}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">vs {tournamentInsights.closestMatch.loser.short_name}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 mb-2">Most Successful Chase</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {tournamentInsights.mostSuccessfulChase.team.short_name}
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{tournamentInsights.mostSuccessfulChase.team.name}</span>
              </div>
              <span className="text-lg font-bold text-cyan-600">{tournamentInsights.mostSuccessfulChase.target}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">vs {tournamentInsights.mostSuccessfulChase.against.short_name}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 mb-2">Highest Chase Failed</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white font-bold text-sm">
                  {tournamentInsights.highestRunChaseFailed.team.short_name}
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{tournamentInsights.highestRunChaseFailed.team.name}</span>
              </div>
              <span className="text-lg font-bold text-slate-600">{tournamentInsights.highestRunChaseFailed.made}/{tournamentInsights.highestRunChaseFailed.target}</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function TournamentTrends() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Runs by Match Day</h3>
        <div className="h-64">
          <LineChart
            data={trendData.map(d => d.value)}
            categories={trendData.map(d => d.month)}
            title=""
            height={240}
          />
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Average Score Trend</h3>
          <div className="h-64">
            <AreaChart
              data={[158, 162, 168, 172, 165, 170, 175, 178, 166, 172]}
              categories={['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10']}
              title=""
              height={240}
            />
          </div>
        </GlassCard>

        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Wickets by Match Day</h3>
          <div className="h-64">
            <BarChart
              data={[12, 15, 11, 14, 16, 13, 12, 15, 14, 13]}
              categories={['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10']}
              title=""
              height={240}
            />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export function TournamentAnalyticsPage() {
  const [activeTab, setActiveTab] = React.useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Trophy },
    { id: 'insights', label: 'Insights', icon: Target },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tournament Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Comprehensive tournament metrics and insights</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-bold">
          <Trophy className="w-5 h-5" />
          {mockTournaments[0].name}
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
        {activeTab === 'overview' && <TournamentOverview />}
        {activeTab === 'insights' && <TournamentInsightsTab />}
        {activeTab === 'trends' && <TournamentTrends />}
      </motion.div>
    </div>
  );
}

export default TournamentAnalyticsPage;
