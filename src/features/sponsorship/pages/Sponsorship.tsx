import React from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { DollarSign, TrendingUp, Users, Clock } from 'lucide-react';

export function Sponsorship() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sponsorship</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Sponsorship management and tracking</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <p className="text-sm text-slate-500">Total Sponsorship</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">$124,500</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-slate-500">Pending</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">$25,000</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-500" />
            <p className="text-sm text-slate-500">Active Sponsors</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">18</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <p className="text-sm text-slate-500">Expiring Soon</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Sponsorships</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  S{i}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Sponsor {i * 100}</p>
                  <p className="text-xs text-slate-500">Cricket Equipment Ltd.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900 dark:text-white">$5,000</p>
                <p className="text-xs text-slate-500">Active</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export default Sponsorship;