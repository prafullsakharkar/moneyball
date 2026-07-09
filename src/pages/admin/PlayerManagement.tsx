import React from 'react';
import { motion } from 'framer-motion';
import {
  User, Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload,
  ChevronDown, X, MapPin, Mail, Phone, Calendar, Trophy
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface Player {
  id: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  batting_style: 'Right-hand' | 'Left-hand';
  bowling_style: string;
  city: string;
  country: string;
  team_id: string;
  team_name: string;
  status: 'active' | 'inactive' | 'injured';
  matches_played: number;
  total_runs: number;
  total_wickets: number;
}

const players: Player[] = [
  { id: '1', name: 'Virat Kohli', email: 'virat@rcb.com', phone: '+91 98765 43210', date_of_birth: '1988-11-05', role: 'Batsman', batting_style: 'Right-hand', bowling_style: 'Right-arm medium', city: 'Delhi', country: 'India', team_id: '3', team_name: 'Royal Challengers Bangalore', status: 'active', matches_played: 237, total_runs: 7263, total_wickets: 4 },
  { id: '2', name: 'MS Dhoni', email: 'msd@csk.com', phone: '+91 98765 43211', date_of_birth: '1981-07-07', role: 'Wicket-keeper', batting_style: 'Right-hand', bowling_style: 'N/A', city: 'Ranchi', country: 'India', team_id: '1', team_name: 'Chennai Super Kings', status: 'active', matches_played: 250, total_runs: 5245, total_wickets: 0 },
  { id: '3', name: 'Rohit Sharma', email: 'rohit@mi.com', phone: '+91 98765 43212', date_of_birth: '1987-04-30', role: 'Batsman', batting_style: 'Right-hand', bowling_style: 'Right-arm off break', city: 'Mumbai', country: 'India', team_id: '2', team_name: 'Mumbai Indians', status: 'active', matches_played: 243, total_runs: 6628, total_wickets: 15 },
  { id: '4', name: 'Jasprit Bumrah', email: 'bumrah@mi.com', phone: '+91 98765 43213', date_of_birth: '1993-12-06', role: 'Bowler', batting_style: 'Right-hand', bowling_style: 'Right-arm fast', city: 'Ahmedabad', country: 'India', team_id: '2', team_name: 'Mumbai Indians', status: 'active', matches_played: 120, total_runs: 56, total_wickets: 145 },
  { id: '5', name: 'Ravindra Jadeja', email: 'jadeja@csk.com', phone: '+91 98765 43214', date_of_birth: '1988-12-06', role: 'All-rounder', batting_style: 'Left-hand', bowling_style: 'Left-arm orthodox', city: 'Jamnagar', country: 'India', team_id: '1', team_name: 'Chennai Super Kings', status: 'active', matches_played: 210, total_runs: 2502, total_wickets: 132 },
  { id: '6', name: 'Hardik Pandya', email: 'hardik@gt.com', phone: '+91 98765 43215', date_of_birth: '1993-10-11', role: 'All-rounder', batting_style: 'Right-hand', bowling_style: 'Right-arm fast-medium', city: 'Surat', country: 'India', team_id: '5', team_name: 'Gujarat Titans', status: 'active', matches_played: 137, total_runs: 2015, total_wickets: 55 },
];

export function PlayerManagement() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showImportModal, setShowImportModal] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'table' | 'cards'>('table');

  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.team_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedItems.length === filteredPlayers.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredPlayers.map(p => p.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Batsman': return 'bg-primary-100 text-primary-600';
      case 'Bowler': return 'bg-cyan-100 text-cyan-600';
      case 'All-rounder': return 'bg-warning-100 text-warning-600';
      case 'Wicket-keeper': return 'bg-success-100 text-success-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-600';
      case 'injured': return 'bg-error-100 text-error-600';
      case 'inactive': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Players</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all players and their profiles</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <Upload className="w-4 h-4" />
            Bulk Import
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Player
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search players by name or team..."
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

        <div className="flex items-center gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => setViewMode('table')}
            className={cn(
              'p-2 rounded-md text-sm font-medium transition-colors',
              viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500'
            )}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={cn(
              'p-2 rounded-md text-sm font-medium transition-colors',
              viewMode === 'cards' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500'
            )}
          >
            Cards
          </button>
        </div>

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
              <label className="text-xs font-medium text-slate-500 mb-1 block">Role</label>
              <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm">
                <option>All Roles</option>
                <option>Batsman</option>
                <option>Bowler</option>
                <option>All-rounder</option>
                <option>Wicket-keeper</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Team</label>
              <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm">
                <option>All Teams</option>
                <option>Chennai Super Kings</option>
                <option>Mumbai Indians</option>
                <option>RCB</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
              <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Injured</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Country</label>
              <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm">
                <option>All Countries</option>
                <option>India</option>
                <option>Australia</option>
                <option>England</option>
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
              Assign Team
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Change Status
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

      {/* Table View */}
      {viewMode === 'table' && (
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredPlayers.length && filteredPlayers.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                  </th>
                  <th className="text-left py-3 px-4">Player</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Team</th>
                  <th className="text-center py-3 px-4">Matches</th>
                  <th className="text-center py-3 px-4">Runs</th>
                  <th className="text-center py-3 px-4">Wickets</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player, i) => (
                  <motion.tr
                    key={player.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn(
                      'border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
                      selectedItems.includes(player.id) && 'bg-primary-50/50 dark:bg-primary-900/10'
                    )}
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(player.id)}
                        onChange={() => handleSelectItem(player.id)}
                        className="w-4 h-4 rounded border-slate-300"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{player.name}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <MapPin className="w-3 h-3" />
                            {player.city}, {player.country}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getRoleColor(player.role))}>
                        {player.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 font-bold text-xs">
                          {player.team_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{player.team_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-slate-900 dark:text-white">{player.matches_played}</td>
                    <td className="py-4 px-4 text-center font-medium text-slate-900 dark:text-white">{player.total_runs.toLocaleString()}</td>
                    <td className="py-4 px-4 text-center font-medium text-slate-900 dark:text-white">{player.total_wickets}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(player.status))}>
                        {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1">
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
            <p className="text-sm text-slate-500">Showing 1-{filteredPlayers.length} of {players.length} players</p>
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
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                'p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer',
                selectedItems.includes(player.id) && 'ring-2 ring-primary-500'
              )}
              onClick={() => handleSelectItem(player.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{player.name}</p>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getRoleColor(player.role))}>
                      {player.role}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(player.id)}
                  onChange={() => handleSelectItem(player.id)}
                  className="w-4 h-4 rounded border-slate-300"
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{player.matches_played}</p>
                  <p className="text-xs text-slate-500">Matches</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{player.total_runs}</p>
                  <p className="text-xs text-slate-500">Runs</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{player.total_wickets}</p>
                  <p className="text-xs text-slate-500">Wickets</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 font-bold text-xs">
                    {player.team_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{player.team_name}</span>
                </div>
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getStatusColor(player.status))}>
                  {player.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Player</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl relative group cursor-pointer">
                  <User className="w-10 h-10" />
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Virat Kohli"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Email</label>
                  <input
                    type="email"
                    placeholder="player@example.com"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Role</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                    <option>Batsman</option>
                    <option>Bowler</option>
                    <option>All-rounder</option>
                    <option>Wicket-keeper</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Batting Style</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                    <option>Right-hand</option>
                    <option>Left-hand</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Bowling Style</label>
                  <input
                    type="text"
                    placeholder="e.g., Right-arm fast"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">City</label>
                  <input
                    type="text"
                    placeholder="e.g., Mumbai"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Country</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                    <option>India</option>
                    <option>Australia</option>
                    <option>England</option>
                    <option>South Africa</option>
                    <option>New Zealand</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Assign to Team</label>
                <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                  <option>Select Team</option>
                  <option>Chennai Super Kings</option>
                  <option>Mumbai Indians</option>
                  <option>Royal Challengers Bangalore</option>
                  <option>Kolkata Knight Riders</option>
                </select>
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
                Add Player
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bulk Import Players</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <button className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-colors text-center">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold text-xs">CSV</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">CSV</p>
                </button>
                <button className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-colors text-center">
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-yellow-600 font-bold text-xs">JSON</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">JSON</p>
                </button>
                <button className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-colors text-center">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold text-xs">XLS</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Excel</p>
                </button>
              </div>

              <div>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded-xl">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                        <span>Select file</span>
                        <input type="file" className="sr-only" accept=".csv,.json,.xlsx" />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">CSV, JSON, or Excel files up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Required Fields:</p>
                <div className="flex flex-wrap gap-2">
                  {['name', 'role', 'batting_style', 'city', 'country'].map(field => (
                    <span key={field} className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400">
                      {field}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full text-sm text-primary-600 hover:text-primary-700">
                Download Template
              </button>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg">
                Import Players
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default PlayerManagement;
