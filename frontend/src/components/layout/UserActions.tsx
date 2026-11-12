import { Bell } from 'lucide-react'
import { useAppSettings } from '../../context/appSettings'
import { useTranslation } from '../../lib/i18n'

export function UserActions() {
  const { language, toggleLanguage } = useAppSettings()
  const t = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleLanguage}
        className="rounded-pill border border-border bg-surface px-2.5 py-1.5 text-label transition-colors hover:border-primary/40"
        aria-label={t.user.language}
        title={t.user.language}
      >
        <span
          className={
            language === 'es'
              ? 'font-semibold text-content-primary'
              : 'text-content-secondary'
          }
        >
          ES
        </span>
        <span className="mx-0.5 text-border">|</span>
        <span
          className={
            language === 'en'
              ? 'font-semibold text-content-primary'
              : 'text-content-secondary'
          }
        >
          EN
        </span>
      </button>

      <button
        type="button"
        aria-label={t.user.notifications}
        className="flex size-10 items-center justify-center rounded-full text-content-secondary transition-colors hover:bg-background hover:text-content-primary"
      >
        <Bell className="size-5" strokeWidth={1.75} />
      </button>

      <div
        className="flex size-10 items-center justify-center rounded-full bg-primary font-display text-label font-semibold text-white"
        aria-label={t.user.profile}
      >
        A
      </div>
    </div>
  )
}
