import React from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { chartColors } from '../../../lib/mock-data';
import {
  auctionPlayers,
  roleConfig,
  statusConfig,
} from '../services/mock-data';
import { PlayerCard } from '../components';
import type { PlayerRole, PlayerStatus, Country } from '../types';
import { cn } from '../../../lib/utils';

const allRoles: (PlayerRole | 'all')[] = ['all', 'Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];
const allStatuses: (PlayerStatus | 'all')[] = ['all', 'available', 'sold', 'unsold'];
const allCountries: (Country | 'all')[] = ['all', 'India', 'Australia', 'England', 'South Africa', 'New Zealand', 'West Indies', 'Pakistan', 'Sri Lanka', 'Bangladesh', 'Afghanistan'];

const priceRanges = [
  { label: 'All', min: 0, max: Infinity },
  { label: '< 50L', min: 0, max: 5000000 },
  { label: '50L-1Cr', min: 5000000, max: 10000000 },
  { label: '1-1.5Cr', min: 10000000, max: 15000000 },
  { label: '> 1.5Cr', min: 15000000, max: Infinity },
];

export function PlayerPool() {
  const [search, setSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<PlayerRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = React.useState<PlayerStatus | 'all'>('all');
  const [countryFilter, setCountryFilter] = React.useState<Country | 'all'>('all');
  const [priceRange, setPriceRange] = React.useState(0);
  const [minRating, setMinRating] = React.useState(0);

  const filtered = auctionPlayers.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== 'all' && p.role !== roleFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (countryFilter !== 'all' && p.country !== countryFilter) return false;
    const range = priceRanges[priceRange];
    if (p.basePrice < range.min || p.basePrice >= range.max) return false;
    if (p.rating < minRating) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Player Pool</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{filtered.length} players available</p>
      </div>

      {/* Filters */}
      <GlassCard className="!p-4">
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search players..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Role filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex-wrap">
            {allRoles.map(opt => (
              <button
                key={opt}
                onClick={() => setRoleFilter(opt)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  roleFilter === opt ? 'bg-white dark:bg-slate-700 text-primary-500 shadow' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {opt === 'all' ? 'All Roles' : opt}
              </button>
            ))}
          </div>

          {/* Status + Country + Price + Rating */}
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as PlayerStatus | 'all')}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {allStatuses.map(opt => (
                <option key={opt} value={opt}>{opt === 'all' ? 'All Status' : statusConfig[opt as PlayerStatus]?.label}</option>
              ))}
            </select>

            <select
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value as Country | 'all')}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {allCountries.map(opt => (
                <option key={opt} value={opt}>{opt === 'all' ? 'All Countries' : opt}</option>
              ))}
            </select>

            <select
              value={priceRange}
              onChange={e => setPriceRange(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {priceRanges.map((range, i) => (
                <option key={i} value={i}>{range.label === 'All' ? 'All Prices' : range.label}</option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Min Rating:</span>
              <div className="flex items-center gap-1">
                {[0, 7, 8, 9].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={cn(
                      'px-2 py-1 rounded-lg text-xs font-medium transition-colors',
                      minRating === r ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                    )}
                  >
                    {r === 0 ? 'All' : `${r}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Player grid */}
      {filtered.length === 0 ? (
        <GlassCard>
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No players match your filters</p>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((player, i) => (
            <PlayerCard key={player.id} player={player} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PlayerPool;
