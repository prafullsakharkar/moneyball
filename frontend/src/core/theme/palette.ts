/**
 * CricketOS Theme — Palette
 * ============================================
 * Centralized MUI color palette built on the CricketOS semantic tokens.
 * Dark-first lime accent, enterprise neutral surfaces.
 */
import { colors } from '@design/tokens';
import { darkTokens, lightTokens, type CricketColorTokens } from './tokens';

/** Brand — CricketOS lime accent ramp */
export const brand = colors.brand;

/** Accent — Lime-green ramp */
export const accent = colors.accent;

/** Semantic status color ramps */
export const success = colors.success;
export const warning = colors.warning;
export const error = colors.error;
export const info = colors.info;

/** Neutral grey / surface ramp */
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

function buildPalette(
  tokens: CricketColorTokens,
  mode: 'light' | 'dark',
): PaletteModeColors {
  const dark = mode === 'dark';
  const surface = tokens.surface;

  return {
    primary: {
      main: tokens.accent,
      light: brand[300],
      dark: brand[700],
      contrastText: dark ? '#090A0B' : '#FFFFFF',
    },
    secondary: {
      main: dark ? brand[400] : brand[600],
      light: brand[300],
      dark: brand[700],
      contrastText: dark ? '#090A0B' : '#FFFFFF',
    },
    success: { main: tokens.success, light: success[100], dark: success[700] },
    warning: { main: tokens.warning, light: warning[100], dark: warning[700] },
    error: { main: tokens.danger, light: error[100], dark: error[700] },
    info: { main: tokens.info, light: info[100], dark: info[700] },
    background: {
      default: tokens.background,
      paper: surface[100],
      elevated: dark ? surface[200] : surface[100],
    },
    text: {
      primary: tokens.foreground,
      secondary: tokens.muted,
      tertiary: tokens.subtle,
      disabled: tokens.disabled,
    },
    divider: tokens.border,
    border: tokens.border,
    borderStrong: tokens.borderStrong,
    hover: dark ? surface[200] : surface[200],
    active: dark ? surface[300] : surface[300],
  };
}

/** Light mode palette */
export const lightPalette: PaletteModeColors = buildPalette(lightTokens, 'light');

/** Dark mode palette */
export const darkPalette: PaletteModeColors = buildPalette(darkTokens, 'dark');
