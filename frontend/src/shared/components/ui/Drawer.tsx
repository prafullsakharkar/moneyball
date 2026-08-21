/**
 * Drawer — CricketIQ Design System
 * Slide-over panel for forms, details, and secondary content.
 * Mirrors StudioHub's right-side detail panels.
 */
import { forwardRef, type ReactNode } from 'react';
import {
  Drawer as MuiDrawer,
  Box,
  IconButton,
  Typography,
  Divider,
  type DrawerProps as MuiDrawerProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface DrawerProps extends Omit<MuiDrawerProps, 'title'> {
  /** Drawer title */
  title?: ReactNode;
  /** Subtitle below title */
  subtitle?: ReactNode;
  /** Close button handler — if provided, close icon is shown */
  onClose?: () => void;
  /** Drawer body */
  children?: ReactNode;
  /** Footer actions (sticky at bottom) */
  footer?: ReactNode;
  /** Drawer width */
  width?: number | string;
  /** Content padding */
  padding?: number;
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      title,
      subtitle,
      onClose,
      children,
      footer,
      width = 420,
      padding = 3,
      anchor = 'right',
      slotProps,
      ...props
    },
    ref
  ) => {
    return (
      <MuiDrawer
        ref={ref}
        anchor={anchor}
        slotProps={{
          ...slotProps,
          paper: {
            ...slotProps?.paper,
            sx: {
              width: { xs: '100%', sm: width },
              maxWidth: '100%',
              ...(slotProps?.paper as { sx?: object } | undefined)?.sx,
            },
          },
        }}
        {...props}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {(title || onClose) && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                px: padding,
                pt: padding,
                pb: subtitle ? 1 : padding,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                {title && (
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.0625rem' }}>
                    {title}
                  </Typography>
                )}
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
            </Box>
          )}
          {(title || onClose) && <Divider />}
          <Box sx={{ flex: 1, overflowY: 'auto', px: padding, py: padding }}>{children}</Box>
          {footer && (
            <>
              <Divider />
              <Box sx={{ px: padding, py: 2 }}>{footer}</Box>
            </>
          )}
        </Box>
      </MuiDrawer>
    );
  }
);

Drawer.displayName = 'Drawer';
