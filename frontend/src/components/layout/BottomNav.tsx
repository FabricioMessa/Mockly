import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { navItems } from './navItems'

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface lg:hidden">
      <ul className="grid grid-cols-5">
        {navItems.map(({ label, to, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-2 text-caption transition-colors',
                  isActive ? 'text-primary' : 'text-content-secondary',
                )
              }
            >
              <Icon className="size-5" strokeWidth={1.75} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
