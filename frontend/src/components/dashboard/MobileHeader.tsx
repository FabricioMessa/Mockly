import { UserActions } from '../layout/UserActions'
import { Logo } from '../ui/Logo'

export function MobileHeader() {
  return (
    <header className="flex items-center justify-between gap-2 pb-6 lg:hidden">
      <Logo size={36} withWordmark />
      <UserActions />
    </header>
  )
}
