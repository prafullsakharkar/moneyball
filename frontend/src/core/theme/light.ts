/**
 * CricketIQ Theme — Light
 * ============================================
 * Light mode MUI theme built from centralized theme modules.
 */
import { createTheme } from '@mui/material/styles';
import { lightPalette } from './palette';
import { typography } from './typography';
import { muiShadows } from './shadows';
import { muiShape } from './shape';
import { muiBreakpoints } from './breakpoints';
import { sharedComponents } from './components';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: lightPalette.primary,
    secondary: lightPalette.secondary,
    success: lightPalette.success,
    warning: lightPalette.warning,
    error: lightPalette.error,
    info: lightPalette.info,
    background: {
      default: lightPalette.background.default,
      paper: lightPalette.background.paper,
    },
    text: {
      primary: lightPalette.text.primary,
      secondary: lightPalette.text.secondary,
      disabled: lightPalette.text.disabled,
    },
    divider: lightPalette.divider,
  },
  typography,
  shape: muiShape,
  shadows: muiShadows('light'),
  breakpoints: muiBreakpoints,
  components: sharedComponents('light'),
});
