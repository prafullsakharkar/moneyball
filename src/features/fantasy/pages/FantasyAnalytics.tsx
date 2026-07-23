import React from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';

export function FantasyAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Fantasy Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Advanced fantasy performance analytics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard>
          <p className="text-sm text-slate-500">Total Fantasy Points</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">1,245</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-500">Fantasy Teams</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">42</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-500">Avg Points</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">29.6</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-500">Top Performer</p>
          <p className="text-lg font-bold text-primary-500 mt-2">Player Name</p>
        </GlassCard>
      </div>
    </div>
  );
}

export default FantasyAnalytics;