import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, Star, Users, Filter } from 'lucide-react';
import { GlassCard, KPIWidget } from '../../../components/ui/GlassCard';
import { DonutChart } from '../../../components/ui/Charts';
import { chartColors } from '../../../lib/mock-data';
import {
  academyCourses,
  courseCategoryDistribution,
  levelConfig,
} from '../services/mock-data';
import { CourseCard, CourseDetailModal } from '../components';
import type { Course, CourseCategory, CourseLevel } from '../types';
import { cn } from '../../../lib/utils';

const categoryLabels: Record<CourseCategory, string> = {
  batting: 'Batting',
  bowling: 'Bowling',
  fielding: 'Fielding',
  fitness: 'Fitness',
  mental: 'Mental',
  match_strategy: 'Match Strategy',
};

export function Curriculum() {
  const [categoryFilter, setCategoryFilter] = React.useState<CourseCategory | 'all'>('all');
  const [levelFilter, setLevelFilter] = React.useState<CourseLevel | 'all'>('all');
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);

  const filtered = academyCourses.filter(c => {
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (levelFilter !== 'all' && c.level !== levelFilter) return false;
    return true;
  });

  const categoryOptions: (CourseCategory | 'all')[] = ['all', 'batting', 'bowling', 'fielding', 'fitness', 'mental', 'match_strategy'];
  const levelOptions: (CourseLevel | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced', 'elite'];

  const totalModules = academyCourses.reduce((s, c) => s + c.modules.length, 0);
  const totalEnrolled = academyCourses.reduce((s, c) => s + c.enrolledCount, 0);
  const avgRating = (academyCourses.reduce((s, c) => s + c.rating, 0) / academyCourses.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Curriculum</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Course catalog and training modules</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Total Courses" value={academyCourses.length} icon={<BookOpen className="w-6 h-6" />} color={chartColors.primary} delay={0} />
        <KPIWidget title="Total Modules" value={totalModules} icon={<BookOpen className="w-6 h-6" />} color={chartColors.cyan} delay={1} />
        <KPIWidget title="Total Enrolled" value={totalEnrolled} icon={<Users className="w-6 h-6" />} color={chartColors.success} delay={2} />
        <KPIWidget title="Avg Rating" value={avgRating} icon={<Star className="w-6 h-6" />} color={chartColors.warning} delay={3} />
      </div>

      {/* Category distribution */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Enrollment by Category</h3>
        <DonutChart data={courseCategoryDistribution} height={240} />
      </GlassCard>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex-wrap">
          {categoryOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setCategoryFilter(opt)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                categoryFilter === opt ? 'bg-white dark:bg-slate-700 text-primary-500 shadow' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              {opt === 'all' ? 'All' : categoryLabels[opt as CourseCategory]}
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
      </div>

      {/* Course grid */}
      {filtered.length === 0 ? (
        <GlassCard>
          <div className="text-center py-12">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No courses match your filters</p>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course, i) => (
            <CourseCard
              key={course.id}
              course={course}
              index={i}
              onClick={() => setSelectedCourse(course)}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selectedCourse && (
          <CourseDetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Curriculum;
