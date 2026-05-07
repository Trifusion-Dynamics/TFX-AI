"""
Lead service for managing leads.
"""

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func, and_, desc
from uuid import UUID

from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadStatusUpdateRequest
from app.core.exceptions import NotFoundError


class LeadService:
    """Service for lead operations."""

    @staticmethod
    async def create(db: AsyncSession, lead_data: LeadCreate) -> Lead:
        """Create a new lead."""
        lead = Lead(**lead_data.model_dump())
        db.add(lead)
        await db.commit()
        await db.refresh(lead)
        return lead

    @staticmethod
    async def get_by_id(db: AsyncSession, lead_id: UUID) -> Optional[Lead]:
        """Get a lead by ID."""
        result = await db.execute(select(Lead).where(Lead.id == lead_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> Optional[Lead]:
        """Get a lead by email."""
        result = await db.execute(
            select(Lead).where(Lead.email == email).order_by(desc(Lead.created_at))
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_all(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
        source: Optional[str] = None
    ) -> List[Lead]:
        """Get all leads with optional filtering."""
        query = select(Lead)
        
        if status:
            query = query.where(Lead.status == status)
        if source:
            query = query.where(Lead.source == source)
            
        query = query.order_by(desc(Lead.created_at)).offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def update(db: AsyncSession, lead_id: UUID, update_data: dict) -> Lead:
        """Update a lead."""
        lead = await LeadService.get_by_id(db, lead_id)
        if not lead:
            raise NotFoundError("Lead not found")
        
        await db.execute(
            update(Lead).where(Lead.id == lead_id).values(**update_data)
        )
        await db.commit()
        await db.refresh(lead)
        return lead

    @staticmethod
    async def update_status(
        db: AsyncSession, 
        lead_id: UUID, 
        status_update: LeadStatusUpdateRequest
    ) -> Lead:
        """Update lead status."""
        return await LeadService.update(db, lead_id, {"status": status_update.status})

    @staticmethod
    async def delete(db: AsyncSession, lead_id: UUID) -> bool:
        """Delete a lead."""
        lead = await LeadService.get_by_id(db, lead_id)
        if not lead:
            return False
        
        await db.execute(delete(Lead).where(Lead.id == lead_id))
        await db.commit()
        return True

    @staticmethod
    async def get_stats(db: AsyncSession) -> dict:
        """Get lead statistics."""
        # Total leads
        total_result = await db.execute(select(func.count(Lead.id)))
        total = total_result.scalar()
        
        # Leads by status
        status_result = await db.execute(
            select(Lead.status, func.count(Lead.id).label('count'))
            .group_by(Lead.status)
        )
        by_status = {row.status: row.count for row in status_result}
        
        # Last 30 days
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        recent_result = await db.execute(
            select(
                func.date(Lead.created_at).label('date'),
                func.count(Lead.id).label('count')
            )
            .where(Lead.created_at >= thirty_days_ago)
            .group_by(func.date(Lead.created_at))
            .order_by(func.date(Lead.created_at))
        )
        last_30_days = [
            {"date": str(row.date), "count": row.count}
            for row in recent_result
        ]
        
        return {
            "total": total,
            "by_status": by_status,
            "last_30_days": last_30_days
        }

    @staticmethod
    async def search(
        db: AsyncSession,
        query: str,
        skip: int = 0,
        limit: int = 50
    ) -> List[Lead]:
        """Search leads by name, email, or subject."""
        search_pattern = f"%{query}%"
        result = await db.execute(
            select(Lead)
            .where(
                and_(
                    Lead.name.ilike(search_pattern) |
                    Lead.email.ilike(search_pattern) |
                    Lead.subject.ilike(search_pattern)
                )
            )
            .order_by(desc(Lead.created_at))
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()
