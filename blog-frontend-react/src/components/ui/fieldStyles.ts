import { cn } from './cn'

export const fieldSizeStyles = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-3.5 py-2.5 text-sm',
  lg: 'px-4 py-3 text-base',
} as const

export const fieldVariantStyles = {
  default: 'border-ink-200 dark:border-ink-700',
  error: 'border-clay-500 dark:border-clay-400',
} as const

export type FieldSize = keyof typeof fieldSizeStyles
export type FieldVariant = keyof typeof fieldVariantStyles

type FieldClassNameOptions = {
  size?: FieldSize
  variant?: FieldVariant
  fullWidth?: boolean
  className?: string
}

export function getFieldClassName({
  size = 'md',
  variant = 'default',
  fullWidth = false,
  className,
}: FieldClassNameOptions) {
  const focusClass = variant === 'error' ? 'focus:border-clay-500' : 'focus:border-ink-900'

  return cn(
    'rounded-md border bg-white outline-none transition',
    'focus:rounded-md focus-visible:rounded-md',
    'text-ink-900 placeholder:text-ink-400',
    focusClass,
    'focus:ring-0 focus:outline-none',
    'focus-visible:outline-none focus-visible:ring-0',
    'focus:shadow-none focus-visible:shadow-none',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'dark:bg-ink-900 dark:text-ink-50 dark:placeholder:text-ink-500',
    fieldVariantStyles[variant],
    fieldSizeStyles[size],
    fullWidth && 'w-full',
    className,
  )
}

export const fieldLabelClassName =
  'mb-1 block text-sm font-medium text-ink-700 dark:text-ink-300'

export const fieldErrorClassName = 'mt-1 text-xs text-clay-600 dark:text-clay-400'

export const fieldHelperClassName = 'mt-1 text-xs text-ink-500 dark:text-ink-400'
