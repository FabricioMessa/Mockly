import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function SetupInterview() {
  const navigate = useNavigate()
  const [role, setRole] = useState('Junior Software Engineer')
  const [difficulty, setDifficulty] = useState('Medium')
  const [tone, setTone] = useState('Neutral')
  const [cvUploaded, setCvUploaded] = useState(true)

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí puedes guardar la config en localStorage o state global si deseas
    navigate('/dashboard') // O a la sala de simulación activa
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Interviews &bull; New simulation</span>
          <h1 className="text-3xl font-bold mt-1">Set Up Your Interview</h1>
          <p className="text-sm text-slate-400 mt-1">
            Tailor a realistic AI interviewer to your role, experience, and goals.
          </p>
        </header>

        <form onSubmit={handleStart} className="space-y-6">
          {/* CV Upload */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs">✓</span>
                Add your CV or resume
              </label>
              <span className="text-xs text-slate-400">PDF only, up to 10 MB.</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-dashed border-slate-700 bg-slate-950 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-600/20 p-2.5 text-blue-400">📄</div>
                <div>
                  <p className="text-sm font-medium">Alex_Morgan_CV.pdf</p>
                  <span className="text-xs text-emerald-400">Uploaded successfully</span>
                </div>
              </div>
              <button type="button" onClick={() => setCvUploaded(!cvUploaded)} className="text-xs text-slate-400 hover:text-white underline">
                Change
              </button>
            </div>
          </div>

          {/* Role & Difficulty Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <label className="text-sm font-semibold block mb-3">Target role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Junior Software Engineer">Junior Software Engineer</option>
                <option value="Senior Frontend Developer">Senior Frontend Developer</option>
                <option value="Product Manager">Product Manager</option>
              </select>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <label className="text-sm font-semibold block mb-3">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {['Easy', 'Medium', 'Hard'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`rounded-xl py-2.5 text-xs font-medium border transition ${
                      difficulty === lvl
                        ? 'border-blue-500 bg-blue-600/20 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interviewer Personality */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <label className="text-sm font-semibold block mb-1">Interviewer personality & tone</label>
            <p className="text-xs text-slate-400 mb-4">Choose how your AI interviewer responds, probes, and gives you feedback.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: 'Friendly', desc: 'Warm, prompts and encouraging feedback.' },
                { name: 'Neutral', desc: 'Professional, balanced, and focused on direct feedback.' },
                { name: 'Tough / Stress test', desc: 'Direct challenges, pressure, and deeper probing.' },
              ].map((item) => (
                <div
                  key={item.name}
                  onClick={() => setTone(item.name)}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    tone === item.name
                      ? 'border-blue-500 bg-blue-600/10'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-xs text-slate-400">⚡ About 15-20 min &bull; 4-5 behavioral questions</span>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition"
            >
              Start Simulation &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}