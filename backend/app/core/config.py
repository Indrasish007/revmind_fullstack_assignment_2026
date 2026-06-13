import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field

# Load environment variables from .env file at the root of the backend folder
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '.env')
load_dotenv(dotenv_path=env_path)

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

# Instantiate settings using environment variables, falling back to Pydantic defaults
settings = Settings(
    ENVIRONMENT=os.getenv("ENVIRONMENT", "development"),
    DEBUG=os.getenv("DEBUG", "true").lower() in ("true", "1", "yes"),
    GROQ_API_KEY=os.getenv("GROQ_API_KEY"),
    OPENAI_API_KEY=os.getenv("OPENAI_API_KEY"),
    ANTHROPIC_API_KEY=os.getenv("ANTHROPIC_API_KEY"),
    DATABASE_URL=os.getenv("DATABASE_URL", "sqlite:///./sales_insights.db")
)
