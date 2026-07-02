import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from './cn'
import {
  fieldErrorClassName,
  fieldHelperClassName,
  fieldLabelClassName,
  getFieldClassName,
  type FieldSize,
  type FieldVariant,
} from './fieldStyles'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  options: SelectOption[]
  placeholder?: string
  inputSize?: FieldSize
  variant?: FieldVariant
  fullWidth?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    options,
    placeholder,
    inputSize = 'md',
    variant = 'default',
    fullWidth = false,
    className,
    disabled,
    ...props
  },
  ref,
) {
  return (
    <div className={cn('relative', fullWidth && 'w-full')}>
      <select
        ref={ref}
        disabled={disabled}
        className={cn(
          getFieldClassName({ size: inputSize, variant, fullWidth, className }),
          'appearance-none pr-10',
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 dark:text-ink-500"
      />
    </div>
  )
})

export type SelectFieldProps = Omit<SelectProps, 'variant'> & {
  label?: string
  error?: string
  helperText?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
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
  const selectId = id ?? generatedId
  const errorId = error ? `${selectId}-error` : undefined
  const helperId = helperText && !error ? `${selectId}-helper` : undefined
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn(fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={selectId} className={fieldLabelClassName}>
          {label}
        </label>
      )}

      <Select
        ref={ref}
        id={selectId}
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
