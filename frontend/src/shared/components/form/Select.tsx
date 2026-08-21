/**
 * Select — CricketIQ Design System
 * Dense, labeled select with consistent styling and validation.
 */
import { forwardRef, type ReactNode } from 'react';
import {
  Select as MuiSelect,
  MenuItem,
  InputLabel,
  Box,
  type SelectProps as MuiSelectProps,
} from '@mui/material';

export interface SelectOption {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<MuiSelectProps, 'variant' | 'error' | 'label'> {
  /** Label shown above the select */
  label?: string;
  /** Optional description text */
  description?: string;
  /** Error message — also sets error state */
  error?: string;
  /** Helper text shown below */
  helperText?: string;
  /** Options to render */
  options?: SelectOption[];
  /** Placeholder shown when no value selected */
  placeholder?: string;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      description,
      error,
      helperText,
      options,
      placeholder,
      required,
      sx,
      children,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);
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
        <MuiSelect
          ref={ref}
          variant="outlined"
          size="small"
          fullWidth
          error={hasError}
          displayEmpty={Boolean(placeholder)}
          renderValue={
            placeholder && props.value === ''
              ? () => <Box sx={{ color: 'text.disabled' }}>{placeholder}</Box>
              : undefined
          }
          sx={sx}
          {...props}
        >
          {options?.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </MenuItem>
          ))}
          {children}
        </MuiSelect>
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

Select.displayName = 'Select';
