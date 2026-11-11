from pydantic import BaseModel, Field


class QuestionsRequest(BaseModel):
    mode: str = "laboral"
    role: str = "Product Manager"
    difficulty: str = "intermedio"
    tone: str = "neutral"
    count: int = Field(default=3, ge=1, le=5)


class Question(BaseModel):
    id: int
    text: str
    focus: str = ""


class QuestionsResponse(BaseModel):
    questions: list[Question]
    provider: str = "gemini"
    warning: str | None = None


class EvaluateRequest(BaseModel):
    question: str
    answer: str
    mode: str = "laboral"
    role: str = "Product Manager"


class StarFeedback(BaseModel):
    situation: str
    task: str
    action: str
    result: str


class Metrics(BaseModel):
    fluency: int = 0
    fillerWords: str = ""
    confidence: int = 0
    keywords: str = ""


class EvaluateResponse(BaseModel):
    score: int = 0
    summary: str = ""
    star: StarFeedback
    metrics: Metrics
    strengths: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)
    provider: str = "gemini"
    warning: str | None = None
