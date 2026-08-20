/**
 * TeamBadge — CricketIQ Design System
 * Compact team badge with logo, short name, and optional score.
 */
import { Box, Avatar, Typography, type SxProps, type Theme } from '@mui/material';

export interface TeamBadgeProps {
  /** Team name */
  name: string;
  /** Short name (e.g., "AUS") */
  shortName?: string;
  /** Logo URL */
  logoUrl?: string;
  /** Team color (hex) */
  color?: string;
  /** Show score next to badge */
  score?: { runs: number; wickets: number; overs?: number };
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Direction */
  horizontal?: boolean;
  sx?: SxProps<Theme>;
}

export function TeamBadge({
  name,
  shortName,
  logoUrl,
  color = '#1565c0',
  score,
  size = 'md',
  horizontal = true,
  sx,
}: TeamBadgeProps) {
  const sizeMap = {
    sm: { avatar: 24, fontSize: '0.6875rem', scoreSize: '0.75rem' },
    md: { avatar: 32, fontSize: '0.8125rem', scoreSize: '0.875rem' },
    lg: { avatar: 40, fontSize: '0.875rem', scoreSize: '1rem' },
  };

  const s = sizeMap[size];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexDirection: horizontal ? 'row' : 'column',
        ...sx,
      }}
    >
      <Avatar
        src={logoUrl}
        sx={{
          width: s.avatar,
          height: s.avatar,
          fontSize: '0.6em',
          fontWeight: 700,
          bgcolor: color,
          color: '#fff',
        }}
      >
        {shortName?.charAt(0) ?? name.charAt(0)}
      </Avatar>
      <Box sx={{ textAlign: horizontal ? 'left' : 'center' }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: s.fontSize,
            fontWeight: 600,
            lineHeight: 1.2,
            color: 'text.primary',
          }}
        >
          {shortName || name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.625rem',
            color: 'text.secondary',
            lineHeight: 1.2,
            display: size === 'sm' ? 'none' : 'block',
          }}
        >
          {name}
        </Typography>
      </Box>
      {score && (
        <Typography
          sx={{
            fontSize: s.scoreSize,
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            color: 'text.primary',
            ml: horizontal ? 'auto' : 0,
          }}
        >
          {score.runs}/{score.wickets}
          {score.overs !== undefined && (
            <Typography
              component="span"
              sx={{ fontSize: '0.75em', fontWeight: 400, color: 'text.secondary', ml: 0.25 }}
            >
              ({score.overs})
            </Typography>
          )}
        </Typography>
      )}
    </Box>
  );
}
