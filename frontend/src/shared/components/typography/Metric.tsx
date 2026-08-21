/**
 * CricketIQ — Metric Typography
 * ============================================
 * Numeric primitives for cricket data. All use tabular-nums for stable
 * column alignment (StudioHub pattern). Built on the centralized `metrics`
 * tokens from the theme.
 */
import { forwardRef, type ElementType, type ReactNode } from 'react';
import { Typography, type TypographyProps, type SxProps, type Theme } from '@mui/material';
import { metrics } from '@core/theme';
import { cn } from '@utils/cn';

/** Merge a base sx object with an optional user-provided sx (array-safe). */
function mergeSx(
  base: Record<string, unknown>,
  extra?: SxProps<Theme>,
): SxProps<Theme> {
  return (extra ? [base, extra] : base) as SxProps<Theme>;
}

/* ── Metric ──────────────────────────────────────────────── */

export type MetricKind =
  | 'score'
  | 'runs'
  | 'wickets'
  | 'overs'
  | 'runRate'
  | 'economy'
  | 'average'
  | 'strikeRate';

export interface MetricProps extends Omit<TypographyProps, 'variant'> {
  /** Which cricket metric style to apply */
  kind?: MetricKind;
  /** Numeric value to render (formatted by caller) */
  children?: ReactNode;
  component?: ElementType;
  className?: string;
}

const metricStyle: Record<MetricKind, Record<string, unknown>> = {
  score: metrics.score,
  runs: metrics.runs,
  wickets: metrics.wickets,
  overs: metrics.overs,
  runRate: metrics.runRate,
  economy: metrics.economy,
  average: metrics.average,
  strikeRate: metrics.strikeRate,
};

/** Numeric metric text with tabular figures. */
export const Metric = forwardRef<HTMLElement, MetricProps>(
  ({ kind = 'runs', component = 'span', className, sx, ...props }, ref) => (
    <Typography
      ref={ref}
      component={component}
      sx={mergeSx(metricStyle[kind], sx)}
      className={cn('cricket-metric', className)}
      {...props}
    />
  ),
);
Metric.displayName = 'Metric';

/* ── ScoreText ───────────────────────────────────────────── */

export interface ScoreTextProps extends Omit<TypographyProps, 'variant'> {
  /** Runs scored */
  runs: number;
  /** Wickets fallen */
  wickets?: number;
  /** Overs bowled, e.g. "12.3" */
  overs?: string;
  /** Show wickets + overs as a muted suffix */
  detail?: boolean;
  component?: ElementType;
  className?: string;
}

/** Compact score display: "245/4 (12.3)". */
export const ScoreText = forwardRef<HTMLElement, ScoreTextProps>(
  ({ runs, wickets, overs, detail = true, component = 'span', className, sx, ...props }, ref) => (
    <Typography
      ref={ref}
      component={component}
      sx={mergeSx(metrics.score, sx)}
      className={cn('cricket-score', className)}
      {...props}
    >
      {runs}
      {wickets !== undefined && (
        <Typography
          component="span"
          sx={{ ...metrics.wickets, color: 'text.secondary' }}
        >
          /{wickets}
        </Typography>
      )}
      {detail && overs !== undefined && (
        <Typography
          component="span"
          sx={{ ...metrics.overs, color: 'text.secondary', ml: 0.5 }}
        >
          ({overs})
        </Typography>
      )}
    </Typography>
  ),
);
ScoreText.displayName = 'ScoreText';

/* ── StatValue ───────────────────────────────────────────── */

export interface StatValueProps extends Omit<TypographyProps, 'variant'> {
  /** Numeric value */
  value: ReactNode;
  /** Optional unit suffix, e.g. "runs", "%" */
  unit?: string;
  component?: ElementType;
  className?: string;
}

/** Large stat value with optional muted unit. */
export const StatValue = forwardRef<HTMLElement, StatValueProps>(
  ({ value, unit, component = 'span', className, sx, ...props }, ref) => (
    <Typography
      ref={ref}
      component={component}
      sx={mergeSx(metrics.runs, sx)}
      className={cn('cricket-stat-value', className)}
      {...props}
    >
      {value}
      {unit && (
        <Typography
          component="span"
          sx={{ ...metrics.runs, color: 'text.secondary', fontSize: '0.75em', ml: 0.25 }}
        >
          {unit}
        </Typography>
      )}
    </Typography>
  ),
);
StatValue.displayName = 'StatValue';
