'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Zap, Target, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface Venue {
  id: string;
  name: string;
  city: string;
  matchesPlayed: number;
  avgFirstInnings: number;
  avgSecondInnings: number;
  tossImpact: number;
  battingFriendly: number;
  bowlingFriendly: number;
}

interface HistoricalRecord {
  title: string;
  value: string;
  date: string;
  teams: string;
}

interface WinMethod {
  label: string;
  value: number;
  color: string;
}

const venues: Venue[] = [
  {
    id: '1',
    name: 'M. Chinnaswamy Stadium',
    city: 'Bangalore',
    matchesPlayed: 42,
    avgFirstInnings: 165,
    avgSecondInnings: 158,
    tossImpact: 62,
    battingFriendly: 8,
    bowlingFriendly: 3,
  },
  {
    id: '2',
    name: 'Wankhede Stadium',
    city: 'Mumbai',
    matchesPlayed: 48,
    avgFirstInnings: 172,
    avgSecondInnings: 165,
    tossImpact: 58,
    battingFriendly: 8.5,
    bowlingFriendly: 2.5,
  },
  {
    id: '3',
    name: 'Eden Gardens',
    city: 'Kolkata',
    matchesPlayed: 45,
    avgFirstInnings: 158,
    avgSecondInnings: 152,
    tossImpact: 64,
    battingFriendly: 6.5,
    bowlingFriendly: 5.5,
  },
  {
    id: '4',
    name: 'MA Chidambaram',
    city: 'Chennai',
    matchesPlayed: 50,
    avgFirstInnings: 152,
    avgSecondInnings: 148,
    tossImpact: 60,
    battingFriendly: 5.5,
    bowlingFriendly: 6.5,
  },
  {
    id: '5',
    name: 'Rajiv Gandhi',
    city: 'Hyderabad',
    matchesPlayed: 35,
    avgFirstInnings: 168,
    avgSecondInnings: 162,
    tossImpact: 59,
    battingFriendly: 7.5,
    bowlingFriendly: 4,
  },
  {
    id: '6',
    name: 'Narendra Modi',
    city: 'Ahmedabad',
    matchesPlayed: 28,
    avgFirstInnings: 175,
    avgSecondInnings: 169,
    tossImpact: 61,
    battingFriendly: 8.2,
    bowlingFriendly: 3.5,
  },
  {
    id: '7',
    name: 'Sawai Mansingh',
    city: 'Jaipur',
    matchesPlayed: 38,
    avgFirstInnings: 170,
    avgSecondInnings: 164,
    tossImpact: 57,
    battingFriendly: 8,
    bowlingFriendly: 3.8,
  },
  {
    id: '8',
    name: 'PCA',
    city: 'Mohali',
    matchesPlayed: 32,
    avgFirstInnings: 162,
    avgSecondInnings: 156,
    tossImpact: 63,
    battingFriendly: 7,
    bowlingFriendly: 5,
  },
];

// Mock data for runs by over (20 overs)
const runsDistributionData = [12, 14, 11, 13, 15, 16, 14, 12, 11, 13, 14, 15, 16, 17, 18, 16, 14, 12, 11, 10];

// Mock data for wickets in phases
const wicketsPhases = [
  { phase: '1-6', wickets: 0.8 },
  { phase: '7-10', wickets: 1.2 },
  { phase: '11-15', wickets: 1.5 },
  { phase: '16-20', wickets: 1.3 },
];

const winMethods: WinMethod[] = [
  { label: 'Batting First Won', value: 48, color: '#10b981' },
  { label: 'Bowling First Won', value: 42, color: '#3b82f6' },
  { label: 'Super Over', value: 6, color: '#f59e0b' },
  { label: 'No Result', value: 4, color: '#6b7280' },
];

const historicalRecords: HistoricalRecord[] = [
  {
    title: 'Highest Score',
    value: '231/4',
    date: '2023-05-20',
    teams: 'RCB vs SRH',
  },
  {
    title: 'Lowest Score',
    value: '92/10',
    date: '2022-04-15',
    teams: 'CSK vs RR',
  },
  {
    title: 'Highest Chase',
    value: '229/3',
    date: '2023-06-10',
    teams: 'MI vs KKR',
  },
  {
    title: 'Highest Individual Score',
    value: '112*',
    date: '2023-03-25',
    teams: 'Virat Kohli (RCB)',
  },
  {
    title: 'Best Bowling Figures',
    value: '5/18',
    date: '2022-05-08',
    teams: 'Jasprit Bumrah (MI)',
  },
  {
    title: 'Record Partnership',
    value: '165 runs',
    date: '2023-04-12',
    teams: 'Rashid Khan & SKY (MI)',
  },
];

// SVG Chart Components
const RunsDistributionChart: React.FC<{ data: number[] }> = ({ data }) => {
  const maxRuns = Math.max(...data);
  const chartHeight = 250;
  const chartWidth = 600;
  const barWidth = chartWidth / data.length;

  return (
    <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((pct) => (
        <line
          key={`grid-${pct}`}
          x1="40"
          y1={chartHeight - (chartHeight * pct) / 100 - 20}
          x2={chartWidth - 10}
          y2={chartHeight - (chartHeight * pct) / 100 - 20}
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="1"
        />
      ))}

      {/* Y-axis */}
      <line x1="40" y1="10" x2="40" y2={chartHeight - 20} stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />

      {/* X-axis */}
      <line x1="40" y1={chartHeight - 20} x2={chartWidth - 10} y2={chartHeight - 20} stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />

      {/* Bars */}
      {data.map((value, idx) => {
        const height = (value / maxRuns) * (chartHeight - 40);
        const x = 40 + idx * barWidth + barWidth * 0.15;
        const y = chartHeight - 20 - height;

        return (
          <motion.g key={`bar-${idx}`} initial={{ opacity: 0, y: chartHeight - 20 }} animate={{ opacity: 1, y }} transition={{ delay: idx * 0.02 }}>
            <rect x={x} y={y} width={barWidth * 0.7} height={height} fill="url(#barGradient)" opacity="0.8" rx="3" />
            <text x={x + barWidth * 0.35} y={chartHeight - 5} textAnchor="middle" className="text-xs fill-gray-400" fontSize="11">
              {idx + 1}
            </text>
          </motion.g>
        );
      })}

      {/* Y-axis labels */}
      {[0, 5, 10, 15].map((val) => (
        <text key={`label-${val}`} x="30" y={chartHeight - 20 - (val / 15) * (chartHeight - 40)} textAnchor="end" className="text-xs fill-gray-400" fontSize="11">
          {val}
        </text>
      ))}

      {/* Gradient definition */}
      <defs>
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const WicketsDistributionChart: React.FC<{ phases: typeof wicketsPhases }> = ({ phases }) => {
  const chartHeight = 250;
  const chartWidth = 600;
  const maxWickets = 2;
  const points: [number, number][] = [];

  phases.forEach((phase, idx) => {
    const x = 80 + (idx * (chartWidth - 120)) / (phases.length - 1);
    const y = chartHeight - 40 - (phase.wickets / maxWickets) * (chartHeight - 60);
    points.push([x, y]);
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');

  return (
    <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((pct) => (
        <line
          key={`grid-${pct}`}
          x1="50"
          y1={chartHeight - 40 - (chartHeight - 60) * (pct / 100)}
          x2={chartWidth - 10}
          y2={chartHeight - 40 - (chartHeight - 60) * (pct / 100)}
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="1"
        />
      ))}

      {/* Y-axis */}
      <line x1="50" y1="10" x2="50" y2={chartHeight - 40} stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />

      {/* X-axis */}
      <line x1="50" y1={chartHeight - 40} x2={chartWidth - 10} y2={chartHeight - 40} stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />

      {/* Line */}
      <motion.path d={pathData} fill="none" stroke="#10b981" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />

      {/* Dots */}
      {points.map((point, idx) => (
        <motion.circle
          key={`dot-${idx}`}
          cx={point[0]}
          cy={point[1]}
          r="5"
          fill="#10b981"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + idx * 0.1 }}
        />
      ))}

      {/* X-axis labels */}
      {phases.map((phase, idx) => {
        const x = 80 + (idx * (chartWidth - 120)) / (phases.length - 1);
        return (
          <text key={`label-${idx}`} x={x} y={chartHeight - 15} textAnchor="middle" className="text-xs fill-gray-400" fontSize="11">
            {phase.phase}
          </text>
        );
      })}

      {/* Y-axis labels */}
      {[0, 0.5, 1, 1.5, 2].map((val) => (
        <text key={`ylabel-${val}`} x="40" y={chartHeight - 40 - (val / maxWickets) * (chartHeight - 60) + 4} textAnchor="end" className="text-xs fill-gray-400" fontSize="11">
          {val.toFixed(1)}
        </text>
      ))}
    </svg>
  );
};

const WinMethodChart: React.FC<{ methods: WinMethod[] }> = ({ methods }) => {
  const total = methods.reduce((sum, m) => sum + m.value, 0);
  const chartSize = 200;
  const radius = 70;
  const centerX = 100;
  const centerY = 100;

  let currentAngle = -Math.PI / 2;
  const slices = methods.map((method) => {
    const sliceAngle = (method.value / total) * Math.PI * 2;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    currentAngle = endAngle;
    return { method, pathData, color: method.color };
  });

  return (
    <div className="flex items-center justify-center gap-8">
      <svg width={chartSize} height={chartSize} viewBox="0 0 200 200">
        {slices.map((slice, idx) => (
          <motion.path
            key={`slice-${idx}`}
            d={slice.pathData}
            fill={slice.color}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: idx * 0.1 }}
            className="hover:opacity-100 transition-opacity"
          />
        ))}
      </svg>

      <div className="space-y-2">
        {methods.map((method, idx) => (
          <div key={`legend-${idx}`} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }} />
            <span className="text-sm text-gray-300">
              {method.label}: {method.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// KPI Card Component
const KPICard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; trend?: string }> = ({ label, value, icon, trend }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <GlassCard className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-2">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && <p className="text-xs text-green-400 mt-2">{trend}</p>}
        </div>
        <div className="text-blue-400 opacity-60">{icon}</div>
      </div>
    </GlassCard>
  </motion.div>
);

// Insight Card Component
const InsightCard: React.FC<{ label: string; score: number; icon: React.ReactNode }> = ({ label, score, icon }) => {
  const getLabel = (s: number) => (s >= 7 ? 'High' : s >= 5 ? 'Medium' : 'Low');
  const getColor = (s: number) => (s >= 7 ? 'bg-green-500' : s >= 5 ? 'bg-yellow-500' : 'bg-red-500');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{label}</h3>
          {icon}
        </div>

        <div className="mb-2 flex items-end justify-between">
          <span className="text-3xl font-bold text-white">{score.toFixed(1)}</span>
          <span className={cn('text-xs font-semibold px-2 py-1 rounded-full', getColor(score), 'text-white')}>
            {getLabel(score)}
          </span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full transition-all', getColor(score))}
            initial={{ width: 0 }}
            animate={{ width: `${(score / 10) * 100}%` }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </div>

        <p className="text-xs text-gray-400 mt-3">Scale: 0-10</p>
      </GlassCard>
    </motion.div>
  );
};

export const VenueAnalyticsDashboard: React.FC = () => {
  const [selectedVenueId, setSelectedVenueId] = useState('1');
  const selectedVenue = venues.find((v) => v.id === selectedVenueId) || venues[0];

  const handleExport = () => {
    const data = {
      venue: selectedVenue,
      exportDate: new Date().toISOString(),
      runsDistribution: runsDistributionData,
      wicketsPhases,
      winMethods,
      historicalRecords,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedVenue.name.replace(/\s+/g, '_')}_analytics.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Venue Analytics</h1>
              <p className="text-gray-400">Deep dive into venue statistics and performance metrics</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <Download size={20} />
              Export
            </button>
          </div>
        </motion.div>

        {/* Venue Selector */}
        <motion.div variants={itemVariants} className="mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="text-sm text-gray-400 mb-3 block">Select Venue</label>
                <select
                  value={selectedVenueId}
                  onChange={(e) => setSelectedVenueId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name} / {venue.city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-right pt-8">
                <p className="text-2xl font-bold text-white">{selectedVenue.name}</p>
                <p className="text-gray-400">{selectedVenue.city}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard label="Matches Played" value={selectedVenue.matchesPlayed} icon={<BarChart3 size={24} />} />
          <KPICard label="Avg First Innings" value={selectedVenue.avgFirstInnings} icon={<TrendingUp size={24} />} />
          <KPICard label="Avg Second Innings" value={selectedVenue.avgSecondInnings} icon={<TrendingUp size={24} />} />
          <KPICard label="Toss Impact %" value={selectedVenue.tossImpact + '%'} icon={<Zap size={24} />} />
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <BarChart3 size={20} />
                Runs Distribution by Over
              </h2>
              <div className="overflow-x-auto">
                <RunsDistributionChart data={runsDistributionData} />
              </div>
              <p className="text-xs text-gray-400 mt-4">Average runs scored in each over during first innings</p>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Target size={20} />
                Wickets Distribution by Phase
              </h2>
              <div className="overflow-x-auto">
                <WicketsDistributionChart phases={wicketsPhases} />
              </div>
              <p className="text-xs text-gray-400 mt-4">Average wickets falling in each phase</p>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Winning Method Analysis */}
        <motion.div variants={itemVariants} className="mb-8">
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <PieChart size={20} />
              Winning Method Analysis
            </h2>
            <WinMethodChart methods={winMethods} />
            <p className="text-xs text-gray-400 mt-6">Distribution of match outcomes at this venue</p>
          </GlassCard>
        </motion.div>

        {/* Venue Insights */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InsightCard label="Batting Friendly Index" score={selectedVenue.battingFriendly} icon={<Zap size={24} className="text-blue-400" />} />
          <InsightCard label="Bowling Friendly Index" score={selectedVenue.bowlingFriendly} icon={<Target size={24} className="text-green-400" />} />
        </motion.div>

        {/* Toss Impact Analysis */}
        <motion.div variants={itemVariants} className="mb-8">
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Toss Impact Analysis</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Toss Winner Win %</p>
                <p className="text-2xl font-bold text-green-400">{selectedVenue.tossImpact}%</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Bat First Win %</p>
                <p className="text-2xl font-bold text-blue-400">58%</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Bowl First Win %</p>
                <p className="text-2xl font-bold text-purple-400">42%</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Avg Dew Factor</p>
                <p className="text-2xl font-bold text-orange-400">7.2%</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Historical Records */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Historical Records</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Record</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Value</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Teams/Players</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalRecords.map((record, idx) => (
                    <motion.tr
                      key={`record-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                      className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm text-gray-300">{record.title}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-white">{record.value}</td>
                      <td className="px-4 py-4 text-sm text-gray-400">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="px-4 py-4 text-sm text-gray-400">{record.teams}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VenueAnalyticsDashboard;
