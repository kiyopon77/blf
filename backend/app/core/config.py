from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # ✅ Change these for production
    COOKIE_SECURE: bool = True        # was False
    COOKIE_SAMESITE: str = "none"     # was "lax" — needed for cross-domain cookies

    AUTH_RATE_LIMIT_WINDOW_SECONDS: int = 60
    AUTH_LOGIN_MAX_ATTEMPTS: int = 8
    AUTH_REFRESH_MAX_ATTEMPTS: int = 20
    AUTH_LOCKOUT_SECONDS: int = 300

    SECURITY_HEADERS_ENABLED: bool = True
    HSTS_ENABLED: bool = True         # was False
    HSTS_MAX_AGE_SECONDS: int = 31536000

    CORS_ALLOW_ORIGINS: str = "http://localhost,http://localhost:3000,https://frontend-production-09e6.up.railway.app"
    TRUST_X_FORWARDED_FOR: bool = False
    ENABLE_TRUSTED_HOSTS: bool = False
    TRUSTED_HOSTS: str = "*"

    class Config:
        env_file = ".env"

settings = Settings()
