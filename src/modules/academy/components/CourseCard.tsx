import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, Users, BookOpen, ChevronRight } from 'lucide-react';
import type { Course } from '../types';
import { levelConfig, getCoachById } from '../services/mock-data';
import { cn } from '../../../lib/utils';

const categoryColors: Record<string, string> = {
  batting: '#6366f1',
  bowling: '#06b6d4',
  fielding: '#22c55e',
  fitness: '#f59e0b',
  mental: '#a855f7',
  match_strategy: '#ef4444',
};

const categoryIcons: Record<string, string> = {
  batting: '🏏',
  bowling: '🎯',
  fielding: '⚡',
  fitness: '💪',
  mental: '🧠',
  match_strategy: '📋',
};

interface CourseCardProps {
  course: Course;
  index: number;
  onClick?: () => void;
}

export function CourseCard({ course, index, onClick }: CourseCardProps) {
  const level = levelConfig[course.level];
  const coach = getCoachById(course.instructorId);
  const color = categoryColors[course.category];
  const totalDuration = course.modules.reduce((sum, m) => sum + m.durationMins, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 shadow-lg overflow-hidden cursor-pointer transition-shadow hover:shadow-xl"
    >
      <div className="h-1.5" style={{ backgroundColor: color }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: `${color}15` }}>
              {categoryIcons[course.category]}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{course.title}</h4>
              <p className="text-[10px] text-slate-400 capitalize">{course.category.replace('_', ' ')}</p>
            </div>
          </div>
          <span className={cn('px-2 py-0.5 text-[10px] font-medium rounded-md', level.bg)}>{level.label}</span>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{course.description}</p>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
            <Clock className="w-3.5 h-3.5 text-slate-400 mx-auto" />
            <p className="text-[10px] text-slate-500 mt-1">{course.durationWeeks}w</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
            <BookOpen className="w-3.5 h-3.5 text-slate-400 mx-auto" />
            <p className="text-[10px] text-slate-500 mt-1">{course.modules.length} mods</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
            <Users className="w-3.5 h-3.5 text-slate-400 mx-auto" />
            <p className="text-[10px] text-slate-500 mt-1">{course.enrolledCount}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <img src={coach?.photoUrl} alt={coach?.name} className="w-6 h-6 rounded-full object-cover" />
            <span className="text-xs text-slate-500">{coach?.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{course.rating}</span>
            <ChevronRight className="w-4 h-4 text-slate-300 ml-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
}

export function CourseDetailModal({ course, onClose }: CourseDetailModalProps) {
  if (!course) return null;
  const level = levelConfig[course.level];
  const coach = getCoachById(course.instructorId);
  const color = categoryColors[course.category];
  const totalDuration = course.modules.reduce((sum, m) => sum + m.durationMins, 0);

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
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl"
      >
        <div className="h-2" style={{ backgroundColor: color }} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${color}15` }}>
                {categoryIcons[course.category]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{course.title}</h3>
                <span className={cn('px-2 py-0.5 text-xs font-medium rounded-md inline-block mt-1', level.bg)}>{level.label}</span>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors">
              ✕
            </button>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{course.description}</p>

          <div className="grid grid-cols-4 gap-3 mb-5">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
              <Clock className="w-4 h-4 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{course.durationWeeks}</p>
              <p className="text-[10px] text-slate-400">Weeks</p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
              <BookOpen className="w-4 h-4 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{course.modules.length}</p>
              <p className="text-[10px] text-slate-400">Modules</p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
              <Users className="w-4 h-4 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{course.enrolledCount}</p>
              <p className="text-[10px] text-slate-400">Enrolled</p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-center">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{course.rating}</p>
              <p className="text-[10px] text-slate-400">Rating</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <img src={coach?.photoUrl} alt={coach?.name} className="w-8 h-8 rounded-full object-cover" />
            <div>
              <p className="text-xs text-slate-400">Instructor</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{coach?.name}</p>
            </div>
          </div>

          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Course Modules</h4>
          <div className="space-y-2">
            {course.modules.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: `${color}15`, color }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{mod.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {mod.skills.map(skill => (
                      <span key={skill} className="px-1.5 py-0.5 text-[10px] rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {skill}
                      </span>
                    ))}
                    <span className="text-[10px] text-slate-400 ml-auto">{mod.durationMins} min</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
