'use client';

import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Download,
  Trophy,
  BarChart3,
  Activity,
  Target,
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

// Mock data for MVP Analytics
const mockPlayers = [
  { id: 1, name: 'Virat Kohli', team: 'RCB', batting: 8.5, bowling: 0, fielding: 7.2, matchWinning: 72 },
  { id: 2, name: 'Suryakumar Yadav', team: 'MI', batting: 8.2, bowling: 0, fielding: 7.5, matchWinning: 68 },
  { id: 3, name: 'Jasprit Bumrah', team: 'MI', batting: 1.5, bowling: 9.2, fielding: 6.8, matchWinning: 65 },
  { id: 4, name: 'Rohit Sharma', team: 'MI', batting: 8.0, bowling: 0, fielding: 7.0, matchWinning: 62 },
  { id: 5, name: 'KL Rahul', team: 'PBKS', batting: 7.8, bowling: 0, fielding: 6.9, matchWinning: 60 },
  { id: 6, name: 'Rashid Khan', team: 'GT', batting: 5.5, bowling: 8.8, fielding: 7.3, matchWinning: 58 },
  { id: 7, name: 'Sanju Samson', team: 'RR', batting: 8.1, bowling: 0, fielding: 7.1, matchWinning: 59 },
  { id: 8, name: 'Pat Cummins', team: 'KKR', batting: 4.2, bowling: 8.5, fielding: 7.4, matchWinning: 56 },
  { id: 9, name: 'Hardik Pandya', team: 'GT', batting: 7.6, bowling: 7.8, fielding: 7.2, matchWinning: 61 },
  { id: 10, name: 'Yuzvendra Chahal', team: 'RR', batting: 0.5, bowling: 8.3, fielding: 6.7, matchWinning: 55 },
];

const mockMVPTrend = [
  { match: 'M1', kohli: 7.5, suryakumar: 7.2, bumrah: 6.8 },
  { match: 'M2', kohli: 8.1, suryakumar: 7.8, bumrah: 8.2 },
  { match: 'M3', kohli: 8.3, suryakumar: 8.0, bumrah: 7.5 },
  { match: 'M4', kohli: 7.9, suryakumar: 8.4, bumrah: 8.8 },
  { match: 'M5', kohli: 8.6, suryakumar: 7.9, bumrah: 7.2 },
  { match: 'M6', kohli: 8.4, suryakumar: 8.2, bumrah: 8.9 },
  { match: 'M7', kohli: 8.5, suryakumar: 8.1, bumrah: 9.1 },
];

const mockPlayerTrend = [
  { match: 'M1', impact: 7.5 },
  { match: 'M2', impact: 8.1 },
  { match: 'M3', impact: 8.3 },
  { match: 'M4', impact: 7.9 },
  { match: 'M5', impact: 8.6 },
  { match: 'M6', impact: 8.4 },
  { match: 'M7', impact: 8.5 },
];

const rankingMovement = [
  { name: 'Virat Kohli', movement: 2, position: 1 },
  { name: 'Suryakumar Yadav', movement: 1, position: 2 },
  { name: 'Jasprit Bumrah', movement: -1, position: 3 },
  { name: 'Rohit Sharma', movement: 0, position: 4 },
  { name: 'Hardik Pandya', movement: 3, position: 5 },
  { name: 'KL Rahul', movement: -2, position: 6 },
  { name: 'Sanju Samson', movement: 1, position: 7 },
  { name: 'Rashid Khan', movement: 2, position: 8 },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const KPICard: React.FC<{
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error';
}> = ({ title, value, subtitle, icon, color }) => {
  const colorClasses = {
    primary: 'text-blue-500 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20',
    success: 'text-green-500 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20',
    warning: 'text-yellow-500 dark:text-yellow-400 bg-yellow-500/10 dark:bg-yellow-500/20',
    error: 'text-red-500 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20',
  };

  return (
    <motion.div variants={itemVariants}>
      <GlassCard className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {value.toFixed(1)}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {subtitle}
            </p>
          </div>
          <div className={cn('p-3 rounded-lg', colorClasses[color])}>
            {icon}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const LeaderboardTable: React.FC = () => {
  const rankedPlayers = mockPlayers.map((player, idx) => ({
    ...player,
    totalImpact: player.batting + player.bowling + player.fielding,
    rank: idx + 1,
  }));

  const medals = ['bg-yellow-400/20 dark:bg-yellow-400/30', 'bg-gray-300/20 dark:bg-gray-300/30', 'bg-orange-400/20 dark:bg-orange-400/30'];

  return (
    <motion.div variants={itemVariants}>
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Top MVP Leaderboard
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Rank
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Player
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Team
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Batting
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Bowling
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Fielding
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Total Impact
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Match Winning %
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {rankedPlayers.map((player, idx) => (
                <motion.tr
                  key={player.id}
                  variants={itemVariants}
                  className={cn(
                    'border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                    idx < 3 && medals[idx]
                  )}
                >
                  <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">
                    {idx < 3 && (
                      <span className="inline-block mr-2">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                      </span>
                    )}
                    {player.rank}
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                    {player.name}
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    {player.team}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-700 dark:text-gray-300">
                    {player.batting.toFixed(1)}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-700 dark:text-gray-300">
                    {player.bowling.toFixed(1)}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-700 dark:text-gray-300">
                    {player.fielding.toFixed(1)}
                  </td>
                  <td className="py-4 px-4 text-center font-semibold text-blue-600 dark:text-blue-400">
                    {player.totalImpact.toFixed(1)}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-700 dark:text-gray-300">
                    {player.matchWinning}%
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-green-500 dark:text-green-400 flex items-center justify-center gap-1">
                      <TrendingUp size={16} />
                      +2%
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const MVPTrendChart: React.FC = () => {
  const chartHeight = 280;
  const chartWidth = 500;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };

  const innerHeight = chartHeight - padding.top - padding.bottom;
  const innerWidth = chartWidth - padding.left - padding.right;

  const maxValue = 10;
  const minValue = 0;

  const getY = (value: number) =>
    padding.top + innerHeight - ((value - minValue) / (maxValue - minValue)) * innerHeight;
  const getX = (index: number) =>
    padding.left + (index / (mockMVPTrend.length - 1)) * innerWidth;

  const kohliBuddy = mockMVPTrend.map((d, i) => `${getX(i)},${getY(d.kohli)}`).join(' L ');
  const suryakumarLine = mockMVPTrend.map((d, i) => `${getX(i)},${getY(d.suryakumar)}`).join(' L ');
  const bumrahLine = mockMVPTrend.map((d, i) => `${getX(i)},${getY(d.bumrah)}`).join(' L ');

  return (
    <motion.div variants={itemVariants}>
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          MVP Trend (Top 3 Players)
        </h3>
        <div className="flex flex-col">
          <svg
            width={chartWidth}
            height={chartHeight}
            className="mx-auto"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            {/* Grid lines */}
            {[0, 2, 4, 6, 8, 10].map((val) => (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={getY(val)}
                  x2={chartWidth - padding.right}
                  y2={getY(val)}
                  stroke="#e5e7eb"
                  strokeDasharray="4"
                  className="dark:stroke-gray-700"
                />
                <text
                  x={padding.left - 35}
                  y={getY(val) + 4}
                  fontSize="12"
                  fill="#9ca3af"
                  className="dark:fill-gray-500"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            ))}

            {/* X-axis labels */}
            {mockMVPTrend.map((d, i) => (
              <text
                key={i}
                x={getX(i)}
                y={chartHeight - padding.bottom + 20}
                fontSize="12"
                fill="#9ca3af"
                className="dark:fill-gray-500"
                textAnchor="middle"
              >
                {d.match}
              </text>
            ))}

            {/* Lines */}
            <polyline
              points={kohliBuddy}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={suryakumarLine}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={bumrahLine}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {mockMVPTrend.map((d, i) => (
              <g key={`points-${i}`}>
                <circle cx={getX(i)} cy={getY(d.kohli)} r="4" fill="#3b82f6" />
                <circle cx={getX(i)} cy={getY(d.suryakumar)} r="4" fill="#10b981" />
                <circle cx={getX(i)} cy={getY(d.bumrah)} r="4" fill="#f59e0b" />
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div className="flex gap-6 justify-center mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Virat Kohli</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Suryakumar Yadav</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Jasprit Bumrah</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const MatchImpactChart: React.FC<{ selectedPlayer?: string }> = ({
  selectedPlayer = 'Virat Kohli',
}) => {
  const chartHeight = 280;
  const chartWidth = 500;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };

  const innerHeight = chartHeight - padding.top - padding.bottom;
  const innerWidth = chartWidth - padding.left - padding.right;

  const maxValue = 10;
  const minValue = 0;

  const getY = (value: number) =>
    padding.top + innerHeight - ((value - minValue) / (maxValue - minValue)) * innerHeight;
  const getX = (index: number) =>
    padding.left + (index / (mockPlayerTrend.length - 1)) * innerWidth;

  const areaPath = [
    `M${padding.left},${padding.top + innerHeight}`,
    ...mockPlayerTrend.map((d, i) => `L${getX(i)},${getY(d.impact)}`),
    `L${chartWidth - padding.right},${padding.top + innerHeight}`,
  ].join(' ');

  const linePath = mockPlayerTrend.map((d, i) => `${getX(i)},${getY(d.impact)}`).join(' L ');

  return (
    <motion.div variants={itemVariants}>
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Match Impact Trend - {selectedPlayer}
        </h3>
        <div className="flex flex-col">
          <svg
            width={chartWidth}
            height={chartHeight}
            className="mx-auto"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            {/* Grid lines */}
            {[0, 2, 4, 6, 8, 10].map((val) => (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={getY(val)}
                  x2={chartWidth - padding.right}
                  y2={getY(val)}
                  stroke="#e5e7eb"
                  strokeDasharray="4"
                  className="dark:stroke-gray-700"
                />
                <text
                  x={padding.left - 35}
                  y={getY(val) + 4}
                  fontSize="12"
                  fill="#9ca3af"
                  className="dark:fill-gray-500"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            ))}

            {/* X-axis labels */}
            {mockPlayerTrend.map((d, i) => (
              <text
                key={i}
                x={getX(i)}
                y={chartHeight - padding.bottom + 20}
                fontSize="12"
                fill="#9ca3af"
                className="dark:fill-gray-500"
                textAnchor="middle"
              >
                {d.match}
              </text>
            ))}

            {/* Area fill */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#areaGradient)" />

            {/* Line */}
            <polyline
              points={linePath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {mockPlayerTrend.map((d, i) => (
              <circle key={i} cx={getX(i)} cy={getY(d.impact)} r="4" fill="#3b82f6" />
            ))}
          </svg>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const RankingMovementCard: React.FC = () => {
  return (
    <motion.div variants={itemVariants}>
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Ranking Movement (Top 8)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rankingMovement.map((player) => (
            <div
              key={player.name}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  #{player.position} {player.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {player.movement > 0 && (
                  <div className="flex items-center gap-1 text-green-500 dark:text-green-400">
                    <TrendingUp size={16} />
                    <span className="text-sm font-semibold">+{player.movement}</span>
                  </div>
                )}
                {player.movement < 0 && (
                  <div className="flex items-center gap-1 text-red-500 dark:text-red-400">
                    <TrendingDown size={16} />
                    <span className="text-sm font-semibold">{player.movement}</span>
                  </div>
                )}
                {player.movement === 0 && (
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    —
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};

const ImpactBreakdownChart: React.FC = () => {
  const topPlayer = mockPlayers[0];
  const total = topPlayer.batting + topPlayer.bowling + topPlayer.fielding;

  const battingWidth = (topPlayer.batting / total) * 100;
  const bowlingWidth = (topPlayer.bowling / total) * 100;
  const fieldingWidth = (topPlayer.fielding / total) * 100;

  return (
    <motion.div variants={itemVariants}>
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Impact Breakdown - {topPlayer.name}
        </h3>

        <div className="space-y-6">
          {/* Batting */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Batting Impact
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {topPlayer.batting.toFixed(1)} ({battingWidth.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${battingWidth}%` }}
              />
            </div>
          </div>

          {/* Bowling */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bowling Impact
              </span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {topPlayer.bowling.toFixed(1)} ({bowlingWidth.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${bowlingWidth}%` }}
              />
            </div>
          </div>

          {/* Fielding */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Fielding Impact
              </span>
              <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                {topPlayer.fielding.toFixed(1)} ({fieldingWidth.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${fieldingWidth}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            Total Impact Score: <span className="font-bold">{total.toFixed(1)}</span>
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export const MVPAnalytics: React.FC = () => {
  const avgBattingImpact =
    mockPlayers.reduce((sum, p) => sum + p.batting, 0) / mockPlayers.length;
  const avgBowlingImpact =
    mockPlayers.reduce((sum, p) => sum + p.bowling, 0) / mockPlayers.length;
  const avgFieldingImpact =
    mockPlayers.reduce((sum, p) => sum + p.fielding, 0) / mockPlayers.length;
  const avgMatchWinning =
    mockPlayers.reduce((sum, p) => sum + p.matchWinning, 0) / mockPlayers.length;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">MVP Analytics</h1>
              <p className="text-gray-400">
                IPL Season Performance Analysis & Rankings
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              <Download size={18} />
              Export Report
            </motion.button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          <KPICard
            title="Batting Impact"
            value={avgBattingImpact}
            subtitle="Average across all players"
            icon={<Trophy size={24} />}
            color="primary"
          />
          <KPICard
            title="Bowling Impact"
            value={avgBowlingImpact}
            subtitle="Average across all players"
            icon={<Activity size={24} />}
            color="success"
          />
          <KPICard
            title="Fielding Impact"
            value={avgFieldingImpact}
            subtitle="Average across all players"
            icon={<Target size={24} />}
            color="warning"
          />
          <KPICard
            title="Match Winning %"
            value={avgMatchWinning}
            subtitle="Average contribution"
            icon={<BarChart3 size={24} />}
            color="error"
          />
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div className="mb-8" variants={itemVariants}>
          <LeaderboardTable />
        </motion.div>

        {/* Charts Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          variants={containerVariants}
        >
          <MVPTrendChart />
          <MatchImpactChart />
        </motion.div>

        {/* Ranking Movement */}
        <motion.div className="mb-8" variants={itemVariants}>
          <RankingMovementCard />
        </motion.div>

        {/* Impact Breakdown */}
        <motion.div className="mb-8" variants={itemVariants}>
          <ImpactBreakdownChart />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MVPAnalytics;
