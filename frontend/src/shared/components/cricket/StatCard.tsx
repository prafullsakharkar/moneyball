/**
 * StatCard — CricketOS Design System
 * Stat card with value, label, trend, and comparison.
 */
import { Box, Typography, useTheme, type SxProps, type Theme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';

export interface StatCardProps {
  /** Stat value */
  value: string | number;
  /** Stat label */
  label: string;
  /** Trend direction */
  trend?: 'up' | 'down' | 'neutral';
  /** Trend value text (e.g., "+12%") */
  trendValue?: string;
  /** Comparison label (e.g., "vs last season") */
  comparison?: string;
  /** Icon */
  icon?: React.ReactNode;
  /** Color accent */
  accent?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  /** Compact mode */
  compact?: boolean;
  sx?: SxProps<Theme>;
}

export function StatCard({
  value,
  label,
  trend,
  trendValue,
  comparison,
  icon,
  accent = 'primary',
  compact = false,
  sx,
}: StatCardProps) {
  const theme = useTheme();
  const accentColor = theme.palette[accent].main;

  const trendIcons = {
    up: <TrendingUpIcon sx={{ fontSize: 14, color: 'success.main' }} />,
    down: <TrendingDownIcon sx={{ fontSize: 14, color: 'error.main' }} />,
    neutral: <RemoveIcon sx={{ fontSize: 14, color: 'text.secondary' }} />,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: compact ? 'center' : 'flex-start',
        gap: 1.5,
        p: compact ? 1.5 : 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: 'background.paper',
        transition: 'border-color 200ms',
        '&:hover': {
          borderColor: accentColor,
        },
        ...sx,
      }}
    >
      {icon && (
        <Box
          sx={{
            width: compact ? 32 : 40,
            height: compact ? 32 : 40,
            borderRadius: 1.5,
            bgcolor: `${accentColor}14`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: '0.6875rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            lineHeight: 1.2,
          }}
        >
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mt: 0.25 }}>
          <Typography
            sx={{
              fontSize: compact ? '1.25rem' : '1.5rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: 'text.primary',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              {trendIcons[trend]}
              {trendValue && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    color: trend === 'up' ? 'success.main' : trend === 'down' ? 'error.main' : 'text.secondary',
                  }}
                >
                  {trendValue}
                </Typography>
              )}
            </Box>
          )}
        </Box>
        {comparison && (
          <Typography variant="caption" sx={{ color: 'text.tertiary', fontSize: '0.625rem', display: 'block', mt: 0.25 }}>
            {comparison}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
