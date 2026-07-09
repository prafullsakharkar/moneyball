import React from 'react';
import { motion } from 'framer-motion';
import { Award, Target, TrendingUp, Crown, Medal } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AreaChart } from '../components/ui/Charts';
import { mockPlayers, mockTeams, topBatsmen, topBowlers, mvpPlayers, generateChartData, chartColors } from '../lib/mock-data';
import { cn } from '../lib/utils';

export function OrangeCap() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Orange Cap</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Top run scorers</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-warning-500 to-orange-500 text-white font-bold">
          <Award className="w-5 h-5" />
          Top Batsman
        </div>
      </div>

      <GlassCard gradient>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-warning-500 to-orange-500 flex items-center justify-center">
            <Award className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500">Orange Cap Holder</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{topBatsmen[0].player.full_name}</h2>
            <div className="flex items-center gap-6 mt-2">
              <div><p className="text-2xl font-bold text-warning-600">{topBatsmen[0].runs}</p><p className="text-sm text-slate-500">Runs</p></div>
              <div><p className="text-2xl font-bold text-slate-900">{topBatsmen[0].avg}</p><p className="text-sm text-slate-500">Average</p></div>
              <div><p className="text-2xl font-bold text-slate-900">{topBatsmen[0].sr}</p><p className="text-sm text-slate-500">Strike Rate</p></div>
            </div>
          </div>
          <div className="w-20 h-20 rounded-xl flex items-center justify-center text-white font-bold text-xl"
            style={{ background: `linear-gradient(135deg, ${topBatsmen[0].team.primary_color}, ${topBatsmen[0].team.secondary_color})` }}>
            {topBatsmen[0].team.short_name}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Leaderboard</h3>
        <div className="space-y-2">
          {topBatsmen.map((entry, index) => (
            <div key={entry.player.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                index === 0 ? 'bg-gradient-to-br from-warning-500 to-orange-500 text-white' :
                index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' :
                'bg-slate-100 dark:bg-slate-800 text-slate-600'
              )}>
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">{entry.player.full_name}</p>
                <p className="text-sm text-slate-500">{entry.team.short_name}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-slate-900 dark:text-white">{entry.runs}</p>
                <p className="text-xs text-slate-500">runs</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export function PurpleCap() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Purple Cap</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Top wicket takers</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-purple-600 to-purple-600 text-white font-bold">
          <Target className="w-5 h-5" />
          Top Bowler
        </div>
      </div>

      <GlassCard gradient>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-purple-600 to-purple-600 flex items-center justify-center">
            <Target className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500">Purple Cap Holder</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{topBowlers[0].player.full_name}</h2>
            <div className="flex items-center gap-6 mt-2">
              <div><p className="text-2xl font-bold text-accent-purple-600">{topBowlers[0].wickets}</p><p className="text-sm text-slate-500">Wickets</p></div>
              <div><p className="text-2xl font-bold text-slate-900">{topBowlers[0].avg}</p><p className="text-sm text-slate-500">Average</p></div>
              <div><p className="text-2xl font-bold text-slate-900">{topBowlers[0].economy}</p><p className="text-sm text-slate-500">Economy</p></div>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Leaderboard</h3>
        <div className="space-y-2">
          {topBowlers.map((entry, index) => (
            <div key={entry.player.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                index === 0 ? 'bg-gradient-to-br from-accent-purple-600 to-purple-600 text-white' :
                index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' :
                'bg-slate-100 dark:bg-slate-800 text-slate-600'
              )}>
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">{entry.player.full_name}</p>
                <p className="text-sm text-slate-500">{entry.team.short_name}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-slate-900 dark:text-white">{entry.wickets}</p>
                <p className="text-xs text-slate-500">wickets</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export function MVPRankings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">MVP Rankings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Most Valuable Player standings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {mvpPlayers.map((item, index) => (
          <motion.div
            key={item.player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard hover className="text-center">
              <div className={cn(
                'w-16 h-16 mx-auto rounded-full flex items-center justify-center font-bold text-2xl',
                index === 0 ? 'bg-gradient-to-br from-warning-500 to-orange-500 text-white' :
                'bg-gradient-to-br from-slate-300 to-slate-400 text-white'
              )}>
                {index + 1}
              </div>
              <p className="mt-4 font-bold text-slate-900 dark:text-white">{item.player.full_name}</p>
              <p className="text-sm text-slate-500">{item.team.short_name}</p>
              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-2xl font-bold text-primary-600">{item.total}</p>
                <p className="text-xs text-slate-500">MVP Points</p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1 text-xs">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white">{item.batting}</p>
                  <p className="text-slate-400">Bat</p>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white">{item.bowling}</p>
                  <p className="text-slate-400">Bowl</p>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white">{item.fielding}</p>
                  <p className="text-slate-400">Field</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default OrangeCap;
