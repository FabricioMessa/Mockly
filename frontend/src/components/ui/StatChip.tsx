import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type StatTone = 'primary' | 'accent' | 'success' | 'warning'

export interface StatChipProps {
  icon: ReactNode
  value: string | number
  label: string
  tone?: StatTone
  className?: string
}

const tones: Record<StatTone, string> = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
}

export function StatChip({
  icon,
  value,
  label,
  tone = 'primary',
  className,
}: StatChipProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3 shadow-card',
        className,
      )}
    >
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-input',
          tones[tone],
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="font-display text-h2 font-semibold leading-none text-content-primary">
          {value}
        </span>
        <span className="truncate text-caption text-content-secondary">
          {label}
        </span>
      </div>
    </div>
  )
}
