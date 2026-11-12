import { BookOpen, Home, Mic, TrendingUp, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavLabelKey =
  | 'home'
  | 'interviews'
  | 'progress'
  | 'resources'
  | 'profile'

export interface NavItem {
  labelKey: NavLabelKey
  to: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { labelKey: 'home', to: '/dashboard', icon: Home },
  { labelKey: 'interviews', to: '/entrevistas', icon: Mic },
  { labelKey: 'progress', to: '/progreso', icon: TrendingUp },
  { labelKey: 'resources', to: '/recursos', icon: BookOpen },
  { labelKey: 'profile', to: '/perfil', icon: User },
]
