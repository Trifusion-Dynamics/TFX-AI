"""
AI tools service.
"""

import json
import re
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
import google.generativeai as genai
import logging

from app.core.config import settings
from app.models.ai_tool_usage import AIToolUsage
from app.models.user import User

logger = logging.getLogger(__name__)


class AIToolsService:
    """AI tools service."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
    
    async def _log_usage(
        self, 
        tool_name: str, 
        input_data: Dict[str, Any], 
        output_data: Dict[str, Any],
        user_id: Optional[str] = None,
        ip_address: Optional[str] = None
    ):
        """Log AI tool usage."""
        try:
            usage = AIToolUsage(
                tool_name=tool_name,
                input_data=input_data,
                output_data=output_data,
                user_id=user_id,
                ip_address=ip_address
            )
            self.db.add(usage)
            await self.db.commit()
        except Exception as e:
            logger.error(f"Failed to log usage: {e}")
            await self.db.rollback()
    
    async def analyze_resume(
        self, 
        resume_text: str,
        user_id: Optional[str] = None,
        ip_address: Optional[str] = None
    ) -> Dict[str, Any]:
        """Analyze resume using Gemini AI."""
        try:
            model = genai.GenerativeModel('gemini-pro')
            
            prompt = f"""
You are an expert ATS resume analyzer. Analyze the following resume 
and respond ONLY with a valid JSON object (no markdown, no explanation):
{{
  "overall_score": <0-100>,
  "ats_score": <0-100>,
  "sections": {{
    "contact": {{ "score": <0-20>, "feedback": "<string>" }},
    "summary": {{ "score": <0-20>, "feedback": "<string>" }},
    "experience": {{ "score": <0-25>, "feedback": "<string>" }},
    "skills": {{ "score": <0-20>, "feedback": "<string>" }},
    "education": {{ "score": <0-15>, "feedback": "<string>" }}
  }},
  "strengths": ["<string>"],
  "improvements": ["<string>"],
  "keywords": {{ "found": ["<string>"], "missing": ["<string>"] }},
  "final_verdict": "<string>"
}}
Resume: {resume_text}
"""
            
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Clean up response and parse JSON
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            result = json.loads(response_text)
            
            # Log usage
            await self._log_usage(
                tool_name="resume_analyzer",
                input_data={"resume_text_length": len(resume_text)},
                output_data=result,
                user_id=user_id,
                ip_address=ip_address
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Resume analysis error: {e}")
            raise Exception("Failed to analyze resume. Please try again.")
    
    async def generate_text(
        self,
        topic: str,
        type: str,
        tone: str,
        length: str,
        user_id: Optional[str] = None,
        ip_address: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate text using Gemini AI."""
        try:
            model = genai.GenerativeModel('gemini-pro')
            
            length_map = {
                "short": "50-100 words",
                "medium": "150-250 words", 
                "long": "350-500 words"
            }
            
            prompt = f"""
Write a {type.replace('_',' ')} about "{topic}".
Tone: {tone}. Length: {length_map[length]}.
Return ONLY the generated text, no explanation.
"""
            
            response = model.generate_content(prompt)
            generated_text = response.text.strip()
            word_count = len(generated_text.split())
            
            result = {
                "generated_text": generated_text,
                "word_count": word_count,
                "type": type,
                "tone": tone
            }
            
            # Log usage
            await self._log_usage(
                tool_name="text_generator",
                input_data={"topic": topic, "type": type, "tone": tone, "length": length},
                output_data=result,
                user_id=user_id,
                ip_address=ip_address
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Text generation error: {e}")
            raise Exception("Failed to generate text. Please try again.")
    
    async def qa_bot(
        self,
        question: str,
        context: Optional[str] = None,
        user_id: Optional[str] = None,
        ip_address: Optional[str] = None
    ) -> Dict[str, Any]:
        """QA bot using Gemini AI."""
        try:
            model = genai.GenerativeModel('gemini-pro')
            
            system_context = """
You are TFX AI's helpful assistant. TFX AI is an AI + Web Development 
agency offering: Web Development, AI Chatbot Development, SaaS Development, 
UI/UX Design, API Development. Be concise, helpful, and professional.
"""
            
            if context:
                system_context += f"\nAdditional context: {context}"
            
            full_prompt = f"{system_context}\n\nUser question: {question}"
            
            response = model.generate_content(full_prompt)
            answer = response.text.strip()
            
            # Assess confidence based on response
            confidence = "high"
            if len(answer) < 50:
                confidence = "low"
            elif len(answer) < 150:
                confidence = "medium"
            
            result = {
                "answer": answer,
                "confidence": confidence
            }
            
            # Log usage
            await self._log_usage(
                tool_name="qa_bot",
                input_data={"question": question, "context": context},
                output_data=result,
                user_id=user_id,
                ip_address=ip_address
            )
            
            return result
            
        except Exception as e:
            logger.error(f"QA bot error: {e}")
            raise Exception("Failed to process question. Please try again.")
    
    async def get_usage_history(
        self,
        user_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """Get AI tool usage history."""
        try:
            query = select(AIToolUsage).order_by(desc(AIToolUsage.created_at))
            
            if user_id:
                query = query.where(AIToolUsage.user_id == user_id)
                limit = 20
            elif ip_address:
                query = query.where(AIToolUsage.ip_address == ip_address)
                limit = 5
            
            query = query.limit(limit)
            
            result = await self.db.execute(query)
            usages = result.scalars().all()
            
            return [
                {
                    "id": str(usage.id),
                    "tool_name": usage.tool_name,
                    "input_data": usage.input_data,
                    "output_data": usage.output_data,
                    "created_at": usage.created_at.isoformat()
                }
                for usage in usages
            ]
            
        except Exception as e:
            logger.error(f"Failed to get usage history: {e}")
            return []
    
    async def get_usage_stats(self) -> Dict[str, Any]:
        """Get AI tools usage statistics for admin."""
        try:
            # Get total usage count
            total_query = select(AIToolUsage)
            total_result = await self.db.execute(total_query)
            total_usage = len(total_result.scalars().all())
            
            # Get usage by tool
            tool_stats = {}
            for tool in ["resume_analyzer", "text_generator", "qa_bot"]:
                tool_query = select(AIToolUsage).where(AIToolUsage.tool_name == tool)
                tool_result = await self.db.execute(tool_query)
                tool_stats[tool] = len(tool_result.scalars().all())
            
            # For now, return basic stats (last_30_days would require date filtering)
            result = {
                "total_usage": total_usage,
                "by_tool": tool_stats,
                "last_30_days": []  # TODO: Implement date-based filtering
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Failed to get usage stats: {e}")
            return {"total_usage": 0, "by_tool": {}, "last_30_days": []}
