"""
Newsletter service.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, and_, func, desc
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import logging
import asyncio

from app.models.newsletter import Newsletter
from app.schemas.newsletter import NewsletterSubscribeRequest, NewsletterUnsubscribeRequest
from app.core.email import send_email

logger = logging.getLogger(__name__)


class NewsletterService:
    """Newsletter service."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def subscribe_newsletter(self, email: str, user_id: Optional[str] = None) -> Newsletter:
        """Subscribe to newsletter."""
        # Check if email already exists
        result = await self.db.execute(
            select(Newsletter).where(Newsletter.email == email)
        )
        existing = result.scalar_one_or_none()
        
        if existing:
            if existing.is_active:
                # Already subscribed and active
                return existing
            else:
                # Reactivate inactive subscription
                existing.is_active = True
                existing.user_id = user_id
                await self.db.commit()
                await self.db.refresh(existing)
                
                # Send welcome email asynchronously
                try:
                    await self._send_welcome_email(email)
                except Exception as e:
                    logger.error(f"Failed to send welcome email: {e}")
                
                return existing
        else:
            # Create new subscription
            newsletter = Newsletter(
                email=email,
                user_id=user_id,
                is_active=True
            )
            
            self.db.add(newsletter)
            await self.db.commit()
            await self.db.refresh(newsletter)
            
            # Send welcome email asynchronously
            try:
                await self._send_welcome_email(email)
            except Exception as e:
                logger.error(f"Failed to send welcome email: {e}")
            
            return newsletter
    
    async def _send_welcome_email(self, email: str) -> None:
        """Send welcome email to subscriber."""
        subject = "Welcome to TFX AI Newsletter!"
        html_content = f"""
        <h2>Welcome to TFX AI Newsletter!</h2>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You'll now receive the latest updates, insights, and news from TFX AI.</p>
        <p>Stay tuned for exciting content about AI, technology, and innovation.</p>
        <br>
        <p>Best regards,<br>TFX AI Team</p>
        <p><small>If you didn't subscribe to this newsletter, please ignore this email.</small></p>
        """
        
        await send_email(email=email, subject=subject, html_content=html_content)
    
    async def unsubscribe_newsletter(self, email: str) -> bool:
        """Unsubscribe from newsletter."""
        result = await self.db.execute(
            select(Newsletter).where(Newsletter.email == email)
        )
        newsletter = result.scalar_one_or_none()
        
        if newsletter:
            newsletter.is_active = False
            await self.db.commit()
            return True
        
        # If not found, consider it successful (email doesn't exist)
        return True
    
    async def list_subscribers(
        self,
        page: int = 1,
        limit: int = 10,
        is_active_filter: Optional[bool] = None
    ) -> tuple[List[Newsletter], int]:
        """List newsletter subscribers with pagination and filters."""
        query = select(Newsletter)
        
        # Apply filters
        if is_active_filter is not None:
            query = query.where(Newsletter.is_active == is_active_filter)
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Apply pagination and ordering
        query = query.order_by(desc(Newsletter.subscribed_at))
        query = query.offset((page - 1) * limit).limit(limit)
        
        result = await self.db.execute(query)
        subscribers = result.scalars().all()
        
        return list(subscribers), total
    
    async def get_newsletter_stats(self) -> Dict[str, Any]:
        """Get newsletter statistics."""
        # Total subscribers
        total_query = select(func.count(Newsletter.id))
        total_result = await self.db.execute(total_query)
        total = total_result.scalar()
        
        # Active subscribers
        active_query = select(func.count(Newsletter.id)).where(Newsletter.is_active == True)
        active_result = await self.db.execute(active_query)
        active = active_result.scalar()
        
        # This month
        this_month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month_query = select(func.count(Newsletter.id)).where(Newsletter.subscribed_at >= this_month_start)
        this_month_result = await self.db.execute(this_month_query)
        this_month = this_month_result.scalar()
        
        return {
            "total": total,
            "active": active,
            "this_month": this_month
        }
    
    async def delete_subscriber(self, subscriber_id: str) -> None:
        """Delete newsletter subscriber."""
        result = await self.db.execute(
            select(Newsletter).where(Newsletter.id == subscriber_id)
        )
        subscriber = result.scalar_one_or_none()
        
        if not subscriber:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscriber not found"
            )
        
        await self.db.delete(subscriber)
        await self.db.commit()
    
    async def broadcast_email(
        self, 
        subject: str, 
        html_content: str
    ) -> Dict[str, int]:
        """Send email to all active subscribers."""
        # Get all active subscribers
        result = await self.db.execute(
            select(Newsletter).where(Newsletter.is_active == True)
        )
        subscribers = result.scalars().all()
        
        if not subscribers:
            return {"sent": 0, "failed": 0}
        
        # Send emails asynchronously
        email_tasks = []
        for subscriber in subscribers:
            email_tasks.append(send_email(subscriber.email, subject, html_content))
        
        # Wait for all emails to be sent
        results = await asyncio.gather(*email_tasks, return_exceptions=True)
        
        # Count successes and failures
        sent = sum(1 for result in results if result is True)
        failed = sum(1 for result in results if result is False or isinstance(result, Exception))
        
        return {"sent": sent, "failed": failed}
