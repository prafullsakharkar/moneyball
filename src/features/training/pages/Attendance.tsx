import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, XCircle, Clock, FileText, Users, Calendar,
  TrendingUp, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { GlassCard, KPIWidget } from '../../../components/ui/GlassCard';
import { BarChart, DonutChart } from '../../../components/ui/Charts';
import { AttendanceBadge } from '../components';
import { statusConfig as attendanceStatusConfig } from '../components/AttendanceBadge';
import {
  mockAttendance,
  getAttendanceStats,
  trainingPlayers,
  mockSessions,
} from '../services/mock-data';
import { chartColors } from '../../../lib/mock-data';
import type { AttendanceStatus, AttendanceRecord } from '../types';
import { cn } from '../../../lib/utils';

type ViewMode = 'daily' | 'weekly' | 'monthly';

export function Attendance() {
  const [view, setView] = React.useState<ViewMode>('daily');
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [records, setRecords] = React.useState<AttendanceRecord[]>(mockAttendance);

  // Get sessions for the current view period
  const periodSessions = React.useMemo(() => {
    if (view === 'daily') {
      return mockSessions.filter(s => new Date(s.date).toDateString() === currentDate.toDateString());
    }
    const days = view === 'weekly' ? 7 : 30;
    const start = new Date(currentDate);
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    return mockSessions.filter(s => {
      const d = new Date(s.date);
      return d >= start && d < end;
    });
  }, [view, currentDate]);

  // Get records for the current view
  const periodRecords = React.useMemo(() => {
    if (view === 'daily') {
      return records.filter(r => new Date(r.date).toDateString() === currentDate.toDateString());
    }
    const days = view === 'weekly' ? 7 : 30;
    const start = new Date(currentDate);
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    return records.filter(r => {
      const d = new Date(r.date);
      return d >= start && d < end;
    });
  }, [records, view, currentDate]);

  const stats = getAttendanceStats(periodRecords);

  const handleMarkAttendance = (playerId: string, sessionId: string, status: AttendanceStatus) => {
    setRecords(prev => {
      const existing = prev.find(r => r.playerId === playerId && r.sessionId === sessionId);
      if (existing) {
        return prev.map(r => r.playerId === playerId && r.sessionId === sessionId ? { ...r, status } : r);
      }
      const player = trainingPlayers.find(p => p.id === playerId);
      if (!player) return prev;
      return [...prev, {
        id: `att-${sessionId}-${playerId}`,
        sessionId,
        playerId,
        playerName: player.name,
        playerInitials: player.initials,
        status,
        date: currentDate.toISOString(),
        checkInTime: status === 'present' ? '07:00' : undefined,
      }];
    });
  };

  const getStatusForPlayer = (playerId: string, sessionId: string): AttendanceStatus | null => {
    const record = records.find(r => r.playerId === playerId && r.sessionId === sessionId);
    return record?.status || null;
  };

  const shiftDate = (delta: number) => {
    const d = new Date(currentDate);
    if (view === 'daily') d.setDate(d.getDate() + delta);
    else if (view === 'weekly') d.setDate(d.getDate() + delta * 7);
    else d.setMonth(d.getMonth() + delta);
    setCurrentDate(d);
  };

  const dateLabel = (() => {
    if (view === 'daily') return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    if (view === 'weekly') {
      const end = new Date(currentDate);
      end.setDate(end.getDate() + 6);
      return `${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Attendance</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage player attendance</p>
      </div>

      {/* KPI widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIWidget title="Attendance Rate" value={`${stats.attendancePct}%`} icon={<TrendingUp className="w-6 h-6" />} color={chartColors.success} delay={0} trend={{ value: 5, type: 'up' }} />
        <KPIWidget title="Present" value={stats.present} icon={<CheckCircle2 className="w-6 h-6" />} color={chartColors.primary} delay={1} />
        <KPIWidget title="Absent" value={stats.absent} icon={<XCircle className="w-6 h-6" />} color={chartColors.error} delay={2} />
        <KPIWidget title="Late" value={stats.late} icon={<Clock className="w-6 h-6" />} color={chartColors.warning} delay={3} />
      </div>

      {/* View controls */}
      <GlassCard className="!p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(['daily', 'weekly', 'monthly'] as ViewMode[]).map(v => (
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

          <div className="flex items-center gap-2">
            <button onClick={() => shiftDate(-1)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[200px] text-center">{dateLabel}</span>
            <button onClick={() => shiftDate(1)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Attendance Breakdown</h3>
          <DonutChart
            data={[
              { name: 'Present', value: stats.present, color: chartColors.success },
              { name: 'Absent', value: stats.absent, color: chartColors.error },
              { name: 'Late', value: stats.late, color: chartColors.warning },
              { name: 'Excused', value: stats.excused, color: chartColors.primary },
            ]}
            height={260}
          />
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Daily Attendance (This Week)</h3>
          <BarChart
            data={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
              name: day,
              value: Math.floor(Math.random() * 20) + 75,
              color: chartColors.primary,
            }))}
            height={260}
          />
        </GlassCard>
      </div>

      {/* Attendance marking table */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Mark Attendance</h3>
          <span className="text-sm text-slate-500">{periodSessions.length} sessions</span>
        </div>

        {periodSessions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No sessions in this period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Player</th>
                  {periodSessions.slice(0, 5).map(s => (
                    <th key={s.id} className="text-center px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      <div className="flex flex-col items-center">
                        <span>{new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="text-[10px] text-slate-400 normal-case">{new Date(s.date).getDate()}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trainingPlayers.slice(0, 12).map((player, i) => (
                  <motion.tr
                    key={player.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.02, 0.2) }}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <img src={player.photoUrl} alt="" className="w-7 h-7 rounded-lg object-cover" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{player.name}</span>
                      </div>
                    </td>
                    {periodSessions.slice(0, 5).map(session => {
                      const status = getStatusForPlayer(player.id, session.id);
                      return (
                        <td key={session.id} className="px-3 py-2.5">
                          <div className="flex items-center justify-center gap-1">
                            {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map(s => (
                              <button
                                key={s}
                                onClick={() => handleMarkAttendance(player.id, session.id, s)}
                                className={cn(
                                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all',
                                  status === s
                                    ? attendanceStatusConfig[s].bg + ' scale-110 shadow'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                                )}
                                title={attendanceStatusConfig[s].label}
                              >
                                {s === 'present' ? 'P' : s === 'absent' ? 'A' : s === 'late' ? 'L' : 'E'}
                              </button>
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map(s => (
          <AttendanceBadge key={s} status={s} />
        ))}
      </div>
    </div>
  );
}

export default Attendance;
