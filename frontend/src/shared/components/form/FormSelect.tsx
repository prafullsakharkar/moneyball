/**
 * FormSelect — CricketIQ Design System
 * React Hook Form controlled select built on the Select component.
 */
import type { Ref } from 'react';
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';
import { Select, type SelectProps } from './Select';

export interface FormSelectProps<TFieldValues extends FieldValues>
  extends Omit<SelectProps, 'name' | 'value' | 'onChange' | 'error' | 'helperText'> {
  /** Field name (path into form values) */
  name: Path<TFieldValues>;
}

export function FormSelect<TFieldValues extends FieldValues>({
  name,
  ...props
}: FormSelectProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Select
          {...props}
          name={field.name}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          ref={field.ref as Ref<HTMLDivElement>}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
