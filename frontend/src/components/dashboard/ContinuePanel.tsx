import { ChevronRight, FileText, GraduationCap } from 'lucide-react'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'

interface ContinueItemProps {
  icon: typeof FileText
  title: string
  progress: number
  tone: 'primary' | 'accent'
}

function ContinueItem({ icon: Icon, title, progress, tone }: ContinueItemProps) {
  const toneClasses =
    tone === 'primary'
      ? 'bg-primary/10 text-primary'
      : 'bg-accent/10 text-accent'

  return (
    <div className="flex items-start gap-3">
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-input ${toneClasses}`}
        aria-hidden="true"
      >
        <Icon className="size-6" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-label font-medium text-content-primary">{title}</p>
        <div className="mt-2">
          <ProgressBar value={progress} />
          <p className="mt-1 text-caption text-content-secondary">
            {progress}% completado
          </p>
        </div>
      </div>
    </div>
  )
}

export function ContinuePanel() {
  return (
    <Card className="p-5">
      <h2 className="text-label font-semibold text-content-primary">
        Continuar donde dejaste
      </h2>

      <div className="mt-4 flex flex-col gap-4">
        <ContinueItem
          icon={FileText}
          title="Entrevista para Analista de Datos"
          progress={60}
          tone="primary"
        />
        <ContinueItem
          icon={GraduationCap}
          title="Admisión Universitaria"
          progress={40}
          tone="accent"
        />
      </div>

      <button
        type="button"
        className="mt-4 flex items-center gap-1 text-caption font-medium text-primary"
      >
        Ver historial completo
        <ChevronRight className="size-4" strokeWidth={1.75} />
      </button>
    </Card>
  )
}
