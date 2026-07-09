import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload,
  ChevronDown, X, MapPin, Clock, Users, Trophy, Play, CheckCircle, AlertCircle
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface Match {
  id: string;
  match_number: number;
  tournament_id: string;
  tournament_name: string;
  team1_id: string;
  team1_name: string;
  team1_short: string;
  team2_id: string;
  team2_name: string;
  team2_short: string;
  venue: string;
  date: string;
  time: string;
  match_type: 'league' | 'qualifier' | 'eliminator' | 'final';
  status: 'scheduled' | 'live' | 'completed' | 'cancelled' | 'postponed';
  result?: string;
  team1_score?: string;
  team2_score?: string;
  toss_winner?: string;
  toss_decision?: 'bat' | 'field';
}

const matches: Match[] = [
  { id: '1', match_number: 1, tournament_id: '1', tournament_name: 'IPL 2024', team1_id: '1', team1_name: 'Chennai Super Kings', team1_short: 'CSK', team2_id: '2', team2_name: 'Mumbai Indians', team2_short: 'MI', venue: 'Wankhede Stadium, Mumbai', date: '2024-03-22', time: '19:30', match_type: 'league', status: 'completed', result: 'CSK won by 6 wickets', team1_score: '158/4', team2_score: '155/8', toss_winner: 'CSK', toss_decision: 'field' },
  { id: '2', match_number: 2, tournament_id: '1', tournament_name: 'IPL 2024', team1_id: '3', team1_name: 'Royal Challengers Bangalore', team1_short: 'RCB', team2_id: '4', team2_name: 'Kolkata Knight Riders', team2_short: 'KKR', venue: 'M. Chinnaswamy Stadium, Bangalore', date: '2024-03-23', time: '19:30', match_type: 'league', status: 'completed', result: 'KKR won by 8 wickets', team1_score: '182/6', team2_score: '186/2', toss_winner: 'KKR', toss_decision: 'field' },
  { id: '3', match_number: 3, tournament_id: '1', tournament_name: 'IPL 2024', team1_id: '5', team1_name: 'Delhi Capitals', team1_short: 'DC', team2_id: '6', team2_name: 'Rajasthan Royals', team2_short: 'RR', venue: 'Arun Jaitley Stadium, Delhi', date: '2024-03-24', time: '15:30', match_type: 'league', status: 'live', team1_score: '145/3 (16.2)', team2_score: '0/0' },
  { id: '4', match_number: 4, tournament_id: '1', tournament_name: 'IPL 2024', team1_id: '1', team1_name: 'Chennai Super Kings', team1_short: 'CSK', team2_id: '3', team2_name: 'Royal Challengers Bangalore', team2_short: 'RCB', venue: 'M.A. Chidambaram Stadium, Chennai', date: '2024-03-25', time: '19:30', match_type: 'league', status: 'scheduled' },
  { id: '5', match_number: 5, tournament_id: '1', tournament_name: 'IPL 2024', team1_id: '2', team1_name: 'Mumbai Indians', team1_short: 'MI', team2_id: '5', team2_name: 'Delhi Capitals', team2_short: 'DC', venue: 'Wankhede Stadium, Mumbai', date: '2024-03-26', time: '19:30', match_type: 'league', status: 'scheduled' },
];

export function MatchManagement() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showFixtureModal, setShowFixtureModal] = React.useState(false);

  const filteredMatches = matches.filter(m =>
    m.team1_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.team2_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.tournament_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedItems.length === filteredMatches.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredMatches.map(m => m.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-error-100 text-error-600';
      case 'completed': return 'bg-success-100 text-success-600';
      case 'scheduled': return 'bg-primary-100 text-primary-600';
      case 'cancelled': return 'bg-slate-100 text-slate-600';
      case 'postponed': return 'bg-warning-100 text-warning-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getMatchTypeColor = (type: string) => {
    switch (type) {
      case 'final': return 'bg-warning-100 text-warning-600 border-warning-300';
      case 'qualifier': return 'bg-cyan-100 text-cyan-600 border-cyan-300';
      case 'eliminator': return 'bg-error-100 text-error-600 border-error-300';
      default: return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Matches</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage match schedules and results</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFixtureModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <Calendar className="w-4 h-4" />
            Generate Fixtures
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Match
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{matches.length}</p>
          <p className="text-xs text-slate-500">Total Matches</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-2xl font-bold text-error-600">{matches.filter(m => m.status === 'live').length}</p>
          <p className="text-xs text-slate-500">Live</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-2xl font-bold text-success-600">{matches.filter(m => m.status === 'completed').length}</p>
          <p className="text-xs text-slate-500">Completed</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-2xl font-bold text-primary-600">{matches.filter(m => m.status === 'scheduled').length}</p>
          <p className="text-xs text-slate-500">Scheduled</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-2xl font-bold text-warning-600">{matches.filter(m => m.status === 'postponed').length}</p>
          <p className="text-xs text-slate-500">Postponed</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by team or tournament..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors',
            showFilters
              ? 'bg-primary-50 border-primary-200 text-primary-600'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          )}
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown className={cn('w-4 h-4 transition-transform', showFilters && 'rotate-180')} />
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
              <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm">
                <option>All Status</option>
                <option>Scheduled</option>
                <option>Live</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Tournament</label>
              <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm">
                <option>All Tournaments</option>
                <option>IPL 2024</option>
                <option>BBL 2023-24</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Match Type</label>
              <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm">
                <option>All Types</option>
                <option>League</option>
                <option>Qualifier</option>
                <option>Eliminator</option>
                <option>Final</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Date Range</label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm"
              />
            </div>
            <div className="flex items-end gap-2">
              <button className="flex-1 px-4 py-2 rounded-lg bg-primary-500 text-white font-medium text-sm">
                Apply
              </button>
              <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 font-medium text-sm">
                Clear
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200"
        >
          <span className="text-sm font-medium text-primary-600">
            {selectedItems.length} selected
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Reschedule
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-sm font-medium text-error-600 hover:bg-slate-50">
              Delete
            </button>
            <button
              onClick={() => setSelectedItems([])}
              className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50"
            >
              <X className="w-4 h-4 text-primary-600" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredMatches.length && filteredMatches.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                </th>
                <th className="text-left py-3 px-4">Match</th>
                <th className="text-left py-3 px-4">Tournament</th>
                <th className="text-left py-3 px-4">Venue</th>
                <th className="text-left py-3 px-4">Date & Time</th>
                <th className="text-center py-3 px-4">Type</th>
                <th className="text-center py-3 px-4">Status</th>
                <th className="text-center py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((match, i) => (
                <motion.tr
                  key={match.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    'border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
                    selectedItems.includes(match.id) && 'bg-primary-50/50 dark:bg-primary-900/10',
                    match.status === 'live' && 'bg-error-50/30 dark:bg-error-900/10'
                  )}
                >
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(match.id)}
                      onChange={() => handleSelectItem(match.id)}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                          {match.team1_short}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{match.team1_short}</span>
                        {match.team1_score && (
                          <span className="text-sm text-slate-600 dark:text-slate-400">{match.team1_score}</span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-bold">VS</span>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                          {match.team2_short}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{match.team2_short}</span>
                        {match.team2_score && match.status !== 'live' && (
                          <span className="text-sm text-slate-600 dark:text-slate-400">{match.team2_score}</span>
                        )}
                      </div>
                    </div>
                    {match.result && (
                      <p className="text-xs text-success-600 mt-1">{match.result}</p>
                    )}
                    {match.status === 'live' && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="w-2 h-2 rounded-full bg-error-500 animate-pulse" />
                        <span className="text-xs text-error-600 font-medium">LIVE</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-warning-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{match.tournament_name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4" />
                      {match.venue}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{match.date}</span>
                      <span className="text-xs text-slate-500">{match.time} IST</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn('px-2 py-1 rounded border text-xs font-medium capitalize', getMatchTypeColor(match.match_type))}>
                      {match.match_type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium capitalize', getStatusColor(match.status))}>
                      {match.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1">
                      {match.status === 'live' && (
                        <button className="p-1.5 rounded-lg bg-error-100 text-error-600 hover:bg-error-200">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Eye className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Edit className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Trash2 className="w-4 h-4 text-error-500" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500">Showing 1-{filteredMatches.length} of {matches.length} matches</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-400">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600">
              Next
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Match</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Tournament</label>
                <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                  <option>Select Tournament</option>
                  <option>IPL 2024</option>
                  <option>BBL 2023-24</option>
                  <option>T20 World Cup 2024</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Team 1</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                    <option>Select Team</option>
                    <option>Chennai Super Kings</option>
                    <option>Mumbai Indians</option>
                    <option>Royal Challengers Bangalore</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Team 2</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                    <option>Select Team</option>
                    <option>Chennai Super Kings</option>
                    <option>Mumbai Indians</option>
                    <option>Royal Challengers Bangalore</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Time (IST)</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Venue</label>
                <input
                  type="text"
                  placeholder="e.g., Wankhede Stadium, Mumbai"
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Match Type</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                    <option>League</option>
                    <option>Qualifier</option>
                    <option>Eliminator</option>
                    <option>Final</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Match Number</label>
                  <input
                    type="number"
                    placeholder="e.g., 1"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Match description..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg">
                Create Match
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Fixture Generator Modal */}
      {showFixtureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Generate Fixtures</h2>
                <button
                  onClick={() => setShowFixtureModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Tournament</label>
                <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                  <option>Select Tournament</option>
                  <option>IPL 2024</option>
                  <option>BBL 2023-24</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Format</label>
                <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                  <option>Double Round Robin</option>
                  <option>Single Round Robin</option>
                  <option>Group Stage + Knockout</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">End Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Include rest days</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <AlertCircle className="w-4 h-4 text-warning-500" />
                  This will generate approximately 56 matches for 8 teams
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowFixtureModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg">
                Generate Fixtures
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default MatchManagement;
