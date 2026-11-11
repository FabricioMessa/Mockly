import {
  Bell,
  ChevronRight,
  Clock,
  Crown,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  Mic,
  Moon,
  Pencil,
  Shield,
  Sparkles,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../lib/auth'
import { cn } from '../../lib/cn'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface SettingsRowProps {
  icon: LucideIcon
  label: string
  value?: string
  trailing?: ReactNode
  danger?: boolean
  onClick?: () => void
}

function SettingsRow({
  icon: Icon,
  label,
  value,
  trailing,
  danger = false,
  onClick,
}: SettingsRowProps) {
  const content = (
    <>
      <Icon
        className={cn(
          'size-5 shrink-0',
          danger ? 'text-error' : 'text-content-secondary',
        )}
        strokeWidth={1.75}
      />
      <span className={cn('text-label', danger ? 'text-error' : 'text-content-primary')}>
        {label}
      </span>
      <span className="ml-auto flex items-center gap-2">
        {trailing ??
          (value && (
            <span className="text-caption text-content-secondary">{value}</span>
          ))}
        {!trailing && (
          <ChevronRight className="size-4 text-content-secondary" strokeWidth={1.75} />
        )}
      </span>
    </>
  )

  const className =
    'flex w-full items-center gap-3 rounded-input px-1 py-3 text-left transition-colors hover:bg-background'

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    )
  }

  return <div className={className}>{content}</div>
}

interface ToggleProps {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 rounded-pill transition-colors',
        checked ? 'bg-primary' : 'bg-border',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-all',
          checked ? 'left-[22px]' : 'left-0.5',
        )}
      />
    </button>
  )
}

export function ProfileSettings({ onUpgrade }: { onUpgrade: () => void }) {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary font-display text-h2 font-semibold text-white">
          AQ
        </div>
        <div className="min-w-0">
          <p className="font-display text-h2 font-semibold text-content-primary">
            Andrea Quispe
          </p>
          <p className="truncate text-label text-content-secondary">
            andrea.quispe@email.com
          </p>
          <button
            type="button"
            className="mt-1 inline-flex items-center gap-1 text-caption font-medium text-primary lg:hidden"
          >
            <Pencil className="size-3.5" strokeWidth={1.75} />
            Editar perfil
          </button>
        </div>
      </div>

      <hr className="my-4 border-border" />

      <h2 className="text-label font-semibold text-content-primary">Preferencias</h2>
      <div className="mt-1 flex flex-col">
        <SettingsRow
          icon={Globe}
          label="Idioma"
          trailing={
            <select
              defaultValue="es"
              aria-label="Idioma de la aplicación"
              className="rounded-pill border border-border bg-surface px-3 py-1 text-caption text-content-primary"
            >
              <option value="es">Español / English</option>
              <option value="en">English / Español</option>
            </select>
          }
        />
        <SettingsRow
          icon={Bell}
          label="Notificaciones"
          trailing={
            <Toggle
              checked={notifications}
              onChange={setNotifications}
              label="Activar notificaciones"
            />
          }
        />
        <SettingsRow icon={Mic} label="Voz del reclutador" value="Femenina" />
        <SettingsRow icon={Moon} label="Tema" value="Claro" />
        <SettingsRow icon={Clock} label="Zona horaria" value="(GMT-05:00) Lima" />
      </div>

      <div className="mt-4 rounded-card border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/10 p-4 lg:hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-caption text-content-secondary">
            <Crown className="size-4 text-warning" strokeWidth={1.75} />
            Tu plan actual
          </span>
          <Badge>Plan actual</Badge>
        </div>
        <p className="mt-2 font-display text-h2 font-semibold text-content-primary">
          Free
        </p>
        <p className="mt-1 text-caption text-content-secondary">
          Accede a prácticas básicas y mejora tus habilidades.
        </p>
        <Button
          fullWidth
          className="mt-3"
          leftIcon={<Sparkles className="size-4" strokeWidth={1.75} />}
          onClick={onUpgrade}
        >
          Mejorar a Pro
        </Button>
      </div>

      <hr className="my-4 border-border" />

      <h2 className="text-label font-semibold text-content-primary">Cuenta</h2>
      <div className="mt-1 flex flex-col">
        <SettingsRow icon={User} label="Perfil público" />
        <SettingsRow icon={Shield} label="Seguridad" />
        <SettingsRow icon={HelpCircle} label="Ayuda y soporte" />
        <SettingsRow icon={Info} label="Acerca de Mockly" value="Versión 1.6.0" />
      </div>

      <hr className="my-2 border-border" />

      <SettingsRow
        icon={LogOut}
        label="Cerrar sesión"
        danger
        onClick={handleLogout}
      />
    </Card>
  )
}
