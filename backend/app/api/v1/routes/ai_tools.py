"""
AI tools routes.
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.dependencies import get_db, get_current_user, get_current_admin, optional_user
from app.services.ai_tools_service import AIToolsService
from app.schemas.ai_tools import (
    ResumeAnalyzerRequest, 
    TextGeneratorRequest, 
    QABotRequest,
    ChatbotRequest,
    TextType,
    TextTone,
    TextLength
)
from app.schemas.common import ApiResponse, SuccessResponse
from app.models.user import User
from app.core.config import settings

router = APIRouter()


def get_ai_tools_service(db: AsyncSession = Depends(get_db)) -> AIToolsService:
    """Get AI tools service instance."""
    return AIToolsService(db)


def get_client_ip(request: Request) -> str:
    """Get client IP address."""
    return request.client.host


@router.post("/resume-analyzer", response_model=ApiResponse)
async def analyze_resume(
    request: Request,
    resume_data: ResumeAnalyzerRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(optional_user)
):
    """Analyze resume using AI."""
    try:
        service = get_ai_tools_service(db)
        client_ip = get_client_ip(request)
        user_id = str(current_user.id) if current_user else None
        
        result = await service.analyze_resume(
            resume_text=resume_data.resume_text,
            user_id=user_id,
            ip_address=client_ip
        )
        
        return ApiResponse(
            success=True,
            message="Resume analyzed successfully",
            data=result
        )
        
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.post("/text-generator", response_model=ApiResponse)
async def generate_text(
    request: Request,
    text_data: TextGeneratorRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(optional_user)
):
    """Generate text using AI."""
    try:
        service = get_ai_tools_service(db)
        client_ip = get_client_ip(request)
        user_id = str(current_user.id) if current_user else None
        
        result = await service.generate_text(
            topic=text_data.topic,
            type=text_data.type.value,
            tone=text_data.tone.value,
            length=text_data.length.value,
            user_id=user_id,
            ip_address=client_ip
        )
        
        return ApiResponse(
            success=True,
            message="Text generated successfully",
            data=result
        )
        
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.post("/qa-bot", response_model=ApiResponse)
async def qa_bot(
    request: Request,
    qa_data: QABotRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(optional_user)
):
    """Get AI-powered answer to questions."""
    try:
        service = get_ai_tools_service(db)
        client_ip = get_client_ip(request)
        user_id = str(current_user.id) if current_user else None
        
        result = await service.qa_bot(
            question=qa_data.question,
            context=qa_data.context,
            user_id=user_id,
            ip_address=client_ip
        )
        
        return ApiResponse(
            success=True,
            message="Question answered successfully",
            data=result
        )
        
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.get("/history", response_model=ApiResponse)
async def get_usage_history(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(optional_user)
):
    """Get AI tool usage history."""
    try:
        service = get_ai_tools_service(db)
        client_ip = get_client_ip(request)
        user_id = str(current_user.id) if current_user else None
        
        history = await service.get_usage_history(
            user_id=user_id,
            ip_address=client_ip
        )
        
        return ApiResponse(
            success=True,
            message="Usage history retrieved successfully",
            data={"history": history}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chatbot", response_model=ApiResponse)
async def chatbot(
    request: Request,
    chat_data: ChatbotRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(optional_user)
):
    """AI chatbot for website visitors."""
    try:
        service = get_ai_tools_service(db)
        client_ip = get_client_ip(request)
        user_id = str(current_user.id) if current_user else None
        
        result = await service.chatbot(
            message=chat_data.message,
            conversation_history=chat_data.conversation_history,
            visitor_name=chat_data.visitor_name,
            page_context=chat_data.page_context,
            user_id=user_id,
            ip_address=client_ip
        )
        
        return ApiResponse(
            success=True,
            message="Chatbot response generated successfully",
            data=result
        )
        
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))


