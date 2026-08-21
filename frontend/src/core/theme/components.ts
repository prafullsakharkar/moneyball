/**
 * CricketOS Theme — Component Overrides
 * ============================================
 * Shared MUI component overrides for both light and dark modes.
 * Centralized styling through theme.components per DESIGN.md §10.
 *
 * CricketOS is compact, dense, border-driven, with restrained elevation
 * and a visible accent focus ring.
 */
import type { ThemeOptions } from '@mui/material/styles';
import { colors, radius, elevation, motion, spacing, typography as tokens } from '@design/tokens';
import { colorTokens, densityTokens, controlTokens, motionTokens } from './tokens';
import { brand } from './palette';

/**
 * Build shared component overrides for a given mode.
 * @param mode 'light' | 'dark'
 */
export const sharedComponents = (mode: 'light' | 'dark'): ThemeOptions['components'] => {
  const c = colorTokens(mode);
  const isDark = mode === 'dark';

  const border = c.border;
  const borderStrong = c.borderStrong;
  const surface200 = c.surface[200];
  const surface300 = c.surface[300];
  const hoverBg = surface200;
  const selectedBg = c.accentDim;
  const textSecondary = c.muted;
  const textTertiary = c.subtle;

  return {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--cq-background': c.background,
          '--cq-surface-100': c.surface[100],
          '--cq-surface-200': c.surface[200],
          '--cq-surface-300': c.surface[300],
          '--cq-foreground': c.foreground,
          '--cq-muted': c.muted,
          '--cq-subtle': c.subtle,
          '--cq-disabled': c.disabled,
          '--cq-border': border,
          '--cq-border-strong': borderStrong,
          '--cq-focus': c.focus,
          '--cq-accent': c.accent,
          '--cq-accent-dim': c.accentDim,
          '--cq-success': c.success,
          '--cq-warning': c.warning,
          '--cq-danger': c.danger,
          '--cq-info': c.info,
        },
        html: {
          colorScheme: isDark ? 'dark' : 'light',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        body: {
          backgroundColor: c.background,
          color: c.foreground,
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
        ':focus-visible': {
          outline: `2px solid ${c.focus}`,
          outlineOffset: 2,
        },
        ':focus:not(:focus-visible)': {
          outline: 'none',
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
          borderRadius: controlTokens.radius.md,
          fontSize: tokens.fontSize.sm,
          minHeight: controlTokens.height,
          padding: `0 ${controlTokens.paddingX}px`,
          letterSpacing: '0.01em',
          transition: `background-color ${motionTokens.standard}, border-color ${motionTokens.standard}, color ${motionTokens.standard}`,
          '&.Mui-focusVisible': {
            outline: `2px solid ${c.focus}`,
            outlineOffset: 2,
          },
          '&.MuiButton-containedPrimary': {
            backgroundColor: c.accent,
            color: '#0B0C0D',
            '&:hover': {
              backgroundColor: isDark ? brand[500] : c.accentDark,
            },
          },
        },
        sizeSmall: {
          fontSize: tokens.fontSize.xs,
          minHeight: controlTokens.heightSmall,
          padding: `0 ${spacing[2]}`,
          borderRadius: controlTokens.radius.sm,
        },
        sizeLarge: {
          fontSize: tokens.fontSize.base,
          minHeight: controlTokens.heightLarge,
          padding: `0 ${spacing[5]}`,
          borderRadius: controlTokens.radius.md,
        },
        outlined: {
          borderWidth: 1,
          borderColor: borderStrong,
          '&:hover': {
            borderWidth: 1,
            backgroundColor: surface200,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
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
          borderRadius: controlTokens.radius.md,
          transition: `background-color ${motion.fast.duration} ${motion.fast.easing}`,
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: tokens.fontSize.sm,
          color: c.foreground,
          '&.Mui-disabled': {
            color: c.disabled,
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
            borderRadius: controlTokens.radius.md,
            fontSize: tokens.fontSize.sm,
            minHeight: controlTokens.height,
            transition: `border-color ${motion.fast.duration} ${motion.fast.easing}, box-shadow ${motion.fast.duration} ${motion.fast.easing}`,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: borderStrong,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 3px ${c.accentDim}`,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: c.accent,
                borderWidth: 1.5,
              },
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: tokens.fontSize.sm,
            color: textSecondary,
            '&.Mui-focused': {
              color: c.accent,
            },
          },
          '& .MuiFormHelperText-root': {
            fontSize: tokens.fontSize.xs,
            marginLeft: 0,
          },
        },
      },
    },

    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          fontSize: tokens.fontSize.sm,
          '&.MuiOutlinedInput-root': {
            borderRadius: controlTokens.radius.md,
            minHeight: controlTokens.height,
          },
        },
        icon: {
          color: textTertiary,
        },
        select: {
          display: 'flex',
          alignItems: 'center',
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: c.surface[100],
          backgroundImage: 'none',
          border: `1px solid ${borderStrong}`,
          borderRadius: radius.lg,
          boxShadow: elevation.lg,
          padding: `${spacing[0.5]}`,
        },
        list: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: c.surface[100],
          backgroundImage: 'none',
          border: `1px solid ${borderStrong}`,
          borderRadius: radius.lg,
          boxShadow: elevation.lg,
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
          backgroundColor: c.surface[100],
          borderColor: border,
          boxShadow: elevation.none,
          transition: `box-shadow ${motion.normal.duration} ${motion.normal.easing}, border-color ${motion.normal.duration} ${motion.normal.easing}`,
          '&:hover': {
            boxShadow: elevation.none,
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
          backgroundColor: c.surface[100],
          color: c.foreground,
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: radius.lg,
        },
        outlined: {
          borderColor: border,
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: radius.xl,
          border: `1px solid ${borderStrong}`,
          boxShadow: elevation.xl,
          backgroundColor: c.surface[100],
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
          backgroundColor: c.surface[100],
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
          backdropFilter: 'blur(8px)',
          backgroundColor: isDark
            ? 'rgba(16, 17, 19, 0.9)'
            : 'rgba(255, 255, 255, 0.9)',
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2,
          borderRadius: '2px 2px 0 0',
          backgroundColor: c.accent,
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
          color: textSecondary,
          transition: `color ${motion.fast.duration} ${motion.fast.easing}`,
          '&:hover': {
            color: c.foreground,
          },
          '&.Mui-selected': {
            color: c.foreground,
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
          backgroundColor: surface200,
          color: c.foreground,
          '& .MuiChip-label': {
            paddingLeft: spacing[1.5],
            paddingRight: spacing[1.5],
          },
        },
        sizeSmall: {
          fontSize: tokens.fontSize['2xs'],
          height: 20,
          borderRadius: radius.sm,
        },
        colorPrimary: {
          backgroundColor: c.accentDim,
          color: c.accent,
        },
        colorSuccess: {
          backgroundColor: isDark ? 'rgba(132, 204, 22, 0.14)' : 'rgba(77, 124, 15, 0.12)',
          color: isDark ? c.success : c.success,
        },
        colorWarning: {
          backgroundColor: isDark ? 'rgba(245, 158, 11, 0.14)' : 'rgba(180, 83, 9, 0.12)',
          color: isDark ? c.warning : c.warning,
        },
        colorError: {
          backgroundColor: isDark ? 'rgba(248, 113, 113, 0.14)' : 'rgba(220, 38, 38, 0.12)',
          color: isDark ? c.danger : c.danger,
        },
        colorInfo: {
          backgroundColor: isDark ? 'rgba(96, 165, 250, 0.14)' : 'rgba(37, 99, 235, 0.12)',
          color: isDark ? c.info : c.info,
        },
      },
    },

    MuiTooltip: {
      defaultProps: {
        arrow: true,
        enterDelay: 400,
      },
      styleOverrides: {
        tooltip: {
          fontSize: tokens.fontSize.xs,
          fontWeight: 400,
          backgroundColor: isDark ? c.surface[400] : colors.neutral[700],
          color: isDark ? c.foreground : colors.neutral[50],
          borderRadius: radius.sm,
          padding: `${spacing[1]} ${spacing[2]}`,
          boxShadow: elevation.md,
          lineHeight: 1.4,
        },
        arrow: {
          color: isDark ? c.surface[400] : colors.neutral[700],
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
          backgroundColor: isDark ? surface300 : surface200,
          color: isDark ? c.muted : c.subtle,
        },
      },
    },

    MuiTable: {
      styleOverrides: {
        root: {
          fontVariantNumeric: 'tabular-nums',
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${border}`,
          transition: `background-color ${motion.fast.duration} ${motion.fast.easing}`,
          '&:hover': {
            backgroundColor: hoverBg,
          },
          '&.Mui-selected': {
            backgroundColor: selectedBg,
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: tokens.fontSize.sm,
          padding: `${densityTokens.tableCell.paddingY}px ${densityTokens.tableCell.paddingX}px`,
          borderBottom: `1px solid ${border}`,
          color: c.foreground,
        },
        sizeSmall: {
          padding: `${densityTokens.row.compact - 30}px ${densityTokens.tableCell.paddingX}px`,
        },
        stickyHeader: {
          backgroundColor: c.surface[100],
        },
        head: {
          fontSize: `${densityTokens.tableHeader.fontSize}px`,
          fontWeight: densityTokens.tableHeader.fontWeight,
          color: textTertiary,
          letterSpacing: '0.02em',
          borderBottom: `1px solid ${borderStrong}`,
          padding: `${densityTokens.tableHeader.paddingY}px ${densityTokens.tableHeader.paddingX}px`,
          backgroundColor: c.surface[100],
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontSize: `${densityTokens.tableHeader.fontSize}px`,
            fontWeight: densityTokens.tableHeader.fontWeight,
            color: textTertiary,
            letterSpacing: '0.02em',
            borderBottom: `1px solid ${borderStrong}`,
            padding: `${densityTokens.tableHeader.paddingY}px ${densityTokens.tableHeader.paddingX}px`,
            backgroundColor: c.surface[100],
          },
        },
      },
    },

    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontSize: tokens.fontSize.sm,
            padding: `${densityTokens.tableCell.paddingY}px ${densityTokens.tableCell.paddingX}px`,
            borderColor: border,
          },
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: tokens.fontSize.sm,
          borderRadius: radius.sm,
          margin: `${spacing[0.5]} ${spacing[0.5]}`,
          padding: `${spacing[1.5]} ${spacing[2]}`,
          minHeight: controlTokens.heightSmall,
          transition: `background-color ${motion.fast.duration} ${motion.fast.easing}`,
          '&:hover': {
            backgroundColor: isDark ? surface200 : surface200,
          },
          '&.Mui-selected': {
            backgroundColor: selectedBg,
          },
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
          color: c.accent,
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: radius.full,
          height: 4,
          backgroundColor: isDark ? surface300 : colors.neutral[100],
        },
        bar: {
          borderRadius: radius.full,
          backgroundColor: c.accent,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          transition: `background-color ${motion.fast.duration} ${motion.fast.easing}`,
          '&.Mui-selected': {
            backgroundColor: selectedBg,
          },
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 32,
          color: textSecondary,
        },
      },
    },

    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontSize: tokens.fontSize['2xs'],
          fontWeight: 600,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.08em',
          color: textTertiary,
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
          color: textTertiary,
        },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: isDark ? surface300 : colors.neutral[100],
        },
      },
    },
  };
};
