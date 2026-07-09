import React from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageSquare, Send, Zap, TrendingUp, Target, Crown, Activity } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { aiInsights, mockTeams, chartColors } from '../lib/mock-data';
import { cn } from '../lib/utils';

const suggestedQuestions = [
  'Which team has the best death bowling?',
  'Who will win today\'s match?',
  'Best emerging player this season?',
  'Compare Dhoni vs Rohit captaincy',
];

export function AIAnalytics() {
  const [message, setMessage] = React.useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">AI-powered cricket intelligence</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <GlassCard gradient className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Insights</h3>
              <p className="text-sm text-slate-500">Real-time tournament intelligence</p>
            </div>
          </div>

          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-l-4"
                style={{ borderColor: insight.priority === 'high' ? chartColors.error : chartColors.warning }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    {insight.type === 'batsman' ? <TrendingUp className="w-4 h-4 text-primary-600" /> :
                     insight.type === 'bowler' ? <Target className="w-4 h-4 text-primary-600" /> :
                     insight.type === 'captain' ? <Crown className="w-4 h-4 text-primary-600" /> :
                     <Activity className="w-4 h-4 text-primary-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 uppercase">{insight.type}</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{insight.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{insight.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* AI Chat */}
        <GlassCard gradient>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-primary-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">AI Assistant</h3>
              <p className="text-xs text-slate-500">Ask anything about cricket</p>
            </div>
          </div>

          <div className="h-[200px] border border-slate-200 dark:border-slate-700 rounded-xl p-3 mb-4 overflow-y-auto bg-slate-50 dark:bg-slate-800/50">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-primary-500 flex-shrink-0 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">Hi! I'm CricketIQ AI. Ask me anything about players, teams, matches, or predictions.</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2">Suggested Questions</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.slice(0, 3).map((q, i) => (
                <button
                  key={i}
                  className="px-3 py-1.5 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                  onClick={() => setMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="p-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white hover:shadow-lg transition-all">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Match Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Match Predictions</h3>
          <div className="space-y-4">
            {[
              { team1: 'CSK', team2: 'MI', prob1: 52, prob2: 48 },
              { team1: 'GT', team2: 'SRH', prob1: 60, prob2: 40 },
            ].map((match, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
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
                <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                  <div className="h-full bg-primary-500" style={{ width: `${match.prob1}%` }} />
                  <div className="h-full bg-cyan-500" style={{ width: `${match.prob2}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tournament Winner</h3>
          <div className="space-y-3">
            {[
              { team: 'Gujarat Titans', prob: 28 },
              { team: 'CSK', prob: 24 },
              { team: 'Mumbai Indians', prob: 18 },
              { team: 'RCB', prob: 15 },
            ].map((entry, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 text-center text-sm font-bold text-slate-500">{i + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-900 dark:text-white">{entry.team}</span>
                    <span className="text-sm font-bold text-primary-600">{entry.prob}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyan-500" style={{ width: `${entry.prob}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default AIAnalytics;
