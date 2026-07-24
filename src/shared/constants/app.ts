// App configuration constants

/**
 * Environment configuration
 */
const ENV_CONFIG = {
  /**
   * API Base URL
   */
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.moneyball.app/v1',
  
  /**
   * API Timeout in milliseconds
   */
  API_TIMEOUT: 30000,
  
  /**
   * Environment (development, staging, production)
   */
  ENVIRONMENT: (import.meta.env.VITE_ENVIRONMENT as 'development' | 'staging' | 'production') || 'development',
  
  /**
   * Enable debug mode
   */
  DEBUG_ENABLED: import.meta.env.VITE_DEBUG_ENABLED !== 'false',
  
  /**
   * Log level
   */
  LOG_LEVEL: (import.meta.env.VITE_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'debug',
} as const;

/**
 * Application configuration
 */
export const APP_CONFIG = {
  /**
   * Application name
   */
  name: 'Moneyball',
  
  /**
   * Application version
   */
  version: '1.0.0',
  
  /**
   * Application description
   */
  description: 'Cricket Analytics and Fantasy Platform',
  
  /**
   * Application URL
   */
  url: 'https://moneyball.app',
  
  /**
   * Application author
   */
  author: 'Moneyball Team',
  
  /**
   * Application copyright
   */
  copyright: '© 2024 Moneyball. All rights reserved.',
  
  /**
   * API configuration
   */
  api: {
    /**
     * Base URL for API
     */
    baseUrl: ENV_CONFIG.API_BASE_URL,
    
    /**
     * Request timeout in milliseconds
     */
    timeout: ENV_CONFIG.API_TIMEOUT,
  },
  
  /**
   * Feature flags
   */
  features: {
    /**
     * Enable dark mode
     */
    darkMode: true,
    
    /**
     * Enable notifications
     */
    notifications: true,
    
    /**
     * Enable analytics
     */
    analytics: true,
    
    /**
     * Enable caching
     */
    caching: true,
    
    /**
     * Enable offline mode
     */
    offlineMode: true,
  },
  
  /**
   * Environment
   */
  environment: ENV_CONFIG.ENVIRONMENT,
  
  /**
   * Debug settings
   */
  debug: {
    /**
     * Enable debug mode
     */
    enabled: ENV_CONFIG.DEBUG_ENABLED,
    
    /**
     * Log level
     */
    level: ENV_CONFIG.LOG_LEVEL,
  },
} as const;

/**
 * Feature flags
 */
export const FEATURE_FLAGS = {
  /**
   * Enable AI-powered analytics
   */
  aiAnalytics: true,
  
  /**
   * Enable real-time match scoring
   */
  realTimeScoring: true,
  
  /**
   * Enable fantasy cricket features
   */
  fantasyCricket: true,
  
  /**
   * Enable video analysis
   */
  videoAnalysis: true,
  
  /**
   * Enable streaming features
   */
  streaming: true,
  
  /**
   * Enable monetization features
   */
  monetization: true,
  
  /**
   * Enable notification system
   */
  notifications: true,
  
  /**
   * Enable sponsorship management
   */
  sponsorships: true,
} as const;

/**
 * Supported languages
 */
export const SUPPORTED_LANGUAGES = {
  /**
   * English
   */
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    locale: 'en-US',
    flag: '🇺🇸',
  },
  
  /**
   * Hindi
   */
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    locale: 'hi-IN',
    flag: '🇮🇳',
  },
  
  /**
   * Spanish
   */
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    locale: 'es-ES',
    flag: '🇪🇸',
  },
  
  /**
   * Portuguese
   */
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    locale: 'pt-PT',
    flag: '🇵🇹',
  },
  
  /**
   * Arabic
   */
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    locale: 'ar-SA',
    flag: '🇸🇦',
  },
} as const;

/**
 * App routes
 */
export const APP_ROUTES = {
  /**
   * Dashboard
   */
  dashboard: '/',
  
  /**
   * Matches
   */
  matches: '/matches',
  
  /**
   * Match detail
   */
  matchDetail: (id: string) => `/matches/${id}`,
  
  /**
   * Players
   */
  players: '/players',
  
  /**
   * Player detail
   */
  playerDetail: (id: string) => `/players/${id}`,
  
  /**
   * Teams
   */
  teams: '/teams',
  
  /**
   * Team detail
   */
  teamDetail: (id: string) => `/teams/${id}`,
  
  /**
   * Tournaments
   */
  tournaments: '/tournaments',
  
  /**
   * Tournament detail
   */
  tournamentDetail: (id: string) => `/tournaments/${id}`,
  
  /**
   * Analytics
   */
  analytics: '/analytics',
  
  /**
   * Fantasy
   */
  fantasy: '/fantasy',
  
  /**
   * Video Analysis
   */
  videoAnalysis: '/video-analysis',
  
  /**
   * AI Insights
   */
  aiInsights: '/ai-insights',
  
  /**
   * Academy
   */
  academy: '/academy',
  
  /**
   * Notifications
   */
  notifications: '/notifications',
  
  /**
   * Profile
   */
  profile: '/profile',
  
  /**
   * Settings
   */
  settings: '/settings',
  
  /**
   * Admin
   */
  admin: '/admin',
  
  /**
   * Login
   */
  login: '/login',
  
  /**
   * Register
   */
  register: '/register',
  
  /**
   * Forgot password
   */
  forgotPassword: '/forgot-password',
  
  /**
   * Reset password
   */
  resetPassword: '/reset-password',
} as const;

/**
 * App metadata
 */
export const APP_METADATA = {
  /**
   * Application title
   */
  title: 'Moneyball - Cricket Analytics Platform',
  
  /**
   * Application keywords
   */
  keywords: 'cricket, analytics, fantasy, moneyball, sports, player stats, match data',
  
  /**
   * Application author
   */
  author: 'Moneyball Team',
  
  /**
   * Application theme color
   */
  themeColor: '#000080',
  
  /**
   * Application background color
   */
  backgroundColor: '#ffffff',
  
  /**
   * Application favicon
   */
  favicon: '/favicon.ico',
} as const;