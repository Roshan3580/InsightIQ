from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # App settings
    app_name: str = "InsightIQ"
    debug: bool = True
    
    # Database
    database_url: str = "postgresql://postgres:password@localhost:5432/insightiq"
    database_url_async: str = "postgresql+asyncpg://postgres:password@localhost:5432/insightiq"
    
    # AI Settings
    groq_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # File upload
    upload_dir: str = "uploads"
    max_file_size: int = 50 * 1024 * 1024  # 50MB
    
    # DuckDB for local processing
    duckdb_path: str = "data/insightiq.duckdb"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Create settings instance
settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.upload_dir, exist_ok=True)
os.makedirs("data", exist_ok=True) 