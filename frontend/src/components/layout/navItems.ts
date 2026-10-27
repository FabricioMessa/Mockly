import { BookOpen, Home, Mic, TrendingUp, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: 'Inicio', to: '/dashboard', icon: Home },
  { label: 'Entrevistas', to: '/entrevistas', icon: Mic },
  { label: 'Progreso', to: '/progreso', icon: TrendingUp },
  { label: 'Recursos', to: '/recursos', icon: BookOpen },
  { label: 'Perfil', to: '/perfil', icon: User },
]
