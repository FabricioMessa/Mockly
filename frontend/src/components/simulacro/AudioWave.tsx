import { useEffect, useState } from 'react'
import { cn } from '../../lib/cn'

const BAR_COUNT = 28

export function AudioWave({ active }: { active: boolean }) {
  const [levels, setLevels] = useState<number[]>(() =>
    Array(BAR_COUNT).fill(12),
  )

  useEffect(() => {
    if (!active) return

    const id = window.setInterval(() => {
      setLevels(
        Array.from({ length: BAR_COUNT }, (_, index) => {
          const center =
            1 - Math.abs(index - (BAR_COUNT - 1) / 2) / (BAR_COUNT / 2)
          return 18 + Math.random() * 82 * (0.35 + center * 0.65)
        }),
      )
    }, 110)

    return () => window.clearInterval(id)
  }, [active])

  const displayedLevels = active ? levels : Array(BAR_COUNT).fill(12)

  return (
    <div className="flex h-16 items-center justify-center gap-1" aria-hidden="true">
      {displayedLevels.map((height, index) => (
        <span
          key={index}
          className={cn(
            'w-1.5 rounded-full bg-gradient-to-t from-primary to-accent transition-[height] duration-100',
            !active && 'opacity-40',
          )}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  )
}
