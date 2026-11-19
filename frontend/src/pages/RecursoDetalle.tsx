import { ArrowLeft, Check, Copy, Lock, Play } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useTranslation } from '../lib/i18n'
import { readPlan } from '../lib/plan'
import { getResource } from '../lib/resources'

export function RecursoDetalle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const t = useTranslation()
  const [copied, setCopied] = useState(false)
  const resource = id ? getResource(id) : undefined

  if (!resource) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <Card className="p-6 text-center">
          <p className="text-body text-content-secondary">
            {t.resources.notFound}
          </p>
          <Link
            to="/recursos"
            className="mt-3 inline-flex items-center gap-1 text-caption font-medium text-primary"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} />
            {t.resources.back}
          </Link>
        </Card>
      </div>
    )
  }

  const locked = Boolean(resource.pro) && readPlan() !== 'pro'

  const handleCopy = async () => {
    if (!resource.copyText) return
    try {
      await navigator.clipboard.writeText(resource.copyText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Link
        to="/recursos"
        className="inline-flex items-center gap-1.5 text-caption font-medium text-content-secondary transition-colors hover:text-content-primary"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} />
        {t.resources.back}
      </Link>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge>{t.resources[resource.category]}</Badge>
          {resource.pro && (
            <Badge tone="warning">
              <Lock className="mr-1 size-3" strokeWidth={2} />
              {t.resources.pro}
            </Badge>
          )}
        </div>
        <div>
          <h1>{resource.title}</h1>
          <p className="mt-1 text-body text-content-secondary">
            {resource.description}
          </p>
          <p className="mt-1 text-caption text-content-secondary">
            {resource.readMinutes} {t.resources.readMinutes}
          </p>
        </div>
      </header>

      {locked ? (
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-warning/10 text-warning">
            <Lock className="size-6" strokeWidth={1.75} />
          </span>
          <div>
            <p className="font-display text-h2 font-semibold text-content-primary">
              {t.resources.proTitle}
            </p>
            <p className="mt-1 text-caption text-content-secondary">
              {t.resources.proDesc}
            </p>
          </div>
          <Button size="sm" onClick={() => navigate('/perfil')}>
            {t.resources.upgrade}
          </Button>
        </Card>
      ) : (
        <>
          {resource.sections.map((section, index) => (
            <Card key={index} className="p-5">
              {section.heading && (
                <h2 className="text-label font-semibold text-content-primary">
                  {section.heading}
                </h2>
              )}
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-2 text-body text-content-secondary"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-2 flex flex-col gap-1.5">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-caption text-content-secondary"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}

          {resource.copyText && (
            <Card className="p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-label font-semibold text-content-primary">
                  {t.resources.copy}
                </h2>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  leftIcon={
                    copied ? (
                      <Check className="size-4" strokeWidth={2} />
                    ) : (
                      <Copy className="size-4" strokeWidth={1.75} />
                    )
                  }
                >
                  {copied ? t.resources.copied : t.resources.copy}
                </Button>
              </div>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-input border border-border bg-background p-3 text-caption text-content-primary">
                {resource.copyText}
              </pre>
            </Card>
          )}

          {resource.practiceMode && (
            <div>
              <Button
                leftIcon={<Play className="size-4" strokeWidth={1.75} />}
                onClick={() =>
                  navigate('/setup', {
                    state: { mode: resource.practiceMode },
                  })
                }
              >
                {t.resources.practice}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
