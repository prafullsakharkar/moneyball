/**
 * Switch — CricketIQ Design System
 * Toggle switch with label, description, and optional error.
 */
import { forwardRef, type ReactNode } from 'react';
import {
  Switch as MuiSwitch,
  FormControlLabel,
  Box,
  type SwitchProps as MuiSwitchProps,
} from '@mui/material';

export interface SwitchProps extends Omit<MuiSwitchProps, 'title'> {
  /** Label shown next to the switch */
  label?: ReactNode;
  /** Optional description text */
  description?: ReactNode;
  /** Error message */
  error?: ReactNode;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ label, description, error, sx, ...props }, ref) => {
    const hasError = Boolean(error);
    return (
      <Box sx={{ width: '100%', ...sx }}>
        <FormControlLabel
          control={<MuiSwitch ref={ref} size="small" {...props} />}
          label={
            <Box>
              {label && (
                <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                  {label}
                </Box>
              )}
              {description && (
                <Box
                  component="span"
                  sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}
                >
                  {description}
                </Box>
              )}
            </Box>
          }
          sx={{ alignItems: 'flex-start', m: 0 }}
        />
        {hasError && (
          <Box component="span" sx={{ fontSize: '0.75rem', color: 'error.main', display: 'block', mt: 0.5 }}>
            {error}
          </Box>
        )}
      </Box>
    );
  }
);

Switch.displayName = 'Switch';
