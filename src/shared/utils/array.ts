// Array utilities

// Chunk interface
export interface ChunkOptions {
  fill?: any;
}

// Shuffle options
export interface ShuffleOptions {
  seed?: number;
}

// Group interface
export interface GroupOptions {
  key?: string;
  compare?: (a: any, b: any) => number;
}

/**
 * Check if value is an array
 * 
 * @param value - Value to check
 * @returns True if value is an array
 */
export function isArray<T>(value: any): value is T[] {
  return Array.isArray(value);
}

/**
 * Create an empty array of specified length
 * 
 * @param length - Array length
 * @returns Array of specified length
 */
export function createArray<T>(length: number): T[] {
  return new Array(length);
}

/**
 * Create an array with a range of numbers
 * 
 * @param start - Start number (inclusive)
 * @param end - End number (exclusive)
 * @param step - Step between numbers
 * @returns Array of numbers
 */
export function range(start: number, end: number, step: number = 1): number[] {
  if (start > end) return [];
  
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  
  return result;
}

/**
 * Create an array with a range of numbers (inclusive)
 * 
 * @param start - Start number
 * @param end - End number
 * @param step - Step between numbers
 * @returns Array of numbers
 */
export function rangeInclusive(start: number, end: number, step: number = 1): number[] {
  if (start > end) return [];
  
  const result: number[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  
  return result;
}

/**
 * Create an array of a repeated value
 * 
 * @param value - Value to repeat
 * @param count - Number of times to repeat
 * @returns Array with repeated values
 */
export function repeat<T>(value: T, count: number): T[] {
  return new Array(count).fill(value);
}

/**
 * Fill an array with a value
 * 
 * @param array - Array to fill
 * @param value - Value to fill with
 * @param start - Start index (optional)
 * @param end - End index (optional)
 * @returns Filled array
 */
export function fill<T>(
  array: T[],
  value: T,
  start?: number,
  end?: number
): T[] {
  return array.fill(value, start, end);
}

/**
 * Generate an array of random numbers
 * 
 * @param count - Number of random numbers
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Array of random numbers
 */
export function randomArray(
  count: number,
  min: number = 0,
  max: number = 100
): number[] {
  return range(0, count).map(() => Math.floor(Math.random() * (max - min + 1)) + min);
}

/**
 * Generate unique random numbers
 * 
 * @param count - Number of random numbers
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Array of unique random numbers
 */
export function uniqueRandomArray(
  count: number,
  min: number = 0,
  max: number = 100
): number[] {
  if (count > max - min + 1) {
    throw new Error('Cannot generate more unique numbers than the range allows');
  }
  
  const numbers = new Set<number>();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  
  return Array.from(numbers);
}

/**
 * Get a random item from an array
 * 
 * @param array - Array to pick from
 * @returns Random item or undefined if array is empty
 */
export function randomItem<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get multiple random items from an array
 * 
 * @param array - Array to pick from
 * @param count - Number of items to pick
 * @returns Array of random items
 */
export function randomItems<T>(array: T[], count: number): T[] {
  if (count <= 0) return [];
  if (count >= array.length) return [...array];
  
  const shuffled = shuffle(array);
  return shuffled.slice(0, count);
}

/**
 * Shuffle an array (Fisher-Yates algorithm)
 * 
 * @param array - Array to shuffle
 * @returns Shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

/**
 * Chunk an array into subarrays
 * 
 * @param array - Array to chunk
 * @param size - Size of each chunk
 * @param options - Chunk options
 * @returns Array of chunks
 */
export function chunk<T>(array: T[], size: number, options: ChunkOptions = {}): T[][] {
  if (size <= 0) return [];
  
  const result: T[][] = [];
  
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    
    if (options.fill && chunk.length < size) {
      chunk.push(...repeat(options.fill, size - chunk.length));
    }
    
    result.push(chunk);
  }
  
  return result;
}

/**
 * Flatten an array (one level)
 * 
 * @param array - Array to flatten
 * @returns Flattened array
 */
export function flatten<T>(array: T[]): T[] {
  return array.flat() as T[];
}

/**
 * Deep flatten an array
 * 
 * @param array - Array to flatten
 * @returns Deeply flattened array
 */
export function deepFlatten<T>(array: any[]): T[] {
  const result: T[] = [];
  
  function flattenRecursive(arr: any[]): void {
    for (const item of arr) {
      if (Array.isArray(item)) {
        flattenRecursive(item);
      } else {
        result.push(item);
      }
    }
  }
  
  flattenRecursive(array);
  return result;
}

/**
 * Remove duplicates from an array
 * 
 * @param array - Array to remove duplicates from
 * @param key - Key function to identify duplicates
 * @returns Array without duplicates
 */
export function unique<T>(
  array: T[],
  key?: (item: T) => any
): T[] {
  if (!key) return [...new Set(array)];
  
  const seen = new Set<any>();
  const result: T[] = [];
  
  for (const item of array) {
    const keyValue = key(item);
    if (!seen.has(keyValue)) {
      seen.add(keyValue);
      result.push(item);
    }
  }
  
  return result;
}

/**
 * Remove null and undefined values from an array
 * 
 * @param array - Array to filter
 * @returns Array without null/undefined values
 */
export function compact<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item): item is T => item != null);
}

/**
 * Remove falsy values from an array
 * 
 * @param array - Array to filter
 * @returns Array without falsy values
 */
export function compactFalsy<T>(array: T[]): T[] {
  return array.filter((item) => Boolean(item)) as T[];
}

/**
 * Filter an array by a predicate
 * 
 * @param array - Array to filter
 * @param predicate - Filter function
 * @returns Filtered array
 */
export function filter<T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => boolean
): T[] {
  return array.filter(predicate);
}

/**
 * Filter out items that match the predicate
 * 
 * @param array - Array to filter
 * @param predicate - Filter function
 * @returns Filtered array
 */
export function reject<T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => boolean
): T[] {
  return array.filter((item, index, arr) => !predicate(item, index, arr));
}

/**
 * Find the first item matching a predicate
 * 
 * @param array - Array to search
 * @param predicate - Search function
 * @returns Matching item or undefined
 */
export function find<T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => boolean
): T | undefined {
  return array.find(predicate);
}

/**
 * Find the last item matching a predicate
 * 
 * @param array - Array to search
 * @param predicate - Search function
 * @returns Matching item or undefined
 */
export function findLast<T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => boolean
): T | undefined {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i, array)) {
      return array[i];
    }
  }
  return undefined;
}

/**
 * Check if any item matches a predicate
 * 
 * @param array - Array to check
 * @param predicate - Check function
 * @returns True if any item matches
 */
export function some<T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => boolean
): boolean {
  return array.some(predicate);
}

/**
 * Check if all items match a predicate
 * 
 * @param array - Array to check
 * @param predicate - Check function
 * @returns True if all items match
 */
export function every<T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => boolean
): boolean {
  return array.every(predicate);
}

/**
 * Check if array includes a value
 * 
 * @param array - Array to search
 * @param value - Value to find
 * @returns True if value is found
 */
export function includes<T>(array: T[], value: T): boolean {
  return array.includes(value);
}

/**
 * Check if array includes any of the values
 * 
 * @param array - Array to search
 * @param values - Values to find
 * @returns True if any value is found
 */
export function includesAny<T>(array: T[], values: T[]): boolean {
  return values.some((value) => array.includes(value));
}

/**
 * Check if array includes all of the values
 * 
 * @param array - Array to search
 * @param values - Values to find
 * @returns True if all values are found
 */
export function includesAll<T>(array: T[], values: T[]): boolean {
  return values.every((value) => array.includes(value));
}

/**
 * Get the index of a value in an array
 * 
 * @param array - Array to search
 * @param value - Value to find
 * @returns Index of value or -1 if not found
 */
export function indexOf<T>(array: T[], value: T): number {
  return array.indexOf(value);
}

/**
 * Get the last index of a value in an array
 * 
 * @param array - Array to search
 * @param value - Value to find
 * @returns Last index of value or -1 if not found
 */
export function lastIndexOf<T>(array: T[], value: T): number {
  return array.lastIndexOf(value);
}

/**
 * Get the first element of an array
 * 
 * @param array - Array to get from
 * @returns First element or undefined
 */
export function head<T>(array: T[]): T | undefined {
  return array[0];
}

/**
 * Get the last element of an array
 * 
 * @param array - Array to get from
 * @returns Last element or undefined
 */
export function last<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[array.length - 1] : undefined;
}

/**
 * Get all elements except the last
 * 
 * @param array - Array to get from
 * @returns Array without the last element
 */
export function initial<T>(array: T[]): T[] {
  return array.slice(0, -1);
}

/**
 * Get all elements except the first
 * 
 * @param array - Array to get from
 * @returns Array without the first element
 */
export function tail<T>(array: T[]): T[] {
  return array.length > 0 ? array.slice(1) : [];
}

/**
 * Get a random sample from an array
 * 
 * @param array - Array to sample from
 * @param size - Sample size
 * @returns Array sample
 */
export function sample<T>(array: T[], size: number): T[] {
  if (size <= 0 || array.length === 0) return [];
  if (size >= array.length) return [...array];
  
  return randomItems(array, size);
}

/**
 * Get the median of an array of numbers
 * 
 * @param array - Array of numbers
 * @returns Median value
 */
export function median(array: number[]): number | undefined {
  if (array.length === 0) return undefined;
  
  const sorted = [...array].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  
  return sorted[mid];
}

/**
 * Get the mean (average) of an array of numbers
 * 
 * @param array - Array of numbers
 * @returns Mean value
 */
export function mean(array: number[]): number | undefined {
  if (array.length === 0) return undefined;
  
  const sum = array.reduce((acc, num) => acc + num, 0);
  return sum / array.length;
}

/**
 * Get the mode (most frequent value) of an array
 * 
 * @param array - Array to find mode in
 * @returns Mode value(s)
 */
export function mode<T>(array: T[]): T[] {
  if (array.length === 0) return [];
  
  const counts = new Map<T, number>();
  
  for (const item of array) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }
  
  const maxCount = Math.max(...counts.values());
  return Array.from(counts.keys()).filter((item) => counts.get(item) === maxCount);
}

/**
 * Get the min value in an array
 * 
 * @param array - Array to find min in
 * @returns Min value or undefined
 */
export function min(array: number[]): number | undefined {
  if (array.length === 0) return undefined;
  return Math.min(...array);
}

/**
 * Get the max value in an array
 * 
 * @param array - Array to find max in
 * @returns Max value or undefined
 */
export function max(array: number[]): number | undefined {
  if (array.length === 0) return undefined;
  return Math.max(...array);
}

/**
 * Get the sum of an array of numbers
 * 
 * @param array - Array of numbers
 * @returns Sum
 */
export function sum(array: number[]): number {
  return array.reduce((acc, num) => acc + num, 0);
}

/**
 * Get the product of an array of numbers
 * 
 * @param array - Array of numbers
 * @returns Product
 */
export function product(array: number[]): number {
  return array.reduce((acc, num) => acc * num, 1);
}

/**
 * Reverse an array
 * 
 * @param array - Array to reverse
 * @returns Reversed array
 */
export function reverse<T>(array: T[]): T[] {
  return [...array].reverse();
}

/**
 * Sort an array
 * 
 * @param array - Array to sort
 * @param options - Sort options
 * @returns Sorted array
 */
export function sort<T>(
  array: T[],
  options: {
    compare?: (a: T, b: T) => number;
    descending?: boolean;
  } = {}
): T[] {
  const { compare, descending = false } = options;
  
  const sorted = [...array].sort(compare);
  
  if (descending) {
    return sorted.reverse();
  }
  
  return sorted;
}

/**
 * Sort an array of objects by a property
 * 
 * @param array - Array to sort
 * @param key - Property to sort by
 * @param descending - Sort descending
 * @returns Sorted array
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  descending: boolean = false
): T[] {
  return sort(array, {
    compare: (a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    },
    descending,
  });
}

/**
 * Sort an array of objects by multiple properties
 * 
 * @param array - Array to sort
 * @param keys - Properties to sort by
 * @returns Sorted array
 */
export function sortByMultiple<T>(
  array: T[],
  keys: Array<{ key: keyof T; descending?: boolean }>
): T[] {
  const sorted = [...array];
  
  sorted.sort((a, b) => {
    for (const { key, descending = false } of keys) {
      const aValue = a[key];
      const bValue = b[key];
      
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      else if (aValue > bValue) comparison = 1;
      
      if (comparison !== 0) {
        return descending ? -comparison : comparison;
      }
    }
    return 0;
  });
  
  return sorted;
}

/**
 * Group an array by a key
 * 
 * @param array - Array to group
 * @param key - Key function or property name
 * @returns Object with grouped items
 */
export function groupBy<T>(
  array: T[],
  key: (item: T) => any | keyof T
): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  
  for (const item of array) {
    const keyValue = typeof key === 'function' ? key(item) : item[key as keyof T];
    const keyString = String(keyValue);
    
    if (!result[keyString]) {
      result[keyString] = [];
    }
    
    result[keyString].push(item);
  }
  
  return result;
}

/**
 * Partition an array into two arrays based on a predicate
 * 
 * @param array - Array to partition
 * @param predicate - Partition function
 * @returns Array with [truthy, falsy] arrays
 */
export function partition<T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => boolean
): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];
  
  for (const item of array) {
    if (predicate(item, array.indexOf(item), array)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }
  
  return [truthy, falsy];
}

/**
 * Merge multiple arrays
 * 
 * @param arrays - Arrays to merge
 * @returns Merged array
 */
export function merge<T>(...arrays: T[][]): T[] {
  return arrays.flat();
}

/**
 * Intersect multiple arrays
 * 
 * @param arrays - Arrays to intersect
 * @returns Intersected array
 */
export function intersect<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return arrays[0];
  
  const result = arrays[0];
  
  for (let i = 1; i < arrays.length; i++) {
    const current = arrays[i];
    const nextResult: T[] = [];
    
    for (const item of result) {
      if (current.includes(item)) {
        nextResult.push(item);
      }
    }
    
    result.splice(0, result.length, ...nextResult);
  }
  
  return result;
}

/**
 * Difference between arrays
 * 
 * @param array - Array to get difference from
 * @param values - Values to exclude
 * @returns Difference array
 */
export function difference<T>(array: T[], values: T[]): T[] {
  return array.filter((item) => !values.includes(item));
}

/**
 * Union of multiple arrays
 * 
 * @param arrays - Arrays to union
 * @returns Union array
 */
export function union<T>(...arrays: T[][]): T[] {
  return unique(merge(...arrays));
}

/**
 * Check if two arrays are equal
 * 
 * @param a - First array
 * @param b - Second array
 * @param strict - Strict equality check
 * @returns True if arrays are equal
 */
export function equals<T>(a: T[], b: T[], strict: boolean = true): boolean {
  if (a.length !== b.length) return false;
  
  if (strict) {
    return a.every((item, index) => item === b[index]);
  }
  
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Check if array is empty
 * 
 * @param array - Array to check
 * @returns True if array is empty
 */
export function isEmpty<T>(array: T[]): boolean {
  return array.length === 0;
}

/**
 * Check if array is not empty
 * 
 * @param array - Array to check
 * @returns True if array is not empty
 */
export function isNotEmpty<T>(array: T[]): boolean {
  return array.length > 0;
}

/**
 * Get array size
 * 
 * @param array - Array to get size of
 * @returns Array size
 */
export function size<T>(array: T[]): number {
  return array.length;
}

/**
 * Convert array to object with key function
 * 
 * @param array - Array to convert
 * @param keyFn - Key function
 * @returns Object with array items keyed by key function
 */
export function toArrayObject<T>(
  array: T[],
  keyFn: (item: T) => string | number
): Record<string | number, T> {
  const result: Record<string | number, T> = {};
  
  for (const item of array) {
    const key = keyFn(item);
    result[key] = item;
  }
  
  return result;
}

/**
 * Map and flatten an array
 * 
 * @param array - Array to map
 * @param mapper - Map function that returns arrays
 * @returns Flattened mapped array
 */
export function flatMap<T, U>(
  array: T[],
  mapper: (item: T, index: number, array: T[]) => U[]
): U[] {
  return array.map(mapper).flat();
}