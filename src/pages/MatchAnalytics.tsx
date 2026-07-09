import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Target, TrendingUp, Users, Zap, Clock, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { AreaChart, BarChart, LineChart, WormChart, ManhattanChart } from '../components/ui/Charts';
import { mockTeams, mockPlayers, chartColors, generateOverData } from '../lib/mock-data';
import { cn, getInitials } from '../lib/utils';

// Match-specific mock data
const matchData = {
  id: '1',
  team1: mockTeams[0],
  team2: mockTeams[1],
  venue: 'M. Chinnaswamy Stadium, Bangalore',
  date: '2024-05-15',
  result: 'CSK won by 6 wickets',
  toss: { winner: mockTeams[0], decision: 'bowl' },
  playerOfMatch: mockPlayers[2],
  attendance: 38200,
  duration: '3h 45m',
};

const inningsData = {
  first: {
    team: mockTeams[1],
    total: 185,
    wickets: 6,
    overs: 20,
    runRate: 9.00,
    extras: 12,
    boundaries: { fours: 14, sixes: 8 },
    powerplay: { runs: 52, wickets: 1 },
    middleOvers: { runs: 78, wickets: 3 },
    deathOvers: { runs: 55, wickets: 2 },
  },
  second: {
    team: mockTeams[0],
    total: 188,
    wickets: 4,
    overs: 19.2,
    runRate: 9.62,
    extras: 10,
    boundaries: { fours: 18, sixes: 6 },
    powerplay: { runs: 48, wickets: 0 },
    middleOvers: { runs: 82, wickets: 2 },
    deathOvers: { runs: 58, wickets: 2 },
  },
};

const partnerships = [
  { pair: ['R Gaikwad', 'D Conway'], runs: 86, balls: 52, wickets: 0, phase: 'Powerplay' },
  { pair: ['D Conway', 'S Raina'], runs: 45, balls: 38, wickets: 1, phase: 'Middle' },
  { pair: ['S Raina', 'MS Dhoni'], runs: 28, balls: 18, wickets: 1, phase: 'Death' },
  { pair: ['MS Dhoni', 'R Jadeja'], runs: 29, balls: 14, wickets: 0, phase: 'Death' },
];

const bowlingAnalysis = [
  { player: mockPlayers[1], overs: 4, maidens: 0, runs: 28, wickets: 2, economy: 7.0, dots: 15, boundaries: 3 },
  { player: mockPlayers[7], overs: 4, maidens: 0, runs: 35, wickets: 1, economy: 8.75, dots: 10, boundaries: 5 },
  { player: mockPlayers[5], overs: 3, maidens: 0, runs: 24, wickets: 1, economy: 8.0, dots: 8, boundaries: 2 },
];

const momentumData = Array.from({ length: 20 }, (_, i) => ({
  over: i + 1,
  team1_momentum: Math.sin(i * 0.5) * 20 + 50 + Math.random() * 30,
  team2_momentum: Math.cos(i * 0.3) * 15 + 60 + Math.random() * 25,
}));

const overByOverData = generateOverData();

// Sub-components
function MatchOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="text-center">
          <p className="text-slate-500 text-sm">Venue</p>
          <p className="font-bold text-slate-900 dark:text-white mt-1">{matchData.venue}</p>
        </GlassCard>
        <GlassCard className="text-center">
          <p className="text-slate-500 text-sm">Date</p>
          <p className="font-bold text-slate-900 dark:text-white mt-1">{matchData.date}</p>
        </GlassCard>
        <GlassCard className="text-center">
          <p className="text-slate-500 text-sm">Attendance</p>
          <p className="font-bold text-primary-600 mt-1">{matchData.attendance.toLocaleString()}</p>
        </GlassCard>
        <GlassCard className="text-center">
          <p className="text-slate-500 text-sm">Duration</p>
          <p className="font-bold text-slate-900 dark:text-white mt-1">{matchData.duration}</p>
        </GlassCard>
      </div>

      {/* Match Result Card */}
      <GlassCard gradient>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Match Result</h3>
          <span className="px-3 py-1 rounded-full bg-success-100 text-success-600 text-sm font-medium">
            Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Team 1 */}
          <div className="text-center p-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-warning-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
              {matchData.team1.short_name}
            </div>
            <p className="mt-3 font-bold text-slate-900 dark:text-white">{matchData.team1.name}</p>
            <p className="text-2xl font-bold text-success-600 mt-2">
              {inningsData.second.total}/{inningsData.second.wickets}
            </p>
            <p className="text-sm text-slate-500">({inningsData.second.overs} ov)</p>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="inline-flex flex-col items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 text-white">
              <span className="text-2xl font-bold">VS</span>
            </div>
            <p className="mt-2 text-sm font-bold text-success-600">{matchData.result}</p>
          </div>

          {/* Team 2 */}
          <div className="text-center p-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl">
              {matchData.team2.short_name}
            </div>
            <p className="mt-3 font-bold text-slate-900 dark:text-white">{matchData.team2.name}</p>
            <p className="text-2xl font-bold text-slate-600 mt-2">
              {inningsData.first.total}/{inningsData.first.wickets}
            </p>
            <p className="text-sm text-slate-500">({inningsData.first.overs} ov)</p>
          </div>
        </div>

        {/* Toss Info */}
        <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
          <p className="text-sm text-slate-500">
            <span className="font-semibold">{matchData.toss.winner.short_name}</span> won the toss and chose to <span className="font-semibold capitalize">{matchData.toss.decision}</span> first
          </p>
        </div>

        {/* Player of the Match */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-warning-500/10 to-orange-500/10 border border-warning-500/20">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warning-500 to-orange-500 flex items-center justify-center text-white font-bold">
              {getInitials(matchData.playerOfMatch.full_name)}
            </div>
            <div>
              <p className="text-xs text-warning-600 font-semibold">PLAYER OF THE MATCH</p>
              <p className="font-bold text-slate-900 dark:text-white">{matchData.playerOfMatch.full_name}</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function InningsAnalysis() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* First Innings */}
        <GlassCard gradient>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary-500/20">
              <Target className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">1st Innings</h3>
              <p className="text-sm text-slate-500">{inningsData.first.team.name}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-2xl font-bold text-primary-600">
                {inningsData.first.total}/{inningsData.first.wickets}
              </p>
              <p className="text-sm text-slate-500">({inningsData.first.overs} ov)</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-xs text-slate-500">Fours</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{inningsData.first.boundaries.fours}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-xs text-slate-500">Sixes</p>
              <p className="text-xl font-bold text-cyan-600">{inningsData.first.boundaries.sixes}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-xs text-slate-500">Extras</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{inningsData.first.extras}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <div className="flex justify-between text-sm">
                <span className="text-blue-600 font-medium">Powerplay (1-6)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {inningsData.first.powerplay.runs}/{inningsData.first.powerplay.wickets}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <div className="flex justify-between text-sm">
                <span className="text-amber-600 font-medium">Middle (7-15)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {inningsData.first.middleOvers.runs}/{inningsData.first.middleOvers.wickets}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
              <div className="flex justify-between text-sm">
                <span className="text-red-600 font-medium">Death (16-20)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {inningsData.first.deathOvers.runs}/{inningsData.first.deathOvers.wickets}
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Second Innings */}
        <GlassCard gradient>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-success-500/20">
              <Target className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">2nd Innings</h3>
              <p className="text-sm text-slate-500">{inningsData.second.team.name}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-2xl font-bold text-success-600">
                {inningsData.second.total}/{inningsData.second.wickets}
              </p>
              <p className="text-sm text-slate-500">({inningsData.second.overs} ov)</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-xs text-slate-500">Fours</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{inningsData.second.boundaries.fours}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-xs text-slate-500">Sixes</p>
              <p className="text-xl font-bold text-cyan-600">{inningsData.second.boundaries.sixes}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-xs text-slate-500">Extras</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{inningsData.second.extras}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <div className="flex justify-between text-sm">
                <span className="text-blue-600 font-medium">Powerplay (1-6)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {inningsData.second.powerplay.runs}/{inningsData.second.powerplay.wickets}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <div className="flex justify-between text-sm">
                <span className="text-amber-600 font-medium">Middle (7-15)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {inningsData.second.middleOvers.runs}/{inningsData.second.middleOvers.wickets}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
              <div className="flex justify-between text-sm">
                <span className="text-red-600 font-medium">Death (16-20)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {inningsData.second.deathOvers.runs}/{inningsData.second.deathOvers.wickets}
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Run Rate Comparison */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Run Rate Comparison</h3>
        <div className="h-64">
          <LineChart
            data={overByOverData.map(o => o.runs)}
            categories={['Run Rate']}
            title=""
            height={240}
          />
        </div>
      </GlassCard>
    </div>
  );
}

function PartnershipsTab() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Partnership Breakdown</h3>
        <div className="h-64 mb-6">
          <BarChart
            data={partnerships.map(p => p.runs)}
            categories={['Runs']}
            title=""
            height={240}
          />
        </div>

        <div className="space-y-4">
          {partnerships.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {p.pair.map((name, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-900"
                      >
                        {name.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{p.pair.join(' & ')}</p>
                    <p className="text-xs text-slate-500">{p.phase} Phase</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-600">{p.runs}</p>
                  <p className="text-xs text-slate-500">({p.balls} balls)</p>
                </div>
              </div>

              <div className="mt-2">
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full"
                    style={{ width: `${(p.runs / 100) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Partnership Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
            <p className="text-xs text-slate-500">Highest Partnership</p>
            <p className="text-3xl font-bold text-success-600 mt-1">86</p>
            <p className="text-xs text-slate-500 mt-1">Gaikwad & Conway</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
            <p className="text-xs text-slate-500">Average Partnership</p>
            <p className="text-3xl font-bold text-primary-600 mt-1">47</p>
            <p className="text-xs text-slate-500 mt-1">runs per wicket</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
            <p className="text-xs text-slate-500">50+ Partnerships</p>
            <p className="text-3xl font-bold text-warning-500 mt-1">2</p>
            <p className="text-xs text-slate-500 mt-1">out of 4</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function BowlingAnalysisTab() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Bowling Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-2">Bowler</th>
                <th className="text-center py-3 px-2">O</th>
                <th className="text-center py-3 px-2">M</th>
                <th className="text-center py-3 px-2">R</th>
                <th className="text-center py-3 px-2">W</th>
                <th className="text-center py-3 px-2">Econ</th>
                <th className="text-center py-3 px-2">Dots</th>
                <th className="text-center py-3 px-2">4s/6s</th>
              </tr>
            </thead>
            <tbody>
              {bowlingAnalysis.map((b, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-error-500 to-warning-500 flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(b.player.full_name)}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">{b.player.full_name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center text-slate-600">{b.overs}</td>
                  <td className="py-4 px-2 text-center text-slate-600">{b.maidens}</td>
                  <td className="py-4 px-2 text-center text-slate-600">{b.runs}</td>
                  <td className="py-4 px-2 text-center">
                    <span className={cn(
                      'px-2 py-1 rounded font-bold',
                      b.wickets >= 3 ? 'bg-success-100 text-success-600' : 'text-slate-600'
                    )}>
                      {b.wickets}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className={cn(
                      'font-medium',
                      b.economy < 7 ? 'text-success-600' : b.economy < 9 ? 'text-warning-500' : 'text-error-500'
                    )}>
                      {b.economy.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center text-slate-600">{b.dots}</td>
                  <td className="py-4 px-2 text-center text-slate-600">{b.boundaries}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Dot Ball Percentage</h3>
        <div className="space-y-4">
          {bowlingAnalysis.map((b, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-900 dark:text-white">{b.player.full_name}</span>
                <span className="text-primary-600">{((b.dots / (b.overs * 6)) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full"
                  style={{ width: `${(b.dots / (b.overs * 6)) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function MomentumTab() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Match Momentum Flow</h3>
        <p className="text-sm text-slate-500 mb-4">
          Momentum calculated based on run rate, wickets, and partnership contributions per over
        </p>
        <div className="h-64">
          <WormChart
            data={momentumData.map(d => d.team1_momentum)}
            categories={momentumData.map(d => `Over ${d.over}`)}
            title=""
            height={240}
          />
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Manhattan Chart - Runs per Over</h3>
          <div className="h-64">
            <ManhattanChart
              data={overByOverData.map(o => o.runs)}
              categories={overByOverData.map(o => `Over ${o.over}`)}
              title=""
              height={240}
            />
          </div>
        </GlassCard>

        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Key Moments</h3>
          <div className="space-y-3">
            {[
              { over: 6, event: 'Powerplay End', team: 'CSK', impact: 'positive', desc: '48/0 - Solid start' },
              { over: 12, event: 'Wicket', team: 'MI', impact: 'negative', desc: 'Conway dismissed for 45' },
              { over: 18, event: 'Mandatory Over', team: 'CSK', impact: 'positive', desc: '15 runs scored' },
            ].map((m, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    m.impact === 'positive' ? 'bg-success-100 text-success-600' : 'bg-error-100 text-error-500'
                  )}>
                    {m.impact === 'positive' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 dark:text-white">{m.event}</p>
                      <span className="text-xs text-slate-500">Over {m.over}</span>
                    </div>
                    <p className="text-sm text-slate-500">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export function MatchAnalyticsPage() {
  const [activeTab, setActiveTab] = React.useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'innings', label: 'Innings Analysis', icon: Target },
    { id: 'partnerships', label: 'Partnerships', icon: Users },
    { id: 'bowling', label: 'Bowling', icon: Target },
    { id: 'momentum', label: 'Momentum', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Match Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Comprehensive match breakdown & insights</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <Clock className="w-5 h-5" />
          <span className="font-medium">{matchData.date}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-primary-500 to-cyan-500 text-white shadow-lg'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'overview' && <MatchOverview />}
        {activeTab === 'innings' && <InningsAnalysis />}
        {activeTab === 'partnerships' && <PartnershipsTab />}
        {activeTab === 'bowling' && <BowlingAnalysisTab />}
        {activeTab === 'momentum' && <MomentumTab />}
      </motion.div>
    </div>
  );
}

export default MatchAnalyticsPage;
