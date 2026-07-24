// Utility functions for formatting numbers, currency, dates, and times

// Format types
export type FormatType = 
  | 'currency' 
  | 'number' 
  | 'percentage' 
  | 'date' 
  | 'datetime' 
  | 'time' 
  | 'duration'
  | 'filesize';

export interface FormatOptions {
  type?: FormatType;
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Format a value based on the specified type
 * 
 * @param value - The value to format
 * @param options - Formatting options
 * @returns Formatted string
 */
export function formatValue(
  value: number | string | Date,
  options: FormatOptions = {}
): string {
  const { type = 'number', currency = 'USD', locale = 'en-US' } = options;

  switch (type) {
    case 'currency':
      return formatCurrency(Number(value), currency, locale);
    case 'number':
      return formatNumber(Number(value), locale);
    case 'percentage':
      return formatPercentage(Number(value), locale);
    case 'date':
      return formatDateString(value as string | Date, locale);
    case 'datetime':
      return formatDateTime(value as string | Date, locale);
    case 'time':
      return formatTime(value as string | Date, locale);
    case 'duration':
      return formatDuration(Number(value));
    case 'filesize':
      return formatFileSize(Number(value));
    default:
      return String(value);
  }
}

/**
 * Format currency with locale support
 * 
 * @param amount - The amount to format
 * @param currency - The currency code (USD, EUR, INR, etc.)
 * @param locale - The locale string
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format numbers with locale support and optional precision
 * 
 * @param number - The number to format
 * @param locale - The locale string
 * @param minimumFractionDigits - Minimum decimal places
 * @param maximumFractionDigits - Maximum decimal places
 * @returns Formatted number string
 */
export function formatNumber(
  number: number,
  locale: string = 'en-US',
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 2
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(number);
}

/**
 * Format a percentage value
 * 
 * @param value - The decimal value to format as percentage
 * @param locale - The locale string
 * @param precision - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number,
  locale: string = 'en-US',
  precision: number = 2
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value / 100);
}

/**
 * Format a number with commas as thousands separators
 * 
 * @param number - The number to format
 * @param locale - The locale string
 * @returns Formatted number string
 */
export function formatWithCommas(
  number: number | string,
  locale: string = 'en-US'
): string {
  const num = typeof number === 'string' ? parseFloat(number) : number;
  return formatNumber(num, locale);
}

/**
 * Format a number to a specific precision
 * 
 * @param number - The number to format
 * @param precision - Number of decimal places
 * @param locale - The locale string
 * @returns Formatted number string
 */
export function formatPrecision(
  number: number,
  precision: number = 2,
  locale: string = 'en-US'
): string {
  return formatNumber(number, locale, precision, precision);
}

/**
 * Format a large number with abbreviations (K, M, B, T)
 * 
 * @param number - The number to format
 * @param locale - The locale string
 * @returns Formatted abbreviated number string
 */
export function formatCompactNumber(
  number: number,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
}

/**
 * Format a file size into human-readable format
 * 
 * @param bytes - The file size in bytes
 * @param locale - The locale string
 * @returns Human-readable file size string
 */
export function formatFileSize(
  bytes: number,
  locale: string = 'en-US'
): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${formatPrecision(bytes / Math.pow(k, i), 2, locale)} ${sizes[i]}`;
}

/**
 * Format a time duration in seconds to human-readable format
 * 
 * @param seconds - Duration in seconds
 * @returns Human-readable duration string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Format a number with ordinal suffix (1st, 2nd, 3rd, etc.)
 * 
 * @param number - The number to format
 * @param locale - The locale string
 * @returns Formatted number with ordinal suffix
 */
export function formatOrdinal(
  number: number,
  locale: string = 'en-US'
): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = number % 100;
  const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  
  return `${number}${suffix}`;
}

/**
 * Format a number as a phone number (US format)
 * 
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(phoneNumber: string | number): string {
  const str = String(phoneNumber).replace(/\D/g, '');
  
  if (str.length === 10) {
    return `(${str.slice(0, 3)}) ${str.slice(3, 6)}-${str.slice(6)}`;
  }
  if (str.length === 11) {
    return `+1 (${str.slice(1, 4)}) ${str.slice(4, 7)}-${str.slice(7)}`;
  }
  
  return str;
}

/**
 * Format a credit card number with spaces
 * 
 * @param cardNumber - The card number to format
 * @returns Formatted card number string
 */
export function formatCardNumber(cardNumber: string | number): string {
  const str = String(cardNumber).replace(/\D/g, '');
  return str.replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * Format a social security number
 * 
 * @param ssn - The SSN to format
 * @returns Formatted SSN string
 */
export function formatSSN(ssn: string | number): string {
  const str = String(ssn).replace(/\D/g, '');
  return `***-**-${str.slice(-4)}`;
}

/**
 * Format a value with a prefix/suffix
 * 
 * @param value - The value to format
 * @param prefix - Prefix to add
 * @param suffix - Suffix to add
 * @returns Formatted string
 */
export function formatWithAffix(
  value: string | number,
  prefix: string = '',
  suffix: string = ''
): string {
  return `${prefix}${value}${suffix}`;
}

/**
 * Truncate a number to a specific number of decimal places without rounding
 * 
 * @param number - The number to truncate
 * @param decimals - Number of decimal places
 * @returns Truncated number
 */
export function truncateNumber(
  number: number,
  decimals: number = 2
): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(number * factor) / factor;
}

/**
 * Format a number with scientific notation
 * 
 * @param number - The number to format
 * @param decimals - Number of decimal places
 * @returns Scientific notation string
 */
export function formatScientific(
  number: number,
  decimals: number = 2
): string {
  return number.toExponential(decimals);
}

/**
 * Format a date string to a readable format
 * 
 * @param date - The date to format (string or Date object)
 * @param locale - The locale string
 * @returns Formatted date string
 */
export function formatDateString(
  date: string | Date,
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format a date and time
 * 
 * @param date - The date to format (string or Date object)
 * @param locale - The locale string
 * @returns Formatted date and time string
 */
export function formatDateTime(
  date: string | Date,
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format just the time portion
 * 
 * @param date - The date to format (string or Date object)
 * @param locale - The locale string
 * @param includeSeconds - Whether to include seconds
 * @returns Formatted time string
 */
export function formatTime(
  date: string | Date,
  locale: string = 'en-US',
  includeSeconds: boolean = false
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  
  if (includeSeconds) {
    options.second = '2-digit';
  }
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Get relative time format (e.g., "2 hours ago", "3 days ago")
 * 
 * @param date - The date to compare
 * @param locale - The locale string
 * @returns Relative time string
 */
export function formatRelativeTime(
  date: string | Date,
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  if (diffSec < 60) return rtf.format(-diffSec, 'second');
  if (diffMin < 60) return rtf.format(-diffMin, 'minute');
  if (diffHour < 24) return rtf.format(-diffHour, 'hour');
  if (diffDay < 7) return rtf.format(-diffDay, 'day');
  if (diffDay < 30) return rtf.format(-Math.floor(diffDay / 7), 'week');
  if (diffDay < 365) return rtf.format(-Math.floor(diffDay / 30), 'month');
  
  return rtf.format(-Math.floor(diffDay / 365), 'year');
}

/**
 * Format a date to ISO string
 * 
 * @param date - The date to format
 * @returns ISO date string
 */
export function formatISO(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
}

/**
 * Format a date to a short format (e.g., "1/1/24")
 * 
 * @param date - The date to format
 * @param locale - The locale string
 * @returns Short date string
 */
export function formatShortDate(
  date: string | Date,
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  return new Intl.DateTimeFormat(locale, {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}
