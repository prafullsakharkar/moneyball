/**
 * CricketIQ Theme — Palette
 * ============================================
 * Centralized color palette for the MUI theme.
 * Built on design tokens, adopting StudioHub's indigo accent (#6366f1)
 * and dark-first neutral scale.
 */
import { colors } from '@design/tokens';

/**
 * Brand accent — Indigo (StudioHub reference).
 * Replaces the previous deep-blue brand for a more modern, pro feel.
 */
export const brand = {
  50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1', // Primary
  600: '#4f46e5',
  700: '#4338ca',
  800: '#3730a3',
  900: '#312e81',
  950: '#1e1b4b',
} as const;

/** Accent — Teal (score highlights, success highlights) */
export const accent = colors.accent;

/** Semantic status colors */
export const success = colors.success;
export const warning = colors.warning;
export const error = colors.error;
export const info = colors.info;

/** Neutral scale (shared across modes) */
export const neutral = colors.neutral;

/** Cricket-specific pitch/turf colors */
export const pitch = colors.pitch;
export const turf = colors.turf;

export interface PaletteModeColors {
  primary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  success: { main: string; light: string; dark: string };
  warning: { main: string; light: string; dark: string };
  error: { main: string; light: string; dark: string };
  info: { main: string; light: string; dark: string };
  background: { default: string; paper: string; elevated: string };
  text: { primary: string; secondary: string; tertiary: string; disabled: string };
  divider: string;
  border: string;
  borderStrong: string;
  hover: string;
  active: string;
}

/** Light mode palette */
export const lightPalette: PaletteModeColors = {
  primary: {
    main: brand[500],
    light: brand[100],
    dark: brand[700],
    contrastText: '#ffffff',
  },
  secondary: {
    main: accent[500],
    light: accent[100],
    dark: accent[700],
    contrastText: '#ffffff',
  },
  success: { main: success[500], light: success[50], dark: success[700] },
  warning: { main: warning[500], light: warning[50], dark: warning[700] },
  error: { main: error[500], light: error[50], dark: error[700] },
  info: { main: info[500], light: info[50], dark: info[700] },
  background: {
    default: neutral[50],
    paper: neutral[0],
    elevated: neutral[0],
  },
  text: {
    primary: neutral[900],
    secondary: neutral[600],
    tertiary: neutral[500],
    disabled: neutral[400],
  },
  divider: neutral[200],
  border: neutral[200],
  borderStrong: neutral[300],
  hover: 'rgba(0, 0, 0, 0.04)',
  active: 'rgba(0, 0, 0, 0.08)',
};

/** Dark mode palette */
export const darkPalette: PaletteModeColors = {
  primary: {
    main: brand[400],
    light: brand[300],
    dark: brand[600],
    contrastText: '#0f172a',
  },
  secondary: {
    main: accent[400],
    light: accent[300],
    dark: accent[600],
    contrastText: '#0f172a',
  },
  success: { main: success[500], light: success[50], dark: success[700] },
  warning: { main: warning[500], light: warning[50], dark: warning[700] },
  error: { main: error[500], light: error[50], dark: error[700] },
  info: { main: info[500], light: info[50], dark: info[700] },
  background: {
    default: neutral[950],
    paper: neutral[900],
    elevated: neutral[800],
  },
  text: {
    primary: neutral[50],
    secondary: neutral[400],
    tertiary: neutral[500],
    disabled: neutral[600],
  },
  divider: neutral[800],
  border: neutral[800],
  borderStrong: neutral[700],
  hover: 'rgba(255, 255, 255, 0.06)',
  active: 'rgba(255, 255, 255, 0.1)',
};
