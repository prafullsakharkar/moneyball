// Storage key constants

/**
 * Storage prefixes
 */
export const STORAGE_PREFIXES = {
  /**
   * Application data
   */
  app: 'mb_app_',
  
  /**
   * User data
   */
  user: 'mb_user_',
  
  /**
   * Session data
   */
  session: 'mb_session_',
  
  /**
   * Preferences
   */
  preferences: 'mb_prefs_',
  
  /**
   * Cache
   */
  cache: 'mb_cache_',
} as const;

/**
 * Local Storage keys
 */
export const LOCAL_STORAGE_KEYS = {
  /**
   * Authentication
   */
  auth: {
    /**
     * Access token
     */
    accessToken: STORAGE_PREFIXES.user + 'access_token',
    
    /**
     * Refresh token
     */
    refreshToken: STORAGE_PREFIXES.user + 'refresh_token',
    
    /**
     * Token expiry
     */
    tokenExpiry: STORAGE_PREFIXES.user + 'token_expiry',
    
    /**
     * User ID
     */
    userId: STORAGE_PREFIXES.user + 'user_id',
    
    /**
     * User email
     */
    userEmail: STORAGE_PREFIXES.user + 'user_email',
    
    /**
     * Remember me
     */
    rememberMe: STORAGE_PREFIXES.user + 'remember_me',
  },
  
  /**
   * User preferences
   */
  preferences: {
    /**
     * Theme (light/dark)
     */
    theme: STORAGE_PREFIXES.preferences + 'theme',
    
    /**
     * Language
     */
    language: STORAGE_PREFIXES.preferences + 'language',
    
    /**
     * Dashboard layout
     */
    dashboardLayout: STORAGE_PREFIXES.preferences + 'dashboard_layout',
    
    /**
     * Sidebar collapsed
     */
    sidebarCollapsed: STORAGE_PREFIXES.preferences + 'sidebar_collapsed',
    
    /**
     * Notification settings
     */
    notificationsEnabled: STORAGE_PREFIXES.preferences + 'notifications_enabled',
    
    /**
     * Dark mode preference
     */
    darkMode: STORAGE_PREFIXES.preferences + 'dark_mode',
  },
  
  /**
   * Cache
   */
  cache: {
    /**
     * Last sync timestamp
     */
    lastSync: STORAGE_PREFIXES.cache + 'last_sync',
    
    /**
     * User data cache
     */
    userData: STORAGE_PREFIXES.cache + 'user_data',
    
    /**
     * Match data cache
     */
    matchData: STORAGE_PREFIXES.cache + 'match_data',
    
    /**
     * Player data cache
     */
    playerData: STORAGE_PREFIXES.cache + 'player_data',
    
    /**
     * Team data cache
     */
    teamData: STORAGE_PREFIXES.cache + 'team_data',
  },
  
  /**
   * Application state
   */
  app: {
    /**
     * Onboarding completed
     */
    onboardingCompleted: STORAGE_PREFIXES.app + 'onboarding_completed',
    
    /**
     * Welcome shown
     */
    welcomeShown: STORAGE_PREFIXES.app + 'welcome_shown',
    
    /**
     * Feature flags
     */
    featureFlags: STORAGE_PREFIXES.app + 'feature_flags',
  },
  
  /**
   * Form data (temporary)
   */
  formData: {
    /**
     * Login form
     */
    login: STORAGE_PREFIXES.session + 'login_form',
    
    /**
     * Register form
     */
    register: STORAGE_PREFIXES.session + 'register_form',
    
    /**
     * Forgot password form
     */
    forgotPassword: STORAGE_PREFIXES.session + 'forgot_password_form',
  },
  
  /**
   * Temporary data
   */
  temp: {
    /**
     * Search query
     */
    searchQuery: STORAGE_PREFIXES.session + 'search_query',
    
    /**
     * Filter state
     */
    filterState: STORAGE_PREFIXES.session + 'filter_state',
    
    /**
     * Sort state
     */
    sortState: STORAGE_PREFIXES.session + 'sort_state',
  },
} as const;

/**
 * Session Storage keys
 */
export const SESSION_STORAGE_KEYS = {
  /**
   * Authentication
   */
  auth: {
    /**
     * Session ID
     */
    sessionId: STORAGE_PREFIXES.session + 'session_id',
    
    /**
     * Session start timestamp
     */
    sessionStart: STORAGE_PREFIXES.session + 'session_start',
    
    /**
     * Session timeout
     */
    sessionTimeout: STORAGE_PREFIXES.session + 'session_timeout',
  },
  
  /**
   * Temporary data (cleared on page reload)
   */
  temp: {
    /**
     * Previous URL
     */
    previousUrl: STORAGE_PREFIXES.session + 'previous_url',
    
    /**
     * Redirect URL
     */
    redirectUrl: STORAGE_PREFIXES.session + 'redirect_url',
    
    /**
     * Form data
     */
    formData: STORAGE_PREFIXES.session + 'form_data',
  },
} as const;

/**
 * Cookie keys
 */
export const COOKIE_KEYS = {
  /**
   * Session cookie
   */
  session: 'mb_session',
  
  /**
   * CSRF token
   */
  csrfToken: 'mb_csrf_token',
  
  /**
   * Language cookie
   */
  language: 'mb_language',
  
  /**
   * Theme cookie
   */
  theme: 'mb_theme',
} as const;

/**
 * Storage TTL (Time To Live) in milliseconds
 */
export const STORAGE_TTL = {
  /**
   * Short term (5 minutes)
   */
  short: 5 * 60 * 1000,
  
  /**
   * Medium term (30 minutes)
   */
  medium: 30 * 60 * 1000,
  
  /**
   * Long term (1 hour)
   */
  long: 60 * 60 * 1000,
  
  /**
   * Very long term (24 hours)
   */
  veryLong: 24 * 60 * 60 * 1000,
  
  /**
   * Extended term (7 days)
   */
  extended: 7 * 24 * 60 * 60 * 1000,
  
  /**
   * Permanent (30 days)
   */
  permanent: 30 * 24 * 60 * 60 * 1000,
} as const;