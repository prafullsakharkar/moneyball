/**
 * MatchStatus — CricketIQ Design System
 * Match status badge with live indicator, result, and scheduling info.
 */
import { Box, Typography, Chip, type SxProps, type Theme } from '@mui/material';
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

const stateConfig: Record<MatchState, { label: string; color: string; bg: string }> = {
  scheduled: { label: 'Scheduled', color: '#6b7280', bg: '#f3f4f6' },
  in_progress: { label: 'In Progress', color: '#1565c0', bg: '#e3f2fd' },
  live: { label: 'Live', color: '#d32f2f', bg: '#ffebee' },
  innings_break: { label: 'Innings Break', color: '#ed6c02', bg: '#fff3e0' },
  rain_delay: { label: 'Rain Delay', color: '#0288d1', bg: '#e1f5fe' },
  completed: { label: 'Completed', color: '#2e7d32', bg: '#e8f5e9' },
  abandoned: { label: 'Abandoned', color: '#9e9e9e', bg: '#f5f5f5' },
  no_result: { label: 'No Result', color: '#9e9e9e', bg: '#f5f5f5' },
};

export function MatchStatus({ state, result, innings, size = 'md', sx }: MatchStatusProps) {
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
                  color: 'error.main',
                  animation: 'pulse-live 1.5s ease-in-out infinite',
                  '@keyframes pulse-live': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.3 },
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
