import {
  Briefcase,
  ChevronRight,
  Globe2,
  GraduationCap,
  Star,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { modeLabel, readSessions } from '../../lib/interviewHistory'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'

const modeIcons: Record<string, LucideIcon> = {
  laboral: Briefcase,
  universidad: GraduationCap,
  idiomas: Globe2,
}

export function ContinueMobile() {
  const session = readSessions()[0]

  if (!session) return null

  const Icon = modeIcons[session.mode] ?? Briefcase
  const score = session.evaluation.score

  return (
    <section className="lg:hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-h2">Continuar donde dejaste</h2>
        <Link
          to="/entrevistas"
          className="flex items-center gap-1 text-label text-primary"
        >
          Ver todo
          <ChevronRight className="size-4" strokeWidth={1.75} />
        </Link>
      </div>

      <Link to={`/entrevistas/${session.id}`}>
        <Card interactive className="mt-3 p-4">
          <div className="flex items-center gap-3">
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white"
              aria-hidden="true"
            >
              <Icon className="size-6" strokeWidth={1.75} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-label font-medium text-content-primary">
                {session.role}
              </p>
              <p className="text-caption text-content-secondary">
                {modeLabel(session.mode)}
              </p>
            </div>

            <div className="flex flex-col items-end">
              <p className="text-caption text-content-secondary">Puntaje</p>
              <p className="font-display text-h1 font-bold leading-none text-primary">
                {score}
              </p>
              <p className="mt-1 flex items-center gap-1 text-caption text-success">
                {score >= 80 ? '¡Muy bien!' : 'Buen trabajo'}
                <Star
                  className="size-3 fill-warning text-warning"
                  strokeWidth={1.75}
                />
              </p>
            </div>
          </div>

          <div className="mt-3">
            <ProgressBar value={score} />
            <p className="mt-1 text-caption text-content-secondary">
              {score}/100
            </p>
          </div>
        </Card>
      </Link>
    </section>
  )
}
