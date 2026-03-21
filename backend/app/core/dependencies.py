def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# add new guard for rm
def require_rm(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in ("admin", "rm"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="RM access required"
        )
    return current_user