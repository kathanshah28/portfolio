# app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # App Config
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Database
    MONGODB_URI: str
    DB_NAME: str = "test"

    # LLM Provider Keys (Groq is fast and cost-effective; OpenAI as alternative)
    GROQ_API_KEY: Optional[str] = None
    GOOGLE_GEMINI_API: Optional[str] = None
    GEMINI_MODEL_NAME: str = "gemini-2.5-flas"  # or "gpt-4o-mini"
    GROQ_MODEL_NAME: str = "qwen/qwen3.8-27b"

    # GitHub Access (Read-Only)
    GITHUB_TOKEN: Optional[str] = None
    GITHUB_USERNAME: str = "kathanshah"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()