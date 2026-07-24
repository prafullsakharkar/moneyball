// React hook for responsive design breakpoints

import { useState, useEffect, useCallback } from 'react';

// Breakpoint definitions
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface BreakpointValues {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
}

export interface UseBreakpointOptions {
  values?: BreakpointValues;
  defaultValue?: Breakpoint;
}

// Default Tailwind-style breakpoints
const DEFAULT_BREAKPOINTS: BreakpointValues = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
};

/**
 * Get current breakpoint name based on window width
 */
export function getCurrentBreakpoint(width: number, values: BreakpointValues): Breakpoint {
  const breakpoints = Object.entries(values).sort((a, b) => b[1] - a[1]);
  
  for (const [breakpoint, minWidth] of breakpoints) {
    if (width >= minWidth) {
      return breakpoint as Breakpoint;
    }
  }
  
  return 'xs';
}

/**
 * Custom hook for responsive design breakpoints
 * Returns current breakpoint and helper methods for conditional rendering
 */
export function useBreakpoint(options: UseBreakpointOptions = {}): {
  breakpoint: Breakpoint;
  width: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLaptop: boolean;
  isWide: boolean;
  matches: (bp: Breakpoint | Breakpoint[]) => boolean;
  min: (bp: Breakpoint) => boolean;
  max: (bp: Breakpoint) => boolean;
} {
  const { values = DEFAULT_BREAKPOINTS, defaultValue = 'xs' } = options;
  
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(defaultValue);
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = (): void => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    
    // Initial width
    setWidth(window.innerWidth);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update breakpoint when width changes
  useEffect(() => {
    setBreakpoint(getCurrentBreakpoint(width, values));
  }, [width, values]);

  // Breakpoint helper methods
  const matches = useCallback(
    (bp: Breakpoint | Breakpoint[]): boolean => {
      const breakpoints = Array.isArray(bp) ? bp : [bp];
      return breakpoints.includes(breakpoint);
    },
    [breakpoint]
  );

  const min = useCallback(
    (bp: Breakpoint): boolean => {
      return width >= (values[bp] ?? 0);
    },
    [width, values]
  );

  const max = useCallback(
    (bp: Breakpoint): boolean => {
      return width < (values[bp as keyof BreakpointValues] ?? Infinity);
    },
    [values]
  );

  // Convenience properties
  const isMobile = matches(['xs', 'sm']);
  const isTablet = matches(['sm', 'md']);
  const isDesktop = matches(['md', 'lg', 'xl', '2xl', '3xl']);
  const isLaptop = matches(['lg', 'xl']);
  const isWide = matches(['xl', '2xl', '3xl']);

  return {
    breakpoint,
    width,
    isMobile,
    isTablet,
    isDesktop,
    isLaptop,
    isWide,
    matches,
    min,
    max,
  };
}

/**
 * Custom hook to check if we're on mobile
 */
export function useIsMobile(): boolean {
  const { isMobile } = useBreakpoint();
  return isMobile;
}

/**
 * Custom hook to check if we're on desktop
 */
export function useIsDesktop(): boolean {
  const { isDesktop } = useBreakpoint();
  return isDesktop;
}

/**
 * Custom hook to get matching breakpoints
 */
export function useBreakpoints(): {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  '2xl': boolean;
  '3xl': boolean;
} {
  const { breakpoint, matches, min } = useBreakpoint();

  return {
    xs: matches('xs'),
    sm: matches('sm'),
    md: matches('md'),
    lg: matches('lg'),
    xl: matches('xl'),
    '2xl': matches('2xl'),
    '3xl': matches('3xl'),
  };
}

/**
 * Custom hook for responsive state
 */
export interface ResponsiveState<T> {
  xs: T;
  sm: T;
  md: T;
  lg: T;
  xl: T;
  '2xl': T;
  '3xl': T;
}

/**
 * Custom hook to get responsive values
 * Usage: const value = useResponsiveValue({ xs: 10, sm: 20, md: 30 })
 */
export function useResponsiveValue<T>(values: ResponsiveState<T>): T {
  const { breakpoint } = useBreakpoint();
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
  
  // Find the largest breakpoint that is less than or equal to current
  const matchingBreakpoint = breakpointOrder.find((bp) => matches(bp, breakpoint)) || 'xs';
  
  return values[matchingBreakpoint] ?? values.xs;
}

function matches(bp: Breakpoint, current: Breakpoint): boolean {
  const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
  const currentIndex = order.indexOf(current);
  const bpIndex = order.indexOf(bp);
  return bpIndex <= currentIndex;
}