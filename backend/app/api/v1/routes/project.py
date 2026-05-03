"""
Project routes.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List

from app.core.dependencies import get_db, get_current_admin, get_pagination_params
from app.services.project_service import ProjectService
from app.schemas.project import ProjectCreateRequest, ProjectUpdateRequest, ProjectResponse
from app.schemas.common import PaginatedResponse, PaginationMeta, SuccessResponse
from app.models.user import User

router = APIRouter()


def get_project_service(db: AsyncSession = Depends(get_db)) -> ProjectService:
    """Get project service instance."""
    return ProjectService(db)


# Public routes
@router.get("/", response_model=PaginatedResponse[ProjectResponse])
async def list_projects(
    pagination: dict = Depends(get_pagination_params),
    category: Optional[str] = Query(None, description="Filter by category"),
    is_featured: Optional[bool] = Query(None, description="Filter featured projects"),
    search: Optional[str] = Query(None, description="Search projects"),
    project_service: ProjectService = Depends(get_project_service)
):
    """List projects (filter: category, is_featured, search; pagination)."""
    projects, total = await project_service.list_projects(
        page=pagination["page"],
        limit=pagination["limit"],
        category=category,
        is_featured=is_featured,
        search=search
    )
    
    project_responses = [ProjectResponse.model_validate(project) for project in projects]
    total_pages = (total + pagination["limit"] - 1) // pagination["limit"]
    
    return PaginatedResponse(
        data=project_responses,
        meta=PaginationMeta(
            total=total,
            page=pagination["page"],
            limit=pagination["limit"],
            total_pages=total_pages
        )
    )


@router.get("/featured", response_model=List[ProjectResponse])
async def list_featured_projects(
    limit: int = Query(6, ge=1, le=20, description="Number of featured projects to return"),
    project_service: ProjectService = Depends(get_project_service)
):
    """Featured projects (limit 6)."""
    projects = await project_service.list_featured_projects(limit)
    return [ProjectResponse.model_validate(project) for project in projects]


@router.get("/{slug}", response_model=ProjectResponse)
async def get_project_by_slug(
    slug: str,
    project_service: ProjectService = Depends(get_project_service)
):
    """Get project by slug."""
    project = await project_service.get_project_by_slug(slug)
    return ProjectResponse.model_validate(project)


# Admin routes
@router.post("/admin/projects", response_model=ProjectResponse)
async def create_project_admin(
    project_data: ProjectCreateRequest,
    current_user: User = Depends(get_current_admin),
    project_service: ProjectService = Depends(get_project_service)
):
    """Create project (admin only)."""
    project = await project_service.create_project(project_data)
    return ProjectResponse.model_validate(project)


@router.patch("/admin/projects/{project_id}", response_model=ProjectResponse)
async def update_project_admin(
    project_id: str,
    update_data: ProjectUpdateRequest,
    current_user: User = Depends(get_current_admin),
    project_service: ProjectService = Depends(get_project_service)
):
    """Update project (admin only)."""
    project = await project_service.update_project(project_id, update_data)
    return ProjectResponse.model_validate(project)


@router.delete("/admin/projects/{project_id}", response_model=SuccessResponse)
async def delete_project_admin(
    project_id: str,
    current_user: User = Depends(get_current_admin),
    project_service: ProjectService = Depends(get_project_service)
):
    """Delete project (admin only)."""
    await project_service.delete_project(project_id)
    return SuccessResponse(message="Project deleted successfully")


@router.patch("/admin/projects/{project_id}/publish", response_model=ProjectResponse)
async def toggle_project_publish_admin(
    project_id: str,
    current_user: User = Depends(get_current_admin),
    project_service: ProjectService = Depends(get_project_service)
):
    """Toggle project publish status (admin only)."""
    project = await project_service.toggle_project_publish(project_id)
    return ProjectResponse.model_validate(project)


@router.patch("/admin/projects/{project_id}/feature", response_model=ProjectResponse)
async def toggle_project_feature_admin(
    project_id: str,
    current_user: User = Depends(get_current_admin),
    project_service: ProjectService = Depends(get_project_service)
):
    """Toggle project featured status (admin only)."""
    project = await project_service.toggle_project_feature(project_id)
    return ProjectResponse.model_validate(project)
