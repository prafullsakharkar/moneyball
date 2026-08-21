/**
 * CricketOS Theme — Centralized Theme Module
 * ============================================
 * Single entry point for the entire theme system.
 *
 * Architecture:
 *   index.ts        — public API
 *   tokens.ts       — CricketOS semantic design tokens (colors, type, layout)
 *   palette.ts      — color palettes (light/dark)
 *   typography.ts   — typography system + cricket metrics
 *   spacing.ts      — spacing scale
 *   shadows.ts      — elevation system
 *   shape.ts        — border radius
 *   breakpoints.ts  — responsive breakpoints
 *   components.ts   — shared MUI component overrides
 *   lightTheme.ts   — light theme
 *   darkTheme.ts    — dark theme
 */
export { lightTheme } from './lightTheme';
export { darkTheme } from './darkTheme';

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

export {
  darkTokens,
  lightTokens,
  colorTokens,
  typeVariants,
  layoutTokens,
  controlTokens,
  densityTokens,
  motionTokens,
  muiTypography,
} from './tokens';
export type { CricketColorTokens, CricketSurface, ThemeMode } from './tokens';

export { baseSpacing, spacing, space, spacingTokens } from './spacing';

export { shadows, muiShadows } from './shadows';

export { shape, defaultRadius, muiShape } from './shape';

export { breakpoints, muiBreakpoints, breakpointTokens } from './breakpoints';

export { sharedComponents } from './components';
