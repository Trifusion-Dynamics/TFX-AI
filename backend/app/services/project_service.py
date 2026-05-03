"""
Project service.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, and_, or_, func, desc
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from typing import Optional, List, Tuple
import logging

from app.models.project import Project, ProjectCategory
from app.schemas.project import ProjectCreateRequest, ProjectUpdateRequest
from app.utils.slug import generate_unique_slug_db

logger = logging.getLogger(__name__)


class ProjectService:
    """Project service."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def list_projects(
        self,
        page: int = 1,
        limit: int = 10,
        category: Optional[str] = None,
        is_featured: Optional[bool] = None,
        search: Optional[str] = None
    ) -> Tuple[List[Project], int]:
        """List projects with filters and pagination."""
        query = select(Project).where(Project.is_published == True)
        
        # Apply filters
        conditions = []
        if category:
            try:
                category_enum = ProjectCategory(category.upper())
                conditions.append(Project.category == category_enum)
            except ValueError:
                pass  # Invalid category, ignore filter
        
        if is_featured is not None:
            conditions.append(Project.is_featured == is_featured)
        
        if search:
            conditions.append(
                or_(
                    Project.title.ilike(f"%{search}%"),
                    Project.description.ilike(f"%{search}%"),
                    Project.short_desc.ilike(f"%{search}%")
                )
            )
        
        if conditions:
            query = query.where(and_(*conditions))
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Apply pagination and ordering
        query = query.order_by(Project.order_index.asc(), Project.created_at.desc())
        query = query.offset((page - 1) * limit).limit(limit)
        
        result = await self.db.execute(query)
        projects = result.scalars().all()
        
        return list(projects), total
    
    async def list_featured_projects(self, limit: int = 6) -> List[Project]:
        """List featured projects."""
        result = await self.db.execute(
            select(Project)
            .where(
                and_(Project.is_published == True, Project.is_featured == True)
            )
            .order_by(Project.order_index.asc(), Project.created_at.desc())
            .limit(limit)
        )
        projects = result.scalars().all()
        return list(projects)
    
    async def get_project_by_slug(self, slug: str) -> Project:
        """Get project by slug (public endpoint)."""
        result = await self.db.execute(
            select(Project).where(
                and_(Project.slug == slug, Project.is_published == True)
            )
        )
        project = result.scalar_one_or_none()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        return project
    
    async def create_project(self, project_data: ProjectCreateRequest) -> Project:
        """Create new project (admin only)."""
        # Generate unique slug
        slug = await generate_unique_slug_db(project_data.title, Project, self.db)
        
        # Parse category
        try:
            category_enum = ProjectCategory(project_data.category.upper())
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid category. Must be one of: {[c.value for c in ProjectCategory]}"
            )
        
        project = Project(
            title=project_data.title,
            slug=slug,
            description=project_data.description,
            short_desc=project_data.short_desc,
            tech_stack=project_data.tech_stack,
            category=category_enum,
            live_url=project_data.live_url,
            github_url=project_data.github_url,
            thumbnail=project_data.thumbnail,
            is_featured=project_data.is_featured if project_data.is_featured is not None else False,
            is_published=True  # Default to published for new projects
        )
        
        self.db.add(project)
        await self.db.commit()
        await self.db.refresh(project)
        return project
    
    async def update_project(self, project_id: str, update_data: ProjectUpdateRequest) -> Project:
        """Update project (admin only)."""
        project = await self.get_project_by_id_admin(project_id)
        
        # Update fields if provided
        if update_data.title is not None:
            project.title = update_data.title
            # Regenerate slug if title changed
            project.slug = await generate_unique_slug_db(update_data.title, Project, self.db)
        
        if update_data.description is not None:
            project.description = update_data.description
        if update_data.short_desc is not None:
            project.short_desc = update_data.short_desc
        if update_data.tech_stack is not None:
            project.tech_stack = update_data.tech_stack
        if update_data.category is not None:
            try:
                category_enum = ProjectCategory(update_data.category.upper())
                project.category = category_enum
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid category. Must be one of: {[c.value for c in ProjectCategory]}"
                )
        if update_data.live_url is not None:
            project.live_url = update_data.live_url
        if update_data.github_url is not None:
            project.github_url = update_data.github_url
        if update_data.thumbnail is not None:
            project.thumbnail = update_data.thumbnail
        if update_data.is_featured is not None:
            project.is_featured = update_data.is_featured
        if update_data.is_published is not None:
            project.is_published = update_data.is_published
        
        await self.db.commit()
        await self.db.refresh(project)
        return project
    
    async def delete_project(self, project_id: str) -> None:
        """Delete project (admin only)."""
        project = await self.get_project_by_id_admin(project_id)
        await self.db.delete(project)
        await self.db.commit()
    
    async def toggle_project_publish(self, project_id: str) -> Project:
        """Toggle project publish status (admin only)."""
        project = await self.get_project_by_id_admin(project_id)
        project.is_published = not project.is_published
        
        await self.db.commit()
        await self.db.refresh(project)
        return project
    
    async def toggle_project_feature(self, project_id: str) -> Project:
        """Toggle project featured status (admin only)."""
        project = await self.get_project_by_id_admin(project_id)
        project.is_featured = not project.is_featured
        
        await self.db.commit()
        await self.db.refresh(project)
        return project
    
    async def get_project_by_id_admin(self, project_id: str) -> Project:
        """Get project by ID (admin endpoint)."""
        result = await self.db.execute(
            select(Project).where(Project.id == project_id)
        )
        project = result.scalar_one_or_none()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        return project
