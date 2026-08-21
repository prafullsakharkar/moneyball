/**
 * TournamentBadge — CricketOS Design System
 * Tournament/league badge with type indicator and season.
 */
import { Box, Typography, Chip, useTheme, type SxProps, type Theme } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LeagueIcon from '@mui/icons-material/Schema';

export interface TournamentBadgeProps {
  /** Tournament name */
  name: string;
  /** Tournament type */
  type?: 'tournament' | 'league' | 'series' | 'friendly';
  /** Season/year */
  season?: string;
  /** Status */
  status?: 'draft' | 'upcoming' | 'active' | 'completed' | 'cancelled';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  sx?: SxProps<Theme>;
}

export function TournamentBadge({
  name,
  type = 'tournament',
  season,
  status,
  size = 'md',
  sx,
}: TournamentBadgeProps) {
  const theme = useTheme();
  const { palette } = theme;

  const statusColors: Record<string, { bg: string; color: string }> = {
    draft: { bg: palette.action.hover, color: palette.text.disabled },
    upcoming: { bg: palette.primary.main + '1a', color: palette.primary.main },
    active: { bg: palette.success.main + '1a', color: palette.success.main },
    completed: { bg: palette.action.hover, color: palette.text.secondary },
    cancelled: { bg: palette.error.main + '1a', color: palette.error.main },
  };

  const sizeMap = {
    sm: { iconSize: 16, fontSize: '0.6875rem', chipH: 18 },
    md: { iconSize: 20, fontSize: '0.8125rem', chipH: 22 },
    lg: { iconSize: 24, fontSize: '0.875rem', chipH: 24 },
  };

  const s = sizeMap[size];
  const Icon = type === 'league' ? LeagueIcon : EmojiEventsIcon;
  const statusColor = status ? statusColors[status] : null;

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, ...sx }}>
      <Box
        sx={{
          width: s.iconSize + 8,
          height: s.iconSize + 8,
          borderRadius: 1,
          bgcolor: 'primary.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sx={{ fontSize: s.iconSize, color: 'primary.main' }} />
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: s.fontSize,
            fontWeight: 600,
            color: 'text.primary',
            lineHeight: 1.2,
          }}
        >
          {name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
          {season && (
            <Typography variant="caption" sx={{ fontSize: '0.625rem', color: 'text.secondary' }}>
              {season}
            </Typography>
          )}
          {statusColor && (
            <Chip
              label={status}
              size="small"
              sx={{
                height: s.chipH,
                fontSize: '0.5625rem',
                fontWeight: 500,
                bgcolor: statusColor.bg,
                color: statusColor.color,
                '& .MuiChip-label': { px: 0.75 },
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
