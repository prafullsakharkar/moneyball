/**
 * Sparkline — CricketIQ Design System
 * Lightweight inline trend chart rendered as SVG.
 * Self-contained (no chart library) to keep the design system decoupled.
 */
import { useId } from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';

export interface SparklineProps {
  /** Data points */
  data: number[];
  /** Chart color */
  color?: string;
  /** Width in px */
  width?: number;
  /** Height in px */
  height?: number;
  /** Show area fill under the line */
  fill?: boolean;
  /** Stroke width */
  strokeWidth?: number;
  sx?: SxProps<Theme>;
}

export function Sparkline({
  data,
  color = 'primary.main',
  width = 120,
  height = 32,
  fill = true,
  strokeWidth = 1.5,
  sx,
}: SparklineProps) {
  const gradientId = useId();

  if (data.length < 2) {
    return <Box sx={{ width, height, ...sx }} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;

  const points = data.map((value, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (value - min) / range) * (height - pad * 2);
    return [x, y] as const;
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1][0].toFixed(1)},${height} L${points[0][0].toFixed(1)},${height} Z`;

  return (
    <Box sx={{ width, height, display: 'block', ...sx }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {fill && <path d={areaPath} fill={`url(#${gradientId})`} />}
        <path d={linePath} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Box>
  );
}
