import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Plus, Search, Filter, Edit, Trash2, Eye, Download,
  ChevronDown, X, Globe, Users, Calendar, Building2
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  established: number;
  ends: string[];
  home_teams: string[];
  matches_hosted: number;
  surface: 'grass' | 'synthetic';
  floodlights: boolean;
  timezone: string;
  status: 'active' | 'inactive' | 'under_construction';
}

const venues: Venue[] = [
  { id: '1', name: 'Wankhede Stadium', city: 'Mumbai', country: 'India', capacity: 33500, established: 1974, ends: ['Pavilion End', 'Garware End'], home_teams: ['Mumbai Indians', 'Mumbai'], matches_hosted: 128, surface: 'grass', floodlights: true, timezone: 'Asia/Kolkata', status: 'active' },
  { id: '2', name: 'M.A. Chidambaram Stadium', city: 'Chennai', country: 'India', capacity: 50000, established: 1916, ends: ['Pavilion End', 'Anna End'], home_teams: ['Chennai Super Kings', 'Tamil Nadu'], matches_hosted: 145, surface: 'grass', floodlights: true, timezone: 'Asia/Kolkata', status: 'active' },
  { id: '3', name: 'M. Chinnaswamy Stadium', city: 'Bangalore', country: 'India', capacity: 40000, established: 1969, ends: ['Pavilion End', 'BEML End'], home_teams: ['Royal Challengers Bangalore', 'Karnataka'], matches_hosted: 112, surface: 'grass', floodlights: true, timezone: 'Asia/Kolkata', status: 'active' },
  { id: '4', name: 'Eden Gardens', city: 'Kolkata', country: 'India', capacity: 66000, established: 1864, ends: ['Pavilion End', 'High Court End'], home_teams: ['Kolkata Knight Riders', 'Bengal'], matches_hosted: 168, surface: 'grass', floodlights: true, timezone: 'Asia/Kolkata', status: 'active' },
  { id: '5', name: 'Arun Jaitley Stadium', city: 'Delhi', country: 'India', capacity: 35000, established: 1883, ends: ['Pavilion End', 'Stadium End'], home_teams: ['Delhi Capitals', 'Delhi'], matches_hosted: 98, surface: 'grass', floodlights: true, timezone: 'Asia/Kolkata', status: 'active' },
  { id: '6', name: 'Sawai Mansingh Stadium', city: 'Jaipur', country: 'India', capacity: 30000, established: 1945, ends: ['Pavilion End', 'City End'], home_teams: ['Rajasthan Royals', 'Rajasthan'], matches_hosted: 76, surface: 'grass', floodlights: true, timezone: 'Asia/Kolkata', status: 'active' },
];

export function VenueManagement() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const filteredVenues = venues.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedItems.length === filteredVenues.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredVenues.map(v => v.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-600';
      case 'inactive': return 'bg-slate-100 text-slate-600';
      case 'under_construction': return 'bg-warning-100 text-warning-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Venues</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage stadiums and grounds</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Venue
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Building2 className="w-4 h-4" />
            <span className="text-xs">Total Venues</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{venues.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs">Total Capacity</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{(venues.reduce((sum, v) => sum + v.capacity, 0) / 1000).toFixed(0)}K</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">Matches Hosted</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{venues.reduce((sum, v) => sum + v.matches_hosted, 0)}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-success-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-xs">Active</span>
          </div>
          <p className="text-2xl font-bold text-success-600">{venues.filter(v => v.status === 'active').length}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search venues..."
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
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'
          )}
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown className={cn('w-4 h-4 transition-transform', showFilters && 'rotate-180')} />
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
                <option>Under Construction</option>
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
              <label className="text-xs font-medium text-slate-500 mb-1 block">Capacity</label>
              <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm">
                <option>Any Capacity</option>
                <option>Under 20,000</option>
                <option>20,000 - 50,000</option>
                <option>Over 50,000</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button className="flex-1 px-4 py-2 rounded-lg bg-primary-500 text-white font-medium text-sm">Apply</button>
              <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 font-medium text-sm">Clear</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVenues.map((venue, i) => (
          <motion.div
            key={venue.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                    {venue.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{venue.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {venue.city}, {venue.country}
                    </p>
                  </div>
                </div>
                <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(venue.status))}>
                  {venue.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{(venue.capacity / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-slate-500">Capacity</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{venue.matches_hosted}</p>
                  <p className="text-xs text-slate-500">Matches</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{venue.established}</p>
                  <p className="text-xs text-slate-500">Est.</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">Timezone: {venue.timezone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={cn(
                    'w-2 h-2 rounded-full',
                    venue.floodlights ? 'bg-success-500' : 'bg-slate-400'
                  )} />
                  <span className="text-slate-600 dark:text-slate-400">
                    {venue.floodlights ? 'Floodlights Available' : 'No Floodlights'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-4">
                {venue.home_teams.slice(0, 2).map((team, idx) => (
                  <span key={idx} className="px-2 py-1 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 text-xs font-medium">
                    {team}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Eye className="w-4 h-4 text-slate-400" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Edit className="w-4 h-4 text-slate-400" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Trash2 className="w-4 h-4 text-error-500" />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

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
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Venue</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Venue Name</label>
                  <input type="text" placeholder="e.g., Wankhede Stadium" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">City</label>
                  <input type="text" placeholder="e.g., Mumbai" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Country</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                    <option>India</option>
                    <option>Australia</option>
                    <option>England</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Timezone</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                    <option>Asia/Kolkata</option>
                    <option>Australia/Sydney</option>
                    <option>Europe/London</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Capacity</label>
                  <input type="number" placeholder="35000" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Established Year</label>
                  <input type="number" placeholder="1974" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Surface</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                    <option>Grass</option>
                    <option>Synthetic</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Floodlights Available</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-700">
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg">
                Add Venue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default VenueManagement;
