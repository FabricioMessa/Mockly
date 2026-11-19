export type ResourceCategory =
  | 'guias'
  | 'preguntas'
  | 'plantillas'
  | 'idiomas'
  | 'universidad'

export interface ResourceSection {
  heading?: string
  paragraphs?: string[]
  bullets?: string[]
}

export interface ResourceItem {
  id: string
  title: string
  description: string
  category: ResourceCategory
  readMinutes: number
  pro?: boolean
  practiceMode?: 'laboral' | 'universidad' | 'idiomas'
  copyText?: string
  sections: ResourceSection[]
}

export const RESOURCE_CATEGORIES: {
  id: ResourceCategory | 'all'
  key: 'all' | ResourceCategory
}[] = [
  { id: 'all', key: 'all' },
  { id: 'guias', key: 'guias' },
  { id: 'preguntas', key: 'preguntas' },
  { id: 'plantillas', key: 'plantillas' },
  { id: 'idiomas', key: 'idiomas' },
  { id: 'universidad', key: 'universidad' },
]

export const resources: ResourceItem[] = [
  {
    id: 'metodo-star',
    title: 'Método STAR: responde con estructura',
    description:
      'La forma más clara de contar una experiencia: situación, tarea, acción y resultado.',
    category: 'guias',
    readMinutes: 4,
    sections: [
      {
        paragraphs: [
          'STAR es una estructura para responder preguntas conductuales. Te ayuda a que tu respuesta tenga contexto, responsabilidad y evidencia, sin perderte en detalles.',
        ],
      },
      {
        heading: 'Los cuatro bloques',
        bullets: [
          'Situación: describe el contexto en una o dos frases.',
          'Tarea: explica cuál era tu responsabilidad concreta.',
          'Acción: detalla qué hiciste tú, paso a paso.',
          'Resultado: cierra con un resultado medible o un aprendizaje.',
        ],
      },
      {
        heading: 'Error común',
        paragraphs: [
          'Contar toda la historia del equipo y no lo que hiciste tú. Usa “yo” para dejar clara tu contribución.',
        ],
      },
    ],
  },
  {
    id: 'hablame-de-ti',
    title: 'Cómo responder “Háblame de ti”',
    description:
      'Una respuesta de 60 segundos que conecta tu experiencia con el puesto.',
    category: 'guias',
    readMinutes: 3,
    sections: [
      {
        paragraphs: [
          'No es tu biografía: es un resumen profesional orientado al puesto. Estructura: presente, pasado y futuro.',
        ],
      },
      {
        heading: 'Estructura recomendada',
        bullets: [
          'Presente: qué haces hoy y qué te define profesionalmente.',
          'Pasado: una o dos experiencias que demuestran tus habilidades.',
          'Futuro: por qué este puesto es el siguiente paso lógico.',
        ],
      },
    ],
  },
  {
    id: 'preparacion',
    title: 'Prepara tu entrevista en 30 minutos',
    description:
      'Una rutina corta para investigar la empresa, ordenar tus historias y practicar.',
    category: 'guias',
    readMinutes: 5,
    sections: [
      {
        heading: 'Minutos 1–10: investiga',
        bullets: [
          'Lee la descripción del puesto y subraya las 3 competencias clave.',
          'Revisa la web y LinkedIn de la empresa.',
          'Anota una pregunta para el reclutador.',
        ],
      },
      {
        heading: 'Minutos 11–20: ordena tus historias',
        bullets: [
          'Elige 3 experiencias y escríbelas en formato STAR.',
          'Una debe mostrar liderazgo, otra resolución de problemas y otra trabajo en equipo.',
        ],
      },
      {
        heading: 'Minutos 21–30: practica',
        bullets: [
          'Responde en voz alta una vez sin leer.',
          'Graba 60 segundos y revisa muletillas y ritmo.',
          'Haz una simulación con Mockly y revisa el feedback.',
        ],
      },
    ],
  },
  {
    id: 'errores-muletillas',
    title: 'Errores comunes y muletillas',
    description:
      'Los detalles que más restan en una entrevista y cómo corregirlos.',
    category: 'guias',
    readMinutes: 4,
    sections: [
      {
        heading: 'Errores frecuentes',
        bullets: [
          'Responder con generalidades sin ejemplos.',
          'Hablar mal del empleador anterior.',
          'No cerrar con resultados ni aprendizajes.',
          'Extenderse más de 2 minutos por respuesta.',
        ],
      },
      {
        heading: 'Muletillas',
        paragraphs: [
          'Palabras como “este”, “o sea” o “bueno” aparecen cuando buscas la idea. Practica pausas cortas en lugar de llenar el silencio.',
        ],
      },
    ],
  },
  {
    id: 'preguntas-reclutador',
    title: 'Preguntas que puedes hacer al reclutador',
    description:
      'Preguntas que muestran interés y te ayudan a evaluar el puesto.',
    category: 'guias',
    readMinutes: 3,
    sections: [
      {
        bullets: [
          '¿Cómo se ve el éxito en los primeros 90 días?',
          '¿Cuáles son los principales retos del equipo este año?',
          '¿Cómo se toman las decisiones de priorización?',
          '¿Qué oportunidades de aprendizaje ofrece el rol?',
        ],
      },
    ],
  },
  {
    id: 'banco-laboral',
    title: '10 preguntas frecuentes de entrevistas laborales',
    description:
      'Preguntas por competencia con una pista para responder con STAR.',
    category: 'preguntas',
    readMinutes: 6,
    practiceMode: 'laboral',
    sections: [
      {
        bullets: [
          'Cuéntame sobre ti.',
          '¿Por qué quieres trabajar aquí?',
          'Háblame de un logro del que te sientas orgulloso.',
          'Describe un conflicto con un compañero y cómo lo resolviste.',
          'Cuéntame de un error que cometiste y qué aprendiste.',
          '¿Cómo priorizas cuando todo es urgente?',
          'Háblame de una vez que lideraste un equipo.',
          '¿Cómo manejas la presión y los plazos ajustados?',
          'Describe una decisión difícil que tomaste con poca información.',
          '¿Dónde te ves en tres años?',
        ],
      },
    ],
  },
  {
    id: 'banco-universidad',
    title: 'Preguntas de admisión universitaria',
    description:
      'Preguntas típicas para admisiones, becas y programas académicos.',
    category: 'preguntas',
    readMinutes: 5,
    practiceMode: 'universidad',
    sections: [
      {
        bullets: [
          '¿Por qué elegiste esta carrera?',
          '¿Qué problema te gustaría resolver con tu profesión?',
          'Háblame de un logro académico.',
          '¿Cómo organizas tu tiempo entre estudios y otras actividades?',
          '¿Qué harías si no fueras admitido este año?',
          '¿Qué aportarías a la comunidad universitaria?',
        ],
      },
    ],
  },
  {
    id: 'banco-idiomas',
    title: 'Preguntas para entrevistas en inglés',
    description:
      'Preguntas de speaking para practicar fluidez y estructura.',
    category: 'preguntas',
    readMinutes: 5,
    practiceMode: 'idiomas',
    sections: [
      {
        bullets: [
          'Tell me about yourself.',
          'Why are you interested in this role?',
          'Describe a challenge you faced and how you solved it.',
          'What are your strengths and weaknesses?',
          'Where do you see yourself in three years?',
          'What would you do if you did not understand a question?',
        ],
      },
    ],
  },
  {
    id: 'plantilla-cv',
    title: 'Plantilla de CV para prácticas y primer empleo',
    description:
      'Una estructura lista para adaptar con tus datos, experiencia y proyectos.',
    category: 'plantillas',
    readMinutes: 4,
    pro: true,
    copyText: `NOMBRE APELLIDO
Correo · Teléfono · LinkedIn · Ciudad

PERFIL
Estudiante de [carrera] con interés en [área]. Experiencia en [proyecto o práctica] usando [herramientas]. Busco una práctica/posición donde aportar en [objetivo].

EXPERIENCIA
[Rol] — [Empresa/Proyecto] | [fechas]
- Logro con verbo de acción + herramienta + resultado medible.
- Logro con verbo de acción + herramienta + resultado medible.

EDUCACIÓN
[Universidad] — [carrera] | [fechas]
- Promedio, cursos relevantes o logros académicos.

HABILIDADES
Técnicas: [herramientas]
Blandas: [comunicación, trabajo en equipo, liderazgo]`,
    sections: [
      {
        paragraphs: [
          'Mantén una sola página, usa verbos de acción y prioriza resultados medibles. Adapta el perfil y las habilidades a cada oferta.',
        ],
      },
    ],
  },
  {
    id: 'correo-agradecimiento',
    title: 'Correo de agradecimiento después de la entrevista',
    description:
      'Un mensaje breve para cerrar la entrevista y reforzar tu interés.',
    category: 'plantillas',
    readMinutes: 2,
    copyText: `Asunto: Gracias por la entrevista — [Puesto]

Hola [Nombre],

Gracias por el tiempo de hoy. Disfruté conversar sobre [tema] y conocer más sobre [empresa/equipo].

Quedé con interés en aportar en [tarea o reto] desde mi experiencia en [habilidad]. Quedo atento a los siguientes pasos.

Saludos,
[Nombre]`,
    sections: [
      {
        paragraphs: [
          'Envíalo dentro de las 24 horas. Sé breve, menciona algo concreto de la conversación y no repitas todo tu CV.',
        ],
      },
    ],
  },
  {
    id: 'ielts-speaking',
    title: 'IELTS/TOEFL Speaking: estructura y frases útiles',
    description:
      'Cómo organizar tus respuestas y ganar fluidez en exámenes de idiomas.',
    category: 'idiomas',
    readMinutes: 5,
    sections: [
      {
        heading: 'Estructura',
        bullets: [
          'Respuesta directa en una frase.',
          'Una razón con un ejemplo personal.',
          'Un cierre que conecte con tu objetivo.',
        ],
      },
      {
        heading: 'Frases útiles',
        bullets: [
          'In my experience...',
          'A good example of this is...',
          'What I mean is...',
          'To sum up, I would say...',
        ],
      },
    ],
  },
  {
    id: 'admission-story',
    title: 'Admisión universitaria: cómo contar tu historia',
    description:
      'Conecta tu motivación, tus logros y tu proyecto académico en una narrativa clara.',
    category: 'universidad',
    readMinutes: 4,
    pro: true,
    sections: [
      {
        heading: 'Tu historia en 3 actos',
        bullets: [
          'Origen: qué despertó tu interés por la carrera.',
          'Evidencia: qué has hecho para explorarlo (cursos, proyectos, voluntariado).',
          'Futuro: qué quieres resolver y por qué esta universidad.',
        ],
      },
      {
        paragraphs: [
          'Evita frases genéricas. Un detalle concreto y personal vale más que una lista de adjetivos.',
        ],
      },
    ],
  },
]

export function getResource(id: string): ResourceItem | undefined {
  return resources.find((resource) => resource.id === id)
}
