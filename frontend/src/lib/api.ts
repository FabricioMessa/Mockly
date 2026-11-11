const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined

export const API_BASE_URL = (rawApiUrl ?? 'http://localhost:8000').replace(
  /\/+$/,
  '',
)

export interface Question {
  id: number
  text: string
  focus?: string
}

export interface StarFeedback {
  situation: string
  task: string
  action: string
  result: string
}

export interface InterviewMetrics {
  fluency: number
  fillerWords: string
  confidence: number
  keywords: string
}

export interface InterviewEvaluation {
  score: number
  summary: string
  star: StarFeedback
  metrics: InterviewMetrics
  strengths: string[]
  recommendations: string[]
  provider?: string
  warning?: string | null
}

export interface QuestionsParams {
  mode: string
  role: string
  difficulty: string
  tone: string
  count?: number
}

export interface QuestionsResult {
  questions: Question[]
  provider?: string
  warning?: string | null
}

export interface EvaluateParams {
  question: string
  answer: string
  mode: string
  role: string
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 60000)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new Error(`API ${response.status}: ${detail || 'sin detalle'}`)
    }

    return (await response.json()) as T
  } finally {
    window.clearTimeout(timeout)
  }
}

export function fetchQuestions(
  params: QuestionsParams,
): Promise<QuestionsResult> {
  return postJson<QuestionsResult>('/api/interview/questions', params)
}

export function evaluateAnswer(
  params: EvaluateParams,
): Promise<InterviewEvaluation> {
  return postJson<InterviewEvaluation>('/api/interview/evaluate', params)
}
