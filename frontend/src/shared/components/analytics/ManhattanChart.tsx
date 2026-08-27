/**
 * ManhattanChart — CricketOS Design System
 * Run-rate visualization (runs per over) rendered as SVG.
 * Self-contained (no chart library). Restrained colors.
 */
import { Box, useTheme, type SxProps, type Theme } from '@mui/material';

export interface ManhattanBar {
  /** Over number */
  over: number;
  /** Runs scored in the over */
  runs: number;
  /** Wickets in the over */
  wickets?: number;
}

export interface ManhattanChartProps {
  /** Data per over */
  data: ManhattanBar[];
  /** Chart height in px */
  height?: number;
  /** Show value labels */
  showValues?: boolean;
  /** Show x-axis labels */
  showLabels?: boolean;
  sx?: SxProps<Theme>;
}

export function ManhattanChart({
  data,
  height = 180,
  showValues = false,
  showLabels = true,
  sx,
}: ManhattanChartProps) {
  const theme = useTheme();

  if (data.length === 0) {
    return <Box sx={{ height, ...sx }} />;
  }

  const max = Math.max(...data.map((d) => d.runs), 1);
  const padX = 8;
  const padTop = 10;
  const padBottom = showLabels ? 16 : 6;
  const chartW = 100 - padX * 2;
  const chartH = height - padTop - padBottom;
  const barW = Math.max(2, chartW / data.length - 1);

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" role="img" aria-label="Manhattan chart">
        {data.map((d, i) => {
          const barH = (d.runs / max) * chartH;
          const x = padX + i * (chartW / data.length);
          const y = padTop + (chartH - barH);
          const color = d.wickets ? theme.palette.error.main : theme.palette.primary.main;
          return (
            <g key={i}>
              {showValues && (
                <text x={x + barW / 2} y={y - 2} textAnchor="middle" fontSize="3.5" fill="currentColor" opacity={0.7}>
                  {d.runs}
                </text>
              )}
              <rect x={x} y={y} width={barW} height={barH} rx={0.5} fill={color} fillOpacity={d.wickets ? 0.9 : 0.75} />
              {showLabels && (
                <text x={x + barW / 2} y={height - 3} textAnchor="middle" fontSize="3" fill="currentColor" opacity={0.5}>
                  {d.over}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </Box>
  );
}
