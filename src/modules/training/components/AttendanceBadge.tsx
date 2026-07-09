import React from 'react';
import { cn } from '../../../lib/utils';
import type { AttendanceStatus } from '../types';

const statusConfig: Record<AttendanceStatus, { label: string; bg: string; dot: string }> = {
  present: { label: 'Present', bg: 'bg-green-500/10 text-green-600 dark:text-green-400', dot: 'bg-green-500' },
  absent: { label: 'Absent', bg: 'bg-red-500/10 text-red-600 dark:text-red-400', dot: 'bg-red-500' },
  late: { label: 'Late', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  excused: { label: 'Excused', bg: 'bg-primary-500/10 text-primary-600 dark:text-primary-400', dot: 'bg-primary-500' },
};

interface AttendanceBadgeProps {
  status: AttendanceStatus;
  size?: 'sm' | 'md';
  onClick?: (status: AttendanceStatus) => void;
  active?: boolean;
}

export function AttendanceBadge({ status, size = 'md', onClick, active }: AttendanceBadgeProps) {
  const config = statusConfig[status];
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={() => onClick?.(status)}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        onClick
          ? active
            ? config.bg
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
          : config.bg
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </Component>
  );
}

export { statusConfig };
