from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "nutri_smart"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = ""
    
    # JWT
    JWT_SECRET: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 168  # 7 days
    
    # Server
    PORT: int = 3000
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "development"
    
    # CORS
    CORS_ORIGINS: str = "*"
    
    @property
    def database_url(self) -> str:
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    @property
    def cors_origins_list(self) -> List[str]:
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
