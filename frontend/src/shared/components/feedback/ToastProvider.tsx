/**
 * ToastProvider — CricketIQ Design System
 * ============================================
 * Global toast notifications with a `useToast()` hook.
 * Mount once near the app root (inside the MUI theme bridge).
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useToastStore, type Toast, type ToastTone } from '@stores/toastStore';
import { layers } from '@design/tokens';
import { motion, slideInRight } from '@shared/components/motion';

/* ── Toast API ───────────────────────────────────────────── */

export interface ToastOptions {
  title: string;
  description?: string;
  /** Auto-dismiss duration in ms (0 = sticky). Default 4000. */
  duration?: number;
}

export interface ToastApi {
  success: (opts: ToastOptions) => string;
  error: (opts: ToastOptions) => string;
  warning: (opts: ToastOptions) => string;
  info: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}

/* ── Tone styling ────────────────────────────────────────── */

const toneIcon: Record<ToastTone, ReactNode> = {
  success: <CheckCircle2 size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

const toneColor: Record<ToastTone, string> = {
  success: 'success.main',
  error: 'error.main',
  warning: 'warning.main',
  info: 'info.main',
};

/* ── Single toast item ───────────────────────────────────── */

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  return (
    <motion.div
      layout
      variants={slideInRight}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="status"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          width: 360,
          maxWidth: 'calc(100vw - 32px)',
          p: 1.5,
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 6,
        }}
      >
      <Box sx={{ color: toneColor[toast.tone], mt: 0.25, flexShrink: 0 }}>
        {toneIcon[toast.tone]}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
          {toast.title}
        </Typography>
        {toast.description && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
            {toast.description}
          </Typography>
        )}
      </Box>
        <IconButton
          size="small"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          sx={{ mt: -0.5, mr: -0.5, color: 'text.secondary' }}
        >
          <X size={16} />
        </IconButton>
      </Box>
    </motion.div>
  );
}

/* ── Provider ────────────────────────────────────────────── */

export function ToastProvider({ children }: { children: ReactNode }) {
  const toasts = useToastStore((s) => s.toasts);
  const push = useToastStore((s) => s.push);
  const dismiss = useToastStore((s) => s.dismiss);
  const clear = useToastStore((s) => s.clear);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const scheduleDismiss = useCallback(
    (id: string, duration: number) => {
      if (duration <= 0) return;
      const t = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, t);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(() => {
    const emit = (tone: ToastTone) => (opts: ToastOptions) => {
      const duration = opts.duration ?? 4000;
      const id = push({ title: opts.title, description: opts.description, tone, duration });
      scheduleDismiss(id, duration);
      return id;
    };
    return {
      success: emit('success'),
      error: emit('error'),
      warning: emit('warning'),
      info: emit('info'),
      dismiss,
      clear,
    };
  }, [push, scheduleDismiss, dismiss, clear]);

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: layers.toast,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </Box>
    </ToastContext.Provider>
  );
}
