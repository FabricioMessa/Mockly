import { useCallback, useEffect, useRef, useState } from 'react'
import type { Language } from '../lib/preferences'
import {
  getSpeechRecognitionConstructor,
  speechLocale,
} from '../lib/speech'
import type { SpeechRecognitionInstance } from '../lib/speech'

interface UseSpeechRecognitionOptions {
  language: Language
}

export function useSpeechRecognition({
  language,
}: UseSpeechRecognitionOptions) {
  const supported = getSpeechRecognitionConstructor() !== null
  const [listening, setListening] = useState(false)
  const [finalText, setFinalText] = useState('')
  const [interimText, setInterimText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const finalRef = useRef('')

  const reset = useCallback(() => {
    finalRef.current = ''
    setFinalText('')
    setInterimText('')
    setError(null)
  }, [])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setInterimText('')
  }, [])

  const abort = useCallback(() => {
    recognitionRef.current?.abort()
    setInterimText('')
  }, [])

  const start = useCallback(() => {
    if (!supported) {
      setError('unsupported')
      return
    }

    const Constructor = getSpeechRecognitionConstructor()
    if (!Constructor) {
      setError('unsupported')
      return
    }

    if (!recognitionRef.current) {
      const recognition = new Constructor()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setListening(true)
        setError(null)
      }

      recognition.onresult = (event) => {
        let finalChunk = ''
        let interimChunk = ''

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i]
          const transcript = result[0]?.transcript ?? ''
          if (result.isFinal) finalChunk += transcript
          else interimChunk += transcript
        }

        if (finalChunk) {
          finalRef.current = `${finalRef.current} ${finalChunk}`.trim()
          setFinalText(finalRef.current)
        }
        setInterimText(interimChunk)
      }

      recognition.onerror = (event) => {
        setError(event.error || 'generic')
        setListening(false)
      }

      recognition.onend = () => {
        setListening(false)
        setInterimText('')
      }

      recognitionRef.current = recognition
    }

    const recognition = recognitionRef.current
    recognition.lang = speechLocale(language)
    setError(null)

    try {
      recognition.start()
    } catch {
      // Si ya estaba iniciado, no hacemos nada.
    }
  }, [supported, language])

  useEffect(
    () => () => {
      recognitionRef.current?.abort()
    },
    [],
  )

  return {
    supported,
    listening,
    finalText,
    interimText,
    error,
    start,
    stop,
    abort,
    reset,
  }
}
