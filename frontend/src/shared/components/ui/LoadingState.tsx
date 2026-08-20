/**
 * LoadingState — CricketIQ Design System
 * Consistent loading indicator for pages, sections, and inline content.
 */
import { Box, CircularProgress, Typography, type SxProps, type Theme } from '@mui/material';

export interface LoadingStateProps {
  /** Loading message */
  message?: string;
  /** Show as full-page loader */
  fullPage?: boolean;
  /** Size of the spinner */
  size?: number;
  sx?: SxProps<Theme>;
}

export function LoadingState({
  message = 'Loading...',
  fullPage = false,
  size = 32,
  sx,
}: LoadingStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        py: fullPage ? 12 : 4,
        ...(fullPage && {
          position: 'fixed',
          inset: 0,
          bgcolor: 'background.default',
          zIndex: (theme: Theme) => theme.zIndex.modal + 1,
        }),
        ...sx,
      }}
    >
      <CircularProgress size={size} thickness={3} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}

/**
 * Skeleton — Loading placeholder for content.
 */
export function Skeleton({
  width = '100%',
  height = 20,
  variant = 'rectangular',
  sx,
}: {
  width?: number | string;
  height?: number | string;
  variant?: 'rectangular' | 'circular' | 'text';
  sx?: SxProps<Theme>;
}) {
  return (
    <Box
      sx={{
        width,
        height,
        borderRadius: variant === 'circular' ? '50%' : variant === 'text' ? 1 : 0.5,
        bgcolor: 'action.hover',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        '@keyframes pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        ...sx,
      }}
    />
  );
}
