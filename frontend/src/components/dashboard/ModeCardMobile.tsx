import { ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import type { Mode } from './modes'

export function ModeCardMobile({ mode }: { mode: Mode }) {
  const Icon = mode.icon

  return (
    <Card className="flex items-center gap-3 p-4">
      <span
        className={cn(
          'flex size-14 shrink-0 items-center justify-center rounded-full',
          mode.iconCircle,
        )}
        aria-hidden="true"
      >
        <Icon className="size-7 text-white" strokeWidth={1.75} />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="font-display text-h2 font-semibold text-content-primary">
          {mode.title}
        </h3>
        <p className="mt-1 text-caption text-content-secondary">
          {mode.descriptionMobile}
        </p>
      </div>

      <Button
        size="sm"
        variant={mode.buttonVariant}
        rightIcon={<ChevronRight className="size-4" />}
      >
        Empezar
      </Button>
    </Card>
  )
}
