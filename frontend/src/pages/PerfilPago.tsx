import { Award, CalendarDays, ChevronLeft, Flame } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PlanPayment } from '../components/perfil/PlanPayment'
import { ProfileSettings } from '../components/perfil/ProfileSettings'
import { StatChip } from '../components/ui/StatChip'
import { cn } from '../lib/cn'

type MobileView = 'perfil' | 'planes'

export function PerfilPago() {
  const [mobileView, setMobileView] = useState<MobileView>('perfil')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 lg:hidden">
        {mobileView === 'planes' ? (
          <button
            type="button"
            onClick={() => setMobileView('perfil')}
            aria-label="Volver al perfil"
            className="flex size-9 items-center justify-center rounded-full text-content-secondary transition-colors hover:bg-surface hover:text-content-primary"
          >
            <ChevronLeft className="size-5" strokeWidth={1.75} />
          </button>
        ) : (
          <Link
            to="/dashboard"
            aria-label="Volver al inicio"
            className="flex size-9 items-center justify-center rounded-full text-content-secondary transition-colors hover:bg-surface hover:text-content-primary"
          >
            <ChevronLeft className="size-5" strokeWidth={1.75} />
          </Link>
        )}
        <h1 className="text-h2">
          {mobileView === 'planes' ? 'Mejorar a Pro' : 'Perfil y configuración'}
        </h1>
      </div>

      <div className="hidden items-center justify-between gap-4 lg:flex">
        <h1>Ajustes</h1>
        <div className="flex gap-3">
          <StatChip
            icon={<CalendarDays className="size-5" strokeWidth={1.75} />}
            value={12}
            label="entrevistas"
            tone="primary"
          />
          <StatChip
            icon={<Award className="size-5" strokeWidth={1.75} />}
            value={84}
            label="puntaje"
            tone="accent"
          />
          <StatChip
            icon={<Flame className="size-5" strokeWidth={1.75} />}
            value={7}
            label="días de racha"
            tone="warning"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        <div className={cn(mobileView === 'planes' && 'hidden lg:block')}>
          <ProfileSettings onUpgrade={() => setMobileView('planes')} />
        </div>

        <div className={cn(mobileView === 'perfil' && 'hidden lg:block')}>
          <PlanPayment />
        </div>
      </div>
    </div>
  )
}
