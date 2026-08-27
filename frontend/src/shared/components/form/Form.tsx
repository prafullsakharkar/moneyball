/**
 * Form — CricketIQ Design System
 * Provides FormProvider context so controlled field components (FormInput,
 * FormSelect, etc.) can access the form instance. Renders a <form> element.
 */
import { type FormHTMLAttributes, type ReactNode } from 'react';
import { FormProvider, type FieldValues, type UseFormReturn } from 'react-hook-form';

export interface FormProps<TFieldValues extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** The form instance returned by useForm() */
  form: UseFormReturn<TFieldValues>;
  /** Submit handler — receives the validated values */
  onSubmit: (values: TFieldValues) => void | Promise<void>;
  /** Form body */
  children: ReactNode;
}

export function Form<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  children,
  ...props
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}
