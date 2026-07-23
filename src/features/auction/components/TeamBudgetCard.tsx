import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Users, Globe } from 'lucide-react';
import type { AuctionTeam } from '../types';
import { formatPrice } from '../services/mock-data';
import { cn } from '../../../lib/utils';

interface TeamBudgetCardProps {
  team: AuctionTeam;
  index: number;
  highlight?: boolean;
  onBid?: () => void;
  canBid?: boolean;
}

export function TeamBudgetCard({ team, index, highlight, onBid, canBid }: TeamBudgetCardProps) {
  const remaining = team.budget - team.budgetSpent;
  const utilizationPct = Math.round((team.budgetSpent / team.budget) * 100);
  const slotsRemaining = team.maxSlots - team.filledSlots;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -4 }}
      className={cn(
        'rounded-2xl bg-white dark:bg-slate-900 border shadow-lg overflow-hidden transition-all',
        highlight
          ? 'border-2 ring-2 ring-offset-2 dark:ring-offset-slate-900'
          : 'border-slate-200/60 dark:border-slate-700/50'
      )}
      style={highlight ? { borderColor: team.primaryColor, '--tw-ring-color': team.primaryColor } as React.CSSProperties : {}}
    >
      <div className="h-1" style={{ backgroundColor: team.primaryColor }} />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <img src={team.logoUrl} alt={team.name} className="w-9 h-9 rounded-lg object-cover" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{team.name}</h4>
            <p className="text-[10px] text-slate-400">{team.shortName}</p>
          </div>
        </div>

        {/* Budget bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1 text-slate-500"><Wallet className="w-3 h-3" /> Budget</span>
            <span className="font-bold text-slate-900 dark:text-white">{formatPrice(remaining)}</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${utilizationPct}%` }}
              transition={{ duration: 0.8, delay: index * 0.04, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: team.primaryColor }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
            <span>Spent: {formatPrice(team.budgetSpent)}</span>
            <span>{utilizationPct}% used</span>
          </div>
        </div>

        {/* Slots */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
            <Users className="w-3.5 h-3.5 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{team.filledSlots}/{team.maxSlots}</p>
            <p className="text-[9px] text-slate-400">Slots</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{team.overseasCount}/{team.maxOverseas}</p>
            <p className="text-[9px] text-slate-400">Overseas</p>
          </div>
        </div>

        {/* Bid button */}
        {onBid && (
          <button
            onClick={onBid}
            disabled={!canBid}
            className={cn(
              'w-full mt-3 py-2 rounded-xl text-sm font-bold transition-all',
              canBid
                ? 'text-white shadow-md hover:shadow-lg active:scale-95'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            )}
            style={canBid ? { backgroundColor: team.primaryColor } : {}}
          >
            {canBid ? 'Place Bid' : 'Insufficient Budget'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
