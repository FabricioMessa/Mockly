import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Language } from '../lib/preferences'
import {
  isSpeechSynthesisSupported,
  pickSpeechVoice,
  sortSpeechVoices,
  speechLocale,
} from '../lib/speech'

interface UseSpeechSynthesisOptions {
  language: Language
  voiceName?: string
  rate?: number
}

export function useSpeechSynthesis({
  language,
  voiceName = '',
  rate = 1,
}: UseSpeechSynthesisOptions) {
  const supported = isSpeechSynthesisSupported()
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (!supported) return

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices())
    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      window.speechSynthesis.cancel()
    }
  }, [supported])

  const orderedVoices = useMemo(
    () => sortSpeechVoices(voices, language),
    [voices, language],
  )

  const selectedVoice = useMemo(
    () => pickSpeechVoice(orderedVoices, voiceName, language),
    [orderedVoices, voiceName, language],
  )

  const stop = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  const speak = useCallback(
    (text: string) => {
      if (!supported || !text.trim()) return

      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)

      if (selectedVoice) {
        utterance.voice = selectedVoice
        utterance.lang = selectedVoice.lang
      } else {
        utterance.lang = speechLocale(language)
      }

      utterance.rate = rate
      utterance.pitch = 1
      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)

      window.speechSynthesis.speak(utterance)
      setSpeaking(true)
    },
    [supported, selectedVoice, language, rate],
  )

  return {
    supported,
    voices: orderedVoices,
    selectedVoice,
    speaking,
    speak,
    stop,
  }
}
