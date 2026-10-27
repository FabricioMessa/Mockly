import { Search } from 'lucide-react'
import { UserActions } from './UserActions'

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 hidden items-center justify-between gap-6 border-b border-border bg-surface px-8 py-3 lg:flex">
      <div className="relative w-full max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-content-secondary"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Buscar entrevistas, temas o recursos..."
          aria-label="Buscar entrevistas, temas o recursos"
          className="h-11 w-full rounded-pill border border-border bg-background pl-10 pr-4 text-body text-content-primary placeholder:text-content-secondary focus-visible:border-primary"
        />
      </div>

      <UserActions />
    </header>
  )
}
