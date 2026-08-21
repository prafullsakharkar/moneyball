/**
 * CricketIQ Theme — Dark
 * ============================================
 * Dark mode MUI theme built from centralized theme modules.
 * Dark is the default and primary experience (StudioHub reference).
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
      disabled: darkPalette.text.disabled,
    },
    divider: darkPalette.divider,
  },
  typography,
  shape: muiShape,
  shadows: muiShadows('dark'),
  breakpoints: muiBreakpoints,
  components: sharedComponents('dark'),
});
