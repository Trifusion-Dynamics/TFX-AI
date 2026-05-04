"""
Authentication routes.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user
from app.services.auth_service import (
    register_user, verify_email, login_user, logout_user,
    refresh_access_token, forgot_password, reset_password, change_password
)
from app.schemas.auth import (
    RegisterRequest, LoginRequest, TokenResponse,
    ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest
)
from app.schemas.user import UserResponse
from app.schemas.common import ApiResponse
from app.models.user import User
from typing import Dict

router = APIRouter()
security = HTTPBearer()

# @router.post("/register", response_model=ApiResponse[UserResponse], status_code=status.HTTP_201_CREATED)
# async def register(
#     data: RegisterRequest,
#     db: AsyncSession = Depends(get_db)
# ):
#     """
#     Register a new user.
#     """
#     user = await register_user(data, db)
#     return ApiResponse(
#         success=True,
#         message="User registered successfully. Please check your email for verification.",
#         data=user
#     )


@router.get("/verify-email", response_model=ApiResponse[Dict])
async def verify_email_endpoint(
    token: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Verify user email.
    """
    result = await verify_email(token, db)
    return ApiResponse(
        success=True,
        message=result["message"],
        data=result
    )


@router.post("/login", response_model=ApiResponse[TokenResponse])
async def login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Login user and return tokens.
    """
    tokens = await login_user(data, db)
    return ApiResponse(
        success=True,
        message="Login successful",
        data=tokens
    )


@router.post("/logout", response_model=ApiResponse[Dict])
async def logout(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Logout user.
    """
    result = await logout_user(str(current_user.id), db)
    return ApiResponse(
        success=True,
        message=result["message"],
        data=result
    )


@router.post("/refresh", response_model=ApiResponse[Dict])
async def refresh_token(
    refresh_token: str = Depends(security),
    db: AsyncSession = Depends(get_db)
):
    """
    Refresh access token.
    """
    result = await refresh_access_token(refresh_token.credentials, db)
    return ApiResponse(
        success=True,
        message="Token refreshed successfully",
        data=result
    )


@router.post("/forgot-password", response_model=ApiResponse[Dict])
async def forgot_password_endpoint(
    data: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Send password reset email.
    """
    result = await forgot_password(data.email, db)
    return ApiResponse(
        success=True,
        message=result["message"],
        data=result
    )


@router.post("/reset-password", response_model=ApiResponse[Dict])
async def reset_password_endpoint(
    data: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Reset password with token.
    """
    result = await reset_password(data.token, data.new_password, db)
    return ApiResponse(
        success=True,
        message=result["message"],
        data=result
    )


@router.post("/change-password", response_model=ApiResponse[Dict])
async def change_password_endpoint(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Change user password.
    """
    result = await change_password(current_user, data.current_password, data.new_password, db)
    return ApiResponse(
        success=True,
        message=result["message"],
        data=result
    )


@router.get("/me", response_model=ApiResponse[UserResponse])
async def get_current_user_endpoint(
    current_user: User = Depends(get_current_user)
):
    """
    Get current user information.
    """
    return ApiResponse(
        success=True,
        message="User retrieved successfully",
        data=UserResponse.model_validate(current_user)
    )
