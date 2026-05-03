"""
FastAPI dependencies for database sessions and authentication.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_token
from app.models.user import User
from sqlalchemy import select
from typing import Optional
import logging

logger = logging.getLogger(__name__)
security = HTTPBearer(auto_error=False)


async def get_db() -> AsyncSession:
    """Dependency to get database session."""
    from app.db.base import AsyncSessionLocal
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Database session error: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()


async def get_current_user(
    token: str = Depends(HTTPBearer()),
    db: AsyncSession = Depends(get_db)
):
    """
    Get current authenticated user.
    """
    # Extract Bearer token
    if not token or not token.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Decode token
    payload = decode_token(token.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Import User model dynamically to avoid circular import
    from app.models.user import User
    
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified"
        )
    
    return user


async def optional_user(
    token: Optional[str] = Depends(HTTPBearer(auto_error=False)),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """
    Get current user if authenticated, otherwise return None.
    """
    if not token or not token.credentials:
        return None
    
    try:
        # Decode token
        payload = decode_token(token.credentials)
        user_id = payload.get("sub")
        if not user_id:
            return None
        
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if user is None or not user.is_verified:
            return None
        
        return user
        
    except Exception:
        return None


async def get_current_admin(
    current_user = Depends(get_current_user)
) -> User:
    """
    Get current authenticated admin user.
    """
    if current_user.role.value != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return current_user




def get_pagination_params(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
) -> dict:
    """
    Get pagination parameters.
    """
    return {"page": page, "limit": limit}
