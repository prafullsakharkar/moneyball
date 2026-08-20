/**
 * Typed environment configuration.
 * All env access goes through this module for type safety.
 */

function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (raw && (raw.startsWith('http://') || raw.startsWith('https://'))) {
    return raw;
  }
  return 'http://localhost:3000/api/v1';
}

/**
 * API mode: 'mock' uses MSW, 'rest' uses real backend.
 * Switching requires no UI changes.
 */
function getApiMode(): 'mock' | 'rest' {
  const raw = (import.meta.env.VITE_API_MODE as string) ?? 'mock';
  return raw === 'rest' ? 'rest' : 'mock';
}

const env = {
  API_BASE_URL: getApiBaseUrl(),
  API_MODE: getApiMode(),
  APP_NAME: 'CricketOS',
  APP_VERSION: (import.meta.env.VITE_APP_VERSION as string) || '0.1.0',
  NODE_ENV: import.meta.env.MODE as string,
  MSW_ENABLED: import.meta.env.VITE_MSW_ENABLED === 'true' || getApiMode() === 'mock',
  MOCK_LATENCY: parseInt(import.meta.env.VITE_MOCK_LATENCY ?? '100', 10),
  MOCK_FAILURE_RATE: parseFloat(import.meta.env.VITE_MOCK_FAILURE_RATE ?? '0'),
} as const;

export type Env = typeof env;

export { env };
