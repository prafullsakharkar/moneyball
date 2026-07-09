import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Eye, Search, Filter, Calendar, Trophy, Users, User,
  ChevronDown, X, Printer, Share2, BarChart3, Target, Activity, TrendingUp
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface Report {
  id: string;
  type: 'scorecard' | 'tournament' | 'player_career' | 'match_summary' | 'team_performance';
  title: string;
  description: string;
  generated_at: string;
  file_size: string;
  status: 'ready' | 'generating' | 'failed';
  download_url?: string;
}

const recentReports: Report[] = [
  { id: 'r1', type: 'scorecard', title: 'CSK vs MI - Match 45 Scorecard', description: 'Full match scorecard with batting, bowling, and fielding details', generated_at: '2024-04-15 19:45', file_size: '2.4 MB', status: 'ready' },
  { id: 'r2', type: 'tournament', title: 'IPL 2024 Mid-Season Report', description: 'Complete statistics and standings for IPL 2024', generated_at: '2024-04-15 12:30', file_size: '15.8 MB', status: 'ready' },
  { id: 'r3', type: 'player_career', title: 'Virat Kohli Career Report', description: 'Complete career statistics and performance analysis', generated_at: '2024-04-14 16:20', file_size: '8.2 MB', status: 'ready' },
  { id: 'r4', type: 'match_summary', title: 'RCB vs KKR - Match Summary', description: 'Brief summary with key highlights and MOM', generated_at: '2024-04-14 22:15', file_size: '1.1 MB', status: 'ready' },
  { id: 'r5', type: 'team_performance', title: 'CSK Season Performance', description: 'Chennai Super Kings 2024 performance metrics', generated_at: '2024-04-14 10:00', file_size: '5.6 MB', status: 'ready' },
];

const reportTemplates = [
  { id: 't1', name: 'Match Scorecard (PDF)', description: 'Complete batting, bowling, fall of wickets, partnerships', icon: FileText, type: 'scorecard' },
  { id: 't2', name: 'Tournament Report', description: 'Full tournament statistics, standings, awards, best performances', icon: Trophy, type: 'tournament' },
  { id: 't3', name: 'Player Career Report', description: 'Career stats, graphs, records, milestones', icon: User, type: 'player_career' },
  { id: 't4', name: 'Team Performance Report', description: 'Team analysis, player contributions, match results', icon: Users, type: 'team_performance' },
  { id: 't5', name: 'Match Summary', description: 'Quick summary with key moments and highlights', icon: Target, type: 'match_summary' },
  { id: 't6', name: 'MVP & Awards Report', description: 'Leaderboards, MVP calculations, award winners', icon: BarChart3, type: 'awards' },
];

export function Reports() {
  const [activeTab, setActiveTab] = React.useState<'generate' | 'recent'>('generate');
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'scorecard': return 'bg-primary-100 text-primary-600';
      case 'tournament': return 'bg-warning-100 text-warning-600';
      case 'player_career': return 'bg-cyan-100 text-cyan-600';
      case 'team_performance': return 'bg-success-100 text-success-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Generate and download cricket reports</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'generate', label: 'Generate Reports', icon: FileText },
          { id: 'recent', label: 'Recent Reports', icon: Download },
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

      {/* Generate Reports Tab */}
      {activeTab === 'generate' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-primary-600 mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-xs">Scorecards</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">156</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-warning-600 mb-2">
                <Trophy className="w-4 h-4" />
                <span className="text-xs">Tournament Reports</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-cyan-600 mb-2">
                <User className="w-4 h-4" />
                <span className="text-xs">Player Reports</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">45</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-success-600 mb-2">
                <Download className="w-4 h-4" />
                <span className="text-xs">Total Downloads</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">1.2K</p>
            </div>
          </div>

          {/* Report Templates */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Report Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTemplates.map((template, i) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-lg',
                      selectedTemplate === template.id && 'ring-2 ring-primary-500'
                    )}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setShowGenerateModal(true);
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        getReportTypeColor(template.type)
                      )}>
                        <template.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{template.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Reports Tab */}
      {activeTab === 'recent' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-3">
            {recentReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      getReportTypeColor(report.type)
                    )}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{report.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 capitalize">{report.type.replace('_', ' ')}</span>
                        <span className="text-xs text-slate-400">{report.file_size}</span>
                        <span className="text-xs text-slate-400">{report.generated_at}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Eye className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Share2 className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 font-medium text-sm hover:bg-primary-200">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Generate Modal */}
      {showGenerateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Generate Report</h2>
                <button onClick={() => { setShowGenerateModal(false); setSelectedTemplate(null); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Report Name</label>
                <input type="text" placeholder="e.g., IPL 2024 Week 5 Report" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Data Range</label>
                <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                  <option>All Matches</option>
                  <option>Specific Match</option>
                  <option>Date Range</option>
                  <option>Tournament Phase</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">From Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">To Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Include Sections</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Summary', 'Batting Stats', 'Bowling Stats', 'Fielding Stats', 'Charts & Graphs', 'MVP Rankings'].map((section) => (
                    <label key={section} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{section}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button onClick={() => { setShowGenerateModal(false); setSelectedTemplate(null); }} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-medium">
                Cancel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg">
                <Printer className="w-4 h-4" />
                Generate Report
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Reports;
