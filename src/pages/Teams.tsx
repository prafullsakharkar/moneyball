import React from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Target, TrendingUp, ChevronRight, Search } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { RadarChart, AreaChart } from '../components/ui/Charts';
import { mockTeams, teamStandings, generateChartData, chartColors } from '../lib/mock-data';
import { cn } from '../lib/utils';

export function TeamList() {
  const [search, setSearch] = React.useState('');

  const filteredTeams = mockTeams.filter(team =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Teams</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Explore all teams and performance metrics</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeams.map((team, index) => {
          const standing = teamStandings.find(s => s.team_id === team.id);
          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard hover gradient className="cursor-pointer overflow-hidden">
                <div className="h-20 -mx-6 -mt-6 mb-4 px-6 pt-6 relative" style={{ background: `linear-gradient(135deg, ${team.primary_color}, ${team.secondary_color})` }}>
                  <div className="absolute bottom-4 left-6 flex items-end gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold">
                      {team.short_name}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{team.name}</h3>
                      <p className="text-sm text-white/80">{team.city}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500">Matches</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{standing?.matches || 0}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500">Wins</p>
                    <p className="text-lg font-bold text-success-600">{standing?.wins || 0}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500">Points</p>
                    <p className="text-lg font-bold text-primary-600">{standing?.points || 0}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className={cn('text-sm font-medium', (standing?.nrr || 0) >= 0 ? 'text-success-600' : 'text-error-600')}>
                    NRR: {(standing?.nrr || 0) >= 0 ? '+' : ''}{(standing?.nrr || 0).toFixed(3)}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function TeamProfile() {
  const team = mockTeams[0];
  const standing = teamStandings[0];

  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl" style={{ background: `linear-gradient(135deg, ${team.primary_color}, ${team.secondary_color})` }}>
            {team.short_name}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{team.name}</h1>
            <p className="text-slate-500 dark:text-slate-400">{team.home_venue}</p>
            <div className="flex gap-2 mt-2">
              <span className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-sm">5x Champions</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 text-sm">Est. {team.founded_year}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="grid grid-cols-3 gap-6">
              <div><p className="text-3xl font-bold text-slate-900 dark:text-white">258</p><p className="text-xs text-slate-500">Matches</p></div>
              <div><p className="text-3xl font-bold text-success-600">62%</p><p className="text-xs text-slate-500">Win Rate</p></div>
              <div><p className="text-3xl font-bold text-warning-500">5</p><p className="text-xs text-slate-500">Titles</p></div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Wins" value={standing.wins} icon={<Trophy className="w-6 h-6" />} color={chartColors.success} />
        <KPIWidget title="Losses" value={standing.losses} icon={<Target className="w-6 h-6" />} color={chartColors.error} />
        <KPIWidget title="Points" value={standing.points} icon={<TrendingUp className="w-6 h-6" />} color={chartColors.primary} />
        <KPIWidget title="NRR" value={standing.nrr.toFixed(3)} icon={<Target className="w-6 h-6" />} color={chartColors.cyan} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance Radar</h3>
          <RadarChart categories={['Batting', 'Bowling', 'Fielding', 'Finishing', 'Consistency']} data={[85, 72, 90, 88, 78]} color={chartColors.primary} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Season Progress</h3>
          <AreaChart data={generateChartData().slice(0, 10).map((d, i) => ({ x: i + 1, y: d.value }))} color={chartColors.success} height={250} />
        </GlassCard>
      </div>
    </div>
  );
}

export default TeamList;
