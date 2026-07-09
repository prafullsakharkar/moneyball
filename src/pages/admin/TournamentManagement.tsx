import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy, Plus, Search, Filter, MoreVertical, Edit, Trash2, Copy, Archive,
  Eye, Download, Upload, ChevronDown, X, Check, Calendar, MapPin, ChevronRight
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { mockTournaments } from '../../lib/mock-data';
import { cn } from '../../lib/utils';

interface Tournament {
  id: string;
  name: string;
  season: string;
  format: string;
  start_date: string;
  end_date: string;
  venue: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  total_teams: number;
  total_matches: number;
}

const tournaments: Tournament[] = [
  { id: '1', name: 'Indian Premier League', season: '2024', format: 'T20', start_date: '2024-03-22', end_date: '2024-05-26', venue: 'India', status: 'completed', total_teams: 10, total_matches: 74 },
  { id: '2', name: 'Big Bash League', season: '2023-24', format: 'T20', start_date: '2023-12-07', end_date: '2024-01-24', venue: 'Australia', status: 'completed', total_teams: 8, total_matches: 44 },
  { id: '3', name: 'ICC Cricket World Cup', season: '2023', format: 'ODI', start_date: '2023-10-05', end_date: '2023-11-19', venue: 'India', status: 'completed', total_teams: 10, total_matches: 48 },
  { id: '4', name: 'T20 World Cup', season: '2024', format: 'T20', start_date: '2024-06-01', end_date: '2024-06-29', venue: 'USA/West Indies', status: 'upcoming', total_teams: 20, total_matches: 55 },
];

export function TournamentManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('table');
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const filteredTournaments = tournaments.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedItems.length === filteredTournaments.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredTournaments.map(t => t.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tournaments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all tournaments</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Tournament
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tournaments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>

        {/* Filters */}
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

        {/* Export */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
          <Download className="w-4 h-4" />
          Export
        </button>

        {/* Import */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
          <Upload className="w-4 h-4" />
          Import
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
              <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm">
                <option>All Status</option>
                <option>Upcoming</option>
                <option>Ongoing</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Format</label>
              <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm">
                <option>All Formats</option>
                <option>T20</option>
                <option>ODI</option>
                <option>Test</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Season</label>
              <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm">
                <option>All Seasons</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
              </select>
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
              Delete
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Archive
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Export
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
                    checked={selectedItems.length === filteredTournaments.length && filteredTournaments.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                </th>
                <th className="text-left py-3 px-4">Tournament</th>
                <th className="text-left py-3 px-4">Season</th>
                <th className="text-left py-3 px-4">Format</th>
                <th className="text-left py-3 px-4">Venue</th>
                <th className="text-center py-3 px-4">Teams</th>
                <th className="text-center py-3 px-4">Matches</th>
                <th className="text-center py-3 px-4">Status</th>
                <th className="text-center py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTournaments.map((tournament, i) => (
                <motion.tr
                  key={tournament.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    'border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
                    selectedItems.includes(tournament.id) && 'bg-primary-50/50 dark:bg-primary-900/10'
                  )}
                >
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(tournament.id)}
                      onChange={() => handleSelectItem(tournament.id)}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => navigate(`/admin/tournaments/${tournament.id}`)}
                      className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                        {tournament.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white flex items-center gap-1">
                          {tournament.name}
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {tournament.start_date} - {tournament.end_date}
                        </div>
                      </div>
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium">
                      {tournament.season}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{tournament.format}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4" />
                      {tournament.venue}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center font-medium text-slate-900 dark:text-white">{tournament.total_teams}</td>
                  <td className="py-4 px-4 text-center font-medium text-slate-900 dark:text-white">{tournament.total_matches}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      tournament.status === 'completed' ? 'bg-success-100 text-success-600' :
                      tournament.status === 'ongoing' ? 'bg-cyan-100 text-cyan-600' :
                      'bg-warning-100 text-warning-600'
                    )}>
                      {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => navigate(`/admin/tournaments/${tournament.id}`)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Edit className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Copy className="w-4 h-4 text-slate-400" />
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
          <p className="text-sm text-slate-500">Showing 1-{filteredTournaments.length} of {tournaments.length} tournaments</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-400">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600">
              2
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
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Tournament</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Tournament Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Indian Premier League"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Season</label>
                  <input
                    type="text"
                    placeholder="e.g., 2024"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Format</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                    <option>T20</option>
                    <option>ODI</option>
                    <option>Test</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Venue</label>
                  <input
                    type="text"
                    placeholder="e.g., India"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Overs per Innings</label>
                  <input
                    type="number"
                    defaultValue={20}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Ball Type</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                    <option>White</option>
                    <option>Red</option>
                    <option>Pink</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the tournament..."
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
                Create Tournament
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default TournamentManagement;
