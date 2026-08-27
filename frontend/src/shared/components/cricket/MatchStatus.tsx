/**
 * MatchStatus — CricketOS Design System
 * Match status badge with live indicator, result, and scheduling info.
 *
 * Status semantics per DESIGN.md:
 *   LIVE       → accent with subtle indicator
 *   COMPLETED  → muted neutral styling
 *   UPCOMING   → secondary text with subtle emphasis
 *   ABANDONED  → warning/error semantics
 */
import { Box, Typography, Chip, useTheme, type SxProps, type Theme } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export type MatchState =
  | 'scheduled'
  | 'in_progress'
  | 'live'
  | 'innings_break'
  | 'rain_delay'
  | 'completed'
  | 'abandoned'
  | 'no_result';

export interface MatchStatusProps {
  /** Current match state */
  state: MatchState;
  /** Match result text (e.g., "Australia won by 5 wickets") */
  result?: string;
  /** Current innings (1 or 2) */
  innings?: number;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  sx?: SxProps<Theme>;
}

export function MatchStatus({ state, result, innings, size = 'md', sx }: MatchStatusProps) {
  const theme = useTheme();
  const { palette } = theme;

  const stateConfig: Record<MatchState, { label: string; color: string; bg: string }> = {
    scheduled: { label: 'Scheduled', color: palette.text.secondary, bg: 'transparent' },
    in_progress: { label: 'In Progress', color: palette.primary.main, bg: palette.primary.main + '1a' },
    live: { label: 'Live', color: palette.primary.main, bg: palette.primary.main + '1a' },
    innings_break: { label: 'Innings Break', color: palette.warning.main, bg: palette.warning.main + '1a' },
    rain_delay: { label: 'Rain Delay', color: palette.info.main, bg: palette.info.main + '1a' },
    completed: { label: 'Completed', color: palette.success.main, bg: palette.success.main + '1a' },
    abandoned: { label: 'Abandoned', color: palette.error.main, bg: palette.error.main + '1a' },
    no_result: { label: 'No Result', color: palette.text.secondary, bg: 'transparent' },
  };

  const config = stateConfig[state];
  const isLive = state === 'live' || state === 'in_progress';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Chip
          icon={
            isLive ? (
              <FiberManualRecordIcon
                sx={{
                  fontSize: size === 'sm' ? 8 : 10,
                  color: config.color,
                  animation: 'pulse-live 1.5s ease-in-out infinite',
                  '@keyframes pulse-live': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.3 },
                  },
                  '@media (prefers-reduced-motion: reduce)': {
                    animation: 'none',
                  },
                }}
              />
            ) : undefined
          }
          label={config.label}
          size={size === 'lg' ? 'medium' : 'small'}
          sx={{
            bgcolor: config.bg,
            color: config.color,
            fontWeight: 500,
            fontSize: size === 'sm' ? '0.625rem' : '0.75rem',
            height: size === 'sm' ? 20 : 24,
            border: config.bg === 'transparent' ? '1px solid' : 'none',
            borderColor: 'divider',
            '& .MuiChip-label': { px: 1 },
          }}
        />
        {innings && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: size === 'sm' ? '0.625rem' : '0.75rem',
            }}
          >
            {innings === 1 ? '1st Innings' : '2nd Innings'}
          </Typography>
        )}
      </Box>
      {result && (
        <Typography
          variant="caption"
          sx={{
            color: state === 'completed' ? 'success.main' : 'text.secondary',
            fontWeight: state === 'completed' ? 500 : 400,
            fontSize: size === 'sm' ? '0.625rem' : '0.75rem',
          }}
        >
          {result}
        </Typography>
      )}
    </Box>
  );
}
