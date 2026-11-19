import {
  ArrowLeft,
  ChevronRight,
  Clock,
  MessageSquare,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { useAppSettings } from '../context/appSettings'
import {
  deleteSession,
  deleteSupabaseSession,
  fetchSupabaseSession,
  formatDuration,
  formatSessionDate,
  getSession,
  modeKey,
} from '../lib/interviewHistory'
import type { InterviewSession } from '../lib/interviewHistory'
import { useTranslation } from '../lib/i18n'
import {
  saveEvaluation,
  saveQuestions,
  saveSetup,
} from '../lib/interviewStorage'

export function EntrevistaDetalle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const t = useTranslation()
  const { language } = useAppSettings()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const localSession = id ? getSession(id) : null
  const [session, setSession] = useState<InterviewSession | null>(localSession)
  const [loading, setLoading] = useState(!localSession)

  useEffect(() => {
    if (!id || localSession) return

    let active = true
    fetchSupabaseSession(id).then((remoteSession) => {
      if (!active) return
      setSession(remoteSession)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [id, localSession])

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <Card className="p-6 text-center">
          <p className="text-body text-content-secondary">
            Cargando entrevista...
          </p>
        </Card>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <Card className="p-6 text-center">
          <p className="text-body text-content-secondary">
            {t.history.notFound}
          </p>
          <Link
            to="/entrevistas"
            className="mt-3 inline-flex items-center gap-1 text-caption font-medium text-primary"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} />
            {t.history.back}
          </Link>
        </Card>
      </div>
    )
  }

  const answered = session.answers.filter((answer) => answer.trim()).length
  const feedback = t.feedback

  const handleRepeat = () => {
    saveQuestions(session.questions)
    saveSetup({
      mode: session.mode,
      role: session.role,
      difficulty: session.difficulty,
      tone: session.tone,
    })
    navigate('/simulacro')
  }

  const handleViewReport = () => {
    saveEvaluation(session.evaluation)
    navigate('/feedback')
  }

  const handleDelete = async () => {
    deleteSession(session.id)
    await deleteSupabaseSession(session.id)
    navigate('/entrevistas')
  }

  const metrics = [
    { label: t.progress.fluency, value: session.evaluation.metrics.fluency },
    {
      label: t.progress.fillerWords,
      value: session.evaluation.metrics.fillerWords,
    },
    { label: t.progress.confidence, value: session.evaluation.metrics.confidence },
    { label: t.progress.keywords, value: session.evaluation.metrics.keywords },
  ]

  const star = [
    { label: feedback.situation, value: session.evaluation.star.situation },
    { label: feedback.task, value: session.evaluation.star.task },
    { label: feedback.action, value: session.evaluation.star.action },
    { label: feedback.result, value: session.evaluation.star.result },
  ]

  return (
    <>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link
          to="/entrevistas"
          className="inline-flex items-center gap-1.5 text-caption font-medium text-content-secondary transition-colors hover:text-content-primary"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} />
          {t.history.back}
        </Link>

        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone={session.mode === 'universidad' ? 'accent' : session.mode === 'idiomas' ? 'success' : 'primary'}>
              {t.modes[modeKey(session.mode)]}
            </Badge>
            {session.demo && <Badge tone="warning">{t.history.demo}</Badge>}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1>{session.role}</h1>
              <p className="mt-1 text-body text-content-secondary">
                {formatSessionDate(session.completedAt, language)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                leftIcon={<RotateCcw className="size-4" strokeWidth={1.75} />}
                onClick={handleRepeat}
              >
                {t.history.repeat}
              </Button>
              <Button variant="outline" size="sm" onClick={handleViewReport}>
                {t.history.viewReport}
              </Button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-pill border border-error/30 px-3 text-label text-error transition-colors hover:bg-error/10"
              >
                <Trash2 className="size-4" strokeWidth={1.75} />
                {t.history.delete}
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="p-4">
            <p className="text-caption text-content-secondary">
              {t.history.score}
            </p>
            <p className="mt-1 font-display text-h1 font-bold text-primary">
              {session.evaluation.score}
              <span className="text-caption font-normal text-content-secondary">
                /100
              </span>
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-caption text-content-secondary">
              {t.history.duration}
            </p>
            <p className="mt-1 flex items-center gap-1.5 font-display text-h2 font-semibold text-content-primary">
              <Clock className="size-4 text-content-secondary" strokeWidth={1.75} />
              {formatDuration(session.durationSeconds)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-caption text-content-secondary">
              {t.history.questions}
            </p>
            <p className="mt-1 font-display text-h2 font-semibold text-content-primary">
              {session.questions.length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-caption text-content-secondary">
              {t.history.answers}
            </p>
            <p className="mt-1 flex items-center gap-1.5 font-display text-h2 font-semibold text-content-primary">
              <MessageSquare
                className="size-4 text-content-secondary"
                strokeWidth={1.75}
              />
              {answered}
              <span className="text-caption font-normal text-content-secondary">
                {t.history.of} {session.questions.length}
              </span>
            </p>
          </Card>
        </div>

        <Card className="p-5">
          <h2 className="text-h2">{t.history.questions}</h2>
          <div className="mt-4 flex flex-col gap-4">
            {session.questions.map((question, index) => {
              const answer = session.answers[index]?.trim()
              const evaluated = index === session.evaluatedQuestionIndex
              return (
                <div
                  key={question.id}
                  className="rounded-input border border-border bg-background p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-label font-medium text-content-primary">
                      <span className="mr-1.5 text-content-secondary">
                        {index + 1}.
                      </span>
                      {question.text}
                    </p>
                    {evaluated && <Badge tone="primary">{t.history.evaluated}</Badge>}
                  </div>
                  {question.focus && (
                    <p className="mt-1 text-caption text-content-secondary">
                      {t.interview.focus}: {question.focus}
                    </p>
                  )}
                  <p className="mt-3 text-caption font-medium text-content-secondary">
                    {t.history.answers}
                  </p>
                  <p className="mt-1 text-body text-content-primary">
                    {answer || (
                      <span className="text-content-secondary">
                        {t.history.noAnswer}
                      </span>
                    )}
                  </p>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-h2">{t.history.feedback}</h2>
            <span className="text-caption text-content-secondary">
              {session.evaluation.provider === 'gemini'
                ? 'IA · Gemini'
                : 'Modo demo'}
            </span>
          </div>

          <p className="mt-3 text-body text-content-primary">
            {session.evaluation.summary}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-input border border-border bg-background p-3"
              >
                <p className="text-caption text-content-secondary">
                  {metric.label}
                </p>
                <p className="mt-1 font-display text-h2 font-semibold text-content-primary">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          <h3 className="mt-5 text-label font-semibold text-content-primary">
            {feedback.star}
          </h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {star.map((item) => (
              <div
                key={item.label}
                className="rounded-input border border-border bg-background p-3"
              >
                <p className="text-caption font-semibold uppercase tracking-wide text-primary">
                  {item.label}
                </p>
                <p className="mt-1 text-caption text-content-secondary">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <h3 className="mt-5 text-label font-semibold text-content-primary">
            {feedback.recommendations}
          </h3>
          <ul className="mt-2 flex flex-col gap-1.5">
            {session.evaluation.recommendations.map((recommendation) => (
              <li
                key={recommendation}
                className="flex items-start gap-2 text-caption text-content-secondary"
              >
                <ChevronRight
                  className="mt-0.5 size-3.5 shrink-0 text-primary"
                  strokeWidth={2}
                />
                {recommendation}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={t.history.deleteTitle}
        description={t.history.deleteDesc}
      >
        <div className="flex gap-2">
          <Button
            fullWidth
            variant="outline"
            onClick={() => setConfirmDelete(false)}
          >
            {t.history.cancel}
          </Button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-11 w-full rounded-pill bg-error text-label font-medium text-white transition-colors hover:bg-error/90"
          >
            {t.history.confirmDelete}
          </button>
        </div>
      </Modal>
    </>
  )
}
