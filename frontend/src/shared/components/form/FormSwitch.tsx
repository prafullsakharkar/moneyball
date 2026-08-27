/**
 * FormSwitch — CricketIQ Design System
 * React Hook Form controlled switch built on the Switch component.
 */
import type { Ref } from 'react';
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';
import { Switch, type SwitchProps } from './Switch';

export interface FormSwitchProps<TFieldValues extends FieldValues>
  extends Omit<SwitchProps, 'name' | 'checked' | 'onChange' | 'error'> {
  /** Field name (path into form values) */
  name: Path<TFieldValues>;
}

export function FormSwitch<TFieldValues extends FieldValues>({
  name,
  ...props
}: FormSwitchProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Switch
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
