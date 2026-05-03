"""
Blog service.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, and_, or_, func, desc, update
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from typing import Optional, List, Tuple
import logging

from app.models.blog import BlogPost
from app.models.user import User
from app.schemas.blog import BlogCreateRequest, BlogUpdateRequest
from app.utils.slug import generate_unique_slug_db

logger = logging.getLogger(__name__)


class BlogService:
    """Blog service."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def list_published_blogs(
        self,
        page: int = 1,
        limit: int = 10,
        category: Optional[str] = None,
        tag: Optional[str] = None,
        search: Optional[str] = None
    ) -> Tuple[List[BlogPost], int]:
        """List published blogs with filters and pagination."""
        query = select(BlogPost).options(selectinload(BlogPost.author)).where(BlogPost.is_published == True)
        
        # Apply filters
        conditions = []
        if category:
            conditions.append(BlogPost.category.ilike(f"%{category}%"))
        
        if tag:
            conditions.append(BlogPost.tags.any(tag))
        
        if search:
            conditions.append(
                or_(
                    BlogPost.title.ilike(f"%{search}%"),
                    BlogPost.content.ilike(f"%{search}%"),
                    BlogPost.excerpt.ilike(f"%{search}%")
                )
            )
        
        if conditions:
            query = query.where(and_(*conditions))
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Apply pagination and ordering
        query = query.order_by(BlogPost.is_featured.desc(), BlogPost.created_at.desc())
        query = query.offset((page - 1) * limit).limit(limit)
        
        result = await self.db.execute(query)
        blogs = result.scalars().all()
        
        return list(blogs), total
    
    async def list_featured_blogs(self, limit: int = 3) -> List[BlogPost]:
        """List featured blogs."""
        result = await self.db.execute(
            select(BlogPost).options(selectinload(BlogPost.author))
            .where(
                and_(BlogPost.is_published == True, BlogPost.is_featured == True)
            )
            .order_by(BlogPost.created_at.desc())
            .limit(limit)
        )
        blogs = result.scalars().all()
        return list(blogs)
    
    async def get_distinct_categories(self) -> List[str]:
        """Get distinct categories list."""
        result = await self.db.execute(
            select(BlogPost.category)
            .where(
                and_(BlogPost.category.isnot(None), BlogPost.is_published == True)
            )
            .distinct()
        )
        categories = [row[0] for row in result if row[0]]
        return categories
    
    async def get_distinct_tags(self) -> List[str]:
        """Get distinct tags list."""
        result = await self.db.execute(
            select(BlogPost)
            .where(BlogPost.is_published == True)
        )
        blogs = result.scalars().all()
        
        # Collect all tags and get unique ones
        all_tags = []
        for blog in blogs:
            all_tags.extend(blog.tags)
        
        return list(set(all_tags))
    
    async def get_blog_by_slug(self, slug: str) -> BlogPost:
        """Get blog by slug and increment views."""
        result = await self.db.execute(
            select(BlogPost).options(selectinload(BlogPost.author))
            .where(
                and_(BlogPost.slug == slug, BlogPost.is_published == True)
            )
        )
        blog = result.scalar_one_or_none()
        
        if not blog:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Blog post not found"
            )
        
        # Increment views
        await self.db.execute(
            update(BlogPost).where(BlogPost.id == blog.id).values(views=BlogPost.views + 1)
        )
        await self.db.commit()
        
        # Refresh to get updated view count
        await self.db.refresh(blog)
        
        return blog
    
    async def create_blog(self, blog_data: BlogCreateRequest, author_id: str) -> BlogPost:
        """Create new blog post (admin only)."""
        # Generate unique slug
        slug = await generate_unique_slug_db(blog_data.title, BlogPost, self.db)
        
        # Auto-calculate read time if not provided
        read_time = blog_data.read_time
        if read_time is None:
            read_time = len(blog_data.content.split()) // 200
            read_time = max(1, read_time)  # Minimum 1 minute
        
        blog = BlogPost(
            title=blog_data.title,
            slug=slug,
            content=blog_data.content,
            excerpt=blog_data.excerpt,
            tags=blog_data.tags or [],
            category=blog_data.category,
            thumbnail=blog_data.thumbnail,
            read_time=read_time,
            author_id=author_id,
            is_published=False,  # Default to draft
            is_featured=False
        )
        
        self.db.add(blog)
        await self.db.commit()
        await self.db.refresh(blog)
        return blog
    
    async def update_blog(self, blog_id: str, update_data: BlogUpdateRequest) -> BlogPost:
        """Update blog post (admin only)."""
        blog = await self.get_blog_by_id_admin(blog_id)
        
        # Update fields if provided
        if update_data.title is not None:
            blog.title = update_data.title
            # Regenerate slug if title changed
            blog.slug = await generate_unique_slug_db(update_data.title, BlogPost, self.db)
        
        if update_data.content is not None:
            blog.content = update_data.content
            # Auto-calculate read time if content changed and read_time not provided
            if update_data.read_time is None:
                blog.read_time = len(update_data.content.split()) // 200
                blog.read_time = max(1, blog.read_time)
        
        if update_data.excerpt is not None:
            blog.excerpt = update_data.excerpt
        if update_data.tags is not None:
            blog.tags = update_data.tags
        if update_data.category is not None:
            blog.category = update_data.category
        if update_data.thumbnail is not None:
            blog.thumbnail = update_data.thumbnail
        if update_data.read_time is not None:
            blog.read_time = update_data.read_time
        if update_data.is_published is not None:
            blog.is_published = update_data.is_published
        if update_data.is_featured is not None:
            blog.is_featured = update_data.is_featured
        
        await self.db.commit()
        await self.db.refresh(blog)
        return blog
    
    async def delete_blog(self, blog_id: str) -> None:
        """Delete blog post (admin only)."""
        blog = await self.get_blog_by_id_admin(blog_id)
        await self.db.delete(blog)
        await self.db.commit()
    
    async def toggle_blog_publish(self, blog_id: str) -> BlogPost:
        """Toggle blog publish status (admin only)."""
        blog = await self.get_blog_by_id_admin(blog_id)
        blog.is_published = not blog.is_published
        
        await self.db.commit()
        await self.db.refresh(blog)
        return blog
    
    async def toggle_blog_feature(self, blog_id: str) -> BlogPost:
        """Toggle blog featured status (admin only)."""
        blog = await self.get_blog_by_id_admin(blog_id)
        blog.is_featured = not blog.is_featured
        
        await self.db.commit()
        await self.db.refresh(blog)
        return blog
    
    async def get_blog_by_id_admin(self, blog_id: str) -> BlogPost:
        """Get blog by ID (admin endpoint)."""
        result = await self.db.execute(
            select(BlogPost).options(selectinload(BlogPost.author)).where(BlogPost.id == blog_id)
        )
        blog = result.scalar_one_or_none()
        
        if not blog:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Blog post not found"
            )
        
        return blog
