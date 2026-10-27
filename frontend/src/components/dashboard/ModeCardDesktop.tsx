import type { Mode } from './modes'

export function ModeCardDesktop({ mode }: { mode: Mode }) {
  const Icon = mode.icon

  return (
    <div
      className={`flex flex-col rounded-card bg-gradient-to-br ${mode.gradient} p-5 text-white shadow-card`}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15"
          aria-hidden="true"
        >
          <Icon className="size-6" strokeWidth={1.75} />
        </span>
        <h3 className="font-display text-h2 font-semibold">{mode.title}</h3>
      </div>

      <p className="mt-3 text-caption text-white/80">{mode.descriptionDesktop}</p>

      <ul className="mt-4 flex flex-col gap-3">
        {mode.bullets.map(({ icon: BulletIcon, text }) => (
          <li
            key={text}
            className="flex items-start gap-2.5 text-caption text-white/90"
          >
            <span
              className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-white/15"
              aria-hidden="true"
            >
              <BulletIcon className="size-3.5" strokeWidth={1.75} />
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        <button
          type="button"
          className="h-11 w-full rounded-pill bg-black/15 text-label font-medium text-white transition-colors hover:bg-black/25"
        >
          Empezar
        </button>
      </div>
    </div>
  )
}
