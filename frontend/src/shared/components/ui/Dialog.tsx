/**
 * Dialog — CricketIQ Design System
 * Modal dialog with consistent padding, actions, and transitions.
 */
import { forwardRef, type ReactNode } from 'react';
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { DialogProps as MuiDialogProps } from '@mui/material';

export interface DialogProps extends Omit<MuiDialogProps, 'title'> {
  /** Dialog title */
  title?: string;
  /** Subtitle below title */
  subtitle?: string;
  /** Close button handler — if provided, close icon is shown */
  onClose?: () => void;
  /** Dialog body */
  children?: ReactNode;
  /** Footer actions */
  actions?: ReactNode;
  /** Max width override */
  maxWidth?: MuiDialogProps['maxWidth'];
  /** Content padding */
  padding?: number;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ title, subtitle, onClose, children, actions, maxWidth = 'sm', padding = 3, ...props }, ref) => {
    return (
      <MuiDialog
        ref={ref}
        maxWidth={maxWidth}
        fullWidth
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: (theme) => theme.spacing(2.5),
            },
          },
        }}
        {...props}
      >
        {(title || onClose) && (
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              pb: subtitle ? 1 : 2,
              pt: padding,
              px: padding,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            {onClose && (
              <IconButton onClick={onClose} size="small" sx={{ mt: -0.5, mr: -1 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </DialogTitle>
        )}
        <DialogContent sx={{ px: padding, pt: title ? 1 : padding, pb: actions ? 2 : padding }}>
          {children}
        </DialogContent>
        {actions && (
          <DialogActions sx={{ px: padding, pb: padding, pt: 1, gap: 1 }}>
            {actions}
          </DialogActions>
        )}
      </MuiDialog>
    );
  }
);

Dialog.displayName = 'Dialog';
