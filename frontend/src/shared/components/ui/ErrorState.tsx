/**
 * ErrorState — CricketIQ Design System
 * Error display with retry action.
 */
import { type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { Button } from './Button';

export interface ErrorStateProps {
  /** Error title */
  title?: string;
  /** Error description */
  description?: string;
  /** Error object */
  error?: Error | null;
  /** Retry callback */
  onRetry?: () => void;
  /** Custom action */
  action?: ReactNode;
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  error,
  onRetry,
  action,
}: ErrorStateProps) {
  return (
    <Box
      role="alert"
      aria-live="assertive"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 3,
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'error.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ color: 'error.main' }}>!</Typography>
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mb: action || onRetry ? 2 : 0 }}>
        {description || error?.message || 'An unexpected error occurred. Please try again.'}
      </Typography>
      {action || (onRetry && (
        <Button variant="secondary" onClick={onRetry} size="small">
          Try Again
        </Button>
      ))}
    </Box>
  );
}
