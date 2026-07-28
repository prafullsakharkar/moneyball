/**
 * Unit Tests for Format Utilities
 * ================================
 * 
 * Tests for number formatting, currency formatting, and duration formatting utilities.
 */

import { describe, it, expect } from 'vitest';
import { formatNumber, formatCurrency, formatDuration, formatDateString, formatTime, formatCompactNumber } from '../format';

describe('formatNumber', () => {
  it('should format a number with default locale', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('should format a number with decimal places', () => {
    expect(formatNumber(1234.567, 'en-US', 2, 2)).toBe('1,234.57');
  });

  it('should format a number with different locale', () => {
    expect(formatNumber(1234567, 'de-DE')).toBe('1.234.567');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('should handle negative numbers', () => {
    expect(formatNumber(-1234567)).toBe('-1,234,567');
  });
});

describe('formatCurrency', () => {
  it('should format currency with USD', () => {
    expect(formatCurrency(1234567, 'USD')).toBe('$1,234,567.00');
  });

  it('should format currency with INR', () => {
    expect(formatCurrency(1234567, 'INR')).toBe('₹12,34,567.00');
  });

  it('should format currency with EUR', () => {
    expect(formatCurrency(1234567, 'EUR')).toBe('€1.234.567,00');
  });

  it('should format small amounts', () => {
    expect(formatCurrency(100, 'USD')).toBe('$100.00');
  });

  it('should format zero', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });
});

describe('formatCompactNumber', () => {
  it('should format large numbers with K suffix', () => {
    expect(formatCompactNumber(1500)).toBe('1.5K');
  });

  it('should format large numbers with M suffix', () => {
    expect(formatCompactNumber(1500000)).toBe('1.5M');
  });

  it('should format small numbers without suffix', () => {
    expect(formatCompactNumber(500)).toBe('500');
  });
});

describe('formatDuration', () => {
  it('should format duration in minutes and seconds', () => {
    expect(formatDuration(150)).toBe('2m 30s');
  });

  it('should format duration in hours and minutes', () => {
    expect(formatDuration(1500)).toBe('25h 0m 0s');
  });

  it('should format duration with zero seconds', () => {
    expect(formatDuration(120)).toBe('2m 0s');
  });

  it('should handle zero duration', () => {
    expect(formatDuration(0)).toBe('0s');
  });

  it('should handle negative duration', () => {
    expect(formatDuration(-10)).toBe('0s');
  });
});

describe('formatDateString', () => {
  it('should format date with default format', () => {
    expect(formatDateString('2024-01-15')).toBe('January 15, 2024');
  });

  it('should format date with different locale', () => {
    expect(formatDateString('2024-01-15', 'en-GB')).toBe('15 January 2024');
  });

  it('should handle invalid date', () => {
    expect(formatDateString('invalid')).toBe('Invalid Date');
  });
});

describe('formatTime', () => {
  it('should format time in HH:mm format', () => {
    expect(formatTime('2024-01-15T14:30:00')).toBe('2:30 PM');
  });

  it('should format time with seconds', () => {
    expect(formatTime('2024-01-15T14:30:45', 'en-US', true)).toBe('2:30:45 PM');
  });

  it('should handle invalid date', () => {
    expect(formatTime('invalid')).toBe('Invalid Date');
  });
});
