/**
 * CricketIQ API Client — Enhanced Ky Client
 * ============================================
 * HTTP layer with JWT, refresh, retry, timeout, error mapping,
 * multipart upload, download, request IDs.
 */
import ky, { type KyInstance } from 'ky';
import { env } from '@core/env';
import {
  getStoredTokens,
  setStoredTokens,
  removeStoredTokens,
  removeStoredUser,
  removeStoredMemberships,
} from '@core/storage';

/* ── Request ID Generator ─────────────────────────────── */

let requestCounter = 0;
function generateRequestId(): string {
  requestCounter += 1;
  return `req_${Date.now()}_${requestCounter}`;
}

/* ── Unauthorized Handler ─────────────────────────────── */

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

/* ── Refresh Deduplication ────────────────────────────── */

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function attemptRefresh(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const { refreshToken } = getStoredTokens();
      if (!refreshToken) return null;

      const resp = await ky
        .post(`${env.API_BASE_URL}/auth/refresh`, {
          json: { refreshToken },
          timeout: 15_000,
        })
        .json<{ data: { tokens: { accessToken: string; refreshToken: string } } }>();

      const { accessToken, refreshToken: newRefresh } = resp.data.tokens;
      setStoredTokens(accessToken, newRefresh);
      return accessToken;
    } catch {
      removeStoredTokens();
      removeStoredUser();
      removeStoredMemberships();
      onUnauthorized?.();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/* ── Error Types ──────────────────────────────────────── */

export interface ApiError {
  code: string;
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

export class ApiRequestError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, unknown>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiRequestError';
    this.code = error.code;
    this.status = error.status;
    this.details = error.details;
  }
}

/* ── Error Mapping (Django REST Framework conventions) ── */

function mapError(status: number, body: unknown): ApiError {
  const errBody = body as Record<string, unknown>;

  if (errBody && typeof errBody === 'object' && 'error' in errBody) {
    const error = errBody.error as Record<string, unknown>;
    return {
      code: (error.code as string) ?? 'UNKNOWN_ERROR',
      message: (error.message as string) ?? 'An error occurred',
      status,
      details: error.details as Record<string, unknown> | undefined,
    };
  }

  if (errBody && typeof errBody === 'object') {
    if ('detail' in errBody) {
      return { code: `HTTP_${status}`, message: String(errBody.detail), status };
    }
    if ('non_field_errors' in errBody) {
      return { code: 'VALIDATION_ERROR', message: (errBody.non_field_errors as string[]).join(', '), status };
    }
    const fieldErrors: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(errBody)) {
      if (Array.isArray(val)) fieldErrors[key] = val;
    }
    if (Object.keys(fieldErrors).length > 0) {
      return { code: 'VALIDATION_ERROR', message: 'Validation failed', status, details: fieldErrors };
    }
  }

  const statusMessages: Record<number, string> = {
    400: 'Bad request', 401: 'Authentication required', 403: 'Permission denied',
    404: 'Not found', 405: 'Method not allowed', 409: 'Conflict',
    422: 'Validation error', 429: 'Rate limited — please try again later',
    500: 'Internal server error',
  };

  return { code: `HTTP_${status}`, message: statusMessages[status] ?? `Request failed with status ${status}`, status };
}

/* ── Create Client Instance ───────────────────────────── */

function createClient(): KyInstance {
  return ky.create({
    prefix: env.API_BASE_URL,
    timeout: 30_000,
    retry: { limit: 3, methods: ['get', 'put', 'patch', 'delete'], statusCodes: [408, 429, 500, 502, 503, 504] },
    hooks: {
      beforeRequest: [
        (state) => {
          state.request.headers.set('X-Request-Id', generateRequestId());
          const { accessToken } = getStoredTokens();
          if (accessToken) {
            state.request.headers.set('Authorization', `Bearer ${accessToken}`);
          }
        },
      ],
      afterResponse: [
        async (state) => {
          const { request, options, response } = state;
          const url = String(request.url);
          if (url.includes('/auth/refresh') || url.includes('/auth/login') || url.includes('/auth/register')) return;

          if (response.status === 401) {
            const newToken = await attemptRefresh();
            if (newToken) {
              return ky(request.url, {
                method: options.method,
                headers: { ...Object.fromEntries(request.headers.entries()), Authorization: `Bearer ${newToken}` },
                body: request.body,
              });
            }
          }

          if (!response.ok && response.status !== 401) {
            let body: unknown;
            try { body = await response.clone().json(); } catch { body = {}; }
            throw new ApiRequestError(mapError(response.status, body));
          }
        },
      ],
    },
  });
}

export const apiClient = createClient();

/* ── Helpers ──────────────────────────────────────────── */

export function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined | null>): string {
  if (!params) return path;
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') sp.set(key, String(value));
  }
  const qs = sp.toString();
  return qs ? `${path}?${qs}` : path;
}

export async function uploadFile(path: string, file: File, fieldName = 'file', extraFields?: Record<string, string>): Promise<unknown> {
  const formData = new FormData();
  formData.append(fieldName, file);
  if (extraFields) for (const [k, v] of Object.entries(extraFields)) formData.append(k, v);
  return apiClient.post(path, { body: formData }).json();
}

export async function downloadFile(path: string, filename?: string): Promise<void> {
  const response = await apiClient.get(path);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename ?? path.split('/').pop() ?? 'download';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function batchRequest<T>(requests: Array<() => Promise<T>>, concurrency = 5): Promise<(T | Error)[]> {
  const results: (T | Error)[] = [];
  const executing = new Set<Promise<void>>();
  for (const request of requests) {
    const p = request().then((r) => { results.push(r); }).catch((e) => { results.push(e instanceof Error ? e : new Error(String(e))); }).finally(() => { executing.delete(p); });
    executing.add(p);
    if (executing.size >= concurrency) await Promise.race(executing);
  }
  await Promise.all(executing);
  return results;
}
