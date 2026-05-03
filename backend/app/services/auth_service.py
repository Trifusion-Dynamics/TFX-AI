"""
Authentication service functions.
"""

import secrets
import hashlib
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User, UserRole
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.core.exceptions import AppException
from app.utils.email import send_verification_email, send_welcome_email, send_password_reset_email
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.schemas.user import UserResponse
import logging

logger = logging.getLogger(__name__)


async def register_user(data: RegisterRequest, db: AsyncSession) -> UserResponse:
    """
    Register a new user.
    """
    # Check if email already exists
    result = await db.execute(
        select(User).where(User.email == data.email)
    )
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise AppException(409, "Email already registered")
    
    # Hash password
    hashed_password = hash_password(data.password)
    
    # Create user
    user = User(
        name=data.name,
        email=data.email,
        password=hashed_password,
        role=UserRole.USER,
        is_verified=False
    )
    
    db.add(user)
    await db.flush()
    
    # Generate verification token
    verification_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(f"ev:{verification_token}".encode()).hexdigest()
    user.refresh_token = f"ev:{token_hash}"
    
    await db.commit()
    
    # Send verification email
    try:
        await send_verification_email(user.email, user.name, verification_token)
    except Exception as e:
        logger.error(f"Failed to send verification email: {e}")
    
    return UserResponse.model_validate(user)


async def verify_email(token: str, db: AsyncSession) -> dict:
    """
    Verify user email.
    """
    # Find user with verification token
    token_hash = hashlib.sha256(f"ev:{token}".encode()).hexdigest()
    result = await db.execute(
        select(User).where(User.refresh_token == f"ev:{token_hash}")
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise AppException(400, "Invalid or expired verification token")
    
    # Update user
    user.is_verified = True
    user.refresh_token = None
    
    await db.commit()
    
    # Send welcome email
    try:
        await send_welcome_email(user.email, user.name)
    except Exception as e:
        logger.error(f"Failed to send welcome email: {e}")
    
    return {"message": "Email verified successfully"}


async def login_user(data: LoginRequest, db: AsyncSession) -> TokenResponse:
    """
    Login user and return tokens.
    """
    # Find user by email
    result = await db.execute(
        select(User).where(User.email == data.email)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise AppException(401, "Invalid credentials")
    
    # Verify password
    if not verify_password(data.password, user.password):
        raise AppException(401, "Invalid credentials")
    
    # Check if verified
    if not user.is_verified:
        raise AppException(403, "Please verify your email")
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    # Store hashed refresh token
    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    user.refresh_token = token_hash
    
    await db.commit()
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )


async def logout_user(user_id: str, db: AsyncSession) -> dict:
    """
    Logout user by clearing refresh token.
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if user:
        user.refresh_token = None
        await db.commit()
    
    return {"message": "Logged out successfully"}


async def refresh_access_token(refresh_token: str, db: AsyncSession) -> dict:
    """
    Refresh access token using refresh token.
    """
    # Decode refresh token
    payload = decode_token(refresh_token)
    user_id = payload.get("sub")
    
    if not user_id:
        raise AppException(401, "Invalid token")
    
    # Find user
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise AppException(401, "Invalid token")
    
    # Verify stored refresh token
    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    if user.refresh_token != token_hash:
        raise AppException(401, "Invalid refresh token")
    
    # Create new access token
    new_access_token = create_access_token(data={"sub": str(user.id)})
    
    return {"access_token": new_access_token}


async def forgot_password(email: str, db: AsyncSession) -> dict:
    """
    Send password reset email.
    """
    # Find user (don't reveal if not found)
    result = await db.execute(
        select(User).where(User.email == email)
    )
    user = result.scalar_one_or_none()
    
    if user:
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(f"pr:{reset_token}".encode()).hexdigest()
        user.refresh_token = f"pr:{token_hash}"
        
        await db.commit()
        
        # Send reset email
        try:
            await send_password_reset_email(user.email, user.name, reset_token)
        except Exception as e:
            logger.error(f"Failed to send password reset email: {e}")
    
    return {"message": "If the email exists, a password reset link has been sent"}


async def reset_password(token: str, new_password: str, db: AsyncSession) -> dict:
    """
    Reset user password.
    """
    # Find user with reset token
    token_hash = hashlib.sha256(f"pr:{token}".encode()).hexdigest()
    result = await db.execute(
        select(User).where(User.refresh_token == f"pr:{token_hash}")
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise AppException(400, "Invalid or expired reset token")
    
    # Update password
    user.password = hash_password(new_password)
    user.refresh_token = None
    
    await db.commit()
    
    return {"message": "Password reset successfully"}


async def change_password(user: User, current_pwd: str, new_pwd: str, db: AsyncSession) -> dict:
    """
    Change user password.
    """
    # Verify current password
    if not verify_password(current_pwd, user.password):
        raise AppException(401, "Current password is incorrect")
    
    # Update password
    user.password = hash_password(new_pwd)
    
    await db.commit()
    
    return {"message": "Password changed successfully"}
