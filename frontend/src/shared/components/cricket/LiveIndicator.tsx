/**
 * LiveIndicator — CricketOS Design System
 * Pulsing live dot with optional label.
 * LIVE uses the CricketOS accent with a subtle indicator.
 */
import { Box, Typography, useTheme, type SxProps, type Theme } from '@mui/material';

export interface LiveIndicatorProps {
  /** Show label text */
  showLabel?: boolean;
  /** Custom label */
  label?: string;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'live' | 'recording' | 'online';
  sx?: SxProps<Theme>;
}

export function LiveIndicator({
  showLabel = true,
  label,
  size = 'md',
  variant = 'live',
  sx,
}: LiveIndicatorProps) {
  const theme = useTheme();

  const variantConfig = {
    live: { color: theme.palette.primary.main, label: 'LIVE' },
    recording: { color: theme.palette.error.main, label: 'REC' },
    online: { color: theme.palette.success.main, label: 'Online' },
  };

  const config = variantConfig[variant];
  const dotSize = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const fontSize = size === 'sm' ? '0.5625rem' : size === 'md' ? '0.625rem' : '0.75rem';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        ...sx,
      }}
    >
      <Box
        sx={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          bgcolor: config.color,
          animation: 'pulse-dot 2s ease-in-out infinite',
          '@keyframes pulse-dot': {
            '0%': { boxShadow: `0 0 0 0 ${config.color}66` },
            '70%': { boxShadow: `0 0 0 ${dotSize}px ${config.color}00` },
            '100%': { boxShadow: `0 0 0 0 ${config.color}00` },
          },
        }}
      />
      {showLabel && (
        <Typography
          sx={{
            fontSize,
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: config.color,
            lineHeight: 1,
          }}
        >
          {label || config.label}
        </Typography>
      )}
    </Box>
  );
}
