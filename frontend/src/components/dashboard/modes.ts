import {
  BookOpen,
  Briefcase,
  FileText,
  Globe2,
  GraduationCap,
  MessageCircle,
  MessageSquare,
  Mic,
  Star,
  Target,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ButtonVariant } from '../ui/Button'

export interface ModeBullet {
  icon: LucideIcon
  text: string
}

export interface Mode {
  key: string
  title: string
  descriptionMobile: string
  descriptionDesktop: string
  icon: LucideIcon
  gradient: string
  iconCircle: string
  buttonVariant: ButtonVariant
  bullets: ModeBullet[]
}

export const modes: Mode[] = [
  {
    key: 'laboral',
    title: 'Laboral',
    descriptionMobile:
      'Prepárate para entrevistas de trabajo y destaca en tu próxima oportunidad.',
    descriptionDesktop:
      'Prepárate para entrevistas de trabajo en diferentes industrias y niveles.',
    icon: Briefcase,
    gradient: 'from-[#312E81] via-primary to-[#7C3AED]',
    iconCircle: 'bg-primary',
    buttonVariant: 'primary',
    bullets: [
      { icon: Target, text: 'Preguntas basadas en roles y competencias' },
      { icon: Mic, text: 'Retroalimentación personalizada' },
      { icon: FileText, text: 'Simulaciones realistas' },
    ],
  },
  {
    key: 'universidad',
    title: 'Universidad',
    descriptionMobile:
      'Practica entrevistas para admisiones, becas y programas académicos.',
    descriptionDesktop:
      'Practica para entrevistas académicas y procesos de admisión.',
    icon: GraduationCap,
    gradient: 'from-[#0E7490] via-accent to-[#22D3EE]',
    iconCircle: 'bg-accent',
    buttonVariant: 'accent',
    bullets: [
      { icon: MessageSquare, text: 'Preguntas típicas de admisión universitaria' },
      { icon: BookOpen, text: 'Mejora tu comunicación académica' },
      { icon: Star, text: 'Consejos para destacar' },
    ],
  },
  {
    key: 'idiomas',
    title: 'Centro de Idiomas',
    descriptionMobile:
      'Mejora tu fluidez y confianza en entrevistas en otros idiomas.',
    descriptionDesktop:
      'Desarrolla tu fluidez para exámenes y entrevistas de idiomas.',
    icon: Globe2,
    gradient: 'from-[#047857] via-[#16A34A] to-[#34D399]',
    iconCircle: 'bg-success',
    buttonVariant: 'success',
    bullets: [
      { icon: MessageCircle, text: 'Exámenes como IELTS, TOEFL y más' },
      { icon: BookOpen, text: 'Práctica de speaking estructurada' },
      { icon: Star, text: 'Vocabulario y expresiones clave' },
    ],
  },
]
