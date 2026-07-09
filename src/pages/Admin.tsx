import React from 'react';
import { Settings, Users, Calendar, DollarSign, TrendingUp, Eye, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { AreaChart, BarChart } from '../components/ui/Charts';
import { generateChartData, chartColors } from '../lib/mock-data';
import { cn } from '../lib/utils';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Tournament management and analytics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Total Revenue" value={2450000} icon={<DollarSign className="w-6 h-6" />} color={chartColors.success} prefix="$" />
        <KPIWidget title="Registered Players" value={521} icon={<Users className="w-6 h-6" />} color={chartColors.primary} />
        <KPIWidget title="Active Matches" value={12} icon={<Calendar className="w-6 h-6" />} color={chartColors.cyan} />
        <KPIWidget title="Active Users" value={8456} icon={<Eye className="w-6 h-6" />} color={chartColors.warning} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard gradient>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-success-100 dark:bg-success-900/30">
              <CheckCircle className="w-5 h-5 text-success-600" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Completed Today</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
              <p className="text-xs text-slate-500">Matches</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">5</p>
              <p className="text-xs text-slate-500">Scorecards</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard gradient>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Clock className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">In Progress</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-2xl font-bold text-primary-600">2</p>
              <p className="text-xs text-slate-500">Live Matches</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">4</p>
              <p className="text-xs text-slate-500">Pending Review</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard gradient>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-warning-100 dark:bg-warning-900/30">
              <AlertCircle className="w-5 h-5 text-warning-600" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Pending Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-2xl font-bold text-warning-600">7</p>
              <p className="text-xs text-slate-500">Approvals</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">2</p>
              <p className="text-xs text-slate-500">Issues</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Revenue Trend</h3>
          <AreaChart data={generateChartData().map(d => ({ x: d.month, y: d.value * 10 }))} color={chartColors.success} height={250} />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">User Engagement</h3>
          <BarChart data={generateChartData().map(d => ({ name: d.month, value: d.value * 5 }))} color={chartColors.primary} height={250} />
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Match scorecard updated', team: 'CSK vs MI', time: '5 min ago', status: 'completed' },
            { action: 'Player registration', team: 'Shubman Gill', time: '15 min ago', status: 'completed' },
            { action: 'New tournament created', team: 'IPL 2024', time: '1 hour ago', status: 'completed' },
            { action: 'Pending scorecard review', team: 'GT vs SRH', time: '2 hours ago', status: 'pending' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  activity.status === 'completed' ? 'bg-success-500' : 'bg-warning-500'
                )} />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-slate-500">{activity.team}</p>
                </div>
              </div>
              <span className="text-xs text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export default AdminDashboard;
