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
        'flex items-center gap-2 rounded-card border border-border bg-surface px-3 py-2.5 shadow-card lg:gap-3 lg:px-4 lg:py-3',
        className,
      )}
    >
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-lg lg:size-10 lg:rounded-input',
          tones[tone],
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="font-display text-[15px] font-semibold leading-none text-content-primary lg:text-h2">
          {value}
        </span>
        <span className="truncate text-[10px] text-content-secondary lg:text-caption">
          {label}
        </span>
      </div>
    </div>
  )
}
