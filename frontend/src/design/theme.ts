/**
 * CricketIQ MUI Themes — Light & Dark
 * ============================================
 * Built on design tokens for consistency.
 * Enterprise density, Linear-level polish.
 */
import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { colors, typography, spacing, radius, elevation, motion } from './tokens';

/* ── Shared Component Overrides ─────────────────────────── */

const sharedComponents = (mode: 'light' | 'dark'): ThemeOptions['components'] => {
  const isDark = mode === 'dark';

  return {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--cq-text-primary': isDark ? colors.neutral[50] : colors.neutral[900],
          '--cq-text-secondary': isDark ? colors.neutral[400] : colors.neutral[600],
          '--cq-text-tertiary': isDark ? colors.neutral[500] : colors.neutral[500],
          '--cq-bg-primary': isDark ? colors.neutral[950] : colors.neutral[0],
          '--cq-bg-secondary': isDark ? colors.neutral[900] : colors.neutral[50],
          '--cq-bg-tertiary': isDark ? colors.neutral[800] : colors.neutral[100],
          '--cq-border': isDark ? colors.neutral[800] : colors.neutral[200],
          '--cq-border-strong': isDark ? colors.neutral[700] : colors.neutral[300],
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 500,
          borderRadius: radius.md,
          fontSize: typography.fontSize.sm,
          padding: `${spacing[1.5]} ${spacing[3]}`,
          letterSpacing: '0.01em',
          transition: `all ${motion.normal.duration} ${motion.normal.easing}`,
        },
        sizeSmall: {
          fontSize: typography.fontSize.xs,
          padding: `${spacing[1]} ${spacing[2]}`,
          borderRadius: radius.sm,
        },
        sizeLarge: {
          fontSize: typography.fontSize.base,
          padding: `${spacing[2.5]} ${spacing[5]}`,
          borderRadius: radius.md,
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: radius.md,
            fontSize: typography.fontSize.sm,
            transition: `border-color ${motion.fast.duration} ${motion.fast.easing}, box-shadow ${motion.fast.duration} ${motion.fast.easing}`,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? colors.neutral[600] : colors.neutral[400],
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.brand[500],
              borderWidth: 1.5,
              boxShadow: `0 0 0 3px ${colors.brand[50]}20`,
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: typography.fontSize.sm,
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
          borderColor: isDark ? colors.neutral[800] : colors.neutral[200],
          boxShadow: elevation.xs,
          transition: `box-shadow ${motion.normal.duration} ${motion.normal.easing}, border-color ${motion.normal.duration} ${motion.normal.easing}`,
          '&:hover': {
            boxShadow: elevation.sm,
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: radius.lg,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: radius.xl,
          border: `1px solid ${isDark ? colors.neutral[800] : colors.neutral[200]}`,
          boxShadow: elevation.xl,
        },
        paperFullScreen: {
          borderRadius: 0,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          borderRadius: 0,
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${isDark ? colors.neutral[800] : 'rgba(0,0,0,0.06)'}`,
          backdropFilter: 'blur(12px)',
          backgroundColor: isDark
            ? `${colors.neutral[950]}ee`
            : `${colors.neutral[0]}ee`,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2,
          borderRadius: '2px 2px 0 0',
        },
        root: {
          minHeight: 40,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 500,
          fontSize: typography.fontSize.sm,
          minHeight: 40,
          padding: `${spacing[1.5]} ${spacing[3]}`,
          transition: `color ${motion.fast.duration} ${motion.fast.easing}`,
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: typography.fontSize.xs,
          fontWeight: 500,
          borderRadius: radius.sm,
          height: 24,
        },
        sizeSmall: {
          fontSize: typography.fontSize['2xs'],
          height: 20,
          borderRadius: radius.sm,
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          fontSize: typography.fontSize.xs,
          fontWeight: 400,
          backgroundColor: isDark ? colors.neutral[800] : colors.neutral[900],
          borderRadius: radius.sm,
          padding: `${spacing[1]} ${spacing[2]}`,
          boxShadow: elevation.md,
          lineHeight: 1.4,
        },
        arrow: {
          color: isDark ? colors.neutral[800] : colors.neutral[900],
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: typography.fontSize.sm,
          fontWeight: 600,
          fontFamily: typography.fontFamily.sans,
        },
        colorDefault: {
          backgroundColor: isDark ? colors.neutral[700] : colors.neutral[200],
          color: isDark ? colors.neutral[300] : colors.neutral[600],
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontSize: typography.fontSize.xs,
            fontWeight: 600,
            color: isDark ? colors.neutral[400] : colors.neutral[600],
            letterSpacing: '0.03em',
            textTransform: 'uppercase' as const,
            borderBottom: `1px solid ${isDark ? colors.neutral[800] : colors.neutral[200]}`,
            padding: `${spacing[2]} ${spacing[3]}`,
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontSize: typography.fontSize.sm,
            padding: `${spacing[1.5]} ${spacing[3]}`,
            borderColor: isDark ? colors.neutral[800] : colors.neutral[100],
          },
          '& .MuiTableRow-root': {
            transition: `background-color ${motion.fast.duration} ${motion.fast.easing}`,
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : colors.neutral[50],
            },
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: typography.fontSize.sm,
          borderRadius: radius.sm,
          margin: `${spacing[0.5]} ${spacing[1]}`,
          padding: `${spacing[1.5]} ${spacing[2]}`,
          transition: `background-color ${motion.fast.duration} ${motion.fast.easing}`,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: isDark ? colors.neutral[800] : colors.neutral[200],
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: colors.brand[500],
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: radius.full,
          height: 4,
          backgroundColor: isDark ? colors.neutral[800] : colors.neutral[100],
        },
        bar: {
          borderRadius: radius.full,
          backgroundColor: colors.brand[500],
        },
      },
    },
  };
};

/* ── Light Theme ────────────────────────────────────────── */

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.brand[500],
      light: colors.brand[100],
      dark: colors.brand[700],
      contrastText: colors.neutral[0],
    },
    secondary: {
      main: colors.accent[500],
      light: colors.accent[100],
      dark: colors.accent[700],
      contrastText: colors.neutral[0],
    },
    success: { main: colors.success[500], light: colors.success[50], dark: colors.success[700] },
    warning: { main: colors.warning[500], light: colors.warning[50], dark: colors.warning[700] },
    error: { main: colors.error[500], light: colors.error[50], dark: colors.error[700] },
    info: { main: colors.info[500], light: colors.info[50], dark: colors.info[700] },
    background: {
      default: colors.neutral[50],
      paper: colors.neutral[0],
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
    },
    divider: colors.neutral[200],
  },
  typography: {
    fontFamily: typography.fontFamily.sans,
    fontSize: 14,
    h1: typography.presets.h1,
    h2: typography.presets.h2,
    h3: typography.presets.h3,
    h4: typography.presets.h4,
    body1: typography.presets.body,
    body2: typography.presets['body-sm'],
    caption: typography.presets.caption,
    button: {
      fontSize: typography.fontSize.sm,
      fontWeight: 500,
      textTransform: 'none' as const,
    },
    overline: typography.presets.overline,
  },
  shape: {
    borderRadius: parseInt(radius.md, 10),
  },
  shadows: [
    'none',
    elevation.xs,
    elevation.sm,
    elevation.sm,
    elevation.md,
    elevation.md,
    elevation.md,
    elevation.lg,
    elevation.lg,
    elevation.lg,
    elevation.xl,
    elevation.xl,
    elevation.xl,
    elevation['2xl'],
    elevation['2xl'],
    elevation['2xl'],
    elevation['2xl'],
    elevation['2xl'],
    elevation['2xl'],
    elevation['2xl'],
    elevation['2xl'],
    elevation['2xl'],
    elevation['2xl'],
    elevation['2xl'],
    elevation['2xl'],
  ] as any,
  components: sharedComponents('light'),
});

/* ── Dark Theme ─────────────────────────────────────────── */

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.brand[400],
      light: colors.brand[300],
      dark: colors.brand[600],
      contrastText: colors.neutral[950],
    },
    secondary: {
      main: colors.accent[400],
      light: colors.accent[300],
      dark: colors.accent[600],
      contrastText: colors.neutral[950],
    },
    success: { main: colors.success[500], light: colors.success[50], dark: colors.success[700] },
    warning: { main: colors.warning[500], light: colors.warning[50], dark: colors.warning[700] },
    error: { main: colors.error[500], light: colors.error[50], dark: colors.error[700] },
    info: { main: colors.info[500], light: colors.info[50], dark: colors.info[700] },
    background: {
      default: colors.neutral[950],
      paper: colors.neutral[900],
    },
    text: {
      primary: colors.neutral[50],
      secondary: colors.neutral[400],
    },
    divider: colors.neutral[800],
  },
  typography: {
    fontFamily: typography.fontFamily.sans,
    fontSize: 14,
    h1: typography.presets.h1,
    h2: typography.presets.h2,
    h3: typography.presets.h3,
    h4: typography.presets.h4,
    body1: typography.presets.body,
    body2: typography.presets['body-sm'],
    caption: typography.presets.caption,
    button: {
      fontSize: typography.fontSize.sm,
      fontWeight: 500,
      textTransform: 'none' as const,
    },
    overline: typography.presets.overline,
  },
  shape: {
    borderRadius: parseInt(radius.md, 10),
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.2)',
    '0 1px 3px rgba(0, 0, 0, 0.24), 0 1px 2px rgba(0, 0, 0, 0.2)',
    '0 1px 3px rgba(0, 0, 0, 0.24), 0 1px 2px rgba(0, 0, 0, 0.2)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  ] as any,
  components: sharedComponents('dark'),
});
