/**
 * FormActions — CricketIQ Design System
 * Right-aligned action bar for form submit/cancel buttons.
 * Mirrors StudioHub's compact, right-aligned form footers.
 */
import { forwardRef, type ReactNode } from 'react';
import { Box, Divider, type BoxProps } from '@mui/material';

export interface FormActionsProps extends Omit<BoxProps, 'title'> {
  /** Left-aligned content (e.g. "Cancel") */
  left?: ReactNode;
  /** Right-aligned content (e.g. "Save") */
  right?: ReactNode;
  /** Show a divider above the actions */
  divider?: boolean;
  /** Sticky footer at the bottom of a scrollable form */
  sticky?: boolean;
}

export const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(
  ({ left, right, divider = true, sticky = false, sx, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          pt: 2,
          mt: 2,
          ...(sticky && {
            position: 'sticky',
            bottom: 0,
            bgcolor: 'background.paper',
            zIndex: 1,
          }),
          ...sx,
        }}
        {...props}
      >
        {divider && <Divider sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
        <Box sx={{ display: 'flex', gap: 1 }}>{left}</Box>
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>{right}</Box>
      </Box>
    );
  }
);

FormActions.displayName = 'FormActions';
