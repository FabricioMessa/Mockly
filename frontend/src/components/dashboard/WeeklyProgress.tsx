import { ChevronRight } from 'lucide-react'
import { Card } from '../ui/Card'

const days = [
  { day: 'Lun', value: 40 },
  { day: 'Mar', value: 65 },
  { day: 'Mié', value: 90 },
  { day: 'Jue', value: 70 },
  { day: 'Vie', value: 45 },
  { day: 'Sáb', value: 80 },
  { day: 'Dom', value: 55 },
]

const maxValue = 120

export function WeeklyProgress() {
  return (
    <Card className="p-5">
      <h2 className="text-label font-semibold text-content-primary">
        Tu progreso semanal
      </h2>

      <div className="mt-4 flex gap-3">
        <div className="flex h-44 flex-col justify-between pb-6 text-caption text-content-secondary">
          {[120, 90, 60, 30, 0].map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>

        <div className="flex flex-1 items-end justify-between gap-2">
          {days.map(({ day, value }) => (
            <div key={day} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-caption text-content-secondary">{value}</span>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-primary to-accent"
                style={{ height: `${(value / maxValue) * 120}px` }}
                role="img"
                aria-label={`${day}: ${value}`}
              />
              <span className="text-caption text-content-secondary">{day}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="mt-4 flex items-center gap-1 text-caption font-medium text-primary"
      >
        Ver progreso detallado
        <ChevronRight className="size-4" strokeWidth={1.75} />
      </button>
    </Card>
  )
}
