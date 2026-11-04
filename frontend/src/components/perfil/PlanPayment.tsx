import { Check, Clock, CreditCard, Lock } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { QrCode } from './QrCode'
import { SuccessModal } from './SuccessModal'

type PlanId = 'free' | 'pro'
type MethodId = 'yape' | 'plin' | 'tarjeta'

interface Plan {
  id: PlanId
  name: string
  price: string
  description: string
  popular?: boolean
  features: string[]
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 'S/ 0',
    description: 'Funciones básicas',
    features: [
      '3 entrevistas por mes',
      'Retroalimentación básica',
      'Recursos limitados',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'S/ 29/mes',
    description: 'Acceso completo a todas las funciones',
    popular: true,
    features: [
      'Entrevistas ilimitadas',
      'Retroalimentación avanzada',
      'Planes personalizados',
      'Preguntas específicas',
      'Acceso a todos los recursos',
    ],
  },
]

interface PaymentMethod {
  id: MethodId
  label: string
  icon: ReactNode
}

const methods: PaymentMethod[] = [
  {
    id: 'yape',
    label: 'Yape',
    icon: (
      <span className="flex size-5 items-center justify-center rounded-full bg-[#7C3AED] text-[10px] font-bold text-white">
        Y
      </span>
    ),
  },
  {
    id: 'plin',
    label: 'Plin',
    icon: (
      <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
        P
      </span>
    ),
  },
  {
    id: 'tarjeta',
    label: 'Tarjeta',
    icon: <CreditCard className="size-4" strokeWidth={1.75} />,
  },
]

export function PlanPayment() {
  const [plan, setPlan] = useState<PlanId>('pro')
  const [method, setMethod] = useState<MethodId>('yape')
  const [paying, setPaying] = useState(false)
  const [success, setSuccess] = useState(false)
  const [seconds, setSeconds] = useState(9 * 60 + 48)

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((value) => (value > 0 ? value - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!paying) return
    const id = setTimeout(() => {
      setPaying(false)
      setSuccess(true)
    }, 1400)
    return () => clearTimeout(id)
  }, [paying])

  const timeLeft = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
    seconds % 60,
  ).padStart(2, '0')}`

  const methodLabel =
    method === 'yape' ? 'Yape' : method === 'plin' ? 'Plin' : 'Tarjeta'

  return (
    <Card className="p-5">
      <h2 className="hidden text-h2 lg:block">Elige tu plan</h2>

      <div
        role="radiogroup"
        aria-label="Elige tu plan"
        className="mt-4 grid gap-3 sm:grid-cols-2"
      >
        {plans.map((item) => {
          const selected = plan === item.id
          return (
            <div
              key={item.id}
              role="radio"
              aria-checked={selected}
              tabIndex={0}
              onClick={() => setPlan(item.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setPlan(item.id)
                }
              }}
              className={cn(
                'relative cursor-pointer rounded-card border-2 p-4 transition-colors',
                selected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-surface hover:border-primary/40',
              )}
            >
              {item.popular && (
                <span className="absolute -top-2.5 right-3">
                  <Badge>Más popular</Badge>
                </span>
              )}

              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-label font-semibold text-content-primary">
                    {item.name}
                  </p>
                  <p className="mt-1 font-display text-h2 font-bold text-content-primary">
                    {item.price}
                  </p>
                  <p className="mt-1 text-caption text-content-secondary">
                    {item.description}
                  </p>
                </div>
                <span
                  className={cn(
                    'mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                    selected ? 'border-primary' : 'border-border',
                  )}
                  aria-hidden="true"
                >
                  {selected && <span className="size-2.5 rounded-full bg-primary" />}
                </span>
              </div>

              <ul className="mt-3 flex flex-col gap-1.5 lg:hidden">
                {item.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-caption text-content-secondary"
                  >
                    <Check
                      className="mt-0.5 size-3.5 shrink-0 text-success"
                      strokeWidth={2}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {plan === 'pro' ? (
        <div className="mt-5">
          <p className="text-label font-medium text-content-primary">
            Selecciona método de pago
          </p>

          <div className="mt-2 flex rounded-input border border-border bg-background p-1">
            {methods.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={method === item.id}
                onClick={() => setMethod(item.id)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-label transition-colors',
                  method === item.id
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-content-secondary hover:text-content-primary',
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {method !== 'tarjeta' ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <QrCode label={method} />
              <div>
                <p className="flex items-center gap-2 text-label font-medium text-content-primary">
                  Paga con {methodLabel}
                  <span
                    className={cn(
                      'flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-white',
                      method === 'yape' ? 'bg-[#7C3AED]' : 'bg-accent',
                    )}
                  >
                    {method === 'yape' ? 'Y' : 'P'}
                  </span>
                </p>
                <p className="mt-2 font-display text-h1 font-bold text-primary">
                  S/ 29.00
                </p>
                <p className="text-caption text-content-secondary">
                  Escanea con tu app
                </p>
                <p className="mt-2 flex items-center gap-1 text-caption text-warning">
                  <Clock className="size-3.5" strokeWidth={1.75} />
                  La orden expira en {timeLeft}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              <Input
                label="Número de tarjeta"
                placeholder="1234 1234 1234 1234"
                inputMode="numeric"
                leftIcon={<CreditCard className="size-5" strokeWidth={1.75} />}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input label="MM/AA" placeholder="MM/AA" inputMode="numeric" />
                <Input label="CVV" placeholder="123" inputMode="numeric" maxLength={4} />
              </div>
              <Input label="Nombre en la tarjeta" placeholder="Andrea Quispe" />
            </div>
          )}

          <Button
            fullWidth
            size="lg"
            className="mt-4"
            loading={paying}
            onClick={() => setPaying(true)}
          >
            Pagar S/ 29.00
          </Button>

          <p className="mt-3 flex items-center justify-center gap-1 text-caption text-content-secondary">
            <Lock className="size-3.5" strokeWidth={1.75} />
            Pago 100% seguro por{' '}
            <span className="font-semibold text-content-primary">Culqi</span>
          </p>
        </div>
      ) : (
        <div className="mt-5 rounded-input border border-border bg-background p-4 text-caption text-content-secondary">
          Ya estás en el plan{' '}
          <strong className="font-semibold text-content-primary">Free</strong>.
          Elige Pro para desbloquear todas las funciones.
        </div>
      )}

      <SuccessModal open={success} onClose={() => setSuccess(false)} />
    </Card>
  )
}
