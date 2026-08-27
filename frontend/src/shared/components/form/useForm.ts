/**
 * useForm — CricketIQ Design System
 * React Hook Form + Zod wrapper. Provides a typed form instance with
 * schema validation wired through zodResolver.
 */
import { useForm as useRHF, type UseFormProps, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';

export interface UseFormOptions<TFieldValues extends FieldValues, TContext>
  extends UseFormProps<TFieldValues, TContext> {
  /** Zod schema used for validation */
  schema?: ZodType<TFieldValues>;
}

/**
 * Wraps react-hook-form's useForm with zodResolver support.
 * Returns the standard UseFormReturn instance.
 */
export function useForm<TFieldValues extends FieldValues, TContext = unknown>(
  options: UseFormOptions<TFieldValues, TContext> = {}
) {
  const { schema, ...rest } = options;
  return useRHF<TFieldValues, TContext>({
    ...rest,
    resolver: schema ? (zodResolver(schema as never) as never) : undefined,
  });
}
