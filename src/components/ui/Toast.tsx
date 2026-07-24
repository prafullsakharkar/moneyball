import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const toastVariants = cva(
  'fixed bottom-4 right-4 z-[100] flex items-center gap-3 rounded-xl px-4 py-3.5 shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in',
  {
    variants: {
      variant: {
        success: 'bg-emerald-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-amber-500 text-white',
        info: 'bg-primary-500 text-white',
        dark: 'bg-slate-900 text-white',
      },
      isOpen: {
        true: 'translate-y-0 opacity-100',
        false: 'translate-y-12 opacity-0',
      },
      position: {
        'top-right': 'top-4 right-4',
        'bottom-right': 'bottom-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-left': 'bottom-4 left-4',
        'top-center': 'top-4 left-1/2 -translate-x-1/2',
        'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
      },
    },
    defaultVariants: {
      variant: 'info',
      position: 'bottom-right',
    },
  }
);

const toastIconVariants = cva('', {
  variants: {
    variant: {
      success: 'text-emerald-100',
      error: 'text-red-100',
      warning: 'text-amber-100',
      info: 'text-primary-100',
      dark: 'text-slate-300',
    },
  },
});

export interface ToastProps extends VariantProps<typeof toastVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  duration?: number;
  className?: string;
}

export const Toast = ({
  isOpen,
  onClose,
  title,
  message,
  variant,
  position,
  duration = 3000,
  className,
}: ToastProps) => {
  React.useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={cn(toastVariants({ variant, position, isOpen, className }))}
      role="alert"
      aria-live="assertive"
    >
      {getIcon()}
      <div className="flex-1 space-y-0.5">
        {title && <p className="font-medium text-sm">{title}</p>}
        {message && <p className="text-sm opacity-90">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1 hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export interface ToastContainerProps {
  className?: string;
}

export const ToastContainer = ({ className }: ToastContainerProps) => {
  return <div className={cn('fixed inset-0 z-[100] pointer-events-none', className)} />;
};