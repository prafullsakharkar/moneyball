// Form validation utilities

// Validation result interface
export interface ValidationResult {
  valid: boolean;
  error?: string;
  message?: string;
}

// Validation rules
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  alphanumeric?: boolean;
  date?: boolean;
}

// Validation error types
export type ValidationError = 
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'min'
  | 'max'
  | 'pattern'
  | 'email'
  | 'phone'
  | 'url'
  | 'alphanumeric'
  | 'date'
  | 'invalid';

/**
 * Email regex pattern
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Phone regex pattern (US format)
 */
export const PHONE_REGEX = /^[\d\s\-\+\(\)]{10,}$/;

/**
 * URL regex pattern
 */
export const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

/**
 * Alphanumeric regex pattern
 */
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

/**
 * Date regex pattern
 */
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validate email address
 * 
 * @param email - The email to validate
 * @returns True if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validate phone number
 * 
 * @param phone - The phone number to validate
 * @returns True if valid, false otherwise
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

/**
 * Validate URL
 * 
 * @param url - The URL to validate
 * @returns True if valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return URL_REGEX.test(url);
  }
}

/**
 * Validate alphanumeric string
 * 
 * @param str - The string to validate
 * @returns True if valid, false otherwise
 */
export function isValidAlphanumeric(str: string): boolean {
  if (!str) return false;
  return ALPHANUMERIC_REGEX.test(str);
}

/**
 * Validate date string
 * 
 * @param date - The date string to validate
 * @returns True if valid, false otherwise
 */
export function isValidDate(date: string): boolean {
  if (!date) return false;
  if (!DATE_REGEX.test(date)) return false;
  
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
}

/**
 * Validate string length
 * 
 * @param str - The string to validate
 * @param rules - Validation rules
 * @returns Validation result
 */
export function validateString(
  str: string,
  rules: ValidationRules = {}
): ValidationResult {
  if (rules.required && (!str || str.trim() === '')) {
    return { valid: false, error: 'required', message: 'This field is required' };
  }

  if (!str) return { valid: true };

  const trimmedStr = str.trim();

  if (rules.minLength && trimmedStr.length < rules.minLength) {
    return { 
      valid: false, 
      error: 'minLength',
      message: `Must be at least ${rules.minLength} characters` 
    };
  }

  if (rules.maxLength && trimmedStr.length > rules.maxLength) {
    return { 
      valid: false, 
      error: 'maxLength',
      message: `Must be at most ${rules.maxLength} characters` 
    };
  }

  if (rules.pattern && !rules.pattern.test(trimmedStr)) {
    return { 
      valid: false, 
      error: 'pattern',
      message: 'Invalid format' 
    };
  }

  if (rules.email && !isValidEmail(trimmedStr)) {
    return { 
      valid: false, 
      error: 'email',
      message: 'Invalid email address' 
    };
  }

  if (rules.phone && !isValidPhone(trimmedStr)) {
    return { 
      valid: false, 
      error: 'phone',
      message: 'Invalid phone number' 
    };
  }

  if (rules.url && !isValidUrl(trimmedStr)) {
    return { 
      valid: false, 
      error: 'url',
      message: 'Invalid URL' 
    };
  }

  if (rules.alphanumeric && !isValidAlphanumeric(trimmedStr)) {
    return { 
      valid: false, 
      error: 'alphanumeric',
      message: 'Only letters and numbers allowed' 
    };
  }

  return { valid: true };
}

/**
 * Validate number
 * 
 * @param value - The number to validate
 * @param rules - Validation rules
 * @returns Validation result
 */
export function validateNumber(
  value: number | string,
  rules: ValidationRules = {}
): ValidationResult {
  if (rules.required && (value === undefined || value === null || value === '')) {
    return { valid: false, error: 'required', message: 'This field is required' };
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { valid: false, error: 'invalid', message: 'Must be a valid number' };
  }

  if (rules.min !== undefined && num < rules.min) {
    return { 
      valid: false, 
      error: 'min',
      message: `Must be at least ${rules.min}` 
    };
  }

  if (rules.max !== undefined && num > rules.max) {
    return { 
      valid: false, 
      error: 'max',
      message: `Must be at most ${rules.max}` 
    };
  }

  return { valid: true };
}

/**
 * Validate object against schema
 * 
 * @param obj - The object to validate
 * @param schema - The validation schema
 * @returns Object with validation results for each field
 */
export function validateObject(
  obj: Record<string, any>,
  schema: Record<string, ValidationRules>
): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = obj[field];
    results[field] = typeof value === 'string' 
      ? validateString(value, rules)
      : validateNumber(value, rules);
  }

  return results;
}

/**
 * Check if all validations pass
 * 
 * @param results - Validation results object
 * @returns True if all are valid, false otherwise
 */
export function isFormValid(results: Record<string, ValidationResult>): boolean {
  return Object.values(results).every((result) => result.valid);
}

/**
 * Get first error from validation results
 * 
 * @param results - Validation results object
 * @returns First error message or undefined
 */
export function getFirstError(results: Record<string, ValidationResult>): string | undefined {
  for (const result of Object.values(results)) {
    if (!result.valid) {
      return result.message;
    }
  }
  return undefined;
}

/**
 * Clear validation errors
 * 
 * @param results - Validation results to clear
 * @returns Object with all valid results
 */
export function clearValidationErrors(
  results: Record<string, ValidationResult>
): Record<string, ValidationResult> {
  return Object.entries(results).reduce((acc, [key]) => {
    acc[key] = { valid: true };
    return acc;
  }, {} as Record<string, ValidationResult>);
}

/**
 * Validate form data
 * 
 * @param data - The form data
 * @param rules - Validation rules
 * @returns Object with field names as keys and validation results as values
 */
export function validateForm(
  data: Record<string, any>,
  rules: Record<string, ValidationRules>
): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    results[field] = validateField(field, value, fieldRules);
  }

  return results;
}

/**
 * Validate a single field
 * 
 * @param field - Field name
 * @param value - Field value
 * @param rules - Validation rules
 * @returns Validation result
 */
export function validateField(
  field: string,
  value: any,
  rules: ValidationRules
): ValidationResult {
  if (value === undefined || value === null) {
    if (rules.required) {
      return { valid: false, error: 'required', message: `${field} is required` };
    }
    return { valid: true };
  }

  if (typeof value === 'string') {
    return validateString(value, rules);
  }

  if (typeof value === 'number') {
    return validateNumber(value, rules);
  }

  return { valid: true };
}