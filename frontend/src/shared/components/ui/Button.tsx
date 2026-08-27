/**
 * Button — CricketIQ Design System
 * Unified button with consistent variants, sizes, and loading states.
 */
import { forwardRef } from 'react';
import {
  Button as MuiButton,
  CircularProgress,
  type ButtonProps as MuiButtonProps,
} from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'color' | 'variant'> {
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  /** Show loading spinner and disable */
  loading?: boolean;
}

const variantMuiMap: Record<string, MuiButtonProps['variant']> = {
  primary: 'contained',
  secondary: 'outlined',
  ghost: 'text',
  danger: 'outlined',
  success: 'outlined',
};

const colorMuiMap: Record<string, MuiButtonProps['color']> = {
  primary: 'primary',
  secondary: 'primary',
  ghost: 'inherit',
  danger: 'error',
  success: 'success',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      loading = false,
      disabled,
      children,
      sx,
      ...props
    },
    ref
  ) => {
    return (
      <MuiButton
        ref={ref}
        variant={variantMuiMap[variant] ?? 'contained'}
        color={colorMuiMap[variant] ?? 'primary'}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        startIcon={loading ? <CircularProgress size={14} color="inherit" aria-hidden="true" /> : props.startIcon}
        sx={sx}
        {...props}
      >
        {children}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';
