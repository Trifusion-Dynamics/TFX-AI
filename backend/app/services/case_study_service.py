"""
Case study service.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, and_, or_, func, desc
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from typing import Optional, List, Tuple
import logging

from app.models.case_study import CaseStudy
from app.schemas.case_study import CaseStudyCreateRequest
from app.utils.slug import generate_unique_slug_db

logger = logging.getLogger(__name__)


class CaseStudyService:
    """Case study service."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def list_published_case_studies(
        self,
        page: int = 1,
        limit: int = 10,
        industry: Optional[str] = None,
        is_featured: Optional[bool] = None
    ) -> Tuple[List[CaseStudy], int]:
        """List published case studies with filters and pagination."""
        query = select(CaseStudy).where(CaseStudy.is_published == True)
        
        # Apply filters
        conditions = []
        if industry:
            conditions.append(CaseStudy.industry.ilike(f"%{industry}%"))
        
        if is_featured is not None:
            conditions.append(CaseStudy.is_featured == is_featured)
        
        if conditions:
            query = query.where(and_(*conditions))
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Apply pagination and ordering
        query = query.order_by(CaseStudy.is_featured.desc(), CaseStudy.order.asc(), CaseStudy.created_at.desc())
        query = query.offset((page - 1) * limit).limit(limit)
        
        result = await self.db.execute(query)
        case_studies = result.scalars().all()
        
        return list(case_studies), total
    
    async def list_featured_case_studies(self, limit: int = 3) -> List[CaseStudy]:
        """List featured case studies."""
        result = await self.db.execute(
            select(CaseStudy)
            .where(
                and_(CaseStudy.is_published == True, CaseStudy.is_featured == True)
            )
            .order_by(CaseStudy.order.asc(), CaseStudy.created_at.desc())
            .limit(limit)
        )
        case_studies = result.scalars().all()
        return list(case_studies)
    
    async def get_distinct_industries(self) -> List[str]:
        """Get distinct industries list."""
        result = await self.db.execute(
            select(CaseStudy.industry)
            .where(CaseStudy.is_published == True)
            .distinct()
        )
        industries = [row[0] for row in result if row[0]]
        return industries
    
    async def get_case_study_by_slug(self, slug: str) -> CaseStudy:
        """Get case study by slug (public endpoint)."""
        result = await self.db.execute(
            select(CaseStudy).where(
                and_(CaseStudy.slug == slug, CaseStudy.is_published == True)
            )
        )
        case_study = result.scalar_one_or_none()
        
        if not case_study:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Case study not found"
            )
        
        return case_study
    
    async def create_case_study(self, case_study_data: CaseStudyCreateRequest) -> CaseStudy:
        """Create new case study (admin only)."""
        # Generate unique slug
        slug = await generate_unique_slug_db(case_study_data.title, CaseStudy, self.db)
        
        case_study = CaseStudy(
            title=case_study_data.title,
            slug=slug,
            client_name=case_study_data.client_name,
            industry=case_study_data.industry,
            problem=case_study_data.problem,
            solution=case_study_data.solution,
            result=case_study_data.result,
            tech_stack=case_study_data.tech_stack,
            metrics=case_study_data.metrics,
            thumbnail=case_study_data.thumbnail,
            is_published=True,  # Default to published
            is_featured=False,
            order=0
        )
        
        self.db.add(case_study)
        await self.db.commit()
        await self.db.refresh(case_study)
        return case_study
    
    async def update_case_study(self, case_study_id: str, update_data: dict) -> CaseStudy:
        """Update case study (admin only)."""
        case_study = await self.get_case_study_by_id_admin(case_study_id)
        
        # Update fields if provided
        if 'title' in update_data and update_data['title'] is not None:
            case_study.title = update_data['title']
            # Regenerate slug if title changed
            case_study.slug = await generate_unique_slug_db(update_data['title'], CaseStudy, self.db)
        
        if 'client_name' in update_data and update_data['client_name'] is not None:
            case_study.client_name = update_data['client_name']
        if 'industry' in update_data and update_data['industry'] is not None:
            case_study.industry = update_data['industry']
        if 'problem' in update_data and update_data['problem'] is not None:
            case_study.problem = update_data['problem']
        if 'solution' in update_data and update_data['solution'] is not None:
            case_study.solution = update_data['solution']
        if 'result' in update_data and update_data['result'] is not None:
            case_study.result = update_data['result']
        if 'tech_stack' in update_data and update_data['tech_stack'] is not None:
            case_study.tech_stack = update_data['tech_stack']
        if 'metrics' in update_data and update_data['metrics'] is not None:
            case_study.metrics = update_data['metrics']
        if 'thumbnail' in update_data and update_data['thumbnail'] is not None:
            case_study.thumbnail = update_data['thumbnail']
        if 'is_featured' in update_data and update_data['is_featured'] is not None:
            case_study.is_featured = update_data['is_featured']
        if 'is_published' in update_data and update_data['is_published'] is not None:
            case_study.is_published = update_data['is_published']
        if 'order' in update_data and update_data['order'] is not None:
            case_study.order = update_data['order']
        
        await self.db.commit()
        await self.db.refresh(case_study)
        return case_study
    
    async def delete_case_study(self, case_study_id: str) -> None:
        """Delete case study (admin only)."""
        case_study = await self.get_case_study_by_id_admin(case_study_id)
        await self.db.delete(case_study)
        await self.db.commit()
    
    async def toggle_case_study_publish(self, case_study_id: str) -> CaseStudy:
        """Toggle case study publish status (admin only)."""
        case_study = await self.get_case_study_by_id_admin(case_study_id)
        case_study.is_published = not case_study.is_published
        
        await self.db.commit()
        await self.db.refresh(case_study)
        return case_study
    
    async def toggle_case_study_feature(self, case_study_id: str) -> CaseStudy:
        """Toggle case study featured status (admin only)."""
        case_study = await self.get_case_study_by_id_admin(case_study_id)
        case_study.is_featured = not case_study.is_featured
        
        await self.db.commit()
        await self.db.refresh(case_study)
        return case_study
    
    async def get_case_study_by_id_admin(self, case_study_id: str) -> CaseStudy:
        """Get case study by ID (admin endpoint)."""
        result = await self.db.execute(
            select(CaseStudy).where(CaseStudy.id == case_study_id)
        )
        case_study = result.scalar_one_or_none()
        
        if not case_study:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Case study not found"
            )
        
        return case_study
