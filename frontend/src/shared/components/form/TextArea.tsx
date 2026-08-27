/**
 * TextArea — CricketIQ Design System
 * Multi-line text input with consistent label, description, and validation.
 */
import { forwardRef } from 'react';
import { TextField, InputLabel, Box, type TextFieldProps } from '@mui/material';

export interface TextAreaProps extends Omit<TextFieldProps, 'variant' | 'error' | 'multiline'> {
  /** Label shown above the textarea */
  label?: string;
  /** Optional description text */
  description?: string;
  /** Error message — also sets error state */
  error?: string;
  /** Helper text shown below */
  helperText?: string;
  /** Minimum number of rows */
  minRows?: number;
  /** Maximum number of rows before scrolling */
  maxRows?: number;
}

export const TextArea = forwardRef<HTMLDivElement, TextAreaProps>(
  (
    { label, description, error, helperText, minRows = 3, maxRows, required, id, sx, ...props },
    ref
  ) => {
    const hasError = Boolean(error);
    const textareaId = id ?? (label ? `cq-textarea-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    return (
      <Box sx={{ width: '100%' }}>
        {label && (
          <InputLabel
            htmlFor={textareaId}
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
        <TextField
          ref={ref}
          id={textareaId}
          variant="outlined"
          multiline
          minRows={minRows}
          maxRows={maxRows}
          fullWidth
          error={hasError}
          helperText={error || helperText}
          sx={sx}
          {...props}
        />
      </Box>
    );
  }
);

TextArea.displayName = 'TextArea';
