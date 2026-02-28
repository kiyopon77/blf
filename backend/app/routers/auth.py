from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.services.auth import authenticate_user, create_user, generate_tokens, get_user_by_id
from app.schemas.user import LoginRequest, TokenResponse, UserCreate, UserResponse
from app.core.security import decode_token
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ── Login ──────────────────────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = authenticate_user(db, request.email, request.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    tokens = generate_tokens(user)

    # refresh token goes in httpOnly cookie — JS cannot touch this
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        secure=False,   # set True in production (HTTPS)
        samesite="lax",
        max_age=7 * 24 * 60 * 60  # 7 days in seconds
    )

    return {
        "access_token": tokens["access_token"],
        "token_type": "bearer",
        "role": user.role
    }


# ── Refresh Token ───────────────────────────────────────────────────────
@router.post("/refresh", response_model=TokenResponse)
def refresh_token(
    response: Response,
    refresh_token: Optional[str] = Cookie(default=None),
    db: Session = Depends(get_db)
):
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token provided"
        )

    payload = decode_token(refresh_token)

    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )

    user_id = int(payload.get("sub"))
    user = get_user_by_id(db, user_id)

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )

    tokens = generate_tokens(user)

    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )

    return {
        "access_token": tokens["access_token"],
        "token_type": "bearer",
        "role": user.role
    }


# ── Logout ──────────────────────────────────────────────────────────────
@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}


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