/**
 * CricketIQ Theme — Spacing
 * ============================================
 * Centralized spacing scale (4px base grid).
 */
import { spacing as tokens } from '@design/tokens';

/** Base spacing unit in px */
export const baseSpacing = 4;

/** Spacing scale (MUI-compatible: index → px) */
export const spacing = (factor: number): string => `${baseSpacing * factor}px`;

/** Named spacing tokens for direct reference */
export const space = {
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
} as const;

export { tokens as spacingTokens };
