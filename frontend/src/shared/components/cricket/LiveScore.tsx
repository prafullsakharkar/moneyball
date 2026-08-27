/**
 * LiveScore — CricketOS Design System
 * Immediately communicates teams, runs, wickets, overs, current innings,
 * run rate, required rate, target, and match state with a subtle LIVE indicator.
 */
import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import { LiveIndicator } from './LiveIndicator';
import { MatchStatus } from './MatchStatus';
import type { Match, MatchTeam } from '@domain/index';

export interface LiveScoreProps {
  /** Match data */
  match: Match;
  /** Display size */
  size?: 'sm' | 'md' | 'lg';
  sx?: SxProps<Theme>;
}

function TeamLine({
  team,
  batting,
  size,
}: {
  team: MatchTeam;
  batting?: boolean;
  size: 'sm' | 'md' | 'lg';
}) {
  const sizeMap = {
    sm: { score: '1.125rem', name: '0.6875rem', meta: '0.625rem' },
    md: { score: '1.5rem', name: '0.8125rem', meta: '0.6875rem' },
    lg: { score: '1.875rem', name: '0.9375rem', meta: '0.75rem' },
  };
  const s = sizeMap[size];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
      <Box
        sx={{
          width: size === 'sm' ? 22 : 28,
          height: size === 'sm' ? 22 : 28,
          borderRadius: 1,
          bgcolor: 'primary.main',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: size === 'sm' ? '0.625rem' : '0.6875rem',
          flexShrink: 0,
        }}
      >
        {team.shortName.charAt(0)}
      </Box>
      <Typography
        sx={{
          fontSize: s.name,
          fontWeight: 600,
          color: 'text.primary',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {team.shortName}
      </Typography>
      {batting && <LiveIndicator size="sm" showLabel={false} />}
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography
          sx={{
            fontSize: s.score,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: 'text.primary',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {team.runs}
        </Typography>
        <Typography sx={{ fontSize: s.score, fontWeight: 400, color: 'text.secondary', lineHeight: 1 }}>
          /
        </Typography>
        <Typography
          sx={{
            fontSize: s.score,
            fontWeight: 600,
            lineHeight: 1,
            color: team.wickets >= 5 ? 'error.main' : 'text.primary',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {team.wickets}
        </Typography>
        <Typography sx={{ fontSize: s.meta, color: 'text.secondary', ml: 0.5, fontVariantNumeric: 'tabular-nums' }}>
          ({team.overs})
        </Typography>
      </Box>
    </Box>
  );
}

export function LiveScore({ match, size = 'md', sx }: LiveScoreProps) {
  const [team1, team2] = match.teams;
  const isLive = match.isLive || match.state === 'live' || match.state === 'in_progress';

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        p: size === 'sm' ? 1.5 : 2,
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          {isLive && <LiveIndicator size="sm" />}
          {match.currentInnings && (
            <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>
              {match.currentInnings === 1 ? '1st Innings' : '2nd Innings'}
            </Typography>
          )}
        </Box>
        <MatchStatus state={match.state} size="sm" />
      </Box>

      <TeamLine team={team1} batting={team1.batting} size={size} />
      <TeamLine team={team2} batting={team2.batting} size={size} />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mt: 1,
          pt: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          flexWrap: 'wrap',
        }}
      >
        {team1.runRate !== undefined && (
          <Meta label="Run Rate" value={team1.runRate.toFixed(2)} />
        )}
        {match.target !== undefined && <Meta label="Target" value={String(match.target)} />}
        {match.requiredRate !== undefined && (
          <Meta label="Req. Rate" value={match.requiredRate.toFixed(2)} />
        )}
        {match.result && (
          <Typography sx={{ fontSize: '0.6875rem', color: 'success.main', fontWeight: 500, ml: 'auto' }}>
            {match.result}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
      <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Typography>
    </Box>
  );
}
