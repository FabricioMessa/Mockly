import { Mail } from 'lucide-react'
import { useTranslation } from '../../lib/i18n'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

export interface HelpModalProps {
  open: boolean
  onClose: () => void
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  const t = useTranslation()

  const faqs = [
    { question: t.help.q1, answer: t.help.a1 },
    { question: t.help.q2, answer: t.help.a2 },
    { question: t.help.q3, answer: t.help.a3 },
    { question: t.help.q4, answer: t.help.a4 },
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.help.title}
      description={t.help.description}
    >
      <p className="text-caption font-medium text-content-secondary">
        {t.help.faq}
      </p>
      <div className="mt-2 flex flex-col gap-2">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="rounded-input border border-border bg-background p-3"
          >
            <summary className="cursor-pointer text-caption font-medium text-content-primary">
              {faq.question}
            </summary>
            <p className="mt-2 text-caption leading-relaxed text-content-secondary">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>

      <div className="mt-4 rounded-input border border-border bg-background p-3">
        <p className="text-caption font-medium text-content-secondary">
          {t.help.contact}
        </p>
        <p className="mt-1 text-caption text-content-secondary">
          {t.help.contactText}{' '}
          <a
            href="mailto:soporte@mockly.app"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            <Mail className="size-3.5" strokeWidth={1.75} />
            soporte@mockly.app
          </a>
        </p>
      </div>

      <Button fullWidth variant="outline" className="mt-4" onClick={onClose}>
        {t.common.close}
      </Button>
    </Modal>
  )
}
