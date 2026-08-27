/**
 * TableState — unified table state renderer
 * ==========================================
 * Renders loading, empty, error, permission-denied, no-results, partial,
 * and offline states for a data table. Centralizes the state logic so
 * pages stay declarative.
 */
import { type ReactNode } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { ShieldAlert, WifiOff } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { LoadingState } from '../ui/LoadingState';

export type TableStateKind =
  | 'loading'
  | 'empty'
  | 'error'
  | 'permission-denied'
  | 'no-results'
  | 'offline';

export interface TableStateProps {
  kind: TableStateKind;
  title?: string;
  description?: string;
  action?: ReactNode;
  onRetry?: () => void;
  /** For 'partial' — show a banner above content */
  partial?: boolean;
  partialLabel?: string;
}

export function TableState({
  kind,
  title,
  description,
  action,
  onRetry,
  partial = false,
  partialLabel = 'Showing partial data',
}: TableStateProps) {
  if (partial) {
    return (
      <Box
        sx={{
          px: 2,
          py: 0.75,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'warning.main',
          color: 'warning.contrastText',
          fontSize: '0.75rem',
          fontWeight: 500,
        }}
      >
        <Chip size="small" label={partialLabel} color="warning" variant="filled" />
      </Box>
    );
  }

  switch (kind) {
    case 'loading':
      return <LoadingState message={title ?? 'Loading...'} />;
    case 'error':
      return <ErrorState title={title} description={description} onRetry={onRetry} />;
    case 'permission-denied':
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, px: 3, textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              color: 'text.secondary',
            }}
          >
            <ShieldAlert size={28} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
            {title ?? 'You do not have access'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mb: action ? 2 : 0 }}>
            {description ?? 'Contact an administrator to request access to this data.'}
          </Typography>
          {action}
        </Box>
      );
    case 'offline':
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, px: 3, textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              color: 'text.secondary',
            }}
          >
            <WifiOff size={28} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
            {title ?? 'You appear to be offline'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mb: action ? 2 : 0 }}>
            {description ?? 'Reconnect to load the latest data. Your changes are saved locally.'}
          </Typography>
          {action}
        </Box>
      );
    case 'no-results':
      return (
        <EmptyState
          title={title ?? 'No matching results'}
          description={description ?? 'Try adjusting your search or filters.'}
          action={action}
          compact
        />
      );
    case 'empty':
    default:
      return (
        <EmptyState
          title={title ?? 'No data'}
          description={description}
          action={action}
          compact
        />
      );
  }
}
