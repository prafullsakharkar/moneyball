// Shared hooks exports

// Data fetching and state management
export * from './useApi';
export * from './useAuth';
export * from './useDebounce';
export * from './useLocalStorage';

// Theme and UI
export * from './useTheme';
export * from './useToast';
export * from './useScroll';
export * from './useBreakpoint';

// Interaction and accessibility
export * from './useClickOutside';
export * from './useFocusTrap';

// Re-export all hooks for convenience
export { useTheme, useIsDarkMode, useThemeClassnames } from './useTheme';
export { useToast, useToastAtPosition, useToastWithDuration, useToastBatch } from './useToast';
export { useScroll, useElementScroll, useScrollToTop, useScrollThreshold, useInfiniteScroll } from './useScroll';
export {
  useBreakpoint,
  useIsMobile,
  useIsDesktop,
  useBreakpoints,
  useResponsiveValue,
  Breakpoint,
} from './useBreakpoint';
export {
  useClickOutside,
  useModalClickOutside,
  useDropdownClickOutside,
  useToastClickOutside,
  useMenuClickOutside,
  useClickOutsideMultiple,
} from './useClickOutside';
export {
  useFocusTrap,
  useModalFocusTrap,
  useDropdownFocusTrap,
  useToastFocusTrap,
  useCustomFocusTrap,
  isFocusable,
  getFocusableElements,
  getFirstFocusable,
  getLastFocusable,
} from './useFocusTrap';