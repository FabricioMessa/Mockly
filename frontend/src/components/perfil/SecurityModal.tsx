import { useState } from 'react'
import { getStoredUser, saveUser } from '../../lib/auth'
import { cn } from '../../lib/cn'
import { useTranslation } from '../../lib/i18n'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'

interface Status {
  type: 'success' | 'error'
  message: string
}

export interface SecurityModalProps {
  open: boolean
  onClose: () => void
}

export function SecurityModal({ open, onClose }: SecurityModalProps) {
  const t = useTranslation()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<Status | null>(null)

  const handleClose = () => {
    setCurrent('')
    setNext('')
    setConfirm('')
    setStatus(null)
    onClose()
  }

  const handleSave = () => {
    if (!current || !next || !confirm) {
      setStatus({ type: 'error', message: t.security.required })
      return
    }

    if (next.length < 8) {
      setStatus({ type: 'error', message: t.security.length })
      return
    }

    if (next !== confirm) {
      setStatus({ type: 'error', message: t.security.mismatch })
      return
    }

    const user = getStoredUser()
    if (!user) {
      setStatus({ type: 'error', message: t.security.noAccount })
      return
    }

    if (user.password !== current) {
      setStatus({ type: 'error', message: t.security.currentInvalid })
      return
    }

    saveUser({ ...user, password: next })
    setStatus({ type: 'success', message: t.security.success })
    setCurrent('')
    setNext('')
    setConfirm('')
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t.security.title}
      description={t.security.description}
    >
      <div className="flex flex-col gap-3">
        <Input
          label={t.security.current}
          type="password"
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
          autoComplete="current-password"
        />
        <Input
          label={t.security.new}
          type="password"
          value={next}
          onChange={(event) => setNext(event.target.value)}
          autoComplete="new-password"
        />
        <Input
          label={t.security.confirm}
          type="password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          autoComplete="new-password"
        />
      </div>

      {status && (
        <p
          className={cn(
            'mt-3 rounded-input border p-3 text-caption',
            status.type === 'success'
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-error/30 bg-error/10 text-error',
          )}
        >
          {status.message}
        </p>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-content-secondary">
        {t.security.demoNote}
      </p>

      <div className="mt-4 flex gap-2">
        <Button fullWidth onClick={handleSave}>
          {t.security.save}
        </Button>
        <Button fullWidth variant="outline" onClick={handleClose}>
          {t.common.cancel}
        </Button>
      </div>
    </Modal>
  )
}
