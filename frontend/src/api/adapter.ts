/**
 * API Adapter
 * ============================================
 * Transforms between wire format (Django REST) and domain types.
 * Handles envelope unwrapping, pagination normalization, and error mapping.
 *
 * This is the boundary between the network and the domain.
 */
import type { ApiResponse, PaginatedResponse } from './types';

/* ── Wire Format Types (what Django REST sends) ───────── */

/** Django REST-style paginated response */
export interface DjangoPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Django REST-style error response */
export interface DjangoErrorResponse {
  detail?: string;
  non_field_errors?: string[];
  [field: string]: unknown;
}

/* ── Transform Functions ──────────────────────────────── */

/**
 * Unwrap API envelope: { success, data, message } → data
 * Handles both our custom envelope and Django REST format.
 */
export function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(response.message ?? 'Request failed');
  }
  return response.data;
}

/**
 * Transform Django REST pagination to our PaginatedResponse.
 * Supports both `results` (Django) and `data` (custom) formats.
 */
export function transformPagination<T>(
  data: unknown,
  defaultPage = 1,
  defaultLimit = 10,
): PaginatedResponse<T> {
  // Django REST format: { count, next, previous, results }
  if (data && typeof data === 'object' && 'results' in data) {
    const django = data as DjangoPaginatedResponse<T>;
    const totalPages = Math.ceil(django.count / defaultLimit);
    return {
      data: django.results,
      total: django.count,
      page: defaultPage,
      limit: defaultLimit,
      totalPages,
    };
  }

  // Custom format: { data, total, page, limit, totalPages }
  if (data && typeof data === 'object' && 'data' in data) {
    return data as PaginatedResponse<T>;
  }

  // Fallback: treat as array
  if (Array.isArray(data)) {
    return {
      data: data as T[],
      total: (data as T[]).length,
      page: defaultPage,
      limit: defaultLimit,
      totalPages: 1,
    };
  }

  return { data: [], total: 0, page: defaultPage, limit: defaultLimit, totalPages: 0 };
}

/**
 * Normalize a single resource response.
 * Handles both { success, data } and direct Django REST object.
 */
export function transformResource<T>(data: unknown): T {
  // Our envelope format
  if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
    return (data as ApiResponse<T>).data;
  }

  // Direct Django REST object
  return data as T;
}

/**
 * Transform list response.
 * Handles arrays, Django pagination, and our envelope format.
 */
export function transformList<T>(data: unknown): T[] {
  // Array directly
  if (Array.isArray(data)) return data as T[];

  // Django REST pagination
  if (data && typeof data === 'object' && 'results' in data) {
    return (data as DjangoPaginatedResponse<T>).results;
  }

  // Our envelope
  if (data && typeof data === 'object' && 'data' in data) {
    const inner = (data as ApiResponse<unknown>).data;
    if (Array.isArray(inner)) return inner as T[];
  }

  return [];
}

/**
 * Extract error details from Django REST validation errors.
 */
export function extractValidationErrors(data: unknown): Record<string, string[]> {
  if (!data || typeof data !== 'object') return {};

  const errors: Record<string, string[]> = {};
  const obj = data as Record<string, unknown>;

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      errors[key] = value.map(String);
    } else if (typeof value === 'string') {
      errors[key] = [value];
    }
  }

  return errors;
}

/**
 * Build query string from filter params.
 * Supports Django REST filter conventions.
 */
export function buildFilterParams(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;

    // Django REST convention: ordering uses '-' prefix for descending
    if (key === 'ordering') {
      searchParams.set('ordering', String(value));
    }
    // Array values: ?status=active&status=inactive
    else if (Array.isArray(value)) {
      for (const v of value) {
        searchParams.append(key, String(v));
      }
    }
    // Search
    else if (key === 'search') {
      searchParams.set('search', String(value));
    }
    // Standard params
    else {
      searchParams.set(key, String(value));
    }
  }

  return searchParams.toString();
}
