/**
 * CricketIQ Theme — Centralized Theme Module
 * ============================================
 * Single entry point for the entire theme system.
 *
 * Architecture:
 *   index.ts        — public API
 *   palette.ts      — color palettes (light/dark)
 *   typography.ts   — typography system + cricket metrics
 *   spacing.ts      — spacing scale
 *   shadows.ts      — elevation system
 *   shape.ts        — border radius
 *   breakpoints.ts  — responsive breakpoints
 *   components.ts   — shared MUI component overrides
 *   light.ts        — light theme
 *   dark.ts         — dark theme
 */
export { lightTheme } from './light';
export { darkTheme } from './dark';

export {
  brand,
  accent,
  success,
  warning,
  error,
  info,
  neutral,
  pitch,
  turf,
  lightPalette,
  darkPalette,
} from './palette';
export type { PaletteModeColors } from './palette';

export {
  fontFamily,
  baseFontSize,
  metrics,
  typography,
} from './typography';

export { baseSpacing, spacing, space, spacingTokens } from './spacing';

export { shadows, muiShadows } from './shadows';

export { shape, defaultRadius, muiShape } from './shape';

export { breakpoints, muiBreakpoints, breakpointTokens } from './breakpoints';

export { sharedComponents } from './components';
