import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Users, Download } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { chartColors } from '../../../lib/mock-data';
import { academyStudents, academyBatches, statusConfig, levelConfig } from '../services/mock-data';
import { StudentCard, StudentDetailModal } from '../components';
import type { Student, StudentStatus, CourseLevel } from '../types';
import { cn } from '../../../lib/utils';

export function Students() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<StudentStatus | 'all'>('all');
  const [levelFilter, setLevelFilter] = React.useState<CourseLevel | 'all'>('all');
  const [batchFilter, setBatchFilter] = React.useState<string>('all');
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);

  const filtered = academyStudents.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (levelFilter !== 'all' && s.level !== levelFilter) return false;
    if (batchFilter !== 'all' && s.batchId !== batchFilter) return false;
    return true;
  });

  const statusOptions: (StudentStatus | 'all')[] = ['all', 'active', 'graduated', 'on_leave', 'dropped'];
  const levelOptions: (CourseLevel | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced', 'elite'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Students</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{filtered.length} students enrolled</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors shadow-md">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Filters */}
      <GlassCard className="!p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {statusOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setStatusFilter(opt)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors',
                  statusFilter === opt ? 'bg-white dark:bg-slate-700 text-primary-500 shadow' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {opt === 'all' ? 'All' : statusConfig[opt as StudentStatus]?.label || opt}
              </button>
            ))}
          </div>

          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value as CourseLevel | 'all')}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {levelOptions.map(opt => (
              <option key={opt} value={opt}>{opt === 'all' ? 'All Levels' : levelConfig[opt as CourseLevel]?.label}</option>
            ))}
          </select>

          <select
            value={batchFilter}
            onChange={e => setBatchFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Batches</option>
            {academyBatches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </GlassCard>

      {/* Student grid */}
      {filtered.length === 0 ? (
        <GlassCard>
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No students match your filters</p>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((student, i) => (
            <StudentCard
              key={student.id}
              student={student}
              index={i}
              onClick={() => setSelectedStudent(student)}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Students;
