from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.requests import Request
from app.core.config import settings

from app.routers import auth
from app.routers import plots
from app.routers import floors
from app.routers import brokers
from app.routers import customers
from app.routers import sales
from app.routers import payments
from app.routers import dashboard
from app.routers import documents
from app.routers import society

import app.models

app = FastAPI(
    title="Land Inventory API",
    version="1.0.0",
    root_path="/api"
)


def _csv_to_list(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


cors_allow_origins = _csv_to_list(settings.CORS_ALLOW_ORIGINS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if settings.ENABLE_TRUSTED_HOSTS:
    trusted_hosts = _csv_to_list(settings.TRUSTED_HOSTS)
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=trusted_hosts)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)

    if not settings.SECURITY_HEADERS_ENABLED:
        return response

    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"

    if settings.HSTS_ENABLED:
        response.headers["Strict-Transport-Security"] = f"max-age={settings.HSTS_MAX_AGE_SECONDS}; includeSubDomains"

    return response

app.include_router(auth.router)
app.include_router(society.router)
app.include_router(plots.router)
app.include_router(floors.router)
app.include_router(brokers.router)
app.include_router(customers.router)
app.include_router(sales.router)
app.include_router(payments.router)
app.include_router(dashboard.router)
app.include_router(documents.router)

@app.get("/")
def root():
    return {"message": "Land Inventory API is running"}