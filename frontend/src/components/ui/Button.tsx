import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'accent'
  | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white shadow-sm hover:bg-primary-dark focus-visible:ring-primary',
  secondary:
    'bg-primary/10 text-primary hover:bg-primary/15 focus-visible:ring-primary',
  outline:
    'border border-border bg-surface text-content-primary hover:bg-background focus-visible:ring-primary',
  ghost:
    'text-content-secondary hover:bg-background hover:text-content-primary focus-visible:ring-primary',
  accent:
    'bg-accent text-white shadow-sm hover:bg-cyan-600 focus-visible:ring-accent',
  success:
    'bg-success text-white shadow-sm hover:bg-emerald-600 focus-visible:ring-success',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-label',
  md: 'h-11 px-4 text-label',
  lg: 'h-12 px-6 text-body',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-pill font-sans font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  )
}
