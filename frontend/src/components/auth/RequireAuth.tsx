import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { setActiveUserId } from '../../lib/interviewHistory'
import { supabase } from '../../lib/supabase'

export function RequireAuth() {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setActiveUserId(session?.user.id ?? null)
      setAuthenticated(!!session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setActiveUserId(session?.user.id ?? null)
      setAuthenticated(!!session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Verificando sesión...
      </div>
    )
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />
}