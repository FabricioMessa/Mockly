import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1>404</h1>
      <p className="text-body text-content-secondary">
        La página que buscas no existe.
      </p>
      <Link to="/dashboard">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  )
}
