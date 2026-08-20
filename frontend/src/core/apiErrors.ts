/**
 * Centralized API error handling.
 * Maps HTTP status codes and network errors to user-friendly messages.
 */

import { AppError } from './errors';

/* ── Error Codes ──────────────────────────────────────────── */

export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNKNOWN_ERROR';

/* ── Error Map ────────────────────────────────────────────── */

const STATUS_MAP: Record<number, { code: ApiErrorCode; message: string }> = {
  400: { code: 'VALIDATION_ERROR', message: 'The request was invalid. Please check your input.' },
  401: { code: 'UNAUTHORIZED', message: 'Your session has expired. Please sign in again.' },
  403: { code: 'FORBIDDEN', message: 'You do not have permission to perform this action.' },
  404: { code: 'NOT_FOUND', message: 'The requested resource was not found.' },
  409: { code: 'CONFLICT', message: 'A conflict occurred. The resource may already exist.' },
  422: { code: 'VALIDATION_ERROR', message: 'The provided data is invalid. Please check your input.' },
  429: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' },
  500: { code: 'SERVER_ERROR', message: 'An unexpected error occurred. Please try again later.' },
  502: { code: 'SERVER_ERROR', message: 'The server is temporarily unavailable.' },
  503: { code: 'SERVER_ERROR', message: 'The service is temporarily unavailable.' },
};

/* ── Error Response Types ─────────────────────────────────── */

interface ApiErrorBody {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
  };
  message?: string;
}

/* ── Mapper ───────────────────────────────────────────────── */

/**
 * Map an HTTP status code to a user-friendly error.
 */
export function mapHttpStatusToError(status: number, body?: unknown): AppError {
  const mapped = STATUS_MAP[status] ?? STATUS_MAP[500];
  const apiBody = body as ApiErrorBody | undefined;
  const serverMessage = apiBody?.error?.message ?? apiBody?.message;

  return new AppError(serverMessage ?? mapped.message, {
    code: mapped.code,
    statusCode: status,
    details: apiBody?.error?.details,
  });
}

/**
 * Map a network/fetch error to a user-friendly error.
 */
export function mapNetworkError(error: unknown): AppError {
  if (error instanceof Error) {
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return new AppError('The request timed out. Please check your connection and try again.', {
        code: 'TIMEOUT',
      });
    }
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return new AppError('Unable to connect to the server. Please check your internet connection.', {
        code: 'NETWORK_ERROR',
      });
    }
  }

  return new AppError('An unexpected error occurred.', { code: 'UNKNOWN_ERROR' });
}

/**
 * Parse a Ky/HTTP error response body.
 */
export async function parseErrorResponse(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Handle a failed API response and throw a mapped AppError.
 */
export async function handleApiError(response: Response): Promise<never> {
  const body = await parseErrorResponse(response);
  throw mapHttpStatusToError(response.status, body);
}
