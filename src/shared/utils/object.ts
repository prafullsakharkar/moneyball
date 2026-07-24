// Object utilities

// Path type
export type Path = string | string[];

// Change handler
export type ChangeHandler<T> = (value: T) => void;

/**
 * Check if value is an object
 * 
 * @param value - Value to check
 * @returns True if value is an object
 */
export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Check if object is empty
 * 
 * @param obj - Object to check
 * @returns True if object is empty
 */
export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * Check if object is not empty
 * 
 * @param obj - Object to check
 * @returns True if object is not empty
 */
export function isNotEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length > 0;
}

/**
 * Get object size
 * 
 * @param obj - Object to get size of
 * @returns Number of own properties
 */
export function size(obj: Record<string, any>): number {
  return Object.keys(obj).length;
}

/**
 * Get a value from an object by path
 * 
 * @param obj - Object to get from
 * @param path - Path to the value (e.g., 'user.name' or ['user', 'name'])
 * @param defaultValue - Default value if not found
 * @returns Value at path or default value
 */
export function get<T>(
  obj: Record<string, any>,
  path: Path,
  defaultValue?: T
): T | undefined {
  const pathArray = Array.isArray(path) ? path : path.split('.');
  
  let result: any = obj;
  
  for (const key of pathArray) {
    if (result == null || typeof result !== 'object') {
      return defaultValue;
    }
    
    result = result[key];
    
    if (result === undefined) {
      return defaultValue;
    }
  }
  
  return result as T;
}

/**
 * Set a value in an object by path
 * 
 * @param obj - Object to set in
 * @param path - Path to the value
 * @param value - Value to set
 * @returns New object with updated value
 */
export function set<T>(
  obj: Record<string, any>,
  path: Path,
  value: T
): Record<string, any> {
  const pathArray = Array.isArray(path) ? path : path.split('.');
  
  const result = { ...obj };
  let current: any = result;
  
  for (let i = 0; i < pathArray.length - 1; i++) {
    const key = pathArray[i];
    current[key] = { ...(current[key] || {}) };
    current = current[key];
  }
  
  current[pathArray[pathArray.length - 1]] = value;
  
  return result;
}

/**
 * Deep clone an object
 * 
 * @param obj - Object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge multiple objects
 * 
 * @param objects - Objects to merge
 * @returns Merged object
 */
export function merge<T>(...objects: Partial<T>[]): T {
  return Object.assign({}, ...objects);
}

/**
 * Deep merge multiple objects
 * 
 * @param objects - Objects to merge
 * @returns Deep merged object
 */
export function deepMerge<T>(...objects: Record<string, any>[]): T {
  const result: Record<string, any> = {};
  
  for (const obj of objects) {
    for (const [key, value] of Object.entries(obj)) {
      if (
        isObject(value) &&
        isObject(result[key]) &&
        key in result
      ) {
        result[key] = deepMerge(result[key], value);
      } else {
        result[key] = value;
      }
    }
  }
  
  return result as T;
}

/**
 * Pick specific properties from an object
 * 
 * @param obj - Object to pick from
 * @param keys - Keys to pick
 * @returns Object with picked properties
 */
export function pick<T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> {
  const result: Record<string, any> = {};
  
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  
  return result as Pick<T, K>;
}

/**
 * Omit specific properties from an object
 * 
 * @param obj - Object to omit from
 * @param keys - Keys to omit
 * @returns Object with omitted properties
 */
export function omit<T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  
  for (const key of keys) {
    delete result[key];
  }
  
  return result as Omit<T, K>;
}

/**
 * Pick properties by predicate
 * 
 * @param obj - Object to pick from
 * @param predicate - Predicate function
 * @returns Object with picked properties
 */
export function pickBy<T>(
  obj: Record<string, any>,
  predicate: (value: any, key: string) => boolean
): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (predicate(value, key)) {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Omit properties by predicate
 * 
 * @param obj - Object to omit from
 * @param predicate - Predicate function
 * @returns Object with omitted properties
 */
export function omitBy<T>(
  obj: Record<string, any>,
  predicate: (value: any, key: string) => boolean
): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (!predicate(value, key)) {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Transform object keys
 * 
 * @param obj - Object to transform
 * @param transformer - Key transformer function
 * @returns Object with transformed keys
 */
export function transformKeys<T>(
  obj: T,
  transformer: (key: string) => string
): T {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    result[transformer(key)] = value;
  }
  
  return result as T;
}

/**
 * Transform object values
 * 
 * @param obj - Object to transform
 * @param transformer - Value transformer function
 * @returns Object with transformed values
 */
export function transformValues<T>(
  obj: T,
  transformer: (value: any, key: string) => any
): T {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    result[key] = transformer(value, key);
  }
  
  return result as T;
}

/**
 * Convert object to entries array
 * 
 * @param obj - Object to convert
 * @returns Array of [key, value] pairs
 */
export function toEntries<T>(obj: Record<string, T>): [string, T][] {
  return Object.entries(obj);
}

/**
 * Convert entries array to object
 * 
 * @param entries - Array of [key, value] pairs
 * @returns Object
 */
export function fromEntries<T>(entries: [string, T][]): Record<string, T> {
  return Object.fromEntries(entries);
}

/**
 * Get all keys from an object
 * 
 * @param obj - Object to get keys from
 * @returns Array of keys
 */
export function keys(obj: Record<string, any>): string[] {
  return Object.keys(obj);
}

/**
 * Get all values from an object
 * 
 * @param obj - Object to get values from
 * @returns Array of values
 */
export function values<T>(obj: Record<string, T>): T[] {
  return Object.values(obj);
}

/**
 * Check if object has a property
 * 
 * @param obj - Object to check
 * @param key - Property key
 * @returns True if object has property
 */
export function has(obj: Record<string, any>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Check if object has a nested property by path
 * 
 * @param obj - Object to check
 * @param path - Path to the property
 * @returns True if property exists
 */
export function hasPath(
  obj: Record<string, any>,
  path: Path
): boolean {
  const pathArray = Array.isArray(path) ? path : path.split('.');
  
  let current: any = obj;
  
  for (const key of pathArray) {
    if (current == null || typeof current !== 'object') {
      return false;
    }
    
    if (!Object.prototype.hasOwnProperty.call(current, key)) {
      return false;
    }
    
    current = current[key];
  }
  
  return true;
}

/**
 * Get object keys that match a predicate
 * 
 * @param obj - Object to search
 * @param predicate - Predicate function
 * @returns Array of matching keys
 */
export function keysBy<T>(
  obj: Record<string, T>,
  predicate: (value: T, key: string) => boolean
): string[] {
  const result: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    if (predicate(value, key)) {
      result.push(key);
    }
  }
  
  return result;
}

/**
 * Get object values that match a predicate
 * 
 * @param obj - Object to search
 * @param predicate - Predicate function
 * @returns Array of matching values
 */
export function valuesBy<T>(
  obj: Record<string, T>,
  predicate: (value: T, key: string) => boolean
): T[] {
  const result: T[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    if (predicate(value, key)) {
      result.push(value);
    }
  }
  
  return result;
}

/**
 * Count properties in an object
 * 
 * @param obj - Object to count
 * @returns Number of properties
 */
export function count(obj: Record<string, any>): number {
  return Object.keys(obj).length;
}

/**
 * Check if object contains a value
 * 
 * @param obj - Object to search
 * @param value - Value to find
 * @returns True if value exists in object
 */
export function containsValue<T>(
  obj: Record<string, T>,
  value: T
): boolean {
  return Object.values(obj).includes(value);
}

/**
 * Get the first key in an object
 * 
 * @param obj - Object to get from
 * @returns First key or undefined
 */
export function firstKey(obj: Record<string, any>): string | undefined {
  return Object.keys(obj)[0];
}

/**
 * Get the last key in an object
 * 
 * @param obj - Object to get from
 * @returns Last key or undefined
 */
export function lastKey(obj: Record<string, any>): string | undefined {
  const keys = Object.keys(obj);
  return keys.length > 0 ? keys[keys.length - 1] : undefined;
}

/**
 * Invert object keys and values
 * 
 * @param obj - Object to invert
 * @returns Inverted object
 */
export function invert<T extends string | number | symbol>(
  obj: Record<string, T>
): Record<T, string> {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    result[String(value)] = key;
  }
  
  return result as Record<T, string>;
}

/**
 * Create an object from keys and a value generator
 * 
 * @param keys - Array of keys
 * @param valueFn - Value generator function
 * @returns Created object
 */
export function fromKeys<T>(
  keys: string[],
  valueFn: (key: string) => T
): Record<string, T> {
  const result: Record<string, T> = {};
  
  for (const key of keys) {
    result[key] = valueFn(key);
  }
  
  return result;
}

/**
 * Create an object from values and a key generator
 * 
 * @param values - Array of values
 * @param keyFn - Key generator function
 * @returns Created object
 */
export function fromValues<T>(
  values: T[],
  keyFn: (value: T, index: number) => string
): Record<string, T> {
  const result: Record<string, T> = {};
  
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    result[keyFn(value, i)] = value;
  }
  
  return result;
}

/**
 * Deep equal comparison of two objects
 * 
 * @param a - First object
 * @param b - Second object
 * @returns True if objects are equal
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  
  if (
    a == null ||
    b == null ||
    typeof a !== 'object' ||
    typeof b !== 'object'
  ) {
    return false;
  }
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    
    return true;
  }
  
  if (Array.isArray(a) || Array.isArray(b)) return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
}

/**
 * Create a new object without null/undefined values
 * 
 * @param obj - Object to clean
 * @returns Cleaned object
 */
export function clean(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value != null) {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Create a new object with only defined values
 * 
 * @param obj - Object to filter
 * @returns Filtered object
 */
export function defined(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Get object entries as a map
 * 
 * @param obj - Object to convert
 * @returns Map with object entries
 */
export function toMap<T>(obj: Record<string, T>): Map<string, T> {
  const map = new Map<string, T>();
  
  for (const [key, value] of Object.entries(obj)) {
    map.set(key, value);
  }
  
  return map;
}

/**
 * Get object entries as a set of keys
 * 
 * @param obj - Object to convert
 * @returns Set with object keys
 */
export function keySet(obj: Record<string, any>): Set<string> {
  return new Set(Object.keys(obj));
}

/**
 * Get object entries as a set of values
 * 
 * @param obj - Object to convert
 * @returns Set with object values
 */
export function valueSet<T>(obj: Record<string, T>): Set<T> {
  return new Set(Object.values(obj));
}

/**
 * Partition object by predicate
 * 
 * @param obj - Object to partition
 * @param predicate - Partition function
 * @returns Object with [truthy, falsy] objects
 */
export function partitionObject<T>(
  obj: Record<string, T>,
  predicate: (value: T, key: string) => boolean
): [Record<string, T>, Record<string, T>] {
  const truthy: Record<string, T> = {};
  const falsy: Record<string, T> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (predicate(value, key)) {
      truthy[key] = value;
    } else {
      falsy[key] = value;
    }
  }
  
  return [truthy, falsy];
}