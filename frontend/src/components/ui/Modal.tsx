import { X } from 'lucide-react'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
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
        aria-label={title}
        className={cn(
          'relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-card bg-surface p-6 shadow-xl',
          className,
        )}
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

        <h2 className="pr-8 text-h2">{title}</h2>
        {description && (
          <p className="mt-1 text-caption text-content-secondary">
            {description}
          </p>
        )}

        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
