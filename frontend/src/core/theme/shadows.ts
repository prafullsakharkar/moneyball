/**
 * CricketIQ Theme — Shadows
 * ============================================
 * Centralized elevation system.
 * StudioHub favors borders over heavy shadows; shadows are subtle.
 */
import { elevation } from '@design/tokens';

/** Named elevation tokens */
export const shadows = {
  none: elevation.none,
  xs: elevation.xs,
  sm: elevation.sm,
  md: elevation.md,
  lg: elevation.lg,
  xl: elevation.xl,
  '2xl': elevation['2xl'],
  inner: elevation.inner,
} as const;

/** MUI-compatible shadow array (25 entries, index 0 = none) */
export const muiShadows = (
  mode: 'light' | 'dark',
): [
  'none',
  string, string, string, string, string, string, string, string,
  string, string, string, string, string, string, string, string,
  string, string, string, string, string, string, string, string,
] => {
  const isDark = mode === 'dark';
  const base = isDark
    ? {
        xs: '0 1px 2px rgba(0, 0, 0, 0.2)',
        sm: '0 1px 3px rgba(0, 0, 0, 0.24), 0 1px 2px rgba(0, 0, 0, 0.2)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }
    : {
        xs: elevation.xs,
        sm: elevation.sm,
        md: elevation.md,
        lg: elevation.lg,
        xl: elevation.xl,
        '2xl': elevation['2xl'],
      };

  const arr = new Array<string>(25).fill(base.sm);
  arr[0] = 'none';
  arr[1] = base.xs;
  arr[2] = base.sm;
  arr[3] = base.sm;
  arr[4] = base.md;
  arr[5] = base.md;
  arr[6] = base.md;
  arr[7] = base.lg;
  arr[8] = base.lg;
  arr[9] = base.lg;
  arr[10] = base.xl;
  arr[11] = base.xl;
  arr[12] = base.xl;
  arr[13] = base['2xl'];
  arr[14] = base['2xl'];
  arr[15] = base['2xl'];
  arr[16] = base['2xl'];
  arr[17] = base['2xl'];
  arr[18] = base['2xl'];
  arr[19] = base['2xl'];
  arr[20] = base['2xl'];
  arr[21] = base['2xl'];
  arr[22] = base['2xl'];
  arr[23] = base['2xl'];
  arr[24] = base['2xl'];
  return arr as [
    'none',
    string, string, string, string, string, string, string, string,
    string, string, string, string, string, string, string, string,
    string, string, string, string, string, string, string, string,
  ];
};
