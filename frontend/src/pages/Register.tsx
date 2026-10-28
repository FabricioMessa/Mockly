import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const getPasswordStrength = (pass: string) => {
    let score = 0
    if (!pass) return { score: 0, label: '', color: 'bg-slate-800' }
    if (pass.length >= 6) score++
    if (pass.length >= 8) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++

    switch (score) {
      case 1: return { score: 33, label: 'Débil', color: 'bg-red-500' }
      case 2: return { score: 66, label: 'Media', color: 'bg-amber-500' }
      case 3:
      case 4: return { score: 100, label: 'Fuerte', color: 'bg-emerald-500' }
      default: return { score: 0, label: '', color: 'bg-slate-800' }
    }
  }

  const strength = getPasswordStrength(password)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      // Simulando base de datos guardando en el navegador
      const existingUser = localStorage.getItem('mockly_user')
      if (existingUser) {
        // Opcional: Podrías manejar múltiples usuarios, pero para prueba simple guardamos uno solo
      }

      const userData = { fullName, email, password }
      localStorage.setItem('mockly_user', JSON.stringify(userData))
      localStorage.setItem('mockly_token', 'session_active_123')

      setLoading(false)
      navigate('/dashboard') // Te lleva al dashboard
    }, 800)
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Mockly</h1>
          <p className="text-xs text-slate-400 mt-1">Crea tu cuenta (Modo Local DB)</p>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-950 p-1 text-center text-sm font-medium mb-6 border border-slate-800">
          <Link to="/login" className="rounded-lg py-2 text-slate-400 hover:text-white transition">Iniciar sesión</Link>
          <button className="rounded-lg bg-blue-600 py-2 text-white shadow">Crear cuenta</button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Nombre completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crea una contraseña"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
            />
            {password && (
              <div className="mt-2">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Seguridad:</span>
                  <span className="font-semibold text-slate-200">{strength.label}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.score}%` }}></div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirma tu contraseña"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
              className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-[11px] leading-tight text-slate-400">
              Acepto los Términos y la Política de privacidad.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !termsAccepted}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-blue-400 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}