import React from 'react';
import { motion } from 'framer-motion';
import {
  Target, TrendingUp, Activity, BarChart3, Users, Calendar, MapPin,
  Download, FileSpreadsheet, Filter, Search, ChevronDown, Zap, Circle,
  Shield, Award, Clock, LineChart
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

// Types
interface BowlerStats {
  total_wickets: number;
  innings: number;
  overs: number;
  economy: number;
  average: number;
  strike_rate: number;
  maidens: number;
  five_wicket_hauls: number;
  best_figures: string;
  dots_percentage: number;
}

interface PhaseStats {
  phase: string;
  overs: number;
  wickets: number;
  economy: number;
  avg: number;
  sr: number;
}

interface Performance {
  date: string;
  opposition: string;
  overs: number;
  runs: number;
  wickets: number;
  econ: number;
  result: string;
}

// Mock Data
const bowlers = [
  { id: 'bumrah', name: 'Jasprit Bumrah', team: 'MI', role: 'Right-arm Fast' },
  { id: 'shami', name: 'Mohammed Shami', team: 'GT', role: 'Right-arm Fast' },
  { id: 'chahal', name: 'Yuzvendra Chahal', team: 'RR', role: 'Leg Spin' },
  { id: 'rabada', name: 'Kagiso Rabada', team: 'PBKS', role: 'Right-arm Fast' },
  { id: 'narine', name: 'Sunil Narine', team: 'KKR', role: 'Off Spin' },
];

const selectedBowler = bowlers[0];

const bowlerStats: BowlerStats = {
  total_wickets: 172,
  innings: 138,
  overs: 528.4,
  economy: 7.48,
  average: 23.1,
  strike_rate: 18.5,
  maidens: 12,
  five_wicket_hauls: 6,
  best_figures: '5/12',
  dots_percentage: 42.8,
};

const wicketsTrend = [
  { season: '2018', wickets: 21 },
  { season: '2019', wickets: 19 },
  { season: '2020', wickets: 27 },
  { season: '2021', wickets: 22 },
  { season: '2022', wickets: 20 },
  { season: '2023', wickets: 32 },
  { season: '2024', wickets: 31 },
];

const economyTrend = [
  { season: '2018', economy: 8.2 },
  { season: '2019', economy: 6.9 },
  { season: '2020', economy: 7.1 },
  { season: '2021', economy: 7.4 },
  { season: '2022', economy: 7.2 },
  { season: '2023', economy: 6.8 },
  { season: '2024', economy: 7.1 },
];

const phaseAnalysis: PhaseStats[] = [
  { phase: 'Powerplay (1-6)', overs: 186, wickets: 58, economy: 7.2, avg: 15.8, sr: 19.2 },
  { phase: 'Middle (7-15)', overs: 212, wickets: 67, economy: 7.4, avg: 22.4, sr: 18.2 },
  { phase: 'Death (16-20)', overs: 130, wickets: 47, economy: 8.1, avg: 26.2, sr: 17.8 },
];

const bowlingZones = [
  { zone: 'Off Stump', balls: 892, wickets: 45, percentage: 26.2 },
  { zone: 'Leg Stump', balls: 534, wickets: 28, percentage: 15.7 },
  { zone: 'Middle', balls: 1023, wickets: 52, percentage: 30.2 },
  { zone: 'Outside Off', balls: 1245, wickets: 32, percentage: 18.6 },
  { zone: 'Down Leg', balls: 312, wickets: 15, percentage: 8.8 },
];

const pitchMapData = [
  [5, 8, 12, 18, 25, 32, 28, 22, 15, 8],
  [3, 6, 10, 15, 22, 28, 24, 20, 12, 6],
  [2, 4, 8, 12, 18, 24, 20, 16, 10, 5],
  [1, 3, 6, 10, 15, 20, 18, 14, 8, 4],
  [2, 4, 8, 12, 18, 24, 22, 18, 12, 6],
  [3, 5, 10, 15, 22, 28, 26, 22, 15, 8],
  [4, 8, 12, 18, 26, 34, 30, 25, 18, 10],
  [6, 10, 15, 22, 30, 38, 35, 28, 20, 12],
];

const bestFigures = [
  { rank: 1, opposition: 'vs PBKS', date: 'May 21, 2024', figures: '5/12', overs: 4, venue: 'Mumbai' },
  { rank: 2, opposition: 'vs RCB', date: 'Apr 15, 2024', figures: '4/14', overs: 4, venue: 'Bangalore' },
  { rank: 3, opposition: 'vs CSK', date: 'May 6, 2024', figures: '4/18', overs: 4, venue: 'Chennai' },
  { rank: 4, opposition: 'vs KKR', date: 'Apr 28, 2024', figures: '3/19', overs: 4, venue: 'Kolkata' },
  { rank: 5, opposition: 'vs RR', date: 'Apr 10, 2024', figures: '3/22', overs: 4, venue: 'Jaipur' },
];

const recentPerformances: Performance[] = [
  { date: 'May 21, 2024', opposition: 'PBKS', overs: 4, runs: 12, wickets: 5, econ: 3.0, result: 'MI won' },
  { date: 'May 14, 2024', opposition: 'LSG', overs: 4, runs: 28, wickets: 2, econ: 7.0, result: 'MI won' },
  { date: 'May 6, 2024', opposition: 'CSK', overs: 3.4, runs: 35, wickets: 1, econ: 9.5, result: 'CSK won' },
  { date: 'Apr 28, 2024', opposition: 'KKR', overs: 4, runs: 22, wickets: 2, econ: 5.5, result: 'MI won' },
  { date: 'Apr 21, 2024', opposition: 'DC', overs: 4, runs: 31, wickets: 1, econ: 7.75, result: 'DC won' },
  { date: 'Apr 15, 2024', opposition: 'RCB', overs: 4, runs: 14, wickets: 4, econ: 3.5, result: 'MI won' },
  { date: 'Apr 8, 2024', opposition: 'GT', overs: 4, runs: 25, wickets: 1, econ: 6.25, result: 'GT won' },
];

// Wickets Trend Line Chart
const WicketsTrendChart = ({ data }: { data: typeof wicketsTrend }) => {
  const maxWickets = Math.max(...data.map(d => d.wickets)) * 1.2;
  const width = 100 / data.length;

  return (
    <div className="h-48 relative">
      <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
        {[10, 20, 30, 40].map((val, i) => (
          <line key={i} x1="5" y1={`${50 - (val / maxWickets) * 40}`} x2="95" y2={`${50 - (val / maxWickets) * 40}`} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="0.2" />
        ))}

        <polyline
          points={data.map((d, i) => {
            const x = 5 + (i + 0.5) * width * 0.9;
            const y = 50 - (d.wickets / maxWickets) * 40;
            return `${x} ${y}`;
          }).join(' ')}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((d, i) => {
          const x = 5 + (i + 0.5) * width * 0.9;
          const y = 50 - (d.wickets / maxWickets) * 40;
          return <circle key={i} cx={x} cy={y} r="1.5" fill="#3b82f6" />;
        })}
      </svg>

      <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-1 text-xs text-slate-500">
        <span>40</span>
        <span>30</span>
        <span>20</span>
        <span>10</span>
      </div>

      <div className="absolute bottom-0 left-4 right-0 flex justify-between text-xs text-slate-500">
        {data.map((d, i) => (
          <span key={i}>{d.season}</span>
        ))}
      </div>
    </div>
  );
};

// Economy Trend Line Chart
const EconomyTrendChart = ({ data }: { data: typeof economyTrend }) => {
  const maxEcon = 10;
  const minEcon = 6;
  const range = maxEcon - minEcon;
  const width = 100 / data.length;

  return (
    <div className="h-48 relative">
      <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
        {[6, 7, 8, 9, 10].map((val, i) => (
          <line key={i} x1="5" y1={`${50 - ((val - minEcon) / range) * 40}`} x2="95" y2={`${50 - ((val - minEcon) / range) * 40}`} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="0.2" />
        ))}

        <polyline
          points={data.map((d, i) => {
            const x = 5 + (i + 0.5) * width * 0.9;
            const y = 50 - ((d.economy - minEcon) / range) * 40;
            return `${x} ${y}`;
          }).join(' ')}
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((d, i) => {
          const x = 5 + (i + 0.5) * width * 0.9;
          const y = 50 - ((d.economy - minEcon) / range) * 40;
          return <circle key={i} cx={x} cy={y} r="1.5" fill="#10b981" />;
        })}
      </svg>

      <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-1 text-xs text-slate-500">
        <span>10</span>
        <span>9</span>
        <span>8</span>
        <span>7</span>
        <span>6</span>
      </div>

      <div className="absolute bottom-0 left-4 right-0 flex justify-between text-xs text-slate-500">
        {data.map((d, i) => (
          <span key={i}>{d.season}</span>
        ))}
      </div>
    </div>
  );
};

// Pitch Map Component
const PitchMap = ({ data }: { data: number[][] }) => {
  const maxVal = Math.max(...data.flat());

  return (
    <div className="relative">
      <div className="absolute -left-12 top-0 h-full flex flex-col justify-between text-xs text-slate-500 py-4">
        <span>Wide</span>
        <span>Off</span>
        <span>Middle</span>
        <span>Leg</span>
        <span>Wide</span>
      </div>

      <div className="relative bg-gradient-to-b from-orange-100 to-green-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4">
        {/* Stumps visualization */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-1">
          <div className="w-2 h-8 bg-amber-200 rounded-full" />
          <div className="w-2 h-8 bg-amber-200 rounded-full" />
          <div className="w-2 h-8 bg-amber-200 rounded-full" />
        </div>

        <svg viewBox="0 0 100 80" className="w-full">
          {data.map((row, y) =>
            row.map((val, x) => {
              const intensity = val / maxVal;
              const color = intensity < 0.3 ? `rgb(34, 197, 94, 0.3)` :
                           intensity < 0.5 ? `rgb(234, 179, 8, 0.5)` :
                           intensity < 0.7 ? `rgb(249, 115, 22, 0.7)` :
                           `rgb(239, 68, 68, 0.9)`;
              return (
                <circle
                  key={`${x}-${y}`}
                  cx={x * 10 + 5}
                  cy={y * 10 + 5}
                  r={3 + intensity * 3}
                  fill={color}
                  opacity={0.4 + intensity * 0.6}
                />
              );
            })
          )}
        </svg>

        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 text-xs text-slate-500">
          Length
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-slate-500">Good</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-xs text-slate-500">Ok</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-xs text-slate-500">Poor</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-slate-500">Hit</span>
        </div>
      </div>
    </div>
  );
};

// Zone Donut Chart
const ZoneDonut = ({ data }: { data: typeof bowlingZones }) => {
  const total = data.reduce((sum, d) => sum + d.balls, 0);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {(() => {
            let currentAngle = -90;
            return data.map((d, i) => {
              const angle = (d.balls / total) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              currentAngle = endAngle;

              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;

              const x1 = 50 + 36 * Math.cos(startRad);
              const y1 = 50 + 36 * Math.sin(startRad);
              const x2 = 50 + 36 * Math.cos(endRad);
              const y2 = 50 + 36 * Math.sin(endRad);

              return (
                <path
                  key={i}
                  d={`M 50 50 L ${x1} ${y1} A 36 36 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`}
                  fill={colors[i]}
                />
              );
            });
          })()}
          <circle cx="50" cy="50" r="28" fill="white" className="dark:fill-slate-900" />
          <text x="50" y="45" textAnchor="middle" className="text-xs fill-slate-600 dark:fill-slate-400">
            {total}
          </text>
          <text x="50" y="55" textAnchor="middle" className="text-xs fill-slate-500">
            balls
          </text>
        </svg>
      </div>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[i] }} />
            <span className="text-sm text-slate-600 dark:text-slate-400">{d.zone}</span>
            <span className="ml-auto text-sm font-medium">{d.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export function BowlerInsights() {
  const [showBowlerSearch, setShowBowlerSearch] = React.useState(false);
  const [selected, setSelected] = React.useState('bumrah');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary-500" />
            Bowler Insights
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Advanced bowling analysis and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success-100 text-success-700 font-medium">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Bowler Selection */}
      <GlassCard>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowBowlerSearch(!showBowlerSearch)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                {selectedBowler.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedBowler.name}</p>
                <p className="text-sm text-slate-500">{selectedBowler.team} • {selectedBowler.role}</p>
              </div>
              <ChevronDown className={cn('w-5 h-5 text-slate-400 transition-transform', showBowlerSearch && 'rotate-180')} />
            </button>

            {showBowlerSearch && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50"
              >
                <div className="p-2">
                  {bowlers.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { setSelected(b.id); setShowBowlerSearch(false); }}
                      className={cn(
                        'w-full flex items-center gap-3 p-2 rounded-lg text-left',
                        selected === b.id ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                        {b.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{b.name}</p>
                        <p className="text-xs text-slate-500">{b.team} • {b.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Wickets', value: bowlerStats.total_wickets, color: 'primary' },
          { label: 'Economy', value: bowlerStats.economy.toFixed(2), color: 'success' },
          { label: 'Average', value: bowlerStats.average.toFixed(1), color: 'warning' },
          { label: 'Strike Rate', value: bowlerStats.strike_rate.toFixed(1), color: 'cyan' },
          { label: 'Best Figures', value: bowlerStats.best_figures, color: 'orange' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={cn(
              'p-4 rounded-xl border border-slate-200 dark:border-slate-800',
              stat.color === 'primary' ? 'bg-primary-50 dark:bg-primary-900/20' :
              stat.color === 'success' ? 'bg-success-50 dark:bg-success-900/20' :
              stat.color === 'warning' ? 'bg-warning-50 dark:bg-warning-900/20' :
              stat.color === 'cyan' ? 'bg-cyan-50 dark:bg-cyan-900/20' :
              'bg-orange-50 dark:bg-orange-900/20'
            )}
          >
            <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
            <p className={cn(
              'text-2xl font-bold',
              stat.color === 'primary' ? 'text-primary-600' :
              stat.color === 'success' ? 'text-success-600' :
              stat.color === 'warning' ? 'text-warning-600' :
              stat.color === 'cyan' ? 'text-cyan-600' :
              'text-orange-600'
            )}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overs Bowled', value: bowlerStats.overs },
          { label: 'Maidens', value: bowlerStats.maidens },
          { label: '5-Wicket Hauls', value: bowlerStats.five_wicket_hauls },
          { label: 'Dot Ball %', value: bowlerStats.dots_percentage + '%' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wickets Trend */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Wickets Trend (Season-wise)
          </h3>
          <WicketsTrendChart data={wicketsTrend} />
        </GlassCard>

        {/* Economy Trend */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-success-500" />
            Economy Rate Trend
          </h3>
          <EconomyTrendChart data={economyTrend} />
        </GlassCard>

        {/* Bowling Zones */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-warning-500" />
            Bowling Zones
          </h3>
          <ZoneDonut data={bowlingZones} />
        </GlassCard>

        {/* Pitch Map */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-500" />
            Pitch Map - Where Balls Land
          </h3>
          <PitchMap data={pitchMapData} />
        </GlassCard>
      </div>

      {/* Phase Analysis */}
      <GlassCard>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-500" />
          Phase-wise Bowling Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {phaseAnalysis.map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                'p-6 rounded-xl',
                i === 0 ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10' :
                i === 1 ? 'bg-gradient-to-br from-primary-500/10 to-purple-500/10' :
                'bg-gradient-to-br from-error-500/10 to-orange-500/10'
              )}
            >
              <div className="flex items-center gap-2 mb-4">
                {i === 0 && <Zap className="w-5 h-5 text-cyan-500" />}
                {i === 1 && <Activity className="w-5 h-5 text-primary-500" />}
                {i === 2 && <Shield className="w-5 h-5 text-error-500" />}
                <h4 className="font-semibold text-slate-900 dark:text-white">{phase.phase}</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Overs</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{phase.overs}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Wickets</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{phase.wickets}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Economy</p>
                  <p className={cn(
                    'text-lg font-bold',
                    phase.economy <= 7 ? 'text-success-600' :
                    phase.economy <= 8 ? 'text-warning-600' :
                    'text-error-600'
                  )}>
                    {phase.economy.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Avg/SR</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{phase.avg.toFixed(1)} / {phase.sr.toFixed(1)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Bowling Figures */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-warning-500" />
            Best Bowling Figures
          </h3>
          <div className="space-y-3">
            {bestFigures.map((perf, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                    i === 0 ? 'bg-yellow-500 text-white' :
                    i === 1 ? 'bg-slate-300 text-slate-700' :
                    i === 2 ? 'bg-amber-600 text-white' :
                    'bg-slate-200 dark:bg-slate-700 text-slate-600'
                  )}>
                    {perf.rank}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{perf.opposition}</p>
                    <p className="text-xs text-slate-500">{perf.date} • {perf.venue}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-600">{perf.figures}</p>
                  <p className="text-xs text-slate-500">{perf.overs} overs</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Performances */}
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-500" />
            Recent Performances
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2 text-left">Date</th>
                  <th className="py-2 text-left">Opp</th>
                  <th className="py-2 text-center">Ov</th>
                  <th className="py-2 text-center">R</th>
                  <th className="py-2 text-center">W</th>
                  <th className="py-2 text-center">Econ</th>
                </tr>
              </thead>
              <tbody>
                {recentPerformances.map((perf, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 text-slate-600 dark:text-slate-400">{perf.date}</td>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">{perf.opposition}</td>
                    <td className="py-3 text-center text-slate-600 dark:text-slate-400">{perf.overs}</td>
                    <td className="py-3 text-center text-slate-600 dark:text-slate-400">{perf.runs}</td>
                    <td className="py-3 text-center font-bold text-slate-900 dark:text-white">{perf.wickets}</td>
                    <td className="py-3 text-center">
                      <span className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium',
                        perf.econ <= 6 ? 'bg-success-100 text-success-600' :
                        perf.econ <= 8 ? 'bg-warning-100 text-warning-600' :
                        'bg-error-100 text-error-600'
                      )}>
                        {perf.econ.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default BowlerInsights;
