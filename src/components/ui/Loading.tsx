import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const spinnerVariants = cva(
  'animate-spin rounded-full border-2 border-current border-t-transparent',
  {
    variants: {
      size: {
        xs: 'w-4 h-4 border-width-3',
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
      },
      variant: {
        primary: 'border-primary-500 border-t-white',
        secondary: 'border-slate-400 border-t-white',
        white: 'border-white border-t-transparent',
        dark: 'border-slate-900 border-t-transparent',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  }
);

const skeletonVariants = cva(
  'animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700',
  {
    variants: {
      size: {
        xs: 'h-3 w-16',
        sm: 'h-4 w-24',
        md: 'h-4 w-full',
        lg: 'h-8 w-3/4',
        xl: 'h-16 w-full',
      },
      shape: {
        rect: 'rounded-lg',
        circle: 'rounded-full',
        square: 'rounded-lg',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'rect',
    },
  }
);

export interface LoadingProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  text?: string;
  fullscreen?: boolean;
}

export const Loading = ({
  size,
  variant,
  className,
  text,
  fullscreen = false,
}: LoadingProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullscreen && 'fixed inset-0 z-50 bg-white dark:bg-slate-950',
        className
      )}
    >
      <div className={cn(spinnerVariants({ size, variant }))} />
      {text && <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">{text}</p>}
    </div>
  );
};

export interface SkeletonProps extends VariantProps<typeof skeletonVariants> {
  className?: string;
}

export const Skeleton = ({ size, shape, className }: SkeletonProps) => {
  return <div className={cn(skeletonVariants({ size, shape, className }))} />;
};

export const LoadingOverlay = ({
  isLoading,
  text = 'Loading...',
  className,
}: {
  isLoading: boolean;
  text?: string;
  className?: string;
}) => {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm',
        className
      )}
    >
      <Loading text={text} size="lg" />
    </div>
  );
};

export const LoadingWrapper = ({
  isLoading,
  children,
  text = 'Loading...',
  className,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  className?: string;
}) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && <LoadingOverlay isLoading={isLoading} text={text} />}
    </div>
  );
};