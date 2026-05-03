"""
Google Gemini AI utility functions.
"""

import google.generativeai as genai
import asyncio
from app.core.config import settings
from app.core.exceptions import AppException
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

# Configure Gemini with API key on import
if settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
else:
    logger.warning("Gemini API key not configured. AI service will be disabled.")
    model = None


class GeminiService:
    """
    Google Gemini AI service.
    """
    
    def __init__(self):
        if not settings.gemini_api_key:
            logger.warning("Gemini API key not configured. AI service will be disabled.")
            self.enabled = False
            return
        
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        self.enabled = True
    
    async def generate_text(
        self,
        prompt: str,
        max_tokens: Optional[int] = None,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """
        Generate text using Gemini AI.
        """
        if not self.enabled:
            raise Exception("Gemini AI service is disabled")
        
        try:
            generation_config = {
                "temperature": temperature,
            }
            
            if max_tokens:
                generation_config["max_output_tokens"] = max_tokens
            
            response = self.model.generate_content(
                prompt,
                generation_config=generation_config
            )
            
            result = {
                "text": response.text,
                "prompt": prompt,
                "model": "gemini-pro",
                "temperature": temperature,
                "max_tokens": max_tokens
            }
            
            logger.info(f"Text generated successfully using Gemini")
            return result
            
        except Exception as e:
            logger.error(f"Failed to generate text with Gemini: {e}")
            raise
    
    async def chat_response(
        self,
        message: str,
        conversation_history: Optional[list] = None
    ) -> Dict[str, Any]:
        """
        Generate chat response using Gemini AI.
        """
        if not self.enabled:
            raise Exception("Gemini AI service is disabled")
        
        try:
            # Start chat if history provided
            if conversation_history:
                chat = self.model.start_chat(history=conversation_history)
                response = chat.send_message(message)
            else:
                response = self.model.generate_content(message)
            
            result = {
                "response": response.text,
                "message": message,
                "model": "gemini-pro",
                "has_history": bool(conversation_history)
            }
            
            logger.info(f"Chat response generated successfully using Gemini")
            return result
            
        except Exception as e:
            logger.error(f"Failed to generate chat response with Gemini: {e}")
            raise


async def generate_content(prompt: str) -> str:
    """
    Generate content using Gemini AI.
    """
    if not model:
        raise AppException(503, "AI service temporarily unavailable")
    
    try:
        response = await asyncio.to_thread(model.generate_content, prompt)
        return response.text
    except Exception as e:
        logger.error(f"Failed to generate content with Gemini: {e}")
        raise AppException(503, "AI service temporarily unavailable")
