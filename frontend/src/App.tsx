import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { DesignSystem } from './pages/DesignSystem'
import { Login } from './pages/Login'
import { NotFound } from './pages/NotFound'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { Register } from './pages/Register'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/entrevistas"
            element={
              <PlaceholderPage
                title="Entrevistas"
                description="Historial de simulacros y acceso a la sala en vivo."
                owner="Fase 2"
              />
            }
          />
          <Route
            path="/progreso"
            element={
              <PlaceholderPage
                title="Progreso"
                description="Métricas, puntajes y evolución del usuario."
                owner="Fase 2"
              />
            }
          />
          <Route
            path="/recursos"
            element={
              <PlaceholderPage
                title="Recursos"
                description="Guías y material de apoyo para las entrevistas."
                owner="Fase 2"
              />
            }
          />
          <Route
            path="/perfil"
            element={
              <PlaceholderPage
                title="Perfil"
                description="Datos del usuario y pasarela de pago."
                owner="Fase 1 · Integrante A"
              />
            }
          />
          <Route path="/design-system" element={<DesignSystem />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
