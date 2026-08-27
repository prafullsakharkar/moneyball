/**
 * FormCheckbox — CricketIQ Design System
 * React Hook Form controlled checkbox built on the Checkbox component.
 */
import type { Ref } from 'react';
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';
import { Checkbox, type CheckboxProps } from './Checkbox';

export interface FormCheckboxProps<TFieldValues extends FieldValues>
  extends Omit<CheckboxProps, 'name' | 'checked' | 'onChange' | 'error'> {
  /** Field name (path into form values) */
  name: Path<TFieldValues>;
}

export function FormCheckbox<TFieldValues extends FieldValues>({
  name,
  ...props
}: FormCheckboxProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Checkbox
          {...props}
          name={field.name}
          checked={Boolean(field.value)}
          onChange={field.onChange}
          onBlur={field.onBlur}
          ref={field.ref as Ref<HTMLButtonElement>}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
