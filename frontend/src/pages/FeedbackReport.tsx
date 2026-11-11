import { useNavigate } from 'react-router-dom'
import type { InterviewEvaluation } from '../lib/api'
import { readEvaluation } from '../lib/interviewStorage'

const fallbackEvaluation: InterviewEvaluation = {
  score: 82,
  summary:
    'Completaste la simulación de Product Management · 3 preguntas conductuales en 5m 34s. Tu puntaje te ubica en el top 28% de los participantes esta semana.',
  star: {
    situation:
      'Estableciste claramente el contexto: el tamaño del equipo y la línea de tiempo fueron específicos y creíbles.',
    task: 'Tu nivel de responsabilidad fue evidente. El uso de "yo lideré" te posiciona bien como tomador de decisiones.',
    action:
      'Buena especificidad: standups diarios, sprints de dos días y desbloqueo del equipo. Demuestra liderazgo activo.',
    result:
      'El resultado cuantificado (a tiempo, cero bugs críticos) es sólido y contundente.',
  },
  metrics: {
    fluency: 87,
    fillerWords: 'Bajo',
    confidence: 79,
    keywords: '14/20',
  },
  strengths: ['STAR', 'métricas', 'liderazgo'],
  recommendations: [
    'Agrega el impacto en el negocio para dar mayor sentido de urgencia.',
    'Menciona qué hizo que la tarea fuera especialmente compleja.',
    'Nombra un obstáculo técnico o interpersonal concreto que resolviste.',
    'Añade una métrica de negocio, por ejemplo reducción de costos.',
  ],
}

export function FeedbackReport() {
  const navigate = useNavigate()
  const evaluation = readEvaluation() ?? fallbackEvaluation
  const isAi = evaluation.provider === 'gemini'
  const keywordHint =
    evaluation.strengths.slice(0, 3).join(', ') || 'STAR, métricas, liderazgo'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Tarjeta Resumen Principal */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm relative">
          <div className="absolute top-6 right-6 flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs text-emerald-700 font-semibold">
            <span>● Buen Trabajo</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-blue-600 bg-blue-50">
              <div className="text-center">
                <span className="text-3xl font-extrabold text-slate-900">
                  {evaluation.score}
                </span>
                <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                  de 100
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-center md:text-left">
              <h1 className="text-2xl font-bold text-slate-900">
                Entrevista Completada
              </h1>
              <p className="text-sm text-slate-600">{evaluation.summary}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2 text-xs text-slate-500">
                <span>
                  Preguntas: <strong className="text-slate-800">3</strong>
                </span>
                <span>
                  Puntuación: <strong className="text-slate-800">{evaluation.score}/100</strong>
                </span>
                <span>
                  Rol: <strong className="text-slate-800">PM Senior</strong>
                </span>
                <span className="inline-flex items-center gap-1">
                  Fuente:{' '}
                  <strong className={isAi ? 'text-blue-600' : 'text-slate-800'}>
                    {isAi ? 'IA · Gemini' : 'Modo demo'}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mallas de Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs text-slate-500 block mb-1">
              Fluidez y Ritmo
            </span>
            <p className="text-2xl font-bold text-slate-900 mb-1">
              {evaluation.metrics.fluency}
            </p>
            <span className="text-[10px] text-emerald-600 font-medium">
              Estimado por IA
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs text-slate-500 block mb-1">
              Uso de Muletillas
            </span>
            <p className="text-2xl font-bold text-amber-600 mb-1">
              {evaluation.metrics.fillerWords}
            </p>
            <span className="text-[10px] text-slate-500">Estimado por IA</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs text-slate-500 block mb-1">
              Nivel de Confianza
            </span>
            <p className="text-2xl font-bold text-slate-900 mb-1">
              {evaluation.metrics.confidence}
            </p>
            <span className="text-[10px] text-slate-500">Estimado por IA</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs text-slate-500 block mb-1">
              Palabras Clave
            </span>
            <p className="text-2xl font-bold text-blue-600 mb-1">
              {evaluation.metrics.keywords}
            </p>
            <span className="text-[10px] text-slate-500">{keywordHint}</span>
          </div>
        </div>

        {/* Feedback STAR Breakdown */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">
              Feedback de IA &bull; Desglose Método STAR
            </h2>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Volver al Dashboard
            </button>
          </div>

          {/* Situación */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-1.5">
            <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-bold uppercase">
              Situación
            </span>
            <p className="text-sm text-slate-800">
              {evaluation.star.situation}
            </p>
            <p className="text-xs text-blue-600/90 italic">
              + {evaluation.recommendations[0] ?? 'Agrega más contexto al escenario.'}
            </p>
          </div>

          {/* Tarea */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 space-y-1.5">
            <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold uppercase">
              Tarea
            </span>
            <p className="text-sm text-slate-800">{evaluation.star.task}</p>
            <p className="text-xs text-amber-700/90 italic">
              + {evaluation.recommendations[1] ?? 'Detalla mejor tu responsabilidad.'}
            </p>
          </div>

          {/* Acción */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-1.5">
            <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
              Acción
            </span>
            <p className="text-sm text-slate-800">{evaluation.star.action}</p>
            <p className="text-xs text-emerald-700/90 italic">
              + {evaluation.recommendations[2] ?? 'Nombra un obstáculo concreto.'}
            </p>
          </div>

          {/* Resultado */}
          <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4 space-y-1.5">
            <span className="inline-block px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-xs font-bold uppercase">
              Resultado
            </span>
            <p className="text-sm text-slate-800">{evaluation.star.result}</p>
            <p className="text-xs text-purple-700/90 italic">
              + {evaluation.recommendations[3] ?? 'Añade una métrica de negocio.'}
            </p>
          </div>
        </div>

        {evaluation.warning && (
          <p className="text-center text-xs text-amber-600">
            {evaluation.warning}
          </p>
        )}
      </div>
    </div>
  )
}
