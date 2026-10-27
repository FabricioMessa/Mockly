import { Eye, EyeOff } from 'lucide-react'
import { useId, useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leftIcon?: ReactNode
}

export function Input({
  id,
  label,
  hint,
  error,
  leftIcon,
  type = 'text',
  className,
  ...props
}: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
  const isPassword = type === 'password'
  const [visible, setVisible] = useState(false)
  const actualType = isPassword && visible ? 'text' : type

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-label text-content-primary">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-content-secondary">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          type={actualType}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            'h-11 w-full rounded-input border bg-surface px-3 text-body text-content-primary placeholder:text-content-secondary',
            'transition-colors focus-visible:ring-2 focus-visible:ring-offset-0',
            Boolean(leftIcon) && 'pl-10',
            isPassword && 'pr-10',
            error
              ? 'border-error focus-visible:ring-error'
              : 'border-border focus-visible:border-primary focus-visible:ring-primary/30',
            className,
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute inset-y-0 right-2 flex items-center rounded-pill px-1 text-content-secondary hover:text-content-primary"
          >
            {visible ? (
              <EyeOff className="size-5" strokeWidth={1.75} />
            ) : (
              <Eye className="size-5" strokeWidth={1.75} />
            )}
          </button>
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-caption text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-caption text-content-secondary">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
