import json
import logging
import os
from typing import Any

import httpx

from .prompts import evaluate_prompt, questions_prompt
from .schemas import EvaluateRequest, QuestionsRequest

logger = logging.getLogger("mockly.ai")

GEMINI_ENDPOINT = (
    "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
)
DEFAULT_MODEL = "gemini-flash-lite-latest"
FALLBACK_MODELS = (
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
)
REQUEST_TIMEOUT_SECONDS = 15.0


def _api_key() -> str:
    return os.getenv("GEMINI_API_KEY", "").strip()


def _configured_models() -> list[str]:
    configured = os.getenv("GEMINI_MODEL", DEFAULT_MODEL).strip()
    models = [configured or DEFAULT_MODEL, *FALLBACK_MODELS]
    return list(dict.fromkeys(models))


def _extract_json(payload: dict[str, Any]) -> dict[str, Any]:
    candidates = payload.get("candidates") or []
    if not candidates:
        raise ValueError("La respuesta de Gemini no contiene candidatos")

    parts = candidates[0].get("content", {}).get("parts", [])
    text = "".join(part.get("text", "") for part in parts).strip()

    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()

    return json.loads(text)


def _call_gemini(prompt: str, temperature: float) -> dict[str, Any]:
    api_key = _api_key()
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY no configurada")

    errors: list[str] = []
    timeout = httpx.Timeout(REQUEST_TIMEOUT_SECONDS, connect=8.0)

    for model in _configured_models():
        try:
            with httpx.Client(timeout=timeout) as client:
                response = client.post(
                    GEMINI_ENDPOINT.format(model=model),
                    headers={"x-goog-api-key": api_key},
                    json={
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {
                            "temperature": temperature,
                            "responseMimeType": "application/json",
                            "maxOutputTokens": 1200,
                        },
                    },
                )

            if response.status_code >= 400:
                errors.append(f"{model}: HTTP {response.status_code}")
                continue

            return _extract_json(response.json())
        except httpx.TimeoutException:
            errors.append(f"{model}: timeout")
            logger.warning("Timeout con el modelo %s", model)
        except Exception as exc:  # noqa: BLE001 - se prueba el siguiente modelo
            errors.append(f"{model}: {type(exc).__name__}")
            logger.warning("Gemini falló con el modelo %s: %s", model, exc)

    raise RuntimeError("; ".join(errors) or "sin modelos disponibles")


def _mock_questions(request: QuestionsRequest) -> list[dict[str, Any]]:
    base = [
        {
            "text": "Cuéntame sobre una vez en que lideraste un equipo en un proyecto desafiante.",
            "focus": "liderazgo",
        },
        {
            "text": "Describe una situación en la que tuvieras que manejar un conflicto con un compañero.",
            "focus": "trabajo en equipo",
        },
        {
            "text": "¿Cómo priorizas tareas cuando tienes plazos que compiten?",
            "focus": "priorización",
        },
        {
            "text": "Háblame de un error que cometiste y de cómo lo corregiste.",
            "focus": "autoconocimiento",
        },
        {
            "text": "¿Por qué te interesa este puesto y qué aportarías al equipo?",
            "focus": "motivación",
        },
    ]
    return [
        {"id": index + 1, **item}
        for index, item in enumerate(base[: request.count])
    ]


def _mock_evaluation() -> dict[str, Any]:
    return {
        "score": 82,
        "summary": (
            "Respuesta sólida: buen contexto, responsabilidad clara y resultados "
            "medibles. Puedes reforzar el impacto de negocio para dar mayor urgencia."
        ),
        "star": {
            "situation": (
                "Estableciste claramente el contexto: el tamaño del equipo y la "
                "línea de tiempo fueron específicos y creíbles."
            ),
            "task": (
                "Tu nivel de responsabilidad fue evidente. El uso de \"yo lideré\" "
                "te posiciona bien como tomador de decisiones."
            ),
            "action": (
                "Buena especificidad: reuniones diarias, sprints de dos días y "
                "desbloqueo del equipo. Demuestra liderazgo activo."
            ),
            "result": (
                "El resultado cuantificado (a tiempo, cero bugs críticos) es "
                "sólido y contundente."
            ),
        },
        "metrics": {
            "fluency": 87,
            "fillerWords": "Bajo",
            "confidence": 79,
            "keywords": "14/20",
        },
        "strengths": ["Contexto claro", "Liderazgo demostrado", "Resultados medibles"],
        "recommendations": [
            "Agrega el impacto en el negocio para dar mayor sentido de urgencia.",
            "Menciona qué hizo que la tarea fuera especialmente compleja.",
            "Nombra un obstáculo técnico o interpersonal concreto que resolviste.",
            "Añade una métrica de negocio, por ejemplo reducción de costos.",
        ],
    }


def _as_int(value: Any, default: int) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _normalize_evaluation(data: dict[str, Any]) -> dict[str, Any]:
    defaults = _mock_evaluation()
    star = data.get("star") if isinstance(data.get("star"), dict) else {}
    metrics = data.get("metrics") if isinstance(data.get("metrics"), dict) else {}

    strengths = data.get("strengths")
    if not isinstance(strengths, list) or not strengths:
        strengths = defaults["strengths"]

    recommendations = data.get("recommendations")
    if not isinstance(recommendations, list) or not recommendations:
        recommendations = defaults["recommendations"]

    return {
        "score": max(0, min(100, _as_int(data.get("score"), defaults["score"]))),
        "summary": str(data.get("summary") or defaults["summary"]),
        "star": {
            "situation": str(star.get("situation") or defaults["star"]["situation"]),
            "task": str(star.get("task") or defaults["star"]["task"]),
            "action": str(star.get("action") or defaults["star"]["action"]),
            "result": str(star.get("result") or defaults["star"]["result"]),
        },
        "metrics": {
            "fluency": max(
                0,
                min(100, _as_int(metrics.get("fluency"), defaults["metrics"]["fluency"])),
            ),
            "fillerWords": str(
                metrics.get("fillerWords") or defaults["metrics"]["fillerWords"]
            ),
            "confidence": max(
                0,
                min(
                    100,
                    _as_int(
                        metrics.get("confidence"), defaults["metrics"]["confidence"]
                    ),
                ),
            ),
            "keywords": str(metrics.get("keywords") or defaults["metrics"]["keywords"]),
        },
        "strengths": [str(item) for item in strengths][:5],
        "recommendations": [str(item) for item in recommendations][:5],
    }


def generate_questions(
    request: QuestionsRequest,
) -> tuple[list[dict[str, Any]], str, str | None]:
    if not _api_key():
        return (
            _mock_questions(request),
            "mock",
            "GEMINI_API_KEY no configurada; se usaron preguntas de ejemplo.",
        )

    try:
        data = _call_gemini(questions_prompt(request), temperature=0.7)
        raw_questions = data.get("questions", [])
        questions: list[dict[str, Any]] = []

        for index, item in enumerate(raw_questions[: request.count]):
            if not isinstance(item, dict):
                continue
            text = str(item.get("text", "")).strip()
            if not text:
                continue
            questions.append(
                {
                    "id": index + 1,
                    "text": text,
                    "focus": str(item.get("focus", "")).strip(),
                }
            )

        if not questions:
            raise ValueError("Gemini no devolvió preguntas válidas")

        return questions, "gemini", None
    except Exception as exc:  # noqa: BLE001
        logger.exception("Fallo generando preguntas con Gemini")
        return (
            _mock_questions(request),
            "mock",
            f"No se pudo usar Gemini ({exc}); se usaron preguntas de ejemplo.",
        )


def evaluate_answer(
    request: EvaluateRequest,
) -> tuple[dict[str, Any], str, str | None]:
    if not _api_key():
        return (
            _mock_evaluation(),
            "mock",
            "GEMINI_API_KEY no configurada; se usó una evaluación de ejemplo.",
        )

    try:
        data = _call_gemini(evaluate_prompt(request), temperature=0.3)
        return _normalize_evaluation(data), "gemini", None
    except Exception as exc:  # noqa: BLE001
        logger.exception("Fallo evaluando la respuesta con Gemini")
        return (
            _mock_evaluation(),
            "mock",
            f"No se pudo usar Gemini ({exc}); se usó una evaluación de ejemplo.",
        )
