/**
 * LineChart — CricketOS Design System
 * Lightweight multi-series line chart rendered as SVG.
 * Self-contained (no chart library). Restrained colors, no rainbow charts.
 */
import { useId } from 'react';
import { Box, Typography, useTheme, type SxProps, type Theme } from '@mui/material';

export interface LineSeries {
  /** Series label */
  label: string;
  /** Data points */
  data: number[];
  /** Optional series color */
  color?: string;
}

export interface LineChartProps {
  /** X-axis labels */
  labels: string[];
  /** Series data */
  series: LineSeries[];
  /** Chart height in px */
  height?: number;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show x-axis labels */
  showLabels?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Show data points */
  showPoints?: boolean;
  sx?: SxProps<Theme>;
}

export function LineChart({
  labels,
  series,
  height = 200,
  showGrid = true,
  showLabels = true,
  showLegend = true,
  showPoints = false,
  sx,
}: LineChartProps) {
  const theme = useTheme();
  const gradientId = useId();

  if (series.length === 0 || labels.length === 0) {
    return <Box sx={{ height, ...sx }} />;
  }

  const allValues = series.flatMap((s) => s.data);
  const min = Math.min(...allValues, 0);
  const max = Math.max(...allValues, 1);
  const range = max - min || 1;

  const padX = 8;
  const padTop = 10;
  const padBottom = showLabels ? 18 : 6;
  const chartW = 100 - padX * 2;
  const chartH = height - padTop - padBottom;

  const xFor = (i: number) => padX + (i / Math.max(labels.length - 1, 1)) * chartW;
  const yFor = (v: number) => padTop + (1 - (v - min) / range) * chartH;

  const gridLines = 4;

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" role="img" aria-label="Line chart">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.12} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>

        {showGrid &&
          Array.from({ length: gridLines + 1 }).map((_, i) => {
            const y = padTop + (i / gridLines) * chartH;
            return (
              <line
                key={i}
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

        {series.map((s, si) => {
          const color = s.color ?? theme.palette.primary.main;
          const points = s.data.map((v, i) => [xFor(i), yFor(v)] as const);
          const linePath = points
            .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
            .join(' ');
          const areaPath = `${linePath} L${points[points.length - 1][0].toFixed(2)},${padTop + chartH} L${points[0][0].toFixed(2)},${padTop + chartH} Z`;

          return (
            <g key={si}>
              {si === 0 && <path d={areaPath} fill={`url(#${gradientId})`} />}
              <path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {showPoints &&
                points.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r={1.5} fill={color} />
                ))}
            </g>
          );
        })}

        {showLabels &&
          labels.map((label, i) => (
            <text
              key={i}
              x={xFor(i)}
              y={height - 4}
              textAnchor="middle"
              fontSize="3.5"
              fill="currentColor"
              opacity={0.6}
            >
              {label}
            </text>
          ))}
      </svg>

      {showLegend && series.length > 1 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 1 }}>
          {series.map((s, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 2,
                  borderRadius: 1,
                  bgcolor: s.color ?? theme.palette.primary.main,
                }}
              />
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
