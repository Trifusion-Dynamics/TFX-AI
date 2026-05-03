"""
Case study routes.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List

from app.core.dependencies import get_db, get_current_admin, get_pagination_params
from app.services.case_study_service import CaseStudyService
from app.schemas.case_study import CaseStudyCreateRequest, CaseStudyResponse
from app.schemas.common import PaginatedResponse, PaginationMeta, SuccessResponse
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()


class CaseStudyUpdateRequest(BaseModel):
    """Case study update request."""
    title: str = None
    client_name: str = None
    industry: str = None
    problem: str = None
    solution: str = None
    result: str = None
    tech_stack: List[str] = None
    metrics: dict = None
    thumbnail: str = None
    order: int = None


def get_case_study_service(db: AsyncSession = Depends(get_db)) -> CaseStudyService:
    """Get case study service instance."""
    return CaseStudyService(db)


# Public routes
@router.get("/", response_model=PaginatedResponse[CaseStudyResponse])
async def list_case_studies(
    pagination: dict = Depends(get_pagination_params),
    industry: Optional[str] = Query(None, description="Filter by industry"),
    is_featured: Optional[bool] = Query(None, description="Filter featured case studies"),
    case_study_service: CaseStudyService = Depends(get_case_study_service)
):
    """List published case studies (filter: industry, is_featured; pagination)."""
    case_studies, total = await case_study_service.list_published_case_studies(
        page=pagination["page"],
        limit=pagination["limit"],
        industry=industry,
        is_featured=is_featured
    )
    
    case_study_responses = [CaseStudyResponse.model_validate(cs) for cs in case_studies]
    total_pages = (total + pagination["limit"] - 1) // pagination["limit"]
    
    return PaginatedResponse(
        data=case_study_responses,
        meta=PaginationMeta(
            total=total,
            page=pagination["page"],
            limit=pagination["limit"],
            total_pages=total_pages
        )
    )


@router.get("/featured", response_model=List[CaseStudyResponse])
async def list_featured_case_studies(
    limit: int = Query(3, ge=1, le=10, description="Number of featured case studies to return"),
    case_study_service: CaseStudyService = Depends(get_case_study_service)
):
    """Featured case studies (limit 3)."""
    case_studies = await case_study_service.list_featured_case_studies(limit)
    return [CaseStudyResponse.model_validate(cs) for cs in case_studies]


@router.get("/industries", response_model=List[str])
async def get_case_study_industries(
    case_study_service: CaseStudyService = Depends(get_case_study_service)
):
    """Distinct industries."""
    return await case_study_service.get_distinct_industries()


@router.get("/{slug}", response_model=CaseStudyResponse)
async def get_case_study_by_slug(
    slug: str,
    case_study_service: CaseStudyService = Depends(get_case_study_service)
):
    """Get case study by slug."""
    case_study = await case_study_service.get_case_study_by_slug(slug)
    return CaseStudyResponse.model_validate(case_study)


# Admin routes
@router.post("/admin/case-studies", response_model=CaseStudyResponse)
async def create_case_study_admin(
    case_study_data: CaseStudyCreateRequest,
    current_user: User = Depends(get_current_admin),
    case_study_service: CaseStudyService = Depends(get_case_study_service)
):
    """Create case study (admin only)."""
    case_study = await case_study_service.create_case_study(case_study_data)
    return CaseStudyResponse.model_validate(case_study)


@router.patch("/admin/case-studies/{case_study_id}", response_model=CaseStudyResponse)
async def update_case_study_admin(
    case_study_id: str,
    update_data: CaseStudyUpdateRequest,
    current_user: User = Depends(get_current_admin),
    case_study_service: CaseStudyService = Depends(get_case_study_service)
):
    """Update case study (admin only)."""
    # Convert Pydantic model to dict, excluding None values
    update_dict = update_data.model_dump(exclude_unset=True)
    case_study = await case_study_service.update_case_study(case_study_id, update_dict)
    return CaseStudyResponse.model_validate(case_study)


@router.delete("/admin/case-studies/{case_study_id}", response_model=SuccessResponse)
async def delete_case_study_admin(
    case_study_id: str,
    current_user: User = Depends(get_current_admin),
    case_study_service: CaseStudyService = Depends(get_case_study_service)
):
    """Delete case study (admin only)."""
    await case_study_service.delete_case_study(case_study_id)
    return SuccessResponse(message="Case study deleted successfully")


@router.patch("/admin/case-studies/{case_study_id}/publish", response_model=CaseStudyResponse)
async def toggle_case_study_publish_admin(
    case_study_id: str,
    current_user: User = Depends(get_current_admin),
    case_study_service: CaseStudyService = Depends(get_case_study_service)
):
    """Toggle case study publish status (admin only)."""
    case_study = await case_study_service.toggle_case_study_publish(case_study_id)
    return CaseStudyResponse.model_validate(case_study)


@router.patch("/admin/case-studies/{case_study_id}/feature", response_model=CaseStudyResponse)
async def toggle_case_study_feature_admin(
    case_study_id: str,
    current_user: User = Depends(get_current_admin),
    case_study_service: CaseStudyService = Depends(get_case_study_service)
):
    """Toggle case study featured status (admin only)."""
    case_study = await case_study_service.toggle_case_study_feature(case_study_id)
    return CaseStudyResponse.model_validate(case_study)
