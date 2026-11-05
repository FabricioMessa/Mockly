import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function SetupInterview() {
  const navigate = useNavigate()
  const [role, setRole] = useState('Junior Software Engineer')
  const [difficulty, setDifficulty] = useState('Medium')
  const [tone, setTone] = useState('Neutral')

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/simulacro')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
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
                {['Fácil', 'Medium', 'Difícil'].map((lvl) => (
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
                  onClick={() => setTone(item.name)}
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