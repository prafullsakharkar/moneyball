// Date manipulation utilities

import { isValidDate } from './validation';

// Date format patterns
export type DateFormat = 
  | 'short' 
  | 'medium' 
  | 'long' 
  | 'full' 
  | 'iso' 
  | 'custom'
  | 'relative';

// Date range interface
export interface DateRange {
  start: Date;
  end: Date;
}

// Date options interface
export interface DateOptions {
  locale?: string;
  format?: DateFormat;
  includeTime?: boolean;
  timezone?: string;
}

/**
 * Get today's date
 * 
 * @param options - Date options
 * @returns Today's date
 */
export function getToday(options: DateOptions = {}): Date {
  const { timezone } = options;
  
  if (timezone) {
    const now = new Date();
    return new Date(
      now.toLocaleString('en-US', { timeZone: timezone }),
    );
  }
  
  return new Date();
}

/**
 * Get yesterday's date
 * 
 * @param options - Date options
 * @returns Yesterday's date
 */
export function getYesterday(options: DateOptions = {}): Date {
  const today = getToday(options);
  return addDays(today, -1);
}

/**
 * Get tomorrow's date
 * 
 * @param options - Date options
 * @returns Tomorrow's date
 */
export function getTomorrow(options: DateOptions = {}): Date {
  const today = getToday(options);
  return addDays(today, 1);
}

/**
 * Get the start of the day
 * 
 * @param date - The date
 * @returns Date at start of day (00:00:00)
 */
export function getStartOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
}

/**
 * Get the end of the day
 * 
 * @param date - The date
 * @returns Date at end of day (23:59:59)
 */
export function getEndOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23, 59, 59, 999);
}

/**
 * Get the start of the week (Monday)
 * 
 * @param date - The date
 * @returns Date at start of week
 */
export function getStartOfWeek(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const day = dateObj.getDay();
  const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1);
  
  return getStartOfDay(new Date(dateObj.setDate(diff)));
}

/**
 * Get the end of the week (Sunday)
 * 
 * @param date - The date
 * @returns Date at end of week
 */
export function getEndOfWeek(date: Date | string): Date {
  const startOfWeek = getStartOfWeek(date);
  return addDays(startOfWeek, 6);
}

/**
 * Get the start of the month
 * 
 * @param date - The date
 * @returns Date at start of month
 */
export function getStartOfMonth(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
}

/**
 * Get the end of the month
 * 
 * @param date - The date
 * @returns Date at end of month
 */
export function getEndOfMonth(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Get the start of the year
 * 
 * @param date - The date
 * @returns Date at start of year
 */
export function getStartOfYear(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Date(dateObj.getFullYear(), 0, 1);
}

/**
 * Get the end of the year
 * 
 * @param date - The date
 * @returns Date at end of year
 */
export function getEndOfYear(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Date(dateObj.getFullYear(), 11, 31, 23, 59, 59, 999);
}

/**
 * Add days to a date
 * 
 * @param date - The date
 * @param days - Number of days to add
 * @returns New date with added days
 */
export function addDays(date: Date | string, days: number): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const result = new Date(dateObj);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Subtract days from a date
 * 
 * @param date - The date
 * @param days - Number of days to subtract
 * @returns New date with subtracted days
 */
export function subtractDays(date: Date | string, days: number): Date {
  return addDays(date, -days);
}

/**
 * Add weeks to a date
 * 
 * @param date - The date
 * @param weeks - Number of weeks to add
 * @returns New date with added weeks
 */
export function addWeeks(date: Date | string, weeks: number): Date {
  return addDays(date, weeks * 7);
}

/**
 * Subtract weeks from a date
 * 
 * @param date - The date
 * @param weeks - Number of weeks to subtract
 * @returns New date with subtracted weeks
 */
export function subtractWeeks(date: Date | string, weeks: number): Date {
  return addWeeks(date, -weeks);
}

/**
 * Add months to a date
 * 
 * @param date - The date
 * @param months - Number of months to add
 * @returns New date with added months
 */
export function addMonths(date: Date | string, months: number): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const result = new Date(dateObj);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Subtract months from a date
 * 
 * @param date - The date
 * @param months - Number of months to subtract
 * @returns New date with subtracted months
 */
export function subtractMonths(date: Date | string, months: number): Date {
  return addMonths(date, -months);
}

/**
 * Add years to a date
 * 
 * @param date - The date
 * @param years - Number of years to add
 * @returns New date with added years
 */
export function addYears(date: Date | string, years: number): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const result = new Date(dateObj);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * Subtract years from a date
 * 
 * @param date - The date
 * @param years - Number of years to subtract
 * @returns New date with subtracted years
 */
export function subtractYears(date: Date | string, years: number): Date {
  return addYears(date, -years);
}

/**
 * Calculate the difference between two dates
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @param unit - The unit of measurement (days, weeks, months, years)
 * @returns Difference in the specified unit
 */
export function getDifference(
  startDate: Date | string,
  endDate: Date | string,
  unit: 'days' | 'weeks' | 'months' | 'years' = 'days'
): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  
  switch (unit) {
    case 'days':
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    case 'weeks':
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    case 'months':
      return (end.getFullYear() - start.getFullYear()) * 12 + 
             (end.getMonth() - start.getMonth());
    case 'years':
      return end.getFullYear() - start.getFullYear();
    default:
      return 0;
  }
}

/**
 * Check if a date is in the past
 * 
 * @param date - The date to check
 * @returns True if the date is in the past
 */
export function isPast(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getTime() < new Date().getTime();
}

/**
 * Check if a date is in the future
 * 
 * @param date - The date to check
 * @returns True if the date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getTime() > new Date().getTime();
}

/**
 * Check if a date is today
 * 
 * @param date - The date to check
 * @returns True if the date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return dateObj.getDate() === today.getDate() &&
         dateObj.getMonth() === today.getMonth() &&
         dateObj.getFullYear() === today.getFullYear();
}

/**
 * Check if a date is yesterday
 * 
 * @param date - The date to check
 * @returns True if the date is yesterday
 */
export function isYesterday(date: Date | string): boolean {
  const yesterday = addDays(new Date(), -1);
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.getDate() === yesterday.getDate() &&
         dateObj.getMonth() === yesterday.getMonth() &&
         dateObj.getFullYear() === yesterday.getFullYear();
}

/**
 * Check if a date is tomorrow
 * 
 * @param date - The date to check
 * @returns True if the date is tomorrow
 */
export function isTomorrow(date: Date | string): boolean {
  const tomorrow = addDays(new Date(), 1);
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.getDate() === tomorrow.getDate() &&
         dateObj.getMonth() === tomorrow.getMonth() &&
         dateObj.getFullYear() === tomorrow.getFullYear();
}

/**
 * Check if a date is between two dates
 * 
 * @param date - The date to check
 * @param startDate - Start date
 * @param endDate - End date
 * @returns True if the date is between the two dates
 */
export function isBetween(
  date: Date | string,
  startDate: Date | string,
  endDate: Date | string
): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  return dateObj.getTime() >= start.getTime() && 
         dateObj.getTime() <= end.getTime();
}

/**
 * Get the day of the week name
 * 
 * @param date - The date
 * @param locale - The locale string
 * @param format - Short or long format
 * @returns Day of week name
 */
export function getDayName(
  date: Date | string,
  locale: string = 'en-US',
  format: 'short' | 'long' = 'long'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = { 
    weekday: format,
  };
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Get the month name
 * 
 * @param date - The date
 * @param locale - The locale string
 * @param format - Short or long format
 * @returns Month name
 */
export function getMonthName(
  date: Date | string,
  locale: string = 'en-US',
  format: 'short' | 'long' = 'long'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = { 
    month: format,
  };
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Get the number of days in a month
 * 
 * @param year - The year
 * @param month - The month (0-11)
 * @returns Number of days in the month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the week number of the year
 * 
 * @param date - The date
 * @returns Week number (1-53)
 */
export function getWeekNumber(date: Date | string): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
  const days = Math.floor((dateObj.getTime() - startOfYear.getTime()) / 
    (24 * 60 * 60 * 1000));
  
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

/**
 * Format a date to a string
 * 
 * @param date - The date to format
 * @param format - The format string or preset
 * @param locale - The locale string
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format: DateFormat = 'short',
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  switch (format) {
    case 'short':
      return new Intl.DateTimeFormat(locale, {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      }).format(dateObj);
      
    case 'medium':
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(dateObj);
      
    case 'long':
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateObj);
      
    case 'full':
      return new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateObj);
      
    case 'iso':
      return dateObj.toISOString();
      
    case 'relative':
      return getRelativeTime(dateObj, locale);
      
    default:
      return dateObj.toDateString();
  }
}

/**
 * Format a date with time
 * 
 * @param date - The date to format
 * @param locale - The locale string
 * @param includeSeconds - Whether to include seconds
 * @returns Formatted date and time string
 */
export function formatDateTime(
  date: Date | string,
  locale: string = 'en-US',
  includeSeconds: boolean = false
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  if (includeSeconds) {
    options.second = '2-digit';
  }
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * 
 * @param date - The date
 * @param locale - The locale string
 * @returns Relative time string
 */
export function getRelativeTime(
  date: Date | string,
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
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
 * Parse a date string to Date object
 * 
 * @param dateString - The date string to parse
 * @returns Date object or null if invalid
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return null;
  
  return dateObj;
}

/**
 * Create a date range from start and end dates
 * 
 * @param startDate - Start date string or Date
 * @param endDate - End date string or Date
 * @returns DateRange object
 */
export function createDateRange(
  startDate: string | Date,
  endDate: string | Date
): DateRange | null {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  if (start > end) return null;
  
  return { start, end };
}

/**
 * Check if a date range is valid
 * 
 * @param range - The date range to check
 * @returns True if the range is valid
 */
export function isValidDateRange(range: DateRange): boolean {
  return range.start.getTime() <= range.end.getTime();
}

/**
 * Check if a date is within a range
 * 
 * @param date - The date to check
 * @param range - The date range
 * @returns True if the date is within the range
 */
export function isDateInRange(
  date: Date | string,
  range: DateRange
): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.getTime() >= range.start.getTime() && 
         dateObj.getTime() <= range.end.getTime();
}

/**
 * Get the current timestamp
 * 
 * @returns Current timestamp in milliseconds
 */
export function getTimestamp(): number {
  return Date.now();
}

/**
 * Get the current Unix timestamp
 * 
 * @returns Current Unix timestamp in seconds
 */
export function getUnixTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Convert timestamp to Date object
 * 
 * @param timestamp - The timestamp in milliseconds
 * @returns Date object
 */
export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp);
}

/**
 * Convert Unix timestamp to Date object
 * 
 * @param timestamp - The Unix timestamp in seconds
 * @returns Date object
 */
export function unixTimestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

/**
 * Generate an array of dates between two dates
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @param step - Step in days (default: 1)
 * @returns Array of dates
 */
export function getDatesInRange(
  startDate: Date | string,
  endDate: Date | string,
  step: number = 1
): Date[] {
  const dates: Date[] = [];
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  let current = getStartOfDay(start);
  
  while (current.getTime() <= end.getTime()) {
    dates.push(new Date(current));
    current = addDays(current, step);
  }
  
  return dates;
}

/**
 * Generate months between two dates
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of months
 */
export function getMonthsInRange(
  startDate: Date | string,
  endDate: Date | string
): { year: number; month: number; monthName: string }[] {
  const months: { year: number; month: number; monthName: string }[] = [];
  const start = getStartOfMonth(startDate);
  const end = getStartOfMonth(endDate);
  
  let current = new Date(start);
  
  while (current.getTime() <= end.getTime()) {
    months.push({
      year: current.getFullYear(),
      month: current.getMonth(),
      monthName: getMonthName(current),
    });
    
    current = addMonths(current, 1);
  }
  
  return months;
}