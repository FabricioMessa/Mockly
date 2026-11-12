import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { useAppSettings } from '../../context/appSettings'
import { useTranslation } from '../../lib/i18n'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Toggle } from '../ui/Toggle'

const PUBLIC_URL = 'https://mockly.app/u/andrea-quispe'

export interface PublicProfileModalProps {
  open: boolean
  onClose: () => void
}

export function PublicProfileModal({ open, onClose }: PublicProfileModalProps) {
  const { publicProfile, setPublicProfile } = useAppSettings()
  const t = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PUBLIC_URL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.publicProfile.title}
      description={t.publicProfile.description}
    >
      <div className="flex items-center justify-between gap-3 rounded-input border border-border bg-background p-3">
        <span className="text-label text-content-primary">
          {t.publicProfile.toggle}
        </span>
        <Toggle
          checked={publicProfile}
          onChange={setPublicProfile}
          label={t.publicProfile.toggle}
        />
      </div>

      <div className="mt-4">
        <p className="text-caption font-medium text-content-secondary">
          {t.publicProfile.link}
        </p>
        <div className="mt-1.5 flex gap-2">
          <input
            readOnly
            value={PUBLIC_URL}
            className="h-10 min-w-0 flex-1 rounded-input border border-border bg-surface px-3 text-caption text-content-primary"
          />
          <Button
            type="button"
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
            {copied ? t.publicProfile.copied : t.publicProfile.copy}
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-caption font-medium text-content-secondary">
          {t.publicProfile.preview}
        </p>
        <div className="mt-1.5 rounded-input border border-border bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary font-display text-label font-semibold text-white">
              AQ
            </div>
            <div>
              <p className="font-display text-label font-semibold text-content-primary">
                Andrea Quispe
              </p>
              <p className="text-caption text-content-secondary">
                {t.publicProfile.role}
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="font-display text-label font-semibold text-content-primary">
                12
              </p>
              <p className="text-[10px] text-content-secondary">
                {t.stats.interviews}
              </p>
            </div>
            <div>
              <p className="font-display text-label font-semibold text-content-primary">
                84
              </p>
              <p className="text-[10px] text-content-secondary">
                {t.stats.score}
              </p>
            </div>
            <div>
              <p className="font-display text-label font-semibold text-content-primary">
                7
              </p>
              <p className="text-[10px] text-content-secondary">
                {t.stats.streak}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button fullWidth variant="outline" className="mt-4" onClick={onClose}>
        {t.common.close}
      </Button>
    </Modal>
  )
}
