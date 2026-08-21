/**
 * CricketIQ Theme — Component Overrides
 * ============================================
 * Shared MUI component overrides for both light and dark modes.
 * Adopts StudioHub's compact density: small buttons, dense tables,
 * bordered cards, compact chips.
 */
import type { ThemeOptions } from '@mui/material/styles';
import { colors, radius, elevation, motion, typography as tokens, spacing } from '@design/tokens';
import { brand } from './palette';

/**
 * Build shared component overrides for a given mode.
 * @param mode 'light' | 'dark'
 */
export const sharedComponents = (mode: 'light' | 'dark'): ThemeOptions['components'] => {
  const isDark = mode === 'dark';

  const border = isDark ? colors.neutral[800] : colors.neutral[200];
  const borderStrong = isDark ? colors.neutral[700] : colors.neutral[300];
  const hoverBg = isDark ? 'rgba(255, 255, 255, 0.04)' : colors.neutral[50];
  const textSecondary = isDark ? colors.neutral[400] : colors.neutral[600];

  return {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--cq-text-primary': isDark ? colors.neutral[50] : colors.neutral[900],
          '--cq-text-secondary': textSecondary,
          '--cq-text-tertiary': isDark ? colors.neutral[500] : colors.neutral[500],
          '--cq-bg-primary': isDark ? colors.neutral[950] : colors.neutral[0],
          '--cq-bg-secondary': isDark ? colors.neutral[900] : colors.neutral[50],
          '--cq-bg-tertiary': isDark ? colors.neutral[800] : colors.neutral[100],
          '--cq-border': border,
          '--cq-border-strong': borderStrong,
          '--cq-accent': brand[500],
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: isDark
            ? `${colors.neutral[700]} transparent`
            : `${colors.neutral[300]} transparent`,
        },
        '::-webkit-scrollbar': {
          width: 8,
          height: 8,
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: isDark ? colors.neutral[700] : colors.neutral[300],
          borderRadius: 4,
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
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
          fontSize: tokens.fontSize.sm,
          padding: `${spacing[1.5]} ${spacing[3]}`,
          letterSpacing: '0.01em',
          transition: `all ${motion.normal.duration} ${motion.normal.easing}`,
        },
        sizeSmall: {
          fontSize: tokens.fontSize.xs,
          padding: `${spacing[1]} ${spacing[2]}`,
          borderRadius: radius.sm,
        },
        sizeLarge: {
          fontSize: tokens.fontSize.base,
          padding: `${spacing[2.5]} ${spacing[5]}`,
          borderRadius: radius.md,
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': { borderWidth: 1.5 },
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

    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          transition: `background-color ${motion.fast.duration} ${motion.fast.easing}`,
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
            fontSize: tokens.fontSize.sm,
            transition: `border-color ${motion.fast.duration} ${motion.fast.easing}, box-shadow ${motion.fast.duration} ${motion.fast.easing}`,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? colors.neutral[600] : colors.neutral[400],
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: brand[500],
              borderWidth: 1.5,
              boxShadow: `0 0 0 3px ${brand[500]}20`,
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: tokens.fontSize.sm,
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
          borderColor: border,
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
          border: `1px solid ${border}`,
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
          borderBottom: `1px solid ${border}`,
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
          fontSize: tokens.fontSize.sm,
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
          fontSize: tokens.fontSize.xs,
          fontWeight: 500,
          borderRadius: radius.sm,
          height: 24,
        },
        sizeSmall: {
          fontSize: tokens.fontSize['2xs'],
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
          fontSize: tokens.fontSize.xs,
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
          fontSize: tokens.fontSize.sm,
          fontWeight: 600,
          fontFamily: tokens.fontFamily.sans,
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
            fontSize: tokens.fontSize.xs,
            fontWeight: 600,
            color: textSecondary,
            letterSpacing: '0.03em',
            textTransform: 'uppercase' as const,
            borderBottom: `1px solid ${border}`,
            padding: `${spacing[2]} ${spacing[3]}`,
          },
        },
      },
    },

    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontSize: tokens.fontSize.sm,
            padding: `${spacing[1.5]} ${spacing[3]}`,
            borderColor: isDark ? colors.neutral[800] : colors.neutral[100],
          },
          '& .MuiTableRow-root': {
            transition: `background-color ${motion.fast.duration} ${motion.fast.easing}`,
            '&:hover': {
              backgroundColor: hoverBg,
            },
          },
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: tokens.fontSize.sm,
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
          borderColor: border,
        },
      },
    },

    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: brand[500],
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
          backgroundColor: brand[500],
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          transition: `background-color ${motion.fast.duration} ${motion.fast.easing}`,
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 32,
        },
      },
    },

    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontSize: tokens.fontSize['2xs'],
          fontWeight: 700,
          fontFamily: tokens.fontFamily.mono,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.08em',
          color: textSecondary,
          lineHeight: 1.4,
          backgroundColor: 'transparent',
        },
      },
    },

    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          fontSize: tokens.fontSize.sm,
        },
        separator: {
          color: textSecondary,
        },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: isDark ? colors.neutral[800] : colors.neutral[200],
        },
      },
    },
  };
};
