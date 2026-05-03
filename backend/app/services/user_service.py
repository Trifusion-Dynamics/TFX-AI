"""
User service.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, and_, or_, func
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from typing import Optional, List, Dict, Any
import logging

from app.models.user import User, UserRole
from app.schemas.user import UserUpdateRequest, UserRoleUpdateRequest

logger = logging.getLogger(__name__)


class UserService:
    """User service."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_user_profile(self, user_id: str) -> User:
        """Get current user profile."""
        user = await self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    
    async def update_user_profile(self, user_id: str, update_data: UserUpdateRequest) -> User:
        """Update user profile."""
        user = await self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update fields if provided
        if update_data.name is not None:
            user.name = update_data.name
        if update_data.avatar is not None:
            user.avatar = update_data.avatar
        
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def delete_user_account(self, user_id: str) -> None:
        """Delete user account."""
        user = await self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        await self.db.delete(user)
        await self.db.commit()
    
    async def list_users(
        self, 
        page: int = 1, 
        limit: int = 10, 
        search: Optional[str] = None,
        role_filter: Optional[str] = None
    ) -> tuple[List[User], int]:
        """List users with pagination and filters."""
        query = select(User)
        
        # Apply filters
        conditions = []
        if search:
            conditions.append(
                or_(
                    User.name.ilike(f"%{search}%"),
                    User.email.ilike(f"%{search}%")
                )
            )
        
        if role_filter:
            try:
                role_enum = UserRole(role_filter.upper())
                conditions.append(User.role == role_enum)
            except ValueError:
                pass  # Invalid role, ignore filter
        
        if conditions:
            query = query.where(and_(*conditions))
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Apply pagination and ordering
        query = query.order_by(User.created_at.desc())
        query = query.offset((page - 1) * limit).limit(limit)
        
        result = await self.db.execute(query)
        users = result.scalars().all()
        
        return list(users), total
    
    async def get_user_by_id_admin(self, user_id: str) -> User:
        """Get user by ID (admin endpoint)."""
        user = await self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    
    async def update_user_role(self, user_id: str, role_data: UserRoleUpdateRequest) -> User:
        """Update user role (admin only)."""
        user = await self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        try:
            role_enum = UserRole(role_data.role.upper())
            user.role = role_enum
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid role. Must be one of: {[r.value for r in UserRole]}"
            )
        
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def delete_user_admin(self, user_id: str) -> None:
        """Delete user (admin only)."""
        await self.delete_user_account(user_id)
