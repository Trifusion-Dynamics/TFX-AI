from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any
import secrets
from datetime import datetime, timedelta
import os

from app.db.base import get_db
from app.models.lead import Lead
from app.models.newsletter import Newsletter
from app.schemas.lead import LeadCreate
from app.services.lead_service import LeadService
from app.services.newsletter_service import NewsletterService
from app.core.security import get_optional_user
from app.api.deps import get_current_user_optional

router = APIRouter()

# Simple in-memory cache for download tokens
# In production, use Redis or database
download_tokens: Dict[str, Dict[str, Any]] = {}

# Available resources
RESOURCES = [
    {
        "id": "ai-integration-checklist",
        "title": "AI Integration Checklist for Businesses",
        "description": "The Complete 50-Point Checklist to Add AI to Your Product. From pre-integration assessment to launch monitoring.",
        "pages": 8,
        "format": "PDF",
        "size": "2.4 MB",
        "category": "AI",
        "preview_image": None,
        "bullets": [
            "Pre-integration assessment framework",
            "AI model selection guide (GPT-4, Gemini, Claude)",
            "Development checklist with security best practices",
            "Launch & monitoring strategies"
        ]
    },
    {
        "id": "saas-development-roadmap",
        "title": "SaaS Development Roadmap 2025",
        "description": "From Idea to ₹1 Lakh MRR: The Complete Playbook. Technical architecture, MVP development, launch strategy, and growth tactics.",
        "pages": 12,
        "format": "PDF",
        "size": "3.8 MB",
        "category": "SaaS",
        "preview_image": None,
        "bullets": [
            "Problem validation framework",
            "Recommended tech stack (Next.js, FastAPI, PostgreSQL)",
            "MVP development sprint planning",
            "Launch strategy for Indian SaaS market"
        ]
    },
    {
        "id": "web-performance-guide",
        "title": "Web Performance Optimization Guide",
        "description": "Make Your Website Load in Under 2 Seconds. Core Web Vitals, image optimization, code splitting, and measurement tools.",
        "pages": 10,
        "format": "PDF",
        "size": "2.1 MB",
        "category": "Performance",
        "preview_image": None,
        "bullets": [
            "Core Web Vitals explained",
            "Image optimization techniques",
            "Next.js performance best practices",
            "Measurement tools and quick wins checklist"
        ]
    }
]

@router.get("/list")
async def list_resources():
    """Get list of available resources"""
    return {
        "success": True,
        "data": RESOURCES
    }

@router.post("/download-request")
async def request_download(
    request_data: Dict[str, Any],
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    """Request download link for a resource"""
    try:
        name = request_data.get("name", "").strip()
        email = request_data.get("email", "").strip()
        resource_id = request_data.get("resource_id", "").strip()
        source_page = request_data.get("source_page", "")
        
        # Validation
        if not name or not email or not resource_id:
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        if "@" not in email:
            raise HTTPException(status_code=400, detail="Invalid email address")
        
        # Check if resource exists
        resource = next((r for r in RESOURCES if r["id"] == resource_id), None)
        if not resource:
            raise HTTPException(status_code=404, detail="Resource not found")
        
        # Handle newsletter subscription
        newsletter_service = NewsletterService(db)
        newsletter_subscriber = await newsletter_service.get_by_email(email)
        
        if not newsletter_subscriber:
            # Create new newsletter subscriber
            newsletter_data = {
                "email": email,
                "is_active": True,
                "source": "lead_magnet"
            }
            await newsletter_service.create(newsletter_data)
        else:
            # Update existing subscriber (mark as active if needed)
            if not newsletter_subscriber.is_active:
                await newsletter_service.update(newsletter_subscriber.id, {"is_active": True})
        
        # Create lead
        lead_service = LeadService(db)
        lead_data = LeadCreate(
            name=name,
            email=email,
            phone="",
            subject=f"Resource Download - {resource['title']}",
            message=f"Downloaded: {resource['title']} (ID: {resource_id}) from {source_page}",
            source="lead_magnet",
            status="new"
        )
        await lead_service.create(lead_data.model_dump())
        
        # Generate download token
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=24)
        
        download_tokens[token] = {
            "resource_id": resource_id,
            "email": email,
            "expires_at": expires_at,
            "used": False
        }
        
        # Send email with download link (simplified for now)
        # In production, use proper email service
        download_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/api/v1/resources/download/{resource_id}?token={token}"
        
        print(f"Email would be sent to {email} with download URL: {download_url}")
        
        return {
            "success": True,
            "message": "Check your email for the download link!",
            "data": {
                "resource_title": resource["title"],
                "download_url": download_url  # Only for development/testing
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{resource_id}")
async def download_resource(resource_id: str, token: str, db: AsyncSession = Depends(get_db)):
    """Download resource using token"""
    try:
        # Validate token
        if token not in download_tokens:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        token_data = download_tokens[token]
        
        # Check if expired
        if datetime.utcnow() > token_data["expires_at"]:
            del download_tokens[token]
            raise HTTPException(status_code=401, detail="Token expired")
        
        # Check if already used
        if token_data["used"]:
            raise HTTPException(status_code=401, detail="Download link already used")
        
        # Check resource exists
        resource = next((r for r in RESOURCES if r["id"] == resource_id), None)
        if not resource:
            raise HTTPException(status_code=404, detail="Resource not found")
        
        # Check if resource matches token
        if token_data["resource_id"] != resource_id:
            raise HTTPException(status_code=401, detail="Token resource mismatch")
        
        # Mark token as used
        download_tokens[token]["used"] = True
        
        # Get file path
        file_path = f"app/static/resources/{resource_id}.pdf"
        full_path = os.path.join(os.getcwd(), file_path)
        
        if not os.path.exists(full_path):
            raise HTTPException(status_code=404, detail="Resource file not found")
        
        # Log download (simplified - in production use proper logging)
        print(f"Download logged: {resource_id} for {token_data['email']}")
        
        # Return file
        return FileResponse(
            path=full_path,
            filename=f"{resource['title']}.pdf",
            media_type="application/pdf"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/token-status/{token}")
async def check_token_status(token: str):
    """Check if a download token is valid"""
    if token not in download_tokens:
        return {"valid": False, "reason": "Token not found"}
    
    token_data = download_tokens[token]
    
    if datetime.utcnow() > token_data["expires_at"]:
        return {"valid": False, "reason": "Token expired"}
    
    if token_data["used"]:
        return {"valid": False, "reason": "Token already used"}
    
    return {
        "valid": True,
        "resource_id": token_data["resource_id"],
        "expires_at": token_data["expires_at"].isoformat()
    }
