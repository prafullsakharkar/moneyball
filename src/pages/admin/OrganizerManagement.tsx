import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Plus, Search, Filter, Edit, Trash2, Eye, ChevronDown, X,
  Mail, Phone, Globe, MapPin, Calendar, Award, Users, DollarSign
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface Organizer {
  id: string;
  name: string;
  type: 'board' | 'franchise' | 'league' | 'club';
  country: string;
  city: string;
  established: number;
  contact_email: string;
  contact_phone: string;
  website: string;
  tournaments_organized: number;
  active_tournaments: number;
  total_revenue: number;
  logo_url?: string;
  status: 'active' | 'inactive' | 'suspended';
}

const organizers: Organizer[] = [
  {
    id: '1',
    name: 'Board of Control for Cricket in India',
    type: 'board',
    country: 'India',
    city: 'Mumbai',
    established: 1928,
    contact_email: 'secretary@bcci.tv',
    contact_phone: '+91 22 2280 1234',
    website: 'https://www.bcci.tv',
    tournaments_organized: 156,
    active_tournaments: 5,
    total_revenue: 25000,
    status: 'active'
  },
  {
    id: '2',
    name: 'Chennai Super Kings Cricket',
    type: 'franchise',
    country: 'India',
    city: 'Chennai',
    established: 2008,
    contact_email: 'info@chennaisuperkings.com',
    contact_phone: '+91 44 2345 6789',
    website: 'https://www.chennaisuperkings.com',
    tournaments_organized: 16,
    active_tournaments: 1,
    total_revenue: 3200,
    status: 'active'
  },
  {
    id: '3',
    name: 'Indian Premier League',
    type: 'league',
    country: 'India',
    city: 'Mumbai',
    established: 2008,
    contact_email: 'contact@iplt20.com',
    contact_phone: '+91 22 2280 5678',
    website: 'https://www.iplt20.com',
    tournaments_organized: 17,
    active_tournaments: 1,
    total_revenue: 12500,
    status: 'active'
  },
  {
    id: '4',
    name: 'Mumbai Cricket Association',
    type: 'board',
    country: 'India',
    city: 'Mumbai',
    established: 1930,
    contact_email: 'info@mumbaicricket.com',
    contact_phone: '+91 22 2234 5678',
    website: 'https://www.mumbaicricket.com',
    tournaments_organized: 45,
    active_tournaments: 2,
    total_revenue: 850,
    status: 'active'
  },
  {
    id: '5',
    name: 'Royal Challengers Sports',
    type: 'franchise',
    country: 'India',
    city: 'Bangalore',
    established: 2008,
    contact_email: 'info@rcb.com',
    contact_phone: '+91 80 2345 6789',
    website: 'https://www.royalchallengers.com',
    tournaments_organized: 16,
    active_tournaments: 1,
    total_revenue: 2800,
    status: 'active'
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'board': return 'bg-primary-100 text-primary-600';
    case 'franchise': return 'bg-cyan-100 text-cyan-600';
    case 'league': return 'bg-warning-100 text-warning-600';
    case 'club': return 'bg-success-100 text-success-600';
    default: return 'bg-slate-100 text-slate-600';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-success-100 text-success-600';
    case 'inactive': return 'bg-slate-100 text-slate-600';
    case 'suspended': return 'bg-error-100 text-error-600';
    default: return 'bg-slate-100 text-slate-600';
  }
};

export function OrganizerManagement() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<string>('all');

  const filteredOrganizers = organizers.filter(o => {
    if (selectedType !== 'all' && o.type !== selectedType) return false;
    return o.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Organizers</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage cricket boards, franchises, and leagues</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Organizer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{organizers.length}</p>
          <p className="text-xs text-slate-500">Total Organizers</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-2xl font-bold text-primary-600">{organizers.filter(o => o.type === 'board').length}</p>
          <p className="text-xs text-slate-500">Boards</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-2xl font-bold text-cyan-600">{organizers.filter(o => o.type === 'franchise').length}</p>
          <p className="text-xs text-slate-500">Franchises</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-2xl font-bold text-warning-600">{organizers.filter(o => o.type === 'league').length}</p>
          <p className="text-xs text-slate-500">Leagues</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-2xl font-bold text-success-600">{organizers.filter(o => o.status === 'active').length}</p>
          <p className="text-xs text-slate-500">Active</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search organizers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'board', 'franchise', 'league'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                'px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                selectedType === type
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
              )}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Organizers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrganizers.map((organizer, i) => (
          <motion.div
            key={organizer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {organizer.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">{organizer.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium capitalize', getTypeColor(organizer.type))}>
                        {organizer.type}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={cn('px-2 py-1 rounded-full text-xs font-medium capitalize', getStatusColor(organizer.status))}>
                  {organizer.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {organizer.city}, {organizer.country}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {organizer.contact_email}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <a href={organizer.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                    {organizer.website.replace('https://www.', '')}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{organizer.tournaments_organized}</p>
                  <p className="text-xs text-slate-500">Total</p>
                </div>
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-center">
                  <p className="text-lg font-bold text-primary-600">{organizer.active_tournaments}</p>
                  <p className="text-xs text-slate-500">Active</p>
                </div>
                <div className="p-2 rounded-lg bg-success-50 dark:bg-success-900/20 text-center">
                  <p className="text-lg font-bold text-success-600">{(organizer.total_revenue / 1000).toFixed(0)}Cr</p>
                  <p className="text-xs text-slate-500">Revenue</p>
                </div>
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
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Organizer</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Organization Name</label>
                <input type="text" placeholder="e.g., Board of Control for Cricket in India" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Type</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                    <option value="board">Cricket Board</option>
                    <option value="franchise">Franchise</option>
                    <option value="league">League</option>
                    <option value="club">Club</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Established</label>
                  <input type="number" placeholder="e.g., 1928" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Country</label>
                  <input type="text" placeholder="e.g., India" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">City</label>
                  <input type="text" placeholder="e.g., Mumbai" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Contact Email</label>
                <input type="email" placeholder="e.g., info@organization.com" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Contact Phone</label>
                <input type="tel" placeholder="+91 22 2280 1234" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Website</label>
                <input type="url" placeholder="https://www.example.com" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-medium">
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg">
                Add Organizer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default OrganizerManagement;
