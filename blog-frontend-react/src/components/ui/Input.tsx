import { forwardRef, type InputHTMLAttributes } from 'react'
import { getFieldClassName, type FieldSize, type FieldVariant } from './fieldStyles'

export type InputSize = FieldSize
export type InputVariant = FieldVariant

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  inputSize?: InputSize
  variant?: InputVariant
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
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
    <input
      ref={ref}
      disabled={disabled}
      className={getFieldClassName({ size: inputSize, variant, fullWidth, className })}
      {...props}
    />
  )
})
