import { Download, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from '../../lib/i18n'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const DISMISS_KEY = 'mockly_install_dismissed'

export function InstallBanner() {
  const t = useTranslation()
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(() => {
    try {
      return window.localStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!deferred || dismissed) return null

  const handleInstall = async () => {
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
  }

  const handleDismiss = () => {
    setDismissed(true)
    try {
      window.localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // ignore
    }
  }

  return (
    <div className="rounded-card border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 p-4">
      <div className="flex items-start gap-3">
        <Logo size={40} />
        <div className="min-w-0 flex-1">
          <p className="text-label font-semibold text-content-primary">
            {t.pwa.title}
          </p>
          <p className="mt-0.5 text-caption text-content-secondary">
            {t.pwa.description}
          </p>
          <Button
            size="sm"
            className="mt-2"
            onClick={handleInstall}
            leftIcon={<Download className="size-4" strokeWidth={1.75} />}
          >
            {t.pwa.action}
          </Button>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t.pwa.dismiss}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-content-secondary transition-colors hover:bg-background hover:text-content-primary"
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  )
}
