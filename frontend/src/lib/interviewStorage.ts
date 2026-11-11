import type { InterviewEvaluation, Question } from './api'

const QUESTIONS_KEY = 'mockly_questions'
const EVALUATION_KEY = 'mockly_evaluation'
const SETUP_KEY = 'mockly_setup'

export interface InterviewSetup {
  mode: string
  role: string
  difficulty: string
  tone: string
}

function readJson<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function saveQuestions(questions: Question[]) {
  window.sessionStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions))
}

export function readQuestions(): Question[] {
  return readJson<Question[]>(QUESTIONS_KEY) ?? []
}

export function saveEvaluation(evaluation: InterviewEvaluation) {
  window.sessionStorage.setItem(EVALUATION_KEY, JSON.stringify(evaluation))
}

export function readEvaluation(): InterviewEvaluation | null {
  return readJson<InterviewEvaluation>(EVALUATION_KEY)
}

export function saveSetup(setup: InterviewSetup) {
  window.sessionStorage.setItem(SETUP_KEY, JSON.stringify(setup))
}

export function readSetup(): InterviewSetup | null {
  return readJson<InterviewSetup>(SETUP_KEY)
}
