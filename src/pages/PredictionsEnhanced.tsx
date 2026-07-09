import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Brain, Trophy, BarChart3, Zap, Activity, Calendar } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { BarChart, AreaChart, LineChart } from '../components/ui/Charts';
import { mockTeams, mockPlayers, chartColors } from '../lib/mock-data';
import { cn, getInitials } from '../lib/utils';

// Prediction Mock Data
const matchPredictions = [
  { team1: mockTeams[0], team2: mockTeams[1], winProb: { team1: 58, team2: 42 }, venue: 'Chennai', date: '2024-05-20', confidence: 86 },
  { team1: mockTeams[2], team2: mockTeams[3], winProb: { team1: 45, team2: 55 }, venue: 'Bangalore', date: '2024-05-21', confidence: 78 },
  { team1: mockTeams[7], team2: mockTeams[6], winProb: { team1: 62, team2: 38 }, venue: 'Ahmedabad', date: '2024-05-22', confidence: 91 },
];

const playoffPredictions = {
  teams: [
    { team: mockTeams[7], qualifyProb: 94, position: 1, points: 20 },
    { team: mockTeams[0], qualifyProb: 88, position: 2, points: 18 },
    { team: mockTeams[6], qualifyProb: 72, position: 3, points: 16 },
    { team: mockTeams[2], qualifyProb: 65, position: 4, points: 14 },
    { team: mockTeams[1], qualifyProb: 45, position: 5, points: 12 },
    { team: mockTeams[3], qualifyProb: 28, position: 6, points: 10 },
  ],
};

const playerProjections = [
  { player: mockPlayers[6], currentRuns: 890, projectedRuns: 1120, projectedOrangeCap: true },
  { player: mockPlayers[0], currentRuns: 678, projectedRuns: 856, projectedOrangeCap: false },
  { player: mockPlayers[1], currentWickets: 32, projectedWickets: 41, projectedPurpleCap: true },
  { player: mockPlayers[7], currentWickets: 24, projectedWickets: 31, projectedPurpleCap: false },
];

const scorePredictions = [
  { venue: 'Chennai', firstInningsAvg: 165, secondInningsAvg: 158, avgWickets: 8 },
  { venue: 'Mumbai', firstInningsAvg: 182, secondInningsAvg: 175, avgWickets: 9 },
  { venue: 'Bangalore', firstInningsAvg: 195, secondInningsAvg: 188, avgWickets: 10 },
  { venue: 'Ahmedabad', firstInningsAvg: 178, secondInningsAvg: 172, avgWickets: 8 },
];

const tossImpact = {
  batFirst: { win: 48, loss: 52 },
  bowlFirst: { win: 56, loss: 44 },
  venueSpecific: [
    { venue: 'Chennai', batWin: 42, bowlWin: 58 },
    { venue: 'Mumbai', batWin: 52, bowlWin: 48 },
    { venue: 'Bangalore', batWin: 45, bowlWin: 55 },
  ],
};

// Sub-components
function MatchPredictionsTab() {
  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Upcoming Match Predictions</h3>
            <p className="text-sm text-slate-500">AI-powered win probability forecasts</p>
          </div>
        </div>

        <div className="space-y-4">
          {matchPredictions.map((match, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500">{match.venue} | {match.date}</span>
                <span className={cn(
                  'px-2 py-1 rounded text-xs font-medium',
                  match.confidence >= 85 ? 'bg-success-100 text-success-600' :
                  match.confidence >= 75 ? 'bg-warning-100 text-warning-600' :
                  'bg-slate-100 text-slate-600'
                )}>
                  {match.confidence}% confidence
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-warning-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                    {match.team1.short_name}
                  </div>
                  <p className="mt-2 font-medium text-slate-900 dark:text-white">{match.team1.name}</p>
                  <p className="text-3xl font-bold text-success-600 mt-2">{match.winProb.team1}%</p>
                </div>

                <div className="text-center">
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-warning-500 to-orange-500"
                      style={{ width: `${match.winProb.team1}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Win Probability</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl">
                    {match.team2.short_name}
                  </div>
                  <p className="mt-2 font-medium text-slate-900 dark:text-white">{match.team2.name}</p>
                  <p className="text-3xl font-bold text-slate-600 mt-2">{match.winProb.team2}%</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Venue-wise Score Predictions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {scorePredictions.map((venue, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="font-medium text-slate-900 dark:text-white">{venue.venue}</p>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">1st Inn Avg</span>
                  <span className="font-bold text-primary-600">{venue.firstInningsAvg}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">2nd Inn Avg</span>
                  <span className="font-bold text-cyan-600">{venue.secondInningsAvg}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Avg Wickets</span>
                  <span className="font-bold text-warning-500">{venue.avgWickets}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function PlayoffRaceTab() {
  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-warning-500 to-orange-500">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Playoff Qualification Predictions</h3>
            <p className="text-sm text-slate-500">AI-projected standings</p>
          </div>
        </div>

        <div className="space-y-3">
          {playoffPredictions.teams.map((team, i) => (
            <motion.div
              key={team.team.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                'p-4 rounded-xl flex items-center gap-4',
                i < 4 ? 'bg-success-50 dark:bg-success-900/20' : 'bg-slate-50 dark:bg-slate-800/50'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm',
                i < 4 ? 'bg-success-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
              )}>
                {i + 1}
              </div>

              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                {team.team.short_name}
              </div>

              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-white">{team.team.name}</p>
                <p className="text-xs text-slate-500">{team.points} points</p>
              </div>

              <div className="text-right mr-4">
                <p className={cn(
                  'text-2xl font-bold',
                  team.qualifyProb >= 70 ? 'text-success-600' :
                  team.qualifyProb >= 40 ? 'text-warning-500' :
                  'text-error-500'
                )}>
                  {team.qualifyProb}%
                </p>
                <p className="text-xs text-slate-500">Qualify</p>
              </div>

              <div className="w-24">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      team.qualifyProb >= 70 ? 'bg-success-500' :
                      team.qualifyProb >= 40 ? 'bg-warning-500' :
                      'bg-error-500'
                    )}
                    style={{ width: `${team.qualifyProb}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Qualification Probability Distribution</h3>
        <div className="h-64">
          <BarChart
            data={playoffPredictions.teams.map(t => t.qualifyProb)}
            categories={playoffPredictions.teams.map(t => t.team.short_name)}
            title=""
            height={240}
          />
        </div>
      </GlassCard>
    </div>
  );
}

function PlayerProjectionsTab() {
  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Season Projections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Batsmen Projections */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-500">Orange Cap Race</h4>
            {playerProjections.filter(p => 'projectedRuns' in p).map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                    {getInitials(p.player.full_name)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{p.player.full_name}</p>
                    {p.projectedOrangeCap && (
                      <span className="text-xs text-warning-500 font-medium">Orange Cap Favorite</span>
                    )}
                  </div>
                  <div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Current: {p.currentRuns}</p>
                      <p className="text-lg font-bold text-orange-500">Projected: {p.projectedRuns}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bowlers Projections */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-500">Purple Cap Race</h4>
            {playerProjections.filter(p => 'projectedWickets' in p).map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {getInitials(p.player.full_name)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{p.player.full_name}</p>
                    {p.projectedPurpleCap && (
                      <span className="text-xs text-purple-500 font-medium">Purple Cap Favorite</span>
                    )}
                  </div>
                  <div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Current: {p.currentWickets}</p>
                      <p className="text-lg font-bold text-purple-500">Projected: {p.projectedWickets}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Projection Accuracy</h3>
        <div className="h-64">
          <AreaChart
            data={[82, 78, 85, 89, 87, 91, 88, 92, 90, 93, 91, 94]}
            categories={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            title=""
            height={240}
          />
        </div>
      </GlassCard>
    </div>
  );
}

function TossAnalysisTab() {
  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Toss Decision Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
            <h4 className="text-sm font-medium text-slate-500 mb-4">Bat First Win Rate</h4>
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none" className="text-slate-200 dark:text-slate-700" />
                <circle cx="64" cy="64" r="56" stroke={chartColors.warning} strokeWidth="12" fill="none" strokeDasharray={`${tossImpact.batFirst.win * 3.52} 352`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-warning-500">{tossImpact.batFirst.win}%</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">Teams winning after batting first</p>
          </div>

          <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
            <h4 className="text-sm font-medium text-slate-500 mb-4">Bowl First Win Rate</h4>
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none" className="text-slate-200 dark:text-slate-700" />
                <circle cx="64" cy="64" r="56" stroke={chartColors.success} strokeWidth="12" fill="none" strokeDasharray={`${tossImpact.bowlFirst.win * 3.52} 352`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-success-600">{tossImpact.bowlFirst.win}%</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">Teams winning after bowling first</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Venue-wise Toss Impact</h3>
        <div className="space-y-4">
          {tossImpact.venueSpecific.map((venue, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-slate-900 dark:text-white">{venue.venue}</p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-warning-500">Bat First</span>
                    <span className="font-bold">{venue.batWin}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-warning-500 rounded-full" style={{ width: `${venue.batWin}%` }} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-success-600">Bowl First</span>
                    <span className="font-bold">{venue.bowlWin}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-success-500 rounded-full" style={{ width: `${venue.bowlWin}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export function PredictionsEnhancedPage() {
  const [activeTab, setActiveTab] = React.useState('match');

  const tabs = [
    { id: 'match', label: 'Match Predictions', icon: Target },
    { id: 'playoff', label: 'Playoff Race', icon: Trophy },
    { id: 'player', label: 'Player Projections', icon: TrendingUp },
    { id: 'toss', label: 'Toss Analysis', icon: Zap },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Predictions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">AI-powered forecasts and projections</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-bold">
          <Brain className="w-5 h-5" />
          ML Powered
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPIWidget title="Prediction Accuracy" value="94.2" suffix="%" accent />
        <KPIWidget title="Matches Predicted" value={156} icon={<Calendar className="w-6 h-6" />} />
        <KPIWidget title="Correct Outcomes" value={147} icon={<Target className="w-6 h-6" />} />
        <KPIWidget title="Confidence Level" value="High" icon={<Activity className="w-6 h-6" />} />
      </div>

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

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'match' && <MatchPredictionsTab />}
        {activeTab === 'playoff' && <PlayoffRaceTab />}
        {activeTab === 'player' && <PlayerProjectionsTab />}
        {activeTab === 'toss' && <TossAnalysisTab />}
      </motion.div>
    </div>
  );
}

export default PredictionsEnhancedPage;
