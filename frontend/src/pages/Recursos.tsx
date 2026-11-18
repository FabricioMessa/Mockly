import { ChevronRight, Lock, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { useTranslation } from '../lib/i18n'
import {
  RESOURCE_CATEGORIES,
  resources,
} from '../lib/resources'
import type { ResourceCategory } from '../lib/resources'

type Filter = ResourceCategory | 'all'

export function Recursos() {
  const t = useTranslation()
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      resources.filter((resource) => {
        const matchesCategory =
          filter === 'all' || resource.category === filter
        const query = search.trim().toLowerCase()
        const matchesSearch =
          query.length === 0 ||
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query)
        return matchesCategory && matchesSearch
      }),
    [filter, search],
  )

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1>{t.resources.title}</h1>
        <p className="mt-1 text-body text-content-secondary">
          {t.resources.subtitle}
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-secondary"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.resources.search}
            aria-label={t.resources.search}
            className="h-10 w-full rounded-pill border border-border bg-surface pl-9 pr-3 text-caption text-content-primary placeholder:text-content-secondary focus-visible:border-primary"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {RESOURCE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setFilter(category.id)}
              className={
                filter === category.id
                  ? 'rounded-pill bg-primary px-3 py-1.5 text-caption font-medium text-white'
                  : 'rounded-pill border border-border bg-surface px-3 py-1.5 text-caption text-content-secondary transition-colors hover:text-content-primary'
              }
            >
              {t.resources[category.key]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-6 text-center text-caption text-content-secondary">
          {t.resources.empty}
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((resource) => (
            <Link
              key={resource.id}
              to={`/recursos/${resource.id}`}
              className="block"
            >
              <Card interactive className="h-full p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge>{t.resources[resource.category]}</Badge>
                  {resource.pro && (
                    <Badge tone="warning">
                      <Lock className="mr-1 size-3" strokeWidth={2} />
                      {t.resources.pro}
                    </Badge>
                  )}
                </div>

                <h2 className="mt-3 font-display text-h2 font-semibold text-content-primary">
                  {resource.title}
                </h2>
                <p className="mt-1 text-caption text-content-secondary">
                  {resource.description}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-caption text-content-secondary">
                    {resource.readMinutes} {t.resources.readMinutes}
                  </span>
                  <ChevronRight
                    className="size-4 text-content-secondary"
                    strokeWidth={1.75}
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
