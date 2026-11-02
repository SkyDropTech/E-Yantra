from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "WildWatch"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # SQLite default, easily overridable by DATABASE_URL environment variable (e.g. postgresql://...)
    DATABASE_URL: str = "sqlite:///./wildwatch.db"
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    DEFAULT_CONFIDENCE_FLOOR: float = 0.70
    AUTO_VERIFY_THRESHOLD: float = 0.90
    DUPLICATE_WINDOW_MINUTES: int = 15
    MODEL_WEIGHTS_PATH: str = "models/yolov8n.pt"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
