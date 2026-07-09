import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Search, Filter, ChevronDown, Eye, Download, RefreshCw,
  User, Trophy, Users, Calendar, Activity, Settings, Shield, AlertCircle,
  CheckCircle, Clock, X
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userEmail: string;
  action: string;
  category: 'tournaments' | 'teams' | 'players' | 'matches' | 'scoring' | 'users' | 'settings';
  entityType: string;
  entityId: string;
  entityName: string;
  details: string;
  ip: string;
  status: 'success' | 'failed' | 'warning';
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

const auditLogs: AuditLog[] = [
  { id: '1', timestamp: '2024-03-21 14:32:15', user: 'Admin User', userEmail: 'admin@cricket.com', action: 'CREATE', category: 'tournaments', entityType: 'Tournament', entityId: 'T001', entityName: 'IPL 2024', details: 'Created new tournament', ip: '192.168.1.100', status: 'success', changes: [{ field: 'name', oldValue: '', newValue: 'IPL 2024' }, { field: 'teams', oldValue: '', newValue: '10' }] },
  { id: '2', timestamp: '2024-03-21 14:28:42', user: 'Admin User', userEmail: 'admin@cricket.com', action: 'UPDATE', category: 'teams', entityType: 'Team', entityId: 'TM001', entityName: 'Chennai Super Kings', details: 'Updated team captain', ip: '192.168.1.100', status: 'success', changes: [{ field: 'captain', oldValue: 'Ravindra Jadeja', newValue: 'MS Dhoni' }] },
  { id: '3', timestamp: '2024-03-21 14:15:00', user: 'Scorer John', userEmail: 'john@cricket.com', action: 'SCORE', category: 'scoring', entityType: 'Match', entityId: 'M045', entityName: 'CSK vs MI', details: 'Updated live score', ip: '192.168.1.105', status: 'success' },
  { id: '4', timestamp: '2024-03-21 13:55:30', user: 'Admin User', userEmail: 'admin@cricket.com', action: 'IMPORT', category: 'players', entityType: 'Players', entityId: 'BATCH-2024-03', entityName: '250 Players', details: 'Bulk import completed', ip: '192.168.1.100', status: 'warning', changes: [{ field: 'success', oldValue: '', newValue: '248' }, { field: 'failed', oldValue: '', newValue: '2' }] },
  { id: '5', timestamp: '2024-03-21 13:40:12', user: 'Tournament Manager', userEmail: 'tourn@cricket.com', action: 'DELETE', category: 'matches', entityType: 'Match', entityId: 'M044', entityName: 'Old Match', details: 'Deleted cancelled match', ip: '192.168.1.102', status: 'success' },
  { id: '6', timestamp: '2024-03-21 13:25:45', user: 'Team Manager', userEmail: 'team@cricket.com', action: 'UPDATE', category: 'players', entityType: 'Player', entityId: 'P125', entityName: 'Virat Kohli', details: 'Updated player profile', ip: '192.168.1.103', status: 'success', changes: [{ field: 'status', oldValue: 'inactive', newValue: 'active' }] },
  { id: '7', timestamp: '2024-03-21 12:50:20', user: 'Admin User', userEmail: 'admin@cricket.com', action: 'CREATE', category: 'users', entityType: 'User', entityId: 'U100', entityName: 'newuser@cricket.com', details: 'Created new user account', ip: '192.168.1.100', status: 'success' },
  { id: '8', timestamp: '2024-03-21 12:30:00', user: 'System', userEmail: 'system@cricket.com', action: 'SYSTEM', category: 'settings', entityType: 'Analytics', entityId: 'REBUILD', entityName: 'Analytics Rebuild', details: 'Scheduled analytics rebuild completed', ip: '127.0.0.1', status: 'success' },
  { id: '9', timestamp: '2024-03-21 11:45:33', user: 'Unknown', userEmail: 'unknown@test.com', action: 'LOGIN_ATTEMPT', category: 'users', entityType: 'Auth', entityId: 'AUTH', entityName: 'Authentication', details: 'Failed login attempt', ip: '10.0.0.55', status: 'failed' },
  { id: '10', timestamp: '2024-03-21 10:20:15', user: 'Admin User', userEmail: 'admin@cricket.com', action: 'UPDATE', category: 'settings', entityType: 'Settings', entityId: 'SYS-SET', entityName: 'System Settings', details: 'Updated notification settings', ip: '192.168.1.100', status: 'success' },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'tournaments': return Trophy;
    case 'teams': return Users;
    case 'players': return User;
    case 'matches': return Calendar;
    case 'scoring': return Activity;
    case 'users': return Shield;
    case 'settings': return Settings;
    default: return FileText;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'tournaments': return 'bg-warning-100 text-warning-600';
    case 'teams': return 'bg-cyan-100 text-cyan-600';
    case 'players': return 'bg-success-100 text-success-600';
    case 'matches': return 'bg-primary-100 text-primary-600';
    case 'scoring': return 'bg-error-100 text-error-600';
    case 'users': return 'bg-purple-100 text-purple-600';
    case 'settings': return 'bg-slate-100 text-slate-600';
    default: return 'bg-slate-100 text-slate-600';
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case 'CREATE': return 'bg-success-100 text-success-600';
    case 'UPDATE': return 'bg-primary-100 text-primary-600';
    case 'DELETE': return 'bg-error-100 text-error-600';
    case 'IMPORT': return 'bg-cyan-100 text-cyan-600';
    case 'SCORE': return 'bg-warning-100 text-warning-600';
    case 'SYSTEM': return 'bg-slate-100 text-slate-600';
    case 'LOGIN_ATTEMPT': return 'bg-warning-100 text-warning-600';
    default: return 'bg-slate-100 text-slate-600';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success': return <CheckCircle className="w-4 h-4 text-success-500" />;
    case 'failed': return <AlertCircle className="w-4 h-4 text-error-500" />;
    case 'warning': return <AlertCircle className="w-4 h-4 text-warning-500" />;
    default: return <Clock className="w-4 h-4 text-slate-500" />;
  }
};

export function AuditLogs() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null);
  const [dateRange, setDateRange] = React.useState({ start: '', end: '' });

  const [filters, setFilters] = React.useState({
    category: 'all',
    action: 'all',
    status: 'all',
    user: '',
  });

  const filteredLogs = auditLogs.filter(log => {
    if (filters.category !== 'all' && log.category !== filters.category) return false;
    if (filters.action !== 'all' && log.action !== filters.action) return false;
    if (filters.status !== 'all' && log.status !== filters.status) return false;
    if (filters.user && !log.user.toLowerCase().includes(filters.user.toLowerCase())) return false;
    if (searchQuery && !log.details.toLowerCase().includes(searchQuery.toLowerCase()) && !log.entityName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Audit Logs</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track all system activities and changes</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{auditLogs.length}</p>
          <p className="text-xs text-slate-500">Total Events</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-2xl font-bold text-success-600">{auditLogs.filter(l => l.status === 'success').length}</p>
          <p className="text-xs text-slate-500">Success</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-2xl font-bold text-warning-600">{auditLogs.filter(l => l.status === 'warning').length}</p>
          <p className="text-xs text-slate-500">Warnings</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-2xl font-bold text-error-600">{auditLogs.filter(l => l.status === 'failed').length}</p>
          <p className="text-xs text-slate-500">Failures</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1">
            <Shield className="w-5 h-5 text-primary-600" />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{new Set(auditLogs.map(l => l.user)).size}</p>
          </div>
          <p className="text-xs text-slate-500">Active Users</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search logs..."
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="tournaments">Tournaments</option>
                <option value="teams">Teams</option>
                <option value="players">Players</option>
                <option value="matches">Matches</option>
                <option value="scoring">Scoring</option>
                <option value="users">Users</option>
                <option value="settings">Settings</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Action</label>
              <select
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm"
              >
                <option value="all">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="IMPORT">Import</option>
                <option value="SCORE">Score</option>
                <option value="SYSTEM">System</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="warning">Warning</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">User</label>
              <input
                type="text"
                placeholder="Filter by user"
                value={filters.user}
                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 text-sm"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={() => setFilters({ category: 'all', action: 'all', status: 'all', user: '' })}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 font-medium text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Logs Table */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4">Timestamp</th>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Action</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Entity</th>
                <th className="text-left py-3 px-4">Details</th>
                <th className="text-center py-3 px-4">Status</th>
                <th className="text-center py-3 px-4">View</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, i) => {
                const CategoryIcon = getCategoryIcon(log.category);
                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{log.timestamp.split(' ')[1]}</div>
                      <div className="text-xs text-slate-500">{log.timestamp.split(' ')[0]}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{log.user}</p>
                        <p className="text-xs text-slate-500">{log.userEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={cn('px-2 py-1 rounded text-xs font-medium', getActionColor(log.action))}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', getCategoryColor(log.category))}>
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{log.entityName}</p>
                        <p className="text-xs text-slate-500">{log.entityType}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="max-w-[200px]">
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{log.details}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {getStatusIcon(log.status)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <Eye className="w-4 h-4 text-slate-400" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500">Showing {filteredLogs.length} of {auditLogs.length} logs</p>
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

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', getCategoryColor(selectedLog.category))}>
                    {React.createElement(getCategoryIcon(selectedLog.category), { className: 'w-5 h-5' })}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Activity Details</h2>
                    <p className="text-sm text-slate-500">{selectedLog.timestamp}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-500 mb-1">User</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedLog.user}</p>
                  <p className="text-sm text-slate-500">{selectedLog.userEmail}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-500 mb-1">IP Address</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedLog.ip}</p>
                </div>
              </div>

              {/* Action Details */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-4 mb-3">
                  <span className={cn('px-3 py-1 rounded text-sm font-medium', getActionColor(selectedLog.action))}>
                    {selectedLog.action}
                  </span>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(selectedLog.status)}
                    <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">{selectedLog.status}</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Entity Type</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedLog.entityType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Entity ID</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedLog.entityId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Entity Name</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedLog.entityName}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</p>
                <p className="text-slate-600 dark:text-slate-400">{selectedLog.details}</p>
              </div>

              {/* Changes */}
              {selectedLog.changes && selectedLog.changes.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Changes</p>
                  <div className="space-y-2">
                    {selectedLog.changes.map((change, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500 mb-1">{change.field}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 p-2 rounded-lg bg-warning-100/50 dark:bg-warning-900/20">
                            <p className="text-xs text-slate-500">Old</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 break-all">{change.oldValue || '(empty)'}</p>
                          </div>
                          <div className="text-slate-400">→</div>
                          <div className="flex-1 p-2 rounded-lg bg-success-100/50 dark:bg-success-900/20">
                            <p className="text-xs text-slate-500">New</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 break-all">{change.newValue}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Close
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AuditLogs;
