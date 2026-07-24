// React hook for local storage persistence

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for reading and writing to localStorage with state management
 * 
 * @param key - The localStorage key
 * @param initialValue - The initial value if no item exists in localStorage
 * @returns Tuple containing the value and a setter function
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)): void => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * Custom hook for managing object state in localStorage
 * Provides helper methods for updating nested properties
 * 
 * @param key - The localStorage key
 * @param initialValue - The initial value
 * @returns Object containing the value and update methods
 */
export function useLocalStorageObject<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useLocalStorage<T>(key, initialValue);

  const setValue = useCallback(
    (value: T | ((val: T) => T)): void => {
      setStoredValue(value);
    },
    [setStoredValue]
  );

  const updateProperty = useCallback(
    (property: keyof T, newValue: T[keyof T]): void => {
      setStoredValue((prev) => ({
        ...prev,
        [property]: newValue,
      }));
    },
    [setStoredValue]
  );

  const removeProperty = useCallback(
    (property: keyof T): void => {
      setStoredValue((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [property]: _, ...rest } = prev as Record<string, unknown>;
        return rest as T;
      });
    },
    [setStoredValue]
  );

  const clear = useCallback((): void => {
    window.localStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue, setStoredValue]);

  return { value: storedValue, setValue, updateProperty, removeProperty, clear };
}

/**
 * Custom hook for managing array state in localStorage
 * Provides helper methods for adding, removing, and toggling array items
 * 
 * @param key - The localStorage key
 * @param initialValue - The initial value
 * @returns Object containing the array and manipulation methods
 */
export function useLocalStorageArray<T>(key: string, initialValue: T[] = []) {
  const [storedValue, setStoredValue] = useLocalStorage<T[]>(key, initialValue);

  const addItem = useCallback(
    (item: T): void => {
      setStoredValue((prev) => [...prev, item]);
    },
    [setStoredValue]
  );

  const removeItem = useCallback(
    (predicate: (item: T) => boolean): void => {
      setStoredValue((prev) => prev.filter((item) => !predicate(item)));
    },
    [setStoredValue]
  );

  const toggleItem = useCallback(
    (item: T): void => {
      setStoredValue((prev) => {
        const exists = prev.includes(item);
        if (exists) {
          return prev.filter((i) => i !== item);
        }
        return [...prev, item];
      });
    },
    [setStoredValue]
  );

  const clear = useCallback((): void => {
    setStoredValue([]);
  }, [setStoredValue]);

  return { array: storedValue, addItem, removeItem, toggleItem, clear };
}

/**
 * Custom hook for managing a counter in localStorage
 * 
 * @param key - The localStorage key
 * @param initialValue - The initial value (default: 0)
 * @returns Object containing the count and increment/decrement/reset methods
 */
export function useLocalStorageCounter(key: string, initialValue: number = 0) {
  const [count, setCount] = useLocalStorage<number>(key, initialValue);

  const increment = useCallback(
    (delta: number = 1): void => {
      setCount((prev) => prev + delta);
    },
    [setCount]
  );

  const decrement = useCallback(
    (delta: number = 1): void => {
      setCount((prev) => prev - delta);
    },
    [setCount]
  );

  const reset = useCallback((): void => {
    setCount(initialValue);
  }, [initialValue, setCount]);

  return { count, increment, decrement, reset };
}

/**
 * Custom hook for managing session-based values with localStorage
 * Values expire after a specified duration
 * 
 * @param key - The localStorage key
 * @param initialValue - The initial value
 * @param ttl - Time-to-live in milliseconds (default: 1 hour)
 * @returns Tuple containing the value and a setter function
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T,
  ttl: number = 3600000 // 1 hour
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        if (parsed.expires && Date.now() > parsed.expires) {
          window.localStorage.removeItem(key);
          return initialValue;
        }
        return parsed.value;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)): void => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify({ value: valueToStore, expires: Date.now() + ttl }));
    },
    [key, storedValue, ttl]
  );

  const clear = useCallback((): void => {
    window.localStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, clear];
}