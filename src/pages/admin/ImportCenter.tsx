import React from 'react';
import { motion } from 'framer-motion';
import {
  Upload, Download, FileSpreadsheet, FileJson, FileText, AlertCircle,
  CheckCircle, Clock, X, ChevronDown, Trash2, Eye, RefreshCw
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

interface ImportJob {
  id: string;
  type: 'players' | 'teams' | 'matches' | 'scorecard' | 'cricHeroes';
  format: 'CSV' | 'JSON' | 'Excel' | 'CricHeroes';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileName: string;
  totalRecords: number;
  processedRecords: number;
  successCount: number;
  errorCount: number;
  createdAt: string;
  completedAt?: string;
  errors?: string[];
}

const importJobs: ImportJob[] = [
  { id: '1', type: 'players', format: 'CSV', status: 'completed', fileName: 'players_ipl_2024.csv', totalRecords: 250, processedRecords: 250, successCount: 248, errorCount: 2, createdAt: '2024-03-20 14:30', completedAt: '2024-03-20 14:35' },
  { id: '2', type: 'teams', format: 'JSON', status: 'completed', fileName: 'teams_data.json', totalRecords: 12, processedRecords: 12, successCount: 12, errorCount: 0, createdAt: '2024-03-19 10:15', completedAt: '2024-03-19 10:16' },
  { id: '3', type: 'matches', format: 'Excel', status: 'processing', fileName: 'fixtures_2024.xlsx', totalRecords: 74, processedRecords: 45, successCount: 45, errorCount: 0, createdAt: '2024-03-21 09:00' },
  { id: '4', type: 'cricHeroes', format: 'CricHeroes', status: 'failed', fileName: 'cricHeroes_export.json', totalRecords: 500, processedRecords: 120, successCount: 100, errorCount: 20, createdAt: '2024-03-18 16:45', completedAt: '2024-03-18 16:50', errors: ['Invalid player format at row 15', 'Missing team_id at row 23'] },
  { id: '5', type: 'scorecard', format: 'CricHeroes', status: 'pending', fileName: 'match_scorecards.json', totalRecords: 25, processedRecords: 0, successCount: 0, errorCount: 0, createdAt: '2024-03-21 11:00' },
];

const templates = [
  { id: 'players', name: 'Players Template', format: 'CSV', fields: ['name', 'role', 'batting_style', 'bowling_style', 'city', 'country', 'email'] },
  { id: 'teams', name: 'Teams Template', format: 'CSV', fields: ['name', 'short_name', 'city', 'country', 'home_ground', 'owner', 'coach'] },
  { id: 'matches', name: 'Matches/Fixtures Template', format: 'CSV', fields: ['match_number', 'tournament_id', 'team1_id', 'team2_id', 'venue', 'date', 'time', 'match_type'] },
  { id: 'scorecard', name: 'Scorecard Template', format: 'JSON', fields: ['match_id', 'innings', 'batting_team', 'bowling_team', 'runs', 'wickets', 'overs', 'balls'] },
];

export function ImportCenter() {
  const [activeTab, setActiveTab] = React.useState<'import' | 'history' | 'templates'>('import');
  const [importType, setImportType] = React.useState<string>('players');
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-600';
      case 'processing': return 'bg-primary-100 text-primary-600';
      case 'failed': return 'bg-error-100 text-error-600';
      case 'pending': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
    else if (e.type === 'drop') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log('File dropped:', e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Import Center</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Import data from CSV, JSON, Excel, or CricHeroes</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'import', label: 'New Import', icon: Upload },
          { id: 'history', label: 'Import History', icon: Clock },
          { id: 'templates', label: 'Templates', icon: Download },
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

      {/* Import Tab */}
      {activeTab === 'import' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Import Type Selection */}
          <GlassCard>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Select Import Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { id: 'players', label: 'Players', icon: '🏏', desc: 'Player profiles and stats' },
                { id: 'teams', label: 'Teams', icon: '👥', desc: 'Team information' },
                { id: 'matches', label: 'Matches', icon: '📅', desc: 'Fixtures and schedules' },
                { id: 'scorecard', label: 'Scorecards', icon: '📊', desc: 'Match scorecards' },
                { id: 'cricHeroes', label: 'CricHeroes', icon: '⚡', desc: 'Full export import' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setImportType(type.id)}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all text-left',
                    importType === type.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'
                  )}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <p className="font-medium text-slate-900 dark:text-white mt-2">{type.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* File Format Selection */}
          <GlassCard>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Select File Format</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { id: 'csv', label: 'CSV', icon: FileText, color: 'bg-green-100 text-green-600' },
                { id: 'json', label: 'JSON', icon: FileJson, color: 'bg-yellow-100 text-yellow-600' },
                { id: 'excel', label: 'Excel', icon: FileSpreadsheet, color: 'bg-blue-100 text-blue-600' },
                { id: 'cricHeroes', label: 'CricHeroes', icon: Upload, color: 'bg-purple-100 text-purple-600' },
              ].map((format) => (
                <button
                  key={format.id}
                  className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-all"
                >
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', format.color)}>
                    <format.icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">{format.label}</span>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Upload Area */}
          <GlassCard
            className={cn(
              'border-2 border-dashed transition-colors',
              dragActive ? 'border-primary-500 bg-primary-50/50' : 'border-slate-300 dark:border-slate-700'
            )}
          >
            <div
              className="flex flex-col items-center justify-center py-12"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Drop your file here or click to browse
              </p>
              <p className="text-sm text-slate-500 mb-4">
                Supports CSV, JSON, Excel (.xlsx), and CricHeroes format
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg transition-all"
              >
                Select File
              </button>
            </div>
          </GlassCard>

          {/* Required Fields Info */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-warning-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Required Fields</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['name', 'role', 'batting_style', 'city', 'country'].map((field) => (
                <span key={field} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400">
                  {field}
                </span>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-4">
              Missing required fields? <a href="#" className="text-primary-600 hover:underline">Download the template</a> with all required columns.
            </p>
          </GlassCard>
        </motion.div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {importJobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      job.format === 'CSV' ? 'bg-green-100 text-green-600' :
                      job.format === 'JSON' ? 'bg-yellow-100 text-yellow-600' :
                      job.format === 'Excel' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    )}>
                      {job.format === 'CSV' && <FileText className="w-5 h-5" />}
                      {job.format === 'JSON' && <FileJson className="w-5 h-5" />}
                      {job.format === 'Excel' && <FileSpreadsheet className="w-5 h-5" />}
                      {job.format === 'CricHeroes' && <Upload className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{job.fileName}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span className="capitalize">{job.type}</span>
                        <span>•</span>
                        <span>{job.totalRecords} records</span>
                        <span>•</span>
                        <span>{job.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={cn(
                      'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
                      getStatusColor(job.status)
                    )}>
                      {getStatusIcon(job.status)}
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Eye className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Trash2 className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {(job.status === 'processing' || job.status === 'completed') && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>{job.processedRecords} / {job.totalRecords} processed</span>
                      <span>{Math.round((job.processedRecords / job.totalRecords) * 100)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={cn(
                          'h-full transition-all',
                          job.status === 'completed' ? 'bg-success-500' : 'bg-primary-500'
                        )}
                        style={{ width: `${(job.processedRecords / job.totalRecords) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-success-600">
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        {job.successCount} success
                      </span>
                      {job.errorCount > 0 && (
                        <span className="text-xs text-error-600">
                          <AlertCircle className="w-3 h-3 inline mr-1" />
                          {job.errorCount} errors
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Error Details */}
                {job.status === 'failed' && job.errors && (
                  <div className="mt-4 p-3 rounded-lg bg-error-50 dark:bg-error-900/20">
                    <p className="text-sm font-medium text-error-600 mb-2">Errors:</p>
                    <ul className="space-y-1">
                      {job.errors.slice(0, 3).map((error, i) => (
                        <li key={i} className="text-xs text-error-600">• {error}</li>
                      ))}
                      {job.errors.length > 3 && (
                        <li className="text-xs text-error-600">...and {job.errors.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <p className="text-slate-500 dark:text-slate-400">
            Download templates to ensure your import file has the correct format and required fields.
          </p>
          {templates.map((template) => (
            <GlassCard key={template.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{template.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                    {template.format}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {template.fields.slice(0, 4).map((field) => (
                      <span key={field} className="text-xs text-slate-500">{field},</span>
                    ))}
                    {template.fields.length > 4 && (
                      <span className="text-xs text-slate-500">+{template.fields.length - 4} more</span>
                    )}
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 font-medium hover:bg-primary-200 transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
            </GlassCard>
          ))}
        </motion.div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upload File</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Import Type</label>
                <select className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500">
                  <option>Players</option>
                  <option>Teams</option>
                  <option>Matches</option>
                  <option>Scorecards</option>
                  <option>CricHeroes Full Export</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">File</label>
                <input
                  type="file"
                  accept=".csv,.json,.xlsx"
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Before importing:</p>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Ensure your file has all required columns</li>
                  <li>• Validate data format matches template</li>
                  <li>• Check for duplicate entries</li>
                  <li>• Preview will be available before final import</li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium hover:shadow-lg">
                Upload & Preview
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default ImportCenter;
