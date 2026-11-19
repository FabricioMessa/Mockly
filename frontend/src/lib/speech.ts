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

const PREFERRED_VOICE_HINTS = [
  'mónica',
  'monica',
  'paulina',
  'jorge',
  'diego',
  'marisol',
  'juan',
  'carlos',
  'laura',
  'sabina',
  'helena',
  'pablo',
  'raúl',
  'raul',
  'google español',
  'google us english',
  'samantha',
  'aria',
  'jenny',
  'guy',
  'alex',
  'daniel',
  'karen',
  'zira',
  'david',
  'mark',
  'enhanced',
  'premium',
  'natural',
  'neural',
]

const NOVELTY_VOICE_HINTS = [
  'eddy',
  'flo',
  'grandma',
  'grandpa',
  'rocko',
  'sandy',
  'shelley',
  'albert',
  'fred',
  'bad news',
  'bahh',
  'bells',
  'boing',
  'bubbles',
  'cellos',
  'good news',
  'jester',
  'organ',
  'superstar',
  'trinoids',
  'whisper',
  'wobble',
  'zarvox',
  'kathy',
  'ralph',
]

function voiceScore(voice: SpeechSynthesisVoice, language: Language): number {
  const name = voice.name.toLowerCase()
  const prefix = language === 'en' ? 'en' : 'es'
  const matchesLanguage = voice.lang.toLowerCase().startsWith(prefix)

  let score = matchesLanguage ? 1000 : 0
  if (voice.default) score += 5
  if (voice.localService) score += 2
  if (PREFERRED_VOICE_HINTS.some((hint) => name.includes(hint))) score += 40
  if (NOVELTY_VOICE_HINTS.some((hint) => name.includes(hint))) score -= 80
  return score
}

export function sortSpeechVoices(
  voices: SpeechSynthesisVoice[],
  language: Language,
): SpeechSynthesisVoice[] {
  return [...voices].sort((first, second) => {
    const difference = voiceScore(second, language) - voiceScore(first, language)
    if (difference !== 0) return difference
    return first.name.localeCompare(second.name)
  })
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

  return sortSpeechVoices(voices, language)[0] ?? null
}
