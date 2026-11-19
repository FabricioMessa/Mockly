import { ChevronRight, Clock, MessageSquare, Mic, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import type { BadgeTone } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAppSettings } from '../context/appSettings'
import {
  fetchSupabaseSessions,
  formatDuration,
  formatSessionDate,
  modeKey,
  readSessions,
} from '../lib/interviewHistory'
import { useTranslation } from '../lib/i18n'

type Filter = 'all' | 'laboral' | 'universidad' | 'idiomas'

function modeTone(mode: string): BadgeTone {
  if (mode === 'universidad') return 'accent'
  if (mode === 'idiomas') return 'success'
  return 'primary'
}

export function Entrevistas() {
  const t = useTranslation()
  const { language } = useAppSettings()
  //const sessions = useMemo(() => readSessions(), [])
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const [sessions, setSessions] = useState<ReturnType<typeof readSessions>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchSupabaseSessions().then((data) => {
      if (!active) return
      setSessions(data)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: t.history.all },
    { id: 'laboral', label: t.modes.laboral },
    { id: 'universidad', label: t.modes.universidad },
    { id: 'idiomas', label: t.modes.idiomas },
  ]

  const filtered = sessions.filter((session) => {
    const matchesMode = filter === 'all' || session.mode === filter
    const matchesSearch = session.role
      .toLowerCase()
      .includes(search.trim().toLowerCase())
    return matchesMode && matchesSearch
  })

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1>{t.history.title}</h1>
        <p className="mt-1 text-body text-content-secondary">
          {t.history.subtitle}
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-secondary"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.history.search}
            aria-label={t.history.search}
            className="h-10 w-full rounded-pill border border-border bg-surface pl-9 pr-3 text-caption text-content-primary placeholder:text-content-secondary focus-visible:border-primary"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={
                filter === item.id
                  ? 'rounded-pill bg-primary px-3 py-1.5 text-caption font-medium text-white'
                  : 'rounded-pill border border-border bg-surface px-3 py-1.5 text-caption text-content-secondary transition-colors hover:text-content-primary'
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mic className="size-6" strokeWidth={1.75} />
          </span>
          <div>
            <p className="font-display text-h2 font-semibold text-content-primary">
              {t.history.emptyTitle}
            </p>
            <p className="mt-1 text-caption text-content-secondary">
              {t.history.emptyDesc}
            </p>
          </div>
          <Link to="/dashboard">
            <Button size="sm">{t.history.start}</Button>
          </Link>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-6 text-center text-caption text-content-secondary">
          {t.history.noResults}
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((session) => {
            const answered = session.answers.filter((answer) =>
              answer.trim(),
            ).length
            return (
              <Link
                key={session.id}
                to={`/entrevistas/${session.id}`}
                className="block"
              >
                <Card interactive className="h-full p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone={modeTone(session.mode)}>
                        {t.modes[modeKey(session.mode)]}
                      </Badge>
                      {session.demo && (
                        <Badge tone="warning">{t.history.demo}</Badge>
                      )}
                    </div>
                    <span className="shrink-0 text-caption text-content-secondary">
                      {formatSessionDate(session.completedAt, language)}
                    </span>
                  </div>

                  <h2 className="mt-3 font-display text-h2 font-semibold text-content-primary">
                    {session.role}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-caption text-content-secondary">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" strokeWidth={1.75} />
                      {formatDuration(session.durationSeconds)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="size-3.5" strokeWidth={1.75} />
                      {answered}{' '}
                      {answered === 1
                        ? t.history.answeredOne
                        : t.history.answered}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display text-h2 font-semibold text-content-primary">
                      {session.evaluation.score}
                      <span className="text-caption font-normal text-content-secondary">
                        /100
                      </span>
                    </span>
                    <ChevronRight
                      className="size-4 text-content-secondary"
                      strokeWidth={1.75}
                    />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
