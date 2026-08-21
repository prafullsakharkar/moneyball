/**
 * FormIndicator — CricketOS Design System
 * Recent form display (e.g., W, D, L, W, W) with color-coded results.
 */
import { Box, Tooltip, useTheme, type SxProps, type Theme } from '@mui/material';

export type FormResult = 'W' | 'L' | 'D' | 'T' | 'NR';

export interface FormIndicatorProps {
  /** Array of recent results */
  results: FormResult[];
  /** Show last N results */
  last?: number;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  sx?: SxProps<Theme>;
}

export function FormIndicator({ results, last = 5, size = 'md', sx }: FormIndicatorProps) {
  const theme = useTheme();
  const { palette } = theme;

  const resultConfig: Record<FormResult, { color: string; bg: string; label: string }> = {
    W: { color: '#FFFFFF', bg: palette.success.main, label: 'Won' },
    L: { color: '#FFFFFF', bg: palette.error.main, label: 'Lost' },
    D: { color: palette.text.secondary, bg: palette.action.hover, label: 'Draw' },
    T: { color: '#FFFFFF', bg: palette.warning.main, label: 'Tie' },
    NR: { color: palette.text.disabled, bg: palette.action.hover, label: 'No Result' },
  };

  const recent = results.slice(-last);
  const sizeMap = {
    sm: { dot: 18, fontSize: '0.5625rem', gap: 0.25 },
    md: { dot: 22, fontSize: '0.625rem', gap: 0.5 },
    lg: { dot: 28, fontSize: '0.75rem', gap: 0.5 },
  };

  const s = sizeMap[size];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: s.gap, ...sx }}>
      {recent.map((result, i) => {
        const config = resultConfig[result];
        return (
          <Tooltip key={i} title={config.label} arrow placement="top">
            <Box
              sx={{
                width: s.dot,
                height: s.dot,
                borderRadius: '50%',
                bgcolor: config.bg,
                color: config.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: s.fontSize,
                fontWeight: 700,
                lineHeight: 1,
                transition: 'transform 100ms ease',
                cursor: 'default',
                '&:hover': { transform: 'scale(1.15)' },
              }}
            >
              {result}
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}
