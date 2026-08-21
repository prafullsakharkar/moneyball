/**
 * CricketIQ — Typography Components
 * ============================================
 * Semantic text primitives built on the centralized theme.
 * Adopts StudioHub's dense scale: 13px base, Inter font, quiet hierarchy.
 */
import { forwardRef, type ElementType, type ReactNode } from 'react';
import { Typography, type TypographyProps, type SxProps, type Theme } from '@mui/material';
import { cn } from '@utils/cn';

/** Merge a base sx object with an optional user-provided sx (array-safe). */
function mergeSx(
  base: Record<string, unknown>,
  extra?: SxProps<Theme>,
): SxProps<Theme> {
  return (extra ? [base, extra] : base) as SxProps<Theme>;
}

/* ── Shared base ─────────────────────────────────────────── */

interface TextBaseProps extends Omit<TypographyProps, 'variant'> {
  /** Render as a different element (e.g. 'span', 'p', 'div') */
  component?: ElementType;
  children?: ReactNode;
  className?: string;
}

/* ── Display ─────────────────────────────────────────────── */

export interface DisplayProps extends TextBaseProps {
  /** Display size: 'xl' | 'lg' | 'md' | 'sm' */
  size?: 'xl' | 'lg' | 'md' | 'sm';
}

/** Large hero/landing display text. */
export const Display = forwardRef<HTMLElement, DisplayProps>(
  ({ size = 'md', component = 'h1', className, ...props }, ref) => {
    const sizes: Record<NonNullable<DisplayProps['size']>, TypographyProps['variant']> = {
      xl: 'h1',
      lg: 'h2',
      md: 'h3',
      sm: 'h4',
    };
    return (
      <Typography
        ref={ref}
        component={component}
        variant={sizes[size]}
        className={cn('cricket-display', className)}
        {...props}
      />
    );
  },
);
Display.displayName = 'Display';

/* ── Heading ─────────────────────────────────────────────── */

export interface HeadingProps extends TextBaseProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

/** Section heading mapped to MUI h1–h6 variants. */
export const Heading = forwardRef<HTMLElement, HeadingProps>(
  ({ level = 2, component, className, ...props }, ref) => {
    const variants: Record<number, TypographyProps['variant']> = {
      1: 'h1',
      2: 'h2',
      3: 'h3',
      4: 'h4',
      5: 'h5',
      6: 'h6',
    };
    return (
      <Typography
        ref={ref}
        component={component ?? (`h${level}` as ElementType)}
        variant={variants[level]}
        className={cn('cricket-heading', className)}
        {...props}
      />
    );
  },
);
Heading.displayName = 'Heading';

/* ── Body ────────────────────────────────────────────────── */

export interface BodyProps extends TextBaseProps {
  /** 'md' (default) | 'sm' | 'xs' */
  size?: 'md' | 'sm' | 'xs';
  /** Muted secondary text */
  muted?: boolean;
}

/** Body copy. */
export const Body = forwardRef<HTMLElement, BodyProps>(
  ({ size = 'md', muted, component = 'p', className, sx, ...props }, ref) => {
    const variants: Record<NonNullable<BodyProps['size']>, TypographyProps['variant']> = {
      md: 'body1',
      sm: 'body2',
      xs: 'caption',
    };
    return (
      <Typography
        ref={ref}
        component={component}
        variant={variants[size]}
        sx={mergeSx({ color: muted ? 'text.secondary' : undefined }, sx)}
        className={cn('cricket-body', className)}
        {...props}
      />
    );
  },
);
Body.displayName = 'Body';

/* ── Label ───────────────────────────────────────────────── */

export interface LabelProps extends TextBaseProps {
  /** 'md' | 'sm' | 'xs' */
  size?: 'md' | 'sm' | 'xs';
  /** Uppercase label (mono, tracked) */
  uppercase?: boolean;
  muted?: boolean;
}

/** Compact field/control label. */
export const Label = forwardRef<HTMLElement, LabelProps>(
  ({ size = 'sm', uppercase, muted, component = 'span', className, sx, ...props }, ref) => {
    const variants: Record<NonNullable<LabelProps['size']>, TypographyProps['variant']> = {
      md: 'subtitle2',
      sm: 'caption',
      xs: 'overline',
    };
    return (
      <Typography
        ref={ref}
        component={component}
        variant={variants[size]}
        sx={mergeSx(
          {
            fontWeight: 500,
            color: muted ? 'text.secondary' : undefined,
            ...(uppercase
              ? { textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6875rem' }
              : {}),
          },
          sx,
        )}
        className={cn('cricket-label', className)}
        {...props}
      />
    );
  },
);
Label.displayName = 'Label';

/* ── Caption ─────────────────────────────────────────────── */

export interface CaptionProps extends TextBaseProps {
  muted?: boolean;
}

/** Small helper/annotation text. */
export const Caption = forwardRef<HTMLElement, CaptionProps>(
  ({ muted, component = 'span', className, sx, ...props }, ref) => (
    <Typography
      ref={ref}
      component={component}
      variant="caption"
      sx={mergeSx({ color: muted ? 'text.secondary' : undefined }, sx)}
      className={cn('cricket-caption', className)}
      {...props}
    />
  ),
);
Caption.displayName = 'Caption';

/* ── Overline ────────────────────────────────────────────── */

export interface OverlineProps extends TextBaseProps {
  muted?: boolean;
}

/** Uppercase mono section label (StudioHub pattern). */
export const Overline = forwardRef<HTMLElement, OverlineProps>(
  ({ muted, component = 'span', className, sx, ...props }, ref) => (
    <Typography
      ref={ref}
      component={component}
      variant="overline"
      sx={mergeSx({ color: muted ? 'text.secondary' : undefined }, sx)}
      className={cn('cricket-overline', className)}
      {...props}
    />
  ),
);
Overline.displayName = 'Overline';
