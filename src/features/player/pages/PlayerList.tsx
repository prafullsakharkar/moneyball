import React from 'react';
import { motion } from 'framer-motion';
import { User, Target, TrendingUp, Zap, Search } from 'lucide-react';
import { GlassCard, KPIWidget } from '../../../components/ui/GlassCard';
import { RadarChart, AreaChart } from '../../../components/ui/Charts';
import { mockPlayers, mockTeams, generateChartData, chartColors } from '../../../lib/mock-data';
import { cn, getInitials } from '../../../lib/utils';

export function PlayerList() {
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');

  const filteredPlayers = mockPlayers.filter(player =>
    player.full_name.toLowerCase().includes(search.toLowerCase()) &&
    (typeFilter === 'all' || player.player_type.toLowerCase().includes(typeFilter.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Players</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Explore player profiles and performance</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search players..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'batsman', 'bowler', 'all-rounder', 'wicket-keeper'].map(type => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              typeFilter === type
                ? 'bg-primary-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard hover gradient className="cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                  {getInitials(player.full_name)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">{player.full_name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{player.nationality}</p>
                  <span className={cn(
                    'inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium',
                    player.player_type === 'Batsman' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' :
                    player.player_type === 'Bowler' ? 'bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400' :
                    'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400'
                  )}>
                    {player.player_type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/30">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{500 + Math.floor(Math.random() * 300)}</p>
                  <p className="text-xs text-slate-500">Runs</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{Math.floor(Math.random() * 25)}</p>
                  <p className="text-xs text-slate-500">Wickets</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{(30 + Math.random() * 20).toFixed(1)}</p>
                  <p className="text-xs text-slate-500">Avg</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function PlayerProfile() {
  const player = mockPlayers[0];

  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-3xl">
            {getInitials(player.full_name)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{player.full_name}</h1>
              <span className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-sm">{player.player_type}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2">
              <span>{player.nationality}</span>
              <span>|</span>
              <span>Batting: {player.batting_style}</span>
              {player.bowling_style && <><span>|</span><span>Bowling: {player.bowling_style}</span></>}
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="flex gap-2">
        {['Batting', 'Bowling', 'Fielding'].map(tab => (
          <button
            key={tab}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              tab === 'Batting' ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Matches" value={14} icon={<User className="w-6 h-6" />} color={chartColors.primary} />
        <KPIWidget title="Runs" value={784} icon={<TrendingUp className="w-6 h-6" />} color={chartColors.success} />
        <KPIWidget title="Average" value={45.6} icon={<Target className="w-6 h-6" />} color={chartColors.cyan} />
        <KPIWidget title="Strike Rate" value={148.2} icon={<Zap className="w-6 h-6" />} color={chartColors.warning} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Career Trend</h3>
          <AreaChart data={generateChartData().map((d, i) => ({ x: 2018 + i, y: d.value }))} color={chartColors.primary} height={250} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance Radar</h3>
          <RadarChart categories={['Batting', 'Bowling', 'Fielding', 'Consistency', 'Impact']} data={[85, 60, 90, 72, 78]} color={chartColors.cyan} />
        </GlassCard>
      </div>
    </div>
  );
}

export default PlayerList;