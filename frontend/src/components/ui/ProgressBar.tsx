import { cn } from '../../lib/cn'

export interface ProgressBarProps {
  value: number
  label?: string
  className?: string
}

export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between text-caption">
          <span className="text-content-secondary">{label}</span>
          <span className="font-medium text-content-primary">{safeValue}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-pill bg-border"
      >
        <div
          className="h-full rounded-pill bg-gradient-to-r from-primary to-accent transition-[width]"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  )
}
