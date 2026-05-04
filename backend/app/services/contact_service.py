"""
Contact service.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, and_, or_, func, desc
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import logging
import asyncio
from app.core.config import settings

from app.models.lead import Lead, LeadStatus
from app.models.user import User
from app.schemas.lead import LeadCreateRequest, LeadStatusUpdateRequest
from app.core.email import send_email

logger = logging.getLogger(__name__)


class ContactService:
    """Contact service."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def submit_contact_form(
        self, 
        lead_data: LeadCreateRequest, 
        user_id: Optional[str] = None
    ) -> Lead:
        """Submit contact form."""
        # Create lead
        lead = Lead(
            name=lead_data.name,
            email=lead_data.email,
            phone=lead_data.phone,
            subject=lead_data.subject,
            message=lead_data.message,
            user_id=user_id
        )
        
        self.db.add(lead)
        await self.db.commit()
        await self.db.refresh(lead)
        
        # Send emails asynchronously
        try:
            await asyncio.gather(
                self._send_confirmation_email(lead),
                self._send_admin_notification(lead),
                return_exceptions=True
            )
        except Exception as e:
            logger.error(f"Failed to send emails: {e}")
        
        return lead
    
    async def _send_confirmation_email(self, lead: Lead) -> None:
        """Send confirmation email to user."""
        subject = "Thank you for contacting TFX AI"
        html_content = f"""
        <h2>Thank you for contacting us!</h2>
        <p>Dear {lead.name},</p>
        <p>We have received your message and will get back to you shortly.</p>
        <p><strong>Subject:</strong> {lead.subject}</p>
        <p>We appreciate your interest in TFX AI and will respond as soon as possible.</p>
        <br>
        <p>Best regards,<br>TFX AI Team</p>
        """
        
        await send_email(
            to_email=lead.email,
            subject=subject,
            html_content=html_content
        )
    
    async def _send_admin_notification(self, lead: Lead) -> None:
        """Send notification to admin."""
        subject = f"New Contact Form Submission: {lead.subject}"
        html_content = f"""
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {lead.name}</p>
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone or 'Not provided'}</p>
        <p><strong>Subject:</strong> {lead.subject}</p>
        <p><strong>Message:</strong></p>
        <p>{lead.message}</p>
        <p><strong>Submitted:</strong> {lead.created_at.strftime('%Y-%m-%d %H:%M:%S')}</p>
        """
        
        # Send to admin email
        await send_email(
            to_email=settings.admin_email,
            subject=subject,
            html_content=html_content
        )
    
    async def list_leads(
        self,
        page: int = 1,
        limit: int = 10,
        status_filter: Optional[str] = None,
        search: Optional[str] = None
    ) -> tuple[List[Lead], int]:
        """List leads with pagination and filters."""
        query = select(Lead).options(selectinload(Lead.user))
        
        # Apply filters
        conditions = []
        if status_filter:
            try:
                status_enum = LeadStatus(status_filter.upper())
                conditions.append(Lead.status == status_enum)
            except ValueError:
                pass  # Invalid status, ignore filter
        
        if search:
            conditions.append(
                or_(
                    Lead.name.ilike(f"%{search}%"),
                    Lead.email.ilike(f"%{search}%"),
                    Lead.subject.ilike(f"%{search}%")
                )
            )
        
        if conditions:
            query = query.where(and_(*conditions))
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Apply pagination and ordering
        query = query.order_by(desc(Lead.created_at))
        query = query.offset((page - 1) * limit).limit(limit)
        
        result = await self.db.execute(query)
        leads = result.scalars().all()
        
        return list(leads), total
    
    async def get_lead_stats(self) -> Dict[str, Any]:
        """Get lead statistics."""
        # Total counts by status
        status_query = select(
            Lead.status,
            func.count(Lead.id).label('count')
        ).group_by(Lead.status)
        
        status_result = await self.db.execute(status_query)
        by_status = {row.status.value: row.count for row in status_result}
        
        # Total leads
        total_query = select(func.count(Lead.id))
        total_result = await self.db.execute(total_query)
        total = total_result.scalar()
        
        # This month
        this_month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month_query = select(func.count(Lead.id)).where(Lead.created_at >= this_month_start)
        this_month_result = await self.db.execute(this_month_query)
        this_month = this_month_result.scalar()
        
        # Last 30 days daily counts
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        daily_query = select(
            func.date(Lead.created_at).label('date'),
            func.count(Lead.id).label('count')
        ).where(
            Lead.created_at >= thirty_days_ago
        ).group_by(func.date(Lead.created_at)).order_by(func.date(Lead.created_at))
        
        daily_result = await self.db.execute(daily_query)
        last_30_days = [
            {"date": str(row.date), "count": row.count}
            for row in daily_result
        ]
        
        return {
            "total": total,
            "new": by_status.get("NEW", 0),
            "in_progress": by_status.get("IN_PROGRESS", 0),
            "resolved": by_status.get("RESOLVED", 0),
            "closed": by_status.get("CLOSED", 0),
            "this_month": this_month,
            "last_30_days": last_30_days
        }
    
    async def get_lead_by_id(self, lead_id: str) -> Lead:
        """Get lead by ID."""
        result = await self.db.execute(
            select(Lead).options(selectinload(Lead.user)).where(Lead.id == lead_id)
        )
        lead = result.scalar_one_or_none()
        
        if not lead:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lead not found"
            )
        
        return lead
    
    async def update_lead_status(self, lead_id: str, status_data: LeadStatusUpdateRequest) -> Lead:
        """Update lead status."""
        lead = await self.get_lead_by_id(lead_id)
        
        try:
            status_enum = LeadStatus(status_data.status.upper())
            lead.status = status_enum
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be one of: {[s.value for s in LeadStatus]}"
            )
        
        await self.db.commit()
        await self.db.refresh(lead)
        return lead
    
    async def delete_lead(self, lead_id: str) -> None:
        """Delete lead."""
        lead = await self.get_lead_by_id(lead_id)
        await self.db.delete(lead)
        await self.db.commit()
