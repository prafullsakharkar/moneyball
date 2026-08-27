/**
 * WagonWheel — CricketOS Design System
 * Shot placement visualization rendered as SVG. Shows where a batter
 * scored runs around the ground. Self-contained (no chart library).
 */
import { Box, Typography, useTheme, type SxProps, type Theme } from '@mui/material';

export interface WagonWheelShot {
  /** Runs scored off the shot */
  runs: number;
  /** Angle in degrees (0 = straight down the ground, clockwise) */
  angle: number;
  /** Distance from center 0..1 */
  distance: number;
  /** Shot type */
  type?: 'drive' | 'cut' | 'pull' | 'sweep' | 'defensive' | 'other';
}

export interface WagonWheelProps {
  /** Shots */
  shots: WagonWheelShot[];
  /** Chart size in px */
  size?: number;
  /** Show legend */
  showLegend?: boolean;
  sx?: SxProps<Theme>;
}

function runColor(theme: Theme, runs: number): string {
  switch (runs) {
    case 0:
      return theme.palette.text.secondary;
    case 4:
      return theme.palette.success.main;
    case 6:
      return theme.palette.error.main;
    default:
      return theme.palette.primary.main;
  }
}

export function WagonWheel({ shots, size = 260, showLegend = true, sx }: WagonWheelProps) {
  const theme = useTheme();
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 16;

  const pointFor = (angle: number, distance: number) => {
    const rad = (angle * Math.PI) / 180;
    return [cx + radius * distance * Math.sin(rad), cy - radius * distance * Math.cos(rad)] as const;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, ...sx }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Wagon wheel">
        {/* Ground circle */}
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={1} />
        {/* Inner circles */}
        <circle cx={cx} cy={cy} r={radius * 0.5} fill="none" stroke="currentColor" strokeOpacity={0.08} strokeWidth={0.5} />
        <circle cx={cx} cy={cy} r={radius * 0.25} fill="none" stroke="currentColor" strokeOpacity={0.08} strokeWidth={0.5} />
        {/* Pitch */}
        <line x1={cx} y1={cy - radius * 0.3} x2={cx} y2={cy + radius * 0.3} stroke="currentColor" strokeOpacity={0.15} strokeWidth={1} />
        {/* Boundary arcs */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const [x, y] = pointFor(a, 1);
          return <circle key={a} cx={x} cy={y} r={1.5} fill="currentColor" fillOpacity={0.2} />;
        })}

        {/* Shots */}
        {shots.map((shot, i) => {
          const [x, y] = pointFor(shot.angle, shot.distance);
          const color = runColor(theme, shot.runs);
          const r = shot.runs >= 4 ? 4 : shot.runs >= 2 ? 3 : 2;
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={color} strokeOpacity={0.25} strokeWidth={0.75} />
              <circle cx={x} cy={y} r={r} fill={color} fillOpacity={0.9} />
            </g>
          );
        })}
      </svg>

      {showLegend && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
          {[0, 1, 2, 4, 6].map((runs) => (
            <Box key={runs} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: runColor(theme, runs),
                }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {runs === 0 ? 'Dot' : `${runs} run${runs > 1 ? 's' : ''}`}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
