import React from 'react';
import { motion } from 'framer-motion';
import { User, Target, TrendingUp, Zap, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { RadarChart, AreaChart } from '../components/ui/Charts';
import { cn, getInitials } from '../lib/utils';
import { usePlayers, usePlayer } from '../hooks/usePlayers';
import { useNavigate } from 'react-router-dom';
import { chartColors, generateChartData } from '../lib/mock-data';

// Type definitions matching the mock data structure
interface PlayerData {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  nationality: string;
  batting_style: string;
  bowling_style?: string;
  player_type: string;
  matches?: number;
  runs?: number;
  wickets?: number;
  average?: number;
}

function formatPlayerType(type: string) {
  const typeMap: Record<string, string> = {
    batsman: 'Batsman',
    bowler: 'Bowler',
    'all-rounder': 'All-rounder',
    'wicket-keeper': 'Wicket-keeper',
  };
  return typeMap[type.toLowerCase()] || type;
}

export function PlayerList() {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(12);

  // Use React Query hook to fetch players
  const { data: playersData, isLoading, error } = usePlayers({
    page,
    limit,
    search: search || '',
  });
  
  // Filter players by type client-side
  const filteredByType = React.useMemo(() => {
    if (typeFilter === 'all') return playersData?.data || [];
    return (playersData?.data || []).filter(p => p.player_type.toLowerCase() === typeFilter);
  }, [playersData?.data, typeFilter]);

  const filteredPlayers = filteredByType;
  const totalPages = playersData?.totalPages || 1;

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-error-600">Error loading players</h3>
          <p className="text-slate-500 mt-2">{error instanceof Error ? error.message : 'Please try again'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Players</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Explore player profiles and performance</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search players..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-4 py-2 w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'batsman', 'bowler', 'all-rounder', 'wicket-keeper'].map((type) => (
          <button
            key={type}
            onClick={() => {
              setTypeFilter(type);
              setPage(1);
            }}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              typeFilter === type
                ? 'bg-primary-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/players/${player.id}`)}
                className="cursor-pointer"
              >
                <GlassCard hover gradient className="cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                      {getInitials(player.full_name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white">{player.full_name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{player.nationality}</p>
                      <span className={cn(
                        'inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium',
                        player.player_type === 'Batsman' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' :
                        player.player_type === 'Bowler' ? 'bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400' :
                        'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400'
                      )}>
                        {formatPlayerType(player.player_type)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/30">
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{player.runs || 500 + Math.floor(Math.random() * 300)}</p>
                      <p className="text-xs text-slate-500">Runs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{player.wickets || Math.floor(Math.random() * 25)}</p>
                      <p className="text-xs text-slate-500">Wickets</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{player.average || (30 + Math.random() * 20).toFixed(1)}</p>
                      <p className="text-xs text-slate-500">Avg</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                  page === 1
                    ? 'text-slate-400 cursor-not-allowed'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                  page === totalPages
                    ? 'text-slate-400 cursor-not-allowed'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function PlayerProfile({ id }: { id: string }) {
  const { data: player, isLoading, error } = usePlayer(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-error-600">Player not found</h3>
        </div>
      </div>
    );
  }

  const currentPlayer = player;

  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-3xl">
            {getInitials(currentPlayer.full_name)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{currentPlayer.full_name}</h1>
              <span className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-sm">{currentPlayer.player_type}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2">
              <span>{currentPlayer.nationality}</span>
              <span>|</span>
              <span>Batting: {currentPlayer.batting_style}</span>
              {currentPlayer.bowling_style && <><span>|</span><span>Bowling: {currentPlayer.bowling_style}</span></>}
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="flex gap-2">
        {['Batting', 'Bowling', 'Fielding'].map(tab => (
          <button
            key={tab}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              tab === 'Batting' ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Matches" value={14} icon={<User className="w-6 h-6" />} color={chartColors.primary} />
        <KPIWidget title="Runs" value={784} icon={<TrendingUp className="w-6 h-6" />} color={chartColors.success} />
        <KPIWidget title="Average" value={45.6} icon={<Target className="w-6 h-6" />} color={chartColors.cyan} />
        <KPIWidget title="Strike Rate" value={148.2} icon={<Zap className="w-6 h-6" />} color={chartColors.warning} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Career Trend</h3>
          <AreaChart data={generateChartData().map((d, i) => ({ x: 2018 + i, y: d.value }))} color={chartColors.primary} height={250} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance Radar</h3>
          <RadarChart categories={['Batting', 'Bowling', 'Fielding', 'Consistency', 'Impact']} data={[85, 60, 90, 72, 78]} color={chartColors.cyan} />
        </GlassCard>
      </div>
    </div>
  );
}

export default PlayerList;
