from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "cns-socialsalud-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours
    DATABASE_URL: str = "sqlite:///./socialsalud.db"

    class Config:
        env_file = ".env"


settings = Settings()
