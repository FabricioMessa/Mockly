import {
  Briefcase,
  ChevronRight,
  Globe2,
  GraduationCap,
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

export function ContinuePanel() {
  const sessions = readSessions().slice(0, 2)

  if (sessions.length === 0) return null

  return (
    <Card className="p-5">
      <h2 className="text-label font-semibold text-content-primary">
        Continuar donde dejaste
      </h2>

      <div className="mt-4 flex flex-col gap-4">
        {sessions.map((session) => {
          const Icon = modeIcons[session.mode] ?? Briefcase
          return (
            <Link
              key={session.id}
              to={`/entrevistas/${session.id}`}
              className="flex items-start gap-3"
            >
              <span
                className="flex size-12 shrink-0 items-center justify-center rounded-input bg-primary/10 text-primary"
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
                <div className="mt-2">
                  <ProgressBar value={session.evaluation.score} />
                  <p className="mt-1 text-caption text-content-secondary">
                    {session.evaluation.score}/100
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <Link
        to="/entrevistas"
        className="mt-4 flex items-center gap-1 text-caption font-medium text-primary"
      >
        Ver historial completo
        <ChevronRight className="size-4" strokeWidth={1.75} />
      </Link>
    </Card>
  )
}
