/**
 * Scoreboard — CricketIQ Design System
 * Two-team score comparison for match headers and scorecards.
 * Mirrors StudioHub's dense, information-rich match rows.
 */
import { Box, Typography, type SxProps, type Theme } from '@mui/material';

export interface ScoreboardTeam {
  /** Team name */
  name: string;
  /** Runs scored */
  runs: number;
  /** Wickets fallen */
  wickets: number;
  /** Overs bowled */
  overs: number;
  /** Run rate */
  runRate?: number;
  /** Whether this team is currently batting */
  batting?: boolean;
}

export interface ScoreboardProps {
  /** First innings */
  team1: ScoreboardTeam;
  /** Second innings */
  team2: ScoreboardTeam;
  /** Match status text (e.g., "India won by 5 wickets") */
  status?: string;
  /** Display size */
  size?: 'sm' | 'md' | 'lg';
  sx?: SxProps<Theme>;
}

export function Scoreboard({ team1, team2, status, size = 'md', sx }: ScoreboardProps) {
  const runsSize = size === 'lg' ? '1.5rem' : '1.125rem';
  const labelSize = size === 'lg' ? '0.8125rem' : '0.75rem';

  const renderTeam = (team: ScoreboardTeam) => (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
        <Typography
          sx={{
            fontSize: labelSize,
            fontWeight: 600,
            color: 'text.primary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {team.name}
        </Typography>
        {team.batting && (
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: 'success.main',
              flexShrink: 0,
            }}
          />
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography
          sx={{
            fontSize: runsSize,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: 'text.primary',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {team.runs}
        </Typography>
        <Typography sx={{ fontSize: runsSize, fontWeight: 400, color: 'text.secondary', lineHeight: 1 }}>
          /
        </Typography>
        <Typography
          sx={{
            fontSize: runsSize,
            fontWeight: 600,
            color: team.wickets >= 5 ? 'error.main' : 'text.primary',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {team.wickets}
        </Typography>
        <Typography sx={{ fontSize: labelSize, color: 'text.secondary', ml: 0.5, fontVariantNumeric: 'tabular-nums' }}>
          ({team.overs} ov)
        </Typography>
        {team.runRate !== undefined && (
          <Typography sx={{ fontSize: labelSize, color: 'text.tertiary', ml: 0.5, fontVariantNumeric: 'tabular-nums' }}>
            RR {team.runRate.toFixed(2)}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: 'background.paper',
        ...sx,
      }}
    >
      {renderTeam(team1)}
      <Box
        sx={{
          width: 1,
          alignSelf: 'stretch',
          bgcolor: 'divider',
          flexShrink: 0,
        }}
      />
      {renderTeam(team2)}
      {status && (
        <Typography
          sx={{
            fontSize: '0.6875rem',
            color: 'text.secondary',
            alignSelf: 'flex-end',
            whiteSpace: 'nowrap',
            ml: 1,
          }}
        >
          {status}
        </Typography>
      )}
    </Box>
  );
}
