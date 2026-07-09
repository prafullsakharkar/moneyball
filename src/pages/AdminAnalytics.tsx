import React from 'react';
import { motion } from 'framer-motion';
import { Users, Database, Activity, BarChart3, Shield, Clock, TrendingUp, AlertTriangle, CheckCircle, Server } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { BarChart, AreaChart, LineChart } from '../components/ui/Charts';
import { chartColors } from '../lib/mock-data';
import { cn } from '../lib/utils';

// Admin Analytics Mock Data
const systemMetrics = {
  uptime: '99.97%',
  avgResponseTime: '145ms',
  totalRequests: '2.4M',
  errorRate: '0.12%',
  activeUsers: 1247,
  peakConcurrency: 842,
};

const apiPerformance = [
  { endpoint: '/api/matches', avgTime: '45ms', successRate: 99.8, calls: '425K' },
  { endpoint: '/api/players', avgTime: '38ms', successRate: 99.9, calls: '312K' },
  { endpoint: '/api/stats', avgTime: '156ms', successRate: 99.5, calls: '89K' },
  { endpoint: '/api/predictions', avgTime: '234ms', successRate: 98.9, calls: '45K' },
];

const dataQuality = {
  completeness: 98.5,
  accuracy: 97.8,
  timeliness: 99.2,
  consistency: 96.7,
};

const userActivity = [
  { hour: '00:00', users: 245 },
  { hour: '04:00', users: 128 },
  { hour: '08:00', users: 456 },
  { hour: '12:00', users: 892 },
  { hour: '16:00', users: 1247 },
  { hour: '20:00', users: 1105 },
];

const recentAlerts = [
  { id: 1, severity: 'warning', message: 'API rate limit approaching for user segment', time: '2 min ago', resolved: false },
  { id: 2, severity: 'info', message: 'Scheduled maintenance completed successfully', time: '15 min ago', resolved: true },
  { id: 3, severity: 'critical', message: 'Database connection pool exhausted briefly', time: '1 hour ago', resolved: true },
  { id: 4, severity: 'warning', message: 'High memory usage detected on server-2', time: '2 hours ago', resolved: true },
];

const dataSync = [
  { source: 'Live Match Feed', lastSync: '30s ago', status: 'active', interval: '30s' },
  { source: 'Player Stats DB', lastSync: '5m ago', status: 'active', interval: '5m' },
  { source: 'Historical Data', lastSync: '24h ago', status: 'active', interval: '24h' },
  { source: 'Prediction Models', lastSync: '1h ago', status: 'active', interval: '1h' },
];

// Sub-components
function SystemOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="System Uptime" value="99.97" suffix="%" icon={<Activity className="w-6 h-6" />} accent />
        <KPIWidget title="Avg Response" value="145" suffix="ms" icon={<Clock className="w-6 h-6" />} />
        <KPIWidget title="Total Requests" value="2.4" suffix="M" icon={<TrendingUp className="w-6 h-6" />} />
        <KPIWidget title="Error Rate" value="0.12" suffix="%" icon={<AlertTriangle className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Request Volume (24h)</h3>
          <div className="h-48">
            <AreaChart
              data={userActivity.map(u => u.users)}
              categories={userActivity.map(u => u.hour)}
              title=""
              height={180}
            />
          </div>
        </GlassCard>

        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Server Resource Usage</h3>
          <div className="space-y-4">
            {[
              { label: 'CPU Usage', value: 62, color: chartColors.primary },
              { label: 'Memory', value: 78, color: chartColors.warning },
              { label: 'Disk I/O', value: 45, color: chartColors.cyan },
              { label: 'Network', value: 56, color: chartColors.success },
            ].map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{metric.label}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{metric.value}%</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${metric.value}%`, backgroundColor: metric.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function APIPerformanceTab() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">API Endpoint Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-2">Endpoint</th>
                <th className="text-center py-3 px-2">Avg Time</th>
                <th className="text-center py-3 px-2">Success Rate</th>
                <th className="text-center py-3 px-2">Total Calls</th>
              </tr>
            </thead>
            <tbody>
              {apiPerformance.map((api, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="py-4 px-2">
                    <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{api.endpoint}</code>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className={cn(
                      'font-medium',
                      parseInt(api.avgTime) < 100 ? 'text-success-600' : 'text-warning-500'
                    )}>
                      {api.avgTime}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      api.successRate >= 99.5 ? 'bg-success-100 text-success-600' :
                      api.successRate >= 99 ? 'bg-warning-100 text-warning-600' :
                      'bg-error-100 text-error-500'
                    )}>
                      {api.successRate}%
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center text-slate-600">{api.calls}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Response Time Distribution</h3>
          <div className="h-48">
            <BarChart
              data={apiPerformance.map(api => parseInt(api.avgTime))}
              categories={apiPerformance.map(api => api.endpoint.replace('/api/', ''))}
              title=""
              height={180}
            />
          </div>
        </GlassCard>

        <GlassCard gradient>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Error Rate Trend</h3>
          <div className="h-48">
            <LineChart
              data={[0.12, 0.15, 0.11, 0.14, 0.10, 0.12, 0.08, 0.09]}
              categories={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
              title=""
              height={180}
            />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function DataQualityTab() {
  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Data Quality Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(dataQuality).map(([key, value]) => (
            <div key={key} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-xs text-slate-500 capitalize">{key}</p>
              <p className="text-3xl font-bold text-success-600 mt-1">{value}%</p>
              <div className="mt-2 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-success-500 rounded-full"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Data Sync Status</h3>
        <div className="space-y-4">
          {dataSync.map((sync, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-4"
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                sync.status === 'active' ? 'bg-success-100 text-success-600' : 'bg-warning-100 text-warning-500'
              )}>
                <Database className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-white">{sync.source}</p>
                <p className="text-xs text-slate-500">Last sync: {sync.lastSync}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Interval: {sync.interval}</p>
                <span className={cn(
                  'text-xs font-medium',
                  sync.status === 'active' ? 'text-success-600' : 'text-warning-500'
                )}>
                  {sync.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function AlertsTab() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-error-500 to-warning-500">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">System Alerts</h3>
            <p className="text-sm text-slate-500">Recent notifications and issues</p>
          </div>
        </div>

        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: alert.id * 0.1 }}
              className={cn(
                'p-4 rounded-xl border-l-4',
                alert.severity === 'critical' ? 'bg-error-50 dark:bg-error-900/20 border-error-500' :
                alert.severity === 'warning' ? 'bg-warning-50 dark:bg-warning-900/20 border-warning-500' :
                'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {alert.severity === 'critical' && <AlertTriangle className="w-4 h-4 text-error-500" />}
                  {alert.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-warning-500" />}
                  {alert.severity === 'info' && <CheckCircle className="w-4 h-4 text-blue-500" />}
                  <span className={cn(
                    'text-xs font-semibold uppercase',
                    alert.severity === 'critical' ? 'text-error-600' :
                    alert.severity === 'warning' ? 'text-warning-600' :
                    'text-blue-600'
                  )}>
                    {alert.severity}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{alert.time}</span>
                  {alert.resolved && (
                    <span className="px-2 py-1 rounded bg-success-100 text-success-600 text-xs">Resolved</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-900 dark:text-white">{alert.message}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Alert Statistics (24h)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-error-50 dark:bg-error-900/20 text-center">
            <p className="text-xs text-error-600 font-medium">Critical</p>
            <p className="text-3xl font-bold text-error-600 mt-1">3</p>
          </div>
          <div className="p-4 rounded-xl bg-warning-50 dark:bg-warning-900/20 text-center">
            <p className="text-xs text-warning-600 font-medium">Warnings</p>
            <p className="text-3xl font-bold text-warning-500 mt-1">12</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
            <p className="text-xs text-blue-600 font-medium">Info</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">28</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = React.useState('system');

  const tabs = [
    { id: 'system', label: 'System Overview', icon: Activity },
    { id: 'api', label: 'API Performance', icon: Server },
    { id: 'data', label: 'Data Quality', icon: Database },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">System monitoring and performance metrics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-700 to-slate-900 text-white font-bold">
          <Shield className="w-5 h-5" />
          Admin Only
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'system' && <SystemOverview />}
        {activeTab === 'api' && <APIPerformanceTab />}
        {activeTab === 'data' && <DataQualityTab />}
        {activeTab === 'alerts' && <AlertsTab />}
      </motion.div>
    </div>
  );
}

export default AdminAnalyticsPage;
