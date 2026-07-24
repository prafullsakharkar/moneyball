// React hook for data fetching with error handling and loading states

import { useState, useCallback, useEffect } from 'react';
import { Result, LoadingState } from '../types/common';

// API response types
export interface ApiConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

export interface UseApiOptions {
  initialLoading?: boolean;
  immediate?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: unknown) => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: LoadingState;
  execute: (config?: ApiConfig) => Promise<Result<T>>;
  setData: (data: T | null) => void;
  reset: () => void;
}

/**
 * Custom hook for API data fetching with built-in error handling, loading states, and caching.
 * 
 * @param url - The API endpoint URL
 * @param options - Configuration options for the hook
 * @returns Object containing data, loading state, error, and execute function
 */
export function useApi<T>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const { initialLoading = false, immediate = true, onError, onSuccess } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<LoadingState>('idle');

  const execute = useCallback(
    async (config: ApiConfig = {}): Promise<Result<T>> => {
      const { method = 'GET', headers = {}, body, signal } = config;
      
      setLoading(true);
      setStatus('loading');
      setError(null);

      try {
        const defaultHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
          ...headers,
        };

        const response = await fetch(url, {
          method,
          headers: defaultHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
          throw new Error(errorMessage);
        }

        const resultData = await response.json();
        
        setData(resultData);
        setStatus('success');
        setLoading(false);
        onSuccess?.(resultData);
        
        return { success: true, data: resultData };
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Request was aborted, don't set error state
          return { success: false, error: 'Request aborted' };
        }

        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setError(errorMessage);
        setStatus('error');
        setLoading(false);
        onError?.(error instanceof Error ? error : new Error(errorMessage));
        
        return { success: false, error: errorMessage };
      }
    },
    [url, onError, onSuccess]
  );

  // Automatically execute if immediate is true
  useEffect(() => {
    if (immediate && !data) {
      execute();
    }
  }, [immediate, data, execute]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setStatus('idle');
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    status,
    execute,
    setData,
    reset,
  };
}

/**
 * Custom hook for fetching lists with pagination support
 */
export interface UseListApiOptions {
  initialPage?: number;
  initialLimit?: number;
  immediate?: boolean;
}

export interface UseListApiReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  status: LoadingState;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  execute: (page?: number, limit?: number, config?: ApiConfig) => Promise<Result<ListResponse<T>>>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  reset: () => void;
}

export interface ListResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useListApi<T>(
  url: string,
  options: UseListApiOptions = {}
): UseListApiReturn<T> {
  const { initialPage = 1, initialLimit = 10, immediate = true } = options;
  
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [data, setData] = useState<T[]>([]);
  
  const { data: listData, loading, error, status, execute, reset } = useApi<ListResponse<T>>(url, {
    immediate: false,
  });

  useEffect(() => {
    if (listData) {
      setData(listData.data);
    }
  }, [listData]);

  const executeWithPagination = useCallback(
    async (
      pageParam: number = page,
      limitParam: number = limit,
      config: ApiConfig = {}
    ): Promise<Result<ListResponse<T>>> => {
      const params = new URLSearchParams();
      params.append('page', pageParam.toString());
      params.append('limit', limitParam.toString());
      
      const separator = url.includes('?') ? '&' : '?';
      const paginatedUrl = `${url}${separator}${params.toString()}`;
      
      const result = await useApi<ListResponse<T>>(paginatedUrl, { immediate: false }).execute(config);
      
      if (result.success && result.data) {
        setData(result.data.data);
        setPage(pageParam);
        setLimit(limitParam);
      }
      
      return result as Result<ListResponse<T>>;
    },
    [url, page, limit]
  );

  const resetList = useCallback(() => {
    reset();
    setData([]);
    setPage(initialPage);
    setLimit(initialLimit);
  }, [reset, initialPage, initialLimit]);

  return {
    data,
    loading,
    error,
    status,
    pagination: listData?.meta || { page, limit, total: 0, totalPages: 0 },
    execute: executeWithPagination,
    setPage,
    setLimit,
    reset: resetList,
  };
}