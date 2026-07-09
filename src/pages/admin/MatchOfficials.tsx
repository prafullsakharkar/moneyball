import React from 'react';
import { motion } from 'framer-motion';
import {
  User, Plus, Search, Filter, Edit, Trash2, Eye, ChevronDown, X,
  Award, Flag, Star, Calendar, MapPin
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface Official {
  id: string;
  name: string;
  role: 'umpire' | 'referee' | 'scorer' | 'match_referee';
  country: string;
  experience_years: number;
  matches_officiated: number;
  tournaments: string[];
  certifications: string[];
  status: 'active' | 'inactive' | 'on_leave';
  rating: number;
}

const officials: Official[] = [
  { id: '1', name: 'Nitin Menon', role: 'umpire', country: 'India', experience_years: 8, matches_officiated: 145, tournaments: ['IPL', 'World Cup', 'Asia Cup'], certifications: ['ICC Elite Panel', 'BCCI Grade A'], status: 'active', rating: 4.8 },
  { id: '2', name: 'Richard Illingworth', role: 'umpire', country: 'England', experience_years: 12, matches_officiated: 198, tournaments: ['IPL', 'World Cup', 'Ashes'], certifications: ['ICC Elite Panel', 'ECB Level 3'], status: 'active', rating: 4.7 },
  { id: '3', name: 'Javagal Srinath', role: 'match_referee', country: 'India', experience_years: 15, matches_officiated: 250, tournaments: ['IPL', 'World Cup', 'Bilateral Series'], certifications: ['ICC Match Referee', 'Former Player'], status: 'active', rating: 4.9 },
  { id: '4', name: 'Simon Taufel', role: 'umpire', country: 'Australia', experience_years: 18, matches_officiated: 320, tournaments: ['IPL', 'World Cup', 'BBL'], certifications: ['ICC Elite Panel', 'CA Level 4'], status: 'inactive', rating: 4.9 },
  { id: '5', name: 'S. Ravi', role: 'scorer', country: 'India', experience_years: 10, matches_officiated: 180, tournaments: ['IPL', 'Ranji Trophy'], certifications: ['BCCI Certified Scorer'], status: 'active', rating: 4.5 },
];

const getRoleColor = (role: string) => {
  switch (role) {
    case 'umpire': return 'bg-primary-100 text-primary-600';
    case 'referee': return 'bg-warning-100 text-warning-600';
    case 'scorer': return 'bg-cyan-100 text-cyan-600';
    case 'match_referee': return 'bg-success-100 text-success-600';
    default: return 'bg-slate-100 text-slate-600';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-success-100 text-success-600';
    case 'inactive': return 'bg-slate-100 text-slate-600';
    case 'on_leave': return 'bg-warning-100 text-warning-600';
    default: return 'bg-slate-100 text-slate-600';
  }
};

export function MatchOfficials() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<string>('all');

  const filteredOfficials = officials.filter(o => {
    if (selectedRole !== 'all' && o.role !== selectedRole) return false;
    return o.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Match Officials</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage umpires, referees, and scorers</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Official
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Officials', value: officials.length, color: 'text-slate-900 dark:text-white' },
          { label: 'Umpires', value: officials.filter(o => o.role === 'umpire').length, color: 'text-primary-600' },
          { label: 'Referees', value: officials.filter(o => o.role === 'match_referee').length, color: 'text-success-600' },
          { label: 'Scorers', value: officials.filter(o => o.role === 'scorer').length, color: 'text-cyan-600' },
          { label: 'Active', value: officials.filter(o => o.status === 'active').length, color: 'text-success-600' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search officials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'umpire', 'match_referee', 'scorer'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                selectedRole === role
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              )}
            >
              {role === 'all' ? 'All' : role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Officials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOfficials.map((official, i) => (
          <motion.div
            key={official.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                    {official.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{official.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium capitalize', getRoleColor(official.role))}>
                        {official.role.replace('_', ' ')}
                      </span>
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium capitalize', getStatusColor(official.status))}>
                        {official.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{official.matches_officiated}</p>
                  <p className="text-xs text-slate-500">Matches</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{official.experience_years}</p>
                  <p className="text-xs text-slate-500">Years</p>
                </div>
                <div className="p-2 rounded-lg bg-warning-50 dark:bg-warning-900/20 text-center">
                  <p className="text-lg font-bold text-warning-600">{official.rating}</p>
                  <p className="text-xs text-slate-500">Rating</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">Certifications</p>
                <div className="flex flex-wrap gap-1">
                  {official.certifications.map((cert, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-xs font-medium">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">Key Tournaments</p>
                <div className="flex flex-wrap gap-1">
                  {official.tournaments.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs">
                      {t}
                    </span>
                  ))}
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
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Official</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Full Name</label>
                <input type="text" placeholder="e.g., Nitin Menon" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Role</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                    <option value="umpire">Umpire</option>
                    <option value="match_referee">Match Referee</option>
                    <option value="scorer">Scorer</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Country</label>
                  <input type="text" placeholder="e.g., India" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Experience (Years)</label>
                  <input type="number" placeholder="e.g., 5" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Status</label>
                  <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-medium">
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg">
                Add Official
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default MatchOfficials;
