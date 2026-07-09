import React from 'react';
import { motion } from 'framer-motion';
import { Swords, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { RadarChart, BarChart } from '../components/ui/Charts';
import { mockTeams, mockPlayers, chartColors } from '../lib/mock-data';
import { cn, getInitials } from '../lib/utils';

export function H2HAnalytics() {
  const teams = mockTeams.slice(0, 2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Head to Head</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Compare teams and players</p>
      </div>

      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Team vs Team</h3>

        <div className="grid grid-cols-2 gap-8 mb-6">
          {teams.map((team) => (
            <div key={team.id} className="text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
                style={{ background: `linear-gradient(135deg, ${team.primary_color}, ${team.secondary_color})` }}>
                {team.short_name}
              </div>
              <h4 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{team.name}</h4>
              <p className="text-sm text-slate-500">{team.city}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 mb-2">Total Matches</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">38</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center justify-center gap-4">
              <div>
                <p className="text-2xl font-bold text-primary-600">22</p>
                <p className="text-xs text-slate-500">CSK</p>
              </div>
              <span className="text-slate-300">-</span>
              <div>
                <p className="text-2xl font-bold text-cyan-600">16</p>
                <p className="text-xs text-slate-500">MI</p>
              </div>
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 mb-2">Win Rate</p>
            <p className="text-2xl font-bold text-success-600">57.9%</p>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance Radar</h3>
          <RadarChart categories={['Wins', 'Runs', 'Wickets', 'NRR', 'Centuries']} data={[85, 78, 72, 65, 90]} color={chartColors.primary} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Key Matchups</h3>
          <div className="space-y-3">
            {[
              { batter: 'Virat Kohli', bowler: 'Jasprit Bumrah', runs: 45, dismissals: 3 },
              { batter: 'MS Dhoni', bowler: 'Rashid Khan', runs: 72, dismissals: 1 },
            ].map((m, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(m.batter)}
                    </div>
                    <span className="text-sm font-medium text-slate-400">vs</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-primary-500 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(m.bowler)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{m.runs}</p>
                    <p className="text-xs text-slate-500">runs, {m.dismissals} dismissals</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default H2HAnalytics;
