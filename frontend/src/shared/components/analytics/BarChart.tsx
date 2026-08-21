/**
 * BarChart — CricketIQ Design System
 * Lightweight vertical bar chart rendered as SVG.
 * Self-contained (no chart library) to keep the design system decoupled.
 */
import { useId } from 'react';
import { Box, Typography, type SxProps, type Theme } from '@mui/material';

export interface BarDatum {
  /** Bar label */
  label: string;
  /** Bar value */
  value: number;
  /** Optional bar color */
  color?: string;
}

export interface BarChartProps {
  /** Data */
  data: BarDatum[];
  /** Chart height in px */
  height?: number;
  /** Default bar color */
  color?: string;
  /** Show value labels above bars */
  showValues?: boolean;
  /** Show x-axis labels */
  showLabels?: boolean;
  sx?: SxProps<Theme>;
}

export function BarChart({
  data,
  height = 160,
  color = 'primary.main',
  showValues = false,
  showLabels = true,
  sx,
}: BarChartProps) {
  const gradientId = useId();

  if (data.length === 0) {
    return <Box sx={{ height, ...sx }} />;
  }

  const max = Math.max(...data.map((d) => d.value), 1);
  const barGap = 4;
  const labelSpace = showLabels ? 18 : 0;
  const valueSpace = showValues ? 14 : 0;
  const chartHeight = height - labelSpace - valueSpace;
  const barWidth = Math.max(4, (100 / data.length) - barGap);

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" role="img" aria-label="Bar chart">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.9} />
            <stop offset="100%" stopColor={color} stopOpacity={0.5} />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const barHeight = (d.value / max) * chartHeight;
          const x = i * (100 / data.length) + barGap / 2;
          const y = valueSpace + (chartHeight - barHeight);
          const fill = d.color ?? `url(#${gradientId})`;
          return (
            <g key={i}>
              {showValues && (
                <text
                  x={x + barWidth / 2}
                  y={valueSpace - 3}
                  textAnchor="middle"
                  fontSize="4"
                  fill="currentColor"
                  opacity={0.7}
                >
                  {d.value}
                </text>
              )}
              <rect x={x} y={y} width={barWidth} height={barHeight} rx="1" fill={fill} />
              {showLabels && (
                <text
                  x={x + barWidth / 2}
                  y={height - 4}
                  textAnchor="middle"
                  fontSize="3.5"
                  fill="currentColor"
                  opacity={0.6}
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {showLabels && (
        <Box sx={{ display: 'none' }}>
          {data.map((d) => (
            <Typography key={d.label} variant="caption">
              {d.label}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}
