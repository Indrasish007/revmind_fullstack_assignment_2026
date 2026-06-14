import os
import logging
from dotenv import load_dotenv
from pydantic import BaseModel, Field

# Setup logger for startup validations
logger = logging.getLogger("app.core.config")

# 1. Load from the backend directory .env (if present)
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
backend_env_path = os.path.join(backend_dir, '.env')
if os.path.exists(backend_env_path):
    load_dotenv(dotenv_path=backend_env_path)

# 2. Try parent workspace root directory .env (fallback/supplement)
root_env_path = os.path.join(os.path.dirname(backend_dir), '.env')
if os.path.exists(root_env_path):
    # Will only fill variables not already loaded (does not overwrite)
    load_dotenv(dotenv_path=root_env_path)

class Settings(BaseModel):
    PROJECT_NAME: str = "RevMind Sales Insights API"
    ENVIRONMENT: str = Field(default="development")
    DEBUG: bool = Field(default=True)
    
    # LLM Settings
    GROQ_API_KEY: str | None = Field(default=None)
    OPENAI_API_KEY: str | None = Field(default=None)
    ANTHROPIC_API_KEY: str | None = Field(default=None)
    
    # Database Settings
    DATABASE_URL: str = Field(default="sqlite:///./sales_insights.db")
    
    # Port Settings
    PORT: int = Field(default=8000)

# Instantiate settings
settings = Settings(
    ENVIRONMENT=os.getenv("ENVIRONMENT", "development"),
    DEBUG=os.getenv("DEBUG", "true").lower() in ("true", "1", "yes"),
    GROQ_API_KEY=os.getenv("GROQ_API_KEY"),
    OPENAI_API_KEY=os.getenv("OPENAI_API_KEY"),
    ANTHROPIC_API_KEY=os.getenv("ANTHROPIC_API_KEY"),
    DATABASE_URL=os.getenv("DATABASE_URL", "sqlite:///./sales_insights.db"),
    PORT=int(os.getenv("PORT", 8000))
)

# Startup environmental key audit
if not settings.GROQ_API_KEY:
    logger.warning(
        "\n======================================================================\n"
        "[WARNING] GROQ_API_KEY environment variable is missing!\n"
        "Conversational Sales Assistant Chat features will fail with clear\n"
        "validation errors on usage. Analytics APIs will remain functional.\n"
        "Please specify GROQ_API_KEY in your configuration.\n"
        "======================================================================\n"
    )
