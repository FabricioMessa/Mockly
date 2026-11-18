import { ChevronLeft, Clock, Eye, EyeOff } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSettings } from '../../context/appSettings'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'
import { evaluateAnswer } from '../../lib/api'
import type { Question } from '../../lib/api'
import { readSetup, saveEvaluation } from '../../lib/interviewStorage'
import { useTranslation } from '../../lib/i18n'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'
import { AiOrb } from './AiOrb'
import { InterviewComposer } from './InterviewComposer'

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
  | 'notAllowed'
  | 'serviceUnavailable'
  | 'noSpeech'
  | 'network'
  | 'audioCapture'
  | 'generic'
> = {
  'not-allowed': 'notAllowed',
  'service-not-allowed': 'serviceUnavailable',
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
  const [showQuestion, setShowQuestion] = useState(false)
  const answerBaseRef = useRef('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const status = listening
    ? t.interview.listening
    : speaking
      ? t.interview.speaking
      : sttSupported
        ? t.interview.tapMic
        : t.interview.micUnsupported

  const handleStartVoice = () => {
    setVoiceStarted(true)
    setAutoSpeak(true)
    setShowQuestion(false)
    setError('')
    if (ttsSupported) speak(currentQuestion.text)
  }

  const handleToggleQuestion = () => {
    setShowQuestion((visible) => !visible)
  }

  const handleRepeatQuestion = () => {
    if (ttsSupported) speak(currentQuestion.text)
  }

  const handleStopVoice = () => {
    stopSpeaking()
  }

  const handleWrite = () => {
    stopSpeaking()
    stopListening()
    setVoiceStarted(true)
    setAutoSpeak(false)
    setError('')
  }

  const handleRecord = () => {
    if (!sttSupported) return

    if (listening) {
      stopListening()
      return
    }

    stopSpeaking()
    setVoiceStarted(true)
    setError('')
    answerBaseRef.current = currentAnswer
    resetRecognition()
    startListening()
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

  const handleSend = async () => {
    if (!currentAnswer.trim()) {
      setError(t.interview.answerRequired)
      return
    }

    if (isLast) {
      await handleEvaluate()
      return
    }

    abortRecognition()
    stopSpeaking()
    setError('')

    const nextIndex = index + 1
    setIndex(nextIndex)
    setShowQuestion(false)
    answerBaseRef.current = answers[nextIndex] ?? ''
    resetRecognition()

    if (autoSpeak && ttsSupported) {
      speak(questions[nextIndex].text)
    }
  }

  return (
    <div className="flex min-h-[100svh] flex-col bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:px-8">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-content-secondary transition-colors hover:text-content-primary"
        >
          <ChevronLeft className="size-5" strokeWidth={1.75} />
          <Logo size={32} />
          <span className="hidden text-label font-semibold text-content-primary sm:inline">
            Mockly
          </span>
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

      <main className="flex flex-1 flex-col items-center px-4 pb-10 pt-8 lg:pt-12">
        <div className="flex w-full max-w-3xl flex-col items-center">
          <p className="text-caption text-content-secondary">
            {t.interview.question} {index + 1} {t.interview.of}{' '}
            {questions.length}
          </p>

          <button
            type="button"
            onClick={handleToggleQuestion}
            className="mt-3 inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-3 py-1.5 text-caption font-medium text-content-secondary transition-colors hover:text-content-primary"
          >
            {showQuestion ? (
              <EyeOff className="size-4" strokeWidth={1.75} />
            ) : (
              <Eye className="size-4" strokeWidth={1.75} />
            )}
            {showQuestion
              ? t.interview.hideQuestion
              : t.interview.showQuestion}
          </button>

          {showQuestion ? (
            <div className="mt-5 w-full rounded-card border border-border bg-surface p-5 text-center shadow-card">
              <p className="font-display text-h1 font-semibold text-content-primary">
                {currentQuestion.text}
              </p>
              {currentQuestion.focus && (
                <p className="mt-2 text-caption text-content-secondary">
                  {t.interview.focus}: {currentQuestion.focus}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-5 text-center text-caption text-content-secondary">
              {speaking ? t.interview.aiReading : t.interview.questionHidden}
            </p>
          )}

          <div className="mt-8 flex flex-col items-center">
            <AiOrb
              active={speaking || listening}
              listening={listening}
              onClick={!voiceStarted ? handleStartVoice : undefined}
              label={t.interview.start}
            />
            {!voiceStarted ? (
              <button
                type="button"
                onClick={handleStartVoice}
                className="mt-3 text-label font-medium text-primary transition-colors hover:underline"
              >
                {t.interview.start}
              </button>
            ) : (
              <p className="mt-3 text-center text-caption text-content-secondary">
                {status}
              </p>
            )}
          </div>

          <div className="mt-8 w-full">
            <InterviewComposer
              value={currentAnswer}
              onChange={updateAnswer}
              onSend={handleSend}
              onToggleMic={handleRecord}
              onRepeatQuestion={handleRepeatQuestion}
              onStopVoice={handleStopVoice}
              onWrite={handleWrite}
              listening={listening}
              speaking={speaking}
              sending={evaluating}
              sttSupported={sttSupported}
              ttsSupported={ttsSupported}
              error={error}
              sttError={sttErrorMessage}
              textareaRef={textareaRef}
            />
          </div>

          {!sttSupported && (
            <p className="mt-3 text-center text-caption text-content-secondary">
              {t.interview.micUnsupported}
            </p>
          )}
          {!ttsSupported && (
            <p className="mt-1 text-center text-caption text-content-secondary">
              {t.interview.ttsUnsupported}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
