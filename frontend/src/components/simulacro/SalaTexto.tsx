import { Check, ChevronRight, Clock, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { evaluateAnswer } from '../../lib/api'
import type { Question } from '../../lib/api'
import { readSetup, saveEvaluation } from '../../lib/interviewStorage'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Logo } from '../ui/Logo'
import { ProgressBar } from '../ui/ProgressBar'

interface SalaTextoProps {
  questions: Question[]
}

function formatTime(total: number) {
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(
    total % 60,
  ).padStart(2, '0')}`
}

export function SalaTexto({ questions }: SalaTextoProps) {
  const navigate = useNavigate()
  const setup = useMemo(() => readSetup(), [])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ''))
  const [elapsed, setElapsed] = useState(0)
  const [evaluating, setEvaluating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const id = window.setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  const currentQuestion = questions[index]
  const currentAnswer = answers[index] ?? ''
  const isLast = index === questions.length - 1

  const updateAnswer = (value: string) => {
    setAnswers((prev) => prev.map((answer, i) => (i === index ? value : answer)))
  }

  const handleEvaluate = async () => {
    if (!currentAnswer.trim()) {
      setError('Escribe tu respuesta antes de evaluar.')
      return
    }

    setEvaluating(true)
    setError('')

    try {
      const evaluation = await evaluateAnswer({
        question: currentQuestion.text,
        answer: currentAnswer.trim(),
        mode: setup?.mode ?? 'laboral',
        role: setup?.role ?? 'Product Manager',
      })
      saveEvaluation(evaluation)
      navigate('/feedback')
    } catch {
      setError(
        'No se pudo evaluar con la IA. Revisa el backend e inténtalo de nuevo.',
      )
    } finally {
      setEvaluating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-3">
          <Logo size={36} />
          <div className="hidden sm:block">
            <p className="text-label font-semibold text-content-primary">
              Entrevista con IA
            </p>
            <p className="text-caption text-content-secondary">
              {setup?.role ?? 'Product Manager'} · {setup?.mode ?? 'laboral'}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 rounded-pill border border-border px-3 py-1.5">
            <Clock className="size-4 text-content-secondary" strokeWidth={1.75} />
            <span className="font-display text-label font-semibold tabular-nums text-content-primary">
              {formatTime(elapsed)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEvaluate}
            loading={evaluating}
          >
            Finalizar
          </Button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-caption text-content-secondary">
              <span className="font-medium">
                Pregunta {index + 1} de {questions.length}
              </span>
              <span>Generado por IA</span>
            </div>
            <ProgressBar
              value={Math.round(((index + 1) / questions.length) * 100)}
            />
          </div>

          <Card className="p-6">
            <div className="flex items-start gap-3">
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white"
                aria-hidden="true"
              >
                <Sparkles className="size-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-caption text-content-secondary">
                  Entrevistador IA
                </p>
                <p className="mt-1 font-display text-h2 font-semibold text-content-primary lg:text-h1">
                  {currentQuestion.text}
                </p>
                {currentQuestion.focus && (
                  <p className="mt-1 text-caption text-content-secondary">
                    Enfoque: {currentQuestion.focus}
                  </p>
                )}
              </div>
            </div>

            <label
              htmlFor="interview-answer"
              className="mt-6 block text-label font-medium text-content-primary"
            >
              Tu respuesta
            </label>
            <textarea
              id="interview-answer"
              value={currentAnswer}
              onChange={(event) => updateAnswer(event.target.value)}
              rows={7}
              placeholder="Escribe tu respuesta. Usa el método STAR: situación, tarea, acción y resultado."
              className="mt-2 w-full resize-none rounded-input border border-border bg-surface px-3 py-2 text-body text-content-primary placeholder:text-content-secondary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            />

            {error && <p className="mt-2 text-caption text-error">{error}</p>}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-caption text-content-secondary">
                Consejo: incluye resultados medibles.
              </p>
              <div className="flex gap-2">
                {!isLast && (
                  <Button
                    variant="outline"
                    onClick={() => setIndex(index + 1)}
                    rightIcon={<ChevronRight className="size-4" />}
                  >
                    Siguiente
                  </Button>
                )}
                <Button
                  onClick={handleEvaluate}
                  loading={evaluating}
                  leftIcon={<Sparkles className="size-4" strokeWidth={1.75} />}
                >
                  Evaluar con IA
                </Button>
              </div>
            </div>
          </Card>
        </section>

        <aside>
          <Card className="p-4">
            <h2 className="text-label font-semibold text-content-primary">
              Preguntas
            </h2>
            <ol className="mt-3 flex flex-col gap-2">
              {questions.map((question, questionIndex) => (
                <li
                  key={question.id}
                  className={cn(
                    'rounded-input border px-3 py-2 text-caption',
                    questionIndex === index
                      ? 'border-primary/30 bg-primary/5 text-content-primary'
                      : 'border-border bg-background text-content-secondary',
                  )}
                >
                  <span className="font-semibold">{questionIndex + 1}.</span>{' '}
                  {question.text}
                  {answers[questionIndex]?.trim() && (
                    <Check
                      className="ml-1 inline size-3 text-success"
                      strokeWidth={2}
                    />
                  )}
                </li>
              ))}
            </ol>
          </Card>
        </aside>
      </main>
    </div>
  )
}
