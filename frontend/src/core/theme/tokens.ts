/**
 * CricketOS — Semantic Design Tokens
 * ============================================
 * Central semantic token layer for the CricketOS design system.
 *
 * Raw values live in `@design/tokens`; this module assigns semantic
 * roles (background, surface, foreground, muted text, borders, focus,
 * accent, status colors) per theme mode and exposes the typography
 * variants, density, radius, motion, and layout constants used across
 * the application.
 *
 * CricketOS is a dark-first enterprise system for operating cricket
 * organizations. The light theme is a deliberate counterpart — never a
 * simple inversion of dark mode.
 */
import type { ThemeOptions } from '@mui/material/styles';

/* ── Color Tokens ─────────────────────────────────────────── */

export interface CricketSurface {
  100: string;
  200: string;
  300: string;
  400?: string;
}

export interface CricketColorTokens {
  /** Page background */
  background: string;
  /** Layered surfaces (low → high) */
  surface: CricketSurface;
  /** Primary foreground text */
  foreground: string;
  /** Secondary text */
  muted: string;
  /** Tertiary / metadata text */
  subtle: string;
  /** Disabled content */
  disabled: string;
  /** Default hairline border */
  border: string;
  /** Stronger divider / control border */
  borderStrong: string;
  /** Visible keyboard focus ring */
  focus: string;
  /** CricketOS accent (active / live / primary action) */
  accent: string;
  /** Accent tinted fill (selected rows, active nav) */
  accentDim: string;
  /** Accent on hover / pressed */
  accentDark: string;
  /** Success semantics */
  success: string;
  /** Warning semantics */
  warning: string;
  /** Danger / destructive semantics */
  danger: string;
  /** Informational semantics */
  info: string;
}

/** Dark mode — the primary CricketOS experience. */
export const darkTokens: CricketColorTokens = {
  background: '#090A0B',
  surface: { 100: '#101113', 200: '#141619', 300: '#191C20', 400: '#20242A' },
  foreground: '#F1F3F4',
  muted: 'rgba(241, 243, 244, 0.64)',
  subtle: 'rgba(241, 243, 244, 0.42)',
  disabled: 'rgba(241, 243, 244, 0.25)',
  border: 'rgba(255, 255, 255, 0.07)',
  borderStrong: 'rgba(255, 255, 255, 0.13)',
  focus: 'rgba(163, 230, 53, 0.55)',
  accent: '#A3E635',
  accentDim: 'rgba(163, 230, 53, 0.14)',
  accentDark: '#65A30D',
  success: '#84CC16',
  warning: '#F59E0B',
  danger: '#F87171',
  info: '#60A5FA',
};

/** Light mode — a proper counterpart, not an inversion. */
export const lightTokens: CricketColorTokens = {
  background: '#F7F7F5',
  surface: { 100: '#FFFFFF', 200: '#F2F2EF', 300: '#EAEAE6' },
  foreground: '#151515',
  muted: 'rgba(21, 21, 21, 0.62)',
  subtle: 'rgba(21, 21, 21, 0.42)',
  disabled: 'rgba(21, 21, 21, 0.26)',
  border: 'rgba(21, 21, 21, 0.09)',
  borderStrong: 'rgba(21, 21, 21, 0.16)',
  focus: 'rgba(101, 163, 13, 0.45)',
  accent: '#65A30D',
  accentDim: 'rgba(101, 163, 13, 0.14)',
  accentDark: '#4D7C0F',
  success: '#4D7C0F',
  warning: '#B45309',
  danger: '#DC2626',
  info: '#2563EB',
};

export type ThemeMode = 'light' | 'dark';

/** Resolve the semantic color set for a given mode. */
export const colorTokens = (mode: ThemeMode): CricketColorTokens =>
  mode === 'dark' ? darkTokens : lightTokens;

/* ── Typography Variants ──────────────────────────────────── */

/** Semantic type scale per DESIGN.md §03. */
export const typeVariants = {
  /** Major marketing / introduction surfaces only */
  display: {
    fontSize: 'clamp(2.25rem, 5vw, 4rem)',
    lineHeight: 1.04,
    letterSpacing: '-0.035em',
    fontWeight: 500,
  },
  /** 24px page heading */
  pageHeading: {
    fontSize: '1.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    fontWeight: 600,
  },
  /** 16px section heading */
  sectionHeading: {
    fontSize: '1rem',
    lineHeight: 1.3,
    fontWeight: 600,
  },
  /** 14px body */
  body: {
    fontSize: '0.875rem',
    lineHeight: 1.55,
    letterSpacing: '-0.005em',
    fontWeight: 400,
  },
  /** 13px secondary body */
  smallBody: {
    fontSize: '0.8125rem',
    lineHeight: 1.5,
    fontWeight: 400,
  },
  /** 12px field / control label */
  label: {
    fontSize: '0.75rem',
    lineHeight: 1.4,
    fontWeight: 500,
  },
  /** 12px metadata (apply `text.secondary` for the muted role) */
  metadata: {
    fontSize: '0.75rem',
    lineHeight: 1.4,
    fontWeight: 400,
  },
  /** Large match score */
  score: {
    fontSize: '1.75rem',
    lineHeight: 1.1,
    fontWeight: 600,
    letterSpacing: '-0.03em',
    fontVariantNumeric: 'tabular-nums',
  },
  /** Critical live score */
  criticalScore: {
    fontSize: '2rem',
    lineHeight: 1.1,
    fontWeight: 600,
    letterSpacing: '-0.03em',
    fontVariantNumeric: 'tabular-nums',
  },
  /** Base tabular numerals for all cricket statistics */
  numeric: {
    fontVariantNumeric: 'tabular-nums',
  },
} as const;

/* ── Layout Constants ─────────────────────────────────────── */

export const layoutTokens = {
  headerHeight: 56,
  sidebarWidth: 240,
  sidebarCollapsedWidth: 64,
  pagePadding: 24,
  pagePaddingLarge: 32,
  pagePaddingCompact: 16,
  contentMaxWidth: 1200,
  formMaxWidth: 480,
  dialogMaxWidth: 560,
  drawerWidth: 400,
} as const;

/* ── Control & Shape Constants ────────────────────────────── */

export const controlTokens = {
  height: 36,
  heightSmall: 32,
  heightLarge: 40,
  paddingX: 12,
  radius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
  },
} as const;

export const densityTokens = {
  row: {
    compact: 36,
    default: 40,
    comfortable: 44,
  },
  tableHeader: {
    fontSize: 12,
    fontWeight: 500,
    paddingX: 12,
    paddingY: 8,
  },
  tableCell: {
    paddingX: 12,
    paddingY: 6,
  },
} as const;

/* ── Motion Constants ─────────────────────────────────────── */

export const motionTokens = {
  fast: '120ms',
  standard: '180ms',
  slow: '300ms',
  easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
} as const;

/* ── MUI Palette Augmentation ─────────────────────────────── */
/* Semantic roles exposed on `theme.palette` so components never
   hardcode colors. Declared once; consumed by components via sx. */

declare module '@mui/material/styles' {
  interface Palette {
    border: string;
    borderStrong: string;
    hover: string;
    active: string;
  }
  interface PaletteOptions {
    border?: string;
    borderStrong?: string;
    hover?: string;
    active?: string;
  }
  interface TypeText {
    tertiary: string;
  }
}

/* ── Typography option builder ────────────────────────────── */
/* MUI-safe variant set that includes the semantic CricketOS scale. */

export const muiTypography: NonNullable<ThemeOptions['typography']> = {
  fontFamily:
    '"Inter", "SF Pro Display", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 14,
  htmlFontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  h1: typeVariants.pageHeading,
  h2: typeVariants.sectionHeading,
  h3: {
    fontSize: '0.9375rem',
    lineHeight: 1.35,
    fontWeight: 600,
  },
  h4: {
    fontSize: '0.875rem',
    lineHeight: 1.4,
    fontWeight: 600,
  },
  h5: {
    fontSize: '0.875rem',
    lineHeight: 1.4,
    fontWeight: 500,
  },
  h6: {
    fontSize: '0.8125rem',
    lineHeight: 1.4,
    fontWeight: 500,
  },
  subtitle1: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
    fontWeight: 500,
  },
  subtitle2: {
    fontSize: '0.8125rem',
    lineHeight: 1.5,
    fontWeight: 500,
  },
  body1: typeVariants.body,
  body2: typeVariants.smallBody,
  caption: typeVariants.metadata,
  overline: {
    fontSize: '0.6875rem',
    lineHeight: 1.4,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  button: {
    fontSize: '0.8125rem',
    lineHeight: 1.2,
    fontWeight: 500,
    letterSpacing: '0.01em',
    textTransform: 'none',
  },
};
