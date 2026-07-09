import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trophy, Target, TrendingUp, Radio, MapPin } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { WormChart, ManhattanChart, LineChart } from '../components/ui/Charts';
import { mockTeams, mockLiveMatches, generateOverData, chartColors } from '../lib/mock-data';
import { cn } from '../lib/utils';

export function MatchCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Match Center</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Live scores and match analytics</p>
      </div>

      {/* Live Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockLiveMatches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard gradient className="relative overflow-hidden">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-error-500" />
                </span>
                <span className="px-2 py-1 rounded-full bg-error-500 text-white text-xs font-bold uppercase">Live</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                <MapPin className="w-3 h-3" />
                <span>{match.venue}</span>
                <span>|</span>
                <span>{match.match_type}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: `linear-gradient(135deg, ${match.team1.primary_color}, ${match.team1.secondary_color})` }}>
                    {match.team1.short_name}
                  </div>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-white">{match.team1.short_name}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                    {match.score1.runs}/{match.score1.wickets}
                    <span className="text-sm font-normal text-slate-500"> ({match.score1.overs})</span>
                  </p>
                </div>

                <div className="px-4">
                  <span className="text-2xl font-bold text-slate-300 dark:text-slate-600">VS</span>
                </div>

                <div className="flex-1 text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: `linear-gradient(135deg, ${match.team2.primary_color}, ${match.team2.secondary_color})` }}>
                    {match.team2.short_name}
                  </div>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-white">{match.team2.short_name}</p>
                  {match.score2 ? (
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                      {match.score2.runs}/{match.score2.wickets}
                      <span className="text-sm font-normal text-slate-500"> ({match.score2.overs})</span>
                    </p>
                  ) : (
                    <p className="mt-1 text-lg text-slate-500">Yet to bat</p>
                  )}
                </div>
              </div>

              <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors">
                <Radio className="w-4 h-4" />
                View Live
              </button>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Matches */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Upcoming Matches</h3>
        <div className="space-y-3">
          {[
            { team1: mockTeams[0], team2: mockTeams[1], date: 'Tomorrow, 7:30 PM' },
            { team1: mockTeams[2], team2: mockTeams[3], date: 'Tomorrow, 3:30 PM' },
          ].map((match, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: `linear-gradient(135deg, ${match.team1.primary_color}, ${match.team1.secondary_color})` }}>
                  {match.team1.short_name}
                </div>
                <span className="text-slate-500 font-medium">vs</span>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: `linear-gradient(135deg, ${match.team2.primary_color}, ${match.team2.secondary_color})` }}>
                  {match.team2.short_name}
                </div>
              </div>
              <span className="text-sm text-slate-500">{match.date}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export function MatchAnalytics() {
  const overData = generateOverData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Match Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive into match performance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Total Matches" value={166} icon={<Calendar className="w-6 h-6" />} color={chartColors.primary} />
        <KPIWidget title="Avg Run Rate" value={8.4} icon={<TrendingUp className="w-6 h-6" />} color={chartColors.cyan} suffix="/ov" />
        <KPIWidget title="Avg Score" value={175} icon={<Target className="w-6 h-6" />} color={chartColors.success} />
        <KPIWidget title="Avg Wickets" value={15} icon={<Target className="w-6 h-6" />} color={chartColors.error} />
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Worm Chart - Run Progression</h3>
        <WormChart
          data={overData.map((o, i) => ({ over: o.over, team1: o.runs * i * 0.8, team2: o.runs * i * 0.9 }))}
          team1Name="CSK"
          team2Name="MI"
          height={300}
        />
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Manhattan Chart</h3>
          <ManhattanChart data={overData} color={chartColors.primary} height={250} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Win Probability</h3>
          <LineChart
            series={[
              { name: 'Team 1', data: [50, 55, 48, 52, 60, 65, 72, 78, 85, 90], color: chartColors.cyan },
              { name: 'Team 2', data: [50, 45, 52, 48, 40, 35, 28, 22, 15, 10], color: chartColors.purple },
            ]}
            categories={['0', '5', '10', '15', '20', '25', '30', '35', '40', '50']}
            height={250}
          />
        </GlassCard>
      </div>
    </div>
  );
}

export default MatchCenter;
