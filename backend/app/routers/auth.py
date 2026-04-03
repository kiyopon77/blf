from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin, is_admin
from app.services.auth import authenticate_user, create_user, generate_tokens, get_user_by_id
from app.services.auth_guard import auth_guard
from app.schemas.user import LoginRequest, TokenResponse, UserCreate, UserResponse, UserUpdate
from app.core.security import decode_token
from app.core.config import settings
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if settings.TRUST_X_FORWARDED_FOR and forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _build_key(prefix: str, request: Request, identity: str) -> str:
    return f"{prefix}:{_client_ip(request)}:{identity.lower()}"


# ── Login ──────────────────────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    throttle_key = _build_key("login", request, payload.email)
    allowed, retry_after = auth_guard.check_allowed(
        throttle_key,
        window_seconds=settings.AUTH_RATE_LIMIT_WINDOW_SECONDS,
        max_attempts=settings.AUTH_LOGIN_MAX_ATTEMPTS,
        lockout_seconds=settings.AUTH_LOCKOUT_SECONDS,
    )

    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many login attempts. Try again in {retry_after} seconds"
        )

    user = authenticate_user(db, payload.email, payload.password)

    if not user:
        auth_guard.register_failure(
            throttle_key,
            window_seconds=settings.AUTH_RATE_LIMIT_WINDOW_SECONDS,
            max_attempts=settings.AUTH_LOGIN_MAX_ATTEMPTS,
            lockout_seconds=settings.AUTH_LOCKOUT_SECONDS,
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    auth_guard.reset(throttle_key)

    tokens = generate_tokens(user)

    # refresh token goes in httpOnly cookie — JS cannot touch this
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )

    return {
        "access_token": tokens["access_token"],
        "token_type": "bearer",
        "role": user.role
    }


# ── Refresh Token ───────────────────────────────────────────────────────
@router.post("/refresh", response_model=TokenResponse)
def refresh_token(
    request: Request,
    response: Response,
    refresh_token: Optional[str] = Cookie(default=None),
    db: Session = Depends(get_db)
):
    throttle_key = _build_key("refresh", request, "cookie")
    allowed, retry_after = auth_guard.check_allowed(
        throttle_key,
        window_seconds=settings.AUTH_RATE_LIMIT_WINDOW_SECONDS,
        max_attempts=settings.AUTH_REFRESH_MAX_ATTEMPTS,
        lockout_seconds=settings.AUTH_LOCKOUT_SECONDS,
    )
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many refresh attempts. Try again in {retry_after} seconds"
        )

    if not refresh_token:
        auth_guard.register_failure(
            throttle_key,
            window_seconds=settings.AUTH_RATE_LIMIT_WINDOW_SECONDS,
            max_attempts=settings.AUTH_REFRESH_MAX_ATTEMPTS,
            lockout_seconds=settings.AUTH_LOCKOUT_SECONDS,
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token provided"
        )

    payload = decode_token(refresh_token)

    if not payload or payload.get("type") != "refresh":
        auth_guard.register_failure(
            throttle_key,
            window_seconds=settings.AUTH_RATE_LIMIT_WINDOW_SECONDS,
            max_attempts=settings.AUTH_REFRESH_MAX_ATTEMPTS,
            lockout_seconds=settings.AUTH_LOCKOUT_SECONDS,
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )

    sub = payload.get("sub")
    if not sub or not str(sub).isdigit():
        auth_guard.register_failure(
            throttle_key,
            window_seconds=settings.AUTH_RATE_LIMIT_WINDOW_SECONDS,
            max_attempts=settings.AUTH_REFRESH_MAX_ATTEMPTS,
            lockout_seconds=settings.AUTH_LOCKOUT_SECONDS,
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    user_id = int(sub)
    user = get_user_by_id(db, user_id)

    if not user or not user.is_active:
        auth_guard.register_failure(
            throttle_key,
            window_seconds=settings.AUTH_RATE_LIMIT_WINDOW_SECONDS,
            max_attempts=settings.AUTH_REFRESH_MAX_ATTEMPTS,
            lockout_seconds=settings.AUTH_LOCKOUT_SECONDS,
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )

    auth_guard.reset(throttle_key)

    tokens = generate_tokens(user)

    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )

    return {
        "access_token": tokens["access_token"],
        "token_type": "bearer",
        "role": user.role
    }


# ── Logout ──────────────────────────────────────────────────────────────
@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        "refresh_token",
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE,
    )
    return {"message": "Logged out successfully"}


@router.get("/user/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if not is_admin(current_user) and current_user.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user"
        )

    user = get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


# ── Get Current User ────────────────────────────────────────────────────
@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user)):
    return current_user


# ── Create User (Admin Only) ────────────────────────────────────────────
@router.post("/users", response_model=UserResponse)
def create_new_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    return create_user(db, user_data)


# ── List All Users (Admin Only)─────────────────────────────────────────
@router.get("/users", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    from app.models.user import User
    return db.query(User).all()

# ── Update User (Admin only) ────────────────────────────
@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    from app.models.user import User
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # check email not taken by someone else
    if data.email:
        existing = db.query(User).filter(
            User.email == data.email,
            User.user_id != user_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )

    for key, value in data.model_dump(exclude_none=True).items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user