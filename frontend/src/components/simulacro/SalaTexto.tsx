import {
  Check,
  ChevronRight,
  Clock,
  Mic,
  Sparkles,
  Square,
  Volume2,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSettings } from '../../context/appSettings'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'
import { evaluateAnswer } from '../../lib/api'
import type { Question } from '../../lib/api'
import { readSetup, saveEvaluation } from '../../lib/interviewStorage'
import { cn } from '../../lib/cn'
import { useTranslation } from '../../lib/i18n'
import { AudioWave } from './AudioWave'
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

const STT_ERROR_KEYS: Record<
  string,
  'notAllowed' | 'noSpeech' | 'network' | 'audioCapture' | 'generic'
> = {
  'not-allowed': 'notAllowed',
  'service-not-allowed': 'notAllowed',
  'no-speech': 'noSpeech',
  network: 'network',
  'audio-capture': 'audioCapture',
}

export function SalaTexto({ questions }: SalaTextoProps) {
  const navigate = useNavigate()
  const t = useTranslation()
  const { language, voiceName, speechRate } = useAppSettings()
  const setup = useMemo(() => readSetup(), [])

  const {
    supported: ttsSupported,
    speaking,
    speak,
    stop: stopSpeaking,
  } = useSpeechSynthesis({ language, voiceName, rate: speechRate })

  const {
    supported: sttSupported,
    listening,
    finalText,
    interimText,
    error: sttError,
    start: startListening,
    stop: stopListening,
    abort: abortRecognition,
    reset: resetRecognition,
  } = useSpeechRecognition({ language })

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ''))
  const [elapsed, setElapsed] = useState(0)
  const [evaluating, setEvaluating] = useState(false)
  const [error, setError] = useState('')
  const [voiceStarted, setVoiceStarted] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(false)
  const answerBaseRef = useRef('')

  useEffect(() => {
    const id = window.setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(
    () => () => {
      stopSpeaking()
      abortRecognition()
    },
    [stopSpeaking, abortRecognition],
  )

  const currentQuestion = questions[index]
  const currentAnswer = answers[index] ?? ''
  const isLast = index === questions.length - 1

  const updateAnswer = useCallback(
    (value: string) => {
      setAnswers((prev) =>
        prev.map((answer, answerIndex) =>
          answerIndex === index ? value : answer,
        ),
      )
    },
    [index],
  )

  useEffect(() => {
    if (!listening) return

    const combined = [answerBaseRef.current, finalText, interimText]
      .filter((part) => part && part.trim())
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()

    updateAnswer(combined)
  }, [finalText, interimText, listening, updateAnswer])

  const sttErrorMessage = sttError
    ? t.interview.errors[STT_ERROR_KEYS[sttError] ?? 'generic']
    : ''

  const handleStartVoice = () => {
    setVoiceStarted(true)
    setAutoSpeak(true)
    setError('')
    if (ttsSupported) speak(currentQuestion.text)
  }

  const handleTextOnly = () => {
    setVoiceStarted(true)
    setAutoSpeak(false)
    setError('')
  }

  const handleListenQuestion = () => {
    if (ttsSupported) speak(currentQuestion.text)
  }

  const handleRecord = () => {
    if (!sttSupported) return

    if (listening) {
      stopListening()
      return
    }

    stopSpeaking()
    setError('')
    answerBaseRef.current = currentAnswer
    resetRecognition()
    startListening()
  }

  const handleNext = () => {
    abortRecognition()
    stopSpeaking()
    setError('')

    const nextIndex = Math.min(index + 1, questions.length - 1)
    setIndex(nextIndex)
    answerBaseRef.current = answers[nextIndex] ?? ''
    resetRecognition()

    if (autoSpeak && ttsSupported) {
      speak(questions[nextIndex].text)
    }
  }

  const handleEvaluate = async () => {
    abortRecognition()
    stopSpeaking()

    if (!currentAnswer.trim()) {
      setError(t.interview.answerRequired)
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
        language,
      })
      saveEvaluation(evaluation)
      navigate('/feedback')
    } catch {
      setError(t.interview.evaluationError)
    } finally {
      setEvaluating(false)
    }
  }

  const status = listening
    ? t.interview.listening
    : speaking
      ? t.interview.speaking
      : sttSupported
        ? t.interview.tapMic
        : t.interview.micUnsupported

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-3">
          <Logo size={36} />
          <div className="hidden sm:block">
            <p className="text-label font-semibold text-content-primary">
              {t.interview.title}
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
            {t.interview.finish}
          </Button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-caption text-content-secondary">
              <span className="font-medium">
                {t.interview.question} {index + 1} {t.interview.of}{' '}
                {questions.length}
              </span>
              <span>{t.interview.generatedByAi}</span>
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
                  {t.interview.interviewer}
                </p>
                <p className="mt-1 font-display text-h2 font-semibold text-content-primary lg:text-h1">
                  {currentQuestion.text}
                </p>
                {currentQuestion.focus && (
                  <p className="mt-1 text-caption text-content-secondary">
                    {t.interview.focus}: {currentQuestion.focus}
                  </p>
                )}
              </div>
            </div>

            {!voiceStarted ? (
              <div className="mt-6 rounded-input border border-border bg-background p-4 text-center">
                <p className="text-caption text-content-secondary">
                  {t.interview.tapMic}
                </p>
                <div className="mt-3 flex flex-col justify-center gap-2 sm:flex-row">
                  <Button
                    onClick={handleStartVoice}
                    leftIcon={
                      <Volume2 className="size-4" strokeWidth={1.75} />
                    }
                  >
                    {t.interview.start}
                  </Button>
                  <Button variant="ghost" onClick={handleTextOnly}>
                    {t.interview.textOnly}
                  </Button>
                </div>
                {!ttsSupported && (
                  <p className="mt-2 text-caption text-content-secondary">
                    {t.interview.ttsUnsupported}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center gap-3 rounded-input border border-border bg-background p-4">
                <AudioWave active={listening || speaking} />

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <div className="relative">
                    {listening && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-error/30" />
                    )}
                    {sttSupported && (
                      <button
                        type="button"
                        onClick={handleRecord}
                        aria-label={
                          listening
                            ? t.interview.stopVoice
                            : t.interview.tapMic
                        }
                        className={cn(
                          'relative flex size-16 items-center justify-center rounded-full text-white shadow-lg transition-transform',
                          listening
                            ? 'bg-error'
                            : 'bg-primary hover:scale-105 hover:bg-primary-dark',
                        )}
                      >
                        {listening ? (
                          <Square className="size-6" fill="currentColor" />
                        ) : (
                          <Mic className="size-7" strokeWidth={1.75} />
                        )}
                      </button>
                    )}
                  </div>

                  {ttsSupported && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={
                        speaking ? stopSpeaking : handleListenQuestion
                      }
                      leftIcon={
                        speaking ? (
                          <Square className="size-4" strokeWidth={1.75} />
                        ) : (
                          <Volume2 className="size-4" strokeWidth={1.75} />
                        )
                      }
                    >
                      {speaking
                        ? t.interview.stopVoice
                        : t.interview.listenQuestion}
                    </Button>
                  )}
                </div>

                <p className="text-caption text-content-secondary">{status}</p>
                {sttErrorMessage && (
                  <p className="text-caption text-error">{sttErrorMessage}</p>
                )}
                {!sttSupported && (
                  <p className="text-center text-caption text-content-secondary">
                    {t.interview.micUnsupported}
                  </p>
                )}
                {!ttsSupported && (
                  <p className="text-center text-caption text-content-secondary">
                    {t.interview.ttsUnsupported}
                  </p>
                )}
              </div>
            )}

            <label
              htmlFor="interview-answer"
              className="mt-6 block text-label font-medium text-content-primary"
            >
              {t.interview.answer}
            </label>
            <textarea
              id="interview-answer"
              value={currentAnswer}
              onChange={(event) => updateAnswer(event.target.value)}
              rows={7}
              placeholder={t.interview.answerPlaceholder}
              className="mt-2 w-full resize-none rounded-input border border-border bg-surface px-3 py-2 text-body text-content-primary placeholder:text-content-secondary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            />
            <p className="mt-1 text-caption text-content-secondary">
              {t.interview.transcriptHint}
            </p>

            {error && <p className="mt-2 text-caption text-error">{error}</p>}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-caption text-content-secondary">
                {t.interview.tip}
              </p>
              <div className="flex gap-2">
                {!isLast && (
                  <Button
                    variant="outline"
                    onClick={handleNext}
                    rightIcon={<ChevronRight className="size-4" />}
                  >
                    {t.interview.next}
                  </Button>
                )}
                <Button
                  onClick={handleEvaluate}
                  loading={evaluating}
                  leftIcon={<Sparkles className="size-4" strokeWidth={1.75} />}
                >
                  {t.interview.evaluate}
                </Button>
              </div>
            </div>
          </Card>
        </section>

        <aside>
          <Card className="p-4">
            <h2 className="text-label font-semibold text-content-primary">
              {t.interview.questions}
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
