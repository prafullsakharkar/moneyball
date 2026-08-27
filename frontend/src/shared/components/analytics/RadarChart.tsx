/**
 * RadarChart — CricketOS Design System
 * Lightweight radar/spider chart rendered as SVG for multi-axis comparison
 * (e.g. player skill profile, team strengths).
 * Self-contained (no chart library). Restrained colors.
 */
import { Box, Typography, useTheme, type SxProps, type Theme } from '@mui/material';

export interface RadarSeries {
  /** Series label */
  label: string;
  /** Values 0..1 per axis */
  values: number[];
  /** Optional color */
  color?: string;
}

export interface RadarChartProps {
  /** Axis labels */
  axes: string[];
  /** Series data */
  series: RadarSeries[];
  /** Chart size in px */
  size?: number;
  /** Show axis labels */
  showLabels?: boolean;
  /** Show legend */
  showLegend?: boolean;
  sx?: SxProps<Theme>;
}

export function RadarChart({
  axes,
  series,
  size = 240,
  showLabels = true,
  showLegend = true,
  sx,
}: RadarChartProps) {
  const theme = useTheme();

  if (axes.length < 3 || series.length === 0) {
    return <Box sx={{ width: size, height: size, ...sx }} />;
  }

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 28;

  const angleFor = (i: number) => (Math.PI * 2 * i) / axes.length - Math.PI / 2;
  const pointFor = (i: number, value: number) => {
    const angle = angleFor(i);
    return [cx + radius * value * Math.cos(angle), cy + radius * value * Math.sin(angle)] as const;
  };

  const rings = 4;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, ...sx }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Radar chart">
        {/* Rings */}
        {Array.from({ length: rings }).map((_, r) => {
          const level = (r + 1) / rings;
          const points = axes.map((_, i) => pointFor(i, level));
          const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + ' Z';
          return (
            <path key={r} d={path} fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={0.5} />
          );
        })}

        {/* Axis lines */}
        {axes.map((_, i) => {
          const [x, y] = pointFor(i, 1);
          return (
            <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="currentColor" strokeOpacity={0.12} strokeWidth={0.5} />
          );
        })}

        {/* Series */}
        {series.map((s, si) => {
          const color = s.color ?? theme.palette.primary.main;
          const points = s.values.map((v, i) => pointFor(i, Math.max(0, Math.min(1, v))));
          const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + ' Z';
          return (
            <g key={si}>
              <path d={path} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
              {points.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={1.5} fill={color} />
              ))}
            </g>
          );
        })}

        {/* Axis labels */}
        {showLabels &&
          axes.map((axis, i) => {
            const [x, y] = pointFor(i, 1.18);
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="4"
                fill="currentColor"
                opacity={0.7}
              >
                {axis}
              </text>
            );
          })}
      </svg>

      {showLegend && series.length > 1 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
          {series.map((s, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 10, height: 2, borderRadius: 1, bgcolor: s.color ?? theme.palette.primary.main }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
