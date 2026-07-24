// React hook for toast notification management

import { useState, useCallback } from 'react';
import { Toast, ToastType, ToastPosition } from '../types/common';

// Toast context types
export interface ToastContextType {
  toasts: Toast[];
  show: (type: ToastType, title: string, message?: string, options?: Partial<Toast>) => void;
  success: (title: string, message?: string, options?: Partial<Toast>) => void;
  error: (title: string, message?: string, options?: Partial<Toast>) => void;
  info: (title: string, message?: string, options?: Partial<Toast>) => void;
  warning: (title: string, message?: string, options?: Partial<Toast>) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const TOAST_DURATION = 5000;

/**
 * Custom hook for toast notification management
 * Handles showing, dismissing, and managing toast notifications
 */
export function useToast(): ToastContextType {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (type: ToastType, title: string, message?: string, options?: Partial<Toast>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const toast: Toast = {
        id,
        type,
        title,
        message,
        position: options?.position,
        duration: options?.duration || TOAST_DURATION,
        onClose: options?.onClose,
      };

      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss after duration
      if (toast.duration) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
          toast.onClose?.();
        }, toast.duration);
      }

      return id;
    },
    []
  );

  const show = useCallback(
    (type: ToastType, title: string, message?: string, options?: Partial<Toast>): void => {
      addToast(type, title, message, options);
    },
    [addToast]
  );

  const success = useCallback(
    (title: string, message?: string, options?: Partial<Toast>): void => {
      addToast('success', title, message, options);
    },
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string, options?: Partial<Toast>): void => {
      addToast('error', title, message, options);
    },
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string, options?: Partial<Toast>): void => {
      addToast('info', title, message, options);
    },
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string, options?: Partial<Toast>): void => {
      addToast('warning', title, message, options);
    },
    [addToast]
  );

  const dismiss = useCallback(
    (id: string): void => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    },
    []
  );

  const dismissAll = useCallback((): void => {
    setToasts([]);
  }, []);

  return {
    toasts,
    show,
    success,
    error,
    info,
    warning,
    dismiss,
    dismissAll,
  };
}

/**
 * Custom hook for toast management with a fixed position
 */
export function useToastAtPosition(position: ToastPosition) {
  const { show, success, error, info, warning } = useToast();

  return {
    show: (type: ToastType, title: string, message?: string, options?: Partial<Toast>) =>
      show(type, title, message, { position, ...options }),
    success: (title: string, message?: string, options?: Partial<Toast>) => 
      success(title, message, { position, ...options }),
    error: (title: string, message?: string, options?: Partial<Toast>) => 
      error(title, message, { position, ...options }),
    info: (title: string, message?: string, options?: Partial<Toast>) => 
      info(title, message, { position, ...options }),
    warning: (title: string, message?: string, options?: Partial<Toast>) => 
      warning(title, message, { position, ...options }),
  };
}

/**
 * Custom hook for toast management with custom duration
 */
export function useToastWithDuration(duration: number) {
  const toastApi = useToast();

  return {
    show: (type: ToastType, title: string, message?: string, options?: Partial<Toast>) =>
      toastApi.show(type, title, message, { duration, ...options }),
    success: (title: string, message?: string, options?: Partial<Toast>) =>
      toastApi.success(title, message, { duration, ...options }),
    error: (title: string, message?: string, options?: Partial<Toast>) =>
      toastApi.error(title, message, { duration, ...options }),
    info: (title: string, message?: string, options?: Partial<Toast>) =>
      toastApi.info(title, message, { duration, ...options }),
    warning: (title: string, message?: string, options?: Partial<Toast>) =>
      toastApi.warning(title, message, { duration, ...options }),
  };
}

/**
 * Custom hook for batch toast notifications
 */
export function useToastBatch() {
  const { show, success, error, info, warning } = useToast();

  const showMany = useCallback(
    (toasts: { type: ToastType; title: string; message?: string }[]): void => {
      toasts.forEach(({ type, title, message }) => {
        setTimeout(() => {
          show(type, title, message);
        }, Math.random() * 500);
      });
    },
    [show]
  );

  return { showMany };
}