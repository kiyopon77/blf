from fastapi import Depends, HTTPException, status, Cookie
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_token
from app.services.auth import get_user_by_id
from app.models.user import User
from typing import Optional

bearer_scheme = HTTPBearer()


def is_admin(user: User) -> bool:
    return user.role == "admin"


def get_effective_society_id(current_user: User, requested_society_id: Optional[int] = None) -> Optional[int]:
    # Admin can query globally (None) or any selected society.
    if is_admin(current_user):
        return requested_society_id

    # Non-admin users are always scoped to their own society.
    if current_user.society_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not assigned to any society"
        )
    return current_user.society_id


def ensure_society_access(current_user: User, target_society_id: Optional[int]) -> None:
    if is_admin(current_user):
        return
    if current_user.society_id is None or target_society_id is None or current_user.society_id != target_society_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized for this society"
        )

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = decode_token(token)

    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    sub = payload.get("sub")
    if not sub or not str(sub).isdigit():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    user_id = int(sub)
    user = get_user_by_id(db, user_id)

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )

    return user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

def require_rm(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in ("admin", "rm"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="RM access required"
        )
    return current_user