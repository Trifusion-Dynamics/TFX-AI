"""
Service routes.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.dependencies import get_db, get_current_admin
from app.services.service_service import ServiceService
from app.schemas.service import ServiceCreateRequest, ServiceUpdateRequest, ServiceResponse
from app.schemas.common import SuccessResponse
from app.models.user import User

router = APIRouter()


def get_service_service(db: AsyncSession = Depends(get_db)) -> ServiceService:
    """Get service service instance."""
    return ServiceService(db)


# Public routes
@router.get("/", response_model=List[ServiceResponse])
async def list_services(
    service_service: ServiceService = Depends(get_service_service)
):
    """List active services (sorted by order)."""
    services = await service_service.list_active_services()
    return [ServiceResponse.model_validate(service) for service in services]


@router.get("/{slug}", response_model=ServiceResponse)
async def get_service_by_slug(
    slug: str,
    service_service: ServiceService = Depends(get_service_service)
):
    """Get service by slug."""
    service = await service_service.get_service_by_slug(slug)
    return ServiceResponse.model_validate(service)


# Admin routes
@router.post("/admin/services", response_model=ServiceResponse)
async def create_service_admin(
    service_data: ServiceCreateRequest,
    current_user: User = Depends(get_current_admin),
    service_service: ServiceService = Depends(get_service_service)
):
    """Create service (admin only)."""
    service = await service_service.create_service(service_data)
    return ServiceResponse.model_validate(service)


@router.patch("/admin/services/{service_id}", response_model=ServiceResponse)
async def update_service_admin(
    service_id: str,
    update_data: ServiceUpdateRequest,
    current_user: User = Depends(get_current_admin),
    service_service: ServiceService = Depends(get_service_service)
):
    """Update service (admin only)."""
    service = await service_service.update_service(service_id, update_data)
    return ServiceResponse.model_validate(service)


@router.delete("/admin/services/{service_id}", response_model=SuccessResponse)
async def delete_service_admin(
    service_id: str,
    current_user: User = Depends(get_current_admin),
    service_service: ServiceService = Depends(get_service_service)
):
    """Delete service (admin only)."""
    await service_service.delete_service(service_id)
    return SuccessResponse(message="Service deleted successfully")


@router.patch("/admin/services/{service_id}/toggle", response_model=ServiceResponse)
async def toggle_service_admin(
    service_id: str,
    current_user: User = Depends(get_current_admin),
    service_service: ServiceService = Depends(get_service_service)
):
    """Toggle service active status (admin only)."""
    service = await service_service.toggle_service_status(service_id)
    return ServiceResponse.model_validate(service)
