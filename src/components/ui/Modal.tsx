import React from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

const modalVariants = cva(
  'fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6',
  {
    variants: {
      isOpen: {
        true: 'visible',
        false: 'invisible',
      },
    },
  }
);

const modalOverlayVariants = cva(
  'fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300',
  {
    variants: {
      isOpen: {
        true: 'opacity-100',
        false: 'opacity-0',
      },
    },
  }
);

const modalContentVariants = cva(
  'relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl transition-all duration-300',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full',
      },
      variant: {
        default: 'border border-slate-200 dark:border-slate-800',
        glass: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/20',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface ModalProps
  extends VariantProps<typeof modalContentVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlay?: boolean;
  className?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnOverlay = true,
  size,
  variant,
  className,
}: ModalProps) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlay) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return createPortal(
    <div className={cn(modalVariants({ isOpen }), className)} role="dialog" aria-modal="true">
      <div className={cn(modalOverlayVariants({ isOpen }))} onClick={handleOverlayClick} />
      <div
        className={cn(modalContentVariants({ size, variant }))}
        role="document"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          {title && (
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5">
          {children}
        </div>
        {footer && (
          <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export const ModalHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4', className)} {...props}>
    {children}
  </div>
);

export const ModalBody = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('space-y-4', className)} {...props}>
    {children}
  </div>
);

export const ModalFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center justify-end gap-3', className)} {...props}>
    {children}
  </div>
);