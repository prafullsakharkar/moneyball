import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, Trophy, TrendingUp, TrendingDown, Target, Activity, BarChart3,
  Calendar, Download, FileSpreadsheet, Filter, Search, ChevronDown,
  Award, MapPin, Shield, BarChart, LineChart, PieChart as PieChartIcon
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

// Types
interface TeamStats {
  matches_played: number;
  won: number;
  lost: number;
  tied: number;
  no_result: number;
  win_percentage: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  total_runs: number;
  total_wickets: number;
  run_rate: number;
  championship_wins: number;
}

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface PlayerPerformance {
  name: string;
  matches: number;
  runs?: number;
  wickets?: number;
  avg?: number;
  sr?: number;
  econ?: number;
  role: string;
}

// Mock Data
const teams = [
  { id: 'csk', name: 'Chennai Super Kings', short: 'CSK', color: '#FFCB05', city: 'Chennai' },
  { id: 'mi', name: 'Mumbai Indians', short: 'MI', color: '#004BA0', city: 'Mumbai' },
  { id: 'rcb', name: 'Royal Challengers Bangalore', short: 'RCB', color: '#EC1C24', city: 'Bangalore' },
  { id: 'kkr', name: 'Kolkata Knight Riders', short: 'KKR', color: '#3A225D', city: 'Kolkata' },
  { id: 'srh', name: 'Sunrisers Hyderabad', short: 'SRH', color: '#F7A52B', city: 'Hyderabad' },
  { id: 'rr', name: 'Rajasthan Royals', short: 'RR', color: '#FFB81C', city: 'Jaipur' },
  { id: 'dc', name: 'Delhi Capitals', short: 'DC', color: '#17479E', city: 'Delhi' },
  { id: 'pbks', name: 'Punjab Kings', short: 'PBKS', color: '#D71920', city: 'Mohali' },
];

const selectedTeam = teams[0];

const teamStats: TeamStats = {
  matches_played: 14,
  won: 7,
  lost: 7,
  tied: 0,
  no_result: 0,
  win_percentage: 50.0,
  average_score: 175.4,
  highest_score: 218,
  lowest_score: 128,
  total_runs: 2145,
  total_wickets: 85,
  run_rate: 9.2,
  championship_wins: 5,
};

const winLossTrend: ChartData[] = [
  { label: '2018', value: 66 },
  { label: '2019', value: 57 },
  { label: '2020', value: 43 },
  { label: '2021', value: 50 },
  { label: '2022', value: 43 },
  { label: '2023', value: 57 },
  { label: '2024', value: 50 },
];

const runsPerMatch: ChartData[] = [
  { label: 'M1', value: 178 },
  { label: 'M2', value: 201 },
  { label: 'M3', value: 156 },
  { label: 'M4', value: 188 },
  { label: 'M5', value: 145 },
  { label: 'M6', value: 175 },
  { label: 'M7', value: 192 },
  { label: 'M8', value: 210 },
  { label: 'M9', value: 167 },
  { label: 'M10', value: 184 },
  { label: 'M11', value: 195 },
  { label: 'M12', value: 138 },
  { label: 'M13', value: 176 },
  { label: 'M14', value: 158 },
];

const teamForm: { label: string; wins: number; losses: number }[] = [
  { label: '2018', wins: 11, losses: 5 },
  { label: '2019', wins: 9, losses: 7 },
  { label: '2020', wins: 6, losses: 8 },
  { label: '2021', wins: 7, losses: 7 },
  { label: '2022', wins: 6, losses: 8 },
  { label: '2023', wins: 8, losses: 6 },
  { label: '2024', wins: 7, losses: 7 },
];

const powerplayPerformance = [
  { avg_runs: 52.4, avg_wickets: 1.2, economy: 8.7 },
];

const deathOversPerformance = [
  { avg_runs: 58.6, avg_wickets: 2.1, economy: 11.7 },
];

const topRunScorers: PlayerPerformance[] = [
  { name: 'Ruturaj Gaikwad', matches: 14, runs: 589, avg: 49.08, sr: 142.5, role: 'Batsman' },
  { name: 'Shivam Dube', matches: 14, runs: 432, avg: 36.0, sr: 158.2, role: 'All-rounder' },
  { name: 'MS Dhoni', matches: 14, runs: 312, avg: 52.0, sr: 185.7, role: 'WK-Batsman' },
  { name: 'Ravindra Jadeja', matches: 14, runs: 287, avg: 28.7, sr: 129.8, role: 'All-rounder' },
  { name: 'Daryl Mitchell', matches: 12, runs: 245, avg: 27.2, sr: 142.3, role: 'All-rounder' },
];

const topWicketTakers: PlayerPerformance[] = [
  { name: 'Mustafizur Rahman', matches: 12, wickets: 18, avg: 22.4, econ: 8.2, role: 'Bowler' },
  { name: 'Matheesha Pathirana', matches: 12, wickets: 15, avg: 24.8, econ: 9.1, role: 'Bowler' },
  { name: 'Tushar Deshpande', matches: 13, wickets: 14, avg: 28.6, econ: 10.2, role: 'Bowler' },
  { name: 'Ravindra Jadeja', matches: 14, wickets: 11, avg: 32.4, econ: 7.8, role: 'All-rounder' },
  { name: 'Deepak Chahar', matches: 10, wickets: 9, avg: 35.2, econ: 8.4, role: 'Bowler' },
];

const mostValuablePlayers = [
  { name: 'Ruturaj Gaikwad', matches: 14, mvp_points: 487, contributions: '5x Player of the Match', role: 'Batsman' },
  { name: 'Mustafizur Rahman', matches: 12, mvp_points: 385, contributions: '3x Player of the Match', role: 'Bowler' },
  { name: 'MS Dhoni', matches: 14, mvp_points: 342, contributions: '2x Player of the Match', role: 'WK-Batsman' },
  { name: 'Ravindra Jadeja', matches: 14, mvp_points: 298, contributions: '1x Player of the Match', role: 'All-rounder' },
  { name: 'Shivam Dube', matches: 14, mvp_points: 256, contributions: '1x Player of the Match', role: 'All-rounder' },
];

// Simple Line Chart
const SimpleLineChart = ({ data, color, suffix = '' }: { data: ChartData[]; color?: string; suffix?: string }) => {
  const maxVal = Math.max(...data.map(d => d.value)) * 1.2;
  const minVal = Math.min(...data.map(d => d.value)) * 0.8;
  const range = maxVal - minVal;
  const width = 100 / data.length;

  const points = data.map((d, i) => {
    const x = (i + 0.5) * width;
    const y = 100 - ((d.value - minVal) / range) * 100;
    return `${x} ${y}`;
  }).join(', ');

  return (
    <div className="h-40 relative">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[25, 50, 75].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="0.5" />
        ))}
        <polyline points={points} fill="none" stroke={color || '#3b82f6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          const x = (i + 0.5) * width;
          const y = 100 - ((d.value - minVal) / range) * 100;
          return <circle key={i} cx={x} cy={y} r="1.5" fill={color || '#3b82f6'} />;
        })}
      </svg>
      <div className="flex justify-between absolute bottom-0 left-0 right-0 px-2">
        {data.map((d, i) => (
          <span key={i} className="text-xs text-slate-500">{d.label}</span>
        ))}
      </div>
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500 py-1">
        <span>{maxVal.toFixed(0)}{suffix}</span>
        <span>{((maxVal + minVal) / 2).toFixed(0)}{suffix}</span>
        <span>{minVal.toFixed(0)}{suffix}</span>
      </div>
    </div>
  );
};

// Bar Chart
const SimpleBarChart = ({ data, color = 'primary' }: { data: ChartData[]; color?: string }) => {
  const maxVal = Math.max(...data.map(d => d.value)) * 1.1;

  return (
    <div className="h-40 flex items-end gap-1">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="relative w-full flex flex-col items-center" style={{ height: '140px' }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxVal) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.02 }}
              className={cn(
                'w-3/4 rounded-t-sm',
                color === 'primary' ? 'bg-gradient-to-t from-primary-500 to-cyan-500' :
                color === 'success' ? 'bg-gradient-to-t from-success-500 to-green-400' :
                'bg-gradient-to-t from-warning-500 to-orange-400'
              )}
              title={`${item.label}: ${item.value}`}
            />
          </div>
          <span className="text-xs text-slate-500 truncate">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// Stacked Bar Chart for Win/Loss
const StackedBarChart = ({ data }: { data: { label: string; wins: number; losses: number }[] }) => {
  const maxVal = Math.max(...data.map(d => d.wins + d.losses)) * 1.1;

  return (
    <div className="h-40 flex items-end gap-3">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="relative w-full flex flex-col items-center" style={{ height: '140px' }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.wins / maxVal) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="w-full bg-success-500 rounded-t-sm"
              title={`Wins: ${item.wins}`}
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.losses / maxVal) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.05 + 0.1 }}
              className="w-full bg-error-500"
              title={`Losses: ${item.losses}`}
              style={{ marginTop: '2px' }}
            />
          </div>
          <span className="text-xs text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// Donut Chart
const SimpleDonutChart = ({ won, lost }: { won: number; lost: number }) => {
  const total = won + lost;
  const wonAngle = (won / total) * 360;
  const currentAngle = -90;

  const wonEnd = currentAngle + wonAngle;
  const lostEnd = wonEnd + 360 - wonAngle;

  return (
    <div className="flex items-center justify-center gap-6">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path
            d={`M 50 50 L 50 15 A 35 35 0 ${wonAngle > 180 ? 1 : 0} 1 ${50 + 35 * Math.cos((wonEnd - 90) * Math.PI / 180)} ${50 + 35 * Math.sin((wonEnd - 90) * Math.PI / 180)} Z`}
            fill="#10b981"
          />
          <path
            d={`M 50 50 L ${50 + 35 * Math.cos((wonEnd - 90) * Math.PI / 180)} ${50 + 35 * Math.sin((wonEnd - 90) * Math.PI / 180)} A 35 35 0 ${360 - wonAngle > 180 ? 1 : 0} 1 50 15 Z`}
            fill="#ef4444"
          />
          <circle cx="50" cy="50" r="25" fill="white" className="dark:fill-slate-900" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white">{won + lost}</p>
            <p className="text-xs text-slate-500">Matches</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-success-500" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Won: {won}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-error-500" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Lost: {lost}</span>
        </div>
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <p className="text-lg font-bold text-slate-900 dark:text-white">{((won / total) * 100).toFixed(1)}%</p>
          <p className="text-xs text-slate-500">Win Rate</p>
        </div>
      </div>
    </div>
  );
};

export function TeamAnalyticsDashboard() {
  const [team, setTeam] = React.useState('csk');
  const [tournament, setTournament] = React.useState('IPL 2024');
  const [showFilters, setShowFilters] = React.useState(false);
  const [showTeamSearch, setShowTeamSearch] = React.useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const tournaments = ['IPL 2024', 'IPL 2023', 'BBL 2023-24', 'T20 World Cup 2024'];

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [team, tournament]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-500" />
            Team Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Comprehensive team performance analysis and statistics</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success-100 text-success-700 font-medium hover:bg-success-200">
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-100 text-primary-700 font-medium hover:bg-primary-200">
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      {/* Team Selection & Filters */}
      <GlassCard>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <button
              onClick={() => setShowTeamSearch(!showTeamSearch)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: selectedTeam.color }}
              >
                {selectedTeam.short}
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedTeam.name}</p>
                <p className="text-sm text-slate-500">{selectedTeam.city} • {teamStats.championship_wins} Championships</p>
              </div>
              <ChevronDown className={cn('w-5 h-5 text-slate-400 transition-transform', showTeamSearch && 'rotate-180')} />
            </button>

            {showTeamSearch && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50"
              >
                <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search teams..."
                      value={teamSearchQuery}
                      onChange={(e) => setTeamSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto p-2">
                  {teams.filter(t => t.name.toLowerCase().includes(teamSearchQuery.toLowerCase())).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setTeam(t.id); setShowTeamSearch(false); }}
                      className={cn(
                        'w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors',
                        team === t.id ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: t.color }}>
                        {t.short}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.city}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex-1" />

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors',
              showFilters
                ? 'bg-primary-50 border-primary-200 text-primary-600'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <select
            value={tournament}
            onChange={(e) => setTournament(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
          >
            {tournaments.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Opposition</label>
                <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                  <option>All Teams</option>
                  {teams.filter(t => t.id !== team).map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Venue</label>
                <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                  <option>All Venues</option>
                  <option>Home</option>
                  <option>Away</option>
                  <option>Neutral</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Match Type</label>
                <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                  <option>All Matches</option>
                  <option>League</option>
                  <option>Playoffs</option>
                  <option>Final</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Date Range</label>
                <input type="date" className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" />
              </div>
            </div>
          </motion.div>
        )}
      </GlassCard>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Matches', value: teamStats.matches_played, icon: Activity, color: 'bg-slate-100' },
          { label: 'Won', value: teamStats.won, icon: Trophy, color: 'bg-success-100' },
          { label: 'Lost', value: teamStats.lost, icon: TrendingDown, color: 'bg-error-100' },
          { label: 'Win %', value: `${teamStats.win_percentage}%`, icon: Target, color: 'bg-primary-100' },
          { label: 'Avg Score', value: teamStats.average_score.toFixed(1), icon: BarChart, color: 'bg-cyan-100' },
          { label: 'Highest', value: teamStats.highest_score, icon: TrendingUp, color: 'bg-success-100' },
          { label: 'Lowest', value: teamStats.lowest_score, icon: TrendingDown, color: 'bg-warning-100' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('p-1.5 rounded-lg', kpi.color)}>
                <kpi.icon className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-500">{kpi.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Win/Loss Donut */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-primary-500" />
            Win/Loss Distribution
          </h3>
          <SimpleDonutChart won={teamStats.won} lost={teamStats.lost} />
        </GlassCard>

        {/* Win Percentage Trend */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-primary-500" />
            Win % Trend (Season-wise)
          </h3>
          <SimpleLineChart data={winLossTrend} color="#3b82f6" suffix="%" />
        </GlassCard>

        {/* Team Form - Stacked Bar */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-success-500" />
            Team Form (Wins vs Losses)
          </h3>
          <StackedBarChart data={teamForm} />
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-success-500" />
              <span className="text-xs text-slate-500">Wins</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-error-500" />
              <span className="text-xs text-slate-500">Losses</span>
            </div>
          </div>
        </GlassCard>

        {/* Runs Per Match */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-500" />
            Runs Per Match
          </h3>
          <SimpleBarChart data={runsPerMatch} color="primary" />
        </GlassCard>

        {/* Powerplay Performance */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-warning-500" />
            Powerplay Performance (Overs 1-6)
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-warning-50 dark:bg-warning-900/20">
              <p className="text-3xl font-bold text-warning-600">{powerplayPerformance[0].avg_runs}</p>
              <p className="text-xs text-slate-500 mt-1">Avg Runs</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-error-50 dark:bg-error-900/20">
              <p className="text-3xl font-bold text-error-600">{powerplayPerformance[0].avg_wickets}</p>
              <p className="text-xs text-slate-500 mt-1">Avg Wickets</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/20">
              <p className="text-3xl font-bold text-cyan-600">{powerplayPerformance[0].economy}</p>
              <p className="text-xs text-slate-500 mt-1">Economy</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium">Analysis:</span> Strong powerplay with consistent scoring. Focus on rotating strike more in middle overs.
            </p>
          </div>
        </GlassCard>

        {/* Death Overs Performance */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-error-500" />
            Death Overs Performance (Overs 17-20)
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-success-50 dark:bg-success-900/20">
              <p className="text-3xl font-bold text-success-600">{deathOversPerformance[0].avg_runs}</p>
              <p className="text-xs text-slate-500 mt-1">Avg Runs</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20">
              <p className="text-3xl font-bold text-primary-600">{deathOversPerformance[0].avg_wickets}</p>
              <p className="text-xs text-slate-500 mt-1">Avg Wickets</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-warning-50 dark:bg-warning-900/20">
              <p className="text-3xl font-bold text-warning-600">{deathOversPerformance[0].economy}</p>
              <p className="text-xs text-slate-500 mt-1">Economy</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium">Analysis:</span> Excellent death bowling. Pathirana and Mustafizur are key assets in final overs.
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Run Scorers */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            Top Run Scorers
          </h3>
          <div className="space-y-2">
            {topRunScorers.map((player, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    i === 0 ? 'bg-orange-500 text-white' :
                    i === 1 ? 'bg-orange-200 text-orange-700' :
                    'bg-slate-200 dark:bg-slate-700 text-slate-600'
                  )}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{player.name}</p>
                    <p className="text-xs text-slate-500">{player.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white">{player.runs}</p>
                  <p className="text-xs text-slate-500">SR: {player.sr?.toFixed(1)}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Top Wicket Takers */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            Top Wicket Takers
          </h3>
          <div className="space-y-2">
            {topWicketTakers.map((player, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    i === 0 ? 'bg-purple-500 text-white' :
                    i === 1 ? 'bg-purple-200 text-purple-700' :
                    'bg-slate-200 dark:bg-slate-700 text-slate-600'
                  )}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{player.name}</p>
                    <p className="text-xs text-slate-500">{player.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white">{player.wickets}</p>
                  <p className="text-xs text-slate-500">Econ: {player.econ?.toFixed(1)}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Most Valuable Players */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Most Valuable Players
          </h3>
          <div className="space-y-2">
            {mostValuablePlayers.map((player, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    i === 0 ? 'bg-yellow-500 text-white' :
                    i === 1 ? 'bg-yellow-200 text-yellow-700' :
                    'bg-slate-200 dark:bg-slate-700 text-slate-600'
                  )}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{player.name}</p>
                    <p className="text-xs text-slate-500">{player.contributions}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white">{player.mvp_points}</p>
                  <p className="text-xs text-slate-500">MVP Pts</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Match Results Streak */}
      <GlassCard>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary-500" />
          Recent Form
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-slate-500">Last 10 matches:</span>
          <div className="flex items-center gap-1">
            {['W', 'W', 'L', 'W', 'L', 'L', 'W', 'W', 'L', 'W'].map((result, i) => (
              <span
                key={i}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm',
                  result === 'W' ? 'bg-success-500 text-white' : 'bg-error-500 text-white'
                )}
              >
                {result}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-success-50 dark:bg-success-900/20">
            <p className="text-2xl font-bold text-success-600">6</p>
            <p className="text-xs text-slate-500">Wins</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-error-50 dark:bg-error-900/20">
            <p className="text-2xl font-bold text-error-600">4</p>
            <p className="text-xs text-slate-500">Losses</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20">
            <p className="text-2xl font-bold text-primary-600">60%</p>
            <p className="text-xs text-slate-500">Win Rate</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export default TeamAnalyticsDashboard;
