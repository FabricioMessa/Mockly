import { Award, CalendarDays, Clock, Flame } from 'lucide-react'
import { ContinueMobile } from '../components/dashboard/ContinueMobile'
import { ContinuePanel } from '../components/dashboard/ContinuePanel'
import { MobileHeader } from '../components/dashboard/MobileHeader'
import { ModeCardDesktop } from '../components/dashboard/ModeCardDesktop'
import { ModeCardMobile } from '../components/dashboard/ModeCardMobile'
import { modes } from '../components/dashboard/modes'
import { WeeklyProgress } from '../components/dashboard/WeeklyProgress'
import { StatChip } from '../components/ui/StatChip'

export function Dashboard() {
  return (
    <>
      <MobileHeader />

      <div className="lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-6">
        <div className="flex flex-col gap-6">
          <header>
            <h1>Hola, Andrea</h1>
            <p className="mt-1 text-body text-content-secondary lg:hidden">
              ¿Listo para practicar?
            </p>
          </header>

          <div className="grid grid-cols-3 gap-3 lg:grid-cols-4">
            <StatChip
              icon={<CalendarDays className="size-4 lg:size-5" strokeWidth={1.75} />}
              value={12}
              label="entrevistas"
              tone="primary"
            />
            <StatChip
              icon={<Award className="size-4 lg:size-5" strokeWidth={1.75} />}
              value={84}
              label="puntaje"
              tone="accent"
            />
            <StatChip
              icon={<Flame className="size-4 lg:size-5" strokeWidth={1.75} />}
              value={7}
              label="racha de días"
              tone="warning"
            />
            <StatChip
              icon={<Clock className="size-4 lg:size-5" strokeWidth={1.75} />}
              value="14h"
              label="tiempo total"
              tone="primary"
              className="hidden lg:flex"
            />
          </div>

          <div className="flex flex-col gap-3 lg:hidden">
            {modes.map((mode) => (
              <ModeCardMobile key={mode.key} mode={mode} />
            ))}
          </div>

          <ContinueMobile />

          <section className="hidden flex-col gap-4 lg:flex">
            <h2>Elige tu modo de práctica</h2>
            <div className="grid grid-cols-3 gap-4">
              {modes.map((mode) => (
                <ModeCardDesktop key={mode.key} mode={mode} />
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden flex-col gap-4 lg:flex">
          <ContinuePanel />
          <WeeklyProgress />
        </aside>
      </div>
    </>
  )
}
