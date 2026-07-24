// Validation rules and constants

/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * URL validation regex
 */
export const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

/**
 * Phone number validation regex (international format)
 */
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

/**
 * Password validation regex
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Username validation regex
 */
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

/**
 * Name validation regex
 */
export const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;

/**
 * Alphanumeric validation regex
 */
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

/**
 * Numeric validation regex
 */
export const NUMERIC_REGEX = /^[0-9]+$/;

/**
 * Decimal validation regex
 */
export const DECIMAL_REGEX = /^-?\d+(\.\d+)?$/;

/**
 * UUID validation regex
 */
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Date format regex (YYYY-MM-DD)
 */
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Time format regex (HH:MM:SS)
 */
export const TIME_REGEX = /^\d{2}:\d{2}(:\d{2})?$/;

/**
 * Zip code validation regex
 */
export const ZIP_CODE_REGEX = /^\d{5}(-\d{4})?$/;

/**
 * State code validation regex (US)
 */
export const STATE_CODE_REGEX = /^(A[LKZR]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[AEDHINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$/;

/**
 * Credit card validation regex
 */
export const CREDIT_CARD_REGEX = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9]{2})[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;

/**
 * CVV validation regex
 */
export const CVV_REGEX = /^\d{3,4}$/;

/**
 * Expiry date regex (MM/YY)
 */
export const EXPIRY_DATE_REGEX = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;

/**
 * Social Security Number regex (US)
 */
export const SSN_REGEX = /^\d{3}-\d{2}-\d{4}$/;

/**
 * Regex patterns for validation
 */
export const REGEX_PATTERNS = {
  email: EMAIL_REGEX,
  url: URL_REGEX,
  phone: PHONE_REGEX,
  password: PASSWORD_REGEX,
  username: USERNAME_REGEX,
  name: NAME_REGEX,
  alphanumeric: ALPHANUMERIC_REGEX,
  numeric: NUMERIC_REGEX,
  decimal: DECIMAL_REGEX,
  uuid: UUID_REGEX,
  date: DATE_REGEX,
  time: TIME_REGEX,
  zipCode: ZIP_CODE_REGEX,
  stateCode: STATE_CODE_REGEX,
  creditCard: CREDIT_CARD_REGEX,
  cvv: CVV_REGEX,
  expiryDate: EXPIRY_DATE_REGEX,
  ssn: SSN_REGEX,
} as const;

/**
 * Validation error messages
 */
export const VALIDATION_MESSAGES = {
  /**
   * Required field
   */
  required: 'This field is required',
  
  /**
   * Minimum length
   */
  minLength: (min: number) => `Must be at least ${min} characters`,
  
  /**
   * Maximum length
   */
  maxLength: (max: number) => `Must be at most ${max} characters`,
  
  /**
   * Minimum value
   */
  min: (min: number) => `Must be at least ${min}`,
  
  /**
   * Maximum value
   */
  max: (max: number) => `Must be at most ${max}`,
  
  /**
   * Invalid email
   */
  email: 'Please enter a valid email address',
  
  /**
   * Invalid URL
   */
  url: 'Please enter a valid URL',
  
  /**
   * Invalid phone
   */
  phone: 'Please enter a valid phone number',
  
  /**
   * Invalid password
   */
  password: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  
  /**
   * Invalid username
   */
  username: 'Username must be 3-20 characters (letters, numbers, underscores)',
  
  /**
   * Invalid name
   */
  name: 'Name must be 2-50 characters (letters, spaces, hyphens, apostrophes)',
  
  /**
   * Invalid date
   */
  date: 'Please enter a valid date',
  
  /**
   * Invalid time
   */
  time: 'Please enter a valid time',
  
  /**
   * Invalid number
   */
  number: 'Please enter a valid number',
  
  /**
   * Invalid value
   */
  invalid: 'Please enter a valid value',
  
  /**
   * Not match
   */
  match: 'Values do not match',
  
  /**
   * Too short
   */
  tooShort: 'Value is too short',
  
  /**
   * Too long
   */
  tooLong: 'Value is too long',
  
  /**
   * Invalid format
   */
  format: 'Invalid format',
} as const;

/**
 * Form field validation rules
 */
export const VALIDATION_RULES = {
  /**
   * Email field
   */
  email: {
    required: true,
    pattern: EMAIL_REGEX,
    maxLength: 100,
  },
  
  /**
   * Password field
   */
  password: {
    required: true,
    minLength: 8,
    maxLength: 100,
  },
  
  /**
   * Username field
   */
  username: {
    required: true,
    pattern: USERNAME_REGEX,
    minLength: 3,
    maxLength: 20,
  },
  
  /**
   * Name field
   */
  name: {
    required: true,
    pattern: NAME_REGEX,
    minLength: 2,
    maxLength: 50,
  },
  
  /**
   * Phone field
   */
  phone: {
    required: true,
    pattern: PHONE_REGEX,
    minLength: 10,
    maxLength: 15,
  },
  
  /**
   * Number field
   */
  number: {
    required: true,
    min: 0,
    max: 999999999,
  },
  
  /**
   * Date field
   */
  date: {
    required: true,
    pattern: DATE_REGEX,
  },
  
  /**
   * URL field
   */
  url: {
    required: true,
    pattern: URL_REGEX,
    maxLength: 2048,
  },
  
  /**
   * Text field
   */
  text: {
    required: false,
    minLength: 0,
    maxLength: 10000,
  },
  
  /**
   * textarea field
   */
  textarea: {
    required: false,
    minLength: 0,
    maxLength: 100000,
  },
} as const;

/**
 * Minimum length requirements
 */
export const MIN_LENGTHS = {
  password: 8,
  username: 3,
  name: 2,
  phone: 10,
  email: 5,
  url: 10,
  text: 0,
  textarea: 0,
} as const;

/**
 * Maximum length requirements
 */
export const MAX_LENGTHS = {
  password: 100,
  username: 20,
  name: 50,
  phone: 15,
  email: 100,
  url: 2048,
  text: 10000,
  textarea: 100000,
  bio: 500,
  description: 5000,
} as const;

/**
 * Numeric validation ranges
 */
export const NUMBER_RANGES = {
  /**
   * Age range
   */
  age: {
    min: 0,
    max: 150,
  },
  
  /**
   * Score range (0-100)
   */
  score: {
    min: 0,
    max: 100,
  },
  
  /**
   * Percentage range
   */
  percentage: {
    min: 0,
    max: 100,
  },
  
  /**
   * Rating range (1-5)
   */
  rating: {
    min: 1,
    max: 5,
  },
  
  /**
   * Year range
   */
  year: {
    min: 1900,
    max: 2100,
  },
} as const;