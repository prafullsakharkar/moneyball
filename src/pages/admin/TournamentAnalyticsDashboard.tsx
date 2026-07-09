import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Users, Activity, Target, TrendingUp, BarChart3, Award, Star,
  Crown, Medal, Download, FileSpreadsheet, Search, ChevronDown, MapPin
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

// Types
interface TournamentStats {
  total_teams: number;
  total_matches: number;
  total_runs: number;
  total_wickets: number;
  centuries: number;
  five_wkts: number;
  highest_score: number;
  highest_chase: number;
}

interface LeaderboardPlayer {
  rank: number;
  name: string;
  team: string;
  stat: number;
}

interface PointsTableTeam {
  rank: number;
  team: string;
  played: number;
  won: number;
  lost: number;
  nr: number;
  points: number;
  nrr: string;
  form: string[];
  qualified: boolean;
}

// Mock Data
const tournaments = [
  { id: 'ipl-2024', name: 'Indian Premier League 2024', format: 'T20' },
  { id: 'bbl-2023', name: 'Big Bash League 2023-24', format: 'T20' },
];

const selectedTournament = tournaments[0];

const tournamentStats: TournamentStats = {
  total_teams: 10,
  total_matches: 74,
  total_runs: 28456,
  total_wickets: 956,
  centuries: 8,
  five_wkts: 12,
  highest_score: 287,
  highest_chase: 262,
};

const orangeCap: LeaderboardPlayer[] = [
  { rank: 1, name: 'Virat Kohli', team: 'RCB', stat: 741 },
  { rank: 2, name: 'Ruturaj Gaikwad', team: 'CSK', stat: 589 },
  { rank: 3, name: 'Travis Head', team: 'SRH', stat: 567 },
  { rank: 4, name: 'Shubman Gill', team: 'GT', stat: 502 },
  { rank: 5, name: 'Riyan Parag', team: 'RR', stat: 487 },
];

const purpleCap: LeaderboardPlayer[] = [
  { rank: 1, name: 'Harshal Patel', team: 'PBKS', stat: 28 },
  { rank: 2, name: 'Varun Chakravarthy', team: 'KKR', stat: 25 },
  { rank: 3, name: 'Jasprit Bumrah', team: 'MI', stat: 22 },
  { rank: 4, name: 'T Natarajan', team: 'SRH', stat: 21 },
  { rank: 5, name: 'Yuzvendra Chahal', team: 'RR', stat: 20 },
];

const mvpRankings = [
  { rank: 1, name: 'Sunil Narine', team: 'KKR', points: 487, contributions: '487 runs, 17 wkts' },
  { rank: 2, name: 'Virat Kohli', team: 'RCB', points: 456, contributions: '741 runs' },
  { rank: 3, name: 'Travis Head', team: 'SRH', points: 423, contributions: '567 runs @ 185 SR' },
  { rank: 4, name: 'Harshit Rana', team: 'KKR', points: 398, contributions: '17 wkts @ 9.2 econ' },
  { rank: 5, name: 'Ruturaj Gaikwad', team: 'CSK', points: 385, contributions: '589 runs' },
];

const pointsTable: PointsTableTeam[] = [
  { rank: 1, team: 'Kolkata Knight Riders', played: 14, won: 11, lost: 3, nr: 0, points: 22, nrr: '+1.428', form: ['W', 'W', 'W', 'W', 'L'], qualified: true },
  { rank: 2, team: 'Sunrisers Hyderabad', played: 14, won: 9, lost: 5, nr: 0, points: 19, nrr: '+0.835', form: ['W', 'L', 'W', 'W', 'W'], qualified: true },
  { rank: 3, team: 'Rajasthan Royals', played: 14, won: 9, lost: 5, nr: 0, points: 18, nrr: '+0.291', form: ['L', 'L', 'W', 'W', 'L'], qualified: true },
  { rank: 4, team: 'Royal Challengers Bangalore', played: 14, won: 8, lost: 6, nr: 0, points: 16, nrr: '+0.456', form: ['W', 'W', 'W', 'W', 'W'], qualified: true },
  { rank: 5, team: 'Chennai Super Kings', played: 14, won: 7, lost: 7, nr: 0, points: 14, nrr: '+0.125', form: ['W', 'L', 'L', 'W', 'L'], qualified: false },
  { rank: 6, team: 'Delhi Capitals', played: 14, won: 7, lost: 7, nr: 0, points: 14, nrr: '-0.067', form: ['L', 'W', 'W', 'L', 'W'], qualified: false },
  { rank: 7, team: 'Gujarat Titans', played: 14, won: 6, lost: 8, nr: 0, points: 12, nrr: '-0.256', form: ['L', 'L', 'W', 'L', 'W'], qualified: false },
  { rank: 8, team: 'Mumbai Indians', played: 14, won: 6, lost: 8, nr: 0, points: 12, nrr: '-0.328', form: ['W', 'L', 'L', 'L', 'W'], qualified: false },
  { rank: 9, team: 'Punjab Kings', played: 14, won: 5, lost: 9, nr: 0, points: 10, nrr: '-0.578', form: ['L', 'W', 'L', 'L', 'L'], qualified: false },
  { rank: 10, team: 'Lucknow Super Giants', played: 14, won: 4, lost: 10, nr: 0, points: 8, nrr: '-0.852', form: ['L', 'L', 'L', 'W', 'L'], qualified: false },
];

const runsDistribution = [
  { label: 'Fours', value: 2486, color: '#3b82f6' },
  { label: 'Sixes', value: 1582, color: '#10b981' },
  { label: 'Singles', value: 12456, color: '#06b6d4' },
  { label: 'Doubles', value: 3245, color: '#f59e0b' },
  { label: 'Extras', value: 1559, color: '#8b5cf6' },
];

const teamRuns = [
  { team: 'SRH', runs: 2890 },
  { team: 'RCB', runs: 2756 },
  { team: 'KKR', runs: 2698 },
  { team: 'CSK', runs: 2412 },
  { team: 'RR', runs: 2389 },
  { team: 'MI', runs: 2156 },
  { team: 'PBKS', runs: 2078 },
  { team: 'DC', runs: 2012 },
  { team: 'GT', runs: 1898 },
  { team: 'LSG', runs: 1677 },
];

const venueStats = [
  { venue: 'M. Chinnaswamy', matches: 12, avg_score: 189.5, highest: 287 },
  { venue: 'Rajiv Gandhi', matches: 11, avg_score: 182.3, highest: 277 },
  { venue: 'Eden Gardens', matches: 9, avg_score: 178.2, highest: 262 },
  { venue: 'Wankhede', matches: 10, avg_score: 175.8, highest: 246 },
  { venue: 'MA Chidambaram', matches: 8, avg_score: 168.4, highest: 228 },
];

const topPerformers = [
  { category: 'Most Sixes', player: 'Abhishek Sharma', team: 'SRH', stat: '48 sixes' },
  { category: 'Highest Score', player: 'Travis Head', team: 'SRH', stat: '158 runs' },
  { category: 'Best Bowling', player: 'Akash Madhwal', team: 'MI', stat: '5/12' },
  { category: 'Fastest Century', player: 'Travis Head', team: 'SRH', stat: '39 balls' },
  { category: 'Most Catches', player: 'Manish Pandey', team: 'DC', stat: '14 catches' },
];

// Donut Chart Component
const DonutChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = -90;

  return (
    <div className="flex items-center justify-center gap-8">
      <div className="relative w-52 h-52">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {data.map((d, i) => {
            const angle = (d.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = 50 + 38 * Math.cos(startRad);
            const y1 = 50 + 38 * Math.sin(startRad);
            const x2 = 50 + 38 * Math.cos(endRad);
            const y2 = 50 + 38 * Math.sin(endRad);

            const largeArc = angle > 180 ? 1 : 0;

            return (
              <motion.path
                key={i}
                d={`M 50 50 L ${x1} ${y1} A 38 38 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={d.color}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              />
            );
          })}
          <circle cx="50" cy="50" r="28" fill="white" className="dark:fill-slate-900" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{total.toLocaleString()}</p>
            <p className="text-xs text-slate-500">Total Runs</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: d.color }} />
            <span className="text-sm text-slate-600 dark:text-slate-400">{d.label}</span>
            <span className="ml-auto text-sm font-medium text-slate-900 dark:text-white">{d.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Horizontal Bar Chart
const HorizontalBarChart = ({ data }: { data: { team: string; runs: number }[] }) => {
  const maxRuns = Math.max(...data.map(d => d.runs));

  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <div className="w-10 text-sm font-medium text-slate-600 dark:text-slate-400">{d.team}</div>
          <div className="flex-1 relative h-6 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(d.runs / maxRuns) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.03 }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-lg"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-700 dark:text-slate-300">
              {d.runs.toLocaleString()}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export function TournamentAnalyticsDashboard() {
  const [tournament, setTournament] = React.useState('ipl-2024');
  const [showTournamentSelect, setShowTournamentSelect] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-warning-500" />
            Tournament Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Complete tournament analytics and statistics</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success-100 text-success-700 font-medium">
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Tournament Selection */}
      <GlassCard>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowTournamentSelect(!showTournamentSelect)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning-500 to-orange-500 flex items-center justify-center text-white">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedTournament.name}</p>
                <p className="text-sm text-slate-500">{selectedTournament.format} Format</p>
              </div>
              <ChevronDown className={cn('w-5 h-5 text-slate-400 transition-transform', showTournamentSelect && 'rotate-180')} />
            </button>

            {showTournamentSelect && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50"
              >
                {tournaments.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTournament(t.id); setShowTournamentSelect(false); }}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 first:rounded-t-xl last:rounded-b-xl text-left',
                      tournament === t.id ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    <Trophy className={cn('w-5 h-5', tournament === t.id ? 'text-primary-500' : 'text-slate-400')} />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.format}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Teams', value: tournamentStats.total_teams, icon: Users, color: 'primary' },
          { label: 'Matches', value: tournamentStats.total_matches, icon: Activity, color: 'cyan' },
          { label: 'Total Runs', value: tournamentStats.total_runs.toLocaleString(), icon: TrendingUp, color: 'success' },
          { label: 'Total Wickets', value: tournamentStats.total_wickets, icon: Target, color: 'warning' },
          { label: 'Centuries', value: tournamentStats.centuries, icon: Star, color: 'orange' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={cn(
                'w-4 h-4',
                stat.color === 'primary' ? 'text-primary-500' :
                stat.color === 'cyan' ? 'text-cyan-500' :
                stat.color === 'success' ? 'text-success-500' :
                stat.color === 'warning' ? 'text-warning-500' :
                'text-orange-500'
              )} />
              <span className="text-xs text-slate-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orange Cap */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            Orange Cap
          </h3>
          <div className="space-y-2">
            {orangeCap.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    i === 0 ? 'bg-orange-500 text-white' :
                    i === 1 ? 'bg-orange-200 text-orange-700' :
                    'bg-slate-200 dark:bg-slate-700 text-slate-600'
                  )}>
                    {p.rank}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.team}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">{p.stat}</p>
                  <p className="text-xs text-slate-500">runs</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Purple Cap */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Purple Cap
          </h3>
          <div className="space-y-2">
            {purpleCap.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    i === 0 ? 'bg-purple-500 text-white' :
                    i === 1 ? 'bg-purple-200 text-purple-700' :
                    'bg-slate-200 dark:bg-slate-700 text-slate-600'
                  )}>
                    {p.rank}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.team}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">{p.stat}</p>
                  <p className="text-xs text-slate-500">wkts</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* MVP Rankings */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            MVP Rankings
          </h3>
          <div className="space-y-2">
            {mvpRankings.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    i === 0 ? 'bg-yellow-500 text-white' :
                    i === 1 ? 'bg-yellow-200 text-yellow-700' :
                    'bg-slate-200 dark:bg-slate-700 text-slate-600'
                  )}>
                    {p.rank}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.contributions}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-600">{p.points}</p>
                  <p className="text-xs text-slate-500">pts</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Runs Distribution */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-500" />
            Runs Distribution
          </h3>
          <DonutChart data={runsDistribution} />
        </GlassCard>

        {/* Team Performance */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-500" />
            Team Total Runs
          </h3>
          <HorizontalBarChart data={teamRuns} />
        </GlassCard>
      </div>

      {/* Points Table */}
      <GlassCard>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Medal className="w-5 h-5 text-primary-500" />
          Points Table
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 text-center">#</th>
                <th className="py-3 text-left">Team</th>
                <th className="py-3 text-center">P</th>
                <th className="py-3 text-center">W</th>
                <th className="py-3 text-center">L</th>
                <th className="py-3 text-center">NRR</th>
                <th className="py-3 text-center">Form</th>
                <th className="py-3 text-center">Pts</th>
              </tr>
            </thead>
            <tbody>
              {pointsTable.map((t, i) => (
                <motion.tr
                  key={t.rank}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={cn(
                    'border-b border-slate-100 dark:border-slate-800',
                    t.qualified && 'bg-success-50/50 dark:bg-success-900/10'
                  )}
                >
                  <td className="py-4 text-center">
                    <span className={cn(
                      'w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold',
                      t.rank <= 4 ? 'bg-success-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                    )}>
                      {t.rank}
                    </span>
                  </td>
                  <td className="py-4 font-medium text-slate-900 dark:text-white">{t.team}</td>
                  <td className="py-4 text-center text-slate-600 dark:text-slate-400">{t.played}</td>
                  <td className="py-4 text-center font-medium text-success-600">{t.won}</td>
                  <td className="py-4 text-center font-medium text-error-600">{t.lost}</td>
                  <td className={cn('py-4 text-center font-medium', t.nrr.startsWith('+') ? 'text-success-600' : 'text-error-600')}>
                    {t.nrr}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-1">
                      {t.form.map((f, fi) => (
                        <span
                          key={fi}
                          className={cn(
                            'w-5 h-5 rounded text-xs font-bold flex items-center justify-center',
                            f === 'W' ? 'bg-success-500 text-white' : 'bg-error-500 text-white'
                          )}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 text-center font-bold text-lg text-slate-900 dark:text-white">{t.points}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Venue Analysis */}
      <GlassCard>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-warning-500" />
          Venue Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 text-left">Venue</th>
                <th className="py-3 text-center">Matches</th>
                <th className="py-3 text-center">Avg Score</th>
                <th className="py-3 text-center">Highest Score</th>
              </tr>
            </thead>
            <tbody>
              {venueStats.map((v, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-4 font-medium text-slate-900 dark:text-white">{v.venue}</td>
                  <td className="py-4 text-center">{v.matches}</td>
                  <td className="py-4 text-center font-medium">{v.avg_score}</td>
                  <td className="py-4 text-center font-bold text-success-600">{v.highest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Top Performers */}
      <GlassCard>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-warning-500" />
          Top Performers & Records
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topPerformers.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50"
            >
              <p className="text-xs text-slate-500 mb-1">{p.category}</p>
              <p className="font-bold text-slate-900 dark:text-white">{p.player}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">{p.team}</span>
                <span className="text-sm font-medium text-primary-600">{p.stat}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export default TournamentAnalyticsDashboard;
