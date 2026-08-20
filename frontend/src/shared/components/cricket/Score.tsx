/**
 * Score — CricketIQ Design System
 * Cricket score display with runs, wickets, overs, and run rate.
 */
import { Box, Typography, type SxProps, type Theme } from '@mui/material';

export interface ScoreProps {
  /** Runs scored */
  runs: number;
  /** Wickets fallen */
  wickets: number;
  /** Overs bowled (e.g., 42.3) */
  overs: number;
  /** Run rate */
  runRate?: number;
  /** Team name */
  team?: string;
  /** Display size */
  size?: 'sm' | 'md' | 'lg';
  /** Extra info (e.g., "Day 1") */
  subtitle?: string;
  sx?: SxProps<Theme>;
}

export function Score({
  runs,
  wickets,
  overs,
  runRate,
  team,
  size = 'md',
  subtitle,
  sx,
}: ScoreProps) {
  const sizeStyles = {
    sm: { runsSize: '1.25rem', labelSize: '0.6875rem', oversSize: '0.75rem' },
    md: { runsSize: '1.75rem', labelSize: '0.75rem', oversSize: '0.875rem' },
    lg: { runsSize: '2.5rem', labelSize: '0.875rem', oversSize: '1rem' },
  };

  const s = sizeStyles[size];

  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, ...sx }}>
      <Typography
        sx={{
          fontSize: s.runsSize,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          color: 'text.primary',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {runs}
      </Typography>
      <Typography
        sx={{
          fontSize: s.runsSize,
          fontWeight: 400,
          color: 'text.secondary',
          lineHeight: 1,
        }}
      >
        /
      </Typography>
      <Typography
        sx={{
          fontSize: s.runsSize,
          fontWeight: 600,
          color: wickets >= 5 ? 'error.main' : 'text.primary',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {wickets}
      </Typography>
      <Box sx={{ ml: 0.5, display: 'flex', flexDirection: 'column' }}>
        <Typography
          sx={{
            fontSize: s.oversSize,
            color: 'text.secondary',
            lineHeight: 1.2,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          ({overs} ov)
        </Typography>
        {runRate !== undefined && (
          <Typography
            sx={{
              fontSize: s.labelSize,
              color: 'text.tertiary',
              lineHeight: 1.2,
            }}
          >
            RR: {runRate.toFixed(2)}
          </Typography>
        )}
      </Box>
      {team && (
        <Typography
          sx={{
            fontSize: s.labelSize,
            color: 'text.secondary',
            ml: 0.5,
          }}
        >
          {team}
        </Typography>
      )}
      {subtitle && (
        <Typography
          sx={{
            fontSize: s.labelSize,
            color: 'text.tertiary',
            ml: 0.5,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
