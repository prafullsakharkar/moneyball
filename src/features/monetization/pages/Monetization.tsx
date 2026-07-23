import React from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { DollarSign, CreditCard, TrendingUp, Wallet } from 'lucide-react';

export function Monetization() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Monetization</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Revenue tracking and monetization analytics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <p className="text-sm text-slate-500">Total Revenue</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">$156,750</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-slate-500">Monthly Growth</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">+12.5%</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-purple-500" />
            <p className="text-sm text-slate-500">Active Campaigns</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">8</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-amber-500" />
            <p className="text-sm text-slate-500">Pending Payout</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">$2,500</p>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monetization Sources</h2>
        <div className="space-y-3">
          {[
            { name: 'Sponsorship', amount: '$75,000', percentage: 48, color: 'bg-blue-500' },
            { name: 'Ticket Sales', amount: '$45,000', percentage: 29, color: 'bg-green-500' },
            { name: 'Merchandise', amount: '$25,000', percentage: 16, color: 'bg-purple-500' },
            { name: 'Other', amount: '$11,750', percentage: 7, color: 'bg-amber-500' },
          ].map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>
                <span className="text-slate-500">{item.amount} ({item.percentage}%)</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export default Monetization;