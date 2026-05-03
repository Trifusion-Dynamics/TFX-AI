"""
Testimonial routes.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.dependencies import get_db, get_current_admin
from app.services.testimonial_service import TestimonialService
from app.schemas.testimonial import TestimonialCreateRequest, TestimonialResponse
from app.schemas.common import SuccessResponse
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()


class TestimonialUpdateRequest(BaseModel):
    """Testimonial update request."""
    name: str = None
    role: str = None
    company: str = None
    content: str = None
    rating: int = None
    avatar: str = None
    order: int = None


def get_testimonial_service(db: AsyncSession = Depends(get_db)) -> TestimonialService:
    """Get testimonial service instance."""
    return TestimonialService(db)


# Public route
@router.get("/", response_model=List[TestimonialResponse])
async def list_testimonials(
    testimonial_service: TestimonialService = Depends(get_testimonial_service)
):
    """List published testimonials (sorted by order)."""
    testimonials = await testimonial_service.list_published_testimonials()
    return [TestimonialResponse.model_validate(testimonial) for testimonial in testimonials]


# Admin routes
@router.post("/admin/testimonials", response_model=TestimonialResponse)
async def create_testimonial_admin(
    testimonial_data: TestimonialCreateRequest,
    current_user: User = Depends(get_current_admin),
    testimonial_service: TestimonialService = Depends(get_testimonial_service)
):
    """Create testimonial (admin only)."""
    testimonial = await testimonial_service.create_testimonial(testimonial_data)
    return TestimonialResponse.model_validate(testimonial)


@router.patch("/admin/testimonials/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial_admin(
    testimonial_id: str,
    update_data: TestimonialUpdateRequest,
    current_user: User = Depends(get_current_admin),
    testimonial_service: TestimonialService = Depends(get_testimonial_service)
):
    """Update testimonial (admin only)."""
    # Convert Pydantic model to dict, excluding None values
    update_dict = update_data.model_dump(exclude_unset=True)
    testimonial = await testimonial_service.update_testimonial(testimonial_id, update_dict)
    return TestimonialResponse.model_validate(testimonial)


@router.delete("/admin/testimonials/{testimonial_id}", response_model=SuccessResponse)
async def delete_testimonial_admin(
    testimonial_id: str,
    current_user: User = Depends(get_current_admin),
    testimonial_service: TestimonialService = Depends(get_testimonial_service)
):
    """Delete testimonial (admin only)."""
    await testimonial_service.delete_testimonial(testimonial_id)
    return SuccessResponse(message="Testimonial deleted successfully")


@router.patch("/admin/testimonials/{testimonial_id}/toggle", response_model=TestimonialResponse)
async def toggle_testimonial_admin(
    testimonial_id: str,
    current_user: User = Depends(get_current_admin),
    testimonial_service: TestimonialService = Depends(get_testimonial_service)
):
    """Toggle testimonial publish status (admin only)."""
    testimonial = await testimonial_service.toggle_testimonial_status(testimonial_id)
    return TestimonialResponse.model_validate(testimonial)
