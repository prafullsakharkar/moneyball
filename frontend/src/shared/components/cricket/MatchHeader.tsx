/**
 * MatchHeader — CricketOS Design System
 * Premium match header showing teams, live score, overs, and current status.
 * Used at the top of the Match Center workspace.
 */
import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import { MatchStatus } from './MatchStatus';
import { LiveIndicator } from './LiveIndicator';
import type { Match, MatchTeam } from '@domain/index';

export interface MatchHeaderProps {
  /** Match data */
  match: Match;
  /** Optional onNavigate callback for team links */
  onTeamClick?: (teamId: string) => void;
  sx?: SxProps<Theme>;
}

function TeamScore({
  team,
  batting,
  winner,
  onTeamClick,
}: {
  team: MatchTeam;
  batting?: boolean;
  winner?: boolean;
  onTeamClick?: (teamId: string) => void;
}) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Box
        component={onTeamClick ? 'button' : 'div'}
        onClick={onTeamClick ? () => onTeamClick(team.id) : undefined}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          background: 'none',
          border: 'none',
          cursor: onTeamClick ? 'pointer' : 'default',
          p: 0,
          color: 'inherit',
          '&:hover': onTeamClick ? { opacity: 0.8 } : undefined,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            bgcolor: 'primary.main',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.75rem',
            flexShrink: 0,
          }}
        >
          {team.shortName.charAt(0)}
        </Box>
        <Typography
          sx={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: 'text.primary',
            lineHeight: 1.2,
          }}
        >
          {team.shortName}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography
          sx={{
            fontSize: '2rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: 'text.primary',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {team.runs}
        </Typography>
        <Typography sx={{ fontSize: '2rem', fontWeight: 400, color: 'text.secondary', lineHeight: 1 }}>
          /
        </Typography>
        <Typography
          sx={{
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1,
            color: team.wickets >= 5 ? 'error.main' : 'text.primary',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {team.wickets}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: 'text.secondary',
            ml: 0.5,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          ({team.overs} ov)
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minHeight: 20 }}>
        {batting && <LiveIndicator size="sm" />}
        {winner && (
          <Typography
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: 'success.main',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Winner
          </Typography>
        )}
        {team.runRate !== undefined && (
          <Typography sx={{ fontSize: '0.6875rem', color: 'text.tertiary', fontVariantNumeric: 'tabular-nums' }}>
            RR {team.runRate.toFixed(2)}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export function MatchHeader({ match, onTeamClick, sx }: MatchHeaderProps) {
  const [team1, team2] = match.teams;
  const isLive = match.isLive || match.state === 'live' || match.state === 'in_progress';

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {/* Top bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          {match.tournamentName && (
            <Typography
              sx={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {match.tournamentName}
            </Typography>
          )}
          {match.label && (
            <Typography sx={{ fontSize: '0.6875rem', color: 'text.tertiary', whiteSpace: 'nowrap' }}>
              · {match.label}
            </Typography>
          )}
        </Box>
        <MatchStatus state={match.state} result={match.result} innings={match.currentInnings} size="sm" />
      </Box>

      {/* Score area */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: { xs: 1.5, sm: 3 },
          py: 2.5,
          gap: 1,
        }}
      >
        <TeamScore team={team1} batting={team1.batting} winner={team1.winner} onTeamClick={onTeamClick} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.625rem',
              fontWeight: 600,
              color: 'text.tertiary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            vs
          </Typography>
          {isLive && (
            <Typography
              sx={{
                fontSize: '0.625rem',
                fontWeight: 700,
                color: 'primary.main',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Live
            </Typography>
          )}
        </Box>
        <TeamScore team={team2} batting={team2.batting} winner={team2.winner} onTeamClick={onTeamClick} />
      </Box>

      {/* Bottom meta */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          px: 2,
          py: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
          flexWrap: 'wrap',
        }}
      >
        <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>{match.venue}</Typography>
        {match.city && (
          <Typography sx={{ fontSize: '0.6875rem', color: 'text.tertiary' }}>{match.city}</Typography>
        )}
        {match.target !== undefined && (
          <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
            Target: {match.target}
          </Typography>
        )}
        {match.requiredRate !== undefined && (
          <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
            Req. Rate: {match.requiredRate.toFixed(2)}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
