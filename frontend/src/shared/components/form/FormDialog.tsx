/**
 * FormDialog — CricketIQ Design System
 * A Dialog that renders a form with loading, success, and unsaved-changes
 * states. Handles close-with-unsaved-changes confirmation.
 */
import { useRef, useState, type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { Dialog, type DialogProps } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export interface FormDialogProps extends Omit<DialogProps, 'children' | 'actions'> {
  /** Form body */
  children: ReactNode;
  /** Whether the form is currently submitting */
  submitting?: boolean;
  /** Whether the form has unsaved changes */
  dirty?: boolean;
  /** Whether the form has been successfully submitted (shows success state) */
  success?: boolean;
  /** Success title shown when success is true */
  successTitle?: string;
  /** Success description shown when success is true */
  successDescription?: string;
  /** Label for the primary submit button */
  submitLabel?: string;
  /** Label for the cancel button */
  cancelLabel?: string;
  /** Disable the submit button */
  submitDisabled?: boolean;
  /** Called when the form is submitted */
  onSubmit?: () => void;
  /** Called when the user confirms closing with unsaved changes */
  onConfirmClose?: () => void;
  /** Called when the user cancels closing (keeps dialog open) */
  onCancelClose?: () => void;
  /** Whether to show the unsaved-changes confirmation */
  confirmOnDirtyClose?: boolean;
}

export function FormDialog({
  children,
  submitting = false,
  dirty = false,
  success = false,
  successTitle = 'Saved',
  successDescription = 'Your changes have been saved.',
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  submitDisabled = false,
  onSubmit,
  onClose,
  onConfirmClose,
  onCancelClose,
  confirmOnDirtyClose = true,
  ...props
}: FormDialogProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

  const handleClose = () => {
    if (confirmOnDirtyClose && dirtyRef.current && !success) {
      setConfirmOpen(true);
      return;
    }
    onClose?.();
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    onConfirmClose?.();
  };

  const handleCancelClose = () => {
    setConfirmOpen(false);
    onCancelClose?.();
  };

  return (
    <>
      <Dialog
        {...props}
        onClose={handleClose}
        actions={
          <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={handleClose} disabled={submitting}>
              {cancelLabel}
            </Button>
            <Button
              variant="primary"
              onClick={onSubmit}
              loading={submitting}
              disabled={submitDisabled}
            >
              {submitLabel}
            </Button>
          </Box>
        }
      >
        {success ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {successTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {successDescription}
            </Typography>
          </Box>
        ) : (
          children
        )}
      </Dialog>
      <ConfirmDialog
        open={confirmOpen}
        title="Discard unsaved changes?"
        description="You have unsaved changes. Are you sure you want to close without saving?"
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        destructive
        onConfirm={handleConfirmClose}
        onClose={handleCancelClose}
      />
    </>
  );
}
