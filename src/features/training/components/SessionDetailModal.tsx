import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, User, Users, Dumbbell, FileText, Activity } from 'lucide-react';
import type { PracticeSession } from '../types';
import { typeConfig, intensityConfig, statusConfig } from './SessionCard';
import { cn } from '../../../lib/utils';

interface SessionDetailModalProps {
  session: PracticeSession | null;
  onClose: () => void;
}

export function SessionDetailModal({ session, onClose }: SessionDetailModalProps) {
  if (!session) return null;
  const tc = typeConfig[session.type];
  const ic = intensityConfig[session.intensity];
  const sc = statusConfig[session.status];
  const date = new Date(session.date);

  return (
    <AnimatePresence>
      {session && (
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Color header */}
              <div className="h-2" style={{ backgroundColor: tc.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold uppercase', tc.bg)}>{tc.label}</span>
                      <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold uppercase', sc.bg)}>{sc.label}</span>
                      <span className={cn('text-xs font-medium', ic.color)}>{ic.label} Intensity</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{session.title}</h3>
                  </div>
                  <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <InfoItem icon={<Clock className="w-3.5 h-3.5" />} label="Date" value={date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} />
                  <InfoItem icon={<Clock className="w-3.5 h-3.5" />} label="Time" value={`${session.startTime} — ${session.endTime}`} />
                  <InfoItem icon={<MapPin className="w-3.5 h-3.5" />} label="Ground" value={session.ground} />
                  <InfoItem icon={<User className="w-3.5 h-3.5" />} label="Coach" value={session.coach} />
                </div>

                {/* Players */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Players ({session.players.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {session.players.map((p, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Equipment</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {session.equipment.map((e, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {session.notes && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      {session.notes}
                    </p>
                  </div>
                )}

                {/* Attendance */}
                {session.status === 'completed' && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Attendance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${session.attendance}%` }} />
                      </div>
                      <span className="text-sm font-bold text-green-500">{session.attendance}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
      <span className="text-slate-400">{icon}</span>
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</p>
      </div>
    </div>
  );
}
