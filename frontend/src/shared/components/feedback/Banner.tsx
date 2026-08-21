/**
 * Banner — CricketIQ Design System
 * ============================================
 * Inline, dismissible feedback banner for page-level notices.
 * Tones: info | success | warning | error.
 */
import { type ReactNode } from 'react';
import { Box, IconButton, Typography, type SxProps, type Theme } from '@mui/material';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@utils/cn';

export type BannerTone = 'info' | 'success' | 'warning' | 'error';

export interface BannerProps {
  tone?: BannerTone;
  title?: ReactNode;
  children?: ReactNode;
  /** Show dismiss button */
  onDismiss?: () => void;
  className?: string;
  sx?: SxProps<Theme>;
}

const toneIcon: Record<BannerTone, ReactNode> = {
  info: <Info size={18} />,
  success: <CheckCircle2 size={18} />,
  warning: <AlertTriangle size={18} />,
  error: <XCircle size={18} />,
};

const toneBg: Record<BannerTone, string> = {
  info: 'info.light',
  success: 'success.light',
  warning: 'warning.light',
  error: 'error.light',
};

const toneColor: Record<BannerTone, string> = {
  info: 'info.main',
  success: 'success.main',
  warning: 'warning.main',
  error: 'error.main',
};

export function Banner({
  tone = 'info',
  title,
  children,
  onDismiss,
  className,
  sx,
}: BannerProps) {
  return (
    <Box
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('cricket-banner', className)}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        bgcolor: toneBg[tone],
        border: '1px solid',
        borderColor: 'divider',
        ...sx,
      }}
    >
      <Box sx={{ color: toneColor[tone], mt: 0.25, flexShrink: 0 }}>{toneIcon[tone]}</Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {title && (
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
            {title}
          </Typography>
        )}
        {children && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: title ? 0.25 : 0 }}>
            {children}
          </Typography>
        )}
      </Box>
      {onDismiss && (
        <IconButton
          size="small"
          onClick={onDismiss}
          aria-label="Dismiss"
          sx={{ mt: -0.5, mr: -0.5, color: 'text.secondary' }}
        >
          <X size={16} />
        </IconButton>
      )}
    </Box>
  );
}
