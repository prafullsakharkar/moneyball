/**
 * Input — CricketIQ Design System
 * Text input with consistent styling, validation, and helper text.
 */
import { forwardRef } from 'react';
import {
  TextField,
  InputLabel,
  Box,
  type TextFieldProps,
} from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant' | 'error'> {
  /** Label shown above the input */
  label?: string;
  /** Optional description text */
  description?: string;
  /** Error message — also sets error state */
  error?: string;
  /** Helper text shown below */
  helperText?: string;
  /** Left adornment content */
  startAdornment?: React.ReactNode;
  /** Right adornment content */
  endAdornment?: React.ReactNode;
}

export const Input = forwardRef<HTMLDivElement, InputProps>(
  ({ label, description, error, helperText, startAdornment, endAdornment, sx, ...props }, ref) => {
    return (
      <Box sx={{ width: '100%' }}>
        {label && (
          <InputLabel
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
            {props.required && (
              <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>
            )}
          </InputLabel>
        )}
        {description && (
          <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block', mb: 0.75 }}>
            {description}
          </Box>
        )}
        <TextField
          ref={ref}
          variant="outlined"
          error={Boolean(error)}
          helperText={error || helperText}
          slotProps={{
            input: {
              startAdornment,
              endAdornment,
            },
          }}
          sx={sx}
          {...props}
        />
      </Box>
    );
  }
);

Input.displayName = 'Input';
