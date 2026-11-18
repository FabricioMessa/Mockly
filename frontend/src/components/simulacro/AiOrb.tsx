import { Play } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface AiOrbProps {
  active?: boolean
  listening?: boolean
  onClick?: () => void
  label?: string
}

export function AiOrb({
  active = false,
  listening = false,
  onClick,
  label,
}: AiOrbProps) {
  const orb = (
    <span
      className={cn(
        'relative flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-primary via-[#7C3AED] to-accent shadow-[0_0_60px_rgba(99,102,241,0.45)] transition-transform sm:size-28',
        active && 'animate-pulse',
        listening && 'ring-4 ring-error/30',
      )}
    >
      <span
        className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl"
        aria-hidden="true"
      />
      <span
        className="absolute inset-2 rounded-full bg-gradient-to-tl from-white/40 via-white/5 to-transparent blur-[2px]"
        aria-hidden="true"
      />
      {onClick && (
        <span className="relative flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
          <Play className="size-5" strokeWidth={1.75} fill="currentColor" />
        </span>
      )}
    </span>
  )

  if (!onClick) return orb

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {orb}
    </button>
  )
}
