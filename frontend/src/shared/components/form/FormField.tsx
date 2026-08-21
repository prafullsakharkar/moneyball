/**
 * FormField — CricketIQ Design System
 * Wrapper that provides consistent label, description, error, and helper text
 * around any form control. Mirrors StudioHub's compact, labeled form fields.
 */
import { forwardRef, type ReactNode } from 'react';
import { Box, InputLabel, type BoxProps } from '@mui/material';

export interface FormFieldProps extends Omit<BoxProps, 'title'> {
  /** Label shown above the control */
  label?: ReactNode;
  /** Optional description text */
  description?: ReactNode;
  /** Error message — also sets error state */
  error?: ReactNode;
  /** Helper text shown below (when no error) */
  helperText?: ReactNode;
  /** Mark the field as required (shows asterisk) */
  required?: boolean;
  /** The form control itself */
  children: ReactNode;
  /** Unique id for the control (used for label association) */
  htmlFor?: string;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, description, error, helperText, required, children, htmlFor, sx, ...props }, ref) => {
    const hasError = Boolean(error);
    return (
      <Box ref={ref} sx={{ width: '100%', ...sx }} {...props}>
        {label && (
          <InputLabel
            htmlFor={htmlFor}
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'text.primary',
              position: 'relative',
              transform: 'none',
              mb: 0.5,
            }}
          >
            {label}
            {required && (
              <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
                *
              </Box>
            )}
          </InputLabel>
        )}
        {description && (
          <Box
            component="span"
            sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block', mb: 0.75 }}
          >
            {description}
          </Box>
        )}
        {children}
        {(hasError || helperText) && (
          <Box
            component="span"
            sx={{
              fontSize: '0.75rem',
              display: 'block',
              mt: 0.5,
              color: hasError ? 'error.main' : 'text.secondary',
            }}
          >
            {error || helperText}
          </Box>
        )}
      </Box>
    );
  }
);

FormField.displayName = 'FormField';
