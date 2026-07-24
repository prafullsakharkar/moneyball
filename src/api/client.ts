// API Client - Centralized ky instance for all HTTP requests

import ky, { HTTPError } from 'ky';

// ─── CONFIGURATION ──────────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 2;

// ─── TYPES ──────────────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedParams {
  page?: number;
  limit?: number;
  search?: string;
}

// ─── REQUEST CONFIG ──────────────────────────────────────────────────────────────
export interface RequestConfig {
  prefix?: string;
  timeout?: number;
  retry?: number;
  headers?: Record<string, string>;
}

// ─── INSTANCE CONFIGURATION ─────────────────────────────────────────────────────
const createClient = (config: RequestConfig = {}) => {
  const { prefix = API_BASE_URL, timeout = API_TIMEOUT, retry = MAX_RETRIES, headers = {} } = config;

  return ky.create({
    prefix,
    timeout,
    retry: {
      limit: retry,
      methods: ['GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'TRACE'],
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    throwHttpErrors: true,
  });
};

// ─── CLIENT INSTANCES ────────────────────────────────────────────────────────────
// Main API client - uses base URL from env
export const apiClient = createClient({ prefix: API_BASE_URL });

// ─── DEV LOGGING WRAPPERS ────────────────────────────────────────────────────────
// Wrapper functions for logging (called in service layer)
export const logRequest = (method: string, url: string, body?: any) => {
  if (import.meta.env.DEV) {
    console.log(`[API Request] ${method} ${url}`);
    if (body && (method === 'POST' || method === 'PUT')) {
      console.log('[API Request Body]', body);
    }
  }
};

export const logResponse = (status: number, statusText: string) => {
  if (import.meta.env.DEV) {
    console.log(`[API Response] Status: ${status} ${statusText}`);
  }
};

export const logError = (error: Error) => {
  if (import.meta.env.DEV && error instanceof ApiError) {
    console.error(`[API Error] ${error.status} ${error.message}`);
  }
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────────
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export async function handleApiResponse<T>(response: any): Promise<ApiResponse<T>> {
  try {
    const data = typeof response.json === 'function' ? await response.json() : response;
    const headers: Record<string, string> = {};
    const responseHeaders = (response as Response).headers || new Headers();
    responseHeaders.forEach((value, key) => {
      headers[key] = value;
    });

    // Extract pagination info if available
    let pagination;
    if (data && typeof data === 'object' && 'total' in data && 'page' in data) {
      pagination = {
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      };
    }

    return { 
      data, 
      status: (response as Response).status || 200, 
      headers, 
      pagination 
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      const response = (error as any).response;
      try {
        const data = await response.json();
        throw new ApiError(data.message || data.error || response.statusText, response.status, response);
      } catch {
        throw new ApiError(response.statusText, response.status, response);
      }
    }
    throw new ApiError('An unexpected error occurred', 500);
  }
}

// ─── QUERY STRING BUILDER ────────────────────────────────────────────────────────
export function buildQueryString(params: Record<string, any>): string {
  return new URLSearchParams(params as any).toString();
}

// ─── ERROR HANDLERS ──────────────────────────────────────────────────────────────
export async function handleSimulatedErrors(response: Response): Promise<Response> {
  // Simulate 404 error
  if (response.url.includes('/error/404')) {
    throw new ApiError('Not Found', 404);
  }
  
  // Simulate 500 error
  if (response.url.includes('/error/500')) {
    throw new ApiError('Internal Server Error', 500);
  }
  
  // Simulate 401 error
  if (response.url.includes('/error/401')) {
    throw new ApiError('Unauthorized', 401);
  }

  return response;
}

// ─── EXPORTS ────────────────────────────────────────────────────────────────────
export default apiClient;