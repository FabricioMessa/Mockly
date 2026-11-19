import type { Question } from './api'

interface FallbackItem {
  text: string
  focus: string
}

type RoleKey = 'product' | 'frontend' | 'junior' | 'generic'

const laboralEs: Record<RoleKey, FallbackItem[]> = {
  product: [
    {
      text: 'Cuéntame sobre una ocasión en la que tuviste que priorizar el roadmap frente a pedidos de stakeholders.',
      focus: 'priorización',
    },
    {
      text: 'Describe un lanzamiento que no alcanzó las métricas esperadas y qué hiciste.',
      focus: 'métricas',
    },
    {
      text: 'Háblame de un desacuerdo con el equipo de ingeniería y cómo lo resolviste.',
      focus: 'liderazgo',
    },
  ],
  frontend: [
    {
      text: 'Describe el reto técnico más complejo que resolviste en el frontend.',
      focus: 'resolución de problemas',
    },
    {
      text: '¿Cómo aseguras la calidad y el rendimiento en una aplicación grande?',
      focus: 'calidad',
    },
    {
      text: 'Háblame de una vez que mentoreaste a alguien del equipo.',
      focus: 'mentoría',
    },
  ],
  junior: [
    {
      text: 'Cuéntame sobre ti y por qué te interesa este puesto.',
      focus: 'motivación',
    },
    {
      text: 'Describe una situación en la que trabajaste en equipo para resolver un problema.',
      focus: 'trabajo en equipo',
    },
    {
      text: 'Háblame de un error que cometiste y qué aprendiste.',
      focus: 'autoconocimiento',
    },
  ],
  generic: [
    {
      text: 'Cuéntame sobre una vez en que lideraste un equipo en un proyecto desafiante.',
      focus: 'liderazgo',
    },
    {
      text: 'Describe una situación en la que tuvieras que manejar un conflicto con un compañero.',
      focus: 'trabajo en equipo',
    },
    {
      text: '¿Cómo priorizas tareas cuando tienes plazos que compiten?',
      focus: 'priorización',
    },
  ],
}

const laboralEn: Record<RoleKey, FallbackItem[]> = {
  product: [
    {
      text: 'Tell me about a time you had to prioritize the roadmap against stakeholder requests.',
      focus: 'prioritization',
    },
    {
      text: 'Describe a launch that missed its expected metrics and what you did.',
      focus: 'metrics',
    },
    {
      text: 'Tell me about a disagreement with engineering and how you resolved it.',
      focus: 'leadership',
    },
  ],
  frontend: [
    {
      text: 'Describe the most complex technical challenge you solved on the frontend.',
      focus: 'problem solving',
    },
    {
      text: 'How do you ensure quality and performance in a large application?',
      focus: 'quality',
    },
    {
      text: 'Tell me about a time you mentored someone on your team.',
      focus: 'mentoring',
    },
  ],
  junior: [
    {
      text: 'Tell me about yourself and why you are interested in this role.',
      focus: 'motivation',
    },
    {
      text: 'Describe a time you worked in a team to solve a problem.',
      focus: 'teamwork',
    },
    {
      text: 'Tell me about a mistake you made and what you learned.',
      focus: 'self-awareness',
    },
  ],
  generic: [
    {
      text: 'Tell me about a time you led a team through a challenging project.',
      focus: 'leadership',
    },
    {
      text: 'Describe a situation where you had to handle a conflict with a coworker.',
      focus: 'teamwork',
    },
    {
      text: 'How do you prioritize tasks when deadlines compete?',
      focus: 'prioritization',
    },
  ],
}

const universityEs: FallbackItem[] = [
  {
    text: '¿Por qué elegiste esta carrera y cómo se alinea con tus objetivos?',
    focus: 'motivación',
  },
  {
    text: 'Háblame de un logro académico del que te sientas orgulloso.',
    focus: 'logros',
  },
  {
    text: '¿Cómo equilibras tus estudios con otras responsabilidades?',
    focus: 'organización',
  },
]

const universityEn: FallbackItem[] = [
  {
    text: 'Why did you choose this career and how does it align with your goals?',
    focus: 'motivation',
  },
  {
    text: 'Tell me about an academic achievement you are proud of.',
    focus: 'achievements',
  },
  {
    text: 'How do you balance your studies with other responsibilities?',
    focus: 'organization',
  },
]

const languages: FallbackItem[] = [
  {
    text: 'Tell me about your experience learning a new language.',
    focus: 'speaking',
  },
  {
    text: 'How do you handle a situation where you do not understand a question?',
    focus: 'communication',
  },
  {
    text: 'What are your goals for improving your fluency this year?',
    focus: 'goals',
  },
]

const followUpsEs: Record<string, FallbackItem[]> = {
  laboral: [
    {
      text: 'Háblame de una decisión difícil que tomaste con información incompleta.',
      focus: 'toma de decisiones',
    },
    {
      text: '¿Cómo medirías el éxito en tus primeros 90 días en el puesto?',
      focus: 'objetivos',
    },
  ],
  universidad: [
    {
      text: '¿Qué harías si no fueras admitido en la carrera que elegiste?',
      focus: 'resiliencia',
    },
    {
      text: 'Describe un proyecto académico en el que hayas liderado a otras personas.',
      focus: 'liderazgo',
    },
  ],
  idiomas: [
    {
      text: 'Describe a challenge you faced while speaking English and how you overcame it.',
      focus: 'resilience',
    },
    {
      text: 'How do you prepare for a professional interview in English?',
      focus: 'preparation',
    },
  ],
}

const followUpsEn: Record<string, FallbackItem[]> = {
  laboral: [
    {
      text: 'Tell me about a difficult decision you made with incomplete information.',
      focus: 'decision making',
    },
    {
      text: 'How would you measure success in your first 90 days in the role?',
      focus: 'goals',
    },
  ],
  universidad: [
    {
      text: 'What would you do if you were not admitted to the career you chose?',
      focus: 'resilience',
    },
    {
      text: 'Describe an academic project where you led other people.',
      focus: 'leadership',
    },
  ],
  idiomas: [
    {
      text: 'Describe a challenge you faced while speaking English and how you overcame it.',
      focus: 'resilience',
    },
    {
      text: 'How do you prepare for a professional interview in English?',
      focus: 'preparation',
    },
  ],
}

function toQuestions(items: FallbackItem[]): Question[] {
  return items.map((item, index) => ({ id: index + 1, ...item }))
}

function roleKey(role: string): RoleKey {
  const value = role.toLowerCase()
  if (value.includes('product')) return 'product'
  if (value.includes('frontend')) return 'frontend'
  if (value.includes('junior')) return 'junior'
  return 'generic'
}

export function getFallbackQuestions(
  language: 'es' | 'en',
  mode: string,
  role: string,
  count = 3,
): Question[] {
  const limit = Math.max(1, Math.min(5, count))
  let items: FallbackItem[]

  if (mode === 'universidad') {
    items = language === 'en' ? universityEn : universityEs
  } else if (mode === 'idiomas') {
    items = languages
  } else {
    const dictionary = language === 'en' ? laboralEn : laboralEs
    items = dictionary[roleKey(role)]
  }

  const followUps = language === 'en' ? followUpsEn : followUpsEs
  const extras = followUps[mode] ?? followUps.laboral
  return toQuestions([...items, ...extras].slice(0, limit))
}
