import React from 'react';
import { motion } from 'framer-motion';
import {
  Play, Pause, RotateCcw, ChevronDown, X, Plus, Minus,
  Target, Activity, Users, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface Ball {
  ball_number: number;
  over: number;
  ball_in_over: number;
  batsman: string;
  bowler: string;
  runs: number;
  extras: number;
  extra_type?: 'wide' | 'no_ball' | 'bye' | 'leg_bye';
  wicket?: boolean;
  wicket_type?: string;
  dismissed_player?: string;
  commentary: string;
}

const currentMatch = {
  match_id: 'M45',
  match_name: 'Chennai Super Kings vs Mumbai Indians',
  tournament: 'IPL 2024',
  venue: 'M.A. Chidambaram Stadium, Chennai',
  status: 'live',
  current_innings: 2,
  batting_team: 'Mumbai Indians',
  bowling_team: 'Chennai Super Kings',
  target: 166,
  score: { runs: 142, wickets: 5, overs: 16.2 },
  run_rate: 8.7,
  required_rate: 12.5,
  batsmen: [
    { name: 'Tilak Varma', runs: 45, balls: 28, fours: 4, sixes: 2, on_strike: true },
    { name: 'Tim David', runs: 18, balls: 12, fours: 1, sixes: 1, on_strike: false },
  ],
  bowler: { name: 'Ravindra Jadeja', overs: 3.2, wickets: 1, runs: 24, economy: 7.5 },
  recentBalls: [
    { ball: '16.1', result: '4', type: 'boundary' },
    { ball: '16.2', result: '1', type: 'single' },
  ],
};

const ballHistory: Ball[] = [
  { ball_number: 98, over: 16, ball_in_over: 2, batsman: 'Tilak Varma', bowler: 'Ravindra Jadeja', runs: 4, extras: 0, commentary: 'FOUR! Short ball pulled to deep midwicket' },
  { ball_number: 97, over: 16, ball_in_over: 2, batsman: 'Tilak Varma', bowler: 'Ravindra Jadeja', runs: 1, extras: 0, commentary: 'Singles to mid-off' },
  { ball_number: 96, over: 16, ball_in_over: 3, batsman: 'Tim David', bowler: 'Ravindra Jadeja', runs: 0, extras: 1, extra_type: 'wide', commentary: 'WIDE! Down leg side' },
  { ball_number: 95, over: 16, ball_in_over: 1, batsman: 'Tilak Varma', bowler: 'Ravindra Jadeja', runs: 1, extras: 0, commentary: 'Pushed to long-on for single' },
  { ball_number: 94, over: 15, ball_in_over: 6, batsman: 'Tim David', bowler: 'Maheesh Theekshana', runs: 6, extras: 0, commentary: 'SIX! Slog swept over deep midwicket' },
  { ball_number: 93, over: 15, ball_in_over: 5, batsman: 'Tim David', bowler: 'Maheesh Theekshana', runs: 2, extras: 0, commentary: 'Worked to deep midwicket' },
];

const getBallResultColor = (type: string) => {
  switch (type) {
    case 'boundary': return 'bg-success-100 text-success-600 border-success-300';
    case 'six': return 'bg-primary-100 text-primary-600 border-primary-300';
    case 'wicket': return 'bg-error-100 text-error-600 border-error-300';
    case 'wide':
    case 'no_ball': return 'bg-warning-100 text-warning-600 border-warning-300';
    case 'dot': return 'bg-slate-100 text-slate-600 border-slate-300';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

export function BallByBallScoring() {
  const [selectedRuns, setSelectedRuns] = React.useState<number>(0);
  const [showWicketModal, setShowWicketModal] = React.useState(false);
  const [showExtrasModal, setShowExtrasModal] = React.useState(false);
  const [commentary, setCommentary] = React.useState('');

  const runButtons = [
    { runs: 0, label: 'Dot', color: 'bg-slate-100 hover:bg-slate-200 text-slate-700' },
    { runs: 1, label: '1', color: 'bg-primary-100 hover:bg-primary-200 text-primary-700' },
    { runs: 2, label: '2', color: 'bg-primary-100 hover:bg-primary-200 text-primary-700' },
    { runs: 3, label: '3', color: 'bg-primary-100 hover:bg-primary-200 text-primary-700' },
    { runs: 4, label: '4', color: 'bg-success-100 hover:bg-success-200 text-success-700' },
    { runs: 6, label: '6', color: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Match Header */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">{currentMatch.tournament} • {currentMatch.venue}</p>
            <h1 className="text-2xl font-bold mt-1">{currentMatch.match_name}</h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-error-500 animate-pulse" />
            LIVE - Innings {currentMatch.current_innings}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Batting */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {currentMatch.batting_team}
              </h2>
              <div className="text-right">
                <p className="text-4xl font-bold text-slate-900 dark:text-white">
                  {currentMatch.score.runs}/{currentMatch.score.wickets}
                </p>
                <p className="text-sm text-slate-500">
                  ({currentMatch.score.overs} overs) • RR: {currentMatch.run_rate}
                </p>
              </div>
            </div>

            {/* Target Info */}
            <div className="p-3 rounded-lg bg-warning-50 dark:bg-warning-900/20 mb-4">
              <p className="text-sm text-warning-700 dark:text-warning-400">
                Target: {currentMatch.target} runs • Required Rate: {currentMatch.required_rate} RPO
              </p>
              <p className="text-xs text-warning-600 dark:text-warning-500 mt-1">
                Need {currentMatch.target - currentMatch.score.runs} runs from {(20 - Math.floor(currentMatch.score.overs)) * 6 + (6 - (currentMatch.score.overs % 1) * 10)} balls
              </p>
            </div>

            {/* Batsmen */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {currentMatch.batsmen.map((batsman) => (
                <div
                  key={batsman.name}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-colors',
                    batsman.on_strike
                      ? 'bg-success-50 dark:bg-success-900/20 border-success-300 dark:border-success-700'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-transparent'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white">{batsman.name}</p>
                        {batsman.on_strike && (
                          <span className="text-xs bg-success-500 text-white px-2 py-0.5 rounded">STRIKE</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{batsman.runs} ({batsman.balls})</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-slate-600 dark:text-slate-400">{batsman.fours} fours</p>
                      <p className="text-slate-600 dark:text-slate-400">{batsman.sixes} sixes</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Run Buttons */}
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Record Runs</p>
              <div className="grid grid-cols-6 gap-2 mb-3">
                {runButtons.map((btn) => (
                  <button
                    key={btn.runs}
                    onClick={() => setSelectedRuns(btn.runs)}
                    className={cn(
                      'py-4 rounded-xl font-bold text-xl transition-all',
                      btn.color,
                      selectedRuns === btn.runs && 'ring-2 ring-primary-500 ring-offset-2'
                    )}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Extra Actions */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setShowExtrasModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 font-medium text-sm hover:bg-warning-200"
                >
                  <Plus className="w-4 h-4" />
                  Extras
                </button>
                <button
                  onClick={() => setShowWicketModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 font-medium text-sm hover:bg-error-200"
                >
                  <AlertCircle className="w-4 h-4" />
                  Wicket
                </button>
              </div>

              {/* Commentary Input */}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Commentary</p>
                <input
                  type="text"
                  value={commentary}
                  onChange={(e) => setCommentary(e.target.value)}
                  placeholder="e.g., FOUR! Pulled to deep midwicket"
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Submit Button */}
              <button className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-bold text-lg hover:shadow-lg">
                Record Ball - {selectedRuns} Run{selectedRuns !== 1 ? 's' : ''}
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right Panel - Bowling & Ball History */}
        <div className="space-y-4">
          {/* Current Bowler */}
          <GlassCard>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Current Bowler</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                {currentMatch.bowler.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{currentMatch.bowler.name}</p>
                <p className="text-xs text-slate-500">{currentMatch.bowler.name.split(' ')[0]} • Right-arm break</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">{currentMatch.bowler.wickets}</p>
                <p className="text-xs text-slate-500">Wkts</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">{currentMatch.bowler.runs}</p>
                <p className="text-xs text-slate-500">Runs</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">{currentMatch.bowler.overs}</p>
                <p className="text-xs text-slate-500">Overs</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">{currentMatch.bowler.economy}</p>
                <p className="text-xs text-slate-500">Econ</p>
              </div>
            </div>
          </GlassCard>

          {/* This Over */}
          <GlassCard>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">This Over</h3>
            <div className="flex gap-2 mb-4">
              {['0', '1', '4', '2'].map((ball, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold border-2',
                    ball === '4' ? 'bg-success-100 text-success-600 border-success-300' :
                    ball === '0' ? 'bg-slate-100 text-slate-600 border-slate-300' :
                    'bg-primary-100 text-primary-600 border-primary-300'
                  )}
                >
                  {ball}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400">
                ?
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400">
                ?
              </div>
            </div>
            <p className="text-xs text-slate-500">Over 16 • 7 runs from this over</p>
          </GlassCard>

          {/* Ball-by-Ball History */}
          <GlassCard>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Recent Balls</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {ballHistory.map((ball) => (
                <div key={ball.ball_number} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">{ball.over}.{ball.ball_in_over}</span>
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-bold',
                      ball.runs === 0 ? 'bg-slate-100 text-slate-600' :
                      ball.runs === 4 ? 'bg-success-100 text-success-600' :
                      ball.runs === 6 ? 'bg-cyan-100 text-cyan-600' :
                      'bg-primary-100 text-primary-600'
                    )}>
                      {ball.runs + (ball.extras || 0) + (ball.extra_type ? ' (ex)' : '')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{ball.commentary}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              <RotateCcw className="w-4 h-4" />
              Undo
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              <Pause className="w-4 h-4" />
              Break
            </button>
          </div>
        </div>
      </div>

      {/* Wicket Modal */}
      {showWicketModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Record Wicket</h2>
                <button onClick={() => setShowWicketModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Wicket Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Caught', 'Bowled', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket'].map((type) => (
                    <button key={type} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300">
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Dismissed Batsman</label>
                <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {currentMatch.batsmen.map(b => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Fielder (if applicable)</label>
                <input type="text" placeholder="e.g., Ruturaj Gaikwad" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button onClick={() => setShowWicketModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-medium">Cancel</button>
              <button className="px-4 py-2 rounded-xl bg-error-500 text-white font-medium">Record Wicket</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Extras Modal */}
      {showExtrasModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Extras</h2>
                <button onClick={() => setShowExtrasModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'wide', label: 'Wide', desc: 'Ball outside tramline' },
                  { type: 'no_ball', label: 'No Ball', desc: 'Front foot overstep' },
                  { type: 'bye', label: 'Byes', desc: 'Not touched bat' },
                  { type: 'leg_bye', label: 'Leg Byes', desc: 'Touched batsman' },
                ].map((extra) => (
                  <button key={extra.type} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:bg-primary-50 dark:hover:bg-primary-900/20">
                    <p className="font-semibold text-slate-900 dark:text-white">{extra.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{extra.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button onClick={() => setShowExtrasModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-medium">Cancel</button>
              <button className="px-4 py-2 rounded-xl bg-warning-500 text-white font-medium">Add Extras</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default BallByBallScoring;
