import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { useTranslation } from '../../lib/i18n'
import { navItems } from './navItems'

export function BottomNav() {
  const t = useTranslation()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface lg:hidden">
      <ul className="grid grid-cols-5">
        {navItems.map(({ labelKey, to, icon: Icon }) => (
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
              {t.nav[labelKey]}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
