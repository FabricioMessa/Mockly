import type { Language } from './preferences'

export interface SpeechAlternative {
  transcript: string
  confidence: number
}

export interface SpeechResult {
  readonly isFinal: boolean
  readonly length: number
  [index: number]: SpeechAlternative
}

export interface SpeechResultList {
  readonly length: number
  [index: number]: SpeechResult
}

export interface SpeechResultEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechResultList
}

export interface SpeechErrorEvent extends Event {
  readonly error: string
  readonly message: string
}

export interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onstart: ((event: Event) => void) | null
  onresult: ((event: SpeechResultEvent) => void) | null
  onerror: ((event: SpeechErrorEvent) => void) | null
  onend: ((event: Event) => void) | null
}

export type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

export function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null

  const scope = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }

  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionConstructor() !== null
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speechLocale(language: Language): string {
  return language === 'en' ? 'en-US' : 'es-PE'
}

export function pickSpeechVoice(
  voices: SpeechSynthesisVoice[],
  voiceName: string,
  language: Language,
): SpeechSynthesisVoice | null {
  if (voiceName) {
    const exact = voices.find((voice) => voice.name === voiceName)
    if (exact) return exact
  }

  const prefix = language === 'en' ? 'en' : 'es'
  return (
    voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix)) ??
    voices[0] ??
    null
  )
}
