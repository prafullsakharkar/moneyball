import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, Target, Users, Lightbulb, BarChart3, Zap, Eye } from 'lucide-react';
import { GlassCard, KPIWidget } from '../components/ui/GlassCard';
import { BarChart, LineChart, AreaChart, RadarChart } from '../components/ui/Charts';
import { mockPlayers, mockTeams, chartColors, aiInsights } from '../lib/mock-data';
import { cn, getInitials } from '../lib/utils';

// Enhanced AI Insights Data
const aiPatterns = [
  {
    title: 'Batting Form Analysis',
    type: 'batsman',
    insights: [
      { player: mockPlayers[6], insight: 'Unusually high dot ball percentage (38%) against left-arm spin. Recommendation: Practice against LAM spinners.', confidence: 92 },
      { player: mockPlayers[0], insight: 'Strike rate drops 18% in death overs. Recommend aggressive rotation strategy.', confidence: 88 },
      { player: mockPlayers[3], insight: 'Best against pace bowling - averages 52.3 vs pace, 28.1 vs spin.', confidence: 95 },
    ],
  },
  {
    title: 'Bowling Matchup Insights',
    type: 'bowler',
    insights: [
      { player: mockPlayers[1], insight: 'Most effective in first 6 overs - economy 5.2 with 56% dot balls.', confidence: 91 },
      { player: mockPlayers[7], insight: 'Struggles against left-handed batsmen. Economy rises from 7.1 to 9.8.', confidence: 84 },
      { player: mockPlayers[5], insight: 'Best impact in middle overs - taking 2.3 wickets per innings avg.', confidence: 89 },
    ],
  },
];

const aiPredictions = [
  { match: 'CSK vs MI', prediction: 'CSK favorite (62%)', confidence: 85, keyFactors: ['Home advantage', 'Dhoni captaincy', 'Spin-friendly pitch'] },
  { match: 'RCB vs GT', prediction: 'GT favorite (58%)', confidence: 78, keyFactors: ['GT bowling strength', 'RCB middle-order vulnerability'] },
  { match: 'KKR vs SRH', prediction: 'SRH favorite (55%)', confidence: 72, keyFactors: ['SRH spin attack', 'KKR batting depth'] },
];

const aiStrategies = [
  {
    team: mockTeams[0],
    strategy: 'Chase Optimization',
    recommendation: 'In run chases, promote Jadeja to #5 when target > 160. Expected run rate improvement: +1.2',
    confidence: 87,
  },
  {
    team: mockTeams[1],
    strategy: 'Death Bowling',
    recommendation: 'Bumrah to bowl 18th and 20th overs consistently. Save 2 overs for final 3 overs.',
    confidence: 94,
  },
  {
    team: mockTeams[7],
    strategy: 'Powerplay Aggression',
    recommendation: 'Gill and Saha to be aggressive in overs 1-3. Target quick bowlers early.',
    confidence: 82,
  },
];

const aiAnomalies = [
  { type: 'performance', description: 'Player X averages dropped 35% in last 5 matches', severity: 'high' },
  { type: 'pattern', description: 'Unusual toss decision pattern - bowling first 8 consecutive times', severity: 'medium' },
  { type: 'trend', description: 'Team Y conceding 15% more extras than season average', severity: 'low' },
];

// Sub-components
function AIInsightsTab() {
  return (
    <div className="space-y-6">
      {/* Pattern Analysis */}
      {aiPatterns.map((pattern) => (
        <GlassCard key={pattern.title} gradient>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              'p-2 rounded-lg',
              pattern.type === 'batsman' ? 'bg-primary-500/20' : 'bg-cyan-500/20'
            )}>
              {pattern.type === 'batsman' ? (
                <Target className="w-5 h-5 text-primary-600" />
              ) : (
                <Zap className="w-5 h-5 text-cyan-600" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{pattern.title}</h3>
              <p className="text-sm text-slate-500">AI-detected patterns and recommendations</p>
            </div>
          </div>

          <div className="space-y-4">
            {pattern.insights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {getInitials(item.player.full_name)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-900 dark:text-white">{item.player.full_name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Confidence</span>
                        <span className={cn(
                          'px-2 py-1 rounded text-xs font-medium',
                          item.confidence >= 90 ? 'bg-success-100 text-success-600' :
                          item.confidence >= 80 ? 'bg-warning-100 text-warning-600' :
                          'bg-slate-100 text-slate-600'
                        )}>
                          {item.confidence}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.insight}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

function AIPredictionsTab() {
  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">AI Match Predictions</h3>
            <p className="text-sm text-slate-500">Machine learning powered forecasts</p>
          </div>
        </div>

        <div className="space-y-4">
          {aiPredictions.map((pred, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-slate-900 dark:text-white">{pred.match}</p>
                <span className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium',
                  pred.confidence >= 80 ? 'bg-success-100 text-success-600' :
                  pred.confidence >= 70 ? 'bg-warning-100 text-warning-600' :
                  'bg-slate-100 text-slate-600'
                )}>
                  {pred.confidence}% confidence
                </span>
              </div>

              <div className="text-center p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-cyan-500/10 border border-primary-500/20">
                <p className="text-lg font-bold text-primary-600">{pred.prediction}</p>
              </div>

              <div className="mt-4">
                <p className="text-xs text-slate-500 mb-2">Key Factors</p>
                <div className="flex flex-wrap gap-2">
                  {pred.keyFactors.map((factor, j) => (
                    <span key={j} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Prediction Accuracy Trend</h3>
        <div className="h-64">
          <LineChart
            data={[78, 82, 85, 88, 86, 90, 92, 89, 91]}
            categories={['Accuracy']}
            title=""
            height={240}
          />
        </div>
      </GlassCard>
    </div>
  );
}

function AIStrategiesTab() {
  return (
    <div className="space-y-6">
      <GlassCard gradient>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-warning-500 to-orange-500">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">AI-Recommended Strategies</h3>
            <p className="text-sm text-slate-500">Optimized team tactics and lineups</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiStrategies.map((strat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  {strat.team.short_name}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{strat.team.name}</p>
                  <p className="text-xs text-slate-500">{strat.strategy}</p>
                </div>
              </div>

              <div className="p-3 rounded bg-white dark:bg-slate-700 mb-3">
                <p className="text-sm text-slate-600 dark:text-slate-400">{strat.recommendation}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Confidence</span>
                <span className="px-2 py-1 rounded bg-success-100 text-success-600 text-sm font-medium">
                  {strat.confidence}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Strategy Effectiveness Radar</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RadarChart
            categories={['Attack', 'Defense', 'Chase', 'Defend', 'Sustain']}
            data={[85, 78, 92, 88, 72]}
            color={chartColors.primary}
            height={200}
          />
          <RadarChart
            categories={['Attack', 'Defense', 'Chase', 'Defend', 'Sustain']}
            data={[78, 82, 75, 80, 85]}
            color={chartColors.cyan}
            height={200}
          />
          <RadarChart
            categories={['Attack', 'Defense', 'Chase', 'Defend', 'Sustain']}
            data={[88, 72, 80, 75, 90]}
            color={chartColors.warning}
            height={200}
          />
        </div>
      </GlassCard>
    </div>
  );
}

function AIAnomaliesTab() {
  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-error-500 to-warning-500">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Anomaly Detection</h3>
            <p className="text-sm text-slate-500">AI-detected unusual patterns</p>
          </div>
        </div>

        <div className="space-y-4">
          {aiAnomalies.map((anomaly, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                'p-4 rounded-xl border-l-4',
                anomaly.severity === 'high' ? 'bg-error-50 dark:bg-error-900/20 border-error-500' :
                anomaly.severity === 'medium' ? 'bg-warning-50 dark:bg-warning-900/20 border-warning-500' :
                'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  'text-xs font-semibold uppercase',
                  anomaly.severity === 'high' ? 'text-error-600' :
                  anomaly.severity === 'medium' ? 'text-warning-600' :
                  'text-blue-600'
                )}>
                  {anomaly.severity} severity
                </span>
                <span className="text-xs text-slate-500 capitalize">{anomaly.type}</span>
              </div>
              <p className="text-sm text-slate-900 dark:text-white">{anomaly.description}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard gradient>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">AI Model Performance</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Accuracy', value: '94.2%' },
            { label: 'Precision', value: '92.8%' },
            { label: 'Recall', value: '89.5%' },
            { label: 'F1 Score', value: '91.1%' },
          ].map((metric) => (
            <div key={metric.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-xs text-slate-500">{metric.label}</p>
              <p className="text-xl font-bold text-success-600 mt-1">{metric.value}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export function AIInsightsPage() {
  const [activeTab, setActiveTab] = React.useState('insights');

  const tabs = [
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
    { id: 'predictions', label: 'Predictions', icon: Brain },
    { id: 'strategies', label: 'Strategies', icon: Lightbulb },
    { id: 'anomalies', label: 'Anomalies', icon: Eye },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Machine learning powered cricket intelligence</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-bold">
          <Brain className="w-5 h-5" />
          AI Powered
        </div>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPIWidget title="Patterns Detected" value={127} icon={<Eye className="w-6 h-6" />} accent />
        <KPIWidget title="Prediction Accuracy" value="94.2" suffix="%" />
        <KPIWidget title="Strategies Generated" value={42} icon={<Lightbulb className="w-6 h-6" />} />
        <KPIWidget title="Anomalies Found" value={8} icon={<Zap className="w-6 h-6" />} />
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
                ? 'bg-gradient-to-r from-primary-500 to-cyan-500 text-white shadow-lg'
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
        {activeTab === 'insights' && <AIInsightsTab />}
        {activeTab === 'predictions' && <AIPredictionsTab />}
        {activeTab === 'strategies' && <AIStrategiesTab />}
        {activeTab === 'anomalies' && <AIAnomaliesTab />}
      </motion.div>
    </div>
  );
}

export default AIInsightsPage;
