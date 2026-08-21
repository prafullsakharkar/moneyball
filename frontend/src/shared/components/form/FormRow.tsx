/**
 * FormRow — CricketIQ Design System
 * Responsive grid row for laying out multiple form fields side-by-side.
 * Collapses to a single column on small screens.
 */
import { forwardRef } from 'react';
import { Box, type BoxProps } from '@mui/material';

export interface FormRowProps extends Omit<BoxProps, 'title'> {
  /** Number of columns on md+ screens (1-4). Defaults to auto-fit. */
  columns?: 1 | 2 | 3 | 4;
  /** Gap between fields */
  gap?: number;
}

export const FormRow = forwardRef<HTMLDivElement, FormRowProps>(
  ({ columns, gap = 2, sx, children, ...props }, ref) => {
    const gridTemplateColumns =
      columns === 1
        ? '1fr'
        : columns === 2
          ? { xs: '1fr', sm: 'repeat(2, 1fr)' }
          : columns === 3
            ? { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }
            : columns === 4
              ? { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }
              : { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' };

    return (
      <Box
        ref={ref}
        sx={{
          display: 'grid',
          gridTemplateColumns,
          gap,
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

FormRow.displayName = 'FormRow';
