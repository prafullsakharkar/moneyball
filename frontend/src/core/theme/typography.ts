/**
 * CricketOS Theme — Typography
 * ============================================
 * Centralized typography system.
 * Inter with a system-ui fallback, dense 14px base, and tabular numerals
 * for every cricket statistic so scores, rankings and tables align.
 */
import type { ThemeOptions } from '@mui/material/styles';
import { muiTypography, typeVariants } from './tokens';

/** Font families */
const sans =
  '"Inter", "SF Pro Display", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const mono =
  '"JetBrains Mono", "SFMono-Regular", ui-monospace, Consolas, "Liberation Mono", monospace';

export const fontFamily = {
  sans,
  mono,
  display: sans,
};

/** Base font size (px) — 14px body per DESIGN.md */
export const baseFontSize = 14;

/**
 * Cricket-specific numeric styles.
 * All metrics use tabular-nums for stable column alignment.
 */
export const metrics = {
  score: {
    ...typeVariants.score,
  },
  runs: {
    fontFamily: fontFamily.sans,
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  wickets: {
    fontFamily: fontFamily.sans,
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  overs: {
    fontFamily: fontFamily.mono,
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  },
  runRate: {
    fontFamily: fontFamily.mono,
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  },
  economy: {
    fontFamily: fontFamily.mono,
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  },
  average: {
    fontFamily: fontFamily.mono,
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  },
  strikeRate: {
    fontFamily: fontFamily.mono,
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  },
} as const;

/** MUI typography options */
export const typography: NonNullable<ThemeOptions['typography']> = muiTypography;
