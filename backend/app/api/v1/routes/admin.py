"""
Admin routes.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from sqlalchemy.orm import selectinload
from typing import Dict, Any, List
from datetime import datetime, timedelta
import asyncio

from app.core.dependencies import get_db, get_current_admin
from app.models.user import User
from app.models.lead import Lead, LeadStatus
from app.models.newsletter import Newsletter
from app.models.blog import BlogPost
from app.models.project import Project
from app.models.ai_tool_usage import AIToolUsage
from app.models.site_config import SiteConfig
from app.schemas.common import SuccessResponse, ApiResponse
from app.services.ai_tools_service import AIToolsService
from pydantic import BaseModel

router = APIRouter()


class ConfigUpdateRequest(BaseModel):
    """Config update request."""
    key: str
    value: str


def get_admin_service(db: AsyncSession = Depends(get_db)) -> "AdminService":
    """Get admin service instance."""
    return AdminService(db)


class AdminService:
    """Admin service for dashboard and config management."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_dashboard_stats(self) -> Dict[str, Any]:
        """Get comprehensive dashboard statistics."""
        # Use asyncio.gather for parallel queries
        tasks = [
            self._get_user_stats(),
            self._get_lead_stats(),
            self._get_newsletter_stats(),
            self._get_blog_stats(),
            self._get_project_stats(),
            self._get_ai_tool_stats(),
            self._get_recent_leads(),
            self._get_recent_users(),
            self._get_top_blogs()
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return {
            "users": results[0] if not isinstance(results[0], Exception) else {},
            "leads": results[1] if not isinstance(results[1], Exception) else {},
            "newsletter": results[2] if not isinstance(results[2], Exception) else {},
            "blog": results[3] if not isinstance(results[3], Exception) else {},
            "projects": results[4] if not isinstance(results[4], Exception) else {},
            "ai_tools": results[5] if not isinstance(results[5], Exception) else {},
            "recent_leads": results[6] if not isinstance(results[6], Exception) else [],
            "recent_users": results[7] if not isinstance(results[7], Exception) else [],
            "top_blogs": results[8] if not isinstance(results[8], Exception) else []
        }
    
    async def _get_user_stats(self) -> Dict[str, Any]:
        """Get user statistics."""
        # Total users
        total_query = select(func.count(User.id))
        total_result = await self.db.execute(total_query)
        total = total_result.scalar()
        
        # This month
        this_month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month_query = select(func.count(User.id)).where(User.created_at >= this_month_start)
        this_month_result = await self.db.execute(this_month_query)
        this_month = this_month_result.scalar()
        
        # This week
        this_week_start = datetime.utcnow() - timedelta(days=datetime.utcnow().weekday())
        this_week_start = this_week_start.replace(hour=0, minute=0, second=0, microsecond=0)
        this_week_query = select(func.count(User.id)).where(User.created_at >= this_week_start)
        this_week_result = await self.db.execute(this_week_query)
        this_week = this_week_result.scalar()
        
        return {
            "total": total,
            "this_month": this_month,
            "this_week": this_week
        }
    
    async def _get_lead_stats(self) -> Dict[str, Any]:
        """Get lead statistics."""
        # Total leads
        total_query = select(func.count(Lead.id))
        total_result = await self.db.execute(total_query)
        total = total_result.scalar()
        
        # By status
        status_query = select(
            Lead.status,
            func.count(Lead.id).label('count')
        ).group_by(Lead.status)
        status_result = await self.db.execute(status_query)
        by_status = {row.status.value: row.count for row in status_result}
        
        # This month
        this_month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month_query = select(func.count(Lead.id)).where(Lead.created_at >= this_month_start)
        this_month_result = await self.db.execute(this_month_query)
        this_month = this_month_result.scalar()
        
        return {
            "total": total,
            "new": by_status.get("NEW", 0),
            "in_progress": by_status.get("IN_PROGRESS", 0),
            "resolved": by_status.get("RESOLVED", 0),
            "closed": by_status.get("CLOSED", 0),
            "this_month": this_month
        }
    
    async def _get_newsletter_stats(self) -> Dict[str, Any]:
        """Get newsletter statistics."""
        # Total subscribers
        total_query = select(func.count(Newsletter.id))
        total_result = await self.db.execute(total_query)
        total = total_result.scalar()
        
        # Active subscribers
        active_query = select(func.count(Newsletter.id)).where(Newsletter.is_active == True)
        active_result = await self.db.execute(active_query)
        active = active_result.scalar()
        
        return {
            "total": total,
            "active": active
        }
    
    async def _get_blog_stats(self) -> Dict[str, Any]:
        """Get blog statistics."""
        # Total blogs
        total_query = select(func.count(BlogPost.id))
        total_result = await self.db.execute(total_query)
        total = total_result.scalar()
        
        # Published blogs
        published_query = select(func.count(BlogPost.id)).where(BlogPost.is_published == True)
        published_result = await self.db.execute(published_query)
        published = published_result.scalar()
        
        # Draft blogs
        draft_query = select(func.count(BlogPost.id)).where(BlogPost.is_published == False)
        draft_result = await self.db.execute(draft_query)
        draft = draft_result.scalar()
        
        # Total views
        views_query = select(func.sum(BlogPost.views)).where(BlogPost.is_published == True)
        views_result = await self.db.execute(views_query)
        total_views = views_result.scalar() or 0
        
        return {
            "total": total,
            "published": published,
            "draft": draft,
            "total_views": total_views
        }
    
    async def _get_project_stats(self) -> Dict[str, Any]:
        """Get project statistics."""
        # Total projects
        total_query = select(func.count(Project.id))
        total_result = await self.db.execute(total_query)
        total = total_result.scalar()
        
        # Published projects
        published_query = select(func.count(Project.id)).where(Project.is_published == True)
        published_result = await self.db.execute(published_query)
        published = published_result.scalar()
        
        return {
            "total": total,
            "published": published
        }
    
    async def _get_ai_tool_stats(self) -> Dict[str, Any]:
        """Get AI tool usage statistics."""
        # Total usage
        total_query = select(func.count(AIToolUsage.id))
        total_result = await self.db.execute(total_query)
        total = total_result.scalar()
        
        # This month
        this_month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month_query = select(func.count(AIToolUsage.id)).where(AIToolUsage.created_at >= this_month_start)
        this_month_result = await self.db.execute(this_month_query)
        this_month = this_month_result.scalar()
        
        return {
            "total_usage": total,
            "this_month": this_month
        }
    
    async def _get_recent_leads(self) -> List[Dict[str, Any]]:
        """Get recent 5 leads."""
        result = await self.db.execute(
            select(Lead)
            .order_by(desc(Lead.created_at))
            .limit(5)
        )
        leads = result.scalars().all()
        
        return [
            {
                "id": str(lead.id),
                "name": lead.name,
                "email": lead.email,
                "subject": lead.subject,
                "status": lead.status.value,
                "created_at": lead.created_at.isoformat()
            }
            for lead in leads
        ]
    
    async def _get_recent_users(self) -> List[Dict[str, Any]]:
        """Get recent 5 users."""
        result = await self.db.execute(
            select(User)
            .order_by(desc(User.created_at))
            .limit(5)
        )
        users = result.scalars().all()
        
        return [
            {
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "role": user.role.value,
                "is_verified": user.is_verified,
                "created_at": user.created_at.isoformat()
            }
            for user in users
        ]
    
    async def _get_top_blogs(self) -> List[Dict[str, Any]]:
        """Get top 3 blogs by views."""
        result = await self.db.execute(
            select(BlogPost)
            .where(BlogPost.is_published == True)
            .order_by(desc(BlogPost.views))
            .limit(3)
        )
        blogs = result.scalars().all()
        
        return [
            {
                "id": str(blog.id),
                "title": blog.title,
                "slug": blog.slug,
                "views": blog.views,
                "created_at": blog.created_at.isoformat()
            }
            for blog in blogs
        ]
    
    async def get_all_configs(self) -> Dict[str, str]:
        """Get all site configs as dict."""
        result = await self.db.execute(select(SiteConfig))
        configs = result.scalars().all()
        
        return {config.key: config.value for config in configs}
    
    async def upsert_config(self, key: str, value: str) -> SiteConfig:
        """Upsert site config."""
        # Check if config exists
        result = await self.db.execute(select(SiteConfig).where(SiteConfig.key == key))
        config = result.scalar_one_or_none()
        
        if config:
            config.value = value
        else:
            config = SiteConfig(key=key, value=value)
            self.db.add(config)
        
        await self.db.commit()
        await self.db.refresh(config)
        return config
    
    async def delete_config(self, key: str) -> None:
        """Delete site config."""
        result = await self.db.execute(select(SiteConfig).where(SiteConfig.key == key))
        config = result.scalar_one_or_none()
        
        if config:
            await self.db.delete(config)
            await self.db.commit()


# Site Config routes
@router.get("/config", response_model=dict)
async def get_all_configs(
    admin_service: AdminService = Depends(get_admin_service),
    current_user: User = Depends(get_current_admin)
):
    """Get all configs as dict {key: value}."""
    return await admin_service.get_all_configs()


@router.patch("/config", response_model=dict)
async def upsert_config(
    config_data: ConfigUpdateRequest,
    admin_service: AdminService = Depends(get_admin_service),
    current_user: User = Depends(get_current_admin)
):
    """Upsert config { key, value }."""
    config = await admin_service.upsert_config(config_data.key, config_data.value)
    return {config.key: config.value}


@router.delete("/config/{key}", response_model=SuccessResponse)
async def delete_config(
    key: str,
    admin_service: AdminService = Depends(get_admin_service),
    current_user: User = Depends(get_current_admin)
):
    """Delete config key."""
    await admin_service.delete_config(key)
    return SuccessResponse(message="Config deleted successfully")


# AI Tools stats route
@router.get("/ai-tools/stats", response_model=ApiResponse)
async def get_ai_tools_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get AI tools usage statistics (Admin only)."""
    try:
        service = AIToolsService(db)
        stats = await service.get_usage_stats()
        
        return ApiResponse(
            success=True,
            message="AI tools statistics retrieved successfully",
            data=stats
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Dashboard route
@router.get("/stats", response_model=ApiResponse)
async def get_dashboard_stats(
    admin_service: AdminService = Depends(get_admin_service),
    current_user: User = Depends(get_current_admin)
):
    """Get dashboard statistics."""
    stats = await admin_service.get_dashboard_stats()
    return ApiResponse(
        success=True,
        message="Dashboard statistics retrieved successfully",
        data=stats
    )
