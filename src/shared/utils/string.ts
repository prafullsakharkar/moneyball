// String utilities

// Case options
export type CaseType = 'camel' | 'pascal' | 'kebab' | 'snake' | 'upper' | 'lower' | 'title' | 'capital';

/**
 * Check if value is a string
 * 
 * @param value - Value to check
 * @returns True if value is a string
 */
export function isString(value: any): value is string {
  return typeof value === 'string' || value instanceof String;
}

/**
 * Check if string is empty
 * 
 * @param str - String to check
 * @returns True if string is empty
 */
export function isEmpty(str: string): boolean {
  return str.length === 0;
}

/**
 * Check if string is not empty
 * 
 * @param str - String to check
 * @returns True if string is not empty
 */
export function isNotEmpty(str: string): boolean {
  return str.length > 0;
}

/**
 * Get string length
 * 
 * @param str - String to get length of
 * @returns String length
 */
export function length(str: string): number {
  return str.length;
}

/**
 * Check if string contains a substring
 * 
 * @param str - String to search
 * @param substr - Substring to find
 * @param caseSensitive - Case sensitive search
 * @returns True if string contains substring
 */
export function contains(str: string, substr: string, caseSensitive: boolean = true): boolean {
  if (!caseSensitive) {
    str = str.toLowerCase();
    substr = substr.toLowerCase();
  }
  return str.includes(substr);
}

/**
 * Check if string starts with a prefix
 * 
 * @param str - String to check
 * @param prefix - Prefix to find
 * @param caseSensitive - Case sensitive check
 * @returns True if string starts with prefix
 */
export function startsWith(str: string, prefix: string, caseSensitive: boolean = true): boolean {
  if (!caseSensitive) {
    str = str.toLowerCase();
    prefix = prefix.toLowerCase();
  }
  return str.startsWith(prefix);
}

/**
 * Check if string ends with a suffix
 * 
 * @param str - String to check
 * @param suffix - Suffix to find
 * @param caseSensitive - Case sensitive check
 * @returns True if string ends with suffix
 */
export function endsWith(str: string, suffix: string, caseSensitive: boolean = true): boolean {
  if (!caseSensitive) {
    str = str.toLowerCase();
    suffix = suffix.toLowerCase();
  }
  return str.endsWith(suffix);
}

/**
 * Trim whitespace from string
 * 
 * @param str - String to trim
 * @returns Trimmed string
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * Trim left whitespace from string
 * 
 * @param str - String to trim
 * @returns String with left whitespace trimmed
 */
export function trimLeft(str: string): string {
  return str.trimStart();
}

/**
 * Trim right whitespace from string
 * 
 * @param str - String to trim
 * @returns String with right whitespace trimmed
 */
export function trimRight(str: string): string {
  return str.trimEnd();
}

/**
 * Remove all whitespace from string
 * 
 * @param str - String to clean
 * @returns String without whitespace
 */
export function removeWhitespace(str: string): string {
  return str.replace(/\s+/g, '');
}

/**
 * Remove special characters from string
 * 
 * @param str - String to clean
 * @param allowed - Allowed characters (regex pattern)
 * @returns String without special characters
 */
export function removeSpecialChars(str: string, allowed: string = ''): string {
  const regex = allowed ? new RegExp(`[^a-zA-Z0-9${allowed}\\s]`, 'g') : /[^a-zA-Z0-9\s]/g;
  return str.replace(regex, '');
}

/**
 * Escape special regex characters in string
 * 
 * @param str - String to escape
 * @returns Escaped string
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Replace all occurrences of a substring
 * 
 * @param str - String to replace in
 * @param search - Substring to replace
 * @param replacement - Replacement string
 * @returns String with replacements
 */
export function replaceAll(str: string, search: string, replacement: string): string {
  return str.replace(new RegExp(escapeRegExp(search), 'g'), replacement);
}

/**
 * Repeat a string multiple times
 * 
 * @param str - String to repeat
 * @param count - Number of times to repeat
 * @returns Repeated string
 */
export function repeat(str: string, count: number): string {
  return str.repeat(count);
}

/**
 * Pad string on the left
 * 
 * @param str - String to pad
 * @param targetLength - Target length
 * @param padChar - Character to pad with
 * @returns Padded string
 */
export function padLeft(str: string, targetLength: number, padChar: string = ' '): string {
  if (str.length >= targetLength) return str;
  return padChar.repeat(targetLength - str.length) + str;
}

/**
 * Pad string on the right
 * 
 * @param str - String to pad
 * @param targetLength - Target length
 * @param padChar - Character to pad with
 * @returns Padded string
 */
export function padRight(str: string, targetLength: number, padChar: string = ' '): string {
  if (str.length >= targetLength) return str;
  return str + padChar.repeat(targetLength - str.length);
}

/**
 * Pad string on both sides
 * 
 * @param str - String to pad
 * @param targetLength - Target length
 * @param padChar - Character to pad with
 * @returns Padded string
 */
export function padBoth(str: string, targetLength: number, padChar: string = ' '): string {
  if (str.length >= targetLength) return str;
  
  const padding = targetLength - str.length;
  const leftPadding = Math.floor(padding / 2);
  const rightPadding = padding - leftPadding;
  
  return padChar.repeat(leftPadding) + str + padChar.repeat(rightPadding);
}

/**
 * Get a substring from a string
 * 
 * @param str - String to get from
 * @param start - Start position
 * @param end - End position (optional)
 * @returns Substring
 */
export function substring(str: string, start: number, end?: number): string {
  return str.substring(start, end);
}

/**
 * Get a character at a specific position
 * 
 * @param str - String to get from
 * @param index - Character index
 * @returns Character at index
 */
export function charAt(str: string, index: number): string {
  return str.charAt(index);
}

/**
 * Get the ASCII value of a character
 * 
 * @param str - String to get from (first character)
 * @returns ASCII value
 */
export function charCode(str: string): number {
  return str.charCodeAt(0);
}

/**
 * Convert to uppercase
 * 
 * @param str - String to convert
 * @returns Uppercase string
 */
export function toUpper(str: string): string {
  return str.toUpperCase();
}

/**
 * Convert to lowercase
 * 
 * @param str - String to convert
 * @returns Lowercase string
 */
export function toLower(str: string): string {
  return str.toLowerCase();
}

/**
 * Convert to title case
 * 
 * @param str - String to convert
 * @returns Title case string
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

/**
 * Convert to camel case
 * 
 * @param str - String to convert
 * @returns Camel case string
 */
export function toCamelCase(str: string): string {
  if (isEmpty(str)) return str;
  
  const parts = str
    .replace(/([_-])+(\w)/g, ' $1$2')
    .replace(/([A-Z])(?=[a-z])/g, ' $1')
    .split(/[\s_-]+/)
    .filter(Boolean);
  
  if (parts.length === 0) return '';
  
  return parts[0].toLowerCase() + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
}

/**
 * Convert to pascal case
 * 
 * @param str - String to convert
 * @returns Pascal case string
 */
export function toPascalCase(str: string): string {
  const camelCase = toCamelCase(str);
  return isEmpty(camelCase) ? '' : camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

/**
 * Convert to kebab case
 * 
 * @param str - String to convert
 * @returns Kebab case string
 */
export function toKebabCase(str: string): string {
  if (isEmpty(str)) return str;
  
  const camelCase = toCamelCase(str);
  return camelCase.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Convert to snake case
 * 
 * @param str - String to convert
 * @returns Snake case string
 */
export function toSnakeCase(str: string): string {
  if (isEmpty(str)) return str;
  
  const camelCase = toCamelCase(str);
  return camelCase.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * Capitalize first letter of each word
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalize first letter of each word (title case)
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Uncapitalize first letter
 * 
 * @param str - String to uncapitalize
 * @returns Uncapitalized string
 */
export function uncapitalize(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Reverse a string
 * 
 * @param str - String to reverse
 * @returns Reversed string
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Check if string is a palindrome
 * 
 * @param str - String to check
 * @returns True if string is a palindrome
 */
export function isPalindrome(str: string): boolean {
  const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return cleaned === reverse(cleaned);
}

/**
 * Generate a random string
 * 
 * @param length - Length of string
 * @param chars - Characters to use (optional)
 * @returns Random string
 */
export function randomString(
  length: number,
  chars: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a unique ID
 * 
 * @param prefix - Prefix for ID
 * @returns Unique ID
 */
export function uniqueId(prefix: string = ''): string {
  const suffix = Math.random().toString(36).substring(2, 15);
  return `${prefix}${suffix}`;
}

/**
 * Convert string to number
 * 
 * @param str - String to convert
 * @param defaultValue - Default value if conversion fails
 * @returns Number or default value
 */
export function toNumber(str: string, defaultValue: number = 0): number {
  const num = Number(str);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Convert string to boolean
 * 
 * @param str - String to convert
 * @returns Boolean value
 */
export function toBoolean(str: string): boolean {
  const lower = str.toLowerCase();
  return ['true', '1', 'yes', 'on'].includes(lower);
}

/**
 * Format string with placeholders
 * 
 * @param str - String with placeholders
 * @param values - Values to insert
 * @returns Formatted string
 */
export function format(str: string, ...values: any[]): string {
  return str.replace(/\{(\d+)\}/g, (_, index) => {
    const num = Number(index);
    return values[num] !== undefined ? String(values[num]) : '';
  });
}

/**
 * Truncate string to a maximum length
 * 
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add if truncated
 * @returns Truncated string
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Truncate string from the middle
 * 
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @param separator - Separator to use in middle
 * @returns Truncated string
 */
export function truncateMiddle(str: string, maxLength: number, separator: string = '...'): string {
  if (str.length <= maxLength) return str;
  
  const start = Math.ceil(maxLength / 2) - Math.ceil(separator.length / 2);
  const end = str.length - Math.floor(maxLength / 2) + Math.floor(separator.length / 2);
  
  return str.slice(0, start) + separator + str.slice(end);
}

/**
 * Convert string to slug
 * 
 * @param str - String to convert
 * @returns Slug string
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Count occurrences of a substring
 * 
 * @param str - String to search
 * @param substr - Substring to count
 * @returns Number of occurrences
 */
export function countOccurrences(str: string, substr: string): number {
  if (substr.length === 0) return 0;
  let count = 0;
  let pos = 0;
  
  while (true) {
    pos = str.indexOf(substr, pos);
    if (pos === -1) break;
    count++;
    pos += substr.length;
  }
  
  return count;
}

/**
 * Count words in a string
 * 
 * @param str - String to count
 * @returns Word count
 */
export function wordCount(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Count sentences in a string
 * 
 * @param str - String to count
 * @returns Sentence count
 */
export function sentenceCount(str: string): number {
  return str.split(/[.!?]+/).filter(Boolean).length;
}

/**
 * Check if string is numeric
 * 
 * @param str - String to check
 * @returns True if string is numeric
 */
export function isNumeric(str: string): boolean {
  return !isNaN(parseFloat(str)) && isFinite(Number(str));
}

/**
 * Check if string contains only letters
 * 
 * @param str - String to check
 * @returns True if string contains only letters
 */
export function isAlpha(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

/**
 * Check if string contains only alphanumeric characters
 * 
 * @param str - String to check
 * @returns True if string contains only alphanumeric characters
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * Check if string contains only digits
 * 
 * @param str - String to check
 * @returns True if string contains only digits
 */
export function isDigit(str: string): boolean {
  return /^[0-9]+$/.test(str);
}

/**
 * Get Levenshtein distance between two strings
 * 
 * @param a - First string
 * @param b - Second string
 * @returns Levenshtein distance
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Get similarity ratio between two strings
 * 
 * @param a - First string
 * @param b - Second string
 * @returns Similarity ratio (0-1)
 */
export function similarity(a: string, b: string): number {
  if (a.length === 0 && b.length === 0) return 1;
  if (a.length === 0 || b.length === 0) return 0;
  
  const maxLen = Math.max(a.length, b.length);
  const distance = levenshteinDistance(a, b);
  
  return 1 - distance / maxLen;
}

/**
 * Wrap string with characters
 * 
 * @param str - String to wrap
 * @param prefix - Prefix to add
 * @param suffix - Suffix to add
 * @returns Wrapped string
 */
export function wrap(str: string, prefix: string, suffix: string = prefix): string {
  return prefix + str + suffix;
}

/**
 * Wrap string with quotes
 * 
 * @param str - String to wrap
 * @param quoteChar - Quote character
 * @returns Quoted string
 */
export function quote(str: string, quoteChar: '"' | "'" = '"'): string {
  return wrap(str, quoteChar, quoteChar);
}

/**
 * Unwrap string from characters
 * 
 * @param str - String to unwrap
 * @param chars - Characters to remove
 * @returns Unwrapped string
 */
export function unwrap(str: string, chars: string): string {
  const first = chars[0];
  const last = chars[1] || first;
  
  if (str.startsWith(first) && str.endsWith(last)) {
    return str.slice(1, -1);
  }
  
  return str;
}

/**
 * Get the first n characters of a string
 * 
 * @param str - String to get from
 * @param n - Number of characters
 * @returns First n characters
 */
export function first(str: string, n: number): string {
  return str.slice(0, n);
}

/**
 * Get the last n characters of a string
 * 
 * @param str - String to get from
 * @param n - Number of characters
 * @returns Last n characters
 */
export function last(str: string, n: number): string {
  return str.slice(-n);
}

/**
 * Split string into chunks
 * 
 * @param str - String to split
 * @param chunkSize - Size of each chunk
 * @returns Array of chunks
 */
export function chunk(str: string, chunkSize: number): string[] {
  if (chunkSize <= 0) return [];
  
  const result: string[] = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    result.push(str.slice(i, i + chunkSize));
  }
  
  return result;
}

/**
 * Split string by a delimiter with limit
 * 
 * @param str - String to split
 * @param delimiter - Delimiter to split by
 * @param limit - Maximum number of splits
 * @returns Array of parts
 */
export function splitLimit(str: string, delimiter: string, limit: number): string[] {
  if (limit <= 0) return [];
  
  const parts = str.split(delimiter);
  return parts.slice(0, limit);
}

/**
 * Join array of strings with a delimiter
 * 
 * @param parts - Array of strings
 * @param delimiter - Delimiter to join with
 * @returns Joined string
 */
export function join(parts: string[], delimiter: string = ','): string {
  return parts.join(delimiter);
}

/**
 * Join array of strings with a delimiter and final separator
 * 
 * @param parts - Array of strings
 * @param delimiter - Delimiter between items
 * @param final - Final separator before last item
 * @returns Joined string
 */
export function joinWithFinal(
  parts: string[],
  delimiter: string = ', ',
  final: string = ' and '
): string {
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  
  const lastItem = parts[parts.length - 1];
  const otherItems = parts.slice(0, -1);
  
  return join(otherItems, delimiter) + final + lastItem;
}

/**
 * Check if string is a valid email
 * 
 * @param str - String to validate
 * @returns True if string is a valid email
 */
export function isEmail(str: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
}

/**
 * Check if string is a valid URL
 * 
 * @param str - String to validate
 * @returns True if string is a valid URL
 */
export function isURL(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if string is a valid phone number
 * 
 * @param str - String to validate
 * @param country - Country code (optional)
 * @returns True if string is a valid phone number
 */
export function isPhone(str: string, country: string = 'US'): boolean {
  // Basic phone number validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(str.replace(/\D/g, ''));
}

/**
 * Mask a string (show only first and last n characters)
 * 
 * @param str - String to mask
 * @param visible - Number of visible characters at each end
 * @param maskChar - Character to use for masking
 * @returns Masked string
 */
export function mask(str: string, visible: number = 2, maskChar: string = '*'): string {
  if (str.length <= visible * 2) return maskChar.repeat(str.length);
  
  const start = str.slice(0, visible);
  const end = str.slice(-visible);
  const middleLength = str.length - visible * 2;
  
  return start + maskChar.repeat(middleLength) + end;
}

/**
 * Get string entropy (measure of randomness)
 * 
 * @param str - String to check
 * @returns Entropy value
 */
export function entropy(str: string): number {
  if (str.length === 0) return 0;
  
  const frequencies: Record<string, number> = {};
  
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  
  let entropy = 0;
  const length = str.length;
  
  for (const char of Object.keys(frequencies)) {
    const frequency = frequencies[char] / length;
    entropy -= frequency * Math.log2(frequency);
  }
  
  return entropy;
}

/**
 * Convert string to base64
 * 
 * @param str - String to convert
 * @returns Base64 encoded string
 */
export function toBase64(str: string): string {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
  } catch {
    return '';
  }
}

/**
 * Decode base64 string
 * 
 * @param str - Base64 string to decode
 * @returns Decoded string
 */
export function fromBase64(str: string): string {
  try {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));
  } catch {
    return '';
  }
}