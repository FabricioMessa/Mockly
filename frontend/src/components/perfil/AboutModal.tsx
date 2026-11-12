import { useTranslation } from '../../lib/i18n'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'
import { Modal } from '../ui/Modal'

export interface AboutModalProps {
  open: boolean
  onClose: () => void
}

export function AboutModal({ open, onClose }: AboutModalProps) {
  const t = useTranslation()

  return (
    <Modal open={open} onClose={onClose} title={t.about.title}>
      <div className="flex flex-col items-center text-center">
        <Logo size={56} withWordmark />
        <p className="mt-3 font-display text-label font-semibold text-content-primary">
          {t.about.tagline}
        </p>
        <p className="mt-2 text-caption leading-relaxed text-content-secondary">
          {t.about.description}
        </p>

        <div className="mt-4 w-full rounded-input border border-border bg-background p-3 text-left">
          <p className="text-caption text-content-primary">{t.about.version}</p>
          <p className="mt-1 text-caption text-content-secondary">
            {t.about.stack}
          </p>
          <p className="mt-1 text-caption text-content-secondary">
            {t.about.authors}
          </p>
        </div>
      </div>

      <Button fullWidth variant="outline" className="mt-4" onClick={onClose}>
        {t.about.close}
      </Button>
    </Modal>
  )
}
