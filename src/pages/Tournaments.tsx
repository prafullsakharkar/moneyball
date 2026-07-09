import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, Target, ChevronRight, MapPin } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { AreaChart, BarChart } from '../components/ui/Charts';
import { mockTournaments, mockTeams, teamStandings, generateChartData, chartColors } from '../lib/mock-data';
import { cn } from '../lib/utils';

export function TournamentList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tournaments</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and analyze all cricket tournaments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockTournaments.map((tournament, index) => (
          <motion.div
            key={tournament.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard hover gradient className="cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  tournament.status === 'completed' ? 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400' :
                  tournament.status === 'ongoing' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' :
                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                )}>
                  {tournament.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{tournament.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{tournament.season} | {tournament.format}</p>

              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{tournament.venue}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Teams</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{tournament.total_teams}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Matches</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{tournament.total_matches}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{tournament.start_date} - {tournament.end_date}</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function TournamentOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">IPL 2024 Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Indian Premier League Season 2024</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Total Teams" value={10} icon={<Users className="w-6 h-6" />} color={chartColors.primary} />
        <KPIWidget title="Total Players" value={258} icon={<Target className="w-6 h-6" />} color={chartColors.cyan} />
        <KPIWidget title="Matches Played" value={74} icon={<Calendar className="w-6 h-6" />} color={chartColors.success} />
        <KPIWidget title="Total Runs" value={28456} icon={<Trophy className="w-6 h-6" />} color={chartColors.warning} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Wickets', value: 892, color: chartColors.error },
          { label: 'Total Sixes', value: 1284, color: chartColors.success },
          { label: 'Total Fours', value: 2356, color: chartColors.cyan },
          { label: 'Avg Run Rate', value: '8.9' },
          { label: 'Avg Score', value: '175' },
        ].map((stat) => (
          <GlassCard key={stat.label} hover>
            <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Runs Trend</h3>
          <AreaChart data={generateChartData().slice(0, 6).map(d => ({ x: d.month, y: d.value }))} color={chartColors.primary} height={200} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Wickets Trend</h3>
          <AreaChart data={generateChartData().slice(0, 6).map(d => ({ x: d.month, y: Math.floor(d.value * 0.1) }))} color={chartColors.cyan} height={200} />
        </GlassCard>
      </div>

      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Key Insights</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Highest Score', value: '287/3', subtitle: 'RCB vs LSG' },
            { title: 'Biggest Win', value: '104 Runs', subtitle: 'GT vs MI' },
            { title: 'Best Chase', value: '267/5', subtitle: 'LSG vs SRH' },
            { title: 'Lowest Defended', value: '143', subtitle: 'CSK vs KKR' },
          ].map((insight) => (
            <div key={insight.title} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">{insight.title}</p>
              <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-1">{insight.value}</p>
              <p className="text-xs text-slate-400 mt-1">{insight.subtitle}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export default TournamentList;
