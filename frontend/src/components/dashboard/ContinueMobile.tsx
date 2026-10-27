import { Briefcase, ChevronRight, Star } from 'lucide-react'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'

export function ContinueMobile() {
  return (
    <section className="lg:hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-h2">Continuar donde dejaste</h2>
        <button
          type="button"
          className="flex items-center gap-1 text-label text-primary"
        >
          Ver todo
          <ChevronRight className="size-4" strokeWidth={1.75} />
        </button>
      </div>

      <Card className="mt-3 p-4">
        <div className="flex items-center gap-3">
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary"
            aria-hidden="true"
          >
            <Briefcase className="size-6 text-white" strokeWidth={1.75} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-label font-medium text-content-primary">
              Entrevista de Marketing
            </p>
            <p className="text-caption text-content-secondary">
              Laboral • Hace 2 días
            </p>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-caption text-content-secondary">Puntaje</p>
            <p className="font-display text-h1 font-bold leading-none text-primary">
              84
            </p>
            <p className="mt-1 flex items-center gap-1 text-caption text-success">
              ¡Muy bien!
              <Star className="size-3 fill-warning text-warning" strokeWidth={1.75} />
            </p>
          </div>
        </div>

        <div className="mt-3">
          <ProgressBar value={75} />
          <p className="mt-1 text-caption text-content-secondary">
            75% completado
          </p>
        </div>
      </Card>
    </section>
  )
}
