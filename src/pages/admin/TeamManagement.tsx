import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, Plus, Search, Filter, MoreVertical, Edit, Trash2, Copy, Archive,
  Eye, Download, Upload, ChevronDown, X, Check, MapPin, Trophy, User
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { mockTeams } from '../../lib/mock-data';
import { cn } from '../../lib/utils';

interface Team {
  id: string;
  name: string;
  short_name: string;
  city: string;
  country: string;
  home_ground: string;
  founded: number;
  owner: string;
  coach: string;
  captain: string;
  total_players: number;
  tournaments_played: number;
  tournaments_won: number;
  status: 'active' | 'inactive';
}

const teams: Team[] = [
  { id: '1', name: 'Chennai Super Kings', short_name: 'CSK', city: 'Chennai', country: 'India', home_ground: 'M.A. Chidambaram Stadium', founded: 2008, owner: 'Chennai Super Kings Cricket Ltd', coach: 'Stephen Fleming', captain: 'MS Dhoni', total_players: 25, tournaments_played: 14, tournaments_won: 5, status: 'active' },
  { id: '2', name: 'Mumbai Indians', short_name: 'MI', city: 'Mumbai', country: 'India', home_ground: 'Wankhede Stadium', founded: 2008, owner: 'Reliance Industries', coach: 'Mark Boucher', captain: 'Rohit Sharma', total_players: 25, tournaments_played: 14, tournaments_won: 5, status: 'active' },
  { id: '3', name: 'Royal Challengers Bangalore', short_name: 'RCB', city: 'Bangalore', country: 'India', home_ground: 'M. Chinnaswamy Stadium', founded: 2008, owner: 'United Spirits', coach: 'Andy Flower', captain: 'Faf du Plessis', total_players: 25, tournaments_played: 14, tournaments_won: 0, status: 'active' },
  { id: '4', name: 'Kolkata Knight Riders', short_name: 'KKR', city: 'Kolkata', country: 'India', home_ground: 'Eden Gardens', founded: 2008, owner: 'Knight Riders Group', coach: 'Chandrakant Pandit', captain: 'Shreyas Iyer', total_players: 24, tournaments_played: 14, tournaments_won: 2, status: 'active' },
  { id: '5', name: 'Delhi Capitals', short_name: 'DC', city: 'Delhi', country: 'India', home_ground: 'Arun Jaitley Stadium', founded: 2008, owner: 'GMR Group', coach: 'Ricky Ponting', captain: 'Rishabh Pant', total_players: 25, tournaments_played: 14, tournaments_won: 0, status: 'active' },
  { id: '6', name: 'Rajasthan Royals', short_name: 'RR', city: 'Jaipur', country: 'India', home_ground: 'Sawai Mansingh Stadium', founded: 2008, owner: 'Emerging Media', coach: 'Kumar Sangakkara', captain: 'Sanju Samson', total_players: 23, tournaments_played: 14, tournaments_won: 1, status: 'active' },
];

export function TeamManagement() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showImportModal, setShowImportModal] = React.useState(false);

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedItems.length === filteredTeams.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredTeams.map(t => t.id));
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Teams</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all teams and their details</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Team
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams by name or city..."
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
              <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
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
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Tournament</label>
              <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm">
                <option>All Tournaments</option>
                <option>IPL 2024</option>
                <option>BBL 2023-24</option>
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
              Assign to Tournament
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
                    checked={selectedItems.length === filteredTeams.length && filteredTeams.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                </th>
                <th className="text-left py-3 px-4">Team</th>
                <th className="text-left py-3 px-4">City</th>
                <th className="text-left py-3 px-4">Home Ground</th>
                <th className="text-center py-3 px-4">Players</th>
                <th className="text-center py-3 px-4">Tournaments</th>
                <th className="text-center py-3 px-4">Wins</th>
                <th className="text-center py-3 px-4">Status</th>
                <th className="text-center py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team, i) => (
                <motion.tr
                  key={team.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    'border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
                    selectedItems.includes(team.id) && 'bg-primary-50/50 dark:bg-primary-900/10'
                  )}
                >
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(team.id)}
                      onChange={() => handleSelectItem(team.id)}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {team.short_name}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{team.name}</p>
                        <p className="text-xs text-slate-500">Est. {team.founded}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4" />
                      {team.city}, {team.country}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">{team.home_ground}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-1 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 font-medium text-sm">
                      {team.total_players}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center font-medium text-slate-900 dark:text-white">{team.tournaments_played}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="flex items-center justify-center gap-1">
                      <Trophy className="w-4 h-4 text-warning-500" />
                      <span className="font-medium text-slate-900 dark:text-white">{team.tournaments_won}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      team.status === 'active' ? 'bg-success-100 text-success-600' : 'bg-slate-100 text-slate-600'
                    )}>
                      {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
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
                        <User className="w-4 h-4 text-slate-400" />
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
          <p className="text-sm text-slate-500">Showing 1-{filteredTeams.length} of {teams.length} teams</p>
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
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Team</h2>
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
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Team Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Chennai Super Kings"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Short Name</label>
                  <input
                    type="text"
                    placeholder="e.g., CSK"
                    maxLength={5}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">City</label>
                  <input
                    type="text"
                    placeholder="e.g., Chennai"
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
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Home Ground</label>
                <input
                  type="text"
                  placeholder="e.g., M.A. Chidambaram Stadium"
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Founded Year</label>
                  <input
                    type="number"
                    placeholder="e.g., 2008"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Owner</label>
                  <input
                    type="text"
                    placeholder="Owner name"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Coach</label>
                  <input
                    type="text"
                    placeholder="Coach name"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Captain</label>
                <input
                  type="text"
                  placeholder="Captain name"
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Team Logo</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded-xl">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" accept="image/*" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, SVG up to 2MB</p>
                  </div>
                </div>
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
                Create Team
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
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Import Teams</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-colors text-left">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                    <span className="text-green-600 font-bold text-sm">CSV</span>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">CSV Format</p>
                  <p className="text-xs text-slate-500 mt-1">Comma-separated values</p>
                </button>
                <button className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-colors text-left">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-3">
                    <span className="text-yellow-600 font-bold text-sm">JSON</span>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">JSON Format</p>
                  <p className="text-xs text-slate-500 mt-1">Structured JSON data</p>
                </button>
              </div>

              <div className="mt-4">
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded-xl">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                        <span>Select file</span>
                        <input type="file" className="sr-only" accept=".csv,.json" />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">CSV or JSON files up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Required Fields:</p>
                <div className="flex flex-wrap gap-2">
                  {['name', 'short_name', 'city', 'country', 'home_ground'].map(field => (
                    <span key={field} className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400">
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg">
                Import
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default TeamManagement;
