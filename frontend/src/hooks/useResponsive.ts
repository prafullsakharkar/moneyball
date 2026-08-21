/**
 * useResponsive — CricketIQ Design System
 * Centralized responsive breakpoint helpers built on MUI's useMediaQuery.
 * Provides named boolean flags for common layout decisions.
 */
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export interface ResponsiveFlags {
  /** Extra-small: < 640px (mobile) */
  isXs: boolean;
  /** Small: >= 640px */
  isSm: boolean;
  /** Medium: >= 768px */
  isMd: boolean;
  /** Large: >= 1024px */
  isLg: boolean;
  /** Extra-large: >= 1280px */
  isXl: boolean;
  /** Mobile-first convenience: below md */
  isMobile: boolean;
  /** Tablet: sm..md */
  isTablet: boolean;
  /** Desktop: >= md */
  isDesktop: boolean;
  /** Touch device (coarse pointer) */
  isTouch: boolean;
}

/**
 * Returns a set of boolean flags describing the current viewport.
 * Re-renders on breakpoint changes.
 */
export function useResponsive(): ResponsiveFlags {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));
  const isTouch = useMediaQuery('(pointer: coarse)');

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isMobile: !isMd,
    isTablet: isSm && !isMd,
    isDesktop: isMd,
    isTouch,
  };
}
