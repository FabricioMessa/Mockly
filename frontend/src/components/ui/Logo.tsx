import { cn } from '../../lib/cn'

export interface LogoProps {
  size?: number
  withWordmark?: boolean
  className?: string
}

export function Logo({ size = 40, withWordmark = false, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        aria-hidden="true"
        className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent font-display font-bold text-white"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        M
      </div>
      {withWordmark && (
        <span className="font-display text-h2 font-semibold tracking-tight text-content-primary">
          Mockly
        </span>
      )}
    </div>
  )
}
