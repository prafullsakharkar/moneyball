import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel } from 'lucide-react';
import type { BidEntry } from '../types';
import { formatPrice, getTeamById } from '../services/mock-data';

interface BidHistoryProps {
  bids: BidEntry[];
  maxDisplay?: number;
}

export function BidHistory({ bids, maxDisplay = 10 }: BidHistoryProps) {
  const displayBids = bids.slice(-maxDisplay).reverse();

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {displayBids.map((bid, i) => {
          const team = getTeamById(bid.teamId);
          return (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${team?.primaryColor}20` }}>
                <Gavel className="w-3.5 h-3.5" style={{ color: team?.primaryColor }} />
              </div>
              <img src={team?.logoUrl} alt={team?.name} className="w-6 h-6 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{team?.name}</p>
                <p className="text-[10px] text-slate-400">{bid.timestamp}</p>
              </div>
              <p className="text-sm font-bold text-green-500">{formatPrice(bid.amount)}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {displayBids.length === 0 && (
        <div className="text-center py-6">
          <Gavel className="w-8 h-8 text-slate-300 mx-auto mb-1" />
          <p className="text-xs text-slate-400">No bids yet</p>
        </div>
      )}
    </div>
  );
}
