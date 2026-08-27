/**
 * ScatterChart — CricketOS Design System
 * Lightweight scatter plot rendered as SVG for correlation analysis
 * (e.g. strike rate vs average, economy vs wickets).
 * Self-contained (no chart library).
 */
import { Box, useTheme, type SxProps, type Theme } from '@mui/material';

export interface ScatterPoint {
  /** X value */
  x: number;
  /** Y value */
  y: number;
  /** Point label */
  label?: string;
  /** Optional color */
  color?: string;
}

export interface ScatterChartProps {
  /** Data points */
  data: ScatterPoint[];
  /** X-axis label */
  xLabel?: string;
  /** Y-axis label */
  yLabel?: string;
  /** Chart height in px */
  height?: number;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show point labels */
  showLabels?: boolean;
  sx?: SxProps<Theme>;
}

export function ScatterChart({
  data,
  xLabel,
  yLabel,
  height = 220,
  showGrid = true,
  showLabels = false,
  sx,
}: ScatterChartProps) {
  const theme = useTheme();

  if (data.length === 0) {
    return <Box sx={{ height, ...sx }} />;
  }

  const xs = data.map((d) => d.x);
  const ys = data.map((d) => d.y);
  const minX = Math.min(...xs, 0);
  const maxX = Math.max(...xs, 1);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 1);
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  const padX = 10;
  const padTop = 10;
  const padBottom = 18;
  const chartW = 100 - padX * 2;
  const chartH = height - padTop - padBottom;

  const xFor = (v: number) => padX + ((v - minX) / rangeX) * chartW;
  const yFor = (v: number) => padTop + (1 - (v - minY) / rangeY) * chartH;

  const gridLines = 4;

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" role="img" aria-label="Scatter chart">
        {showGrid &&
          Array.from({ length: gridLines + 1 }).map((_, i) => {
            const y = padTop + (i / gridLines) * chartH;
            return (
              <line
                key={`h${i}`}
                x1={padX}
                y1={y}
                x2={100 - padX}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={0.5}
              />
            );
          })}
        {showGrid &&
          Array.from({ length: gridLines + 1 }).map((_, i) => {
            const x = padX + (i / gridLines) * chartW;
            return (
              <line
                key={`v${i}`}
                x1={x}
                y1={padTop}
                x2={x}
                y2={padTop + chartH}
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={0.5}
              />
            );
          })}

        {data.map((d, i) => {
          const cx = xFor(d.x);
          const cy = yFor(d.y);
          const color = d.color ?? theme.palette.primary.main;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={2.5} fill={color} fillOpacity={0.85} />
              {showLabels && d.label && (
                <text x={cx} y={cy - 4} textAnchor="middle" fontSize="3" fill="currentColor" opacity={0.7}>
                  {d.label}
                </text>
              )}
            </g>
          );
        })}

        {xLabel && (
          <text x={50} y={height - 2} textAnchor="middle" fontSize="3.5" fill="currentColor" opacity={0.5}>
            {xLabel}
          </text>
        )}
        {yLabel && (
          <text x={2} y={padTop + chartH / 2} textAnchor="middle" fontSize="3.5" fill="currentColor" opacity={0.5} transform={`rotate(-90 2 ${padTop + chartH / 2})`}>
            {yLabel}
          </text>
        )}
      </svg>
    </Box>
  );
}
