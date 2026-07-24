import React from 'react';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Toast, ToastProps, ToastContainer } from '../../components/ui/Toast';

type ToastVariant = ToastProps['variant'];
type ToastPosition = ToastProps['position'];

interface ToastContextType {
  showToast: (options: {
    variant?: ToastVariant;
    title?: string;
    message?: string;
    duration?: number;
    position?: ToastPosition;
  }) => void;
  hideToast: () => void;
}

interface ToastState {
  isOpen: boolean;
  variant: ToastVariant;
  title?: string;
  message?: string;
  duration: number;
  position: ToastPosition;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastState, setToastState] = useState<ToastState>({
    isOpen: false,
    variant: 'info',
    duration: 3000,
    position: 'bottom-right',
  });

  const showToast = useCallback((options: {
    variant?: ToastVariant;
    title?: string;
    message?: string;
    duration?: number;
    position?: ToastPosition;
  }) => {
    setToastState({
      isOpen: true,
      variant: options.variant || 'info',
      title: options.title,
      message: options.message,
      duration: options.duration || 3000,
      position: options.position || 'bottom-right',
    });
  }, []);

  const hideToast = useCallback(() => {
    setToastState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        isOpen={toastState.isOpen}
        onClose={hideToast}
        variant={toastState.variant}
        position={toastState.position}
        title={toastState.title}
        message={toastState.message}
        duration={toastState.duration}
      />
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;