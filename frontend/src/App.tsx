import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './components/auth/RequireAuth'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { DesignSystem } from './pages/DesignSystem'
import { EntrevistaDetalle } from './pages/EntrevistaDetalle'
import { Entrevistas } from './pages/Entrevistas'
import { FeedbackReport } from './pages/FeedbackReport'
import { Login } from './pages/Login'
import { NotFound } from './pages/NotFound'
import { PerfilPago } from './pages/PerfilPago'
import { Progreso } from './pages/Progreso'
import { RecursoDetalle } from './pages/RecursoDetalle'
import { Recursos } from './pages/Recursos'
import { Register } from './pages/Register'
import { SalaSimulacro } from './pages/SalaSimulacro'
import { SetupInterview } from './pages/SetupInterview'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth />}>
          <Route path="/simulacro" element={<SalaSimulacro />} />
          <Route path="/setup" element={<SetupInterview />} />
          <Route path="/feedback" element={<FeedbackReport />} />

          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/entrevistas" element={<Entrevistas />} />
            <Route path="/entrevistas/:id" element={<EntrevistaDetalle />} />
            <Route path="/progreso" element={<Progreso />} />
            <Route path="/recursos" element={<Recursos />} />
            <Route path="/recursos/:id" element={<RecursoDetalle />} />
            <Route path="/perfil" element={<PerfilPago />} />
            <Route path="/design-system" element={<DesignSystem />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
