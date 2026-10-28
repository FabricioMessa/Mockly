import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      setLoading(false)

      // Leemos la "base de datos" local simulada
      const savedUserStr = localStorage.getItem('mockly_user')
      
      if (!savedUserStr) {
        setError('No hay cuentas registradas. Por favor regístrate primero.')
        return
      }

      const savedUser = JSON.parse(savedUserStr)

      // Verificación de credenciales
      if (savedUser.email === email && savedUser.password === password) {
        localStorage.setItem('mockly_token', 'session_active_123')
        navigate('/dashboard')
      } else {
        setError('Correo o contraseña incorrectos.')
      }
    }, 800)
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Mockly</h1>
          <p className="text-xs text-slate-400 mt-1">Inicia sesión (Verificación Local)</p>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-950 p-1 text-center text-sm font-medium mb-6 border border-slate-800">
          <button className="rounded-lg bg-blue-600 py-2 text-white shadow">Iniciar sesión</button>
          <Link to="/register" className="rounded-lg py-2 text-slate-400 hover:text-white transition">Crear cuenta</Link>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 pr-10 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                👁️
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-medium text-blue-400 hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  )
}