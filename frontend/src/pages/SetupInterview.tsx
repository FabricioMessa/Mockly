import { ArrowLeft, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { fetchQuestions } from '../lib/api'
import type { Question } from '../lib/api'
import { saveQuestions, saveSetup } from '../lib/interviewStorage'

const difficultyMap: Record<string, string> = {
  Fácil: 'facil',
  Intermedio: 'intermedio',
  Difícil: 'dificil',
}

const toneMap: Record<string, string> = {
  Amigable: 'amigable',
  Neutral: 'neutral',
  'Exigente / Estrés': 'exigente',
}

export function SetupInterview() {
  const navigate = useNavigate()
  const location = useLocation()
  const mode =
    (location.state as { mode?: string } | null)?.mode ?? 'laboral'
  const [role, setRole] = useState('Junior Software Engineer')
  const [difficulty, setDifficulty] = useState('Intermedio')
  const [tone, setTone] = useState('Neutral')
  const [aiQuestions, setAiQuestions] = useState<Question[]>([])
  const [generating, setGenerating] = useState(false)
  const [aiError, setAiError] = useState('')

  const handleGenerate = async () => {
    setGenerating(true)
    setAiError('')

    try {
      const result = await fetchQuestions({
        mode,
        role,
        difficulty: difficultyMap[difficulty] ?? 'intermedio',
        tone: toneMap[tone] ?? 'neutral',
        count: 3,
      })
      setAiQuestions(result.questions)
      saveQuestions(result.questions)
      saveSetup({ mode, role, difficulty, tone })
    } catch {
      setAiError(
        'No se pudo conectar con la IA. Verifica que el backend esté activo.',
      )
    } finally {
      setGenerating(false)
    }
  }

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    saveSetup({ mode, role, difficulty, tone })
    navigate('/simulacro')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Volver al inicio
        </Link>

        <header className="mb-6">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Interviews &bull; Nueva sesión</span>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">Configura tu Entrevista</h1>
          <p className="text-sm text-slate-500 mt-1">
            Personaliza el entrevistador con IA según tu rol, experiencia y objetivos.
          </p>
        </header>

        <form onSubmit={handleStart} className="space-y-6">
          {/* Subir CV */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">✓</span>
                Sube tu CV o Resumen
              </label>
              <span className="text-xs text-slate-400">Solo PDF, máx. 10 MB.</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-600">📄</div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Alex_Morgan_CV.pdf</p>
                  <span className="text-xs text-emerald-600 font-medium">Subido correctamente</span>
                </div>
              </div>
              <button type="button" className="text-xs text-slate-500 hover:text-slate-900 underline">
                Cambiar
              </button>
            </div>
          </div>

          {/* Rol y Dificultad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="text-sm font-semibold text-slate-900 block mb-3">Puesto objetivo</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none"
              >
                <option value="Junior Software Engineer">Junior Software Engineer</option>
                <option value="Senior Frontend Developer">Senior Frontend Developer</option>
                <option value="Product Manager">Product Manager</option>
              </select>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="text-sm font-semibold text-slate-900 block mb-3">Dificultad</label>
              <div className="grid grid-cols-3 gap-2">
                {['Fácil', 'Intermedio', 'Difícil'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`rounded-xl py-2.5 text-xs font-semibold border transition ${
                      difficulty === lvl
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tono del entrevistador */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="text-sm font-semibold text-slate-900 block mb-1">Personalidad y tono del entrevistador</label>
            <p className="text-xs text-slate-500 mb-4">Selecciona la actitud y nivel de exigencia de la IA durante la simulación.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: 'Amigable', desc: 'Cálido, ofrece guía y retroalimentación alentadora.' },
                { name: 'Neutral', desc: 'Profesional, equilibrado y directo en el feedback.' },
                { name: 'Exigente / Estrés', desc: 'Preguntas incisivas, mayor presión y repreguntas.' },
              ].map((item) => (
                <div
                  key={item.name}
                  role="button"
                  tabIndex={0}
                  aria-pressed={tone === item.name}
                  onClick={() => setTone(item.name)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setTone(item.name)
                    }
                  }}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    tone === item.name
                      ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900 mb-1">{item.name}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Preguntas con IA */}
          <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Sparkles className="size-4 text-blue-600" />
                  Preguntas generadas por IA
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Gemini generará 3 preguntas según tu rol, dificultad y tono.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
              >
                {generating
                  ? 'Generando...'
                  : aiQuestions.length > 0
                    ? 'Regenerar'
                    : 'Generar preguntas'}
              </button>
            </div>

            {aiError && (
              <p className="mt-3 text-xs font-medium text-red-600">{aiError}</p>
            )}

            {aiQuestions.length > 0 && (
              <ol className="mt-4 space-y-2">
                {aiQuestions.map((question, index) => (
                  <li
                    key={question.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
                  >
                    <span className="font-semibold text-blue-600">
                      {index + 1}.
                    </span>{' '}
                    {question.text}
                    {question.focus && (
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-slate-400">
                        {question.focus}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Botón Acción */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">⚡ ~15-20 min &bull; 4-5 preguntas conductuales</span>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
            >
              Iniciar Simulación &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}