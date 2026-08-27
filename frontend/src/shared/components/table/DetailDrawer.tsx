/**
 * DetailDrawer — contextual entity inspection drawer
 * ===================================================
 * A right-side slide-over for inspecting a single entity (player, match,
 * team) with a header, metadata grid, and contextual actions. Supports
 * loading, error, and empty states. Built on the base Drawer.
 *
 * This is the primary CRUD surface: List ↔ Detail drawer ↔ Inline edit
 * ↔ Contextual actions (per the enterprise data workspace spec).
 */
import { type ReactNode } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { Drawer } from '../ui/Drawer';
import { ErrorState } from '../ui/ErrorState';
import { LoadingState } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';

export interface DetailField {
  label: string;
  value?: ReactNode;
  /** Render as a chip */
  chip?: boolean;
  /** Numeric value — tabular numerals */
  numeric?: boolean;
  /** Full width row */
  fullWidth?: boolean;
}

export interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Entity title */
  title?: ReactNode;
  /** Subtitle (e.g. slug, id) */
  subtitle?: ReactNode;
  /** Header avatar / visual */
  avatar?: ReactNode;
  /** Status chip shown in header */
  status?: ReactNode;
  /** Fields rendered as a metadata grid */
  fields?: DetailField[];
  /** Custom body content (overrides fields) */
  children?: ReactNode;
  /** Footer actions */
  footer?: ReactNode;
  /** Drawer width */
  width?: number | string;
  /* States */
  loading?: boolean;
  error?: boolean;
  errorTitle?: string;
  errorDescription?: string;
  onRetry?: () => void;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DetailDrawer({
  open,
  onClose,
  title,
  subtitle,
  avatar,
  status,
  fields,
  children,
  footer,
  width = 440,
  loading = false,
  error = false,
  errorTitle = 'Unable to load details',
  errorDescription,
  onRetry,
  empty = false,
  emptyTitle = 'No details available',
  emptyDescription,
}: DetailDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      width={width}
      footer={footer}
    >
      {loading ? (
        <LoadingState message="Loading details..." />
      ) : error ? (
        <ErrorState title={errorTitle} description={errorDescription} onRetry={onRetry} />
      ) : empty ? (
        <EmptyState title={emptyTitle} description={emptyDescription} compact />
      ) : (
        <Box>
          {(avatar || status) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              {avatar}
              {status}
            </Box>
          )}

          {children}

          {fields && fields.length > 0 && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
              }}
            >
              {fields.map((field) => (
                <Box
                  key={field.label}
                  sx={{
                    gridColumn: field.fullWidth ? '1 / -1' : undefined,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.04em' }}
                  >
                    {field.label}
                  </Typography>
                  {field.chip ? (
                    <Chip size="small" label={field.value} />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        ...(field.numeric ? { fontVariantNumeric: 'tabular-nums' } : {}),
                      }}
                    >
                      {field.value ?? '—'}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Drawer>
  );
}
