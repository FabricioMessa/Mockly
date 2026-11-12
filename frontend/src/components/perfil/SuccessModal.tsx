import { Check, X } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '../ui/Button'

const benefits = [
  'Entrevistas ilimitadas',
  'Retroalimentación avanzada',
  'Planes personalizados',
  'Acceso a todos los recursos',
]

export interface SuccessModalProps {
  open: boolean
  onClose: () => void
}

export function SuccessModal({ open, onClose }: SuccessModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title"
        className="relative w-full max-w-sm rounded-card bg-surface p-6 text-center shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full text-content-secondary transition-colors hover:bg-background hover:text-content-primary"
        >
          <X className="size-5" strokeWidth={1.75} />
        </button>

        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success text-white">
          <Check className="size-9" strokeWidth={2.5} />
        </div>

        <h2 id="success-title" className="mt-4 text-h2">
          ¡Pago exitoso!
        </h2>
        <p className="mt-2 text-caption text-content-secondary">
          Ya eres parte de Mockly Pro. Disfruta al máximo todas las funciones
          premium.
        </p>

        <ul className="mt-4 flex flex-col gap-1.5 text-left">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-center gap-2 text-caption text-content-secondary"
            >
              <Check className="size-4 shrink-0 text-success" strokeWidth={2} />
              {benefit}
            </li>
          ))}
        </ul>

        <Button fullWidth className="mt-5" onClick={onClose}>
          Comenzar Pro
        </Button>
      </div>
    </div>
  )
}
