"""
Contact routes.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.dependencies import get_db, get_current_user, get_current_admin, get_pagination_params, optional_user
from app.services.contact_service import ContactService
from app.schemas.lead import LeadCreateRequest, LeadResponse, LeadStatusUpdateRequest, LeadStatsResponse
from app.schemas.common import PaginatedResponse, PaginationMeta, SuccessResponse, ApiResponse
from app.models.user import User

router = APIRouter()


def get_contact_service(db: AsyncSession = Depends(get_db)) -> ContactService:
    """Get contact service instance."""
    return ContactService(db)


# Public route
@router.post("/", response_model=ApiResponse[LeadResponse])
async def submit_contact_form(
    lead_data: LeadCreateRequest,
    contact_service: ContactService = Depends(get_contact_service),
    current_user: Optional[User] = Depends(optional_user)
):
    """Submit contact form [optional auth]."""
    user_id = str(current_user.id) if current_user else None
    lead = await contact_service.submit_contact_form(lead_data, user_id)
    
    return ApiResponse(
        message="Contact form submitted successfully",
        data=LeadResponse.model_validate(lead)
    )


# Admin routes
@router.get("/admin/leads", response_model=PaginatedResponse[LeadResponse])
async def list_leads_admin(
    pagination: dict = Depends(get_pagination_params),
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search by name, email, or subject"),
    current_user: User = Depends(get_current_admin),
    contact_service: ContactService = Depends(get_contact_service)
):
    """List leads (admin only)."""
    leads, total = await contact_service.list_leads(
        page=pagination["page"],
        limit=pagination["limit"],
        status_filter=status_filter,
        search=search
    )
    
    lead_responses = [LeadResponse.model_validate(lead) for lead in leads]
    total_pages = (total + pagination["limit"] - 1) // pagination["limit"]
    
    return PaginatedResponse(
        data=lead_responses,
        meta=PaginationMeta(
            total=total,
            page=pagination["page"],
            limit=pagination["limit"],
            total_pages=total_pages
        )
    )


@router.get("/admin/leads/stats", response_model=LeadStatsResponse)
async def get_lead_stats_admin(
    current_user: User = Depends(get_current_admin),
    contact_service: ContactService = Depends(get_contact_service)
):
    """Get lead statistics (admin only)."""
    stats = await contact_service.get_lead_stats()
    return LeadStatsResponse(**stats)


@router.get("/admin/leads/{lead_id}", response_model=LeadResponse)
async def get_lead_by_id_admin(
    lead_id: str,
    current_user: User = Depends(get_current_admin),
    contact_service: ContactService = Depends(get_contact_service)
):
    """Get lead by ID (admin only)."""
    lead = await contact_service.get_lead_by_id(lead_id)
    return LeadResponse.model_validate(lead)


@router.patch("/admin/leads/{lead_id}/status", response_model=LeadResponse)
async def update_lead_status_admin(
    lead_id: str,
    status_data: LeadStatusUpdateRequest,
    current_user: User = Depends(get_current_admin),
    contact_service: ContactService = Depends(get_contact_service)
):
    """Update lead status (admin only)."""
    lead = await contact_service.update_lead_status(lead_id, status_data)
    return LeadResponse.model_validate(lead)


@router.delete("/admin/leads/{lead_id}", response_model=SuccessResponse)
async def delete_lead_admin(
    lead_id: str,
    current_user: User = Depends(get_current_admin),
    contact_service: ContactService = Depends(get_contact_service)
):
    """Delete lead (admin only)."""
    await contact_service.delete_lead(lead_id)
    return SuccessResponse(message="Lead deleted successfully")
