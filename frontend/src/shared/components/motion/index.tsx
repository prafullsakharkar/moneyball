/**
 * Motion — CricketIQ Design System
 * ============================================
 * Framer Motion variants + reusable animated wrappers.
 * Centralizes animation presets so components stay consistent.
 */
import { motion, type Variants } from 'framer-motion';
import type { ReactElement, ReactNode } from 'react';

/* ── Shared variants ─────────────────────────────────────── */

/** Fade + slight upward drift (page/section entrance). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

/** Pure fade (overlays, toasts). */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/** Slide in from the right (drawers, toasts). */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 400, damping: 32 },
  },
  exit: { opacity: 0, x: 24, transition: { duration: 0.15 } },
};

/** Scale + fade (modals, popovers). */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 380, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
};

/** Stagger container for lists/grids. */
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

/* ── Reusable wrappers ───────────────────────────────────── */

export interface MotionProps {
  children: ReactNode;
  /** Variant preset to apply */
  variant?: 'fadeUp' | 'fade' | 'slideInRight' | 'scaleIn';
  /** Optional delay in seconds */
  delay?: number;
  className?: string;
}

const variantMap = { fadeUp, fade, slideInRight, scaleIn };

/**
 * Animated wrapper for entrance transitions.
 * Respects reduced-motion via framer-motion's MotionConfig (set globally).
 */
export function Motion({ children, variant = 'fadeUp', delay = 0, className }: MotionProps): ReactElement {
  const variants = variantMap[variant];
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export { motion };
