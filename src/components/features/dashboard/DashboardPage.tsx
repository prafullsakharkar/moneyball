import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { 
  Trophy, Users, Calendar, BarChart3, TrendingUp, TrendingDown, 
  Activity, Clock, Award, Download, Search, Filter
} from 'lucide-react';
import { AreaChart, LineChart, BarChart, DonutChart } from '../../ui/Charts';

export interface DashboardPageProps {
  className?: string;
}

// KPI Card Component
function KPICard({ title, value, change, trend, icon: Icon, color }: { 
  title: string; 
  value: string; 
  change: string; 
  trend: 'up' | 'down' | 'neutral'; 
  icon: React.ElementType; 
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </CardTitle>
          <div className={cn('p-2 rounded-lg', color)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
          <div className="flex items-center mt-2">
            {trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500 mr-1" />}
            {trend === 'neutral' && <Activity className="w-3 h-3 text-slate-400 mr-1" />}
            <span className={cn('text-sm font-medium', 
              trend === 'up' ? 'text-emerald-500' : 
              trend === 'down' ? 'text-red-500' : 'text-slate-500'
            )}>
              {change}
            </span>
            <span className="text-xs text-slate-400 ml-1">vs last month</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Recent Activity Item
function RecentActivityItem({ 
  icon: Icon, 
  title, 
  description, 
  time, 
  type 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  time: string; 
  type: 'match' | 'player' | 'team' | 'tournament';
}) {
  const typeColors = {
    match: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    player: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    team: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    tournament: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  };

  return (
    <div className="flex items-start gap-4 pb-4 last:pb-0 border-b border-slate-100 dark:border-slate-800">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', typeColors[type])}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-900 dark:text-white">{title}</h4>
          <span className="text-xs text-slate-500">{time}</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  );
}

export function DashboardPage({ className }: DashboardPageProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Matches" 
          value="12" 
          change="+2" 
          trend="up" 
          icon={Calendar} 
          color="bg-blue-500" 
        />
        <KPICard 
          title="Active Players" 
          value="248" 
          change="+15" 
          trend="up" 
          icon={Users} 
          color="bg-purple-500" 
        />
        <KPICard 
          title="Teams" 
          value="24" 
          change="0" 
          trend="neutral" 
          icon={Trophy} 
          color="bg-emerald-500" 
        />
        <KPICard 
          title="Tournaments" 
          value="3" 
          change="-1" 
          trend="down" 
          icon={Award} 
          color="bg-amber-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <AreaChart 
                data={[
                  { x: 'Jan', y: 100 },
                  { x: 'Feb', y: 120 },
                  { x: 'Mar', y: 140 },
                  { x: 'Apr', y: 160 },
                  { x: 'May', y: 180 },
                  { x: 'Jun', y: 200 },
                  { x: 'Jul', y: 220 },
                ]}
                title="Performance"
                color="primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Score</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">87.5</div>
              <div className="text-xs text-slate-500 mt-1">+2.3% from last match</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Win Rate</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">75%</div>
              <div className="text-xs text-slate-500 mt-1">+5% from last tournament</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Sessions</span>
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">8</div>
              <div className="text-xs text-slate-500 mt-1">3正在训练中</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Recent Matches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { icon: Trophy, title: 'Tournament Finals', description: 'Championship Match', time: '2 hours ago', type: 'match' as const },
              { icon: Users, title: 'Player Performance', description: 'John Doe - 85 runs', time: '4 hours ago', type: 'player' as const },
              { icon: Users, title: 'Team Training', description: 'Monday Practice Session', time: '5 hours ago', type: 'team' as const },
              { icon: Award, title: 'New Tournament', description: 'Summer League 2024', time: 'Yesterday', type: 'tournament' as const },
            ].map((item, i) => (
              <RecentActivityItem key={i} {...item} />
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: 'Schedule Match', color: 'bg-blue-500' },
              { icon: Users, label: 'Add Player', color: 'bg-purple-500' },
              { icon: Trophy, label: 'Create Team', color: 'bg-emerald-500' },
              { icon: Download, label: 'Report', color: 'bg-amber-500' },
            ].map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -2 }}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <action.icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{action.label}</span>
              </motion.button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}