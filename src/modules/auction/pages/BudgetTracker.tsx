import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingDown, PieChart, Users } from 'lucide-react';
import { GlassCard, KPIWidget } from '../../../components/ui/GlassCard';
import { BarChart, DonutChart } from '../../../components/ui/Charts';
import { chartColors } from '../../../lib/mock-data';
import {
  auctionTeams,
  auctionPlayers,
  budgetBreakdown,
  budgetUtilizationData,
  formatPrice,
  getPlayersByTeam,
  roleConfig,
} from '../services/mock-data';
import { cn } from '../../../lib/utils';

export function BudgetTracker() {
  const totalBudget = auctionTeams.reduce((s, t) => s + t.budget, 0);
  const totalSpent = auctionTeams.reduce((s, t) => s + t.budgetSpent, 0);
  const totalRemaining = totalBudget - totalSpent;

  // Aggregate category spending across all teams
  const aggregateCategory = budgetBreakdown.reduce(
    (acc, b) => {
      acc.batsman += b.categoryBreakdown.batsman;
      acc.bowler += b.categoryBreakdown.bowler;
      acc.allRounder += b.categoryBreakdown.allRounder;
      acc.wicketKeeper += b.categoryBreakdown.wicketKeeper;
      return acc;
    },
    { batsman: 0, bowler: 0, allRounder: 0, wicketKeeper: 0 }
  );

  const categoryData = [
    { name: 'Batsman', value: Math.round(aggregateCategory.batsman / 10000000), color: chartColors.primary },
    { name: 'Bowler', value: Math.round(aggregateCategory.bowler / 10000000), color: chartColors.cyan },
    { name: 'All-rounder', value: Math.round(aggregateCategory.allRounder / 10000000), color: chartColors.success },
    { name: 'Keeper', value: Math.round(aggregateCategory.wicketKeeper / 10000000), color: chartColors.warning },
  ];

  const remainingData = auctionTeams.map(t => ({
    name: t.shortName,
    value: Math.round((t.budget - t.budgetSpent) / 10000000),
    color: t.primaryColor,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Budget Tracker</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Team budgets and spending analysis</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Total Budget" value={`₹${(totalBudget / 10000000).toFixed(0)} Cr`} icon={<Wallet className="w-6 h-6" />} color={chartColors.primary} delay={0} />
        <KPIWidget title="Total Spent" value={`₹${(totalSpent / 10000000).toFixed(0)} Cr`} icon={<TrendingDown className="w-6 h-6" />} color={chartColors.error} delay={1} />
        <KPIWidget title="Remaining" value={`₹${(totalRemaining / 10000000).toFixed(0)} Cr`} icon={<Wallet className="w-6 h-6" />} color={chartColors.success} delay={2} />
        <KPIWidget title="Avg Utilization" value={`${Math.round((totalSpent / totalBudget) * 100)}%`} icon={<PieChart className="w-6 h-6" />} color={chartColors.warning} delay={3} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Budget Remaining by Team (Cr)</h3>
          <BarChart data={remainingData} height={260} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Category-wise Spending (Cr)</h3>
          <DonutChart data={categoryData} height={260} />
        </GlassCard>
      </div>

      {/* Budget utilization */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Budget Utilization</h3>
        <div className="space-y-3">
          {budgetBreakdown.map((b, i) => {
            const team = auctionTeams.find(t => t.id === b.teamId)!;
            return (
              <motion.div
                key={b.teamId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img src={team.logoUrl} alt={team.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{team.name}</p>
                    <p className="text-xs text-slate-500">{team.filledSlots}/{team.maxSlots} slots • {team.overseasCount} overseas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{formatPrice(b.remaining)}</p>
                    <p className="text-[10px] text-slate-400">remaining</p>
                  </div>
                </div>

                {/* Budget bar */}
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${b.purseUtilization}%` }}
                    transition={{ duration: 0.8, delay: i * 0.04, ease: 'easeOut' }}
                    className="h-full rounded-full flex items-center justify-end pr-2"
                    style={{ backgroundColor: team.primaryColor }}
                  >
                    <span className="text-[10px] font-bold text-white">{b.purseUtilization}%</span>
                  </motion.div>
                </div>

                {/* Category breakdown */}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {([
                    { label: 'Batsman', value: b.categoryBreakdown.batsman, key: 'Batsman' },
                    { label: 'Bowler', value: b.categoryBreakdown.bowler, key: 'Bowler' },
                    { label: 'AR', value: b.categoryBreakdown.allRounder, key: 'All-rounder' },
                    { label: 'Keeper', value: b.categoryBreakdown.wicketKeeper, key: 'Wicket-keeper' },
                  ]).map(cat => (
                    <div key={cat.key} className="text-center p-1.5 rounded-lg bg-white dark:bg-slate-900/50">
                      <p className="text-[9px] text-slate-400 uppercase">{cat.label}</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{cat.value > 0 ? `₹${(cat.value / 10000000).toFixed(1)}Cr` : '-'}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      {/* Players won by each team */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Players Won by Team</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {auctionTeams.filter(t => t.filledSlots > 0).map((team, i) => {
            const players = getPlayersByTeam(team.id);
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <img src={team.logoUrl} alt={team.name} className="w-7 h-7 rounded-lg object-cover" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{team.shortName}</p>
                  <span className="text-xs text-slate-400 ml-auto">{players.length} players</span>
                </div>
                <div className="space-y-1.5">
                  {players.map(p => {
                    const role = roleConfig[p.role];
                    return (
                      <div key={p.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-900/50">
                        <img src={p.photoUrl} alt={p.name} className="w-6 h-6 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{p.name}</p>
                          <span className={cn('text-[9px]', role.bg)}>{p.role}</span>
                        </div>
                        <span className="text-xs font-bold text-green-500">{formatPrice(p.soldPrice!)}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

export default BudgetTracker;
