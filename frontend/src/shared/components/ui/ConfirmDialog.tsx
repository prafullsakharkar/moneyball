/**
 * ConfirmDialog — CricketIQ Design System
 * Confirmation modal for destructive or important actions.
 */
import { Dialog } from './Dialog';
import { Button } from './Button';
import { Typography, Box } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Use danger variant */
  destructive?: boolean;
  /** Loading state */
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="xs"
      padding={3}
      actions={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading} size="small">
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            size="small"
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {destructive && (
        <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'flex-start' }}>
          <WarningAmberIcon sx={{ color: 'warning.main', fontSize: 20, mt: 0.25 }} />
          <Box>
            {description && (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}
          </Box>
        </Box>
      )}
      {!destructive && description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </Dialog>
  );
}
