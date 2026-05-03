"""
Pricing routes.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.dependencies import get_db, get_current_admin
from app.services.pricing_service import PricingService
from app.schemas.pricing import PricingPlanCreateRequest, PricingPlanResponse
from app.schemas.common import SuccessResponse
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()


class PricingPlanUpdateRequest(BaseModel):
    """Pricing plan update request."""
    name: str = None
    description: str = None
    price: float = None
    currency: str = None
    billing_cycle: str = None
    features: List[str] = None
    is_popular: bool = None
    order: int = None


def get_pricing_service(db: AsyncSession = Depends(get_db)) -> PricingService:
    """Get pricing service instance."""
    return PricingService(db)


# Public routes
@router.get("/", response_model=List[PricingPlanResponse])
async def list_pricing_plans(
    pricing_service: PricingService = Depends(get_pricing_service)
):
    """List active plans (sorted by order)."""
    plans = await pricing_service.list_active_pricing_plans()
    return [PricingPlanResponse.model_validate(plan) for plan in plans]


@router.get("/{slug}", response_model=PricingPlanResponse)
async def get_pricing_plan_by_slug(
    slug: str,
    pricing_service: PricingService = Depends(get_pricing_service)
):
    """Get plan by slug."""
    plan = await pricing_service.get_pricing_plan_by_slug(slug)
    return PricingPlanResponse.model_validate(plan)


# Admin routes
@router.post("/admin/pricing", response_model=PricingPlanResponse)
async def create_pricing_plan_admin(
    plan_data: PricingPlanCreateRequest,
    current_user: User = Depends(get_current_admin),
    pricing_service: PricingService = Depends(get_pricing_service)
):
    """Create plan (auto slug)."""
    plan = await pricing_service.create_pricing_plan(plan_data)
    return PricingPlanResponse.model_validate(plan)


@router.patch("/admin/pricing/{plan_id}", response_model=PricingPlanResponse)
async def update_pricing_plan_admin(
    plan_id: str,
    update_data: PricingPlanUpdateRequest,
    current_user: User = Depends(get_current_admin),
    pricing_service: PricingService = Depends(get_pricing_service)
):
    """Update plan (admin only)."""
    # Convert Pydantic model to dict, excluding None values
    update_dict = update_data.model_dump(exclude_unset=True)
    plan = await pricing_service.update_pricing_plan(plan_id, update_dict)
    return PricingPlanResponse.model_validate(plan)


@router.delete("/admin/pricing/{plan_id}", response_model=SuccessResponse)
async def delete_pricing_plan_admin(
    plan_id: str,
    current_user: User = Depends(get_current_admin),
    pricing_service: PricingService = Depends(get_pricing_service)
):
    """Delete plan (admin only)."""
    await pricing_service.delete_pricing_plan(plan_id)
    return SuccessResponse(message="Pricing plan deleted successfully")


@router.patch("/admin/pricing/{plan_id}/toggle", response_model=PricingPlanResponse)
async def toggle_pricing_plan_admin(
    plan_id: str,
    current_user: User = Depends(get_current_admin),
    pricing_service: PricingService = Depends(get_pricing_service)
):
    """Toggle plan active status (admin only)."""
    plan = await pricing_service.toggle_pricing_plan_status(plan_id)
    return PricingPlanResponse.model_validate(plan)
