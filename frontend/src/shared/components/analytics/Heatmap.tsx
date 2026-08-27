/**
 * Heatmap — CricketOS Design System
 * Lightweight grid heatmap rendered as SVG for density data
 * (e.g. runs by region, shot placement, fielding zones).
 * Self-contained (no chart library). Restrained single-hue intensity.
 */
import { Box, type SxProps, type Theme } from '@mui/material';

export interface HeatmapCell {
  /** Row label */
  row: string;
  /** Column label */
  col: string;
  /** Cell value */
  value: number;
}

export interface HeatmapProps {
  /** Row labels (y-axis) */
  rows: string[];
  /** Column labels (x-axis) */
  cols: string[];
  /** Cell values indexed [row][col] */
  values: number[][];
  /** Optional cell labels to display */
  cellLabels?: string[][];
  /** Chart height in px */
  height?: number;
  /** Color accent */
  color?: string;
  sx?: SxProps<Theme>;
}

export function Heatmap({
  rows,
  cols,
  values,
  cellLabels,
  height = 200,
  color = 'primary.main',
  sx,
}: HeatmapProps) {
  if (rows.length === 0 || cols.length === 0) {
    return <Box sx={{ height, ...sx }} />;
  }

  const allValues = values.flat();
  const max = Math.max(...allValues, 1);

  const rowLabelW = 14;
  const colLabelH = 14;
  const cellW = (100 - rowLabelW) / cols.length;
  const cellH = (height - colLabelH) / rows.length;

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" role="img" aria-label="Heatmap">
        {/* Column labels */}
        {cols.map((c, i) => (
          <text
            key={`c${i}`}
            x={rowLabelW + i * cellW + cellW / 2}
            y={colLabelH - 4}
            textAnchor="middle"
            fontSize="3.5"
            fill="currentColor"
            opacity={0.6}
          >
            {c}
          </text>
        ))}

        {/* Cells */}
        {rows.map((r, ri) => (
          <g key={`r${ri}`}>
            <text
              x={rowLabelW - 3}
              y={colLabelH + ri * cellH + cellH / 2 + 1}
              textAnchor="end"
              fontSize="3.5"
              fill="currentColor"
              opacity={0.6}
            >
              {r}
            </text>
            {cols.map((_, ci) => {
              const value = values[ri]?.[ci] ?? 0;
              const intensity = value / max;
              const fill = value > 0 ? `${color}${Math.round(20 + intensity * 60).toString(16).padStart(2, '0')}` : 'transparent';
              const label = cellLabels?.[ri]?.[ci];
              return (
                <g key={`c${ci}`}>
                  <rect
                    x={rowLabelW + ci * cellW + 0.5}
                    y={colLabelH + ri * cellH + 0.5}
                    width={cellW - 1}
                    height={cellH - 1}
                    rx={1}
                    fill={fill}
                    stroke="currentColor"
                    strokeOpacity={0.06}
                  />
                  {label !== undefined && (
                    <text
                      x={rowLabelW + ci * cellW + cellW / 2}
                      y={colLabelH + ri * cellH + cellH / 2 + 1}
                      textAnchor="middle"
                      fontSize="3.5"
                      fill="currentColor"
                      opacity={0.8}
                    >
                      {label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </Box>
  );
}
