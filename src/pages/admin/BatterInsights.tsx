import React from 'react';
import { motion } from 'framer-motion';
import {
  Target, TrendingUp, Activity, BarChart3, Users, Calendar, MapPin,
  Download, FileSpreadsheet, Filter, Search, ChevronDown, Zap, Circle,
  GitCompare, Grid3X3
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

// Types
interface BatterStats {
  career_runs: number;
  innings: number;
  not_outs: number;
  average: number;
  strike_rate: number;
  boundary_percentage: number;
  fours: number;
  sixes: number;
  centuries: number;
  fifties: number;
  ducks: number;
  highest_score: number;
}

interface ShotData {
  shot: string;
  runs: number;
  percentage: number;
  balls: number;
}

interface DismissalData {
  type: string;
  count: number;
  percentage: number;
}

interface ZoneData {
  zone: string;
  runs: number;
  balls: number;
  dismissals: number;
}

// Mock Data
const batters = [
  { id: 'kohli', name: 'Virat Kohli', team: 'RCB', role: 'Batsman' },
  { id: 'sharma', name: 'Rohit Sharma', team: 'MI', role: 'Batsman' },
  { id: 'gill', name: 'Shubman Gill', team: 'GT', role: 'Batsman' },
  { id: 'gaikwad', name: 'Ruturaj Gaikwad', team: 'CSK', role: 'Batsman' },
  { id: 'head', name: 'Travis Head', team: 'SRH', role: 'Batsman' },
];

const selectedBatter = batters[0];
const compareBatter = batters[1];

const batterStats: BatterStats = {
  career_runs: 8014,
  innings: 237,
  not_outs: 31,
  average: 37.88,
  strike_rate: 132.4,
  boundary_percentage: 52.8,
  fours: 684,
  sixes: 273,
  centuries: 8,
  fifties: 55,
  ducks: 11,
  highest_score: 113,
};

const wagonWheelData = [
  { angle: 'Fine Leg', runs: 892, percentage: 11.1 },
  { angle: 'Square Leg', runs: 1245, percentage: 15.5 },
  { angle: 'Mid-Wicket', runs: 1678, percentage: 20.9 },
  { angle: 'Long On', runs: 1456, percentage: 18.2 },
  { angle: 'Straight', runs: 987, percentage: 12.3 },
  { angle: 'Long Off', runs: 534, percentage: 6.7 },
  { angle: 'Cover', runs: 712, percentage: 8.9 },
  { angle: 'Point', runs: 298, percentage: 3.7 },
  { angle: 'Third Man', runs: 212, percentage: 2.7 },
];

const dismissalTypes: DismissalData[] = [
  { type: 'Caught', count: 112, percentage: 54.6 },
  { type: 'Bowled', count: 28, percentage: 13.7 },
  { type: 'LBW', count: 24, percentage: 11.7 },
  { type: 'Run Out', count: 18, percentage: 8.8 },
  { type: 'Stumped', count: 12, percentage: 5.9 },
  { type: 'Not Out', count: 47, percentage: 5.3 },
];

const runsAgainstBowling = [
  { type: 'Fast', runs: 3256, balls: 2845, sr: 114.7, dismissals: 82 },
  { type: 'Medium', runs: 1878, balls: 1434, sr: 131.0, dismissals: 28 },
  { type: 'Spin', runs: 2880, balls: 1987, sr: 144.8, dismissals: 41 },
  { type: 'Leg Spin', runs: 1423, balls: 876, sr: 162.4, dismissals: 21 },
  { type: 'Off Spin', runs: 987, balls: 712, sr: 138.6, dismissals: 15 },
];

const scoringZones: ZoneData[] = [
  { zone: 'Off Side Front', runs: 1456, balls: 1023, dismissals: 18 },
  { zone: 'Off Side Back', runs: 2345, balls: 1456, dismissals: 32 },
  { zone: 'Leg Side Front', runs: 1876, balls: 1212, dismissals: 24 },
  { zone: 'Leg Side Back', runs: 2234, balls: 1345, dismissals: 28 },
  { zone: 'Straight', runs: 1892, balls: 1123, dismissals: 15 },
];

const shotDistribution: ShotData[] = [
  { shot: 'Cover Drive', runs: 1245, percentage: 15.5, balls: 456 },
  { shot: 'Pull Shot', runs: 1876, percentage: 23.4, balls: 612 },
  { shot: 'Flick', runs: 1234, percentage: 15.4, balls: 423 },
  { shot: 'Sweep', runs: 567, percentage: 7.1, balls: 234 },
  { shot: 'Cut Shot', runs: 789, percentage: 9.8, balls: 287 },
  { shot: 'Lofted Drive', runs: 1456, percentage: 18.2, balls: 489 },
  { shot: 'Hook', runs: 342, percentage: 4.3, balls: 156 },
];

const heatmapData = [
  [2, 3, 5, 8, 12, 15, 18, 22],
  [3, 5, 8, 12, 18, 25, 28, 32],
  [5, 8, 12, 18, 25, 32, 38, 45],
  [8, 12, 18, 25, 35, 42, 48, 55],
  [5, 8, 12, 18, 25, 30, 35, 42],
  [3, 5, 8, 12, 18, 22, 28, 35],
  [2, 3, 5, 8, 12, 15, 18, 25],
  [1, 2, 3, 5, 8, 12, 15, 20],
];

// Wagon Wheel Component
const WagonWheelChart = ({ data }: { data: typeof wagonWheelData }) => {
  const maxRuns = Math.max(...data.map(d => d.runs));

  return (
    <div className="relative w-80 h-80 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Background circles */}
        {[0.25, 0.5, 0.75, 1].map((r, i) => (
          <circle key={i} cx="100" cy="100" r={r * 80} fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="0.5" />
        ))}
        {/* Cross lines */}
        <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="0.5" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="0.5" />

        {/* Data sections */}
        {data.map((d, i) => {
          const startAngle = (i * 360) / data.length - 90;
          const endAngle = ((i + 1) * 360) / data.length - 90;
          const radius = 60 + (d.runs / maxRuns) * 20;

          const x1 = 100 + radius * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 100 + radius * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 100 + radius * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 100 + radius * Math.sin((endAngle * Math.PI) / 180);

          const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;

          const path = `M 100 100 L ${100 + 40 * Math.cos((startAngle * Math.PI) / 180)} ${100 + 40 * Math.sin((startAngle * Math.PI) / 180)} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${100 + 40 * Math.cos((endAngle * Math.PI) / 180)} ${100 + 40 * Math.sin((endAngle * Math.PI) / 180)} Z`;

          return (
            <motion.path
              key={i}
              d={path}
              fill={`hsl(${i * 40}, 70%, 60%)`}
              fillOpacity={0.7}
              stroke="white"
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            />
          );
        })}

        {/* Center circle */}
        <circle cx="100" cy="100" r="40" fill="white" className="dark:fill-slate-900" />
        <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-slate-600 dark:fill-slate-400">
          Scoring Areas
        </text>
      </svg>
    </div>
  );
};

// Dismissal Donut Chart
const DismissalDonut = ({ data }: { data: DismissalData[] }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  let currentAngle = -90;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-44 h-44">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {data.slice(0, 5).map((d, i) => {
            const angle = (d.count / total) * 360;
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

            const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'];

            return (
              <path
                key={i}
                d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={colors[i]}
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" className="dark:fill-slate-900" />
        </svg>
      </div>
      <div className="space-y-2">
        {data.slice(0, 5).map((d, i) => {
          const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'];
          return (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[i] }} />
              <span className="text-sm text-slate-600 dark:text-slate-400">{d.type}</span>
              <span className="text-sm font-medium">{d.percentage.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Heat Map Component
const HeatMap = ({ data }: { data: number[][] }) => {
  const maxVal = Math.max(...data.flat());

  return (
    <div className="relative">
      <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-xs text-slate-500">
        {[8, 7, 6, 5, 4, 3, 2, 1].map((r) => (
          <span key={r}>{r}</span>
        ))}
      </div>
      <svg viewBox="0 0 160 160" className="w-full">
        {data.map((row, y) =>
          row.map((val, x) => {
            const intensity = val / maxVal;
            return (
              <rect
                key={`${x}-${y}`}
                x={x * 20}
                y={y * 20}
                width="18"
                height="18"
                rx="2"
                fill={`rgb(${Math.floor(255 * intensity)}, ${Math.floor(100 * (1 - intensity))}, ${Math.floor(50 * (1 - intensity))})`}
                fillOpacity={0.3 + intensity * 0.7}
              />
            );
          })
        )}
      </svg>
      <div className="flex justify-between mt-2 text-xs text-slate-500">
        <span>Off</span>
        <span>Middle</span>
        <span>Leg</span>
      </div>
    </div>
  );
};

// Player Comparison Component
const PlayerComparison = ({ player1, player2 }: { player1: typeof selectedBatter; player2: typeof compareBatter }) => {
  const stats1 = [8014, 37.88, 132.4, 52.8, 8, 55, 273];
  const stats2 = [6628, 29.5, 130.2, 48.5, 2, 40, 280];
  const maxValues = [10000, 50, 150, 60, 10, 60, 350];
  const labels = ['Runs', 'Average', 'SR', 'Boundary%', '100s', '50s', 'Sixes'];

  return (
    <div className="grid grid-cols-7 gap-2">
      {labels.map((label, i) => (
        <div key={i} className="text-center">
          <p className="text-xs text-slate-500 mb-2">{label}</p>
          <div className="relative h-40 flex items-end justify-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(stats1[i] / maxValues[i]) * 100}%` }}
              className="w-6 bg-primary-500 rounded-t"
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(stats2[i] / maxValues[i]) * 100}%` }}
              className="w-6 bg-cyan-500 rounded-t"
            />
          </div>
          <div className="flex justify-center gap-2 mt-2 text-xs font-medium">
            <span className="text-primary-600">{typeof stats1[i] === 'number' && stats1[i] % 1 !== 0 ? stats1[i].toFixed(1) : stats1[i]}</span>
            <span className="text-cyan-600">{typeof stats2[i] === 'number' && stats2[i] % 1 !== 0 ? stats2[i].toFixed(1) : stats2[i]}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export function BatterInsights() {
  const [showBatterSearch, setShowBatterSearch] = React.useState(false);
  const [showGitCompareSearch, setShowGitCompareSearch] = React.useState(false);
  const [selected, setSelected] = React.useState('kohli');
  const [compare, setGitCompare] = React.useState('sharma');
  const [showComparison, setShowComparison] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-warning-500" />
            Batter Insights
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Advanced batting analysis and shot visualization</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium',
              showComparison ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            )}
          >
            <GitCompare className="w-4 h-4" />
            GitCompare
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success-100 text-success-700 font-medium">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Batter Selection */}
      <GlassCard>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <button
              onClick={() => setShowBatterSearch(!showBatterSearch)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-warning-500 to-orange-500 flex items-center justify-center text-white text-xl font-bold">
                {selectedBatter.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedBatter.name}</p>
                <p className="text-sm text-slate-500">{selectedBatter.team} • {selectedBatter.role}</p>
              </div>
              <ChevronDown className={cn('w-5 h-5 text-slate-400 transition-transform', showBatterSearch && 'rotate-180')} />
            </button>

            {showBatterSearch && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50"
              >
                <div className="p-2">
                  {batters.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { setSelected(b.id); setShowBatterSearch(false); }}
                      className={cn(
                        'w-full flex items-center gap-3 p-2 rounded-lg text-left',
                        selected === b.id ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center text-warning-700 font-bold">
                        {b.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{b.name}</p>
                        <p className="text-xs text-slate-500">{b.team}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {showComparison && (
            <>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                <GitCompare className="w-4 h-4" />
                vs
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowGitCompareSearch(!showGitCompareSearch)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                    {compareBatter.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{compareBatter.name}</p>
                    <p className="text-sm text-slate-500">{compareBatter.team} • {compareBatter.role}</p>
                  </div>
                  <ChevronDown className={cn('w-5 h-5 text-slate-400 transition-transform', showGitCompareSearch && 'rotate-180')} />
                </button>

                {showGitCompareSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50"
                  >
                    <div className="p-2">
                      {batters.filter(b => b.id !== selected).map((b) => (
                        <button
                          key={b.id}
                          onClick={() => { setGitCompare(b.id); setShowGitCompareSearch(false); }}
                          className={cn(
                            'w-full flex items-center gap-3 p-2 rounded-lg text-left',
                            compare === b.id ? 'bg-cyan-50 dark:bg-cyan-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                          )}
                        >
                          <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold">
                            {b.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{b.name}</p>
                            <p className="text-xs text-slate-500">{b.team}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </div>
      </GlassCard>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Career Runs', value: batterStats.career_runs.toLocaleString() },
          { label: 'Average', value: batterStats.average.toFixed(2) },
          { label: 'Strike Rate', value: batterStats.strike_rate.toFixed(1) },
          { label: 'Boundary %', value: batterStats.boundary_percentage.toFixed(1) + '%' },
          { label: 'Centuries', value: batterStats.centuries },
          { label: 'Fifties', value: batterStats.fifties },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Comparison Section */}
      {showComparison && (
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-primary-500" />
            Player Comparison
          </h3>
          <PlayerComparison player1={selectedBatter} player2={compareBatter} />
          <div className="flex items-center justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">{selectedBatter.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-cyan-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">{compareBatter.name}</span>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wagon Wheel */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Circle className="w-5 h-5 text-primary-500" />
            Wagon Wheel - Scoring Areas
          </h3>
          <WagonWheelChart data={wagonWheelData} />
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            {wagonWheelData.slice(0, 6).map((d, i) => (
              <div key={i} className="text-center">
                <p className="font-medium text-slate-900 dark:text-white">{d.runs}</p>
                <p className="text-slate-500">{d.angle}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Dismissal Types */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-error-500" />
            Dismissal Types
          </h3>
          <DismissalDonut data={dismissalTypes} />
        </GlassCard>

        {/* Runs Against Bowling Types */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-500" />
            Runs Against Bowling Types
          </h3>
          <div className="space-y-3">
            {runsAgainstBowling.map((b, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900 dark:text-white">{b.type}</span>
                  <span className="text-lg font-bold text-primary-600">{b.runs}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>SR: {b.sr.toFixed(1)}</span>
                  <span>Balls: {b.balls}</span>
                  <span>Dismissals: {b.dismissals}</span>
                </div>
                <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full"
                    style={{ width: `${(b.runs / 3500) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Heat Map */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-warning-500" />
            Scoring Heat Map
          </h3>
          <HeatMap data={heatmapData} />
          <p className="text-xs text-slate-500 mt-4 text-center">
            Intensity shows runs scored in different batting positions
          </p>
        </GlassCard>
      </div>

      {/* Shot Distribution */}
      <GlassCard>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-warning-500" />
          Shot Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shotDistribution.map((shot, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50"
            >
              <p className="text-sm font-medium text-slate-900 dark:text-white">{shot.shot}</p>
              <p className="text-2xl font-bold text-primary-600 mt-2">{shot.runs}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                <span>{shot.percentage.toFixed(1)}%</span>
                <span>{shot.balls} balls</span>
              </div>
              <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning-500 rounded-full"
                  style={{ width: `${shot.percentage}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Scoring Zones */}
      <GlassCard>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary-500" />
          Scoring Zones Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 text-left">Zone</th>
                <th className="py-3 text-center">Runs</th>
                <th className="py-3 text-center">Balls</th>
                <th className="py-3 text-center">SR</th>
                <th className="py-3 text-center">Dismissals</th>
                <th className="py-3 text-center">Avg</th>
              </tr>
            </thead>
            <tbody>
              {scoringZones.map((zone, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-4 font-medium text-slate-900 dark:text-white">{zone.zone}</td>
                  <td className="py-4 text-center font-bold">{zone.runs}</td>
                  <td className="py-4 text-center text-slate-600 dark:text-slate-400">{zone.balls}</td>
                  <td className="py-4 text-center">
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      (zone.runs / zone.balls * 100) >= 140 ? 'bg-success-100 text-success-600' :
                      (zone.runs / zone.balls * 100) >= 120 ? 'bg-primary-100 text-primary-600' :
                      'bg-warning-100 text-warning-600'
                    )}>
                      {(zone.runs / zone.balls * 100).toFixed(1)}
                    </span>
                  </td>
                  <td className="py-4 text-center text-error-600 font-medium">{zone.dismissals}</td>
                  <td className="py-4 text-center">{(zone.runs / zone.dismissals).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

export default BatterInsights;
