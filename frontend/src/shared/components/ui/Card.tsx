/**
 * Card — CricketIQ Design System
 * Composable card with optional header, content, and footer.
 */
import { forwardRef, type ReactNode } from 'react';
import {
  Card as MuiCard,
  CardContent,
  CardActions,
  Box,
  Typography,
  Divider,
  type CardProps as MuiCardProps,
} from '@mui/material';

export interface CardProps extends MuiCardProps {
  /** Card title */
  title?: string;
  /** Card subtitle */
  subtitle?: string;
  /** Header action buttons */
  headerAction?: ReactNode;
  /** Card content */
  children?: ReactNode;
  /** Footer actions */
  actions?: ReactNode;
  /** Hover effect */
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      subtitle,
      headerAction,
      children,
      actions,
      hoverable = false,
      sx,
      ...props
    },
    ref
  ) => {
    return (
      <MuiCard
        ref={ref}
        sx={{
          borderRadius: (theme) => theme.spacing(1.5),
          transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          ...(hoverable && {
            cursor: 'pointer',
            '&:hover': {
              boxShadow: (theme) => theme.shadows[4],
              borderColor: 'action.hover',
            },
          }),
          ...sx,
        }}
        {...props}
      >
        {(title || headerAction) && (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2.5,
                pt: 2,
                pb: 0,
              }}
            >
              <Box>
                {title && (
                  <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography variant="caption" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
              {headerAction && <Box>{headerAction}</Box>}
            </Box>
            <Divider sx={{ mt: 1.5 }} />
          </>
        )}
        <CardContent
          sx={{
            '&:last-child': { pb: actions ? 1.5 : undefined },
          }}
        >
          {children}
        </CardContent>
        {actions && (
          <>
            <Divider />
            <CardActions sx={{ px: 2.5, py: 1.5 }}>
              {actions}
            </CardActions>
          </>
        )}
      </MuiCard>
    );
  }
);

Card.displayName = 'Card';
