import {
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { X } from 'lucide-react'
import { cn } from './cn'
import {
  fieldErrorClassName,
  fieldHelperClassName,
  fieldLabelClassName,
  getFieldClassName,
  type FieldSize,
  type FieldVariant,
} from './fieldStyles'

function normalizeTag(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

type TagInputBaseProps = {
  value: string[]
  onChange: (value: string[]) => void
  suggestions?: string[]
  creatable?: boolean
  inputSize?: FieldSize
  variant?: FieldVariant
  fullWidth?: boolean
  disabled?: boolean
  placeholder?: string
  maxTags?: number
  name?: string
  id?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
  className?: string
}

export type TagInputProps = TagInputBaseProps

export function TagInput({
  value,
  onChange,
  suggestions = [],
  creatable = true,
  inputSize = 'md',
  variant = 'default',
  fullWidth = false,
  disabled = false,
  placeholder = 'Type and press Enter',
  maxTags,
  name,
  id,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const normalizedValue = useMemo(
    () => value.map((tag) => normalizeTag(tag)).filter(Boolean),
    [value],
  )

  const canAddMore = maxTags === undefined || normalizedValue.length < maxTags

  const filteredSuggestions = useMemo(() => {
    const query = normalizeTag(inputValue).toLowerCase()
    if (!query) return suggestions.filter((item) => !normalizedValue.includes(item))

    return suggestions.filter(
      (item) =>
        item.toLowerCase().includes(query) &&
        !normalizedValue.some((tag) => tag.toLowerCase() === item.toLowerCase()),
    )
  }, [inputValue, suggestions, normalizedValue])

  const addTag = (raw: string) => {
    const tag = normalizeTag(raw)
    if (!tag || !canAddMore) return

    const exists = normalizedValue.some((item) => item.toLowerCase() === tag.toLowerCase())
    if (exists) {
      setInputValue('')
      setOpen(false)
      return
    }

    const isKnown = suggestions.some((item) => item.toLowerCase() === tag.toLowerCase())
    if (!creatable && !isKnown) return

    onChange([...normalizedValue, tag])
    setInputValue('')
    setOpen(false)
  }

  const removeTag = (tagToRemove: string) => {
    onChange(normalizedValue.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag(inputValue)
      return
    }

    if (event.key === 'Backspace' && !inputValue && normalizedValue.length > 0) {
      removeTag(normalizedValue[normalizedValue.length - 1])
      return
    }

    if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const showSuggestions = open && filteredSuggestions.length > 0 && canAddMore

  return (
    <div ref={containerRef} className={cn('relative', fullWidth && 'w-full')}>
      <div
        className={cn(
          getFieldClassName({ size: inputSize, variant, fullWidth, className }),
          'flex min-h-[42px] flex-wrap items-center gap-1.5 py-1.5',
          disabled && 'cursor-not-allowed',
        )}
        onClick={() => {
          if (!disabled) inputRef.current?.focus()
        }}
      >
        {normalizedValue.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-700 dark:bg-ink-800 dark:text-ink-200"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  removeTag(tag)
                }}
                className="rounded-sm text-ink-500 transition hover:text-clay-600 dark:text-ink-400 dark:hover:text-clay-400"
                aria-label={`Remove ${tag}`}
              >
                <X size={12} />
              </button>
            )}
          </span>
        ))}

        {canAddMore && (
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="text"
            value={inputValue}
            disabled={disabled}
            placeholder={normalizedValue.length === 0 ? placeholder : ''}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            onChange={(event) => {
              setInputValue(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              window.setTimeout(() => setOpen(false), 120)
            }}
            onKeyDown={handleKeyDown}
            className="min-w-[8rem] flex-1 border-0 bg-transparent px-1 py-0.5 text-sm outline-none focus:outline-none focus:ring-0 placeholder:text-ink-400 dark:placeholder:text-ink-500"
          />
        )}
      </div>

      {showSuggestions && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 max-h-40 w-full overflow-auto rounded-md border border-ink-200 bg-white py-1 shadow-lg dark:border-ink-700 dark:bg-ink-900"
        >
          {filteredSuggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                role="option"
                className="w-full px-3 py-2 text-left text-sm text-ink-700 transition hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => addTag(suggestion)}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export type TagInputFieldProps = TagInputProps & {
  label?: string
  error?: string
  helperText?: string
}

export function TagInputField({
  label,
  error,
  helperText,
  fullWidth = true,
  id,
  ...props
}: TagInputFieldProps) {
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

      <TagInput
        id={inputId}
        fullWidth={fullWidth}
        variant={error ? 'error' : 'default'}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
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
}
