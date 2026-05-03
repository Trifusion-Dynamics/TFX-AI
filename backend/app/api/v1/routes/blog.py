"""
Blog routes.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List

from app.core.dependencies import get_db, get_current_admin, get_pagination_params
from app.services.blog_service import BlogService
from app.schemas.blog import BlogCreateRequest, BlogUpdateRequest, BlogResponse
from app.schemas.common import PaginatedResponse, PaginationMeta, SuccessResponse
from app.models.user import User

router = APIRouter()


def get_blog_service(db: AsyncSession = Depends(get_db)) -> BlogService:
    """Get blog service instance."""
    return BlogService(db)


# Public routes
@router.get("/", response_model=PaginatedResponse[BlogResponse])
async def list_blogs(
    pagination: dict = Depends(get_pagination_params),
    category: Optional[str] = Query(None, description="Filter by category"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    search: Optional[str] = Query(None, description="Search blogs"),
    blog_service: BlogService = Depends(get_blog_service)
):
    """List published blogs (filter: category, tag, search; pagination)."""
    blogs, total = await blog_service.list_published_blogs(
        page=pagination["page"],
        limit=pagination["limit"],
        category=category,
        tag=tag,
        search=search
    )
    
    blog_responses = []
    for blog in blogs:
        response = BlogResponse.model_validate(blog)
        response.author_name = blog.author.name if blog.author else None
        blog_responses.append(response)
    
    total_pages = (total + pagination["limit"] - 1) // pagination["limit"]
    
    return PaginatedResponse(
        data=blog_responses,
        meta=PaginationMeta(
            total=total,
            page=pagination["page"],
            limit=pagination["limit"],
            total_pages=total_pages
        )
    )


@router.get("/featured", response_model=List[BlogResponse])
async def list_featured_blogs(
    limit: int = Query(3, ge=1, le=10, description="Number of featured blogs to return"),
    blog_service: BlogService = Depends(get_blog_service)
):
    """Featured blogs (limit 3)."""
    blogs = await blog_service.list_featured_blogs(limit)
    
    blog_responses = []
    for blog in blogs:
        response = BlogResponse.model_validate(blog)
        response.author_name = blog.author.name if blog.author else None
        blog_responses.append(response)
    
    return blog_responses


@router.get("/categories", response_model=List[str])
async def get_blog_categories(
    blog_service: BlogService = Depends(get_blog_service)
):
    """Distinct categories list."""
    return await blog_service.get_distinct_categories()


@router.get("/tags", response_model=List[str])
async def get_blog_tags(
    blog_service: BlogService = Depends(get_blog_service)
):
    """Distinct tags list."""
    return await blog_service.get_distinct_tags()


@router.get("/{slug}", response_model=BlogResponse)
async def get_blog_by_slug(
    slug: str,
    blog_service: BlogService = Depends(get_blog_service)
):
    """Get blog by slug + increment views by 1."""
    blog = await blog_service.get_blog_by_slug(slug)
    
    response = BlogResponse.model_validate(blog)
    response.author_name = blog.author.name if blog.author else None
    
    return response


# Admin routes
@router.post("/admin/blogs", response_model=BlogResponse)
async def create_blog_admin(
    blog_data: BlogCreateRequest,
    current_user: User = Depends(get_current_admin),
    blog_service: BlogService = Depends(get_blog_service)
):
    """Create blog (author_id = current_user.id)."""
    blog = await blog_service.create_blog(blog_data, str(current_user.id))
    
    response = BlogResponse.model_validate(blog)
    response.author_name = current_user.name
    
    return response


@router.patch("/admin/blogs/{blog_id}", response_model=BlogResponse)
async def update_blog_admin(
    blog_id: str,
    update_data: BlogUpdateRequest,
    current_user: User = Depends(get_current_admin),
    blog_service: BlogService = Depends(get_blog_service)
):
    """Update blog (admin only)."""
    blog = await blog_service.update_blog(blog_id, update_data)
    
    response = BlogResponse.model_validate(blog)
    response.author_name = blog.author.name if blog.author else None
    
    return response


@router.delete("/admin/blogs/{blog_id}", response_model=SuccessResponse)
async def delete_blog_admin(
    blog_id: str,
    current_user: User = Depends(get_current_admin),
    blog_service: BlogService = Depends(get_blog_service)
):
    """Delete blog (admin only)."""
    await blog_service.delete_blog(blog_id)
    return SuccessResponse(message="Blog deleted successfully")


@router.patch("/admin/blogs/{blog_id}/publish", response_model=BlogResponse)
async def toggle_blog_publish_admin(
    blog_id: str,
    current_user: User = Depends(get_current_admin),
    blog_service: BlogService = Depends(get_blog_service)
):
    """Toggle blog publish status (admin only)."""
    blog = await blog_service.toggle_blog_publish(blog_id)
    
    response = BlogResponse.model_validate(blog)
    response.author_name = blog.author.name if blog.author else None
    
    return response


@router.patch("/admin/blogs/{blog_id}/feature", response_model=BlogResponse)
async def toggle_blog_feature_admin(
    blog_id: str,
    current_user: User = Depends(get_current_admin),
    blog_service: BlogService = Depends(get_blog_service)
):
    """Toggle blog featured status (admin only)."""
    blog = await blog_service.toggle_blog_feature(blog_id)
    
    response = BlogResponse.model_validate(blog)
    response.author_name = blog.author.name if blog.author else None
    
    return response
