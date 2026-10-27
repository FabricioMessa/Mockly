import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Logo } from '../ui/Logo'
import { navItems } from './navItems'

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-surface px-4 py-6 lg:flex">
      <div className="px-2">
        <Logo withWordmark />
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-input px-3 py-2 text-label transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-content-secondary hover:bg-background hover:text-content-primary',
              )
            }
          >
            <Icon className="size-5" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
