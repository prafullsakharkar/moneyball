import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuctionTimerProps {
  seconds: number;
  maxSeconds?: number;
  phase?: 'live' | 'warning' | 'final' | 'sold' | 'unsold';
}

export function AuctionTimer({ seconds, maxSeconds = 30, phase = 'live' }: AuctionTimerProps) {
  const pct = Math.max(0, Math.min(100, (seconds / maxSeconds) * 100));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const color = phase === 'final' ? '#ef4444' : phase === 'warning' ? '#f59e0b' : phase === 'sold' ? '#22c55e' : phase === 'unsold' ? '#ef4444' : '#6366f1';

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-200 dark:text-slate-800" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="text-center">
        <motion.p
          key={seconds}
          initial={{ scale: 1.3, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-3xl font-bold"
          style={{ color }}
        >
          {seconds}
        </motion.p>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider">seconds</p>
      </div>
    </div>
  );
}

interface HammerAnimationProps {
  show: boolean;
  type: 'sold' | 'unsold';
  player?: string;
  team?: string;
  price?: number;
}

export function HammerAnimation({ show, type, player, team, price }: HammerAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative"
          >
            {/* Hammer */}
            <motion.div
              initial={{ y: -100, rotate: -30 }}
              animate={{ y: [0, -80, 0], rotate: [0, -30, 0, 30, 0] }}
              transition={{ duration: 0.6, times: [0, 0.3, 0.5, 0.7, 1] }}
              className="text-8xl"
            >
              🔨
            </motion.div>

            {/* Result banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={type === 'sold' ? 'mt-4 px-8 py-4 rounded-2xl bg-green-500 text-white text-center shadow-2xl' : 'mt-4 px-8 py-4 rounded-2xl bg-red-500 text-white text-center shadow-2xl'}
            >
              <p className="text-3xl font-black uppercase tracking-wider">{type === 'sold' ? 'SOLD!' : 'UNSOLD'}</p>
              {player && <p className="text-lg font-bold mt-1">{player}</p>}
              {type === 'sold' && team && (
                <p className="text-sm mt-1 opacity-90">{team} • {price && `₹${(price / 10000000).toFixed(1)} Cr`}</p>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
