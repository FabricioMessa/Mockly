import {
  Check,
  Clock,
  Mic,
  RotateCcw,
  SkipForward,
  Sparkles,
  Square,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AudioWave } from '../components/simulacro/AudioWave'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Logo } from '../components/ui/Logo'
import { ProgressBar } from '../components/ui/ProgressBar'
import { cn } from '../lib/cn'

type Role = 'ai' | 'user'
type Phase = 'idle' | 'listening' | 'processing' | 'done'

interface Message {
  id: number
  role: Role
  text: string
  time: string
}

interface Question {
  question: string
  answer: string
}

const questions: Question[] = [
  {
    question:
      'Cuéntame sobre una vez en que lideraste un equipo en un proyecto desafiante.',
    answer:
      'En mi rol anterior lideré un equipo de ocho ingenieros en una migración de plataforma con un plazo ajustado de seis semanas. Hice reuniones diarias, dividí el trabajo en sprints de dos días y destrabé personalmente dos integraciones críticas. Entregamos a tiempo y sin errores críticos el primer mes.',
  },
  {
    question:
      'Describe una situación en la que tuvieras que manejar un conflicto con un compañero.',
    answer:
      'En un proyecto anterior, un compañero y yo priorizábamos distinto el alcance. Propuse una reunión para alinear objetivos, escuché sus razones y acordamos un criterio basado en impacto al usuario. Documentamos la decisión y el conflicto se resolvió sin afectar el cronograma.',
  },
  {
    question: '¿Cómo priorizas tareas cuando tienes plazos que compiten?',
    answer:
      'Primero evalúo el impacto en el negocio y la urgencia de cada tarea, luego uso una matriz de esfuerzo e impacto. Comunico el orden al equipo, reservo bloques de foco y reviso prioridades cada mañana para ajustar si cambia algo importante.',
  },
]

function formatTime(total: number) {
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(
    total % 60,
  ).padStart(2, '0')}`
}

function Bubble({ message, live = false }: { message: Message; live?: boolean }) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'max-w-[88%] rounded-card border px-3 py-2 text-caption text-content-primary',
        isUser
          ? 'ml-auto border-primary/20 bg-primary/10'
          : 'border-border bg-background',
      )}
    >
      <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-content-secondary">
        {isUser ? 'Tú' : 'Entrevistador IA'} · {message.time}
      </p>
      <p className="leading-relaxed">
        {message.text}
        {live && (
          <span
            className="ml-0.5 inline-block w-1 animate-pulse bg-primary align-middle"
            style={{ height: '1em' }}
          />
        )}
      </p>
    </div>
  )
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-input border border-border bg-background px-3 py-3">
      <p className="font-display text-h2 font-semibold text-content-primary">
        {value}
      </p>
      <p className="text-caption text-content-secondary">{label}</p>
    </div>
  )
}

export function SalaSimulacro() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('idle')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'ai', text: questions[0].question, time: '00:00' },
  ])
  const [liveText, setLiveText] = useState('')
  const [elapsed, setElapsed] = useState(0)

  const intervalRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const messageId = useRef(2)
  const elapsedRef = useRef(0)

  useEffect(() => {
    elapsedRef.current = elapsed
  }, [elapsed])

  useEffect(() => {
    if (phase === 'done') return
    const id = window.setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(id)
  }, [phase])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, liveText])

  useEffect(
    () => () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    },
    [],
  )

  const addMessage = (role: Role, text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: messageId.current++,
        role,
        text,
        time: formatTime(elapsedRef.current),
      },
    ])
  }

  const goToNextQuestion = () => {
    const next = questionIndex + 1
    if (next < questions.length) {
      setQuestionIndex(next)
      setPhase('idle')
      addMessage('ai', questions[next].question)
    } else {
      setPhase('done')
    }
  }

  const completeAnswer = (text: string) => {
    if (!text.trim()) {
      setPhase('idle')
      return
    }
    addMessage('user', text.trim())
    setLiveText('')
    setPhase('processing')
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null
      goToNextQuestion()
    }, 1200)
  }

  const startListening = () => {
    if (phase !== 'idle') return
    setPhase('listening')
    setLiveText('')

    const words = questions[questionIndex].answer.split(' ')
    let revealed = 0

    intervalRef.current = window.setInterval(() => {
      revealed += 1
      setLiveText(words.slice(0, revealed).join(' '))

      if (revealed >= words.length) {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        completeAnswer(words.join(' '))
      }
    }, 160)
  }

  const stopListening = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    completeAnswer(liveText)
  }

  const toggleMic = () => {
    if (phase === 'listening') stopListening()
    else if (phase === 'idle') startListening()
  }

  const repeatQuestion = () => {
    if (phase === 'processing') return
    addMessage('ai', questions[questionIndex].question)
  }

  const skipQuestion = () => {
    if (phase === 'processing') return
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setLiveText('')
    goToNextQuestion()
  }

  const finish = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setPhase('done')
  }

  const restart = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    messageId.current = 2
    setMessages([{ id: 1, role: 'ai', text: questions[0].question, time: '00:00' }])
    setQuestionIndex(0)
    setPhase('idle')
    setLiveText('')
    setElapsed(0)
  }

  const answeredCount = messages.filter((message) => message.role === 'user').length
  const status =
    phase === 'listening'
      ? 'Escuchando... habla con naturalidad'
      : phase === 'processing'
        ? 'Analizando tu respuesta...'
        : phase === 'done'
          ? 'Entrevista completada'
          : 'Toca el micrófono para responder'

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-3">
          <Logo size={36} />
          <div className="hidden sm:block">
            <p className="text-label font-semibold text-content-primary">
              Entrevista Laboral
            </p>
            <p className="text-caption text-content-secondary">
              Product Manager · Senior
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
          {phase !== 'done' && (
            <Button variant="outline" size="sm" onClick={finish}>
              Finalizar
            </Button>
          )}
        </div>
      </header>

      {phase === 'done' ? (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
          <Card className="p-8 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success text-white">
              <Check className="size-9" strokeWidth={2.5} />
            </div>
            <h1 className="mt-4">Entrevista completada</h1>
            <p className="mt-2 text-body text-content-secondary">
              Respondiste {answeredCount} de {questions.length} preguntas en{' '}
              {formatTime(elapsed)}.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <SummaryStat label="Preguntas" value={String(answeredCount)} />
              <SummaryStat label="Duración" value={formatTime(elapsed)} />
              <SummaryStat label="Puntaje" value="82" />
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={() => navigate('/dashboard')}>
                Volver al inicio
              </Button>
              <Button variant="outline" onClick={restart}>
                Repetir entrevista
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-caption text-content-secondary">
                <span className="font-medium">
                  Pregunta {Math.min(questionIndex + 1, questions.length)} de{' '}
                  {questions.length}
                </span>
                <span>Modo Laboral</span>
              </div>
              <ProgressBar
                value={Math.round(((questionIndex + 1) / questions.length) * 100)}
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
                    {questions[questionIndex].question}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center gap-4">
                <AudioWave active={phase === 'listening'} />

                <div className="relative">
                  {phase === 'listening' && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-error/30" />
                  )}
                  <button
                    type="button"
                    onClick={toggleMic}
                    disabled={phase === 'processing'}
                    aria-label={
                      phase === 'listening'
                        ? 'Detener grabación'
                        : 'Empezar a responder'
                    }
                    className={cn(
                      'relative flex size-20 items-center justify-center rounded-full text-white shadow-lg transition-transform',
                      phase === 'listening'
                        ? 'bg-error'
                        : 'bg-primary hover:scale-105 hover:bg-primary-dark',
                      phase === 'processing' && 'cursor-not-allowed opacity-60',
                    )}
                  >
                    {phase === 'listening' ? (
                      <Square className="size-7" fill="currentColor" />
                    ) : (
                      <Mic className="size-8" strokeWidth={1.75} />
                    )}
                  </button>
                </div>

                <p className="text-label text-content-secondary">{status}</p>
                {phase === 'idle' && (
                  <p className="text-caption text-content-secondary">
                    Puedes responder con tus propias palabras.
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<RotateCcw className="size-4" strokeWidth={1.75} />}
                  onClick={repeatQuestion}
                >
                  Repetir
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<SkipForward className="size-4" strokeWidth={1.75} />}
                  onClick={skipQuestion}
                >
                  Saltar
                </Button>
              </div>
            </Card>

            <p className="text-center text-caption text-content-secondary">
              Consejo: responde con el método STAR (Situación, Tarea, Acción,
              Resultado).
            </p>
          </section>

          <aside>
            <Card className="flex h-full flex-col p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-label font-semibold text-content-primary">
                  Transcripción en vivo
                </h2>
                <span className="flex items-center gap-1 text-caption text-content-secondary">
                  <span
                    className={cn(
                      'size-2 rounded-full',
                      phase === 'listening'
                        ? 'animate-pulse bg-success'
                        : 'bg-border',
                    )}
                  />
                  {phase === 'listening' ? 'En vivo' : 'En espera'}
                </span>
              </div>

              <div
                ref={scrollRef}
                className="mt-3 flex max-h-[420px] flex-1 flex-col gap-3 overflow-y-auto pr-1"
              >
                {messages.map((message) => (
                  <Bubble key={message.id} message={message} />
                ))}
                {liveText && (
                  <Bubble
                    message={{
                      id: -1,
                      role: 'user',
                      text: liveText,
                      time: formatTime(elapsed),
                    }}
                    live
                  />
                )}
              </div>
            </Card>
          </aside>
        </main>
      )}
    </div>
  )
}
