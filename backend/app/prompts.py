from .schemas import EvaluateRequest, QuestionsRequest


def questions_prompt(request: QuestionsRequest) -> str:
    return f"""Eres un entrevistador experto de Mockly, una plataforma que prepara
candidatos para entrevistas laborales, universitarias y de idiomas.

Genera exactamente {request.count} preguntas conductuales en español para una
entrevista del modo "{request.mode}", para el puesto "{request.role}",
con dificultad "{request.difficulty}" y un tono del entrevistador
"{request.tone}".

Reglas:
- Preguntas realistas, abiertas y que inviten a responder con el método STAR.
- No repitas preguntas ni incluyas numeración en el texto.
- Cada pregunta debe tener un enfoque breve (por ejemplo: liderazgo,
  trabajo en equipo, resolución de problemas, comunicación, priorización).
- Usa tuteo (tú), español neutro y revisa la ortografía y la gramática.
- Cada pregunta debe ser una oración completa, natural y sin errores de tipeo.

Devuelve SOLO un objeto JSON válido con esta forma exacta:
{{
  "questions": [
    {{"id": 1, "text": "pregunta", "focus": "enfoque"}}
  ]
}}
No agregues explicaciones, markdown ni texto fuera del JSON.
"""


def evaluate_prompt(request: EvaluateRequest) -> str:
    return f"""Eres un evaluador experto de entrevistas de Mockly. Evalúa la
siguiente respuesta de un candidato aplicando el método STAR.

Contexto:
- Modo: {request.mode}
- Puesto: {request.role}
- Pregunta: {request.question}
- Respuesta del candidato: {request.answer}

Criterios:
- score: entero de 0 a 100 según claridad, estructura STAR, evidencia y resultados.
- summary: resumen breve y constructivo en español.
- star: comentario específico para situación, tarea, acción y resultado.
- metrics: fluency (0-100), fillerWords ("Bajo", "Medio" o "Alto"),
  confidence (0-100) y keywords (por ejemplo "14/20").
- strengths: 2 a 4 fortalezas concretas.
- recommendations: 2 a 4 recomendaciones accionables.
- Usa tuteo (tú) y revisa la ortografía y la gramática en todos los textos.

Devuelve SOLO un objeto JSON válido con esta forma exacta:
{{
  "score": 82,
  "summary": "texto",
  "star": {{
    "situation": "texto",
    "task": "texto",
    "action": "texto",
    "result": "texto"
  }},
  "metrics": {{
    "fluency": 87,
    "fillerWords": "Bajo",
    "confidence": 79,
    "keywords": "14/20"
  }},
  "strengths": ["texto"],
  "recommendations": ["texto"]
}}
No agregues explicaciones, markdown ni texto fuera del JSON.
"""
