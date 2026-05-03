"""
Service service.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, and_, func
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from typing import Optional, List
import logging

from app.models.service import Service
from app.schemas.service import ServiceCreateRequest, ServiceUpdateRequest
from app.utils.slug import generate_unique_slug_db

logger = logging.getLogger(__name__)


class ServiceService:
    """Service service."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def list_active_services(self) -> List[Service]:
        """List active services sorted by order."""
        result = await self.db.execute(
            select(Service)
            .where(Service.is_active == True)
            .order_by(Service.order.asc(), Service.title.asc())
        )
        services = result.scalars().all()
        return list(services)
    
    async def get_service_by_slug(self, slug: str) -> Service:
        """Get service by slug (public endpoint)."""
        result = await self.db.execute(
            select(Service).where(
                and_(Service.slug == slug, Service.is_active == True)
            )
        )
        service = result.scalar_one_or_none()
        
        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service not found"
            )
        
        return service
    
    async def create_service(self, service_data: ServiceCreateRequest) -> Service:
        """Create new service (admin only)."""
        # Generate unique slug
        slug = await generate_unique_slug_db(service_data.title, Service, self.db)
        
        service = Service(
            title=service_data.title,
            slug=slug,
            description=service_data.description,
            short_desc=service_data.short_desc,
            features=service_data.features,
            icon=service_data.icon,
            order=service_data.order or 0,
            is_active=service_data.is_active if service_data.is_active is not None else True
        )
        
        self.db.add(service)
        await self.db.commit()
        await self.db.refresh(service)
        return service
    
    async def update_service(self, service_id: str, update_data: ServiceUpdateRequest) -> Service:
        """Update service (admin only)."""
        service = await self.get_service_by_id_admin(service_id)
        
        # Update fields if provided
        if update_data.title is not None:
            service.title = update_data.title
            # Regenerate slug if title changed
            service.slug = await generate_unique_slug_db(update_data.title, Service, self.db)
        
        if update_data.description is not None:
            service.description = update_data.description
        if update_data.short_desc is not None:
            service.short_desc = update_data.short_desc
        if update_data.features is not None:
            service.features = update_data.features
        if update_data.icon is not None:
            service.icon = update_data.icon
        if update_data.order is not None:
            service.order = update_data.order
        if update_data.is_active is not None:
            service.is_active = update_data.is_active
        
        await self.db.commit()
        await self.db.refresh(service)
        return service
    
    async def delete_service(self, service_id: str) -> None:
        """Delete service (admin only)."""
        service = await self.get_service_by_id_admin(service_id)
        await self.db.delete(service)
        await self.db.commit()
    
    async def toggle_service_status(self, service_id: str) -> Service:
        """Toggle service active status (admin only)."""
        service = await self.get_service_by_id_admin(service_id)
        service.is_active = not service.is_active
        
        await self.db.commit()
        await self.db.refresh(service)
        return service
    
    async def get_service_by_id_admin(self, service_id: str) -> Service:
        """Get service by ID (admin endpoint)."""
        result = await self.db.execute(
            select(Service).where(Service.id == service_id)
        )
        service = result.scalar_one_or_none()
        
        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service not found"
            )
        
        return service
