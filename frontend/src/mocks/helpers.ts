/**
 * MSW Django REST Framework Helpers
 * ============================================
 * Emulates Django REST API behavior for realistic mocking.
 * Supports pagination, filtering, ordering, searching,
 * error simulation, latency, and random failures.
 */
import { HttpResponse, delay } from 'msw';

/* ── Configuration ────────────────────────────────────── */

export interface MockConfig {
  /** Simulated network latency (ms) */
  latency: number;
  /** Random failure rate (0-1) */
  failureRate: number;
  /** Default page size */
  defaultPageSize: number;
  /** Max page size */
  maxPageSize: number;
}

const defaultConfig: MockConfig = {
  latency: parseInt(import.meta.env.VITE_MOCK_LATENCY ?? '100', 10),
  failureRate: parseFloat(import.meta.env.VITE_MOCK_FAILURE_RATE ?? '0'),
  defaultPageSize: 20,
  maxPageSize: 100,
};

let config = { ...defaultConfig };

export function configureMock(overrides: Partial<MockConfig>) {
  config = { ...config, ...overrides };
}

export function resetMockConfig() {
  config = { ...defaultConfig };
}

/* ── Latency Simulation ───────────────────────────────── */

async function simulateLatency() {
  if (config.latency > 0) {
    await delay(config.latency);
  }
}

/* ── Random Failure Simulation ────────────────────────── */

function shouldFail(): boolean {
  return config.failureRate > 0 && Math.random() < config.failureRate;
}

/* ── Django REST Pagination ───────────────────────────── */

export interface DjangoPaginatedData<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export function paginate<T>(
  data: T[],
  requestUrl: string,
): DjangoPaginatedData<T> {
  const url = new URL(requestUrl);
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
  const limit = Math.min(
    config.maxPageSize,
    Math.max(1, parseInt(url.searchParams.get('limit') ?? url.searchParams.get('page_size') ?? String(config.defaultPageSize), 10)),
  );

  const start = (page - 1) * limit;
  const results = data.slice(start, start + limit);

  const baseUrl = url.origin + url.pathname;
  const hasMore = start + limit < data.length;
  const hasPrev = page > 1;

  return {
    count: data.length,
    next: hasMore ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
    previous: hasPrev ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
    results,
  };
}

/* ── Django REST Search ───────────────────────────────── */

export function search<T>(
  data: T[],
  requestUrl: string,
  fields: string[],
): T[] {
  const url = new URL(requestUrl);
  const query = url.searchParams.get('search')?.toLowerCase();
  if (!query) return data;

  return data.filter((item) =>
    fields.some((field) => {
      const value = (item as Record<string, unknown>)[field];
      if (typeof value === 'string') return value.toLowerCase().includes(query);
      if (typeof value === 'number') return String(value).includes(query);
      return false;
    }),
  );
}

/* ── Django REST Filtering ────────────────────────────── */

export function filter<T>(
  data: T[],
  requestUrl: string,
  filterFields: string[],
): T[] {
  const url = new URL(requestUrl);
  let result = data;

  for (const field of filterFields) {
    const value = url.searchParams.get(field);
    if (!value) continue;

    result = result.filter((item) => {
      const itemValue = (item as Record<string, unknown>)[field];
      return String(itemValue) === value;
    });
  }

  return result;
}

/* ── Django REST Ordering ─────────────────────────────── */

export function order<T>(
  data: T[],
  requestUrl: string,
): T[] {
  const url = new URL(requestUrl);
  const ordering = url.searchParams.get('ordering');
  if (!ordering) return data;

  const sorted = [...data];
  const fields = ordering.split(',');

  for (const field of fields) {
    const desc = field.startsWith('-');
    const fieldName = desc ? field.slice(1) : field;

    sorted.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[fieldName];
      const bVal = (b as Record<string, unknown>)[fieldName];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return desc ? -comparison : comparison;
    });
  }

  return sorted;
}

/* ── Combined Query Pipeline ──────────────────────────── */

export interface QueryPipelineOptions<T> {
  data: T[];
  requestUrl: string;
  /** Fields to search on */
  searchFields: string[];
  /** Fields that support exact filtering */
  filterFields: string[];
}

export function queryPipeline<T>({
  data,
  requestUrl,
  searchFields,
  filterFields: filters,
}: QueryPipelineOptions<T>): DjangoPaginatedData<T> {
  let result = data;
  result = search(result, requestUrl, searchFields);
  result = filter(result, requestUrl, filters);
  result = order(result, requestUrl);
  return paginate(result, requestUrl);
}

/* ── Response Helpers ─────────────────────────────────── */

export function djangoResponse(data: Record<string, any> | string | number | boolean | null | undefined, status = 200) {
  return HttpResponse.json(data, { status });
}

export function djangoErrorResponse(
  status: number,
  message: string,
  details?: Record<string, unknown>,
) {
  const body: Record<string, any> = { detail: message };
  if (details) Object.assign(body, details);
  return HttpResponse.json(body, { status });
}

export function validationError(errors: Record<string, string[]>) {
  return HttpResponse.json(errors as Record<string, any>, { status: 400 });
}

/* ── Handler Wrapper ──────────────────────────────────── */

/**
 * Wrap a handler with latency and failure simulation.
 */
export function withMockBehavior(
  handler: () => Promise<ReturnType<typeof HttpResponse.json>> | ReturnType<typeof HttpResponse.json>,
): () => Promise<ReturnType<typeof HttpResponse.json>> {
  return async () => {
    await simulateLatency();

    if (shouldFail()) {
      const errors = [500, 502, 503];
      const status = errors[Math.floor(Math.random() * errors.length)];
      return djangoErrorResponse(status, 'Internal server error');
    }

    return handler();
  };
}

/* ── Auth Helpers ─────────────────────────────────────── */

export function extractAuthHeader(request: Request): string | null {
  return request.headers.get('Authorization')?.replace('Bearer ', '') ?? null;
}

export function extractOrgId(request: Request): string | null {
  return request.headers.get('X-Organization-Id');
}

export function isAuthenticated(request: Request): boolean {
  const token = extractAuthHeader(request);
  return token !== null && token.length > 0;
}

export function requireAuth(request: Request): ReturnType<typeof HttpResponse.json> | null {
  if (!isAuthenticated(request)) {
    return djangoErrorResponse(401, 'Authentication credentials were not provided.');
  }
  return null;
}

/* ── Batch Operation Helper ───────────────────────────── */

export interface BatchOperation {
  method: 'create' | 'update' | 'delete';
  id?: string;
  data?: Record<string, unknown>;
}

export function processBatch(operations: BatchOperation[]): {
  success: boolean;
  results: Array<{ id?: string; status: number; error?: string }>;
} {
  return {
    success: true,
    results: operations.map((op) => ({
      id: op.id,
      status: op.method === 'delete' ? 204 : 200,
    })),
  };
}
