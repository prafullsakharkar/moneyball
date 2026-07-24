import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { ChevronDown, Check } from 'lucide-react';

const selectVariants = cva(
  'relative flex w-full items-center justify-between rounded-xl border bg-transparent px-4 py-2.5 text-base transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-900 hover:border-primary-300 dark:hover:border-primary-700',
        outline: 'border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white bg-transparent',
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

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  placeholder?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, placeholder, error, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(selectVariants({ variant, size, className }), error && 'border-red-500 focus-visible:ring-red-500')}
          {...props}
        >
          {placeholder && !props.value && <option value="" disabled>{placeholder}</option>}
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        {error && (
          <p className="mt-1.5 text-xs text-red-500 font-medium animate-pulse">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export const SelectOption = ({ value, children, disabled = false }: { value: string; children: React.ReactNode; disabled?: boolean }) => (
  <option value={value} disabled={disabled}>
    {children}
  </option>
);