/**
 * CricketOS Theme — Dark
 * ============================================
 * Dark mode MUI theme built from centralized theme modules.
 * Dark is the default and primary CricketOS experience.
 */
import { createTheme } from '@mui/material/styles';
import { darkPalette } from './palette';
import { typography } from './typography';
import { muiShadows } from './shadows';
import { muiShape } from './shape';
import { muiBreakpoints } from './breakpoints';
import { sharedComponents } from './components';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: darkPalette.primary,
    secondary: darkPalette.secondary,
    success: darkPalette.success,
    warning: darkPalette.warning,
    error: darkPalette.error,
    info: darkPalette.info,
    background: {
      default: darkPalette.background.default,
      paper: darkPalette.background.paper,
    },
    text: {
      primary: darkPalette.text.primary,
      secondary: darkPalette.text.secondary,
      tertiary: darkPalette.text.tertiary,
      disabled: darkPalette.text.disabled,
    },
    divider: darkPalette.divider,
    border: darkPalette.border,
    borderStrong: darkPalette.borderStrong,
    hover: darkPalette.hover,
    active: darkPalette.active,
  },
  typography,
  shape: muiShape,
  shadows: muiShadows('dark'),
  breakpoints: muiBreakpoints,
  components: sharedComponents('dark'),
});
