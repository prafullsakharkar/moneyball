/**
 * PerformanceMetric — CricketIQ Design System
 * Visual performance metric with bar indicator.
 */
import { Box, Typography, LinearProgress, type SxProps, type Theme } from '@mui/material';

export interface PerformanceMetricProps {
  /** Metric label */
  label: string;
  /** Metric value */
  value: number;
  /** Max value for the bar */
  maxValue?: number;
  /** Value display override (e.g., "45.67") */
  displayValue?: string;
  /** Unit suffix */
  unit?: string;
  /** Color */
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  /** Show progress bar */
  showBar?: boolean;
  /** Compact mode */
  compact?: boolean;
  sx?: SxProps<Theme>;
}

export function PerformanceMetric({
  label,
  value,
  maxValue = 100,
  displayValue,
  unit,
  color = 'primary',
  showBar = true,
  compact = false,
  sx,
}: PerformanceMetricProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: showBar ? 0.5 : 0 }}>
        <Typography
          variant="caption"
          sx={{
            fontSize: compact ? '0.625rem' : '0.6875rem',
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: compact ? '0.8125rem' : '0.875rem',
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
            color: 'text.primary',
          }}
        >
          {displayValue ?? value}
          {unit && (
            <Typography component="span" sx={{ fontSize: '0.75em', color: 'text.secondary', ml: 0.25 }}>
              {unit}
            </Typography>
          )}
        </Typography>
      </Box>
      {showBar && (
        <LinearProgress
          variant="determinate"
          value={percentage}
          color={color}
          sx={{
            height: compact ? 3 : 4,
            borderRadius: 1,
          }}
        />
      )}
    </Box>
  );
}
