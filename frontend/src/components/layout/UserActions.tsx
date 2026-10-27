import { Bell } from 'lucide-react'

export function UserActions() {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="rounded-pill border border-border bg-surface px-2.5 py-1.5 text-label transition-colors hover:border-primary/40"
        aria-label="Cambiar idioma"
      >
        <span className="font-semibold text-content-primary">ES</span>
        <span className="mx-0.5 text-border">|</span>
        <span className="text-content-secondary">EN</span>
      </button>

      <button
        type="button"
        aria-label="Notificaciones"
        className="flex size-10 items-center justify-center rounded-full text-content-secondary transition-colors hover:bg-background hover:text-content-primary"
      >
        <Bell className="size-5" strokeWidth={1.75} />
      </button>

      <div
        className="flex size-10 items-center justify-center rounded-full bg-primary font-display text-label font-semibold text-white"
        aria-label="Perfil de Andrea"
      >
        A
      </div>
    </div>
  )
}
