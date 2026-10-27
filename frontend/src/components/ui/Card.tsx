import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card border border-border bg-surface shadow-card',
        interactive &&
          'cursor-pointer transition-shadow hover:shadow-lg focus-within:shadow-lg',
        className,
      )}
      {...props}
    />
  )
}
