/**
 * FormInput — CricketIQ Design System
 * React Hook Form controlled text input built on the Input component.
 */
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';
import { Input, type InputProps } from '../ui/Input';

export interface FormInputProps<TFieldValues extends FieldValues>
  extends Omit<InputProps, 'name' | 'value' | 'onChange' | 'error' | 'helperText'> {
  /** Field name (path into form values) */
  name: Path<TFieldValues>;
}

export function FormInput<TFieldValues extends FieldValues>({
  name,
  ...props
}: FormInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          {...props}
          name={field.name}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
