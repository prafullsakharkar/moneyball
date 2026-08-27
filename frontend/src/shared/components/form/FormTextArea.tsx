/**
 * FormTextArea — CricketIQ Design System
 * React Hook Form controlled textarea built on the TextArea component.
 */
import type { Ref } from 'react';
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';
import { TextArea, type TextAreaProps } from './TextArea';

export interface FormTextAreaProps<TFieldValues extends FieldValues>
  extends Omit<TextAreaProps, 'name' | 'value' | 'onChange' | 'error' | 'helperText'> {
  /** Field name (path into form values) */
  name: Path<TFieldValues>;
}

export function FormTextArea<TFieldValues extends FieldValues>({
  name,
  ...props
}: FormTextAreaProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextArea
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
