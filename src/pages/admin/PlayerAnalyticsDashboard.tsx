import React from 'react';
import { motion } from 'framer-motion';
import {
  User, TrendingUp, TrendingDown, Target, Activity, BarChart3, Calendar,
  Download, FileSpreadsheet, Filter, Moon, Sun, ChevronDown, X, Award,
  MapPin, Users, Search, Eye, PieChart, LineChart
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

// Types
interface PlayerStats {
  matches: number;
  innings: number;
  runs: number;
  average: number;
  strike_rate: number;
  highest_score: number;
  fifties: number;
  hundreds: number;
  ducks: number;
  fours: number;
  sixes: number;
  boundaries: number;
}

interface Innings {
  match_id: string;
  date: string;
  opposition: string;
  venue: string;
  runs: number;
  balls: number;
  dismissal: string;
  sr: number;
  match_format: string;
}

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

// Mock Data
const playerInfo = {
  name: 'Virat Kohli',
  team: 'Royal Challengers Bangalore',
  role: 'Right-hand Batsman',
  country: 'India',
  age: 35,
  matches_played: 237,
  player_id: 'P001',
};

const playerStats: PlayerStats = {
  matches: 237,
  innings: 229,
  runs: 7263,
  average: 37.25,
  strike_rate: 130.1,
  highest_score: 113,
  fifties: 50,
  hundreds: 7,
  ducks: 11,
  fours: 578,
  sixes: 219,
  boundaries: 797,
};

const runsTrend: ChartData[] = [
  { label: '2019', value: 464 },
  { label: '2020', value: 466 },
  { label: '2021', value: 405 },
  { label: '2022', value: 341 },
  { label: '2023', value: 639 },
  { label: '2024', value: 741 },
];

const averageTrend: ChartData[] = [
  { label: '2019', value: 33.14 },
  { label: '2020', value: 42.36 },
  { label: '2021', value: 28.92 },
  { label: '2022', value: 34.1 },
  { label: '2023', value: 53.25 },
  { label: '2024', value: 61.75 },
];

const strikeRateTrend: ChartData[] = [
  { label: '2019', value: 141.2 },
  { label: '2020', value: 121.35 },
  { label: '2021', value: 147.3 },
  { label: '2022', value: 116.4 },
  { label: '2023', value: 151.2 },
  { label: '2024', value: 154.2 },
];

const runsByOpposition: ChartData[] = [
  { label: 'CSK', value: 950 },
  { label: 'MI', value: 820 },
  { label: 'KKR', value: 741 },
  { label: 'DC', value: 680 },
  { label: 'PBKS', value: 590 },
  { label: 'RR', value: 520 },
  { label: 'SRH', value: 450 },
  { label: 'GT', value: 312 },
];

const runsByVenue: ChartData[] = [
  { label: 'Bangalore', value: 2840 },
  { label: 'Mumbai', value: 890 },
  { label: 'Chennai', value: 756 },
  { label: 'Delhi', value: 623 },
  { label: 'Kolkata', value: 589 },
  { label: 'Hyderabad', value: 412 },
];

const runsByPhase: ChartData[] = [
  { label: 'Powerplay (1-6)', value: 1850, color: '#3b82f6' },
  { label: 'Middle (7-15)', value: 3412, color: '#06b6d4' },
  { label: 'Death (16-20)', value: 2001, color: '#ef4444' },
];

const lastInnings: Innings[] = [
  { match_id: 'M74', date: 'May 19, 2024', opposition: 'CSK', venue: 'Bangalore', runs: 47, balls: 35, dismissal: 'caught', sr: 134.2, match_format: 'T20' },
  { match_id: 'M72', date: 'May 15, 2024', opposition: 'DC', venue: 'Delhi', runs: 27, balls: 13, dismissal: 'caught', sr: 207.6, match_format: 'T20' },
  { match_id: 'M70', date: 'May 12, 2024', opposition: 'RR', venue: 'Jaipur', runs: 113, balls: 72, dismissal: 'not out', sr: 156.9, match_format: 'T20' },
  { match_id: 'M68', date: 'May 9, 2024', opposition: 'GT', venue: 'Bangalore', runs: 42, balls: 27, dismissal: 'lbw', sr: 155.5, match_format: 'T20' },
  { match_id: 'M65', date: 'May 4, 2024', opposition: 'SRH', venue: 'Hyderabad', runs: 51, balls: 42, dismissal: 'caught', sr: 121.4, match_format: 'T20' },
  { match_id: 'M62', date: 'May 1, 2024', opposition: 'PBKS', venue: 'Mohali', runs: 92, balls: 47, dismissal: 'bowled', sr: 195.7, match_format: 'T20' },
  { match_id: 'M58', date: 'Apr 27, 2024', opposition: 'KKR', venue: 'Bangalore', runs: 83, balls: 50, dismissal: 'caught', sr: 166.0, match_format: 'T20' },
  { match_id: 'M54', date: 'Apr 23, 2024', opposition: 'MI', venue: 'Mumbai', runs: 3, balls: 9, dismissal: 'caught', sr: 33.3, match_format: 'T20' },
  { match_id: 'M50', date: 'Apr 19, 2024', opposition: 'RR', venue: 'Bangalore', runs: 67, balls: 38, dismissal: 'caught', sr: 176.3, match_format: 'T20' },
  { match_id: 'M45', date: 'Apr 15, 2024', opposition: 'LSG', venue: 'Lucknow', runs: 22, balls: 15, dismissal: 'run out', sr: 146.6, match_format: 'T20' },
];

const bestPerformances = [
  { match_id: 'M70', date: 'May 12, 2024', opposition: 'RR', runs: 113, balls: 72, sr: 156.9, result: 'RCB won by 47 runs' },
  { match_id: 'M62', date: 'May 1, 2024', opposition: 'PBKS', runs: 92, balls: 47, sr: 195.7, result: 'RCB won by 6 wkts' },
  { match_id: 'M58', date: 'Apr 27, 2024', opposition: 'KKR', runs: 83, balls: 50, sr: 166.0, result: 'RCB won by 8 wkts' },
  { match_id: 'M50', date: 'Apr 19, 2024', opposition: 'RR', runs: 67, balls: 38, sr: 176.3, result: 'RCB won by 12 runs' },
  { match_id: 'M65', date: 'May 4, 2024', opposition: 'SRH', runs: 51, balls: 42, sr: 121.4, result: 'SRH won by 5 wkts' },
];

// Loading Skeleton Component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse bg-slate-200 dark:bg-slate-700 rounded', className)} />
);

// Simple Bar Chart Component
const SimpleBarChart = ({ data, color = 'primary', showValue = true }: { data: ChartData[]; color?: string; showValue?: boolean }) => {
  const maxVal = Math.max(...data.map(d => d.value)) * 1.1;

  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-20 text-xs text-slate-600 dark:text-slate-400 text-right">
            {item.label}
          </div>
          <div className="flex-1 relative h-6 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / maxVal) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={cn(
                'h-full rounded-lg',
                color === 'primary' ? 'bg-gradient-to-r from-primary-500 to-cyan-500' :
                color === 'success' ? 'bg-gradient-to-r from-success-500 to-green-400' :
                color === 'warning' ? 'bg-gradient-to-r from-warning-500 to-orange-400' :
                'bg-gradient-to-r from-slate-500 to-slate-400'
              )}
            />
            {showValue && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-700 dark:text-slate-300">
                {item.color ? item.value : item.value.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Line Chart Component using SVG
const SimpleLineChart = ({ data, color = '#3b82f6', suffix = '' }: { data: ChartData[]; color?: string; suffix?: string }) => {
  const maxVal = Math.max(...data.map(d => d.value)) * 1.2;
  const minVal = Math.min(...data.map(d => d.value)) * 0.8;
  const range = maxVal - minVal;
  const width = 100 / data.length;

  const points = data.map((d, i) => {
    const x = (i + 0.5) * width;
    const y = 100 - ((d.value - minVal) / range) * 100;
    return `${x} ${y}`;
  }).join(', ');

  const areaPoints = `50 100, ${points}, ${50 + (data.length - 0.5) * width} 100`;

  return (
    <div className="h-40 relative">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {[25, 50, 75].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="0.5" />
        ))}

        {/* Area fill */}
        <polygon
          points={areaPoints}
          fill={color}
          opacity="0.1"
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {data.map((d, i) => {
          const x = (i + 0.5) * width;
          const y = 100 - ((d.value - minVal) / range) * 100;
          return (
            <circle key={i} cx={x} cy={y} r="1.5" fill={color} />
          );
        })}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between absolute bottom-0 left-0 right-0 px-2">
        {data.map((d, i) => (
          <span key={i} className="text-xs text-slate-500">{d.label}</span>
        ))}
      </div>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500 py-1">
        <span>{maxVal.toFixed(0)}{suffix}</span>
        <span>{((maxVal + minVal) / 2).toFixed(0)}{suffix}</span>
        <span>{minVal.toFixed(0)}{suffix}</span>
      </div>
    </div>
  );
};

// Donut Chart Component
const SimpleDonutChart = ({ data }: { data: ChartData[] }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = -90;

  return (
    <div className="flex items-center justify-center gap-6">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {data.map((d, i) => {
            const angle = (d.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = 50 + 35 * Math.cos(startRad);
            const y1 = 50 + 35 * Math.sin(startRad);
            const x2 = 50 + 35 * Math.cos(endRad);
            const y2 = 50 + 35 * Math.sin(endRad);

            const largeArc = angle > 180 ? 1 : 0;

            return (
              <path
                key={i}
                d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={d.color || `hsl(${i * 40}, 70%, 60%)`}
                className="hover:opacity-80 transition-opacity"
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" className="dark:fill-slate-900" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white">{total.toLocaleString()}</p>
            <p className="text-xs text-slate-500">Runs</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: d.color }} />
            <span className="text-sm text-slate-600 dark:text-slate-400">{d.label}</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">{d.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton loader for the entire page
const PlayerAnalyticsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-40" />
    </div>
    <GlassCard>
      <div className="flex gap-4">
        <Skeleton className="w-24 h-24 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </GlassCard>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="h-20" />
      ))}
    </div>
  </div>
);

export function PlayerAnalyticsDashboard() {
  const [player, setPlayer] = React.useState('virat-kohli');
  const [tournament, setTournament] = React.useState('all');
  const [season, setSeason] = React.useState('all');
  const [format, setFormat] = React.useState('T20');
  const [team, setTeam] = React.useState('all');
  const [showFilters, setShowFilters] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPlayerSearch, setShowPlayerSearch] = React.useState(false);
  const [playerSearchQuery, setPlayerSearchQuery] = React.useState('');

  const players = [
    { id: 'virat-kohli', name: 'Virat Kohli', team: 'RCB' },
    { id: 'ms-dhoni', name: 'MS Dhoni', team: 'CSK' },
    { id: 'rohit-sharma', name: 'Rohit Sharma', team: 'MI' },
    { id: 'jadeja', name: 'Ravindra Jadeja', team: 'CSK' },
    { id: 'bumrah', name: 'Jasprit Bumrah', team: 'MI' },
  ];

  const tournaments = ['IPL 2024', 'IPL 2023', 'T20 World Cup 2024', 'Asia Cup 2023'];
  const seasons = ['2024', '2023', '2022', '2021', '2020', '2019'];
  const formats = ['T20', 'ODI', 'Test', 'All Formats'];
  const teams = ['RCB', 'CSK', 'MI', 'KKR', 'SRH', 'RR', 'DC', 'PBKS', 'GT', 'LSG'];

  // Simulate loading state
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [player, tournament, season, format, team]);

  if (isLoading) {
    return <PlayerAnalyticsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary-500" />
            Player Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Comprehensive batting analysis and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-warning-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
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

      {/* Player Selection */}
      <GlassCard>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowPlayerSearch(!showPlayerSearch)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                {playerInfo.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-slate-900 dark:text-white">{playerInfo.name}</p>
                <p className="text-sm text-slate-500">{playerInfo.team} • {playerInfo.role}</p>
                <p className="text-xs text-slate-400">{playerInfo.country} • Age: {playerInfo.age}</p>
              </div>
              <ChevronDown className={cn('w-5 h-5 text-slate-400 transition-transform', showPlayerSearch && 'rotate-180')} />
            </button>

            {showPlayerSearch && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50"
              >
                <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search players..."
                      value={playerSearchQuery}
                      onChange={(e) => setPlayerSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto p-2">
                  {players.filter(p => p.name.toLowerCase().includes(playerSearchQuery.toLowerCase())).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPlayer(p.id);
                        setShowPlayerSearch(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors',
                        player === p.id ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {p.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.team}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex-1 flex flex-wrap items-center gap-3 justify-end">
            {/* Filters */}
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
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm"
            >
              {formats.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Tournament</label>
                <select
                  value={tournament}
                  onChange={(e) => setTournament(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                >
                  <option value="all">All Tournaments</option>
                  {tournaments.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Season</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                >
                  <option value="all">All Seasons</option>
                  {seasons.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Team</label>
                <select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                >
                  <option value="all">All Teams</option>
                  {teams.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Date Range</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>
            </div>
          </motion.div>
        )}
      </GlassCard>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Matches', value: playerStats.matches, icon: Activity, color: 'primary' },
          { label: 'Innings', value: playerStats.innings, icon: Calendar, color: 'cyan' },
          { label: 'Runs', value: playerStats.runs.toLocaleString(), icon: TrendingUp, color: 'success' },
          { label: 'Average', value: playerStats.average.toFixed(2), icon: Target, color: 'warning' },
          { label: 'Strike Rate', value: playerStats.strike_rate.toFixed(1), icon: Activity, color: 'primary' },
          { label: 'Highest Score', value: `${playerStats.highest_score}*`, icon: Award, color: 'success' },
          { label: 'Fifties', value: playerStats.fifties, icon: BarChart3, color: 'cyan' },
          { label: 'Hundreds', value: playerStats.hundreds, icon: Award, color: 'warning' },
          { label: 'Ducks', value: playerStats.ducks, icon: TrendingDown, color: 'error' },
          { label: 'Boundaries', value: playerStats.fours + playerStats.sixes, icon: Target, color: 'primary' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                stat.color === 'primary' ? 'bg-primary-100 dark:bg-primary-900/30' :
                stat.color === 'success' ? 'bg-success-100 dark:bg-success-900/30' :
                stat.color === 'warning' ? 'bg-warning-100 dark:bg-warning-900/30' :
                stat.color === 'cyan' ? 'bg-cyan-100 dark:bg-cyan-900/30' :
                'bg-error-100 dark:bg-error-900/30'
              )}>
                <stat.icon className={cn(
                  'w-4 h-4',
                  stat.color === 'primary' ? 'text-primary-600' :
                  stat.color === 'success' ? 'text-success-600' :
                  stat.color === 'warning' ? 'text-warning-600' :
                  stat.color === 'cyan' ? 'text-cyan-600' :
                  'text-error-600'
                )} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Runs Trend */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-primary-500" />
            Runs Trend (Season-wise)
          </h3>
          <SimpleLineChart data={runsTrend} color="#3b82f6" />
        </GlassCard>

        {/* Average Trend */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success-500" />
            Batting Average Trend
          </h3>
          <SimpleLineChart data={averageTrend} color="#10b981" />
        </GlassCard>

        {/* Strike Rate Trend */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-500" />
            Strike Rate Trend
          </h3>
          <SimpleLineChart data={strikeRateTrend} color="#06b6d4" />
        </GlassCard>

        {/* Runs by Phase */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-warning-500" />
            Runs by Match Phase
          </h3>
          <SimpleDonutChart data={runsByPhase} />
        </GlassCard>

        {/* Runs by Opposition */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            Runs by Opposition
          </h3>
          <SimpleBarChart data={runsByOpposition} />
        </GlassCard>

        {/* Runs by Venue */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-warning-500" />
            Runs by Venue
          </h3>
          <SimpleBarChart data={runsByVenue} color="success" />
        </GlassCard>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Last 10 Innings */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            Last 10 Innings
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2 text-left">Date</th>
                  <th className="py-2 text-left">Opposition</th>
                  <th className="py-2 text-center">Runs</th>
                  <th className="py-2 text-center">Balls</th>
                  <th className="py-2 text-center">SR</th>
                  <th className="py-2 text-left">Dismissal</th>
                </tr>
              </thead>
              <tbody>
                {lastInnings.slice(0, 7).map((inn, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 text-slate-600 dark:text-slate-400">{inn.date}</td>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">{inn.opposition}</td>
                    <td className={cn(
                      'py-3 text-center font-bold',
                      inn.runs >= 100 ? 'text-success-600' :
                      inn.runs >= 50 ? 'text-primary-600' :
                      inn.runs === 0 ? 'text-error-600' :
                      'text-slate-900 dark:text-white'
                    )}>
                      {inn.runs}{inn.dismissal === 'not out' ? '*' : ''}
                    </td>
                    <td className="py-3 text-center text-slate-600 dark:text-slate-400">{inn.balls}</td>
                    <td className={cn(
                      'py-3 text-center',
                      inn.sr >= 150 ? 'text-success-600 font-medium' :
                      inn.sr >= 120 ? 'text-primary-600' :
                      inn.sr < 100 ? 'text-warning-600' :
                      'text-slate-600 dark:text-slate-400'
                    )}>
                      {inn.sr.toFixed(1)}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400 capitalize">{inn.dismissal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Best Performances */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-warning-500" />
            Best Performances
          </h3>
          <div className="space-y-3">
            {bestPerformances.map((perf, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      i === 0 ? 'bg-yellow-500 text-white' :
                      i === 1 ? 'bg-slate-300 text-slate-700' :
                      i === 2 ? 'bg-amber-600 text-white' :
                      'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    )}>
                      {i + 1}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">vs {perf.opposition}</span>
                    <span className="text-xs text-slate-500">{perf.date}</span>
                  </div>
                  <span className={cn(
                    'text-lg font-bold',
                    perf.runs >= 100 ? 'text-success-600' : 'text-primary-600'
                  )}>
                    {perf.runs}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">SR: {perf.sr.toFixed(1)}</span>
                  <span className={cn(
                    'font-medium',
                    perf.result.includes('won') ? 'text-success-600' : 'text-error-600'
                  )}>
                    {perf.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Boundaries Summary */}
      <GlassCard>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Boundaries Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 text-white text-center">
            <p className="text-4xl font-bold">{playerStats.fours}</p>
            <p className="text-sm opacity-80 mt-1">Fours</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-success-500 to-green-400 text-white text-center">
            <p className="text-4xl font-bold">{playerStats.sixes}</p>
            <p className="text-sm opacity-80 mt-1">Sixes</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-warning-500 to-orange-400 text-white text-center">
            <p className="text-4xl font-bold">{playerStats.fours + playerStats.sixes}</p>
            <p className="text-sm opacity-80 mt-1">Total Boundaries</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export default PlayerAnalyticsDashboard;
