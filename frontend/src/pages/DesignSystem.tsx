import { Award, Flame, Mic, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Logo } from '../components/ui/Logo'
import { ProgressBar } from '../components/ui/ProgressBar'
import { StatChip } from '../components/ui/StatChip'

const swatches = [
  { name: 'primary', value: '#4F46E5', className: 'bg-primary' },
  { name: 'primary-dark', value: '#4338CA', className: 'bg-primary-dark' },
  { name: 'accent', value: '#06B6D4', className: 'bg-accent' },
  { name: 'success', value: '#22C55E', className: 'bg-success' },
  { name: 'warning', value: '#F59E0B', className: 'bg-warning' },
  { name: 'error', value: '#EF4444', className: 'bg-error' },
  { name: 'background', value: '#F8FAFC', className: 'bg-background' },
  { name: 'surface', value: '#FFFFFF', className: 'bg-surface' },
  { name: 'border', value: '#E2E8F0', className: 'bg-border' },
  { name: 'text-primary', value: '#0F172A', className: 'bg-content-primary' },
  { name: 'text-secondary', value: '#64748B', className: 'bg-content-secondary' },
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

export function DesignSystem() {
  return (
    <div className="flex flex-col gap-10 pb-10">
      <div>
        <p className="text-caption uppercase tracking-wide text-content-secondary">
          Fase 0 · Fundación
        </p>
        <h1 className="mt-1">Design System</h1>
        <p className="mt-1 text-body text-content-secondary">
          Tokens y componentes base de Mockly, listos para las pantallas de la
          Fase 1.
        </p>
      </div>

      <Section title="Paleta de colores">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {swatches.map((swatch) => (
            <Card key={swatch.name} className="overflow-hidden">
              <div className={`h-16 w-full ${swatch.className} border-b border-border`} />
              <div className="px-3 py-2">
                <p className="text-label text-content-primary">{swatch.name}</p>
                <p className="text-caption text-content-secondary">{swatch.value}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Tipografía">
        <Card className="flex flex-col gap-3 p-6">
          <p className="font-display text-h1 font-bold">H1 · Plus Jakarta Sans 28/32</p>
          <p className="font-display text-h2 font-semibold">H2 · Plus Jakarta Sans 22/28</p>
          <p className="text-body">Body · Inter 16/24</p>
          <p className="text-label">Label · Inter 14/20</p>
          <p className="text-caption text-content-secondary">Caption · Inter 12/16</p>
        </Card>
      </Section>

      <Section title="Logo e íconos">
        <Card className="flex flex-wrap items-center gap-8 p-6">
          <Logo size={32} />
          <Logo size={40} />
          <Logo size={56} withWordmark />
          <div className="flex items-center gap-4 text-content-secondary">
            <Mic className="size-6" strokeWidth={1.75} />
            <Award className="size-6" strokeWidth={1.75} />
            <TrendingUp className="size-6" strokeWidth={1.75} />
          </div>
        </Card>
      </Section>

      <Section title="Botones">
        <Card className="flex flex-wrap items-center gap-3 p-6">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </Card>
      </Section>

      <Section title="Inputs">
        <Card className="grid gap-4 p-6 sm:grid-cols-2">
          <Input label="Correo electrónico" placeholder="andrea@email.com" />
          <Input
            label="Contraseña"
            type="password"
            defaultValue="mockly123"
            hint="Mínimo 8 caracteres."
          />
          <Input
            label="Contraseña"
            type="password"
            error="La contraseña es incorrecta."
            defaultValue="123"
          />
          <Input
            label="Nombre completo"
            placeholder="Andrea Quispe"
            leftIcon={<Award className="size-5" strokeWidth={1.75} />}
          />
        </Card>
      </Section>

      <Section title="Stat chips">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatChip icon={<Mic className="size-5" strokeWidth={1.75} />} value={12} label="entrevistas" />
          <StatChip icon={<Award className="size-5" strokeWidth={1.75} />} value={84} label="puntaje" tone="accent" />
          <StatChip icon={<Flame className="size-5" strokeWidth={1.75} />} value={7} label="días de racha" tone="warning" />
        </div>
      </Section>

      <Section title="Badges y progreso">
        <Card className="flex flex-col gap-5 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Más popular</Badge>
            <Badge tone="accent">Modo Universidad</Badge>
            <Badge tone="success">Pago exitoso</Badge>
            <Badge tone="warning">Racha</Badge>
          </div>
          <ProgressBar value={72} label="Progreso del perfil" />
        </Card>
      </Section>
    </div>
  )
}
