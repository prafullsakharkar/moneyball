// Config Service - Configuration management

import { APP_CONFIG } from '../constants/app';

/**
 * Configuration interface
 */
export interface AppConfig {
  /**
   * Application name
   */
  name: string;
  
  /**
   * Application version
   */
  version: string;
  
  /**
   * API configuration
   */
  api: {
    /**
     * Base URL for API
     */
    baseUrl: string;
    
    /**
     * Request timeout in milliseconds
     */
    timeout: number;
  };
  
  /**
   * Feature flags
   */
  features: {
    /**
     * Enable dark mode
     */
    darkMode: boolean;
    
    /**
     * Enable notifications
     */
    notifications: boolean;
    
    /**
     * Enable analytics
     */
    analytics: boolean;
    
    /**
     * Enable caching
     */
    caching: boolean;
    
    /**
     * Enable offline mode
     */
    offlineMode: boolean;
  };
  
  /**
   * Environment
   */
  environment: 'development' | 'staging' | 'production';
  
  /**
   * Debug settings
   */
  debug: {
    /**
     * Enable debug mode
     */
    enabled: boolean;
    
    /**
     * Log level
     */
    level: 'debug' | 'info' | 'warn' | 'error';
  };
}

/**
 * Config service class
 */
class ConfigService {
  private config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
  }

  /**
   * Get current configuration
   */
  getConfig(): AppConfig {
    return this.config;
  }

  /**
   * Get feature flag
   */
  getFeature(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  /**
   * Check if app is in development mode
   */
  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  /**
   * Check if app is in staging mode
   */
  isStaging(): boolean {
    return this.config.environment === 'staging';
  }

  /**
   * Check if app is in production mode
   */
  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  /**
   * Check if debug mode is enabled
   */
  isDebugMode(): boolean {
    return this.config.debug.enabled;
  }

  /**
   * Log message if debug mode is enabled
   */
  debug(message: string, ...args: any[]): void {
    if (this.config.debug.enabled) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Info log
   */
  info(message: string, ...args: any[]): void {
    if (this.config.debug.level === 'info' || this.config.debug.level === 'debug') {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  /**
   * Warn log
   */
  warn(message: string, ...args: any[]): void {
    if (this.config.debug.level === 'warn' || this.config.debug.level === 'info' || this.config.debug.level === 'debug') {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  /**
   * Error log
   */
  error(message: string, ...args: any[]): void {
    console.error(`[ERROR] ${message}`, ...args);
  }
}

// Create config service instance
export const configService = new ConfigService(APP_CONFIG);

// Export config service instance for convenience
export default configService;