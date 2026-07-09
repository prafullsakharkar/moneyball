import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, Plus, Search, Filter, Edit, Trash2, Eye, ChevronDown, X,
  Mail, Shield, Key, CheckCircle, Clock, AlertCircle, MoreVertical
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface Permission {
  id: string;
  label: string;
  description: string;
  category: 'tournaments' | 'teams' | 'players' | 'matches' | 'scoring' | 'users' | 'analytics';
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  roleName: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastLogin: string;
  createdAt: string;
  avatar?: string;
}

const permissions: Permission[] = [
  { id: 'tournaments.view', label: 'View Tournaments', description: 'View tournament details', category: 'tournaments' },
  { id: 'tournaments.create', label: 'Create Tournaments', description: 'Create new tournaments', category: 'tournaments' },
  { id: 'tournaments.edit', label: 'Edit Tournaments', description: 'Edit tournament details', category: 'tournaments' },
  { id: 'tournaments.delete', label: 'Delete Tournaments', description: 'Delete tournaments', category: 'tournaments' },
  { id: 'teams.view', label: 'View Teams', description: 'View team details', category: 'teams' },
  { id: 'teams.manage', label: 'Manage Teams', description: 'Full team management', category: 'teams' },
  { id: 'players.view', label: 'View Players', description: 'View player profiles', category: 'players' },
  { id: 'players.manage', label: 'Manage Players', description: 'Full player management', category: 'players' },
  { id: 'matches.view', label: 'View Matches', description: 'View match details', category: 'matches' },
  { id: 'matches.manage', label: 'Manage Matches', description: 'Create and edit matches', category: 'matches' },
  { id: 'scoring.view', label: 'View Live Scoring', description: 'View live scores', category: 'scoring' },
  { id: 'scoring.score', label: 'Score Matches', description: 'Edit live scores', category: 'scoring' },
  { id: 'users.view', label: 'View Users', description: 'View user list', category: 'users' },
  { id: 'users.manage', label: 'Manage Users', description: 'Create and edit users', category: 'users' },
  { id: 'analytics.view', label: 'View Analytics', description: 'Access analytics dashboard', category: 'analytics' },
  { id: 'analytics.export', label: 'Export Analytics', description: 'Export analytics data', category: 'analytics' },
];

const roles: Role[] = [
  { id: '1', name: 'Super Admin', description: 'Full system access', permissions: permissions.map(p => p.id), userCount: 2, isSystem: true },
  { id: '2', name: 'Tournament Admin', description: 'Manage tournaments, teams, and matches', permissions: ['tournaments.view', 'tournaments.create', 'tournaments.edit', 'teams.view', 'teams.manage', 'players.view', 'players.manage', 'matches.view', 'matches.manage', 'scoring.view', 'analytics.view'], userCount: 5, isSystem: true },
  { id: '3', name: 'Scorer', description: 'Score matches and view data', permissions: ['tournaments.view', 'teams.view', 'players.view', 'matches.view', 'scoring.view', 'scoring.score', 'analytics.view'], userCount: 12, isSystem: true },
  { id: '4', name: 'Team Manager', description: 'Manage team and player data', permissions: ['tournaments.view', 'teams.view', 'teams.manage', 'players.view', 'players.manage', 'matches.view', 'analytics.view'], userCount: 8, isSystem: false },
  { id: '5', name: 'Viewer', description: 'Read-only access', permissions: ['tournaments.view', 'teams.view', 'players.view', 'matches.view', 'analytics.view'], userCount: 25, isSystem: false },
];

const users: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@cricket.com', phone: '+91 98765 43210', role: '1', roleName: 'Super Admin', status: 'active', lastLogin: '2024-03-21 10:30', createdAt: '2023-01-01' },
  { id: '2', name: 'Tournament Manager', email: 'tournament@cricket.com', phone: '+91 98765 43211', role: '2', roleName: 'Tournament Admin', status: 'active', lastLogin: '2024-03-21 09:15', createdAt: '2023-02-15' },
  { id: '3', name: 'Scorer John', email: 'john.scorer@cricket.com', phone: '+91 98765 43212', role: '3', roleName: 'Scorer', status: 'active', lastLogin: '2024-03-20 18:45', createdAt: '2023-05-10' },
  { id: '4', name: 'Pending User', email: 'pending@cricket.com', phone: '+91 98765 43213', role: '4', roleName: 'Team Manager', status: 'pending', lastLogin: '-', createdAt: '2024-03-19' },
  { id: '5', name: 'Suspended User', email: 'suspended@cricket.com', phone: '+91 98765 43214', role: '5', roleName: 'Viewer', status: 'suspended', lastLogin: '2024-03-01 12:00', createdAt: '2023-06-20' },
  { id: '6', name: 'Inactive User', email: 'inactive@cricket.com', phone: '+91 98765 43215', role: '3', roleName: 'Scorer', status: 'inactive', lastLogin: '2024-01-15 14:30', createdAt: '2023-08-01' },
];

export function UserManagement() {
  const [activeTab, setActiveTab] = React.useState<'users' | 'roles' | 'permissions'>('users');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = React.useState(false);
  const [showCreateRoleModal, setShowCreateRoleModal] = React.useState(false);
  const [expandedRole, setExpandedRole] = React.useState<string | null>(null);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-600';
      case 'pending': return 'bg-warning-100 text-warning-600';
      case 'suspended': return 'bg-error-100 text-error-600';
      case 'inactive': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      tournaments: 'Tournaments',
      teams: 'Teams',
      players: 'Players',
      matches: 'Matches',
      scoring: 'Live Scoring',
      users: 'Users',
      analytics: 'Analytics',
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User & Role Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage users, roles, and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'roles' && (
            <button
              onClick={() => setShowCreateRoleModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Role
            </button>
          )}
          <button
            onClick={() => setShowCreateUserModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'users', label: 'Users', icon: Users },
          { id: 'roles', label: 'Roles', icon: Shield },
          { id: 'permissions', label: 'Permissions', icon: Key },
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

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{users.length}</p>
              <p className="text-xs text-slate-500">Total Users</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-2xl font-bold text-success-600">{users.filter(u => u.status === 'active').length}</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-2xl font-bold text-warning-600">{users.filter(u => u.status === 'pending').length}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-2xl font-bold text-error-600">{users.filter(u => u.status === 'suspended').length}</p>
              <p className="text-xs text-slate-500">Suspended</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-2xl font-bold text-slate-600">{users.filter(u => u.status === 'inactive').length}</p>
              <p className="text-xs text-slate-500">Inactive</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
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
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
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
                    <option>Pending</option>
                    <option>Suspended</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Role</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm">
                    <option>All Roles</option>
                    {roles.map(role => (
                      <option key={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-2 col-span-2">
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

          {/* Users Table */}
          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Contact</th>
                    <th className="text-center py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Last Login</th>
                    <th className="text-center py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                            <p className="text-xs text-slate-500">Created {user.createdAt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium">
                          {user.roleName}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            {user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium capitalize', getStatusColor(user.status))}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">{user.lastLogin}</td>
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
          </GlassCard>
        </motion.div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {roles.map((role) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <GlassCard
                className={cn(
                  'cursor-pointer transition-all',
                  expandedRole === role.id && 'ring-2 ring-primary-500'
                )}
              >
                <div
                  className="flex items-center justify-between"
                  onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      role.isSystem ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-slate-100 dark:bg-slate-800'
                    )}>
                      <Shield className={cn('w-6 h-6', role.isSystem ? 'text-primary-600' : 'text-slate-600')} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{role.name}</h3>
                        {role.isSystem && (
                          <span className="px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-xs font-medium">
                            System
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{role.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Users</p>
                      <p className="font-bold text-slate-900 dark:text-white">{role.userCount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Permissions</p>
                      <p className="font-bold text-slate-900 dark:text-white">{role.permissions.length}</p>
                    </div>
                    <ChevronDown className={cn(
                      'w-5 h-5 text-slate-400 transition-transform',
                      expandedRole === role.id && 'rotate-180'
                    )} />
                  </div>
                </div>

                {expandedRole === role.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned Permissions</h4>
                      {!role.isSystem && (
                        <button className="text-sm text-primary-600 hover:text-primary-700">Edit Permissions</button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {role.permissions.slice(0, 9).map((permId) => {
                        const perm = permissions.find(p => p.id === permId);
                        return perm ? (
                          <div key={permId} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <CheckCircle className="w-4 h-4 text-success-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">{perm.label}</span>
                          </div>
                        ) : null;
                      })}
                      {role.permissions.length > 9 && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <span className="text-sm text-slate-500">+{role.permissions.length - 9} more</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">System Permissions</h3>
              <p className="text-sm text-slate-500">Available permissions categorized by module</p>
            </div>

            {Object.entries(
              permissions.reduce((acc, perm) => {
                if (!acc[perm.category]) acc[perm.category] = [];
                acc[perm.category].push(perm);
                return acc;
              }, {} as Record<string, Permission[]>)
            ).map(([category, perms]) => (
              <div key={category} className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800 last:border-0">
                <h4 className="font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Key className="w-4 h-4 text-primary-500" />
                  {getCategoryLabel(category)}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {perms.map((perm) => (
                    <div key={perm.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <CheckCircle className="w-5 h-5 text-success-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{perm.label}</p>
                        <p className="text-xs text-slate-500">{perm.description}</p>
                        <p className="text-xs text-slate-400 mt-1">ID: {perm.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </GlassCard>
        </motion.div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New User</h2>
                <button
                  onClick={() => setShowCreateUserModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
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

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Email</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Role</label>
                <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                  <option>Select Role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300" defaultChecked />
                <span className="text-sm text-slate-600 dark:text-slate-400">Send welcome email</span>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg">
                Create User
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Custom Role</h2>
                <button
                  onClick={() => setShowCreateRoleModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Role Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Match Editor"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Description</label>
                  <input
                    type="text"
                    placeholder="Brief description"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">Permissions</label>
                <div className="space-y-4">
                  {Object.entries(
                    permissions.reduce((acc, perm) => {
                      if (!acc[perm.category]) acc[perm.category] = [];
                      acc[perm.category].push(perm);
                      return acc;
                    }, {} as Record<string, Permission[]>)
                  ).map(([category, perms]) => (
                    <div key={category} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-3">
                        {getCategoryLabel(category)}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {perms.map((perm) => (
                          <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">{perm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateRoleModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg">
                Create Role
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
