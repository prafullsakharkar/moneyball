import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download, ChevronDown, Trophy, Users, TrendingUp, Target,
  Award, BarChart3, Zap, Shield
} from 'lucide-react';
import { GlassCard, KPIWidget } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

// Types
interface Captain {
  id: string;
  name: string;
  team: string;
  matches: number;
  wins: number;
  losses: number;
  winPercentage: number;
  tossWins: number;
  tossWinPercentage: number;
  nrr: number;
  bestWinStreak: number;
}

interface SeasonTrend {
  season: string;
  winPercentage: number;
}

interface TossDecision {
  label: string;
  batFirstWon: number;
  batFirstLost: number;
  bowlFirstWon: number;
  bowlFirstLost: number;
}

interface TeamPerformance {
  season: string;
  wins: number;
  losses: number;
}

// Mock Data - 6 IPL Captains
const captainsList: Captain[] = [
  {
    id: '1',
    name: 'Rohit Sharma',
    team: 'MI',
    matches: 156,
    wins: 104,
    losses: 52,
    winPercentage: 66.7,
    tossWins: 74,
    tossWinPercentage: 47.4,
    nrr: 0.512,
    bestWinStreak: 7,
  },
  {
    id: '2',
    name: 'Ruturaj Gaikwad',
    team: 'CSK',
    matches: 64,
    wins: 42,
    losses: 22,
    winPercentage: 65.6,
    tossWins: 32,
    tossWinPercentage: 50.0,
    nrr: 0.378,
    bestWinStreak: 6,
  },
  {
    id: '3',
    name: 'Hardik Pandya',
    team: 'MI',
    matches: 35,
    wins: 22,
    losses: 13,
    winPercentage: 62.9,
    tossWins: 18,
    tossWinPercentage: 51.4,
    nrr: 0.245,
    bestWinStreak: 5,
  },
  {
    id: '4',
    name: 'Faf du Plessis',
    team: 'RCB',
    matches: 48,
    wins: 28,
    losses: 20,
    winPercentage: 58.3,
    tossWins: 22,
    tossWinPercentage: 45.8,
    nrr: 0.089,
    bestWinStreak: 4,
  },
  {
    id: '5',
    name: 'Shubman Gill',
    team: 'GT',
    matches: 42,
    wins: 28,
    losses: 14,
    winPercentage: 66.7,
    tossWins: 20,
    tossWinPercentage: 47.6,
    nrr: 0.567,
    bestWinStreak: 6,
  },
  {
    id: '6',
    name: 'Sanju Samson',
    team: 'RR',
    matches: 58,
    wins: 34,
    losses: 24,
    winPercentage: 58.6,
    tossWins: 28,
    tossWinPercentage: 48.3,
    nrr: 0.156,
    bestWinStreak: 5,
  },
];

const seasonTrendData: SeasonTrend[] = [
  { season: '2018', winPercentage: 45.2 },
  { season: '2019', winPercentage: 52.3 },
  { season: '2020', winPercentage: 58.1 },
  { season: '2021', winPercentage: 61.5 },
  { season: '2022', winPercentage: 64.2 },
  { season: '2023', winPercentage: 65.8 },
  { season: '2024', winPercentage: 66.7 },
];

const teamPerformanceData: TeamPerformance[] = [
  { season: '2018', wins: 8, losses: 6 },
  { season: '2019', wins: 10, losses: 4 },
  { season: '2020', wins: 12, losses: 3 },
  { season: '2021', wins: 13, losses: 2 },
  { season: '2022', wins: 14, losses: 2 },
  { season: '2023', wins: 15, losses: 1 },
  { season: '2024', wins: 16, losses: 0 },
];

const bestCaptainRecords: Captain[] = [
  {
    id: '1',
    name: 'Rohit Sharma',
    team: 'MI',
    matches: 156,
    wins: 104,
    winPercentage: 66.7,
    tossWins: 74,
    tossWinPercentage: 47.4,
    nrr: 0.512,
    bestWinStreak: 7,
    losses: 52,
  },
  {
    id: '5',
    name: 'Shubman Gill',
    team: 'GT',
    matches: 42,
    wins: 28,
    winPercentage: 66.7,
    tossWins: 20,
    tossWinPercentage: 47.6,
    nrr: 0.567,
    bestWinStreak: 6,
    losses: 14,
  },
  {
    id: '2',
    name: 'Ruturaj Gaikwad',
    team: 'CSK',
    matches: 64,
    wins: 42,
    winPercentage: 65.6,
    tossWins: 32,
    tossWinPercentage: 50.0,
    nrr: 0.378,
    bestWinStreak: 6,
    losses: 22,
  },
  {
    id: '3',
    name: 'Hardik Pandya',
    team: 'MI',
    matches: 35,
    wins: 22,
    winPercentage: 62.9,
    tossWins: 18,
    tossWinPercentage: 51.4,
    nrr: 0.245,
    bestWinStreak: 5,
    losses: 13,
  },
  {
    id: '4',
    name: 'Faf du Plessis',
    team: 'RCB',
    matches: 48,
    wins: 28,
    winPercentage: 58.3,
    tossWins: 22,
    tossWinPercentage: 45.8,
    nrr: 0.089,
    bestWinStreak: 4,
    losses: 20,
  },
  {
    id: '6',
    name: 'Sanju Samson',
    team: 'RR',
    matches: 58,
    wins: 34,
    winPercentage: 58.6,
    tossWins: 28,
    tossWinPercentage: 48.3,
    nrr: 0.156,
    bestWinStreak: 5,
    losses: 24,
  },
  {
    id: '7',
    name: 'MS Dhoni',
    team: 'CSK',
    matches: 170,
    wins: 111,
    winPercentage: 65.3,
    tossWins: 85,
    tossWinPercentage: 50.0,
    nrr: 0.289,
    bestWinStreak: 8,
    losses: 59,
  },
  {
    id: '8',
    name: 'Virat Kohli',
    team: 'RCB',
    matches: 140,
    wins: 68,
    winPercentage: 48.6,
    tossWins: 68,
    tossWinPercentage: 48.6,
    nrr: -0.089,
    bestWinStreak: 4,
    losses: 72,
  },
];

// SVG Chart Components
function TossDecisionsChart() {
  const data = [
    { label: 'Bat First Won', value: 45, color: '#22c55e' },
    { label: 'Bat First Lost', value: 32, color: '#ef4444' },
    { label: 'Bowl First Won', value: 38, color: '#22c55e' },
    { label: 'Bowl First Lost', value: 28, color: '#ef4444' },
  ];

  const maxValue = Math.max(...data.map(d => d.value));
  const chartHeight = 200;
  const barHeight = chartHeight / data.length;

  return (
    <svg viewBox="0 0 500 250" className="w-full h-full">
      {data.map((item, idx) => {
        const width = (item.value / maxValue) * 350;
        const y = idx * barHeight + 20;

        return (
          <g key={idx}>
            <rect x="100" y={y + 10} width={width} height={barHeight - 10} fill={item.color} opacity="0.8" rx="4" />
            <text x="10" y={y + 30} fontSize="12" fill="#9ca3af" fontWeight="500">
              {item.label}
            </text>
            <text x={100 + width + 10} y={y + 30} fontSize="13" fill="#1f2937" fontWeight="600">
              {item.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function CaptaincyTrendChart({ data }: { data: SeasonTrend[] }) {
  const chartHeight = 180;
  const chartWidth = 450;
  const padding = 40;
  const maxValue = 100;

  const points = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1)) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - (d.winPercentage / maxValue) * (chartHeight - 2 * padding);
    return { x, y, value: d.winPercentage };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
      {/* Grid lines */}
      {[25, 50, 75, 100].map((val) => {
        const y = chartHeight - padding - (val / 100) * (chartHeight - 2 * padding);
        return (
          <g key={`grid-${val}`}>
            <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#e5e7eb" strokeDasharray="4" />
            <text x={padding - 20} y={y + 4} fontSize="11" fill="#9ca3af" textAnchor="end">
              {val}%
            </text>
          </g>
        );
      })}

      {/* Path */}
      <path d={pathData} stroke="#6366f1" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Fill area */}
      <path
        d={`${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`}
        fill="#6366f1"
        opacity="0.1"
      />

      {/* Points */}
      {points.map((p, idx) => (
        <g key={`point-${idx}`}>
          <circle cx={p.x} cy={p.y} r="5" fill="#6366f1" />
          <circle cx={p.x} cy={p.y} r="3" fill="white" />
          <text x={p.x} y={chartHeight - padding + 20} fontSize="12" fill="#6b7280" textAnchor="middle">
            {data[idx].season}
          </text>
        </g>
      ))}

      {/* Y-axis */}
      <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#d1d5db" strokeWidth="1" />

      {/* X-axis */}
      <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#d1d5db" strokeWidth="1" />
    </svg>
  );
}

function TeamPerformanceChart({ data }: { data: TeamPerformance[] }) {
  const chartHeight = 200;
  const chartWidth = 450;
  const padding = 40;
  const barWidth = (chartWidth - 2 * padding) / (data.length * 2.5);

  const maxValue = Math.max(...data.flatMap(d => [d.wins, d.losses]));

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
      {/* Grid lines */}
      {[0, 5, 10, 15, 20].map((val) => {
        const y = chartHeight - padding - (val / 20) * (chartHeight - 2 * padding);
        return (
          <g key={`grid-${val}`}>
            <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#e5e7eb" strokeDasharray="4" />
            <text x={padding - 20} y={y + 4} fontSize="11" fill="#9ca3af" textAnchor="end">
              {val}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, idx) => {
        const x = padding + idx * (chartWidth - 2 * padding) / data.length + 10;
        const winsHeight = (d.wins / 20) * (chartHeight - 2 * padding);
        const lossesHeight = (d.losses / 20) * (chartHeight - 2 * padding);

        return (
          <g key={idx}>
            {/* Wins bar (green) */}
            <rect
              x={x}
              y={chartHeight - padding - winsHeight}
              width={barWidth}
              height={winsHeight}
              fill="#22c55e"
              opacity="0.8"
              rx="2"
            />
            {/* Losses bar (red) */}
            <rect
              x={x + barWidth + 4}
              y={chartHeight - padding - lossesHeight}
              width={barWidth}
              height={lossesHeight}
              fill="#ef4444"
              opacity="0.8"
              rx="2"
            />
            {/* Season label */}
            <text x={x + barWidth} y={chartHeight - padding + 20} fontSize="12" fill="#6b7280" textAnchor="middle">
              {d.season}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g>
        <rect x={chartWidth - 180} y={10} width={12} height={12} fill="#22c55e" rx="2" />
        <text x={chartWidth - 160} y={19} fontSize="12" fill="#6b7280">
          Wins
        </text>
        <rect x={chartWidth - 100} y={10} width={12} height={12} fill="#ef4444" rx="2" />
        <text x={chartWidth - 80} y={19} fontSize="12" fill="#6b7280">
          Losses
        </text>
      </g>

      {/* Axes */}
      <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#d1d5db" strokeWidth="1" />
      <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#d1d5db" strokeWidth="1" />
    </svg>
  );
}

// Main Component
export function CaptainAnalyticsDashboard() {
  const [selectedCaptain, setSelectedCaptain] = useState<Captain>(captainsList[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Captain Analytics</h1>
            <p className="text-slate-600 dark:text-slate-400">Comprehensive leadership & decision-making analysis</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>

        {/* Captain Selector */}
        <GlassCard className="mb-6">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full lg:w-80 flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary-400 dark:hover:border-primary-400 transition-colors"
            >
              <div className="text-left">
                <p className="text-sm text-slate-500 dark:text-slate-400">Selected Captain</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {selectedCaptain.name} ({selectedCaptain.team})
                </p>
              </div>
              <ChevronDown size={20} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50"
              >
                {captainsList.map((captain) => (
                  <button
                    key={captain.id}
                    onClick={() => {
                      setSelectedCaptain(captain);
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0',
                      selectedCaptain.id === captain.id && 'bg-primary-50 dark:bg-primary-900/20'
                    )}
                  >
                    <p className="font-semibold text-slate-900 dark:text-white">{captain.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{captain.team}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <KPIWidget
          title="Matches Captained"
          value={selectedCaptain.matches}
          icon={<Trophy size={24} />}
          color="#6366f1"
          delay={0}
        />
        <KPIWidget
          title="Wins"
          value={selectedCaptain.wins}
          icon={<TrendingUp size={24} />}
          color="#22c55e"
          delay={1}
        />
        <KPIWidget
          title="Losses"
          value={selectedCaptain.losses}
          icon={<Target size={24} />}
          color="#ef4444"
          delay={2}
        />
        <KPIWidget
          title="Win Percentage"
          value={`${selectedCaptain.winPercentage.toFixed(1)}%`}
          icon={<Zap size={24} />}
          color="#f59e0b"
          delay={3}
        />
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Toss Decisions */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard gradient hover className="h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <BarChart3 size={22} className="text-primary-500" />
              Toss Decisions Success
            </h3>
            <div className="h-56">
              <TossDecisionsChart />
            </div>
          </GlassCard>
        </motion.div>

        {/* Captaincy Trend */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard gradient hover className="h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp size={22} className="text-success-500" />
              Captaincy Trend ({selectedCaptain.name})
            </h3>
            <div className="h-56">
              <CaptaincyTrendChart data={seasonTrendData} />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Team Performance Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <GlassCard gradient hover className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <BarChart3 size={22} className="text-cyan-500" />
            Team Performance Under {selectedCaptain.name}
          </h3>
          <div className="h-56">
            <TeamPerformanceChart data={teamPerformanceData} />
          </div>
        </GlassCard>
      </motion.div>

      {/* Toss Analysis Mini Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <GlassCard className="border-l-4 border-l-cyan-500">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Toss Won %</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{selectedCaptain.tossWinPercentage.toFixed(1)}%</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            {selectedCaptain.tossWins} out of {selectedCaptain.matches} tosses
          </p>
        </GlassCard>

        <GlassCard className="border-l-4 border-l-green-500">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Chose to Bat %</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">52.5%</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">39 times out of 74 toss wins</p>
        </GlassCard>

        <GlassCard className="border-l-4 border-l-amber-500">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Chose to Bowl %</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">47.5%</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">35 times out of 74 toss wins</p>
        </GlassCard>

        <GlassCard className="border-l-4 border-l-purple-500">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Won After Toss %</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">68.9%</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">51 wins out of 74 toss wins</p>
        </GlassCard>
      </motion.div>

      {/* Best Captain Records Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <GlassCard gradient hover>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Award size={22} className="text-amber-500" />
            Best Captain Records (IPL History)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Rank</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Captain</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Team</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">Matches</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">Wins</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">Win%</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">Best Win Streak</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">Toss Win%</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">NRR</th>
                </tr>
              </thead>
              <tbody>
                {bestCaptainRecords.map((captain, idx) => (
                  <motion.tr
                    key={captain.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      'border-b border-slate-200 dark:border-slate-700 transition-colors',
                      idx === 0 && 'bg-amber-50/50 dark:bg-amber-900/10'
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {idx === 0 && <Trophy size={18} className="text-amber-500" />}
                        <span className={cn(
                          'font-semibold',
                          idx === 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-900 dark:text-white'
                        )}>
                          #{idx + 1}
                        </span>
                      </div>
                    </td>
                    <td className={cn(
                      'px-4 py-3 font-semibold',
                      idx === 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-900 dark:text-white'
                    )}>
                      {captain.name}
                    </td>
                    <td className={cn(
                      'px-4 py-3',
                      idx === 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
                    )}>
                      {captain.team}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">{captain.matches}</td>
                    <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">{captain.wins}</td>
                    <td className="px-4 py-3 text-center font-semibold text-success-600 dark:text-success-400">
                      {captain.winPercentage.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">{captain.bestWinStreak}</td>
                    <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">
                      {captain.tossWinPercentage.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
                      {captain.nrr > 0 ? '+' : ''}{captain.nrr.toFixed(3)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default CaptainAnalyticsDashboard;
