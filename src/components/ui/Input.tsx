import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const inputVariants = cva(
  'flex w-full rounded-xl border bg-transparent px-4 py-2.5 text-base transition-all duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-900 hover:border-primary-300 dark:hover:border-primary-700',
        outline: 'border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white bg-transparent',
        ghost: 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white',
        error: 'border-red-300 dark:border-red-700 text-red-900 dark:text-red-100 focus-visible:ring-red-500',
      },
      size: {
        sm: 'text-sm px-3 py-2',
        md: 'text-base px-4 py-2.5',
        lg: 'text-lg px-5 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, error, icon, iconRight, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(inputVariants({ variant, size, className }), error && 'border-red-500 focus-visible:ring-red-500')}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {iconRight}
          </div>
        )}
        {error && (
          <p className="mt-1.5 text-xs text-red-500 font-medium animate-pulse">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export const InputGroup = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('space-y-2', className)} {...props}>
    {children}
  </div>
);

export const InputLabel = ({ className, children, required, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) => (
  <label className={cn('text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block', className)} {...props}>
    {children}
    {required && <span className="ml-1 text-red-500">*</span>}
  </label>
);

export const InputHint = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-xs text-slate-500 mt-1.5', className)} {...props}>
    {children}
  </p>
);