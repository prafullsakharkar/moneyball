/**
 * Scorecard — CricketOS Design System
 * Full innings scorecard: batting, bowling, fall of wickets, partnerships,
 * extras, and powerplays. All metrics use tabular numbers, right-aligned.
 */
import { Box, Typography, useTheme, type SxProps, type Theme } from '@mui/material';
import type { MatchInnings } from '@domain/index';

export interface ScorecardProps {
  /** Innings data */
  innings: MatchInnings;
  /** Team name for the batting side */
  battingTeamName?: string;
  /** Team name for the bowling side */
  bowlingTeamName?: string;
  sx?: SxProps<Theme>;
}

const th: React.CSSProperties = {
  fontSize: '0.625rem',
  fontWeight: 600,
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  textAlign: 'right',
  padding: '6px 8px',
  whiteSpace: 'nowrap',
};

const thLeft: React.CSSProperties = { ...th, textAlign: 'left' };

const td: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'text.primary',
  textAlign: 'right',
  padding: '6px 8px',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
};

const tdLeft: React.CSSProperties = { ...td, textAlign: 'left' };

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: '0.6875rem',
        fontWeight: 600,
        color: 'text.secondary',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        mb: 0.5,
      }}
    >
      {children}
    </Typography>
  );
}

export function Scorecard({ innings, battingTeamName, sx }: ScorecardProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, ...sx }}>
      {/* Innings summary */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
          {innings.runs}/{innings.wickets}
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
          ({innings.overs} ov)
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: 'text.tertiary', fontVariantNumeric: 'tabular-nums' }}>
          RR {innings.runRate.toFixed(2)}
        </Typography>
        {battingTeamName && (
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', ml: 'auto' }}>
            {battingTeamName}
          </Typography>
        )}
      </Box>

      {/* Batting card */}
      <Box>
        <SectionTitle>Batting</SectionTitle>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                <th style={thLeft}>Batter</th>
                <th style={th}>R</th>
                <th style={th}>B</th>
                <th style={th}>4s</th>
                <th style={th}>6s</th>
                <th style={th}>SR</th>
              </tr>
            </thead>
            <tbody>
              {innings.batting.map((b) => (
                <tr
                  key={b.playerId}
                  style={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    background: b.notOut ? `${theme.palette.primary.main}0d` : 'transparent',
                  }}
                >
                  <td style={tdLeft}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', fontWeight: 500 }}>
                        {b.playerName}
                      </Typography>
                      {b.notOut && (
                        <Typography sx={{ fontSize: '0.625rem', color: 'primary.main', fontWeight: 600 }}>*</Typography>
                      )}
                    </Box>
                    {b.dismissal && (
                      <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary', display: 'block' }}>
                        {b.dismissal}
                      </Typography>
                    )}
                  </td>
                  <td style={td}>{b.runs}</td>
                  <td style={td}>{b.balls}</td>
                  <td style={td}>{b.fours}</td>
                  <td style={td}>{b.sixes}</td>
                  <td style={td}>{b.strikeRate.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>

      {/* Extras + total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0.5 }}>
        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          Extras: <span style={{ fontVariantNumeric: 'tabular-nums' }}>{innings.extras.total}</span>
          <span style={{ color: 'text.tertiary', fontSize: '0.6875rem' }}>
            {' '}
            (b {innings.extras.byes}, lb {innings.extras.legByes}, w {innings.extras.wides}, nb {innings.extras.noBalls}, p {innings.extras.penalty})
          </span>
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
          Total: {innings.runs}/{innings.wickets} ({innings.overs} ov)
        </Typography>
      </Box>

      {/* Bowling card */}
      <Box>
        <SectionTitle>Bowling</SectionTitle>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                <th style={thLeft}>Bowler</th>
                <th style={th}>O</th>
                <th style={th}>M</th>
                <th style={th}>R</th>
                <th style={th}>W</th>
                <th style={th}>Econ</th>
              </tr>
            </thead>
            <tbody>
              {innings.bowling.map((b) => (
                <tr key={b.playerId} style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <td style={tdLeft}>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', fontWeight: 500 }}>
                      {b.playerName}
                    </Typography>
                  </td>
                  <td style={td}>{b.overs}</td>
                  <td style={td}>{b.maidens}</td>
                  <td style={td}>{b.runs}</td>
                  <td style={td}>{b.wickets}</td>
                  <td style={td}>{b.economy.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>

      {/* Fall of wickets */}
      {innings.fallOfWickets.length > 0 && (
        <Box>
          <SectionTitle>Fall of Wickets</SectionTitle>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {innings.fallOfWickets.map((f) => (
              <Box key={f.wicket} sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
                  {f.score}/{f.wicket}
                </Typography>
                <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary', fontVariantNumeric: 'tabular-nums' }}>
                  ({f.overs} ov)
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Partnerships */}
      {innings.partnerships.length > 0 && (
        <Box>
          <SectionTitle>Partnerships</SectionTitle>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <th style={thLeft}>Partnership</th>
                  <th style={th}>Runs</th>
                  <th style={th}>Balls</th>
                </tr>
              </thead>
              <tbody>
                {innings.partnerships.map((p) => (
                  <tr key={p.wicket} style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <td style={tdLeft}>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.primary' }}>
                        {p.player1Name} & {p.player2Name}
                      </Typography>
                    </td>
                    <td style={td}>{p.runs}</td>
                    <td style={td}>{p.balls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      )}

      {/* Powerplays */}
      {innings.powerplays.length > 0 && (
        <Box>
          <SectionTitle>Powerplays</SectionTitle>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {innings.powerplays.map((p) => (
              <Box
                key={p.label}
                sx={{
                  px: 1.5,
                  py: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.default',
                }}
              >
                <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {p.label}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
                  {p.runs}/{p.wickets}
                </Typography>
                <Typography sx={{ fontSize: '0.625rem', color: 'text.tertiary', fontVariantNumeric: 'tabular-nums' }}>
                  Overs {p.fromOver}-{p.toOver}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
