"""
Testimonial service.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, and_, func
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from typing import Optional, List
import logging

from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialCreateRequest

logger = logging.getLogger(__name__)


class TestimonialService:
    """Testimonial service."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def list_published_testimonials(self) -> List[Testimonial]:
        """List published testimonials sorted by order."""
        result = await self.db.execute(
            select(Testimonial)
            .where(Testimonial.is_published == True)
            .order_by(Testimonial.order.asc(), Testimonial.created_at.desc())
        )
        testimonials = result.scalars().all()
        return list(testimonials)
    
    async def create_testimonial(self, testimonial_data: TestimonialCreateRequest) -> Testimonial:
        """Create new testimonial (admin only)."""
        testimonial = Testimonial(
            name=testimonial_data.name,
            role=testimonial_data.role,
            company=testimonial_data.company,
            content=testimonial_data.content,
            rating=testimonial_data.rating,
            avatar=testimonial_data.avatar,
            is_published=True,  # Default to published
            order=0  # Default order
        )
        
        self.db.add(testimonial)
        await self.db.commit()
        await self.db.refresh(testimonial)
        return testimonial
    
    async def update_testimonial(self, testimonial_id: str, update_data: dict) -> Testimonial:
        """Update testimonial (admin only)."""
        testimonial = await self.get_testimonial_by_id_admin(testimonial_id)
        
        # Update fields if provided
        for field, value in update_data.items():
            if hasattr(testimonial, field) and value is not None:
                setattr(testimonial, field, value)
        
        await self.db.commit()
        await self.db.refresh(testimonial)
        return testimonial
    
    async def delete_testimonial(self, testimonial_id: str) -> None:
        """Delete testimonial (admin only)."""
        testimonial = await self.get_testimonial_by_id_admin(testimonial_id)
        await self.db.delete(testimonial)
        await self.db.commit()
    
    async def toggle_testimonial_status(self, testimonial_id: str) -> Testimonial:
        """Toggle testimonial publish status (admin only)."""
        testimonial = await self.get_testimonial_by_id_admin(testimonial_id)
        testimonial.is_published = not testimonial.is_published
        
        await self.db.commit()
        await self.db.refresh(testimonial)
        return testimonial
    
    async def get_testimonial_by_id_admin(self, testimonial_id: str) -> Testimonial:
        """Get testimonial by ID (admin endpoint)."""
        result = await self.db.execute(
            select(Testimonial).where(Testimonial.id == testimonial_id)
        )
        testimonial = result.scalar_one_or_none()
        
        if not testimonial:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Testimonial not found"
            )
        
        return testimonial
