import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .ai import DEFAULT_MODEL, evaluate_answer, generate_questions
from .schemas import (
    EvaluateRequest,
    EvaluateResponse,
    QuestionsRequest,
    QuestionsResponse,
)

load_dotenv()
logging.basicConfig(level=logging.INFO)
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

app = FastAPI(
    title="Mockly AI API",
    version="0.1.0",
    description="Integración de IA para los simulacros de entrevista de Mockly.",
)

origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "*").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, object]:
    return {
        "status": "ok",
        "provider": "gemini",
        "model": os.getenv("GEMINI_MODEL", DEFAULT_MODEL),
        "configured": bool(os.getenv("GEMINI_API_KEY", "").strip()),
    }


@app.post("/api/interview/questions", response_model=QuestionsResponse)
def interview_questions(request: QuestionsRequest) -> QuestionsResponse:
    questions, provider, warning = generate_questions(request)
    return QuestionsResponse(
        questions=questions,
        provider=provider,
        warning=warning,
    )


@app.post("/api/interview/evaluate", response_model=EvaluateResponse)
def interview_evaluate(request: EvaluateRequest) -> EvaluateResponse:
    evaluation, provider, warning = evaluate_answer(request)
    return EvaluateResponse(**evaluation, provider=provider, warning=warning)
