import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, Check, X, BarChart3, Zap } from 'lucide-react';
import { GlassCard, KPIWidget } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

// Types
interface Batter {
  id: string;
  name: string;
  team: string;
}

interface Bowler {
  id: string;
  name: string;
  team: string;
}

interface Team {
  id: string;
  name: string;
}

interface BatterMetrics {
  consistencyIndex: number;
  pressurePerformance: number;
  boundaryDependency: number;
  chaseImpact: number;
}

interface BowlerMetrics {
  wicketImpactScore: number;
  economyPressure: number;
  deathEffectiveness: number;
}

interface TeamMetrics {
  strengthIndex: number;
  momentumScore: number;
  winningProbability: number;
}

interface Match {
  ballsFaced: number;
  runsScored: number;
  result: 'win' | 'loss';
}

interface OppositionStats {
  team: string;
  economy: number;
  wickets: number;
  matches: number;
}

// Mock Data
const battersData: Batter[] = [
  { id: '1', name: 'Virat Kohli', team: 'RCB' },
  { id: '2', name: 'Rohit Sharma', team: 'MI' },
  { id: '3', name: 'Travis Head', team: 'SRH' },
  { id: '4', name: 'Ruturaj Gaikwad', team: 'CSK' },
  { id: '5', name: 'Shubman Gill', team: 'GT' },
  { id: '6', name: 'Yashasvi Jaiswal', team: 'RR' },
];

const bowlersData: Bowler[] = [
  { id: '1', name: 'Jasprit Bumrah', team: 'MI' },
  { id: '2', name: 'Yuzvendra Chahal', team: 'RR' },
  { id: '3', name: 'Rashid Khan', team: 'GT' },
  { id: '4', name: 'Kuldeep Yadav', team: 'DC' },
  { id: '5', name: 'Mohammed Shami', team: 'GT' },
  { id: '6', name: 'Varun Chakravarthy', team: 'KKR' },
];

const teamsData: Team[] = [
  { id: '1', name: 'Mumbai Indians' },
  { id: '2', name: 'Chennai Super Kings' },
  { id: '3', name: 'Kolkata Knight Riders' },
  { id: '4', name: 'Delhi Capitals' },
  { id: '5', name: 'Royal Challengers Bangalore' },
  { id: '6', name: 'Sunrisers Hyderabad' },
  { id: '7', name: 'Rajasthan Royals' },
  { id: '8', name: 'Gujarat Titans' },
];

const getBatterMetrics = (batterId: string): BatterMetrics => {
  const baseValues: { [key: string]: BatterMetrics } = {
    '1': { consistencyIndex: 88, pressurePerformance: 82, boundaryDependency: 35, chaseImpact: 90 },
    '2': { consistencyIndex: 85, pressurePerformance: 88, boundaryDependency: 40, chaseImpact: 87 },
    '3': { consistencyIndex: 82, pressurePerformance: 78, boundaryDependency: 45, chaseImpact: 84 },
    '4': { consistencyIndex: 80, pressurePerformance: 85, boundaryDependency: 38, chaseImpact: 82 },
    '5': { consistencyIndex: 79, pressurePerformance: 75, boundaryDependency: 42, chaseImpact: 80 },
    '6': { consistencyIndex: 76, pressurePerformance: 72, boundaryDependency: 48, chaseImpact: 78 },
  };
  return baseValues[batterId] || { consistencyIndex: 75, pressurePerformance: 70, boundaryDependency: 40, chaseImpact: 75 };
};

const getBowlerMetrics = (bowlerId: string): BowlerMetrics => {
  const baseValues: { [key: string]: BowlerMetrics } = {
    '1': { wicketImpactScore: 94, economyPressure: 6.2, deathEffectiveness: 89 },
    '2': { wicketImpactScore: 86, economyPressure: 6.8, deathEffectiveness: 82 },
    '3': { wicketImpactScore: 88, economyPressure: 6.5, deathEffectiveness: 85 },
    '4': { wicketImpactScore: 84, economyPressure: 7.1, deathEffectiveness: 80 },
    '5': { wicketImpactScore: 82, economyPressure: 6.9, deathEffectiveness: 78 },
    '6': { wicketImpactScore: 80, economyPressure: 7.3, deathEffectiveness: 76 },
  };
  return baseValues[bowlerId] || { wicketImpactScore: 75, economyPressure: 7.5, deathEffectiveness: 70 };
};

const getTeamMetrics = (teamId: string): TeamMetrics => {
  const baseValues: { [key: string]: TeamMetrics } = {
    '1': { strengthIndex: 88, momentumScore: 12, winningProbability: 62 },
    '2': { strengthIndex: 85, momentumScore: 8, winningProbability: 58 },
    '3': { strengthIndex: 82, momentumScore: 15, winningProbability: 56 },
    '4': { strengthIndex: 80, momentumScore: -5, winningProbability: 52 },
    '5': { strengthIndex: 78, momentumScore: 3, winningProbability: 50 },
    '6': { strengthIndex: 81, momentumScore: 10, winningProbability: 55 },
    '7': { strengthIndex: 79, momentumScore: 6, winningProbability: 51 },
    '8': { strengthIndex: 83, momentumScore: 18, winningProbability: 59 },
  };
  return baseValues[teamId] || { strengthIndex: 75, momentumScore: 0, winningProbability: 50 };
};

const getMockMatches = (): Match[] => [
  { ballsFaced: 45, runsScored: 52, result: 'win' },
  { ballsFaced: 38, runsScored: 41, result: 'loss' },
  { ballsFaced: 52, runsScored: 68, result: 'win' },
  { ballsFaced: 42, runsScored: 48, result: 'win' },
  { ballsFaced: 55, runsScored: 62, result: 'win' },
  { ballsFaced: 35, runsScored: 38, result: 'loss' },
  { ballsFaced: 48, runsScored: 61, result: 'win' },
  { ballsFaced: 40, runsScored: 45, result: 'loss' },
  { ballsFaced: 50, runsScored: 71, result: 'win' },
  { ballsFaced: 43, runsScored: 54, result: 'win' },
];

const getMockOppStats = (): OppositionStats[] => [
  { team: 'CSK', economy: 6.8, wickets: 8, matches: 4 },
  { team: 'RCB', economy: 7.2, wickets: 6, matches: 3 },
  { team: 'KKR', economy: 6.5, wickets: 9, matches: 4 },
  { team: 'DC', economy: 7.5, wickets: 5, matches: 3 },
  { team: 'RR', economy: 6.3, wickets: 10, matches: 4 },
  { team: 'SRH', economy: 7.0, wickets: 7, matches: 3 },
  { team: 'GT', economy: 6.6, wickets: 8, matches: 4 },
  { team: 'LSG', economy: 7.8, wickets: 4, matches: 2 },
];

const getTeamCategoryStats = (): { category: string; value: number }[] => [
  { category: 'Batting', value: 82 },
  { category: 'Bowling', value: 78 },
  { category: 'Fielding', value: 85 },
  { category: 'Powerplay', value: 88 },
  { category: 'Death', value: 76 },
];

const getRecentFormData = (): number[] => {
  let cumulative = 0;
  return [1, -1, 1, 1, -1, 1, 1, 1, -1, 1].map(result => {
    cumulative += result;
    return cumulative;
  });
};

// SVG Components
const RadarChart: React.FC<{ data: number[]; labels: string[] }> = ({ data, labels }) => {
  const width = 280;
  const height = 280;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 80;

  const angleSlice = (Math.PI * 2) / data.length;
  const points = data.map((value, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  });

  const polygonPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  const backgroundPath = Array.from({ length: data.length }, (_, i) => (radius / 100) * 50)
    .map((value, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const r = value;
      return {
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle),
      };
    })
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ') + ' Z';

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
      <defs>
        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="rgb(8, 145, 178)" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Background grid */}
      {[0.25, 0.5, 0.75, 1].map((scale, idx) => {
        const gridPoints = Array.from({ length: data.length }, (_, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const r = radius * scale;
          return {
            x: centerX + r * Math.cos(angle),
            y: centerY + r * Math.sin(angle),
          };
        });
        const gridPath = gridPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return <path key={idx} d={gridPath} fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />;
      })}

      {/* Axes */}
      {Array.from({ length: data.length }).map((_, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return (
          <line key={`axis-${i}`} x1={centerX} y1={centerY} x2={x} y2={y} stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1" />
        );
      })}

      {/* Fill polygon */}
      <path d={polygonPath} fill="url(#radarGradient)" stroke="rgb(59, 130, 246)" strokeWidth="2" />

      {/* Labels */}
      {labels.map((label, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const labelRadius = radius + 30;
        const labelX = centerX + labelRadius * Math.cos(angle);
        const labelY = centerY + labelRadius * Math.sin(angle);
        return (
          <text
            key={`label-${i}`}
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dy="0.3em"
            className="text-xs fill-slate-300 font-medium"
          >
            {label}
          </text>
        );
      })}

      {/* Value labels */}
      {data.map((value, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const r = (value / 100) * radius;
        const valueX = centerX + r * Math.cos(angle);
        const valueY = centerY + r * Math.sin(angle);
        return (
          <text
            key={`value-${i}`}
            x={valueX}
            y={valueY}
            textAnchor="middle"
            dy="0.3em"
            className="text-xs fill-blue-400 font-bold"
          >
            {value}
          </text>
        );
      })}
    </svg>
  );
};

const ScatterPlot: React.FC<{ matches: Match[] }> = ({ matches }) => {
  const width = 340;
  const height = 280;
  const padding = 40;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const maxBalls = Math.max(...matches.map(m => m.ballsFaced));
  const maxRuns = Math.max(...matches.map(m => m.runsScored));

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
      {/* Background */}
      <rect x={padding} y={padding} width={plotWidth} height={plotHeight} fill="rgba(15, 23, 42, 0.5)" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />

      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((pct, i) => (
        <g key={`grid-${i}`}>
          <line
            x1={padding + plotWidth * pct}
            y1={padding}
            x2={padding + plotWidth * pct}
            y2={padding + plotHeight}
            stroke="rgba(148, 163, 184, 0.1)"
            strokeWidth="1"
            strokeDasharray="4"
          />
          <line
            x1={padding}
            y1={padding + plotHeight * pct}
            x2={padding + plotWidth}
            y2={padding + plotHeight * pct}
            stroke="rgba(148, 163, 184, 0.1)"
            strokeWidth="1"
            strokeDasharray="4"
          />
        </g>
      ))}

      {/* Axes */}
      <line x1={padding} y1={padding + plotHeight} x2={padding + plotWidth} y2={padding + plotHeight} stroke="rgb(148, 163, 184)" strokeWidth="2" />
      <line x1={padding} y1={padding} x2={padding} y2={padding + plotHeight} stroke="rgb(148, 163, 184)" strokeWidth="2" />

      {/* Axis labels */}
      <text x={width - 10} y={padding + plotHeight + 20} className="text-xs fill-slate-400" textAnchor="end">
        Balls Faced
      </text>
      <text x={padding - 10} y={15} className="text-xs fill-slate-400" textAnchor="end">
        Runs Scored
      </text>

      {/* Data points */}
      {matches.map((match, i) => {
        const x = padding + (match.ballsFaced / maxBalls) * plotWidth;
        const y = padding + plotHeight - (match.runsScored / maxRuns) * plotHeight;
        const color = match.result === 'win' ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)';
        return (
          <circle key={i} cx={x} cy={y} r="5" fill={color} opacity="0.8" stroke={color} strokeWidth="2" />
        );
      })}

      {/* Legend */}
      <circle cx={width - 60} cy={15} r="3" fill="rgb(34, 197, 94)" />
      <text x={width - 50} y={20} className="text-xs fill-slate-400">
        Win
      </text>
      <circle cx={width - 60} cy={30} r="3" fill="rgb(239, 68, 68)" />
      <text x={width - 50} y={35} className="text-xs fill-slate-400">
        Loss
      </text>
    </svg>
  );
};

const BubbleChart: React.FC<{ data: OppositionStats[] }> = ({ data }) => {
  const width = 340;
  const height = 280;
  const padding = 40;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const maxEconomy = 8;
  const maxWickets = 12;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
      {/* Background */}
      <rect x={padding} y={padding} width={plotWidth} height={plotHeight} fill="rgba(15, 23, 42, 0.5)" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />

      {/* Axes */}
      <line x1={padding} y1={padding + plotHeight} x2={padding + plotWidth} y2={padding + plotHeight} stroke="rgb(148, 163, 184)" strokeWidth="2" />
      <line x1={padding} y1={padding} x2={padding} y2={padding + plotHeight} stroke="rgb(148, 163, 184)" strokeWidth="2" />

      {/* Axis labels */}
      <text x={width - 10} y={padding + plotHeight + 20} className="text-xs fill-slate-400" textAnchor="end">
        Economy (runs/over)
      </text>
      <text x={padding - 10} y={15} className="text-xs fill-slate-400" textAnchor="end">
        Wickets
      </text>

      {/* Bubbles */}
      {data.map((stat, i) => {
        const x = padding + (stat.economy / maxEconomy) * plotWidth;
        const y = padding + plotHeight - (stat.wickets / maxWickets) * plotHeight;
        const bubbleSize = 3 + (stat.matches / 4) * 8;
        const hues = [0, 40, 80, 120, 160, 200, 240, 280];
        const color = `hsl(${hues[i]}, 70%, 55%)`;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={bubbleSize} fill={color} opacity="0.6" stroke={color} strokeWidth="1.5" />
            <text x={x} y={y} textAnchor="middle" dy="0.3em" className="text-xs fill-white font-bold pointer-events-none">
              {stat.team}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const BarChart: React.FC<{ data: { category: string; value: number }[] }> = ({ data }) => {
  const width = 340;
  const height = 280;
  const padding = 40;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;
  const barWidth = plotWidth / (data.length * 1.5);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
      {/* Background */}
      <rect x={padding} y={padding} width={plotWidth} height={plotHeight} fill="rgba(15, 23, 42, 0.5)" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />

      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((pct, i) => (
        <g key={`grid-${i}`}>
          <line
            x1={padding}
            y1={padding + plotHeight * (1 - pct)}
            x2={padding + plotWidth}
            y2={padding + plotHeight * (1 - pct)}
            stroke="rgba(148, 163, 184, 0.1)"
            strokeWidth="1"
            strokeDasharray="4"
          />
          <text x={padding - 10} y={padding + plotHeight * (1 - pct) + 4} className="text-xs fill-slate-400" textAnchor="end">
            {pct * 100}
          </text>
        </g>
      ))}

      {/* Axes */}
      <line x1={padding} y1={padding + plotHeight} x2={padding + plotWidth} y2={padding + plotHeight} stroke="rgb(148, 163, 184)" strokeWidth="2" />
      <line x1={padding} y1={padding} x2={padding} y2={padding + plotHeight} stroke="rgb(148, 163, 184)" strokeWidth="2" />

      {/* Bars */}
      {data.map((item, i) => {
        const barHeight = (item.value / 100) * plotHeight;
        const x = padding + i * (plotWidth / data.length) + (plotWidth / data.length - barWidth) / 2;
        const y = padding + plotHeight - barHeight;
        const hues = [200, 160, 120, 280, 40];
        const color = `hsl(${hues[i]}, 70%, 55%)`;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barHeight} fill={color} opacity="0.7" rx="4" />
            <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" className="text-xs fill-blue-300 font-bold">
              {item.value}
            </text>
            <text x={x + barWidth / 2} y={padding + plotHeight + 20} textAnchor="middle" className="text-xs fill-slate-400">
              {item.category.split(' ')[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const LineChart: React.FC<{ data: number[] }> = ({ data }) => {
  const width = 340;
  const height = 200;
  const padding = 40;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const maxValue = Math.max(...data, 20);
  const minValue = Math.min(...data, -20);
  const range = maxValue - minValue;

  const points = data.map((value, i) => {
    const x = padding + (i / (data.length - 1)) * plotWidth;
    const y = padding + ((maxValue - value) / range) * plotHeight;
    return { x, y };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
      {/* Background */}
      <rect x={padding} y={padding} width={plotWidth} height={plotHeight} fill="rgba(15, 23, 42, 0.5)" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />

      {/* Zero line */}
      <line
        x1={padding}
        y1={padding + ((maxValue) / range) * plotHeight}
        x2={padding + plotWidth}
        y2={padding + ((maxValue) / range) * plotHeight}
        stroke="rgba(148, 163, 184, 0.3)"
        strokeWidth="1"
        strokeDasharray="4"
      />

      {/* Axes */}
      <line x1={padding} y1={padding + plotHeight} x2={padding + plotWidth} y2={padding + plotHeight} stroke="rgb(148, 163, 184)" strokeWidth="2" />
      <line x1={padding} y1={padding} x2={padding} y2={padding + plotHeight} stroke="rgb(148, 163, 184)" strokeWidth="2" />

      {/* Line path */}
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Area under line */}
      <path
        d={`${pathData} L ${padding + plotWidth} ${padding + plotHeight} L ${padding} ${padding + plotHeight} Z`}
        fill="url(#lineGradient)"
      />

      {/* Line */}
      <path d={pathData} fill="none" stroke="rgb(59, 130, 246)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="rgb(59, 130, 246)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="2" />
      ))}
    </svg>
  );
};

// Main Component
export function MoneyballAnalytics() {
  const [activeTab, setActiveTab] = useState<'batters' | 'bowlers' | 'teams'>('batters');
  const [selectedBatterId, setSelectedBatterId] = useState('1');
  const [selectedBowlerId, setSelectedBowlerId] = useState('1');
  const [selectedTeamId, setSelectedTeamId] = useState('1');

  const selectedBatter = useMemo(() => battersData.find(b => b.id === selectedBatterId), [selectedBatterId]);
  const selectedBowler = useMemo(() => bowlersData.find(b => b.id === selectedBowlerId), [selectedBowlerId]);
  const selectedTeam = useMemo(() => teamsData.find(t => t.id === selectedTeamId), [selectedTeamId]);

  const batterMetrics = useMemo(() => getBatterMetrics(selectedBatterId), [selectedBatterId]);
  const bowlerMetrics = useMemo(() => getBowlerMetrics(selectedBowlerId), [selectedBowlerId]);
  const teamMetrics = useMemo(() => getTeamMetrics(selectedTeamId), [selectedTeamId]);

  const matches = useMemo(() => getMockMatches(), []);
  const oppStats = useMemo(() => getMockOppStats(), []);
  const categoryStats = useMemo(() => getTeamCategoryStats(), []);
  const formData = useMemo(() => getRecentFormData(), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-white">Moneyball Analytics</h1>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-xs font-bold text-white flex items-center gap-1"
                >
                  <Zap size={12} />
                  AI Powered
                </motion.div>
              </div>
              <p className="text-slate-400">Advanced performance intelligence — beyond the numbers</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white font-medium transition-all"
            >
              <Download size={18} />
              Export
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-white/10">
            {(['batters', 'bowlers', 'teams'] as const).map(tab => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-3 font-medium border-b-2 transition-all',
                  activeTab === tab
                    ? 'text-white border-blue-500'
                    : 'text-slate-400 border-transparent hover:text-slate-300'
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Batter Tab */}
        {activeTab === 'batters' && selectedBatter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Player Selector */}
            <GlassCard>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Select Batter</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {battersData.map(batter => (
                    <motion.button
                      key={batter.id}
                      onClick={() => setSelectedBatterId(batter.id)}
                      whileHover={{ scale: 1.05 }}
                      className={cn(
                        'p-3 rounded-lg border-2 transition-all text-sm font-medium',
                        selectedBatterId === batter.id
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/30'
                      )}
                    >
                      <div className="font-bold">{batter.name.split(' ')[0]}</div>
                      <div className="text-xs opacity-75">{batter.team}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <KPIWidget title="Consistency Index" value={batterMetrics.consistencyIndex} subtitle="0-100" color="#3b82f6" />
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                <KPIWidget title="Pressure Performance" value={batterMetrics.pressurePerformance} subtitle="0-100" color="#8b5cf6" />
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                <KPIWidget title="Boundary Dependency" value={batterMetrics.boundaryDependency} subtitle="%" color="#ec4899" />
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                <KPIWidget title="Chase Impact Score" value={batterMetrics.chaseImpact} subtitle="0-100" color="#06b6d4" />
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard hover>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Performance Radar</h3>
                  <RadarChart
                    data={[
                      batterMetrics.chaseImpact * 0.8,
                      batterMetrics.consistencyIndex,
                      batterMetrics.pressurePerformance,
                      batterMetrics.chaseImpact,
                      85,
                      batterMetrics.chaseImpact * 0.95,
                    ]}
                    labels={['Power', 'Consistency', 'Pressure', 'Chase', 'Technique', 'Impact']}
                  />
                </div>
              </GlassCard>

              <GlassCard hover>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Match Performance</h3>
                  <ScatterPlot matches={matches} />
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* Bowler Tab */}
        {activeTab === 'bowlers' && selectedBowler && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Player Selector */}
            <GlassCard>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Select Bowler</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {bowlersData.map(bowler => (
                    <motion.button
                      key={bowler.id}
                      onClick={() => setSelectedBowlerId(bowler.id)}
                      whileHover={{ scale: 1.05 }}
                      className={cn(
                        'p-3 rounded-lg border-2 transition-all text-sm font-medium',
                        selectedBowlerId === bowler.id
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/30'
                      )}
                    >
                      <div className="font-bold">{bowler.name.split(' ')[0]}</div>
                      <div className="text-xs opacity-75">{bowler.team}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <KPIWidget title="Wicket Impact Score" value={bowlerMetrics.wicketImpactScore} subtitle="0-100" color="#3b82f6" />
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                <KPIWidget title="Economy Pressure" value={bowlerMetrics.economyPressure} subtitle="runs/over" color="#8b5cf6" />
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                <KPIWidget title="Death Effectiveness" value={bowlerMetrics.deathEffectiveness} subtitle="0-100" color="#ec4899" />
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard hover>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Skills Radar</h3>
                  <RadarChart
                    data={[
                      88,
                      bowlerMetrics.wicketImpactScore,
                      100 - bowlerMetrics.economyPressure * 10,
                      85,
                      82,
                      bowlerMetrics.deathEffectiveness,
                    ]}
                    labels={['Accuracy', 'Wicket-Taking', 'Economy', 'Pressure', 'Variation', 'Death']}
                  />
                </div>
              </GlassCard>

              <GlassCard hover>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Opposition Stats</h3>
                  <BubbleChart data={oppStats} />
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && selectedTeam && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Team Selector */}
            <GlassCard>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Select Team</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {teamsData.map(team => (
                    <motion.button
                      key={team.id}
                      onClick={() => setSelectedTeamId(team.id)}
                      whileHover={{ scale: 1.05 }}
                      className={cn(
                        'p-3 rounded-lg border-2 transition-all text-sm font-medium',
                        selectedTeamId === team.id
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/30'
                      )}
                    >
                      <div className="line-clamp-2">{team.name.split(' ')[0]}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <KPIWidget title="Team Strength Index" value={teamMetrics.strengthIndex} subtitle="0-100" color="#3b82f6" />
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                <KPIWidget
                  title="Momentum Score"
                  value={teamMetrics.momentumScore}
                  subtitle="-50 to +50"
                  color={teamMetrics.momentumScore >= 0 ? '#22c55e' : '#ef4444'}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                <KPIWidget title="Winning Probability" value={teamMetrics.winningProbability} subtitle="%" color="#ec4899" />
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard hover>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Category Strengths</h3>
                  <BarChart data={categoryStats} />
                </div>
              </GlassCard>

              <GlassCard hover>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Recent Form (Last 10 Matches)</h3>
                  <LineChart data={formData} />
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* AI Insights Panel */}
        <GlassCard gradient className="border-2 border-blue-500/30">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Zap size={24} className="text-blue-400" />
                AI Insights
              </h2>
              <div className="text-xs px-2 py-1 bg-blue-500/20 border border-blue-500/50 rounded text-blue-300">Real-time Analysis</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Strengths */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Strengths</h3>
                {['Consistent powerplay performance', 'Strong against spinners', 'High chase success rate'].map((strength, i) => (
                  <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 * i }} className="flex gap-3">
                    <Check size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{strength}</span>
                  </motion.div>
                ))}
              </div>

              {/* Weaknesses */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Weaknesses</h3>
                {['Death bowling vulnerability', 'Fielding inconsistency', 'Pressure situations'].map((weakness, i) => (
                  <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 * i }} className="flex gap-3">
                    <X size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{weakness}</span>
                  </motion.div>
                ))}
              </div>

              {/* Prediction */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Match Prediction</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm text-slate-400 mb-2">vs Mumbai Indians</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-300">Win Probability</span>
                      <span className="text-sm font-bold text-blue-300">62%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: '62%' }} />
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-slate-400 mb-1">Key Matchup</p>
                    <p className="text-sm text-slate-300">Bumrah vs Our Batters</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended XI */}
            <div className="border-t border-white/10 pt-6 space-y-4">
              <h3 className="font-semibold text-white">Recommended Playing XI</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-11 gap-2">
                {[
                  { name: 'Sharma', role: 'OP' },
                  { name: 'Gill', role: 'OB' },
                  { name: 'Kohli', role: 'MB' },
                  { name: 'Head', role: 'MB' },
                  { name: 'Jaiswal', role: 'OB' },
                  { name: 'Gaikwad', role: 'WK' },
                  { name: 'Pandya', role: 'AR' },
                  { name: 'Bumrah', role: 'P' },
                  { name: 'Chahal', role: 'S' },
                  { name: 'Yadav', role: 'S' },
                  { name: 'Khan', role: 'S' },
                ].map((player, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.05 * i }}
                    className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg text-center"
                  >
                    <div className="text-xs font-bold text-white line-clamp-1">{player.name}</div>
                    <div className="text-xs text-slate-400">{player.role}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default MoneyballAnalytics;
