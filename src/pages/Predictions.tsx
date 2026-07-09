import React from 'react';
import { TrendingUp, Target, Award, Zap, Activity, Calendar, Users, Crown } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { AreaChart, GaugeChart } from '../components/ui/Charts';
import { mockTeams, generateChartData, chartColors } from '../lib/mock-data';
import { cn } from '../lib/utils';

export function Predictions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Predictive Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">AI-powered match and tournament predictions</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Prediction Accuracy" value={87} icon={<Target className="w-6 h-6" />} color={chartColors.success} suffix="%" />
        <KPIWidget title="Matches Predicted" value={48} icon={<Calendar className="w-6 h-6" />} color={chartColors.primary} />
        <KPIWidget title="Upsets Detected" value={12} icon={<Zap className="w-6 h-6" />} color={chartColors.warning} />
        <KPIWidget title="Active Confidence" value={92} icon={<Activity className="w-6 h-6" />} color={chartColors.cyan} suffix="%" />
      </div>

      {/* Playoff Qualification */}
      <GlassCard gradient>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Playoff Qualification Probability</h3>
            <p className="text-sm text-slate-500">Based on current standings and remaining fixtures</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockTeams.slice(0, 8).map((team, index) => (
            <div key={team.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: `linear-gradient(135deg, ${team.primary_color}, ${team.secondary_color})` }}>
                  {team.short_name}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{team.short_name}</p>
                  <p className="text-xs text-slate-500">{team.city}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={cn(
                  'text-2xl font-bold',
                  90 - index * 10 >= 70 ? 'text-success-600' :
                  90 - index * 10 >= 40 ? 'text-warning-600' :
                  'text-error-600'
                )}>
                  {90 - index * 10}%
                </span>
                <div className="w-12 h-12 relative">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-slate-700" />
                    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3"
                      strokeDasharray={`${(90 - index * 10) * 1.26} 126`}
                      className={90 - index * 10 >= 70 ? 'text-success-500' : 90 - index * 10 >= 40 ? 'text-warning-500' : 'text-error-500'} />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Match & Player Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tomorrow's Matches</h3>
          <div className="space-y-4">
            {[
              { team1: 'CSK', team2: 'MI', prob1: 52, prob2: 48, time: '7:30 PM IST' },
              { team1: 'GT', team2: 'SRH', prob1: 60, prob2: 40, time: '3:30 PM IST' },
            ].map((match, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500">{match.time}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 text-center">
                    <p className="font-semibold text-slate-900 dark:text-white">{match.team1}</p>
                    <p className="text-2xl font-bold text-primary-600 mt-1">{match.prob1}%</p>
                  </div>
                  <span className="text-slate-400">vs</span>
                  <div className="flex-1 text-center">
                    <p className="font-semibold text-slate-900 dark:text-white">{match.team2}</p>
                    <p className="text-2xl font-bold text-cyan-600 mt-1">{match.prob2}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Player Performance Forecasts</h3>
          <div className="space-y-4">
            {[
              { player: 'Shubman Gill', metric: 'Expected Runs', value: '65-85', confidence: 78 },
              { player: 'Jasprit Bumrah', metric: 'Expected Wickets', value: '2-3', confidence: 82 },
              { player: 'MS Dhoni', metric: 'Strike Rate', value: '180-200', confidence: 71 },
            ].map((pred, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{pred.player}</p>
                  <p className="text-xs text-slate-500">{pred.metric}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">{pred.value}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-full rounded-full bg-success-500" style={{ width: `${pred.confidence}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{pred.confidence}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Model Confidence Over Time</h3>
        <AreaChart data={generateChartData().map((d, i) => ({ x: d.month, y: 70 + Math.random() * 20 }))} color={chartColors.success} height={200} />
      </GlassCard>
    </div>
  );
}

export default Predictions;
