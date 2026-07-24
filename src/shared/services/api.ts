// API Service - Handles all API requests with interceptors

import { API_BASE_URL, API_TIMEOUT, HTTP_METHODS } from '../constants/api';
import { getStorageItem, removeStorageItem, setStorageItem } from './storage';

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * API error types
 */
export type ApiErrorType = 'network' | 'timeout' | 'client' | 'server' | 'unknown';

/**
 * API error interface
 */
export interface ApiError {
  message: string;
  type: ApiErrorType;
  status?: number;
  details?: any;
}

/**
 * API response interface
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  error?: never;
}

/**
 * API request options
 */
export interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  body?: any;
  timeout?: number;
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
}

/**
 * API service class
 */
class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout: number) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Get the current auth token
   */
  private getAuthToken(): string | null {
    return getStorageItem('mb_user_access_token');
  }

  /**
   * Create headers for API request
   */
  private createHeaders(options: ApiRequestOptions): Headers {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    // Add auth token if not skipped
    if (!options.skipAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // Add custom headers
    if (options.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        headers.set(key, value);
      }
    }

    return headers;
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      }

      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
  }

  /**
   * Handle API errors
   */
  private handleErrors(response: Response, error?: Error): ApiError {
    const errorType: ApiErrorType =
      error?.name === 'TimeoutError'
        ? 'timeout'
        : !navigator.onLine
        ? 'network'
        : response.status >= 500
        ? 'server'
        : response.status >= 400
        ? 'client'
        : 'unknown';

    return {
      message: this.getErrorMessage(response, error),
      type: errorType,
      status: response.status,
      details: response.status >= 400 ? response : undefined,
    };
  }

  /**
   * Get error message from response
   */
  private getErrorMessage(response: Response, error?: Error): string {
    if (error) {
      return error.message;
    }

    if (!navigator.onLine) {
      return 'No internet connection. Please check your connection and try again.';
    }

    if (response.status >= 500) {
      return 'Server error. Please try again later.';
    }

    if (response.status === 401) {
      return 'Unauthorized. Please log in again.';
    }

    if (response.status === 403) {
      return 'Forbidden. You do not have permission to access this resource.';
    }

    if (response.status === 404) {
      return 'Resource not found.';
    }

    if (response.status >= 400) {
      return `Request failed with status ${response.status}.`;
    }

    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Refresh auth token
   */
  private async refreshAuthToken(): Promise<string | null> {
    const refreshToken = getStorageItem('mb_user_refresh_token');
    
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: HTTP_METHODS.POST,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          setStorageItem('mb_user_access_token', data.accessToken);
          return data.accessToken;
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Make API request
   */
  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T> | { error: ApiError }> {
    const {
      method = 'GET',
      params,
      body,
      timeout = this.timeout,
      skipAuth = false,
      skipErrorHandling = false,
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const url = this.buildUrl(endpoint, params);
      const headers = this.createHeaders(options);

      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      if (body && method !== HTTP_METHODS.GET) {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      // Handle token expiration
      if (response.status === 401 && !skipAuth) {
        const newToken = await this.refreshAuthToken();
        if (newToken) {
          // Retry request with new token
          headers.set('Authorization', `Bearer ${newToken}`);
          const retryResponse = await fetch(url, {
            ...fetchOptions,
            headers,
          });
          clearTimeout(timeoutId);

          return this.handleResponse<T>(retryResponse);
        }

        // If refresh fails, remove auth tokens
        removeStorageItem('mb_user_access_token');
        removeStorageItem('mb_user_refresh_token');
        removeStorageItem('mb_user_token_expiry');

        return {
          error: {
            message: 'Session expired. Please log in again.',
            type: 'client',
            status: 401,
          },
        };
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        return {
          error: {
            message: 'Request timeout. Please try again.',
            type: 'timeout',
          },
        };
      }

      const apiError = this.handleErrors(
        new Response(null, { status: 0, statusText: (error as Error).message }),
        error as Error
      );

      if (skipErrorHandling) {
        return { error: apiError };
      }

      throw apiError;
    }
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T> | { error: ApiError }> {
    // Handle no content response
    if (response.status === 204) {
      return {
        data: null as unknown as T,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      };
    }

    // Parse JSON response
    let data: T;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    } catch (error) {
      return {
        error: {
          message: 'Failed to parse response data.',
          type: 'unknown',
          status: response.status,
        },
      };
    }

    // Check for errors
    if (!response.ok) {
      return {
        error: {
          message: this.getErrorMessage(response),
          type: response.status >= 500 ? 'server' : 'client',
          status: response.status,
          details: data,
        },
      };
    }

    return {
      data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<ApiResponse<T> | { error: ApiError }> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<ApiResponse<T> | { error: ApiError }> {
    return this.request<T>(endpoint, { ...options, method: 'POST' });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<ApiResponse<T> | { error: ApiError }> {
    return this.request<T>(endpoint, { ...options, method: 'PUT' });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<ApiResponse<T> | { error: ApiError }> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH' });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<ApiResponse<T> | { error: ApiError }> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create API service instance
export const apiService = new ApiService(API_BASE_URL, API_TIMEOUT);

// Export HTTP methods for convenience
