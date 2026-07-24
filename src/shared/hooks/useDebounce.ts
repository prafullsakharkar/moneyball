// React hook for debouncing values

import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value
 * Returns the debounced value that only updates after the specified delay
 * 
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds (default: 300)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debouncing search queries
 * Useful for implementing search-as-you-type functionality
 * 
 * @param query - The search query to debounce
 * @param delay - The debounce delay in milliseconds (default: 300)
 * @returns The debounced search query
 */
export function useDebounceQuery(query: string, delay: number = 300): string {
  return useDebounce(query, delay);
}

/**
 * Custom hook for debouncing form inputs
 * 
 * @param value - The form value to debounce
 * @param delay - The debounce delay in milliseconds (default: 500)
 * @returns The debounced form value
 */
export function useDebounceForm<T>(value: T, delay: number = 500): T {
  return useDebounce(value, delay);
}

/**
 * Custom hook that provides both current and debounced values
 * Useful when you need both the live value and the debounced value
 * 
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds (default: 300)
 * @returns Object containing current and debounced values
 */
export function useDebounceValue<T>(value: T, delay: number = 300): { current: T; debounced: T } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { current: value, debounced: debouncedValue };
}