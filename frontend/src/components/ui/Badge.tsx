import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type BadgeTone = 'primary' | 'accent' | 'success' | 'warning'

export interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}

const tones: Record<BadgeTone, string> = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
}

export function Badge({ children, tone = 'primary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-2.5 py-1 text-caption font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
