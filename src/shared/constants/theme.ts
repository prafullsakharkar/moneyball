// Theme configuration constants

/**
 * Theme color palettes
 */
export const COLORS = {
  /**
   * Primary colors
   */
  primary: {
    main: '#000080',
    light: '#1919A6',
    dark: '#000060',
    contrastText: '#ffffff',
  },
  
  /**
   * Secondary colors
   */
  secondary: {
    main: '#00BFFF',
    light: '#87CEFA',
    dark: '#009ACF',
    contrastText: '#ffffff',
  },
  
  /**
   * Success colors
   */
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
    contrastText: '#ffffff',
  },
  
  /**
   * Error colors
   */
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
    contrastText: '#ffffff',
  },
  
  /**
   * Warning colors
   */
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: '#ffffff',
  },
  
  /**
   * Info colors
   */
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
    contrastText: '#ffffff',
  },
  
  /**
   * Text colors
   */
  text: {
    primary: '#1A1A2E',
    secondary: '#666666',
    disabled: '#999999',
    inverse: '#ffffff',
  },
  
  /**
   * Background colors
   */
  background: {
    default: '#F5F5F5',
    paper: '#ffffff',
    dark: '#121212',
    surface: '#1E1E1E',
  },
  
  /**
   * Border colors
   */
  border: {
    main: '#E0E0E0',
    dark: '#B0B0B0',
    light: '#F0F0F0',
  },
  
  /**
   * Cricket pitch colors
   */
  cricket: {
    pitch: '#F5F5DC',
    crease: '#ffffff',
    boundary: '#FF0000',
    wicket: '#8B4513',
  },
  
  /**
   * Player positions colors
   */
  positions: {
    batsman: '#FF6B6B',
    bowler: '#4ECDC4',
    allrounder: '#FFE66D',
    wicketkeeper: '#1A535C',
  },
} as const;

/**
 * Theme spacing
 */
export const SPACING = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  huge: 96,
} as const;

/**
 * Theme breakpoints
 */
export const BREAKPOINTS = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1440,
} as const;

/**
 * Theme shadow
 */
export const SHADOWS = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.03)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.05), 0 10px 10px rgba(0, 0, 0, 0.03)',
  xxl: '0 25px 50px rgba(0, 0, 0, 0.1)',
} as const;

/**
 * Theme border radius
 */
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

/**
 * Theme z-index
 */
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

/**
 * Theme transitions
 */
export const TRANSITIONS = {
  fast: '150ms ease-in-out',
  normal: '300ms ease-in-out',
  slow: '500ms ease-in-out',
} as const;

/**
 * Theme typography
 */
export const TYPOGRAPHY = {
  /**
   * Font families
   */
  fontFamily: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    monospace: '"Roboto Mono", "Courier New", monospace',
    cricket: '"Georgia", serif',
  },
  
  /**
   * Font sizes
   */
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
  },
  
  /**
   * Font weights
   */
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  /**
   * Line heights
   */
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

/**
 * Theme layout
 */
export const LAYOUT = {
  /**
   * Header height
   */
  headerHeight: 64,
  
  /**
   * Sidebar width
   */
  sidebarWidth: 260,
  
  /**
   * Footer height
   */
  footerHeight: 80,
  
  /**
   * Content max width
   */
  contentMaxWidth: 1280,
  
  /**
   * Card padding
   */
  cardPadding: SPACING.lg,
} as const;

/**
 * Theme animation
 */
export const ANIMATION = {
  /**
   * Fade in
   */
  fadeIn: {
    animation: 'fadeIn 0.3s ease-in-out',
    '@keyframes fadeIn': {
      from: { opacity: '0' },
      to: { opacity: '1' },
    },
  },
  
  /**
   * Fade out
   */
  fadeOut: {
    animation: 'fadeOut 0.3s ease-in-out',
    '@keyframes fadeOut': {
      from: { opacity: '1' },
      to: { opacity: '0' },
    },
  },
  
  /**
   * Slide up
   */
  slideUp: {
    animation: 'slideUp 0.3s ease-out',
    '@keyframes slideUp': {
      from: { transform: 'translateY(100%)', opacity: '0' },
      to: { transform: 'translateY(0)', opacity: '1' },
    },
  },
  
  /**
   * Slide down
   */
  slideDown: {
    animation: 'slideDown 0.3s ease-out',
    '@keyframes slideDown': {
      from: { transform: 'translateY(-100%)', opacity: '0' },
      to: { transform: 'translateY(0)', opacity: '1' },
    },
  },
  
  /**
   * Slide left
   */
  slideLeft: {
    animation: 'slideLeft 0.3s ease-out',
    '@keyframes slideLeft': {
      from: { transform: 'translateX(-100%)', opacity: '0' },
      to: { transform: 'translateX(0)', opacity: '1' },
    },
  },
  
  /**
   * Slide right
   */
  slideRight: {
    animation: 'slideRight 0.3s ease-out',
    '@keyframes slideRight': {
      from: { transform: 'translateX(100%)', opacity: '0' },
      to: { transform: 'translateX(0)', opacity: '1' },
    },
  },
  
  /**
   * Scale in
   */
  scaleIn: {
    animation: 'scaleIn 0.3s ease-out',
    '@keyframes scaleIn': {
      from: { transform: 'scale(0.9)', opacity: '0' },
      to: { transform: 'scale(1)', opacity: '1' },
    },
  },
  
  /**
   * Scale out
   */
  scaleOut: {
    animation: 'scaleOut 0.3s ease-out',
    '@keyframes scaleOut': {
      from: { transform: 'scale(1)', opacity: '1' },
      to: { transform: 'scale(0.9)', opacity: '0' },
    },
  },
} as const;

/**
 * Theme styles for components
 */
export const COMPONENT_STYLES = {
  /**
   * Button styles
   */
  button: {
    height: 40,
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    borderRadius: BORDER_RADIUS.md,
    transition: TRANSITIONS.fast,
  },
  
  /**
   * Input styles
   */
  input: {
    height: 44,
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.base,
    borderRadius: BORDER_RADIUS.md,
    transition: TRANSITIONS.fast,
  },
  
  /**
   * Card styles
   */
  card: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.md,
  },
  
  /**
   * Modal styles
   */
  modal: {
    padding: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    maxWidth: 600,
  },
} as const;