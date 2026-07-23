import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, CheckCircle2, XCircle, Wallet, TrendingUp, Gavel,
  Trophy, ChevronRight, Award,
} from 'lucide-react';
import { GlassCard, KPIWidget } from '../../../components/ui/GlassCard';
import { BarChart, DonutChart } from '../../../components/ui/Charts';
import { chartColors } from '../../../lib/mock-data';
import {
  auctionDashboardMetrics,
  auctionTeams,
  auctionPlayers,
  soldByRoleData,
  budgetUtilizationData,
  topBidsData,
  auctionProgressData,
  formatPrice,
  getTeamById,
} from '../services/mock-data';
import { PlayerCard } from '../components';
import { cn } from '../../../lib/utils';

export function AuctionDashboard() {
  const { totalBudget, totalSpent } = auctionDashboardMetrics;
  const remainingBudget = totalBudget - totalSpent;
  const topSold = [...auctionPlayers].filter(p => p.status === 'sold').sort((a, b) => (b.soldPrice || 0) - (a.soldPrice || 0)).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Auction Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Live auction overview and statistics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium">Auction Live</span>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPIWidget title="Available" value={auctionDashboardMetrics.availablePlayers} icon={<Users className="w-6 h-6" />} color={chartColors.primary} delay={0} />
        <KPIWidget title="Sold" value={auctionDashboardMetrics.soldPlayers} icon={<CheckCircle2 className="w-6 h-6" />} color={chartColors.success} delay={1} />
        <KPIWidget title="Unsold" value={auctionDashboardMetrics.unsoldPlayers} icon={<XCircle className="w-6 h-6" />} color={chartColors.error} delay={2} />
        <KPIWidget title="Budget Left" value={`₹${(remainingBudget / 10000000).toFixed(0)} Cr`} icon={<Wallet className="w-6 h-6" />} color={chartColors.cyan} delay={3} />
        <KPIWidget title="Highest Bid" value={`₹${(auctionDashboardMetrics.highestBid / 10000000).toFixed(1)} Cr`} icon={<TrendingUp className="w-6 h-6" />} color={chartColors.warning} delay={4} />
        <KPIWidget title="Avg Price" value={`₹${(auctionDashboardMetrics.avgSoldPrice / 10000000).toFixed(1)} Cr`} icon={<Gavel className="w-6 h-6" />} color={chartColors.purple} delay={5} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Auction Progress</h3>
          <DonutChart data={auctionProgressData} height={240} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Sold by Role</h3>
          <DonutChart data={soldByRoleData} height={240} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Bids (Cr)</h3>
          <BarChart data={topBidsData} height={240} />
        </GlassCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Budget Utilization by Team</h3>
          <BarChart data={budgetUtilizationData} height={260} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Highest Bid</h3>
          <div className="flex flex-col items-center justify-center py-6">
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center mb-3"
            >
              <Trophy className="w-8 h-8 text-amber-500" />
            </motion.div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{formatPrice(auctionDashboardMetrics.highestBid)}</p>
            <p className="text-sm text-slate-500 mt-1">{auctionDashboardMetrics.highestBidPlayer}</p>
            <p className="text-xs text-slate-400 mt-0.5">{auctionDashboardMetrics.highestBidTeam}</p>
          </div>
        </GlassCard>
      </div>

      {/* Top sold players */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Sold Players</h3>
          <Award className="w-5 h-5 text-amber-400" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topSold.map((player, i) => (
            <PlayerCard key={player.id} player={player} index={i} compact />
          ))}
        </div>
      </GlassCard>

      {/* Team standings */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Team Standings</h3>
        <div className="space-y-2">
          {[...auctionTeams].sort((a, b) => b.budgetSpent - a.budgetSpent).map((team, i) => {
            const utilization = Math.round((team.budgetSpent / team.budget) * 100);
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="text-sm font-bold text-slate-400 w-6">{i + 1}</span>
                <img src={team.logoUrl} alt={team.name} className="w-8 h-8 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{team.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-500">{team.filledSlots} players</span>
                    <span className="text-xs text-slate-500">{team.overseasCount} overseas</span>
                  </div>
                </div>
                <div className="hidden sm:block w-32">
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${utilization}%`, backgroundColor: team.primaryColor }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{formatPrice(team.budgetSpent)}</p>
                  <p className="text-[10px] text-slate-400">{formatPrice(team.budget - team.budgetSpent)} left</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

export default AuctionDashboard;
