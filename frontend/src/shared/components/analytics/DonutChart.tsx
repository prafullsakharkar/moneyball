/**
 * DonutChart — CricketIQ Design System
 * Lightweight donut chart rendered as SVG for distribution data
 * (e.g. runs by batsman, wickets by bowler, overs by format).
 * Self-contained (no chart library) to keep the design system decoupled.
 */
import { Box, Typography, type SxProps, type Theme } from '@mui/material';

export interface DonutSegment {
  /** Segment label */
  label: string;
  /** Segment value */
  value: number;
  /** Optional segment color */
  color?: string;
}

export interface DonutChartProps {
  /** Data segments */
  data: DonutSegment[];
  /** Chart size in px (diameter) */
  size?: number;
  /** Ring thickness in px */
  thickness?: number;
  /** Center label */
  centerLabel?: string;
  /** Center value */
  centerValue?: string | number;
  /** Show legend below the chart */
  showLegend?: boolean;
  /** Default segment color */
  color?: string;
  sx?: SxProps<Theme>;
}

/** Convert a fraction (0..1) to an SVG arc path. */
function arcPath(cx: number, cy: number, r: number, start: number, end: number): string {
  const largeArc = end - start > 0.5 ? 1 : 0;
  const x1 = cx + r * Math.cos(2 * Math.PI * start);
  const y1 = cy + r * Math.sin(2 * Math.PI * start);
  const x2 = cx + r * Math.cos(2 * Math.PI * end);
  const y2 = cy + r * Math.sin(2 * Math.PI * end);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

export function DonutChart({
  data,
  size = 120,
  thickness = 14,
  centerLabel,
  centerValue,
  showLegend = true,
  color = 'primary.main',
  sx,
}: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;

  if (total <= 0) {
    return <Box sx={{ width: size, height: size, ...sx }} />;
  }

  let cursor = 0;
  const segments = data.map((d) => {
    const start = cursor;
    const end = cursor + d.value / total;
    cursor = end;
    return { ...d, start, end };
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, ...sx }}>
      <Box sx={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Donut chart">
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="currentColor" strokeOpacity={0.08} strokeWidth={thickness} />
          {segments.map((seg, i) => (
            <path
              key={i}
              d={arcPath(cx, cy, radius, seg.start, seg.end)}
              fill="none"
              stroke={seg.color ?? color}
              strokeWidth={thickness}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        {(centerValue !== undefined || centerLabel) && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {centerValue !== undefined && (
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                {centerValue}
              </Typography>
            )}
            {centerLabel && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {centerLabel}
              </Typography>
            )}
          </Box>
        )}
      </Box>
      {showLegend && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
          {segments.map((seg, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: seg.color ?? color }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {seg.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
