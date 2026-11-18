import type { InterviewEvaluation, Question } from './api'

export interface InterviewSession {
  id: string
  completedAt: string
  mode: string
  role: string
  difficulty: string
  tone: string
  durationSeconds: number
  questions: Question[]
  answers: string[]
  evaluation: InterviewEvaluation
  evaluatedQuestionIndex: number
  demo?: boolean
}

export interface ModeStats {
  count: number
  averageScore: number
}

export interface HistoryStats {
  total: number
  averageScore: number
  bestScore: number
  totalSeconds: number
  currentStreak: number
  longestStreak: number
  byMode: Record<string, ModeStats>
}

export interface WeeklyActivity {
  day: string
  minutes: number
  sessions: number
}

export interface SkillSummary {
  fluency: number
  confidence: number
  keywords: number
  filler: 'Bajo' | 'Medio' | 'Alto'
  fillerScore: number
}

const STORAGE_KEY = 'mockly_sessions'
const SEED_FLAG = 'mockly_sessions_seeded'

function readStorage<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeStorage(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function isValidSession(value: unknown): value is InterviewSession {
  if (!value || typeof value !== 'object') return false
  const session = value as Partial<InterviewSession>
  return (
    typeof session.id === 'string' &&
    typeof session.completedAt === 'string' &&
    typeof session.mode === 'string' &&
    typeof session.role === 'string' &&
    typeof session.durationSeconds === 'number' &&
    Array.isArray(session.questions) &&
    Array.isArray(session.answers) &&
    Boolean(session.evaluation)
  )
}

export function readSessions(): InterviewSession[] {
  const sessions = readStorage<unknown[]>(STORAGE_KEY) ?? []
  return sessions
    .filter(isValidSession)
    .sort(
      (first, second) =>
        new Date(second.completedAt).getTime() -
        new Date(first.completedAt).getTime(),
    )
}

export function saveSession(session: InterviewSession) {
  const sessions = readSessions().filter((item) => item.id !== session.id)
  writeStorage(STORAGE_KEY, [session, ...sessions])
}

export function deleteSession(id: string) {
  writeStorage(
    STORAGE_KEY,
    readSessions().filter((session) => session.id !== id),
  )
}

export function getSession(id: string): InterviewSession | null {
  return readSessions().find((session) => session.id === id) ?? null
}

function dateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getHistoryStats(
  sessions: InterviewSession[] = readSessions(),
): HistoryStats {
  if (sessions.length === 0) {
    return {
      total: 0,
      averageScore: 0,
      bestScore: 0,
      totalSeconds: 0,
      currentStreak: 0,
      longestStreak: 0,
      byMode: {},
    }
  }

  const scores = sessions.map((session) => session.evaluation.score)
  const uniqueDays = [...new Set(sessions.map((session) => dateKey(new Date(session.completedAt))))].sort()

  let longestStreak = 1
  let running = 1
  for (let index = 1; index < uniqueDays.length; index += 1) {
    const previous = new Date(`${uniqueDays[index - 1]}T00:00:00`)
    const current = new Date(`${uniqueDays[index]}T00:00:00`)
    const difference = Math.round(
      (current.getTime() - previous.getTime()) / 86_400_000,
    )
    running = difference === 1 ? running + 1 : 1
    longestStreak = Math.max(longestStreak, running)
  }

  const daySet = new Set(uniqueDays)
  let currentStreak = 0
  const cursor = new Date()
  while (daySet.has(dateKey(cursor))) {
    currentStreak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  const byMode: Record<string, ModeStats> = {}
  for (const session of sessions) {
    const mode = session.mode || 'laboral'
    const current = byMode[mode] ?? { count: 0, averageScore: 0 }
    const totalScore = current.averageScore * current.count + session.evaluation.score
    current.count += 1
    current.averageScore = Math.round(totalScore / current.count)
    byMode[mode] = current
  }

  return {
    total: sessions.length,
    averageScore: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
    bestScore: Math.max(...scores),
    totalSeconds: sessions.reduce((sum, session) => sum + session.durationSeconds, 0),
    currentStreak,
    longestStreak,
    byMode,
  }
}

export function formatSessionDate(iso: string, language: 'es' | 'en'): string {
  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}

export function formatSessionDateShort(iso: string, language: 'es' | 'en'): string {
  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'es-PE', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(iso))
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}m ${String(rest).padStart(2, '0')}s`
}

export function formatTotalTime(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`
}

export function getWeeklyActivity(
  sessions: InterviewSession[] = readSessions(),
  language: 'es' | 'en' = 'es',
): WeeklyActivity[] {
  const labels =
    language === 'en'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  const today = new Date()
  const monday = new Date(today)
  const offset = (today.getDay() + 6) % 7
  monday.setDate(today.getDate() - offset)
  monday.setHours(0, 0, 0, 0)

  return labels.map((day, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    const key = dateKey(date)
    const daySessions = sessions.filter(
      (session) => dateKey(new Date(session.completedAt)) === key,
    )
    return {
      day,
      minutes: Math.round(
        daySessions.reduce((sum, session) => sum + session.durationSeconds, 0) / 60,
      ),
      sessions: daySessions.length,
    }
  })
}

export function getScoreTrend(
  sessions: InterviewSession[] = readSessions(),
  limit = 10,
  language: 'es' | 'en' = 'es',
): { label: string; score: number }[] {
  return [...sessions]
    .sort(
      (first, second) =>
        new Date(first.completedAt).getTime() -
        new Date(second.completedAt).getTime(),
    )
    .slice(-limit)
    .map((session) => ({
      label: formatSessionDateShort(session.completedAt, language),
      score: session.evaluation.score,
    }))
}

export function getSkillSummary(
  sessions: InterviewSession[] = readSessions(),
): SkillSummary {
  if (sessions.length === 0) {
    return {
      fluency: 0,
      confidence: 0,
      keywords: 0,
      filler: 'Medio',
      fillerScore: 0,
    }
  }

  const evaluations = sessions.map((session) => session.evaluation)
  const average = (values: number[]) =>
    Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)

  const fluency = average(evaluations.map((evaluation) => evaluation.metrics.fluency))
  const confidence = average(
    evaluations.map((evaluation) => evaluation.metrics.confidence),
  )
  const keywords = average(
    evaluations.map((evaluation) => {
      const [value, total] = evaluation.metrics.keywords.split('/').map(Number)
      if (!Number.isFinite(value) || !Number.isFinite(total) || total === 0) return 0
      return Math.round((value / total) * 100)
    }),
  )

  const fillerMap: Record<string, number> = { Bajo: 3, Medio: 2, Alto: 1 }
  const fillerCounts: Record<string, number> = { Bajo: 0, Medio: 0, Alto: 0 }
  for (const evaluation of evaluations) {
    const label = evaluation.metrics.fillerWords
    if (label in fillerCounts) fillerCounts[label] += 1
  }
  const filler = (Object.entries(fillerCounts).sort(
    (first, second) => second[1] - first[1],
  )[0]?.[0] ?? 'Medio') as SkillSummary['filler']

  return {
    fluency,
    confidence,
    keywords,
    filler,
    fillerScore: (fillerMap[filler] ?? 2) * 33,
  }
}

export function getRecentRecommendations(
  sessions: InterviewSession[] = readSessions(),
  limit = 3,
): string[] {
  const recommendations: string[] = []
  for (const session of sessions) {
    for (const recommendation of session.evaluation.recommendations) {
      if (recommendations.length >= limit) break
      if (!recommendations.includes(recommendation)) {
        recommendations.push(recommendation)
      }
    }
    if (recommendations.length >= limit) break
  }
  return recommendations
}

export function modeLabel(mode: string): string {
  if (mode === 'universidad') return 'Universidad'
  if (mode === 'idiomas') return 'Centro de Idiomas'
  return 'Laboral'
}

export function modeKey(mode: string): 'laboral' | 'universidad' | 'idiomas' {
  if (mode === 'universidad') return 'universidad'
  if (mode === 'idiomas') return 'idiomas'
  return 'laboral'
}

const modeQuestions: Record<string, { text: string; focus: string }[]> = {
  laboral: [
    {
      text: 'Cuéntame sobre una vez en que lideraste un equipo en un proyecto desafiante.',
      focus: 'liderazgo',
    },
    {
      text: 'Describe una situación en la que manejaste un conflicto con un compañero.',
      focus: 'trabajo en equipo',
    },
    {
      text: '¿Cómo priorizas tareas cuando tienes plazos que compiten?',
      focus: 'priorización',
    },
  ],
  universidad: [
    {
      text: '¿Por qué elegiste esta carrera y cómo se alinea con tus objetivos?',
      focus: 'motivación',
    },
    {
      text: 'Háblame de un logro académico del que te sientas orgulloso.',
      focus: 'logros',
    },
    {
      text: '¿Cómo equilibras tus estudios con otras responsabilidades?',
      focus: 'organización',
    },
  ],
  idiomas: [
    {
      text: 'Tell me about your experience learning a new language.',
      focus: 'speaking',
    },
    {
      text: 'How do you handle a situation where you do not understand a question?',
      focus: 'communication',
    },
    {
      text: 'What are your goals for improving your fluency this year?',
      focus: 'goals',
    },
  ],
}

const modeAnswers: Record<string, string[]> = {
  laboral: [
    'En mi proyecto anterior lideré un equipo de ocho ingenieros durante una migración crítica. Organicé sprints de dos días, resolví dos bloqueos técnicos y entregamos a tiempo con cero incidentes graves.',
    'Un compañero y yo teníamos prioridades distintas. Propuse una reunión, escuché sus razones y acordamos criterios objetivos. El conflicto se resolvió sin retrasar el proyecto.',
    'Clasifiqué las tareas por impacto y urgencia, comuniqué el orden al equipo y reservé bloques de foco. Revisaba prioridades cada mañana para ajustar si cambiaba algo importante.',
  ],
  universidad: [
    'Elegí esta carrera porque quiero resolver problemas reales con tecnología. Participé en un proyecto de investigación y obtuve el primer puesto en una feria académica.',
    'Organicé un voluntariado de reforzamiento escolar para 20 estudiantes. Coordiné a cinco voluntarios y logramos mejorar sus calificaciones en matemática.',
    'Uso un calendario semanal, separo bloques de estudio y reviso mis objetivos cada domingo. Así puedo cumplir con la universidad y mis actividades extracurriculares.',
  ],
  idiomas: [
    'I practice English every day with short conversations and podcasts. I want to improve my fluency for job interviews and international exams.',
    'When I do not understand a question, I ask politely for clarification and repeat the idea in my own words to confirm. This helps me keep the conversation flowing.',
    'My goal is to speak more confidently in professional settings. I am practicing two speaking sessions per week and reviewing new vocabulary after each one.',
  ],
}

function makeEvaluation(
  score: number,
  fluency: number,
  confidence: number,
  keywords: string,
  filler: 'Bajo' | 'Medio' | 'Alto',
  summary: string,
): InterviewEvaluation {
  return {
    score,
    summary,
    star: {
      situation:
        'La respuesta presenta un contexto claro y relevante para la pregunta.',
      task: 'Se identifica la responsabilidad principal del candidato.',
      action:
        'Las acciones son concretas; se recomienda profundizar en el proceso de decisión.',
      result:
        'El resultado está bien planteado y sería más sólido con una métrica de negocio.',
    },
    metrics: { fluency, fillerWords: filler, confidence, keywords },
    strengths: ['Contexto claro', 'Comunicación estructurada', 'Resultados concretos'],
    recommendations: [
      'Incluye una métrica de impacto en el resultado.',
      'Detalla un obstáculo concreto y cómo lo resolviste.',
      'Cierra con una reflexión breve sobre lo aprendido.',
    ],
    provider: 'gemini',
  }
}

function isoDaysAgo(days: number, hour: number, minute: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

function buildDemoSessions(): InterviewSession[] {
  const configs: {
    days: number
    hour: number
    mode: keyof typeof modeQuestions
    role: string
    duration: number
    score: number
    answered: number
  }[] = [
    { days: 0, hour: 9, mode: 'laboral', role: 'Analista de Datos', duration: 780, score: 84, answered: 3 },
    { days: 0, hour: 8, mode: 'universidad', role: 'Admisión Universitaria', duration: 600, score: 88, answered: 1 },
    { days: 1, hour: 19, mode: 'laboral', role: 'Entrevista de Marketing', duration: 720, score: 80, answered: 3 },
    { days: 1, hour: 11, mode: 'idiomas', role: 'IELTS Speaking', duration: 540, score: 82, answered: 1 },
    { days: 2, hour: 18, mode: 'laboral', role: 'Product Manager', duration: 660, score: 86, answered: 3 },
    { days: 2, hour: 9, mode: 'universidad', role: 'Beca de Excelencia', duration: 900, score: 90, answered: 3 },
    { days: 3, hour: 17, mode: 'idiomas', role: 'TOEFL Practice', duration: 480, score: 78, answered: 1 },
    { days: 3, hour: 20, mode: 'laboral', role: 'Desarrollador Frontend', duration: 600, score: 85, answered: 3 },
    { days: 4, hour: 16, mode: 'universidad', role: 'Admisión Internacional', duration: 720, score: 83, answered: 1 },
    { days: 5, hour: 18, mode: 'laboral', role: 'Business Analyst', duration: 540, score: 87, answered: 3 },
    { days: 6, hour: 12, mode: 'idiomas', role: 'Entrevista en Inglés', duration: 660, score: 81, answered: 1 },
    { days: 8, hour: 15, mode: 'universidad', role: 'Entrevista Académica', duration: 600, score: 84, answered: 3 },
  ]

  return configs.map((config, index) => {
    const questions = modeQuestions[config.mode].map((question, questionIndex) => ({
      id: questionIndex + 1,
      text: question.text,
      focus: question.focus,
    }))
    const answers = questions.map((_, questionIndex) =>
      questionIndex < config.answered
        ? (modeAnswers[config.mode][questionIndex] ?? '')
        : '',
    )
    const evaluation = makeEvaluation(
      config.score,
      80 + (index % 4) * 4,
      76 + (index % 5) * 3,
      `${12 + (index % 5)}/20`,
      index % 3 === 0 ? 'Medio' : 'Bajo',
      `Sesión de ejemplo: buena estructura y comunicación. Con más detalle en las acciones y una métrica de impacto, la respuesta sería más sólida.`,
    )

    return {
      id: `demo-${index + 1}`,
      completedAt: isoDaysAgo(config.days, config.hour, 15),
      mode: config.mode,
      role: config.role,
      difficulty: index % 3 === 0 ? 'Difícil' : 'Intermedio',
      tone: index % 2 === 0 ? 'Neutral' : 'Amigable',
      durationSeconds: config.duration,
      questions,
      answers,
      evaluatedQuestionIndex: Math.max(0, config.answered - 1),
      evaluation,
      demo: true,
    }
  })
}

export function ensureDemoSessions() {
  try {
    if (window.localStorage.getItem(SEED_FLAG) === '1') return
    if (readSessions().length > 0) {
      window.localStorage.setItem(SEED_FLAG, '1')
      return
    }
    writeStorage(STORAGE_KEY, buildDemoSessions())
    window.localStorage.setItem(SEED_FLAG, '1')
  } catch {
    // Si localStorage no está disponible, la app sigue funcionando con datos vacíos.
  }
}
