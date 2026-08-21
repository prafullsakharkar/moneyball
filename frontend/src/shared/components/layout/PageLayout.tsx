/**
 * CricketIQ — Page Layout System
 * ============================================
 * Composable primitives for consistent page composition.
 * Mirrors StudioHub's quiet, dense, information-first layout.
 */
import { forwardRef, type ReactNode } from 'react';
import { Box, Typography, type BoxProps, type SxProps, type Theme } from '@mui/material';
import { cn } from '@utils/cn';

/** Merge a base sx object with an optional user-provided sx (array-safe). */
function mergeSx(base: Record<string, unknown>, extra?: SxProps<Theme>): SxProps<Theme> {
  return (extra ? [base, extra] : base) as SxProps<Theme>;
}

/* ── PageShell ───────────────────────────────────────────── */

export interface PageShellProps extends Omit<BoxProps, 'title'> {
  /** Max content width (defaults to theme contentMaxWidth) */
  maxWidth?: number | string;
}

/** Root page container with consistent max-width + padding. */
export const PageShell = forwardRef<HTMLDivElement, PageShellProps>(
  ({ maxWidth = 1200, className, sx, ...props }, ref) => (
    <Box
      ref={ref}
      className={cn('cricket-page', className)}
      sx={mergeSx({ width: '100%', maxWidth, mx: 'auto' }, sx)}
      {...props}
    />
  ),
);
PageShell.displayName = 'PageShell';

/* ── PageHeader ──────────────────────────────────────────── */

export interface PageHeaderProps extends Omit<BoxProps, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  /** Right-aligned actions */
  actions?: ReactNode;
  /** Optional eyebrow/overline above title */
  eyebrow?: ReactNode;
}

/** Page header with title, description, and actions. */
export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, actions, eyebrow, className, sx, ...props }, ref) => (
    <Box
      ref={ref}
      className={cn('cricket-page-header', className)}
      sx={mergeSx(
        {
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        },
        sx,
      )}
      {...props}
    >
      <Box sx={{ minWidth: 0 }}>
        {eyebrow && (
          <Typography
            variant="overline"
            sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
          >
            {eyebrow}
          </Typography>
        )}
        {title && (
          <Typography variant="h4" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
            {title}
          </Typography>
        )}
        {description && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Box>
      {actions && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          {actions}
        </Box>
      )}
    </Box>
  ),
);
PageHeader.displayName = 'PageHeader';

/* ── PageTitle ───────────────────────────────────────────── */

export interface PageTitleProps {
  children: ReactNode;
  /** 'h1' | 'h2' | 'h3' | 'h4' */
  variant?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
}

/** Standalone page title. */
export const PageTitle = forwardRef<HTMLHeadingElement, PageTitleProps>(
  ({ children, variant = 'h4', className }, ref) => (
    <Typography ref={ref} variant={variant} className={cn('cricket-page-title', className)} sx={{ fontWeight: 600 }}>
      {children}
    </Typography>
  ),
);
PageTitle.displayName = 'PageTitle';

/* ── PageActions ─────────────────────────────────────────── */

export type PageActionsProps = Omit<BoxProps, 'title'>;

/** Right-aligned action cluster. */
export const PageActions = forwardRef<HTMLDivElement, PageActionsProps>(
  ({ className, sx, ...props }, ref) => (
    <Box
      ref={ref}
      className={cn('cricket-page-actions', className)}
      sx={mergeSx({ display: 'flex', alignItems: 'center', gap: 1 }, sx)}
      {...props}
    />
  ),
);
PageActions.displayName = 'PageActions';

/* ── PageContent ─────────────────────────────────────────── */

export type PageContentProps = Omit<BoxProps, 'title'>;

/** Main content region. */
export const PageContent = forwardRef<HTMLDivElement, PageContentProps>(
  ({ className, sx, ...props }, ref) => (
    <Box ref={ref} className={cn('cricket-page-content', className)} sx={sx} {...props} />
  ),
);
PageContent.displayName = 'PageContent';

/* ── PageSection ─────────────────────────────────────────── */

export interface PageSectionProps extends Omit<BoxProps, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

/** A titled content section with optional header actions. */
export const PageSection = forwardRef<HTMLDivElement, PageSectionProps>(
  ({ title, description, actions, className, sx, children, ...props }, ref) => (
    <Box ref={ref} className={cn('cricket-page-section', className)} sx={mergeSx({ mb: 3 }, sx)} {...props}>
      {(title || actions) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mb: 1.5,
          }}
        >
          <Box>
            {title && (
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            )}
            {description && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {description}
              </Typography>
            )}
          </Box>
          {actions && <Box sx={{ display: 'flex', gap: 1 }}>{actions}</Box>}
        </Box>
      )}
      {children}
    </Box>
  ),
);
PageSection.displayName = 'PageSection';

/* ── PageToolbar ─────────────────────────────────────────── */

export type PageToolbarProps = Omit<BoxProps, 'title'>;

/** Horizontal toolbar for filters/actions above content. */
export const PageToolbar = forwardRef<HTMLDivElement, PageToolbarProps>(
  ({ className, sx, ...props }, ref) => (
    <Box
      ref={ref}
      className={cn('cricket-page-toolbar', className)}
      sx={mergeSx(
        {
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
          mb: 2,
          p: 1.5,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        },
        sx,
      )}
      {...props}
    />
  ),
);
PageToolbar.displayName = 'PageToolbar';

/* ── PageTabs ────────────────────────────────────────────── */

export type PageTabsProps = Omit<BoxProps, 'title'>;

/** Tab strip container. */
export const PageTabs = forwardRef<HTMLDivElement, PageTabsProps>(
  ({ className, sx, ...props }, ref) => (
    <Box
      ref={ref}
      className={cn('cricket-page-tabs', className)}
      sx={mergeSx({ mb: 2, borderBottom: '1px solid', borderColor: 'divider' }, sx)}
      {...props}
    />
  ),
);
PageTabs.displayName = 'PageTabs';

/* ── PageFilters ─────────────────────────────────────────── */

export type PageFiltersProps = Omit<BoxProps, 'title'>;

/** Filter cluster (inputs, selects, chips). */
export const PageFilters = forwardRef<HTMLDivElement, PageFiltersProps>(
  ({ className, sx, ...props }, ref) => (
    <Box
      ref={ref}
      className={cn('cricket-page-filters', className)}
      sx={mergeSx({ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }, sx)}
      {...props}
    />
  ),
);
PageFilters.displayName = 'PageFilters';

/* ── PageFooter ──────────────────────────────────────────── */

export type PageFooterProps = Omit<BoxProps, 'title'>;

/** Page footer (pagination, meta). */
export const PageFooter = forwardRef<HTMLDivElement, PageFooterProps>(
  ({ className, sx, ...props }, ref) => (
    <Box
      ref={ref}
      className={cn('cricket-page-footer', className)}
      sx={mergeSx({ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }, sx)}
      {...props}
    />
  ),
);
PageFooter.displayName = 'PageFooter';
