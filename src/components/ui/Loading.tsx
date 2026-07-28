import { Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── TYPES ─────────────────────────────────────────────────────────────────────────
export type LoadingVariant = 'default' | 'spinner' | 'skeleton' | 'error' | 'empty' | 'success';

export interface LoadingProps {
  variant?: LoadingVariant;
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// ─── COMPONENTS ────────────────────────────────────────────────────────────────────

/**
 * Skeleton Loader Component - Shows placeholder for content loading
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-md bg-slate-200 dark:bg-slate-700', className)} />
  );
}

/**
 * Loading Spinner Component
 */
export function LoadingSpinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return <Loader2 className={cn('animate-spin text-slate-500 dark:text-slate-400', sizeClasses[size], className)} />;
}

/**
 * Empty State Component
 */
export function EmptyState({ message = 'No data available' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
        <AlertCircle className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No data available</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}

/**
 * Error State Component
 */
export function ErrorState({ message = 'Failed to load data' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-red-50 p-4 dark:bg-red-900/20">
        <XCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Failed to load</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}

/**
 * Success State Component
 */
export function SuccessState({ message = 'Data loaded successfully' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-green-50 p-4 dark:bg-green-900/20">
        <CheckCircle2 className="h-8 w-8 text-green-500" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Success</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}

/**
 * Content Loader Component - Handles all loading states
 */
export function ContentLoader({ variant = 'default', message, className, size = 'md' }: LoadingProps) {
  switch (variant) {
    case 'spinner':
      return (
        <div className={cn('flex items-center justify-center', className)}>
          <LoadingSpinner size={size} />
        </div>
      );

    case 'skeleton':
      return (
        <div className={cn('space-y-3', className)}>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      );

    case 'error':
      return <ErrorState message={message} />;

    case 'empty':
      return <EmptyState message={message} />;

    case 'success':
      return <SuccessState message={message} />;

    default:
      return (
        <div className={cn('flex items-center justify-center', className)}>
          <LoadingSpinner size={size} />
          {message && <span className="ml-3 text-sm text-slate-500 dark:text-slate-400">{message}</span>}
        </div>
      );
  }
}

// ─── EXPORTS ───────────────────────────────────────────────────────────────────────
export default ContentLoader;