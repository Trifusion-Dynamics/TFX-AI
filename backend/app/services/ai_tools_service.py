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
            model = genai.GenerativeModel('gemini-flash-latest')
            
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
            model = genai.GenerativeModel('gemini-flash-latest')
            
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
            model = genai.GenerativeModel('gemini-flash-latest')
            
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
    
    async def chatbot(
        self,
        message: str,
        conversation_history: Optional[List[Dict]] = None,
        visitor_name: Optional[str] = None,
        page_context: Optional[str] = None,
        user_id: Optional[str] = None,
        ip_address: Optional[str] = None
    ) -> Dict[str, Any]:
        """AI chatbot using Gemini AI."""
        try:
            model = genai.GenerativeModel('gemini-flash-latest')
            
            system_prompt = f"""
You are TFX AI's intelligent website assistant named "ARIA" 
(Artificial Response & Intelligence Assistant).

ABOUT TFX AI:
- Full-stack AI + Web Development Agency based in Delhi/Noida, India
- Founded by Arun Kumar Bind (Full Stack Developer & Gen AI Engineer)
- 60+ projects delivered, 2+ years experience
- Services: Web Development, AI Chatbot Development, SaaS Development, 
  UI/UX Design, API Development

PRICING (approximate):
- Basic Website: ₹15,000 onwards
- Pro Web App: ₹35,000 onwards  
- AI Chatbot: ₹25,000 onwards
- SaaS Product: ₹60,000 onwards
- Custom: contact for quote

CONTACT:
- Email: developerarunwork@gmail.com
- WhatsApp: +91 9129939972
- Location: Delhi/Noida, India
- Working hours: Mon-Sat, 9AM-7PM IST

KEY FACTS:
- Free 30-min consultation available
- GST invoice provided
- Full source code ownership
- Post-launch support included
- Work with Indian and international clients

BEHAVIOR RULES:
1. Be friendly, professional, and concise (max 3 sentences per reply)
2. Always respond in the same language as the visitor (Hindi or English)
3. If asked about pricing, give ranges and suggest booking a call
4. If visitor seems interested, suggest they share contact details
5. Never make up facts not listed above
6. For technical questions beyond your knowledge, suggest contacting team
7. Always end with a helpful next step or question
8. Use emojis sparingly but naturally

INTENT DETECTION:
Detect visitor intent and return it:
- greeting: hello, hi, namaste etc
- services: asking about what you offer
- pricing: asking about cost, budget, quote
- portfolio: asking about past work, examples
- contact: asking how to reach team
- booking: wants to schedule call or meeting
- ai_tools: asking about AI features
- lead_capture: show interest in working together
- general: anything else

SUGGESTED ACTIONS:
Always return 2-3 relevant quick reply options based on conversation.
Examples:
- After greeting: ["See our services", "View pricing", "Book a free call"]
- After services: ["Get a quote", "See portfolio", "Talk to team"]
- After pricing: ["Calculate my project cost", "Book consultation", "WhatsApp us"]

LEAD CAPTURE:
Set should_capture_lead: true when visitor:
- Asks for specific quote
- Mentions a project idea
- Asks about timeline for their project
- Has been chatting for 3+ messages

When capturing lead, set lead_capture_prompt to a natural message like:
"I'd love to help you further! Could you share your name and email 
so Arun can send you a detailed proposal? 😊"

Current page context: {page_context or 'Website'}
Visitor name: {visitor_name or 'there'}

Respond ONLY with valid JSON in this format:
{{
  "reply": "your response here",
  "intent": "greeting|services|pricing|portfolio|contact|booking|ai_tools|lead_capture|general",
  "suggested_actions": ["action1", "action2", "action3"],
  "should_capture_lead": true|false,
  "lead_capture_prompt": "optional message for lead capture"
}}
"""
            
            # Build conversation context
            conversation_text = ""
            if conversation_history:
                for msg in conversation_history[-5:]:  # Last 5 messages for context
                    conversation_text += f"{msg.get('role', 'user')}: {msg.get('content', '')}\n"
            
            full_prompt = f"{system_prompt}\n\n"
            if conversation_text:
                full_prompt += f"Conversation history:\n{conversation_text}\n"
            full_prompt += f"Current message: {message}\n\nPlease respond with JSON only."
            
            response = model.generate_content(full_prompt)
            response_text = response.text.strip()
            
            # Clean up response and parse JSON
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            try:
                result = json.loads(response_text)
                
                # Validate required fields
                required_fields = ['reply', 'intent', 'suggested_actions', 'should_capture_lead']
                for field in required_fields:
                    if field not in result:
                        result[field] = None if field in ['lead_capture_prompt'] else [] if field == 'suggested_actions' else False
                
                # Ensure intent is valid
                valid_intents = ['greeting', 'services', 'pricing', 'portfolio', 'contact', 'booking', 'ai_tools', 'lead_capture', 'general']
                if result['intent'] not in valid_intents:
                    result['intent'] = 'general'
                
                # Ensure suggested_actions is a list
                if not isinstance(result['suggested_actions'], list):
                    result['suggested_actions'] = []
                
            except json.JSONDecodeError:
                # Fallback response if JSON parsing fails
                result = {
                    "reply": "I'm here to help you with TFX AI's services! How can I assist you today?",
                    "intent": "general",
                    "suggested_actions": ["See our services", "View pricing", "Book a free call"],
                    "should_capture_lead": False,
                    "lead_capture_prompt": None
                }
            
            # Log usage
            await self._log_usage(
                tool_name="chatbot",
                input_data={
                    "message": message,
                    "conversation_length": len(conversation_history) if conversation_history else 0,
                    "visitor_name": visitor_name,
                    "page_context": page_context
                },
                output_data=result,
                user_id=user_id,
                ip_address=ip_address
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Chatbot error: {e}")
            # Return fallback response
            return {
                "reply": "I'm having trouble connecting right now. Please try again or contact us directly via WhatsApp! 📱",
                "intent": "general",
                "suggested_actions": ["WhatsApp us", "Email us", "Book a call"],
                "should_capture_lead": False,
                "lead_capture_prompt": None
            }
