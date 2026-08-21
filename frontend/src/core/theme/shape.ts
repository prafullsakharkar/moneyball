/**
 * CricketIQ Theme — Shape
 * ============================================
 * Centralized border radius system.
 */
/** Named radius tokens */
export const shape = {
  none: 0,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
} as const;

/** Default component border radius (px) */
export const defaultRadius = shape.md;

/** MUI shape object */
export const muiShape = {
  borderRadius: defaultRadius,
};
