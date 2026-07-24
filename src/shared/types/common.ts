// Common types for shared use across the application

// Result type
export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface OperationResult extends Result<unknown> {
  affectedRows?: number;
}

// API Response types
export interface ApiResponse<T> extends Result<T> {
  status: number;
  timestamp: string;
}

export interface ListResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingStateContext {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: Error;
}

// Form types
export type FormStatus = 'idle' | 'submitting' | 'success' | 'failed';

export interface FormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  isValid: boolean;
  isDirty: boolean;
  status: FormStatus;
}

// UI state types
export type ViewMode = 'list' | 'grid' | 'card' | 'table';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  order: SortOrder;
}

export interface FilterConfig {
  field: string;
  operator: 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'contains' | 'in';
  value: unknown;
}

// Navigation types
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavItem[];
  permissions?: string[];
}

// Storage types
export interface StorageItem<T = unknown> {
  key: string;
  value: T;
  expires?: number; // milliseconds
}

// Event types
export type EventHandler<T = unknown> = (event: T) => void;
export type Callback = () => void;

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  position?: ToastPosition;
  duration?: number;
  onClose?: () => void;
}

// File types
export interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  progress: number;
  status: 'ready' | 'uploading' | 'completed' | 'error';
  error?: string;
}