import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Eye } from 'lucide-react';
import type { AuctionPlayer } from '../types';
import { roleConfig, statusConfig, formatPrice, getTeamById } from '../services/mock-data';
import { cn } from '../../../lib/utils';

interface PlayerCardProps {
  player: AuctionPlayer;
  index: number;
  onClick?: () => void;
  compact?: boolean;
}

export function PlayerCard({ player, index, onClick, compact }: PlayerCardProps) {
  const role = roleConfig[player.role];
  const status = statusConfig[player.status];
  const soldTeam = player.soldTo ? getTeamById(player.soldTo) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 shadow-lg overflow-hidden cursor-pointer transition-shadow hover:shadow-xl"
    >
      {/* Top accent bar */}
      <div className="h-1" style={{ backgroundColor: role.color }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <img src={player.photoUrl} alt={player.name} className="w-14 h-14 rounded-xl object-cover" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-[8px] font-bold border border-slate-200 dark:border-slate-700">
              {player.countryFlag}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{player.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn('px-1.5 py-0.5 text-[10px] font-medium rounded', role.bg)}>{player.role}</span>
              <span className="text-[10px] text-slate-400">{player.age}y</span>
            </div>
          </div>
          <span className={cn('px-2 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0', status.bg)}>
            {status.label}
          </span>
        </div>

        {/* Stats */}
        {!compact && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
              <p className="text-[9px] text-slate-400 uppercase">Matches</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{player.matches}</p>
            </div>
            {player.runs !== undefined && (
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
                <p className="text-[9px] text-slate-400 uppercase">Runs</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{player.runs.toLocaleString()}</p>
              </div>
            )}
            {player.wickets !== undefined && (
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
                <p className="text-[9px] text-slate-400 uppercase">Wkts</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{player.wickets}</p>
              </div>
            )}
            {player.avg !== undefined && (
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
                <p className="text-[9px] text-slate-400 uppercase">Avg</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{player.avg}</p>
              </div>
            )}
            {player.economy !== undefined && (
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
                <p className="text-[9px] text-slate-400 uppercase">Econ</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{player.economy}</p>
              </div>
            )}
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
              <p className="text-[9px] text-slate-400 uppercase flex items-center justify-center gap-0.5"><Star className="w-2.5 h-2.5" /> Rating</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{player.rating}</p>
            </div>
          </div>
        )}

        {/* Specialization tags */}
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          {player.specialization.slice(0, 3).map(spec => (
            <span key={spec} className="px-1.5 py-0.5 text-[9px] rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {spec}
            </span>
          ))}
        </div>

        {/* Price section */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {player.status === 'sold' && soldTeam ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={soldTeam.logoUrl} alt={soldTeam.name} className="w-6 h-6 rounded object-cover" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{soldTeam.shortName}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400">Sold For</p>
                <p className="text-sm font-bold text-green-500">{formatPrice(player.soldPrice!)}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400">Base Price</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{formatPrice(player.basePrice)}</p>
              </div>
              {player.teamInterest.length > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Eye className="w-3 h-3" />
                  <span>{player.teamInterest.length} teams interested</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
