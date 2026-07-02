import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from './cn'

const variantStyles = {
  primary:
    'bg-ink-900 text-ink-50 hover:bg-ink-800 dark:bg-clay-500 dark:text-ink-950 dark:hover:bg-clay-400',
  secondary:
    'border border-ink-200 bg-white text-ink-700 hover:bg-ink-100 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200 dark:hover:bg-ink-800',
  ghost:
    'text-ink-600 hover:bg-ink-200/60 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800',
  danger: 'bg-clay-600 text-white hover:bg-clay-500 dark:bg-clay-600 dark:hover:bg-clay-500',
} as const

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3.5 py-2 text-sm',
  lg: 'py-2.5 text-sm',
  icon: 'p-2',
} as const

const shapeStyles = {
  pill: 'rounded-md',
  rounded: 'rounded-lg',
} as const

export type ButtonVariant = keyof typeof variantStyles
export type ButtonSize = keyof typeof sizeStyles
export type ButtonShape = keyof typeof shapeStyles

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  fullWidth?: boolean
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    shape = 'pill',
    fullWidth = false,
    loading = false,
    disabled,
    className,
    children,
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
        variantStyles[variant],
        sizeStyles[size],
        shapeStyles[shape],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
})
