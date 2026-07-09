import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
  gradient?: boolean;
  hover?: boolean;
}

export function GlassCard({ children, className, gradient, hover, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        'bg-white/70 dark:bg-slate-900/70',
        'backdrop-blur-xl border border-white/20 dark:border-slate-700/50',
        'shadow-lg',
        gradient && 'bg-gradient-to-br from-white/80 via-white/70 to-slate-100/80 dark:from-slate-800/60 dark:to-slate-900/60',
        className
      )}
      {...props}
    >
      {gradient && (
        <>
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-primary-500/20 to-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-500/20 to-accent-purple-500/20 blur-3xl" />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

interface KPIWidgetProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; type: 'up' | 'down' };
  color?: string;
  prefix?: string;
  suffix?: string;
  accent?: boolean;
  delay?: number;
}

export function KPIWidget({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = '#6366f1',
  prefix = '',
  suffix = '',
  accent,
  delay = 0,
}: KPIWidgetProps) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const numericValue = typeof value === 'number' ? value : 0;

  React.useEffect(() => {
    if (typeof value === 'number') {
      const duration = 1000;
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(numericValue * easeOut));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [numericValue]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.05 }}
      whileHover={{ y: -4 }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-lg',
        accent && 'ring-1 ring-primary-500/30'
      )}
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-20 blur-2xl" style={{ background: color }} />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {prefix}{typeof value === 'number' ? displayValue.toLocaleString() : value}{suffix}
          </p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend.type === 'up' ? 'text-success-500' : 'text-error-500'}`}>
              <span>{trend.type === 'up' ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20` }}>
            <div style={{ color }}>{icon}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl', className)} />;
}
