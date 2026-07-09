import React from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb, TrendingUp, TrendingDown, AlertTriangle, Target, Activity,
  Brain, Sparkles, Award, Calendar, Users, BarChart3, LineChart
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface Insight {
  id: string;
  type: 'prediction' | 'observation' | 'highlight' | 'warning' | 'recommendation';
  title: string;
  description: string;
  match?: string;
  confidence?: number;
  ai_score?: number;
}

const insights: Insight[] = [
  {
    id: 'i1',
    type: 'prediction',
    title: 'CSK likely to qualify for playoffs',
    description: 'Based on current NRR and remaining fixtures, CSK has a 78% probability of reaching the playoffs. Key match against RCB will be decisive.',
    match: 'IPL 2024',
    confidence: 78,
    ai_score: 85
  },
  {
    id: 'i2',
    type: 'highlight',
    title: 'Virat Kohli approaching 1000-run milestone',
    description: 'Needs 87 more runs to become the first batsman to score 1000+ runs in a single IPL season twice in his career.',
    match: 'Player Milestone',
    confidence: 95,
    ai_score: 92
  },
  {
    id: 'i3',
    type: 'warning',
    title: 'Jasprit Bumrah workload concern',
    description: 'Has bowled 58 overs in 14 matches. Consider resting for upcoming matches to prevent burnout before playoffs.',
    match: 'MI',
    confidence: 82,
    ai_score: 88
  },
  {
    id: 'i4',
    type: 'observation',
    title: 'Death overs bowling improving for KKR',
    description: 'KKR has improved death over economy from 11.2 to 8.4 in last 5 matches. Varun Chakravarthy now 3rd best in middle overs.',
    match: 'KKR',
    confidence: 90,
    ai_score: 76
  },
  {
    id: 'i5',
    type: 'recommendation',
    title: 'Rishabh Pant should bat at #3',
    description: 'Analysis shows Pant scores 45% faster when batting at #3 compared to #5. Win probability increases by 12% in high-chase scenarios.',
    match: 'DC',
    confidence: 85,
    ai_score: 91
  },
];

const playerInsights = [
  { player: 'Virat Kohli', metric: 'Orange Cap', prediction: 'Winner', progress: 97, trend: 'up' },
  { player: 'Jasprit Bumrah', metric: 'Purple Cap', prediction: 'Winner', progress: 95, trend: 'up' },
  { player: 'MS Dhoni', metric: 'Best Finisher', prediction: '#1', progress: 92, trend: 'up' },
  { player: 'Jadeja', metric: 'MVP Race', prediction: '#3', progress: 88, trend: 'up' },
  { player: 'Ruturaj', metric: 'Emerging Player', prediction: '#2', progress: 85, trend: 'up' },
];

const matchPredictions = [
  { match: 'CSK vs RCB', date: 'Apr 20', prediction: 'CSK Win', probability: 65 },
  { match: 'MI vs KKR', date: 'Apr 21', prediction: 'MI Win', probability: 58 },
  { match: 'DC vs RR', date: 'Apr 22', prediction: 'RR Win', probability: 72 },
];

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'prediction': return Brain;
    case 'highlight': return Award;
    case 'warning': return AlertTriangle;
    case 'recommendation': return Lightbulb;
    default: return Target;
  }
};

const getInsightColor = (type: string) => {
  switch (type) {
    case 'prediction': return 'bg-primary-100 text-primary-600 dark:bg-primary-900/30';
    case 'highlight': return 'bg-success-100 text-success-600 dark:bg-success-900/30';
    case 'warning': return 'bg-warning-100 text-warning-600 dark:bg-warning-900/30';
    case 'recommendation': return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30';
    default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800';
  }
};

const getInsightBorderColor = (type: string) => {
  switch (type) {
    case 'prediction': return 'border-l-primary-500';
    case 'highlight': return 'border-l-success-500';
    case 'warning': return 'border-l-warning-500';
    case 'recommendation': return 'border-l-cyan-500';
    default: return 'border-l-slate-300';
  }
};

export function Insights() {
  const [activeTab, setActiveTab] = React.useState<'all' | 'predictions' | 'highlights'>('all');

  const filteredInsights = insights.filter(insight => {
    if (activeTab === 'all') return true;
    if (activeTab === 'predictions') return insight.type === 'prediction' || insight.type === 'recommendation';
    if (activeTab === 'highlights') return insight.type === 'highlight' || insight.type === 'observation';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Insights</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">AI-powered predictions and match intelligence</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">AI Analysis</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All Insights', icon: Lightbulb },
          { id: 'predictions', label: 'Predictions', icon: Brain },
          { id: 'highlights', label: 'Highlights', icon: Award },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-primary-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Insights */}
        <div className="lg:col-span-2 space-y-4">
          {filteredInsights.map((insight, i) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className={cn('border-l-4', getInsightBorderColor(insight.type))}>
                  <div className="flex items-start gap-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', getInsightColor(insight.type))}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn('px-2 py-0.5 rounded text-xs font-medium capitalize', getInsightColor(insight.type))}>
                          {insight.type.replace('_', ' ')}
                        </span>
                        {insight.match && (
                          <span className="text-xs text-slate-500">{insight.match}</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{insight.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{insight.description}</p>

                      <div className="flex items-center gap-4 mt-4">
                        {insight.confidence && (
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Confidence</p>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                <div className="h-full bg-primary-500" style={{ width: `${insight.confidence}%` }} />
                              </div>
                              <span className="text-sm font-medium text-slate-900 dark:text-white">{insight.confidence}%</span>
                            </div>
                          </div>
                        )}
                        {insight.ai_score && (
                          <div>
                            <p className="text-xs text-slate-500 mb-1">AI Score</p>
                            <span className={cn(
                              'text-sm font-bold',
                              insight.ai_score >= 90 ? 'text-success-600' :
                              insight.ai_score >= 70 ? 'text-primary-600' :
                              'text-warning-600'
                            )}>
                              {insight.ai_score}/100
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Player Predictions */}
          <GlassCard>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-500" />
              Player Predictions
            </h3>
            <div className="space-y-3">
              {playerInsights.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-slate-900 dark:text-white">{p.player}</p>
                    <p className="text-xs text-slate-500">{p.metric}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-cyan-500"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{p.prediction}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Match Predictions */}
          <GlassCard>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-warning-500" />
              Upcoming Match Predictions
            </h3>
            <div className="space-y-3">
              {matchPredictions.map((m, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm text-slate-900 dark:text-white">{m.match}</p>
                    <span className="text-xs text-slate-500">{m.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-success-600 font-medium">{m.prediction}</span>
                    <span className="text-xs text-slate-500">{m.probability}% prob</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* AI Analysis Summary */}
          <GlassCard className="bg-gradient-to-br from-primary-500 to-cyan-500 text-white">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Analysis Summary
            </h3>
            <div className="space-y-2 text-sm text-white/90">
              <p>12 predictions analyzed</p>
              <p>Avg accuracy: 84.5%</p>
              <p>5 recommendations pending</p>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-white/20">
              <p className="text-sm font-medium">Top Recommendation</p>
              <p className="text-xs mt-1 text-white/80">Consider resting key players before playoffs</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default Insights;
