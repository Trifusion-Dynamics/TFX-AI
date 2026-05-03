"""
Pricing service.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, and_, func
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from typing import Optional, List
import logging
from decimal import Decimal

from app.models.pricing import PricingPlan, BillingCycle
from app.schemas.pricing import PricingPlanCreateRequest
from app.utils.slug import generate_unique_slug_db

logger = logging.getLogger(__name__)


class PricingService:
    """Pricing service."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def list_active_pricing_plans(self) -> List[PricingPlan]:
        """List active pricing plans sorted by order."""
        result = await self.db.execute(
            select(PricingPlan)
            .where(PricingPlan.is_active == True)
            .order_by(PricingPlan.order.asc(), PricingPlan.price.asc())
        )
        plans = result.scalars().all()
        return list(plans)
    
    async def get_pricing_plan_by_slug(self, slug: str) -> PricingPlan:
        """Get pricing plan by slug (public endpoint)."""
        result = await self.db.execute(
            select(PricingPlan).where(
                and_(PricingPlan.slug == slug, PricingPlan.is_active == True)
            )
        )
        plan = result.scalar_one_or_none()
        
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pricing plan not found"
            )
        
        return plan
    
    async def create_pricing_plan(self, plan_data: PricingPlanCreateRequest) -> PricingPlan:
        """Create new pricing plan (admin only)."""
        # Generate unique slug
        slug = await generate_unique_slug_db(plan_data.name, PricingPlan, self.db)
        
        # Parse billing cycle
        try:
            billing_cycle_enum = BillingCycle(plan_data.billing_cycle.upper())
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid billing cycle. Must be one of: {[c.value for c in BillingCycle]}"
            )
        
        plan = PricingPlan(
            name=plan_data.name,
            slug=slug,
            description=plan_data.description,
            price=Decimal(str(plan_data.price)),
            currency=plan_data.currency,
            billing_cycle=billing_cycle_enum,
            features=plan_data.features,
            is_popular=plan_data.is_popular if plan_data.is_popular is not None else False,
            is_active=True,
            order=plan_data.order or 0
        )
        
        self.db.add(plan)
        await self.db.commit()
        await self.db.refresh(plan)
        return plan
    
    async def update_pricing_plan(self, plan_id: str, update_data: dict) -> PricingPlan:
        """Update pricing plan (admin only)."""
        plan = await self.get_pricing_plan_by_id_admin(plan_id)
        
        # Update fields if provided
        if 'name' in update_data and update_data['name'] is not None:
            plan.name = update_data['name']
            # Regenerate slug if name changed
            plan.slug = await generate_unique_slug_db(update_data['name'], PricingPlan, self.db)
        
        if 'description' in update_data and update_data['description'] is not None:
            plan.description = update_data['description']
        if 'price' in update_data and update_data['price'] is not None:
            plan.price = Decimal(str(update_data['price']))
        if 'currency' in update_data and update_data['currency'] is not None:
            plan.currency = update_data['currency']
        if 'billing_cycle' in update_data and update_data['billing_cycle'] is not None:
            try:
                billing_cycle_enum = BillingCycle(update_data['billing_cycle'].upper())
                plan.billing_cycle = billing_cycle_enum
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid billing cycle. Must be one of: {[c.value for c in BillingCycle]}"
                )
        if 'features' in update_data and update_data['features'] is not None:
            plan.features = update_data['features']
        if 'is_popular' in update_data and update_data['is_popular'] is not None:
            plan.is_popular = update_data['is_popular']
        if 'is_active' in update_data and update_data['is_active'] is not None:
            plan.is_active = update_data['is_active']
        if 'order' in update_data and update_data['order'] is not None:
            plan.order = update_data['order']
        
        await self.db.commit()
        await self.db.refresh(plan)
        return plan
    
    async def delete_pricing_plan(self, plan_id: str) -> None:
        """Delete pricing plan (admin only)."""
        plan = await self.get_pricing_plan_by_id_admin(plan_id)
        await self.db.delete(plan)
        await self.db.commit()
    
    async def toggle_pricing_plan_status(self, plan_id: str) -> PricingPlan:
        """Toggle pricing plan active status (admin only)."""
        plan = await self.get_pricing_plan_by_id_admin(plan_id)
        plan.is_active = not plan.is_active
        
        await self.db.commit()
        await self.db.refresh(plan)
        return plan
    
    async def get_pricing_plan_by_id_admin(self, plan_id: str) -> PricingPlan:
        """Get pricing plan by ID (admin endpoint)."""
        result = await self.db.execute(
            select(PricingPlan).where(PricingPlan.id == plan_id)
        )
        plan = result.scalar_one_or_none()
        
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pricing plan not found"
            )
        
        return plan
