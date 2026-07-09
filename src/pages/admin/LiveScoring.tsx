import React from 'react';
import { motion } from 'framer-motion';
import {
  Play, Pause, Square, RotateCcw, ChevronUp, ChevronDown,
  Users, Target, Activity, Zap, Plus, Minus, X, Check,
  Circle, Flag, Trophy, Clock, Edit, AlertCircle
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface Batsman {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOnStrike: boolean;
}

interface Bowler {
  id: string;
  name: string;
  overs: number;
  balls: number;
  maidens: number;
  runs: number;
  wickets: number;
}

interface BallData {
  over: number;
  ball: number;
  runs: number;
  extras?: string;
  wicket?: boolean;
  wicketType?: string;
  batsman: string;
  bowler: string;
}

interface Inning {
  team: string;
  teamShort: string;
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  runRate: number;
  batsmen: Batsman[];
  bowlers: Bowler[];
  ballByBall: BallData[];
}

export function LiveScoring() {
  const [matchStatus, setMatchStatus] = React.useState<'live' | 'paused' | 'ended'>('live');
  const [currentInning, setCurrentInning] = React.useState<1 | 2>(1);
  const [currentOver, setCurrentOver] = React.useState(12);
  const [currentBall, setCurrentBall] = React.useState(3);

  const [inning1, setInning1] = React.useState<Inning>({
    team: 'Chennai Super Kings',
    teamShort: 'CSK',
    runs: 165,
    wickets: 4,
    overs: 20,
    balls: 0,
    runRate: 8.25,
    batsmen: [
      { id: '1', name: 'Ruturaj Gaikwad', runs: 67, balls: 48, fours: 8, sixes: 2, isOnStrike: true },
      { id: '2', name: 'MS Dhoni', runs: 28, balls: 15, fours: 2, sixes: 2, isOnStrike: false },
      { id: '3', name: 'Ravindra Jadeja', runs: 24, balls: 18, fours: 3, sixes: 0, isOnStrike: false },
    ],
    bowlers: [
      { id: '1', name: 'Jasprit Bumrah', overs: 3, balls: 0, maidens: 0, runs: 22, wickets: 2 },
      { id: '2', name: 'Trent Boult', overs: 3, balls: 0, maidens: 1, runs: 18, wickets: 1 },
    ],
    ballByBall: []
  });

  const [inning2, setInning2] = React.useState<Inning>({
    team: 'Mumbai Indians',
    teamShort: 'MI',
    runs: 125,
    wickets: 6,
    overs: 12,
    balls: 3,
    runRate: 10.08,
    batsmen: [
      { id: '1', name: 'Rohit Sharma', runs: 45, balls: 32, fours: 5, sixes: 2, isOnStrike: true },
      { id: '2', name: 'Tilak Varma', runs: 28, balls: 18, fours: 2, sixes: 1, isOnStrike: false },
      { id: '3', name: 'Hardik Pandya', runs: 18, balls: 12, fours: 1, sixes: 1, isOnStrike: false },
    ],
    bowlers: [
      { id: '1', name: 'Ravindra Jadeja', overs: 2, balls: 0, maidens: 0, runs: 18, wickets: 1 },
      { id: '2', name: 'Matheesha Pathirana', overs: 2, balls: 3, maidens: 0, runs: 24, wickets: 2 },
    ],
    ballByBall: []
  });

  const current = currentInning === 1 ? inning1 : inning2;
  const target = 166;
  const required = target - current.runs;
  const remainingBalls = (20 - current.overs) * 6 - current.balls + (20 * 6 - current.overs * 6 - current.balls);
  const requiredRate = remainingBalls > 0 ? (required / (remainingBalls / 6)).toFixed(2) : '0.00';

  const [showWicketModal, setShowWicketModal] = React.useState(false);
  const [showExtrasModal, setShowExtrasModal] = React.useState(false);
  const [showBatsmanModal, setShowBatsmanModal] = React.useState(false);
  const [showBowlerModal, setShowBowlerModal] = React.useState(false);

  const lastSixBalls = [
    { runs: 4, extras: null },
    { runs: 2, extras: null },
    { runs: 0, extras: null },
    { runs: 6, extras: null },
    { runs: 1, extras: null },
    { runs: 2, extras: null },
  ];

  const handleRun = (runs: number) => {
    console.log(`Recording ${runs} runs`);
  };

  const handleExtra = (type: string, runs: number = 1) => {
    console.log(`Recording ${type} (${runs} runs)`);
  };

  const handleWicket = (type: string) => {
    console.log(`Recording wicket: ${type}`);
  };

  const getBallLabel = (ball: { runs: number; extras?: string | null }) => {
    if (ball.extras === 'W') return 'Wd';
    if (ball.extras === 'Nb') return 'Nb';
    if (ball.extras === 'Lb') return 'Lb';
    if (ball.extras === 'B') return 'B';
    if (ball.runs === 4) return '4';
    if (ball.runs === 6) return '6';
    if (ball.runs === 0) return '•';
    return ball.runs.toString();
  };

  const getBallColor = (ball: { runs: number; extras?: string | null; wicket?: boolean }) => {
    if (ball.wicket) return 'bg-error-500 text-white';
    if (ball.extras) return 'bg-warning-500 text-white';
    if (ball.runs === 4) return 'bg-success-500 text-white';
    if (ball.runs === 6) return 'bg-cyan-500 text-white';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
  };

  return (
    <div className="space-y-6">
      {/* Match Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full bg-error-100 text-error-600 text-xs font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error-500 animate-pulse" />
              LIVE
            </span>
            <span className="text-sm text-slate-500">IPL 2024 - Match 45</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {inning1.teamShort} vs {inning2.teamShort}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {matchStatus === 'live' && (
            <button
              onClick={() => setMatchStatus('paused')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning-100 text-warning-600 font-medium"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          )}
          {matchStatus === 'paused' && (
            <button
              onClick={() => setMatchStatus('live')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success-100 text-success-600 font-medium"
            >
              <Play className="w-4 h-4" />
              Resume
            </button>
          )}
          <button
            onClick={() => setMatchStatus('ended')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error-100 text-error-600 font-medium"
          >
            <Square className="w-4 h-4" />
            End Match
          </button>
        </div>
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Current Innings */}
        <GlassCard gradient className="relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="text-xs font-medium text-slate-500">Inning {currentInning}</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
              {current.teamShort}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                {current.runs}/{current.wickets}
              </h2>
              <p className="text-slate-500">
                {current.overs}.{current.balls} overs
              </p>
            </div>
          </div>

          {/* Run Rate & Target Info */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500">CRR</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{current.runRate.toFixed(2)}</p>
            </div>
            {currentInning === 2 && (
              <>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-500">Target</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{target}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <p className="text-xs text-primary-600">Need</p>
                  <p className="text-lg font-bold text-primary-600">{required} from {remainingBalls}</p>
                  <p className="text-xs text-primary-500">Req RR: {requiredRate}</p>
                </div>
              </>
            )}
          </div>

          {/* Current Over */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2">This Over</p>
            <div className="flex items-center gap-2">
              {lastSixBalls.map((ball, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm',
                    getBallColor(ball)
                  )}
                >
                  {getBallLabel(ball)}
                </div>
              ))}
              {currentBall < 6 && (
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
                  <span className="text-slate-400">?</span>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* First Innings Summary */}
        <GlassCard>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
              {currentInning === 1 ? inning2.teamShort : inning1.teamShort}
            </div>
            <div>
              <p className="text-sm text-slate-500">{currentInning === 1 ? inning2.team : inning1.team}</p>
              {currentInning === 2 ? (
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {inning1.runs}/{inning1.wickets}
                </h3>
              ) : (
                <p className="text-sm text-slate-500">Yet to bat</p>
              )}
            </div>
            {currentInning === 2 && (
              <div className="ml-auto text-right">
                <p className="text-xs text-slate-500">20 overs</p>
                <p className="text-sm font-medium text-slate-600">RR: {inning1.runRate.toFixed(2)}</p>
              </div>
            )}
          </div>

          {currentInning === 2 && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 mb-2">Target: {target}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-cyan-500"
                    style={{ width: `${Math.min((current.runs / target) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-600">
                  {Math.round((current.runs / target) * 100)}%
                </span>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Scoring Controls */}
      <GlassCard>
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Ball Outcome</p>
        </div>

        {/* Run Buttons */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {[0, 1, 2, 3, 4, 6, '...'].map((run, i) => (
            <button
              key={i}
              onClick={() => handleRun(typeof run === 'number' ? run : 0)}
              className={cn(
                'py-4 rounded-xl font-bold text-lg transition-all',
                run === 4 ? 'bg-success-100 dark:bg-success-900/30 text-success-600 hover:bg-success-200' :
                run === 6 ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 hover:bg-cyan-200' :
                run === '...' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700' :
                run === 0 ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200' :
                'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-primary-500'
              )}
            >
              {run}
            </button>
          ))}
        </div>

        {/* Extras & Special */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <button
            onClick={() => handleExtra('W', 1)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-warning-100 dark:bg-warning-900/30 text-warning-600 font-medium hover:bg-warning-200"
          >
            Wide
          </button>
          <button
            onClick={() => handleExtra('Nb', 1)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-warning-100 dark:bg-warning-900/30 text-warning-600 font-medium hover:bg-warning-200"
          >
            No Ball
          </button>
          <button
            onClick={() => handleExtra('Lb', 0)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200"
          >
            Leg Bye
          </button>
          <button
            onClick={() => setShowWicketModal(true)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-error-100 dark:bg-error-900/30 text-error-600 font-medium hover:bg-error-200"
          >
            Wicket
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBatsmanModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-200"
          >
            <Users className="w-4 h-4" />
            Change Batsman
          </button>
          <button
            onClick={() => setShowBowlerModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-200"
          >
            <Circle className="w-4 h-4" />
            Change Bowler
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-200">
            <RotateCcw className="w-4 h-4" />
            Undo Last Ball
          </button>
        </div>
      </GlassCard>

      {/* Batsmen & Bowlers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Batsmen */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Batsmen</h3>
            <button
              onClick={() => setShowBatsmanModal(true)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {current.batsmen.slice(0, 2).map((batsman) => (
              <div
                key={batsman.id}
                className={cn(
                  'p-3 rounded-xl transition-colors',
                  batsman.isOnStrike
                    ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                    : 'bg-slate-50 dark:bg-slate-800/50'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {batsman.isOnStrike && (
                      <span className="text-xs font-bold text-primary-600">* </span>
                    )}
                    <span className="font-medium text-slate-900 dark:text-white">{batsman.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-white">{batsman.runs}</span>
                    <span className="text-sm text-slate-500"> ({batsman.balls})</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span>4s: {batsman.fours}</span>
                  <span>6s: {batsman.sixes}</span>
                  <span>SR: {batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(1) : '0.0'}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Current Bowler */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Current Bowler</h3>
            <button
              onClick={() => setShowBowlerModal(true)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Change
            </button>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="font-medium text-slate-900 dark:text-white mb-3">
              {current.bowlers[0]?.name || 'Select Bowler'}
            </p>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {current.bowlers[0]?.overs || 0}.{current.bowlers[0]?.balls || 0}
                </p>
                <p className="text-xs text-slate-500">Overs</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {current.bowlers[0]?.maidens || 0}
                </p>
                <p className="text-xs text-slate-500">Maidens</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {current.bowlers[0]?.runs || 0}
                </p>
                <p className="text-xs text-slate-500">Runs</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {current.bowlers[0]?.wickets || 0}
                </p>
                <p className="text-xs text-slate-500">Wickets</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500">
                Economy: {current.bowlers[0] ? (current.bowlers[0].runs / (current.bowlers[0].overs + current.bowlers[0].balls / 6)).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Ball-by-Ball Log */}
      <GlassCard>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Ball-by-Ball</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {Array.from({ length: 13 }, (_, i) => ({
            over: i + 1,
            balls: [
              { runs: 1, batsman: 'Rohit Sharma' },
              { runs: 4, batsman: 'Rohit Sharma' },
              { runs: 0, batsman: 'Tilak Varma' },
              { runs: 2, batsman: 'Tilak Varma' },
              { runs: 6, batsman: 'Rohit Sharma' },
              { runs: 1, batsman: 'Rohit Sharma' },
            ]
          })).reverse().slice(0, 5).map((over) => (
            <motion.div
              key={over.over}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
            >
              <span className="w-12 text-sm font-medium text-slate-500">Over {over.over}</span>
              <div className="flex items-center gap-1">
                {over.balls.map((ball, i) => (
                  <span
                    key={i}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs',
                      getBallColor(ball)
                    )}
                  >
                    {getBallLabel(ball)}
                  </span>
                ))}
              </div>
              <span className="ml-auto text-sm text-slate-600 dark:text-slate-400">
                {over.balls.reduce((sum, b) => sum + b.runs, 0)} runs
              </span>
            </motion.div>
          ))}
        </div>
      </GlassCard>

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
                <button
                  onClick={() => setShowWicketModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-3">
              {['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket', 'Caught & Bowled'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    handleWicket(type);
                    setShowWicketModal(false);
                  }}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-left transition-colors"
                >
                  <span className="font-medium text-slate-900 dark:text-white">{type}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Batsman Selection Modal */}
      {showBatsmanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Select Batsman</h2>
                <button
                  onClick={() => setShowBatsmanModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-2 max-h-80 overflow-y-auto">
              {['Rohit Sharma', 'Tilak Varma', 'Hardik Pandya', 'Ishan Kishan', 'Tim David', 'Piyush Chawla'].map((name) => (
                <button
                  key={name}
                  onClick={() => setShowBatsmanModal(false)}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-left transition-colors flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">{name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Bowler Selection Modal */}
      {showBowlerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Select Bowler</h2>
                <button
                  onClick={() => setShowBowlerModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-2 max-h-80 overflow-y-auto">
              {['Ravindra Jadeja', 'Matheesha Pathirana', 'Tushar Deshpande', 'Mitchell Santner', 'Moeen Ali', 'Shardul Thakur'].map((name) => (
                <button
                  key={name}
                  onClick={() => setShowBowlerModal(false)}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-left transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">{name}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    <span>0/24</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default LiveScoring;
