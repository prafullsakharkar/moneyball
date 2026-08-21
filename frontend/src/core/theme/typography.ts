/**
 * CricketIQ Theme — Typography
 * ============================================
 * Centralized typography system.
 * Adopts StudioHub's dense scale: 13px base, Inter font, tabular numbers
 * for cricket metrics.
 */
import type { ThemeOptions } from '@mui/material/styles';
import { typography as tokens } from '@design/tokens';

/** Font families */
export const fontFamily = {
  sans: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  mono: '"JetBrains Mono", "Roboto Mono", "Consolas", monospace',
  display: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
};

/** Base font size (px) — dense, StudioHub reference */
export const baseFontSize = 13;

/**
 * Cricket-specific numeric styles.
 * All metrics use tabular-nums for stable column alignment.
 */
export const metrics = {
  score: {
    fontFamily: fontFamily.sans,
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '-0.02em',
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
export const typography: NonNullable<ThemeOptions['typography']> = {
  fontFamily: fontFamily.sans,
  fontSize: baseFontSize,
  htmlFontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: tokens.presets.h1,
  h2: tokens.presets.h2,
  h3: tokens.presets.h3,
  h4: tokens.presets.h4,
  h5: {
    fontSize: '0.9375rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  subtitle1: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: '0.8125rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  body1: tokens.presets.body,
  body2: tokens.presets['body-sm'],
  caption: tokens.presets.caption,
  overline: tokens.presets.overline,
  button: {
    fontSize: tokens.fontSize.sm,
    fontWeight: 500,
    textTransform: 'none' as const,
    letterSpacing: '0.01em',
  },
};
