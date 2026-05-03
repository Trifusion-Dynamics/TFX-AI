"""
User routes.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.dependencies import get_db, get_current_user, get_current_admin, get_pagination_params
from app.services.user_service import UserService
from app.schemas.user import UserResponse, UserUpdateRequest, UserRoleUpdateRequest
from app.schemas.common import PaginatedResponse, PaginationMeta, SuccessResponse
from app.models.user import User

router = APIRouter()


def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    """Get user service instance."""
    return UserService(db)


# User routes
@router.get("/me", response_model=UserResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Get my profile."""
    user = await user_service.get_user_profile(str(current_user.id))
    return UserResponse.model_validate(user)


@router.patch("/me", response_model=UserResponse)
async def update_my_profile(
    update_data: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Update profile (name, avatar)."""
    user = await user_service.update_user_profile(str(current_user.id), update_data)
    return UserResponse.model_validate(user)


@router.delete("/me", response_model=SuccessResponse)
async def delete_my_account(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Delete my account."""
    await user_service.delete_user_account(str(current_user.id))
    return SuccessResponse(message="Account deleted successfully")


# Admin routes
@router.get("/admin/users", response_model=PaginatedResponse[UserResponse])
async def list_users_admin(
    pagination: dict = Depends(get_pagination_params),
    search: Optional[str] = Query(None, description="Search by name or email"),
    role_filter: Optional[str] = Query(None, description="Filter by role"),
    current_user: User = Depends(get_current_admin),
    user_service: UserService = Depends(get_user_service)
):
    """List all users (admin only)."""
    users, total = await user_service.list_users(
        page=pagination["page"],
        limit=pagination["limit"],
        search=search,
        role_filter=role_filter
    )
    
    user_responses = [UserResponse.model_validate(user) for user in users]
    total_pages = (total + pagination["limit"] - 1) // pagination["limit"]
    
    return PaginatedResponse(
        data=user_responses,
        meta=PaginationMeta(
            total=total,
            page=pagination["page"],
            limit=pagination["limit"],
            total_pages=total_pages
        )
    )


@router.get("/admin/users/{user_id}", response_model=UserResponse)
async def get_user_by_id_admin(
    user_id: str,
    current_user: User = Depends(get_current_admin),
    user_service: UserService = Depends(get_user_service)
):
    """Get user by ID (admin only)."""
    user = await user_service.get_user_by_id_admin(user_id)
    return UserResponse.model_validate(user)


@router.patch("/admin/users/{user_id}/role", response_model=UserResponse)
async def update_user_role_admin(
    user_id: str,
    role_data: UserRoleUpdateRequest,
    current_user: User = Depends(get_current_admin),
    user_service: UserService = Depends(get_user_service)
):
    """Update user role (admin only)."""
    user = await user_service.update_user_role(user_id, role_data)
    return UserResponse.model_validate(user)


@router.delete("/admin/users/{user_id}", response_model=SuccessResponse)
async def delete_user_admin(
    user_id: str,
    current_user: User = Depends(get_current_admin),
    user_service: UserService = Depends(get_user_service)
):
    """Delete user (admin only)."""
    await user_service.delete_user_admin(user_id)
    return SuccessResponse(message="User deleted successfully")
