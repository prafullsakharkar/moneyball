/**
 * EmptyState — CricketIQ Design System
 * Shown when a list, table, or section has no data.
 */
import { type ReactNode } from 'react';
import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import InboxIcon from '@mui/icons-material/InboxOutlined';

export interface EmptyStateProps {
  /** Icon component */
  icon?: ReactNode;
  /** Title text */
  title: string;
  /** Description */
  description?: string;
  /** Action buttons */
  action?: ReactNode;
  /** Compact mode */
  compact?: boolean;
  sx?: SxProps<Theme>;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  compact = false,
  sx,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: compact ? 4 : 8,
        px: 3,
        ...sx,
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: compact ? 48 : 64,
          height: compact ? 48 : 64,
          borderRadius: '50%',
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          color: 'text.secondary',
        }}
      >
        {icon || <InboxIcon sx={{ fontSize: compact ? 24 : 32 }} />}
      </Box>
      <Typography
        variant={compact ? 'body1' : 'h6'}
        sx={{
          fontWeight: 500,
          mb: description ? 0.5 : 0,
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, mb: action ? 2 : 0 }}>
          {description}
        </Typography>
      )}
      {action && <Box>{action}</Box>}
    </Box>
  );
}
