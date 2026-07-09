import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Plus, Search, Filter, Edit, Trash2, Eye, ChevronDown, X,
  Target, Users, Activity, BarChart3, CheckCircle, Clock
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface Innings {
  id: string;
  match_id: string;
  match_name: string;
  innings_number: 1 | 2;
  batting_team: string;
  bowling_team: string;
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  extras: number;
  run_rate: number;
  status: 'in_progress' | 'completed' | 'declared' | 'forfeited';
}

interface BattingScorecard {
  id: string;
  innings_id: string;
  batsman_id: string;
  batsman_name: string;
  team: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strike_rate: number;
  dismissal: string;
  bowler: string;
  fielder?: string;
  out: boolean;
}

interface BowlingScorecard {
  id: string;
  innings_id: string;
  bowler_id: string;
  bowler_name: string;
  team: string;
  overs: number;
  balls: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  extras: { wides: number; no_balls: number };
}

const inningsData: Innings[] = [
  { id: '1', match_id: 'M45', match_name: 'CSK vs MI - Match 45', innings_number: 1, batting_team: 'CSK', bowling_team: 'MI', runs: 165, wickets: 4, overs: 20, balls: 0, extras: 12, run_rate: 8.25, status: 'completed' },
  { id: '2', match_id: 'M45', match_name: 'CSK vs MI - Match 45', innings_number: 2, batting_team: 'MI', bowling_team: 'CSK', runs: 168, wickets: 5, overs: 19.2, balls: 2, extras: 8, run_rate: 8.74, status: 'completed' },
  { id: '3', match_id: 'M46', match_name: 'RCB vs KKR - Match 46', innings_number: 1, batting_team: 'RCB', bowling_team: 'KKR', runs: 182, wickets: 6, overs: 20, balls: 0, extras: 10, run_rate: 9.10, status: 'completed' },
];

const battingScorecards: BattingScorecard[] = [
  { id: 'b1', innings_id: '1', batsman_id: 'p1', batsman_name: 'Ruturaj Gaikwad', team: 'CSK', runs: 67, balls: 48, fours: 8, sixes: 2, strike_rate: 139.58, dismissal: 'caught', bowler: 'Bumrah', out: true },
  { id: 'b2', innings_id: '1', batsman_id: 'p2', batsman_name: 'MS Dhoni', team: 'CSK', runs: 32, balls: 18, fours: 2, sixes: 2, strike_rate: 177.78, dismissal: 'not out', bowler: '', out: false },
  { id: 'b3', innings_id: '1', batsman_id: 'p3', batsman_name: 'Ravindra Jadeja', team: 'CSK', runs: 28, balls: 15, fours: 3, sixes: 1, strike_rate: 186.67, dismissal: 'lbw', bowler: 'Boult', out: true },
  { id: 'b4', innings_id: '2', batsman_id: 'p4', batsman_name: 'Rohit Sharma', team: 'MI', runs: 45, balls: 32, fours: 5, sixes: 2, strike_rate: 140.63, dismissal: 'caught', bowler: 'Jadeja', out: true },
];

const bowlingScorecards: BowlingScorecard[] = [
  { id: 'bw1', innings_id: '1', bowler_id: 'bw1', bowler_name: 'Jasprit Bumrah', team: 'MI', overs: 4, balls: 0, maidens: 0, runs: 28, wickets: 2, economy: 7.00, extras: { wides: 2, no_balls: 0 } },
  { id: 'bw2', innings_id: '1', bowler_id: 'bw2', bowler_name: 'Trent Boult', team: 'MI', overs: 4, balls: 0, maidens: 1, runs: 22, wickets: 1, economy: 5.50, extras: { wides: 1, no_balls: 0 } },
  { id: 'bw3', innings_id: '2', bowler_id: 'bw3', bowler_name: 'Ravindra Jadeja', team: 'CSK', overs: 4, balls: 0, maidens: 0, runs: 32, wickets: 1, economy: 8.00, extras: { wides: 0, no_balls: 1 } },
];

export function ScorecardManagement() {
  const [activeTab, setActiveTab] = React.useState<'innings' | 'batting' | 'bowling'>('innings');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedInnings, setSelectedInnings] = React.useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-600';
      case 'in_progress': return 'bg-primary-100 text-primary-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Scorecard Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View and edit innings, batting, and bowling scorecards</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'innings', label: 'Innings', icon: BarChart3 },
          { id: 'batting', label: 'Batting', icon: Target },
          { id: 'bowling', label: 'Bowling', icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all',
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

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
      </div>

      {/* Innings Tab */}
      {activeTab === 'innings' && (
        <div className="space-y-4">
          {inningsData.map((innings, i) => (
            <motion.div
              key={innings.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedInnings(selectedInnings === innings.id ? null : innings.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg',
                      innings.innings_number === 1 ? 'bg-gradient-to-br from-primary-500 to-cyan-500' : 'bg-gradient-to-br from-warning-500 to-orange-500'
                    )}>
                      {innings.innings_number}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{innings.match_name}</h3>
                      <p className="text-sm text-slate-500">
                        {innings.batting_team} vs {innings.bowling_team}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {innings.runs}/{innings.wickets}
                      </p>
                      <p className="text-sm text-slate-500">{innings.overs}.{innings.balls} overs</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">RR: {innings.run_rate}</p>
                      <p className="text-sm text-slate-500">Extras: {innings.extras}</p>
                    </div>
                    <span className={cn('px-3 py-1 rounded-full text-xs font-medium', getStatusColor(innings.status))}>
                      {innings.status.replace('_', ' ')}
                    </span>
                    <ChevronDown className={cn('w-5 h-5 text-slate-400 transition-transform', selectedInnings === innings.id && 'rotate-180')} />
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedInnings === innings.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveTab('batting'); }}
                        className="px-4 py-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-sm font-medium hover:bg-primary-200"
                      >
                        View Batting Scorecard
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveTab('bowling'); }}
                        className="px-4 py-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 text-sm font-medium hover:bg-cyan-200"
                      >
                        View Bowling Scorecard
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 text-sm font-medium hover:bg-slate-200 ml-auto">
                        <Edit className="w-4 h-4 inline mr-2" />
                        Edit Scorecard
                      </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500">Boundaries</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">18 fours, 6 sixes</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500">Top Scorer</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">Ruturaj Gaikwad (67)</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500">Best Bowler</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">Bumrah (2/28)</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500">Extras</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{innings.extras} runs</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Batting Tab */}
      {activeTab === 'batting' && (
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4">Batsman</th>
                  <th className="text-center py-3 px-4">Runs</th>
                  <th className="text-center py-3 px-4">Balls</th>
                  <th className="text-center py-3 px-4">4s</th>
                  <th className="text-center py-3 px-4">6s</th>
                  <th className="text-center py-3 px-4">SR</th>
                  <th className="text-left py-3 px-4">Dismissal</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {battingScorecards.map((bat, i) => (
                  <tr key={bat.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          {bat.batsman_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{bat.batsman_name}</p>
                          <p className="text-xs text-slate-500">{bat.team}</p>
                        </div>
                        {!bat.out && (
                          <span className="px-2 py-0.5 rounded bg-success-100 text-success-600 text-xs font-bold">* </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-900 dark:text-white text-lg">{bat.runs}</td>
                    <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-400">{bat.balls}</td>
                    <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-400">{bat.fours}</td>
                    <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-400">{bat.sixes}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={cn(
                        'px-2 py-1 rounded text-sm font-medium',
                        bat.strike_rate >= 150 ? 'bg-success-100 text-success-600' :
                        bat.strike_rate >= 100 ? 'bg-primary-100 text-primary-600' :
                        'bg-warning-100 text-warning-600'
                      )}>
                        {bat.strike_rate.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {bat.out ? (
                        <span className="text-slate-600 dark:text-slate-400">
                          {bat.dismissal} {bat.bowler && `b ${bat.bowler}`}
                        </span>
                      ) : (
                        <span className="text-success-600 font-medium">Not Out</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Edit className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Bowling Tab */}
      {activeTab === 'bowling' && (
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4">Bowler</th>
                  <th className="text-center py-3 px-4">Overs</th>
                  <th className="text-center py-3 px-4">Maidens</th>
                  <th className="text-center py-3 px-4">Runs</th>
                  <th className="text-center py-3 px-4">Wickets</th>
                  <th className="text-center py-3 px-4">Economy</th>
                  <th className="text-center py-3 px-4">Extras</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bowlingScorecards.map((bowl) => (
                  <tr key={bowl.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                          {bowl.bowler_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{bowl.bowler_name}</p>
                          <p className="text-xs text-slate-500">{bowl.team}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-900 dark:text-white">
                      {bowl.overs}.{bowl.balls}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-400">{bowl.maidens}</td>
                    <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-400">{bowl.runs}</td>
                    <td className="py-4 px-4 text-center font-bold text-slate-900 dark:text-white">
                      {bowl.wickets}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={cn(
                        'px-2 py-1 rounded text-sm font-medium',
                        bowl.economy <= 6 ? 'bg-success-100 text-success-600' :
                        bowl.economy <= 8 ? 'bg-primary-100 text-primary-600' :
                        'bg-warning-100 text-warning-600'
                      )}>
                        {bowl.economy.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-xs">
                      <span className="text-slate-500">
                        {bowl.extras.wides} wides, {bowl.extras.no_balls} no_balls
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                          <Edit className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

export default ScorecardManagement;
