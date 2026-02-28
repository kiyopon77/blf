from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.user_id == user_id).first()

def create_user(db: Session, user_data: UserCreate):
    hashed = hash_password(user_data.password)
    db_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashed,
        role=user_data.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    if not user.is_active:
        return None
    return user

def generate_tokens(user: User) -> dict:
    data = {"sub": str(user.user_id), "role": user.role}
    return {
        "access_token": create_access_token(data),
        "refresh_token": create_refresh_token(data)
    }