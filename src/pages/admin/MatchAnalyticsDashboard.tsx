import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Target, TrendingUp, BarChart3, Users, Calendar, MapPin,
  Trophy, ChevronDown, Download, FileSpreadsheet, Eye, Clock,
  Star, Shield, Zap
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

// Types
interface MatchInfo {
  id: string;
  team1: { name: string; short: string; color: string; score: string; overs: string };
  team2: { name: string; short: string; color: string; score: string; overs: string };
  venue: string;
  date: string;
  toss: { winner: string; decision: string };
  result: string;
  man_of_the_match: string;
  match_type: string;
}

interface BatsmanStats {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  sr: number;
  dismissal: string;
  is_out: boolean;
}

interface BowlerStats {
  name: string;
  overs: number;
  maiden: number;
  runs: number;
  wickets: number;
  econ: number;
}

interface OverData {
  over: number;
  team1_runs: number;
  team1_wickets: number;
  team2_runs: number;
  team2_wickets: number;
}

interface Partnership {
  pair: string;
  runs: number;
  balls: number;
  overs: string;
}

// Mock Data
const matchInfo: MatchInfo = {
  id: 'M74',
  team1: { name: 'Royal Challengers Bangalore', short: 'RCB', color: '#EC1C24', score: '218/5', overs: '20.0' },
  team2: { name: 'Chennai Super Kings', short: 'CSK', color: '#FFCB05', score: '191/8', overs: '20.0' },
  venue: 'M. Chinnaswamy Stadium, Bangalore',
  date: 'May 18, 2024',
  toss: { winner: 'RCB', decision: 'Bat first' },
  result: 'RCB won by 27 runs',
  man_of_the_match: 'Virat Kohli',
  match_type: 'T20 - IPL 2024',
};

const battingScorecardTeam1: BatsmanStats[] = [
  { name: 'F du Plessis', runs: 45, balls: 28, fours: 5, sixes: 2, sr: 160.7, dismissal: 'caught Dhoni b Tushar', is_out: true },
  { name: 'Virat Kohli', runs: 92, balls: 47, fours: 7, sixes: 5, sr: 195.7, dismissal: 'not out', is_out: false },
  { name: 'Rajat Patidar', runs: 31, balls: 18, fours: 2, sixes: 2, sr: 172.2, dismissal: 'caught Rahane b Pathirana', is_out: true },
  { name: 'Glenn Maxwell', runs: 28, balls: 12, fours: 1, sixes: 3, sr: 233.3, dismissal: 'bowled Jadeja', is_out: true },
  { name: 'Cameron Green', runs: 15, balls: 8, fours: 1, sixes: 1, sr: 187.5, dismissal: 'lbw b Mustafizur', is_out: true },
  { name: 'Dinesh Karthik', runs: 4, balls: 3, fours: 1, sixes: 0, sr: 133.3, dismissal: 'caught Dhoni b Shardul', is_out: true },
  { name: 'Karn Sharma', runs: 3, balls: 2, fours: 0, sixes: 0, sr: 150.0, dismissal: 'not out', is_out: false },
];

const bowlingScorecardTeam2: BowlerStats[] = [
  { name: 'Tushar Deshpande', overs: 4, maiden: 0, runs: 45, wickets: 1, econ: 11.25 },
  { name: 'Mustafizur Rahman', overs: 4, maiden: 0, runs: 38, wickets: 1, econ: 9.5 },
  { name: 'Ravindra Jadeja', overs: 4, maiden: 0, runs: 32, wickets: 1, econ: 8.0 },
  { name: 'Matheesha Pathirana', overs: 3, maiden: 0, runs: 41, wickets: 1, econ: 13.67 },
  { name: 'Shardul Thakur', overs: 3, maiden: 0, runs: 35, wickets: 1, econ: 11.67 },
  { name: 'Moeen Ali', overs: 2, maiden: 0, runs: 27, wickets: 0, econ: 13.5 },
];

const battingScorecardTeam2: BatsmanStats[] = [
  { name: 'Ruturaj Gaikwad', runs: 56, balls: 32, fours: 6, sixes: 3, sr: 175.0, dismissal: 'caught Kohli b Maxwell', is_out: true },
  { name: 'Ajinkya Rahane', runs: 28, balls: 21, fours: 3, sixes: 1, sr: 133.3, dismissal: 'lbw b Karn', is_out: true },
  { name: 'Shivam Dube', runs: 42, balls: 25, fours: 2, sixes: 4, sr: 168.0, dismissal: 'caught Patel b Siraj', is_out: true },
  { name: 'MS Dhoni', runs: 31, balls: 12, fours: 1, sixes: 3, sr: 258.3, dismissal: 'caught Maxwell b Siraj', is_out: true },
  { name: 'Ravindra Jadeja', runs: 18, balls: 14, fours: 2, sixes: 0, sr: 128.6, dismissal: 'not out', is_out: false },
  { name: 'Moeen Ali', runs: 8, balls: 6, fours: 1, sixes: 0, sr: 133.3, dismissal: 'bowled Dayal', is_out: true },
];

const bowlingScorecardTeam1: BowlerStats[] = [
  { name: 'Mohammed Siraj', overs: 4, maiden: 0, runs: 42, wickets: 2, econ: 10.5 },
  { name: 'Glenn Maxwell', overs: 3, maiden: 0, runs: 28, wickets: 1, econ: 9.33 },
  { name: 'Karn Sharma', overs: 3, maiden: 0, runs: 35, wickets: 1, econ: 11.67 },
  { name: 'Yash Dayal', overs: 4, maiden: 0, runs: 31, wickets: 1, econ: 7.75 },
  { name: 'Cameron Green', overs: 3, maiden: 0, runs: 29, wickets: 0, econ: 9.67 },
  { name: 'Mahipal Lomror', overs: 3, maiden: 0, runs: 26, wickets: 0, econ: 8.67 },
];

const overByOver: OverData[] = Array.from({ length: 20 }, (_, i) => ({
  over: i + 1,
  team1_runs: [12, 8, 15, 9, 14, 6, 18, 11, 8, 15, 12, 9, 6, 14, 11, 8, 16, 9, 12, 5][i],
  team1_wickets: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0][i],
  team2_runs: [10, 6, 14, 8, 12, 9, 15, 7, 11, 13, 8, 6, 9, 14, 15, 8, 11, 12, 5, 3][i],
  team2_wickets: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0][i],
}));

const partnerships: Partnership[] = [
  { pair: 'du Plessis & Kohli', runs: 65, balls: 42, overs: '0.1-6.3' },
  { pair: 'Kohli & Patidar', runs: 48, balls: 28, overs: '6.4-11.2' },
  { pair: 'Kohli & Maxwell', runs: 36, balls: 15, overs: '11.3-14.2' },
  { pair: 'Kohli & Green', runs: 28, balls: 16, overs: '14.3-17.5' },
  { pair: 'Kohli & Karthik', runs: 21, balls: 12, overs: '17.6-19.6' },
];

const phaseAnalysis = {
  team1: [
    { phase: 'Powerplay (1-6)', runs: 64, wickets: 0, sr: 157.3, avg: '-' },
    { phase: 'Middle (7-15)', runs: 98, wickets: 3, sr: 165.2, avg: 32.67 },
    { phase: 'Death (16-20)', runs: 56, wickets: 2, sr: 193.1, avg: 28.0 },
  ],
  team2: [
    { phase: 'Powerplay (1-6)', runs: 59, wickets: 1, sr: 149.1, avg: 59.0 },
    { phase: 'Middle (7-15)', runs: 78, wickets: 3, sr: 130.0, avg: 26.0 },
    { phase: 'Death (16-20)', runs: 54, wickets: 4, sr: 180.0, avg: 13.5 },
  ],
};

// Worm Chart Component
const WormChart = ({ data }: { data: OverData[] }) => {
  const maxRuns = 250;
  let cumulative1 = 0;
  let cumulative2 = 0;

  return (
    <div className="h-64 relative">
      <svg className="w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
        {[120, 160, 200, 240].map((val) => (
          <line key={val} x1="5" y1={`${60 - (val / maxRuns) * 50}`} x2="95" y2={`${60 - (val / maxRuns) * 50}`} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="0.2" strokeDasharray="0.5" />
        ))}

        {(() => {
          cumulative1 = 0;
          return (
            <polyline
              points={data.map((d, i) => {
                cumulative1 += d.team1_runs;
                return `${5 + (i / (data.length - 1)) * 90} ${60 - (cumulative1 / maxRuns) * 50}`;
              }).join(' ')}
              fill="none"
              stroke="#EC1C24"
              strokeWidth="0.8"
            />
          );
        })()}

        {(() => {
          cumulative2 = 0;
          return (
            <polyline
              points={data.map((d, i) => {
                cumulative2 += d.team2_runs;
                return `${5 + (i / (data.length - 1)) * 90} ${60 - (cumulative2 / maxRuns) * 50}`;
              }).join(' ')}
              fill="none"
              stroke="#FFCB05"
              strokeWidth="0.8"
            />
          );
        })()}
      </svg>

      <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-1 text-xs text-slate-500">
        <span>250</span>
        <span>200</span>
        <span>150</span>
        <span>100</span>
        <span>50</span>
        <span>0</span>
      </div>

      <div className="absolute bottom-0 left-6 right-0 flex justify-between text-xs text-slate-500">
        <span>0</span>
        <span>5</span>
        <span>10</span>
        <span>15</span>
        <span>20</span>
      </div>
    </div>
  );
};

// Manhattan Chart Component
const ManhattanChart = ({ data, color }: { data: OverData[]; color: string }) => {
  const maxRuns = Math.max(...data.map(d => Math.max(d.team1_runs, d.team2_runs)));

  return (
    <div className="h-40 relative">
      <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
        {data.map((d, i) => (
          <rect
            key={i}
            x={`${3 + (i / data.length) * 94}`}
            y={`${50 - (d.team1_runs / maxRuns) * 40}`}
            width={`${85 / data.length}`}
            height={`${(d.team1_runs / maxRuns) * 40}`}
            fill={color}
            opacity="0.9"
          />
        ))}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-slate-500">
        <span>Over 1</span>
        <span>Over 10</span>
        <span>Over 20</span>
      </div>
    </div>
  );
};

// Run Rate Graph
const RunRateGraph = ({ data }: { data: OverData[] }) => {
  let cumulative1 = 0;
  let cumulative2 = 0;

  return (
    <div className="h-40 relative">
      <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
        {[10, 15, 20, 25, 30].map((rr) => (
          <line key={rr} x1="5" y1={`${50 - (rr / 30) * 40}`} x2="95" y2={`${50 - (rr / 30) * 40}`} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="0.2" />
        ))}

        {(() => {
          cumulative1 = 0;
          return (
            <polyline
              points={data.map((d, i) => {
                cumulative1 += d.team1_runs;
                const rr = (cumulative1 / (i + 1)) * 6;
                return `${5 + (i / (data.length - 1)) * 90} ${50 - (rr / 30) * 40}`;
              }).join(' ')}
              fill="none"
              stroke="#EC1C24"
              strokeWidth="0.5"
            />
          );
        })()}

        {(() => {
          cumulative2 = 0;
          return (
            <polyline
              points={data.map((d, i) => {
                cumulative2 += d.team2_runs;
                const rr = (cumulative2 / (i + 1)) * 6;
                return `${5 + (i / (data.length - 1)) * 90} ${50 - (rr / 30) * 40}`;
              }).join(' ')}
              fill="none"
              stroke="#FFCB05"
              strokeWidth="0.5"
            />
          );
        })()}
      </svg>
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500">
        <span>30</span>
        <span>20</span>
        <span>10</span>
        <span>0</span>
      </div>
    </div>
  );
};

// Wicket Timeline
const WicketTimeline = ({ data }: { data: OverData[] }) => {
  const wickets = data.flatMap((d, i) =>
    Array.from({ length: d.team1_wickets }, () => ({ over: i + 1, team: 1 }))
      .concat(Array.from({ length: d.team2_wickets }, () => ({ over: i + 1, team: 2 })))
  );

  return (
    <div className="relative py-4">
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full" />
      {wickets.map((w, i) => (
        <div
          key={i}
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ left: `${(w.over / 20) * 100}%`, backgroundColor: w.team === 1 ? '#EC1C24' : '#FFCB05' }}
        >
          <span className="text-white text-xs font-bold">{i + 1}</span>
        </div>
      ))}
      <div className="flex justify-between mt-2 text-xs text-slate-500">
        <span>Over 1</span>
        <span>Over 10</span>
        <span>Over 20</span>
      </div>
    </div>
  );
};

export function MatchAnalyticsDashboard() {
  const { id } = useParams<{ id: string }>();
  const [activeScorecard, setActiveScorecard] = React.useState<'team1' | 'team2'>('team1');

  const summaryStats = {
    totalRuns: 409,
    boundaries: 32,
    sixes: 21,
    extras: 18,
    wickets: 11,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary-500" />
            Match Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{matchInfo.match_type}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success-100 text-success-700 font-medium hover:bg-success-200">
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-100 text-primary-700 font-medium hover:bg-primary-200">
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      {/* Match Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 text-white/70">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{matchInfo.date}</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{matchInfo.venue}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-success-500/20 text-success-400 font-medium">
            <Trophy className="w-4 h-4" />
            {matchInfo.result}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: matchInfo.team1.color }}>
              <span className="text-white text-2xl font-bold">{matchInfo.team1.short}</span>
            </div>
            <div>
              <p className="text-white font-semibold">{matchInfo.team1.name}</p>
              <p className="text-3xl font-bold text-white">{matchInfo.team1.score}</p>
              <p className="text-white/60 text-sm">{matchInfo.team1.overs} overs</p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg mb-2">
              VS
            </div>
            <p className="text-white/60 text-xs">Toss: {matchInfo.toss.winner}</p>
            <p className="text-white/40 text-xs">{matchInfo.toss.decision}</p>
          </div>

          <div className="flex items-center gap-4 flex-row-reverse">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: matchInfo.team2.color }}>
              <span className="text-white text-2xl font-bold">{matchInfo.team2.short}</span>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">{matchInfo.team2.name}</p>
              <p className="text-3xl font-bold text-white">{matchInfo.team2.score}</p>
              <p className="text-white/60 text-sm">{matchInfo.team2.overs} overs</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-white/80">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm">Player of the Match: <span className="font-semibold text-white">{matchInfo.man_of_the_match}</span></span>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Runs', value: summaryStats.totalRuns, icon: TrendingUp, color: 'primary' },
          { label: 'Boundaries', value: summaryStats.boundaries, icon: Target, color: 'success' },
          { label: 'Sixes', value: summaryStats.sixes, icon: Zap, color: 'warning' },
          { label: 'Extras', value: summaryStats.extras, icon: Activity, color: 'cyan' },
          { label: 'Wickets', value: summaryStats.wickets, icon: Shield, color: 'error' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={cn(
                'w-4 h-4',
                stat.color === 'primary' ? 'text-primary-500' :
                stat.color === 'success' ? 'text-success-500' :
                stat.color === 'warning' ? 'text-warning-500' :
                stat.color === 'cyan' ? 'text-cyan-500' :
                'text-error-500'
              )} />
              <span className="text-xs text-slate-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Worm Chart - Cumulative Runs
          </h3>
          <WormChart data={overByOver} />
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 rounded" style={{ backgroundColor: matchInfo.team1.color }} />
              <span className="text-sm text-slate-600 dark:text-slate-400">{matchInfo.team1.short}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 rounded" style={{ backgroundColor: matchInfo.team2.color }} />
              <span className="text-sm text-slate-600 dark:text-slate-400">{matchInfo.team2.short}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-success-500" />
            Manhattan Chart - Runs per Over
          </h3>
          <ManhattanChart data={overByOver} color={matchInfo.team1.color} />
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-500" />
            Run Rate Comparison
          </h3>
          <RunRateGraph data={overByOver} />
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 rounded" style={{ backgroundColor: matchInfo.team1.color }} />
              <span className="text-sm text-slate-600 dark:text-slate-400">{matchInfo.team1.short}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 rounded" style={{ backgroundColor: matchInfo.team2.color }} />
              <span className="text-sm text-slate-600 dark:text-slate-400">{matchInfo.team2.short}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-error-500" />
            Wicket Timeline
          </h3>
          <WicketTimeline data={overByOver} />
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: matchInfo.team1.color }} />
              <span className="text-sm text-slate-600 dark:text-slate-400">{matchInfo.team1.short} wickets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: matchInfo.team2.color }} />
              <span className="text-sm text-slate-600 dark:text-slate-400">{matchInfo.team2.short} wickets</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Partnership Analysis */}
      <GlassCard>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-500" />
          Partnership Analysis - {matchInfo.team1.short}
        </h3>
        <div className="space-y-3">
          {partnerships.map((p, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                i === 0 ? 'bg-success-500 text-white' :
                i === 1 ? 'bg-primary-500 text-white' :
                'bg-slate-200 dark:bg-slate-700 text-slate-600'
              )}>
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-white">{p.pair}</p>
                <p className="text-xs text-slate-500">{p.overs} overs</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{p.runs}</p>
                <p className="text-xs text-slate-500">{p.balls} balls</p>
              </div>
              <div className="w-32">
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-cyan-500" style={{ width: `${(p.runs / 70) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Phase Wise Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { team: matchInfo.team1.short, data: phaseAnalysis.team1, color: matchInfo.team1.color },
          { team: matchInfo.team2.short, data: phaseAnalysis.team2, color: matchInfo.team2.color },
        ].map((teamData) => (
          <GlassCard key={teamData.team}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Phase Analysis - <span className="px-2 py-0.5 rounded text-white text-sm" style={{ backgroundColor: teamData.color }}>{teamData.team}</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="py-2 text-left">Phase</th>
                    <th className="py-2 text-center">Runs</th>
                    <th className="py-2 text-center">Wkts</th>
                    <th className="py-2 text-center">SR</th>
                    <th className="py-2 text-center">Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {teamData.data.map((phase, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 font-medium text-slate-900 dark:text-white">{phase.phase}</td>
                      <td className="py-3 text-center font-bold">{phase.runs}</td>
                      <td className="py-3 text-center">{phase.wickets}</td>
                      <td className="py-3 text-center">
                        <span className={cn(
                          'px-2 py-0.5 rounded text-xs font-medium',
                          phase.sr >= 150 ? 'bg-success-100 text-success-600' :
                          phase.sr >= 120 ? 'bg-primary-100 text-primary-600' :
                          'bg-warning-100 text-warning-600'
                        )}>
                          {phase.sr.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 text-center text-slate-600 dark:text-slate-400">{phase.avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Scorecards */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-500" />
            Scorecards
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveScorecard('team1')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeScorecard === 'team1'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              )}
            >
              {matchInfo.team1.short} Batting
            </button>
            <button
              onClick={() => setActiveScorecard('team2')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeScorecard === 'team2'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              )}
            >
              {matchInfo.team2.short} Batting
            </button>
          </div>
        </div>

        {/* Batting Scorecard */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 text-left">Batsman</th>
                <th className="py-3 text-center">Runs</th>
                <th className="py-3 text-center">Balls</th>
                <th className="py-3 text-center">4s</th>
                <th className="py-3 text-center">6s</th>
                <th className="py-3 text-center">SR</th>
                <th className="py-3 text-left">Dismissal</th>
              </tr>
            </thead>
            <tbody>
              {(activeScorecard === 'team1' ? battingScorecardTeam1 : battingScorecardTeam2).map((b, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className={cn('w-2 h-2 rounded-full', b.is_out ? 'bg-error-500' : 'bg-success-500')} />
                      <span className={cn('font-medium', b.is_out ? 'text-slate-900 dark:text-white' : 'text-success-600 font-semibold')}>
                        {b.name} {!b.is_out && '*'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-center font-bold text-slate-900 dark:text-white">{b.runs}</td>
                  <td className="py-3 text-center text-slate-600 dark:text-slate-400">{b.balls}</td>
                  <td className="py-3 text-center text-slate-600 dark:text-slate-400">{b.fours}</td>
                  <td className="py-3 text-center text-slate-600 dark:text-slate-400">{b.sixes}</td>
                  <td className="py-3 text-center">
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      b.sr >= 150 ? 'bg-success-100 text-success-600' :
                      b.sr >= 100 ? 'bg-primary-100 text-primary-600' :
                      'bg-warning-100 text-warning-600'
                    )}>
                      {b.sr.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 text-xs">{b.dismissal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bowling Scorecard */}
        <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Bowling - {activeScorecard === 'team1' ? matchInfo.team2.short : matchInfo.team1.short}</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 text-left">Bowler</th>
                <th className="py-3 text-center">Overs</th>
                <th className="py-3 text-center">Maiden</th>
                <th className="py-3 text-center">Runs</th>
                <th className="py-3 text-center">Wkts</th>
                <th className="py-3 text-center">Econ</th>
              </tr>
            </thead>
            <tbody>
              {(activeScorecard === 'team1' ? bowlingScorecardTeam2 : bowlingScorecardTeam1).map((b, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 font-medium text-slate-900 dark:text-white">{b.name}</td>
                  <td className="py-3 text-center text-slate-600 dark:text-slate-400">{b.overs}</td>
                  <td className="py-3 text-center text-slate-600 dark:text-slate-400">{b.maiden}</td>
                  <td className="py-3 text-center text-slate-600 dark:text-slate-400">{b.runs}</td>
                  <td className="py-3 text-center font-bold text-slate-900 dark:text-white">{b.wickets}</td>
                  <td className="py-3 text-center">
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      b.econ <= 8 ? 'bg-success-100 text-success-600' :
                      b.econ <= 10 ? 'bg-primary-100 text-primary-600' :
                      'bg-error-100 text-error-600'
                    )}>
                      {b.econ.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

export default MatchAnalyticsDashboard;
