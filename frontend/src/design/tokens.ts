/**
 * CricketOS Design Tokens
 * ============================================
 * Foundation for the entire design system.
 * Dark-first, cricket-inspired lime accent, enterprise density,
 * Linear-level polish. All components reference these tokens —
 * never hardcode values.
 */

/* ── Colors ──────────────────────────────────────────────── */

export const colors = {
  /* Brand — CricketOS lime accent (active / live / primary action) */
  brand: {
    50: '#F7FEE7',
    100: '#ECFCCB',
    200: '#D9F99D',
    300: '#BEF264',
    400: '#A3E635',    // Dark-mode primary
    500: '#84CC16',
    600: '#65A30D',    // Light-mode primary
    700: '#4D7C0F',
    800: '#3F6212',
    900: '#365314',
    950: '#1A2E05',
  },

  /* Accent — Lime-green ramp for active/success highlights */
  accent: {
    50: '#F7FEE7',
    100: '#ECFCCB',
    200: '#D9F99D',
    300: '#BEF264',
    400: '#A3E635',
    500: '#84CC16',
    600: '#65A30D',
    700: '#4D7C0F',
    800: '#3F6212',
    900: '#365314',
  },

  /* Neutrals — CricketOS surfaces + text ramp */
  neutral: {
    0: '#FFFFFF',
    25: '#F7F7F5',
    50: '#F1F3F4',
    100: '#E9EBED',
    200: '#DBDEE2',
    300: '#B8BDC3',
    400: '#94999F',
    500: '#70757D',
    600: '#50545B',
    700: '#191C20',
    800: '#141619',
    900: '#101113',
    950: '#090A0B',
  },

  /* Semantic — Status colors */
  success: {
    50: '#F7FEE7',
    100: '#ECFCCB',
    500: '#84CC16',
    600: '#65A30D',
    700: '#4D7C0F',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#F87171',
    600: '#EF4444',
    700: '#DC2626',
  },
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#60A5FA',
    600: '#3B82F6',
    700: '#2563EB',
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
    sans: '"Inter", "SF Pro Display", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "SFMono-Regular", ui-monospace, Consolas, "Liberation Mono", monospace',
    display: '"Inter", "SF Pro Display", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
      fontSize: 'clamp(2.25rem, 5vw, 4rem)',
      fontWeight: 500,
      lineHeight: 1.04,
      letterSpacing: '-0.035em',
    },
    h1: {
      fontSize: '1.5rem',   // 24px page heading
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '1rem',     // 16px section heading
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '0.9375rem',
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h4: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body: {
      fontSize: '0.875rem', // 14px body
      fontWeight: 400,
      lineHeight: 1.55,
      letterSpacing: '-0.005em',
    },
    'body-sm': {
      fontSize: '0.8125rem', // 13px small body
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',  // 12px metadata
      fontWeight: 400,
      lineHeight: 1.4,
    },
    label: {
      fontSize: '0.75rem',  // 12px label
      fontWeight: 500,
      lineHeight: 1.4,
    },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.06em',
      textTransform: 'uppercase' as const,
    },
    score: {
      fontSize: '1.75rem',  // 28px score
      fontWeight: 600,
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
      fontVariantNumeric: 'tabular-nums' as const,
    },
    numeric: {
      fontVariantNumeric: 'tabular-nums' as const,
    },
    code: {
      fontSize: '0.8125rem',
      fontFamily: '"JetBrains Mono", "SFMono-Regular", ui-monospace, Consolas, monospace',
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
    light: 'rgba(21, 21, 21, 0.09)',
    DEFAULT: 'rgba(21, 21, 21, 0.12)',
    medium: 'rgba(21, 21, 21, 0.16)',
    strong: 'rgba(21, 21, 21, 0.20)',
    focus: colors.brand[400],
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
  sidebarWidth: 240,
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
