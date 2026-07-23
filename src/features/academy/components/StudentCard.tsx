import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, User } from 'lucide-react';
import type { Student } from '../types';
import { statusConfig, levelConfig, getBatchById } from '../services/mock-data';
import { cn } from '../../../lib/utils';

interface StudentCardProps {
  student: Student;
  index: number;
  onClick?: () => void;
}

export function StudentCard({ student, index, onClick }: StudentCardProps) {
  const batch = getBatchById(student.batchId);
  const status = statusConfig[student.status];
  const level = levelConfig[student.level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 shadow-lg p-4 cursor-pointer transition-shadow hover:shadow-xl"
    >
      <div className="flex items-start gap-3">
        <img src={student.photoUrl} alt={student.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{student.name}</h4>
            <span className={cn('px-2 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0', status.bg)}>
              {status.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{batch?.name || 'Unassigned'}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={cn('px-2 py-0.5 text-[10px] font-medium rounded-md', level.bg)}>
              {level.label}
            </span>
            <span className="text-[10px] text-slate-400">Age {student.age}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span>Overall Progress</span>
            <span className="font-bold text-slate-600 dark:text-slate-300">{student.overallProgress}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${student.overallProgress}%` }}
              transition={{ duration: 0.8, delay: index * 0.04, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyan-500"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span>Attendance</span>
            <span className="font-bold text-slate-600 dark:text-slate-300">{student.attendancePct}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${student.attendancePct}%` }}
              transition={{ duration: 0.8, delay: index * 0.04 + 0.1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
}

export function StudentDetailModal({ student, onClose }: StudentDetailModalProps) {
  if (!student) return null;
  const batch = getBatchById(student.batchId);
  const status = statusConfig[student.status];
  const level = levelConfig[student.level];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
      >
        <div className="relative h-24 bg-gradient-to-br from-primary-500 to-cyan-500">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="px-6 pb-6 -mt-12">
          <img src={student.photoUrl} alt={student.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-lg" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-3">{student.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn('px-2 py-0.5 text-xs font-bold rounded-full', status.bg)}>{status.label}</span>
            <span className={cn('px-2 py-0.5 text-xs font-medium rounded-md', level.bg)}>{level.label}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Batch</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{batch?.name || 'Unassigned'}</p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Age</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{student.age} years</p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
              <p className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1"><Mail className="w-3 h-3" /> Email</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5 truncate">{student.email}</p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
              <p className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">{student.phone}</p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
              <p className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1"><User className="w-3 h-3" /> Guardian</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">{student.guardianName}</p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
              <p className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1"><Calendar className="w-3 h-3" /> Enrolled</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">{new Date(student.enrollmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500">Overall Progress</span>
                <span className="font-bold text-slate-900 dark:text-white">{student.overallProgress}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyan-500" style={{ width: `${student.overallProgress}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500">Attendance Rate</span>
                <span className="font-bold text-slate-900 dark:text-white">{student.attendancePct}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${student.attendancePct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
