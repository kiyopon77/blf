from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    COOKIE_SECURE: bool = False
    COOKIE_SAMESITE: str = "lax"

    AUTH_RATE_LIMIT_WINDOW_SECONDS: int = 60
    AUTH_LOGIN_MAX_ATTEMPTS: int = 8
    AUTH_REFRESH_MAX_ATTEMPTS: int = 20
    AUTH_LOCKOUT_SECONDS: int = 300

    SECURITY_HEADERS_ENABLED: bool = True
    HSTS_ENABLED: bool = False
    HSTS_MAX_AGE_SECONDS: int = 31536000

    CORS_ALLOW_ORIGINS: str = "http://localhost,http://localhost:3000"
    ENABLE_TRUSTED_HOSTS: bool = False
    TRUSTED_HOSTS: str = "*"

    class Config:
        env_file = ".env"

settings = Settings()