import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { FileText, Download, Clock } from 'lucide-react';

export function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Generate and download reports</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-slate-500">Tournament Report</p>
          </div>
          <button className="mt-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-sm font-medium hover:bg-blue-500/20 transition-colors w-full">
            Download
          </button>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-green-500" />
            <p className="text-sm text-slate-500">Team Performance</p>
          </div>
          <button className="mt-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 text-sm font-medium hover:bg-green-500/20 transition-colors w-full">
            Download
          </button>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-purple-500" />
            <p className="text-sm text-slate-500">Player Analytics</p>
          </div>
          <button className="mt-2 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-500 text-sm font-medium hover:bg-purple-500/20 transition-colors w-full">
            Download
          </button>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <p className="text-sm text-slate-500">Financial Report</p>
          </div>
          <button className="mt-2 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 text-sm font-medium hover:bg-amber-500/20 transition-colors w-full">
            Download
          </button>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Reports</h2>
        <div className="space-y-3">
          {[
            { name: 'Tournament Summary - March 2024', type: 'PDF', date: '2024-03-15', size: '2.4 MB' },
            { name: 'Team Performance Q1', type: 'CSV', date: '2024-03-10', size: '1.2 MB' },
            { name: 'Player Statistics', type: 'PDF', date: '2024-03-05', size: '3.1 MB' },
            { name: 'Financial Report February', type: 'XLSX', date: '2024-03-01', size: '567 KB' },
          ].map((report, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{report.name}</p>
                  <p className="text-xs text-slate-500">{report.date} • {report.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300">
                  {report.type}
                </span>
                <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <Download className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export default Reports;