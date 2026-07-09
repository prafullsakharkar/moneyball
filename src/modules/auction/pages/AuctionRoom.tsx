import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gavel, Pause, Play, SkipForward, TrendingUp, Star, Trophy,
  Flag, Activity, Zap,
} from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { chartColors } from '../../../lib/mock-data';
import {
  auctionPlayers,
  auctionTeams,
  mockBidHistory,
  formatPrice,
  getTeamById,
  roleConfig,
} from '../services/mock-data';
import { TeamBudgetCard, BidHistory, AuctionTimer, HammerAnimation } from '../components';
import type { BidEntry, AuctionPlayer } from '../types';
import { cn } from '../../../lib/utils';

const BID_INCREMENT = 500000; // 50 Lakh

export function AuctionRoom() {
  const availablePlayers = auctionPlayers.filter(p => p.status === 'available');
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [seconds, setSeconds] = React.useState(30);
  const [isRunning, setIsRunning] = React.useState(true);
  const [bids, setBids] = React.useState<BidEntry[]>(mockBidHistory);
  const [currentBid, setCurrentBid] = React.useState(0);
  const [currentBidder, setCurrentBidder] = React.useState<string | undefined>(undefined);
  const [hammerShow, setHammerShow] = React.useState(false);
  const [hammerType, setHammerType] = React.useState<'sold' | 'unsold'>('sold');
  const [soldPlayers, setSoldPlayers] = React.useState<Record<string, { teamId: string; price: number }>>({});
  const [highlightTeam, setHighlightTeam] = React.useState<string | undefined>(undefined);

  const currentPlayer: AuctionPlayer | undefined = availablePlayers[currentIdx];

  // Initialize bid for current player
  React.useEffect(() => {
    if (currentPlayer) {
      setCurrentBid(currentPlayer.basePrice);
      setCurrentBidder(undefined);
      setSeconds(30);
      setIsRunning(true);
    }
  }, [currentIdx]);

  // Timer
  React.useEffect(() => {
    if (!isRunning || !currentPlayer) return;
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, currentIdx]);

  const timerPhase = seconds <= 5 ? 'final' : seconds <= 10 ? 'warning' : 'live';

  function handleTimerEnd() {
    if (currentBidder) {
      // Sold
      setHammerType('sold');
      setHammerShow(true);
      setSoldPlayers(prev => ({
        ...prev,
        [currentPlayer!.id]: { teamId: currentBidder!, price: currentBid },
      }));
    } else {
      // Unsold
      setHammerType('unsold');
      setHammerShow(true);
    }
    setIsRunning(false);
    setTimeout(() => {
      setHammerShow(false);
      setCurrentIdx(prev => prev + 1);
    }, 3000);
  }

  function handleBid(teamId: string) {
    if (!currentPlayer || !isRunning) return;
    const team = getTeamById(teamId);
    if (!team) return;
    const newBid = currentBid + BID_INCREMENT;
    if (newBid > team.budget - team.budgetSpent) return;

    setCurrentBid(newBid);
    setCurrentBidder(teamId);
    setHighlightTeam(teamId);
    setSeconds(prev => Math.max(prev, 10)); // Reset timer to 10s on bid
    setBids(prev => [
      ...prev,
      {
        id: `bid-${Date.now()}`,
        playerId: currentPlayer.id,
        teamId,
        teamName: team.shortName,
        amount: newBid,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      },
    ]);
    setTimeout(() => setHighlightTeam(undefined), 1000);
  }

  function handleSkip() {
    setHammerType('unsold');
    setHammerShow(true);
    setIsRunning(false);
    setTimeout(() => {
      setHammerShow(false);
      setCurrentIdx(prev => prev + 1);
    }, 3000);
  }

  if (!currentPlayer || currentIdx >= availablePlayers.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <GlassCard className="text-center max-w-md">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Auction Complete</h2>
          <p className="text-slate-500 mt-2">All players have been auctioned.</p>
          <button
            onClick={() => { setCurrentIdx(0); setSoldPlayers({}); setBids(mockBidHistory); }}
            className="mt-4 px-6 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            Restart Auction
          </button>
        </GlassCard>
      </div>
    );
  }

  const role = roleConfig[currentPlayer.role];
  const playerBids = bids.filter(b => b.playerId === currentPlayer.id);
  const currentBidTeam = currentBidder ? getTeamById(currentBidder) : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Auction Room</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Player {currentIdx + 1} of {availablePlayers.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-500/25 transition-colors"
          >
            <SkipForward className="w-4 h-4" /> Mark Unsold
          </button>
        </div>
      </div>

      {/* Main auction layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Player — Large */}
        <div className="lg:col-span-2">
          <GlassCard gradient className="!p-0 overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-primary-500/20 via-cyan-500/15 to-slate-500/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.img
                  key={currentPlayer.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  src={currentPlayer.photoUrl}
                  alt={currentPlayer.name}
                  className="w-32 h-32 rounded-2xl object-cover shadow-2xl border-4 border-white dark:border-slate-800"
                />
              </div>
              <div className="absolute top-4 left-4">
                <span className={cn('px-3 py-1 text-xs font-bold rounded-full', role.bg)}>{currentPlayer.role}</span>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                <span className="text-xs font-bold">{currentPlayer.rating}</span>
              </div>
            </div>

            <div className="p-6">
              {/* Name & country */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{currentPlayer.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-slate-500">{currentPlayer.country}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-sm text-slate-500">Age {currentPlayer.age}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-sm text-slate-500">{currentPlayer.matches} matches</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase">Base Price</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{formatPrice(currentPlayer.basePrice)}</p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {currentPlayer.runs !== undefined && (
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
                    <p className="text-[10px] text-slate-400 uppercase">Runs</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{currentPlayer.runs.toLocaleString()}</p>
                  </div>
                )}
                {currentPlayer.wickets !== undefined && (
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
                    <p className="text-[10px] text-slate-400 uppercase">Wickets</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{currentPlayer.wickets}</p>
                  </div>
                )}
                {currentPlayer.avg !== undefined && (
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
                    <p className="text-[10px] text-slate-400 uppercase">Average</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{currentPlayer.avg}</p>
                  </div>
                )}
                {currentPlayer.economy !== undefined && (
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
                    <p className="text-[10px] text-slate-400 uppercase">Economy</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{currentPlayer.economy}</p>
                  </div>
                )}
                {currentPlayer.strikeRate !== undefined && (
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
                    <p className="text-[10px] text-slate-400 uppercase">Strike Rate</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{currentPlayer.strikeRate}</p>
                  </div>
                )}
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
                  <p className="text-[10px] text-slate-400 uppercase">Best</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{currentPlayer.best}</p>
                </div>
              </div>

              {/* Specialization */}
              <div className="flex items-center gap-1.5 flex-wrap mb-4">
                {currentPlayer.specialization.map(spec => (
                  <span key={spec} className="px-2 py-1 text-xs rounded-lg bg-primary-500/10 text-primary-500">
                    {spec}
                  </span>
                ))}
              </div>

              {/* Current bid + Timer */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30">
                <div>
                  <p className="text-xs text-slate-400 uppercase mb-1">Current Bid</p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentBid}
                      initial={{ scale: 1.3, opacity: 0.5, color: '#22c55e' }}
                      animate={{ scale: 1, opacity: 1, color: '#1e293b' }}
                      transition={{ duration: 0.3 }}
                      className="text-3xl font-black text-slate-900 dark:text-white"
                    >
                      {formatPrice(currentBid)}
                    </motion.p>
                  </AnimatePresence>
                  {currentBidTeam && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <img src={currentBidTeam.logoUrl} alt={currentBidTeam.name} className="w-4 h-4 rounded object-cover" />
                      <span className="text-xs font-medium" style={{ color: currentBidTeam.primaryColor }}>{currentBidTeam.name}</span>
                    </div>
                  )}
                </div>
                <AuctionTimer seconds={seconds} maxSeconds={30} phase={timerPhase} />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Bid History */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Gavel className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Bid History</h3>
          </div>
          <BidHistory bids={playerBids} maxDisplay={8} />
        </GlassCard>
      </div>

      {/* Teams grid */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Teams — Click to Bid</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {auctionTeams.map((team, i) => {
            const remaining = team.budget - team.budgetSpent - (currentBidder === team.id ? currentBid : 0);
            const canBid = remaining >= currentBid + BID_INCREMENT && isRunning;
            const isCurrentBidder = currentBidder === team.id;
            return (
              <div key={team.id} className={cn(isCurrentBidder && 'ring-2 ring-offset-2 dark:ring-offset-slate-900 rounded-2xl')} style={isCurrentBidder ? { '--tw-ring-color': team.primaryColor } as React.CSSProperties : {}}>
                <TeamBudgetCard
                  team={{ ...team, budgetSpent: team.budgetSpent + (soldPlayers[currentPlayer.id]?.teamId === team.id ? soldPlayers[currentPlayer.id].price : 0) }}
                  index={i}
                  highlight={highlightTeam === team.id}
                  onBid={() => handleBid(team.id)}
                  canBid={canBid}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Hammer animation overlay */}
      <HammerAnimation
        show={hammerShow}
        type={hammerType}
        player={currentPlayer.name}
        team={hammerType === 'sold' && currentBidder ? getTeamById(currentBidder)?.name : undefined}
        price={hammerType === 'sold' ? currentBid : undefined}
      />
    </div>
  );
}

export default AuctionRoom;
