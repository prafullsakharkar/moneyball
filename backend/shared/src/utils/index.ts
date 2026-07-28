// Shared Utilities for CricketIQ Microservices

import { v4 as uuidv4 } from 'uuid';
import { validate as isValidUuid } from 'uuid';

// ID Generation
export const generateId = (): string => {
  return uuidv4();
};

export const isValidId = (id: string): boolean => {
  return isValidUuid(id);
};

// Date Utilities
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

export const formatDate = (date: string | Date, format: string = 'yyyy-MM-dd'): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return format
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day);
};

export const getDaysDifference = (date1: string | Date, date2: string | Date): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const addDays = (date: string | Date, days: number): string => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

// Validation Utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};

export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s'-]{2,100}$/;
  return nameRegex.test(name);
};

// String Utilities
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, letter => letter.toUpperCase());
};

export const truncate = (str: string, maxLength: number, suffix: string = '...'): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + suffix;
};

// Array Utilities
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (typeof value === 'object') {
      const hash = JSON.stringify(value);
      if (seen.has(hash)) return false;
      seen.add(hash);
    } else {
      if (seen.has(value as any)) return false;
      seen.add(value as any);
    }
    return true;
  });
};

// Object Utilities
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const mergeObjects = <T, U>(obj1: T, obj2: U): T & U => {
  return { ...obj1, ...obj2 };
};

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result: Partial<T> = {};
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result as Pick<T, K>;
};

// Pagination Utilities
export const calculatePagination = (page: number, limit: number, total: number) => {
  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasMore
  };
};

export const getOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

// Sorting Utilities
export const sortArray = <T>(array: T[], field: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];
    
    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : 1;
    return 0;
  });
};

// Error Handling
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: Error): { statusCode: number; code: string; message: string } => {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message
    };
  }
  
  return {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred'
  };
};

// File Utilities
export const generateFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop() || '';
  return `${timestamp}-${random}.${extension}`;
};

export const getFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Number Utilities
export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

export const formatCurrency = (amount: number, currency: string = 'USD', locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const calculatePercentage = (part: number, total: number, decimals: number = 2): number => {
  if (total === 0) return 0;
  return parseFloat(((part / total) * 100).toFixed(decimals));
};

// Cricket-Specific Utilities
export const calculateBattingAverage = (runs: number, dismissals: number): number => {
  if (dismissals === 0) return runs;
  return parseFloat((runs / dismissals).toFixed(2));
};

export const calculateStrikeRate = (runs: number, balls: number): number => {
  if (balls === 0) return 0;
  return parseFloat(((runs / balls) * 100).toFixed(2));
};

export const calculateEconomyRate = (runs: number, overs: number): number => {
  if (overs === 0) return 0;
  return parseFloat((runs / overs).toFixed(2));
};

export const calculateBowlingAverage = (runsConceded: number, wickets: number): number => {
  if (wickets === 0) return runsConceded;
  return parseFloat((runsConceded / wickets).toFixed(2));
};

export const getCricketFormatOvers = (format: string): number => {
  switch (format) {
    case 'Test': return 90;
    case 'ODI': return 50;
    case 'T20': return 20;
    case 'Hundred': return 20;
    default: return 50;
  }
};

// Validation Schemas (Zod)
import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
  search: z.string().optional(),
  filter: z.string().optional()
});

export const IdSchema = z.string().uuid();

export const NameSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50)
});

export const ContactSchema = z.object({
  phone: z.string().min(8).max(15),
  email: z.string().email()
});

export const AddressSchema = z.object({
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(1).max(100)
});

export const QueryParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
  search: z.string().optional(),
  filter: z.string().optional()
});

export type PaginationParams = z.infer<typeof PaginationSchema>;
export type QueryParams = z.infer<typeof QueryParamsSchema>;
