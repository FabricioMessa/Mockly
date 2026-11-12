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
  Sun,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSettings } from '../../context/appSettings'
import { logout } from '../../lib/auth'
import { cn } from '../../lib/cn'
import { useTranslation } from '../../lib/i18n'
import { TIMEZONE_OPTIONS } from '../../lib/preferences'
import type { Language, Theme, Timezone } from '../../lib/preferences'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Toggle } from '../ui/Toggle'
import { AboutModal } from './AboutModal'
import { HelpModal } from './HelpModal'
import { PublicProfileModal } from './PublicProfileModal'
import { SecurityModal } from './SecurityModal'

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
      <span
        className={cn(
          'text-label',
          danger ? 'text-error' : 'text-content-primary',
        )}
      >
        {label}
      </span>
      <span className="ml-auto flex items-center gap-2">
        {trailing ??
          (value && (
            <span className="text-caption text-content-secondary">{value}</span>
          ))}
        {!trailing && (
          <ChevronRight
            className="size-4 text-content-secondary"
            strokeWidth={1.75}
          />
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

interface ThemeToggleProps {
  theme: Theme
  onChange: (theme: Theme) => void
  labels: { light: string; dark: string; aria: string }
}

function ThemeToggle({ theme, onChange, labels }: ThemeToggleProps) {
  return (
    <div
      role="group"
      aria-label={labels.aria}
      className="flex items-center gap-1 rounded-pill border border-border bg-surface p-0.5"
    >
      <button
        type="button"
        aria-pressed={theme === 'light'}
        aria-label={labels.light}
        onClick={() => onChange('light')}
        className={cn(
          'flex size-7 items-center justify-center rounded-full transition-colors',
          theme === 'light'
            ? 'bg-primary text-white'
            : 'text-content-secondary hover:text-content-primary',
        )}
      >
        <Sun className="size-4" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-pressed={theme === 'dark'}
        aria-label={labels.dark}
        onClick={() => onChange('dark')}
        className={cn(
          'flex size-7 items-center justify-center rounded-full transition-colors',
          theme === 'dark'
            ? 'bg-primary text-white'
            : 'text-content-secondary hover:text-content-primary',
        )}
      >
        <Moon className="size-4" strokeWidth={1.75} />
      </button>
    </div>
  )
}

type ModalName = 'public' | 'security' | 'help' | 'about' | null

export function ProfileSettings({ onUpgrade }: { onUpgrade: () => void }) {
  const navigate = useNavigate()
  const t = useTranslation()
  const {
    language,
    setLanguage,
    notifications,
    setNotifications,
    theme,
    setTheme,
    timezone,
    setTimezone,
    publicProfile,
  } = useAppSettings()
  const [modal, setModal] = useState<ModalName>(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
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
              {t.settings.editProfile}
            </button>
          </div>
        </div>

        <hr className="my-4 border-border" />

        <h2 className="text-label font-semibold text-content-primary">
          {t.settings.preferences}
        </h2>
        <div className="mt-1 flex flex-col">
          <SettingsRow
            icon={Globe}
            label={t.settings.language}
            trailing={
              <select
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as Language)
                }
                aria-label={t.settings.languageAria}
                className="rounded-pill border border-border bg-surface px-3 py-1 text-caption text-content-primary"
              >
                <option value="es">{t.settings.spanish}</option>
                <option value="en">{t.settings.english}</option>
              </select>
            }
          />
          <SettingsRow
            icon={Bell}
            label={t.settings.notifications}
            trailing={
              <Toggle
                checked={notifications}
                onChange={setNotifications}
                label={t.settings.notificationsAria}
              />
            }
          />
          <SettingsRow icon={Mic} label="Voz del reclutador" value="Femenina" />
          <SettingsRow
            icon={theme === 'dark' ? Moon : Sun}
            label={t.settings.theme}
            trailing={
              <ThemeToggle
                theme={theme}
                onChange={setTheme}
                labels={{
                  light: t.settings.light,
                  dark: t.settings.dark,
                  aria: t.settings.themeAria,
                }}
              />
            }
          />
          <SettingsRow
            icon={Clock}
            label={t.settings.timezone}
            trailing={
              <select
                value={timezone}
                onChange={(event) =>
                  setTimezone(event.target.value as Timezone)
                }
                aria-label={t.settings.timezoneAria}
                className="max-w-[170px] rounded-pill border border-border bg-surface px-3 py-1 text-caption text-content-primary"
              >
                {TIMEZONE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {language === 'es' ? option.countryEs : option.countryEn} (
                    {option.offset})
                  </option>
                ))}
              </select>
            }
          />
        </div>

        <div className="mt-4 rounded-card border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/10 p-4 lg:hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-caption text-content-secondary">
              <Crown className="size-4 text-warning" strokeWidth={1.75} />
              {t.settings.currentPlan}
            </span>
            <Badge>{t.settings.planCurrent}</Badge>
          </div>
          <p className="mt-2 font-display text-h2 font-semibold text-content-primary">
            {t.settings.free}
          </p>
          <p className="mt-1 text-caption text-content-secondary">
            {t.settings.freeDesc}
          </p>
          <Button
            fullWidth
            className="mt-3"
            leftIcon={<Sparkles className="size-4" strokeWidth={1.75} />}
            onClick={onUpgrade}
          >
            {t.settings.upgrade}
          </Button>
        </div>

        <hr className="my-4 border-border" />

        <h2 className="text-label font-semibold text-content-primary">
          {t.settings.account}
        </h2>
        <div className="mt-1 flex flex-col">
          <SettingsRow
            icon={User}
            label={t.settings.publicProfile}
            value={publicProfile ? t.settings.enabled : t.settings.disabled}
            onClick={() => setModal('public')}
          />
          <SettingsRow
            icon={Shield}
            label={t.settings.security}
            onClick={() => setModal('security')}
          />
          <SettingsRow
            icon={HelpCircle}
            label={t.settings.help}
            onClick={() => setModal('help')}
          />
          <SettingsRow
            icon={Info}
            label={t.settings.about}
            value={t.settings.version}
            onClick={() => setModal('about')}
          />
        </div>

        <hr className="my-2 border-border" />

        <SettingsRow
          icon={LogOut}
          label={t.settings.logout}
          danger
          onClick={handleLogout}
        />
      </Card>

      <PublicProfileModal
        open={modal === 'public'}
        onClose={() => setModal(null)}
      />
      <SecurityModal
        open={modal === 'security'}
        onClose={() => setModal(null)}
      />
      <HelpModal open={modal === 'help'} onClose={() => setModal(null)} />
      <AboutModal open={modal === 'about'} onClose={() => setModal(null)} />
    </>
  )
}
