import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Users, User, Calendar, Activity, Upload, CheckCircle, Clock, Zap,
  TrendingUp, AlertTriangle, FileText, Database, RefreshCw, ArrowRight, Plus
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AreaChart, BarChart } from '../components/ui/Charts';
import { chartColors } from '../lib/mock-data';
import { cn } from '../lib/utils';

// Dashboard Stats
const dashboardStats = {
  totalTournaments: 12,
  totalTeams: 28,
  totalPlayers: 521,
  totalMatches: 166,
  pendingMatches: 8,
  completedMatches: 158,
  activeScorers: 5,
  recentImports: 3,
};

const activityFeed = [
  { id: 1, action: 'Tournament created', item: 'IPL 2024', user: 'Admin', time: '5 min ago', type: 'create' },
  { id: 2, action: 'Match scored', item: 'CSK vs MI', user: 'Scorer', time: '15 min ago', type: 'update' },
  { id: 3, action: 'Players imported', item: '125 players', user: 'Admin', time: '1 hour ago', type: 'import' },
  { id: 4, action: 'Team updated', item: 'RCB', user: 'Admin', time: '2 hours ago', type: 'update' },
  { id: 5, action: 'User approved', item: 'scorer@demo.com', user: 'Admin', time: '3 hours ago', type: 'approve' },
];

const notifications = [
  { id: 1, title: 'Pending match approvals', count: 3, priority: 'high' },
  { id: 2, title: 'Import errors requiring attention', count: 2, priority: 'medium' },
  { id: 3, title: 'Analytics rebuild scheduled', count: 1, priority: 'low' },
];

const quickActions = [
  { label: 'Create Tournament', icon: Trophy, path: '/admin/tournaments/create', color: 'from-primary-500 to-cyan-500' },
  { label: 'Create Team', icon: Users, path: '/admin/teams/create', color: 'from-success-500 to-emerald-500' },
  { label: 'Add Player', icon: User, path: '/admin/players/create', color: 'from-warning-500 to-orange-500' },
  { label: 'Create Match', icon: Calendar, path: '/admin/matches/create', color: 'from-cyan-500 to-blue-500' },
  { label: 'Import Data', icon: Upload, path: '/admin/import', color: 'from-purple-500 to-indigo-500' },
  { label: 'Rebuild Analytics', icon: RefreshCw, path: '/admin/analytics', color: 'from-error-500 to-red-500' },
];

const systemHealth = [
  { label: 'API Response', value: '145ms', status: 'good' },
  { label: 'Database', value: '99.9%', status: 'good' },
  { label: 'Background Jobs', value: '24/28', status: 'warning' },
  { label: 'Storage', value: '42%', status: 'good' },
];

export function AdminPortal() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Last updated: 2 min ago</span>
          <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <RefreshCw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {[
          { label: 'Tournaments', value: dashboardStats.totalTournaments, icon: Trophy, color: 'text-primary-600' },
          { label: 'Teams', value: dashboardStats.totalTeams, icon: Users, color: 'text-cyan-600' },
          { label: 'Players', value: dashboardStats.totalPlayers, icon: User, color: 'text-success-600' },
          { label: 'Matches', value: dashboardStats.totalMatches, icon: Calendar, color: 'text-warning-500' },
          { label: 'Pending', value: dashboardStats.pendingMatches, icon: Clock, color: 'text-orange-500' },
          { label: 'Completed', value: dashboardStats.completedMatches, icon: CheckCircle, color: 'text-success-600' },
          { label: 'Scorers', value: dashboardStats.activeScorers, icon: Activity, color: 'text-purple-500' },
          { label: 'Imports', value: dashboardStats.recentImports, icon: Upload, color: 'text-cyan-500' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={cn('w-5 h-5', stat.color)} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickActions.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-gradient-to-br border-2 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all group"
            onClick={() => console.log(action.path)}
          >
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br',
              action.color
            )}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white text-left">{action.label}</p>
            <div className="flex items-center gap-1 mt-1 text-slate-500 group-hover:text-primary-600 transition-colors">
              <span className="text-xs">Create</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700">View All</button>
            </div>
            <div className="space-y-3">
              {activityFeed.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    activity.type === 'create' ? 'bg-success-100 text-success-600' :
                    activity.type === 'import' ? 'bg-cyan-100 text-cyan-600' :
                    activity.type === 'approve' ? 'bg-primary-100 text-primary-600' :
                    'bg-warning-100 text-warning-600'
                  )}>
                    {activity.type === 'create' && <Plus className="w-5 h-5" />}
                    {activity.type === 'import' && <Upload className="w-5 h-5" />}
                    {activity.type === 'approve' && <CheckCircle className="w-5 h-5" />}
                    {activity.type === 'update' && <Activity className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{activity.action}</p>
                    <p className="text-sm text-slate-500">{activity.item} by {activity.user}</p>
                  </div>
                  <span className="text-xs text-slate-400">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Activity Chart */}
          <GlassCard className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Activity Overview</h3>
            <div className="h-48">
              <AreaChart
                data={[45, 52, 38, 64, 48, 72, 68, 85, 92, 78, 95, 88]}
                categories={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
                title=""
                height={180}
              />
            </div>
          </GlassCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notifications Panel */}
          <GlassCard gradient>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-warning-500/20">
                <AlertTriangle className="w-5 h-5 text-warning-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                <p className="text-xs text-slate-500">Action required</p>
              </div>
            </div>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'p-3 rounded-xl border-l-4',
                    n.priority === 'high' ? 'bg-error-50 dark:bg-error-900/20 border-error-500' :
                    n.priority === 'medium' ? 'bg-warning-50 dark:bg-warning-900/20 border-warning-500' :
                    'bg-slate-50 dark:bg-slate-800/50 border-slate-400'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</p>
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-bold',
                      n.priority === 'high' ? 'bg-error-100 text-error-600' :
                      n.priority === 'medium' ? 'bg-warning-100 text-warning-600' :
                      'bg-slate-100 text-slate-600'
                    )}>
                      {n.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* System Health */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-success-500/20">
                <Zap className="w-5 h-5 text-success-600" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">System Health</h3>
            </div>
            <div className="space-y-3">
              {systemHealth.map((s) => (
                <div key={s.label} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{s.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{s.value}</span>
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      s.status === 'good' ? 'bg-success-500' : 'bg-warning-500'
                    )} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Pending Tasks */}
          <GlassCard>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Pending Tasks</h3>
            <div className="space-y-2">
              {[
                { task: 'Approve 3 pending users', urgent: true },
                { task: 'Fix 2 import errors', urgent: true },
                { task: 'Schedule analytics rebuild', urgent: false },
                { task: 'Update tournament fixtures', urgent: false },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                  <span className={cn(
                    'text-sm flex-1',
                    t.urgent ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400'
                  )}>
                    {t.task}
                  </span>
                  {t.urgent && (
                    <span className="px-2 py-0.5 rounded bg-error-100 text-error-600 text-xs">Urgent</span>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default AdminPortal;
