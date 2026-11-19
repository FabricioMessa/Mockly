from .schemas import EvaluateRequest, QuestionsRequest


def _language_name(language: str) -> str:
    return "inglés" if language.lower() == "en" else "español"


def questions_prompt(request: QuestionsRequest) -> str:
    if request.language.lower() == "en":
        return f"""MANDATORY LANGUAGE: write every question and every JSON text value in English. Do not use Spanish.

You are an expert interviewer at Mockly, a platform that prepares candidates for job, university and language interviews.

Generate exactly {request.count} behavioral questions for an interview in the "{request.mode}" mode, for the "{request.role}" role, with "{request.difficulty}" difficulty and a "{request.tone}" interviewer tone.

Rules:
- Ask realistic, open questions that invite a STAR-style answer.
- Do not repeat questions or number them in the text.
- Each question must have a short focus (e.g. leadership, teamwork, problem solving, communication, prioritization).
- Use natural, complete sentences with correct spelling and grammar.
- Do not include typos.

Return ONLY a valid JSON object with this exact shape:
{{
  "questions": [
    {{"id": 1, "text": "...", "focus": "..."}}
  ]
}}
Do not add explanations, markdown or text outside the JSON.
Remember: every text in English.
"""

    language_name = _language_name(request.language)
    return f"""IDIOMA OBLIGATORIO: escribe todas las preguntas y todos los textos
del JSON en {language_name}. No uses otro idioma.

Eres un entrevistador experto de Mockly, una plataforma que prepara
candidatos para entrevistas laborales, universitarias y de idiomas.

Genera exactamente {request.count} preguntas conductuales para una entrevista
del modo "{request.mode}", para el puesto "{request.role}", con dificultad
"{request.difficulty}" y un tono del entrevistador "{request.tone}".

Reglas:
- Preguntas realistas, abiertas y que inviten a responder con el método STAR.
- No repitas preguntas ni incluyas numeración en el texto.
- Cada pregunta debe tener un enfoque breve (por ejemplo: liderazgo,
  trabajo en equipo, resolución de problemas, comunicación, priorización).
- Usa tuteo (tú). Revisa la ortografía y la gramática.
- Cada pregunta debe ser una oración completa, natural y sin errores de tipeo.

Devuelve SOLO un objeto JSON válido con esta forma exacta:
{{
  "questions": [
    {{"id": 1, "text": "...", "focus": "..."}}
  ]
}}
No agregues explicaciones, markdown ni texto fuera del JSON.
Recuerda: todos los textos en {language_name}.
"""


def evaluate_prompt(request: EvaluateRequest) -> str:
    if request.language.lower() == "en":
        return f"""MANDATORY LANGUAGE: every JSON string value (summary, star, metrics, strengths and recommendations) must be written in English. Do not mix languages.

You are an expert interview evaluator at Mockly. Evaluate the candidate's answer using the STAR method.

Context:
- Mode: {request.mode}
- Role: {request.role}
- Question: {request.question}
- Candidate answer: {request.answer}

Criteria:
- score: integer from 0 to 100 based on clarity, STAR structure, evidence and results.
- summary: a brief, constructive summary in English.
- star: specific feedback for situation, task, action and result.
- metrics: fluency (0-100), fillerWords ("Low", "Medium" or "High"), confidence (0-100) and keywords (e.g. "14/20").
- strengths: 2 to 4 concrete strengths.
- recommendations: 2 to 4 actionable recommendations.

Return ONLY a valid JSON object with this exact shape:
{{
  "score": 82,
  "summary": "...",
  "star": {{
    "situation": "...",
    "task": "...",
    "action": "...",
    "result": "..."
  }},
  "metrics": {{
    "fluency": 87,
    "fillerWords": "...",
    "confidence": 79,
    "keywords": "14/20"
  }},
  "strengths": ["..."],
  "recommendations": ["..."]
}}
Do not add explanations, markdown or text outside the JSON.
Remember: every text in English.
"""

    language_name = _language_name(request.language)
    return f"""IDIOMA OBLIGATORIO: todos los textos del JSON (summary, star,
metrics, strengths y recommendations) deben estar en {language_name}.
No mezcles idiomas.

Eres un evaluador experto de entrevistas de Mockly. Evalúa la
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
  "summary": "...",
  "star": {{
    "situation": "...",
    "task": "...",
    "action": "...",
    "result": "..."
  }},
  "metrics": {{
    "fluency": 87,
    "fillerWords": "...",
    "confidence": 79,
    "keywords": "14/20"
  }},
  "strengths": ["..."],
  "recommendations": ["..."]
}}
No agregues explicaciones, markdown ni texto fuera del JSON.
Recuerda: todos los textos en {language_name}.
"""
