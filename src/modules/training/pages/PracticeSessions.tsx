import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, List, ChevronLeft, ChevronRight, Plus, Search, X,
  Clock, MapPin, User, Users, Dumbbell, FileText,
} from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { SessionCard, SessionDetailModal, typeConfig } from '../components';
import { mockSessions, trainingPlayers, coaches, grounds, equipmentList } from '../services/mock-data';
import type { PracticeSession, SessionType } from '../types';
import { cn } from '../../../lib/utils';

type ViewMode = 'calendar' | 'timeline' | 'grid';

export function PracticeSessions() {
  const [view, setView] = React.useState<ViewMode>('calendar');
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedSession, setSelectedSession] = React.useState<PracticeSession | null>(null);
  const [showCreate, setShowCreate] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<SessionType | 'all'>('all');

  const filtered = React.useMemo(() => {
    return mockSessions.filter(s => {
      if (query && !s.title.toLowerCase().includes(query.toLowerCase()) && !s.coach.toLowerCase().includes(query.toLowerCase())) return false;
      if (typeFilter !== 'all' && s.type !== typeFilter) return false;
      return true;
    });
  }, [query, typeFilter]);

  // Calendar logic
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - startDay + 1;
    if (day < 1 || day > daysInMonth) return null;
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
  });

  const sessionsByDate = React.useMemo(() => {
    const map = new Map<string, PracticeSession[]>();
    filtered.forEach(s => {
      const key = new Date(s.date).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    return map;
  }, [filtered]);

  const timelineSessions = React.useMemo(() => {
    return [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filtered]);

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Practice Sessions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Schedule and manage training sessions</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors shadow-lg shadow-primary-500/25"
        >
          <Plus className="w-4 h-4" />
          New Session
        </button>
      </div>

      {/* Toolbar */}
      <GlassCard className="!p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sessions or coaches..."
              className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none"
            />
            {query && <button onClick={() => setQuery('')}><X className="w-3.5 h-3.5 text-slate-400" /></button>}
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as SessionType | 'all')}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 outline-none border border-transparent focus:border-primary-500"
          >
            <option value="all">All Types</option>
            {Object.entries(typeConfig).map(([key, tc]) => (
              <option key={key} value={key}>{tc.label}</option>
            ))}
          </select>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(['calendar', 'timeline', 'grid'] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors',
                  view === v ? 'bg-white dark:bg-slate-700 text-primary-500 shadow' : 'text-slate-400'
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Calendar View */}
      {view === 'calendar' && (
        <GlassCard>
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{monthName}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-medium"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-slate-400 py-2">{day}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (!day) return <div key={i} className="min-h-[80px] rounded-lg bg-slate-50/50 dark:bg-slate-800/20" />;
              const daySessions = sessionsByDate.get(day.toDateString()) || [];
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div
                  key={i}
                  className={cn(
                    'min-h-[80px] rounded-lg p-1.5 border transition-colors cursor-pointer',
                    isToday
                      ? 'border-primary-500 bg-primary-500/5'
                      : 'border-slate-200/60 dark:border-slate-700/50 bg-white dark:bg-slate-900 hover:border-primary-400'
                  )}
                >
                  <span className={cn(
                    'text-xs font-medium block mb-1',
                    isToday ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500'
                  )}>
                    {day.getDate()}
                  </span>
                  <div className="space-y-0.5">
                    {daySessions.slice(0, 3).map(s => {
                      const tc = typeConfig[s.type];
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSession(s)}
                          className="w-full flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: `${tc.color}15`, color: tc.color }}
                        >
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: tc.color }} />
                          <span className="truncate">{s.startTime} {tc.label}</span>
                        </button>
                      );
                    })}
                    {daySessions.length > 3 && (
                      <span className="text-[10px] text-slate-400 px-1.5">+{daySessions.length - 3} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Timeline View */}
      {view === 'timeline' && (
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Session Timeline</h3>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

            <div className="space-y-3">
              {timelineSessions.map((session, i) => {
                const tc = typeConfig[session.type];
                const date = new Date(session.date);
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    onClick={() => setSelectedSession(session)}
                    className="relative flex items-start gap-4 pl-12 cursor-pointer group"
                  >
                    {/* Dot */}
                    <div
                      className="absolute left-3 top-3 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 z-10 group-hover:scale-125 transition-transform"
                      style={{ backgroundColor: tc.color }}
                    />
                    {/* Content */}
                    <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{session.startTime}</span>
                        </div>
                        <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold uppercase', tc.bg)}>
                          {tc.label}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{session.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{session.ground}</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{session.coach}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{session.players.length}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((session, i) => (
            <SessionCard key={session.id} session={session} index={i} onClick={setSelectedSession} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-400 text-lg">No sessions found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or create a new session</p>
        </div>
      )}

      {/* Session detail modal */}
      <SessionDetailModal session={selectedSession} onClose={() => setSelectedSession(null)} />

      {/* Create session modal */}
      <CreateSessionModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}

function CreateSessionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState<SessionType>('batting');
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = React.useState('07:00');
  const [endTime, setEndTime] = React.useState('09:00');
  const [coach, setCoach] = React.useState(coaches[0]);
  const [ground, setGround] = React.useState(grounds[0]);
  const [intensity, setIntensity] = React.useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = React.useState('');
  const [selectedPlayers, setSelectedPlayers] = React.useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = React.useState<string[]>([]);

  const togglePlayer = (name: string) => {
    setSelectedPlayers(prev => prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]);
  };

  const toggleEquipment = (item: string) => {
    setSelectedEquipment(prev => prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]);
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-primary-500 transition-colors";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto z-50"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-10">
                <h3 className="font-semibold text-slate-900 dark:text-white">New Practice Session</h3>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Title</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Session title" className={inputClass} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value as SessionType)} className={inputClass}>
                      {Object.entries(typeConfig).map(([key, tc]) => (
                        <option key={key} value={key}>{tc.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Intensity</label>
                    <select value={intensity} onChange={(e) => setIntensity(e.target.value as 'low' | 'medium' | 'high')} className={inputClass}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Start</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">End</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Coach</label>
                    <select value={coach} onChange={(e) => setCoach(e.target.value)} className={inputClass}>
                      {coaches.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Ground</label>
                    <select value={ground} onChange={(e) => setGround(e.target.value)} className={inputClass}>
                      {grounds.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                {/* Players */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Players ({selectedPlayers.length})</label>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    {trainingPlayers.map(p => (
                      <button
                        key={p.id}
                        onClick={() => togglePlayer(p.name)}
                        className={cn(
                          'px-2 py-1 rounded-lg text-xs font-medium transition-colors',
                          selectedPlayers.includes(p.name)
                            ? 'bg-primary-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        )}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Equipment ({selectedEquipment.length})</label>
                  <div className="flex flex-wrap gap-1.5">
                    {equipmentList.map(e => (
                      <button
                        key={e}
                        onClick={() => toggleEquipment(e)}
                        className={cn(
                          'px-2 py-1 rounded-lg text-xs font-medium transition-colors',
                          selectedEquipment.includes(e)
                            ? 'bg-primary-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        )}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Notes</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Session notes..." rows={2} className={cn(inputClass, 'resize-none')} />
                </div>
              </div>

              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2 sticky bottom-0 bg-white dark:bg-slate-900">
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={onClose}
                  disabled={!title}
                  className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                  Create Session
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default PracticeSessions;
