/**
 * TournamentBadge — CricketIQ Design System
 * Tournament/league badge with type indicator and season.
 */
import { Box, Typography, Chip, type SxProps, type Theme } from '@mui/material';
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

const statusColors: Record<string, { bg: string; color: string }> = {
  draft: { bg: '#f3f4f6', color: '#6b7280' },
  upcoming: { bg: '#e3f2fd', color: '#1565c0' },
  active: { bg: '#e8f5e9', color: '#2e7d32' },
  completed: { bg: '#f3f4f6', color: '#6b7280' },
  cancelled: { bg: '#ffebee', color: '#d32f2f' },
};

export function TournamentBadge({
  name,
  type = 'tournament',
  season,
  status,
  size = 'md',
  sx,
}: TournamentBadgeProps) {
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
