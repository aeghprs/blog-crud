import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react'
import { cn } from './cn'
import {
  fieldErrorClassName,
  fieldHelperClassName,
  fieldLabelClassName,
} from './fieldStyles'
import { Input } from './Input'

export type TextFieldProps = Omit<ComponentPropsWithoutRef<typeof Input>, 'variant'> & {
  label?: string
  error?: string
  helperText?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    error,
    helperText,
    fullWidth = true,
    id,
    inputSize,
    className,
    disabled,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined
  const helperId = helperText && !error ? `${inputId}-helper` : undefined
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn(fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={inputId} className={fieldLabelClassName}>
          {label}
        </label>
      )}

      <Input
        ref={ref}
        id={inputId}
        inputSize={inputSize}
        variant={error ? 'error' : 'default'}
        fullWidth={fullWidth}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={className}
        {...props}
      />

      {error && (
        <p id={errorId} className={fieldErrorClassName} role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={helperId} className={fieldHelperClassName}>
          {helperText}
        </p>
      )}
    </div>
  )
})
