import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppSettings } from '../../context/appSettings'
import { getWeeklyActivity } from '../../lib/interviewHistory'
import type { InterviewSession } from '../../lib/interviewHistory'
import { useTranslation } from '../../lib/i18n'
import { Card } from '../ui/Card'

export function WeeklyProgress({ sessions }: { sessions: InterviewSession[] }) {
  const { language } = useAppSettings()
  const t = useTranslation()
  const weekly = getWeeklyActivity(sessions, language)
  const hasActivity = weekly.some((item) => item.sessions > 0)
  const maxMinutes = Math.max(30, ...weekly.map((item) => item.minutes))
  const ticks = [
    maxMinutes,
    Math.round(maxMinutes * 0.75),
    Math.round(maxMinutes * 0.5),
    Math.round(maxMinutes * 0.25),
    0,
  ]

  return (
    <Card className="p-5">
      <h2 className="text-label font-semibold text-content-primary">
        Tu progreso semanal
      </h2>

      {hasActivity ? (
        <div className="mt-4 flex gap-3">
          <div className="flex h-44 flex-col justify-between pb-6 text-caption text-content-secondary">
            {ticks.map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>

          <div className="flex flex-1 items-end justify-between gap-2">
            {weekly.map(({ day, minutes, sessions: count }) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-caption text-content-secondary">
                  {minutes}
                </span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary to-accent"
                  style={{ height: `${(minutes / maxMinutes) * 120}px` }}
                  role="img"
                  aria-label={`${day}: ${minutes} ${t.progress.minutes}`}
                  title={`${day}: ${minutes} ${t.progress.minutes} · ${count} ${t.progress.sessions}`}
                />
                <span className="text-caption text-content-secondary">{day}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-input border border-border bg-background p-4">
          <p className="text-caption font-medium text-content-primary">
            {t.progress.emptyTitle}
          </p>
          <p className="mt-1 text-caption text-content-secondary">
            {t.progress.emptyDesc}
          </p>
        </div>
      )}

      <Link
        to="/progreso"
        className="mt-4 flex items-center gap-1 text-caption font-medium text-primary"
      >
        Ver progreso detallado
        <ChevronRight className="size-4" strokeWidth={1.75} />
      </Link>
    </Card>
  )
}
