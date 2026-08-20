/**
 * CricketIQ Design Tokens
 * ============================================
 * Foundation for the entire design system.
 * Inspired by Linear-level polish + enterprise density + sports technology.
 *
 * All components reference these tokens — never hardcode values.
 */

/* ── Colors ──────────────────────────────────────────────── */

export const colors = {
  /* Brand — Deep cricket blue (pitch, tradition, trust) */
  brand: {
    50: '#e8f0fe',
    100: '#c5d9fc',
    200: '#9ebef9',
    300: '#6fa0f5',
    400: '#4a88f0',
    500: '#1565c0',    // Primary
    600: '#1258a8',
    700: '#0d47a1',    // Dark
    800: '#0a3680',
    900: '#072660',
    950: '#041a42',
  },

  /* Teal — Accent (score highlights, success states) */
  accent: {
    50: '#e0f2f1',
    100: '#b2dfdb',
    200: '#80cbc4',
    300: '#4db6ac',
    400: '#26a69a',
    500: '#00897b',
    600: '#00796b',
    700: '#00695c',
    800: '#004d40',
    900: '#003330',
  },

  /* Neutrals — Sophisticated greys */
  neutral: {
    0: '#ffffff',
    25: '#fcfcfd',
    50: '#f8f9fb',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#868e96',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
    950: '#111318',
  },

  /* Semantic — Status colors */
  success: {
    50: '#e8f5e9',
    100: '#c8e6c9',
    500: '#2e7d32',
    600: '#1b5e20',
    700: '#1a4721',
  },
  warning: {
    50: '#fff3e0',
    100: '#ffe0b2',
    500: '#ed6c02',
    600: '#e65100',
    700: '#bf360c',
  },
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    500: '#d32f2f',
    600: '#c62828',
    700: '#b71c1c',
  },
  info: {
    50: '#e1f5fe',
    100: '#b3e5fc',
    500: '#0288d1',
    600: '#0277bd',
    700: '#01579b',
  },

  /* Cricket-specific */
  pitch: {
    green: '#2d5016',
    light: '#4a7c2e',
    worn: '#8b7d3c',
    dust: '#c4a94d',
  },
  turf: {
    fresh: '#3a6b24',
    used: '#6b8a3f',
    dry: '#9e8c4a',
    brown: '#a08050',
  },
} as const;

/* ── Typography ──────────────────────────────────────────── */

export const typography = {
  fontFamily: {
    sans: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    mono: '"JetBrains Mono", "Roboto Mono", "Consolas", monospace',
    display: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },

  /* Font sizes — Tight, enterprise-dense */
  fontSize: {
    '2xs': '0.625rem',    // 10px — micro labels
    xs: '0.75rem',        // 12px — captions
    sm: '0.8125rem',      // 13px — secondary text (denser than default)
    base: '0.875rem',     // 14px — body (denser than 16px default)
    md: '1rem',           // 16px — emphasized body
    lg: '1.125rem',       // 18px — subheadings
    xl: '1.25rem',        // 20px — section titles
    '2xl': '1.5rem',      // 24px — page titles
    '3xl': '1.875rem',    // 30px — hero
    '4xl': '2.25rem',     // 36px — display
  },

  /* Line heights */
  lineHeight: {
    none: 1,
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
  },

  /* Font weights */
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  /* Letter spacing */
  letterSpacing: {
    tighter: '-0.03em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },

  /* Preset text styles */
  presets: {
    display: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: '-0.03em',
    },
    h1: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.015em',
    },
    h3: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    'body-sm': {
      fontSize: '0.8125rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    label: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.06em',
      textTransform: 'uppercase' as const,
    },
    code: {
      fontSize: '0.8125rem',
      fontFamily: '"JetBrains Mono", "Roboto Mono", monospace',
      fontWeight: 400,
    },
  },
} as const;

/* ── Spacing ─────────────────────────────────────────────── */

export const spacing = {
  /** 0px */
  0: '0px',
  /** 1px */
  px: '1px',
  /** 2px */
  0.5: '2px',
  /** 4px */
  1: '4px',
  /** 6px */
  1.5: '6px',
  /** 8px */
  2: '8px',
  /** 10px */
  2.5: '10px',
  /** 12px */
  3: '12px',
  /** 16px */
  4: '16px',
  /** 20px */
  5: '20px',
  /** 24px */
  6: '24px',
  /** 32px */
  8: '32px',
  /** 40px */
  10: '40px',
  /** 48px */
  12: '48px',
  /** 64px */
  16: '64px',
  /** 80px */
  20: '80px',
  /** 96px */
  24: '96px',
  /** 128px */
  32: '128px',
} as const;

/* ── Elevation (Box Shadows) ─────────────────────────────── */

export const elevation = {
  none: 'none',
  /** Subtle lift for cards */
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  /** Default card elevation */
  sm: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
  /** Dropdown, popover */
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
  /** Dialogs, modals */
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
  /** Elevated panels */
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
  /** Toast, command palette */
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.16)',
  /** Inner shadow for pressed states */
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
} as const;

/* ── Borders ─────────────────────────────────────────────── */

export const borders = {
  width: {
    thin: '1px',
    DEFAULT: '1px',
    medium: '1.5px',
    thick: '2px',
    heavy: '3px',
  },
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
  },
  color: {
    light: 'rgba(0, 0, 0, 0.06)',
    DEFAULT: 'rgba(0, 0, 0, 0.08)',
    medium: 'rgba(0, 0, 0, 0.12)',
    strong: 'rgba(0, 0, 0, 0.20)',
    focus: colors.brand[500],
    error: colors.error[500],
    success: colors.success[500],
    warning: colors.warning[500],
  },
} as const;

/* ── Border Radius ───────────────────────────────────────── */

export const radius = {
  none: '0px',
  sm: '4px',
  DEFAULT: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
} as const;

/* ── Density ─────────────────────────────────────────────── */

export const density = {
  /** Tight — data tables, lists, dense UI */
  compact: {
    paddingY: spacing[1],
    paddingX: spacing[2],
    gap: spacing[1],
    rowHeight: 32,
    itemHeight: 28,
  },
  /** Default — most content */
  default: {
    paddingY: spacing[1.5],
    paddingX: spacing[3],
    gap: spacing[2],
    rowHeight: 40,
    itemHeight: 36,
  },
  /** Relaxed — hero sections, large cards */
  comfortable: {
    paddingY: spacing[3],
    paddingX: spacing[4],
    gap: spacing[3],
    rowHeight: 48,
    itemHeight: 44,
  },
} as const;

/* ── Motion ──────────────────────────────────────────────── */

export const motion = {
  /** Fast micro-interactions (hover, focus) */
  fast: {
    duration: '100ms',
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
  /** Normal transitions (open, close, expand) */
  normal: {
    duration: '200ms',
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
  /** Smooth transitions (page changes, modals) */
  smooth: {
    duration: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  /** Emphasized entrance (modals, sheets) */
  emphasis: {
    duration: '400ms',
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  /** Spring for playful interactions */
  spring: {
    duration: '500ms',
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

/* ── Z-Index Layers ──────────────────────────────────────── */

export const layers = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  header: 1200,
  drawer: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
  commandPalette: 1800,
} as const;

/* ── Breakpoints ─────────────────────────────────────────── */

export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/* ── Layout Constants ────────────────────────────────────── */

export const layout = {
  sidebarWidth: 260,
  sidebarCollapsedWidth: 64,
  headerHeight: 56,
  /** Dense header for data-heavy views */
  headerHeightCompact: 48,
  /** Taller header for dashboard/home */
  headerHeightTall: 64,
  contentMaxWidth: 1200,
  formMaxWidth: 480,
  dialogMaxWidth: 560,
  drawerWidth: 400,
} as const;

/* ── Composite Token Export ──────────────────────────────── */

export const tokens = {
  colors,
  typography,
  spacing,
  elevation,
  borders,
  radius,
  density,
  motion,
  layers,
  breakpoints,
  layout,
} as const;

export type Tokens = typeof tokens;
