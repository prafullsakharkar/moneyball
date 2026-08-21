/**
 * CricketIQ Theme — Breakpoints
 * ============================================
 * Centralized responsive breakpoints.
 */
import { breakpoints as tokens } from '@design/tokens';

/** Named breakpoint values (px) */
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/** MUI breakpoint configuration */
export const muiBreakpoints = {
  values: {
    xs: breakpoints.xs,
    sm: breakpoints.sm,
    md: breakpoints.md,
    lg: breakpoints.lg,
    xl: breakpoints.xl,
  },
};

export { tokens as breakpointTokens };
