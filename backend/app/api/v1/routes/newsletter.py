"""
Newsletter routes.
"""

from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.dependencies import get_db, get_current_admin, get_pagination_params, optional_user
from app.services.newsletter_service import NewsletterService
from app.schemas.newsletter import NewsletterSubscribeRequest, NewsletterUnsubscribeRequest, NewsletterResponse
from app.schemas.common import PaginatedResponse, PaginationMeta, SuccessResponse, ApiResponse
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()


class BroadcastEmailRequest(BaseModel):
    """Broadcast email request."""
    subject: str
    html_content: str


def get_newsletter_service(db: AsyncSession = Depends(get_db)) -> NewsletterService:
    """Get newsletter service instance."""
    return NewsletterService(db)


# Public routes
@router.post("/subscribe", response_model=ApiResponse[NewsletterResponse])
async def subscribe_newsletter(
    subscribe_data: NewsletterSubscribeRequest,
    newsletter_service: NewsletterService = Depends(get_newsletter_service),
    current_user: Optional[User] = Depends(optional_user)
):
    """Subscribe (email)."""
    user_id = str(current_user.id) if current_user else None
    subscriber = await newsletter_service.subscribe_newsletter(subscribe_data.email, user_id)
    
    # Check if already subscribed
    message = "Subscribed successfully"
    if subscriber.is_active and subscriber.subscribed_at:
        # Check if this is a recent subscription (within last minute)
        from datetime import datetime, timedelta
        if datetime.utcnow() - subscriber.subscribed_at < timedelta(minutes=1):
            message = "Subscribed successfully"
        else:
            message = "Already subscribed"
    
    return ApiResponse(
        message=message,
        data=NewsletterResponse.model_validate(subscriber)
    )


@router.delete("/unsubscribe", response_model=SuccessResponse)
async def unsubscribe_newsletter(
    unsubscribe_data: NewsletterUnsubscribeRequest,
    newsletter_service: NewsletterService = Depends(get_newsletter_service)
):
    """Unsubscribe (body: {email})."""
    success = await newsletter_service.unsubscribe_newsletter(unsubscribe_data.email)
    return SuccessResponse(message="Unsubscribed successfully")


# Admin routes
@router.get("/admin/newsletter", response_model=PaginatedResponse[NewsletterResponse])
async def list_subscribers_admin(
    pagination: dict = Depends(get_pagination_params),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    current_user: User = Depends(get_current_admin),
    newsletter_service: NewsletterService = Depends(get_newsletter_service)
):
    """List subscribers (filter: is_active; pagination)."""
    subscribers, total = await newsletter_service.list_subscribers(
        page=pagination["page"],
        limit=pagination["limit"],
        is_active_filter=is_active
    )
    
    subscriber_responses = [NewsletterResponse.model_validate(sub) for sub in subscribers]
    total_pages = (total + pagination["limit"] - 1) // pagination["limit"]
    
    return PaginatedResponse(
        data=subscriber_responses,
        meta=PaginationMeta(
            total=total,
            page=pagination["page"],
            limit=pagination["limit"],
            total_pages=total_pages
        )
    )


@router.get("/admin/newsletter/stats", response_model=dict)
async def get_newsletter_stats_admin(
    current_user: User = Depends(get_current_admin),
    newsletter_service: NewsletterService = Depends(get_newsletter_service)
):
    """Get newsletter stats: { total, active, this_month }."""
    return await newsletter_service.get_newsletter_stats()


@router.delete("/admin/newsletter/{subscriber_id}", response_model=SuccessResponse)
async def delete_subscriber_admin(
    subscriber_id: str,
    current_user: User = Depends(get_current_admin),
    newsletter_service: NewsletterService = Depends(get_newsletter_service)
):
    """Delete subscriber."""
    await newsletter_service.delete_subscriber(subscriber_id)
    return SuccessResponse(message="Subscriber deleted successfully")


@router.post("/admin/newsletter/broadcast", response_model=dict)
async def broadcast_email_admin(
    broadcast_data: BroadcastEmailRequest,
    current_user: User = Depends(get_current_admin),
    newsletter_service: NewsletterService = Depends(get_newsletter_service)
):
    """Send email to all active subscribers."""
    result = await newsletter_service.broadcast_email(
        subject=broadcast_data.subject,
        html_content=broadcast_data.html_content
    )
    return result
