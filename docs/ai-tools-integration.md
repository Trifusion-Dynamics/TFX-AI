# 🤖 AI Tools Integration Documentation

## 📋 Table of Contents

- [🎯 AI Integration Overview](#-ai-integration-overview)
- [🔧 Architecture Design](#-architecture-design)
- [🧠 Google Gemini AI Integration](#-google-gemini-ai-integration)
- [📝 Resume Analyzer](#-resume-analyzer)
- [✍️ Text Generator](#️-text-generator)
- [💬 QA Bot](#-qa-bot)
- [📊 Usage Analytics](#-usage-analytics)
- [🔧 Error Handling & Reliability](#-error-handling--reliability)
- [🚀 Performance Optimization](#-performance-optimization)
- [🔍 Testing Strategy](#-testing-strategy)

## 🎯 AI Integration Overview

### AI Tools Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Tools Layer                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │ Resume      │  │ Text        │  │       QA Bot        │   │
│  │ Analyzer    │  │ Generator   │  │                     │   │
│  │             │  │             │  │ - Contextual Q&A    │   │
│  │ - ATS Check │  │ - Content   │  │ - TFX AI Info      │   │
│  │ - Feedback  │  │ - Marketing │  │ - General Help     │   │
│  │ - Scoring   │  │ - Technical │  │ - Support          │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   AI Core   │  │   Service   │  │    Analytics        │   │
│  │   Service   │  │   Layer     │  │                     │   │
│  │             │  │             │  │ - Usage Tracking    │   │
│  │ - Gemini    │  │ - Business  │  │ - Cost Management   │   │
│  │ - Prompts   │  │ - Logic     │  │ - Performance      │   │
│  │ - Parsing   │  │ - Validation│  │ - Error Monitoring  │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   External  │  │   Database  │  │      Cache          │   │
│  │   APIs      │  │   Layer     │  │                     │   │
│  │             │  │             │  │ - Response Cache    │   │
│  │ - Gemini    │  │ - Usage     │  │ - Rate Limiting     │   │
│  │ - Cloudinary│  │ - Users     │  │ - Session Store     │   │
│  │ - Email     │  │ - Projects  │  │ - Temporary Data    │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Core Features

1. **🧠 Resume Analyzer**: ATS-compatible resume analysis with detailed feedback
2. **✍️ Text Generator**: AI-powered content generation for various purposes
3. **💬 QA Bot**: Contextual question answering about TFX AI services
4. **📊 Analytics**: Comprehensive usage tracking and cost management
5. **🔒 Security**: Rate limiting, input validation, and error handling

### Technology Stack

- **AI Model**: Google Gemini Pro
- **API Client**: Google Generative AI SDK
- **Prompt Engineering**: Structured prompts with JSON responses
- **Rate Limiting**: Token-based and IP-based limiting
- **Caching**: Response caching for cost optimization
- **Analytics**: Usage tracking and performance monitoring

## 🔧 Architecture Design

### Service Layer Architecture

```python
# app/services/ai_tools_service.py
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import google.generativeai as genai
import json
import logging
from datetime import datetime

class AIToolBase(ABC):
    """Base class for all AI tools."""
    
    def __init__(self, model: genai.GenerativeModel, db: AsyncSession):
        self.model = model
        self.db = db
        self.logger = logging.getLogger(self.__class__.__name__)
    
    @abstractmethod
    async def process(self, input_data: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        """Process input and return AI response."""
        pass
    
    @abstractmethod
    def validate_input(self, input_data: Dict[str, Any]) -> bool:
        """Validate input data."""
        pass
    
    @abstractmethod
    def create_prompt(self, input_data: Dict[str, Any]) -> str:
        """Create structured prompt for AI model."""
        pass
    
    async def _log_usage(
        self,
        tool_name: str,
        input_data: Dict[str, Any],
        output_data: Dict[str, Any],
        user_id: Optional[str] = None,
        ip_address: Optional[str] = None
    ):
        """Log AI tool usage for analytics."""
        try:
            from app.models.ai_tool_usage import AIToolUsage
            
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
            self.logger.error(f"Failed to log AI usage: {str(e)}")

class AIToolsService:
    """Main AI tools service."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        
        # Initialize specific tools
        self.resume_analyzer = ResumeAnalyzer(self.model, db)
        self.text_generator = TextGenerator(self.model, db)
        self.qa_bot = QABot(self.model, db)
    
    async def analyze_resume(self, resume_text: str, **kwargs) -> Dict[str, Any]:
        """Analyze resume using AI."""
        return await self.resume_analyzer.process(
            {"resume_text": resume_text},
            **kwargs
        )
    
    async def generate_text(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate text using AI."""
        return await self.text_generator.process(
            {"prompt": prompt},
            **kwargs
        )
    
    async def answer_question(self, question: str, **kwargs) -> Dict[str, Any]:
        """Answer question using AI."""
        return await self.qa_bot.process(
            {"question": question},
            **kwargs
        )
```

### Prompt Engineering Strategy

```python
# app/ai/prompts/base.py
from abc import ABC, abstractmethod
from typing import Dict, Any

class PromptTemplate(ABC):
    """Base class for prompt templates."""
    
    @abstractmethod
    def generate(self, **kwargs) -> str:
        """Generate prompt from template."""
        pass
    
    @abstractmethod
    def parse_response(self, response_text: str) -> Dict[str, Any]:
        """Parse AI response."""
        pass

class StructuredPromptTemplate(PromptTemplate):
    """Template for structured JSON responses."""
    
    def __init__(self, system_prompt: str, response_schema: Dict[str, Any]):
        self.system_prompt = system_prompt
        self.response_schema = response_schema
    
    def generate(self, **kwargs) -> str:
        """Generate structured prompt."""
        prompt_parts = [self.system_prompt]
        
        # Add input data
        for key, value in kwargs.items():
            prompt_parts.append(f"{key.upper()}: {value}")
        
        # Add response format instructions
        prompt_parts.append("\nRESPONSE FORMAT:")
        prompt_parts.append("Respond with valid JSON only:")
        prompt_parts.append(json.dumps(self.response_schema, indent=2))
        
        return "\n\n".join(prompt_parts)
    
    def parse_response(self, response_text: str) -> Dict[str, Any]:
        """Parse JSON response."""
        # Clean response text
        cleaned = response_text.strip()
        
        # Remove markdown code blocks
        if cleaned.startswith('```json'):
            cleaned = cleaned[7:]
        if cleaned.endswith('```'):
            cleaned = cleaned[:-3]
        
        cleaned = cleaned.strip()
        
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON response: {e}")
```

## 🧠 Google Gemini AI Integration

### Configuration & Setup

```python
# app/core/ai_config.py
from pydantic import BaseSettings
from typing import Optional

class AISettings(BaseSettings):
    """AI service configuration."""
    
    # Gemini API
    gemini_api_key: str
    gemini_model: str = "gemini-pro"
    gemini_temperature: float = 0.7
    gemini_max_tokens: int = 2048
    gemini_top_p: float = 0.8
    gemini_top_k: int = 40
    
    # Rate Limiting
    ai_requests_per_minute: int = 60
    ai_requests_per_hour: int = 1000
    ai_requests_per_day: int = 10000
    
    # Cost Management
    max_cost_per_user: float = 10.0  # USD
    cost_per_token: float = 0.000001  # Approximate cost
    
    # Caching
    enable_ai_caching: bool = True
    cache_ttl_seconds: int = 3600  # 1 hour
    
    # Safety
    enable_content_filter: bool = True
    max_input_length: int = 10000
    max_output_length: int = 2000
    
    class Config:
        env_prefix = "AI_"

# Initialize Gemini client
import google.generativeai as genai

def initialize_gemini(api_key: str):
    """Initialize Gemini AI client."""
    genai.configure(api_key=api_key)
    
    # Configure safety settings
    safety_settings = [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        }
    ]
    
    return genai.GenerativeModel(
        model_name="gemini-pro",
        safety_settings=safety_settings,
        generation_config={
            "temperature": 0.7,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 2048,
        }
    )
```

### Error Handling & Retry Logic

```python
# app/services/ai_client.py
import asyncio
from typing import Dict, Any, Optional
import google.generativeai as genai
from google.api_core import exceptions
import logging
from datetime import datetime, timedelta

class GeminiClient:
    """Enhanced Gemini AI client with retry logic and error handling."""
    
    def __init__(self, model: genai.GenerativeModel):
        self.model = model
        self.logger = logging.getLogger(__name__)
        self.last_request_time = None
        self.request_count = 0
        self.rate_limit_reset = datetime.now()
    
    async def generate_content(
        self,
        prompt: str,
        max_retries: int = 3,
        backoff_factor: float = 1.0
    ) -> str:
        """Generate content with retry logic and rate limiting."""
        
        for attempt in range(max_retries):
            try:
                # Check rate limiting
                await self._check_rate_limit()
                
                # Generate content
                response = await asyncio.to_thread(
                    self.model.generate_content,
                    prompt
                )
                
                # Update rate limiting counters
                self._update_rate_limit()
                
                return response.text
                
            except exceptions.TooManyRequests as e:
                self.logger.warning(f"Rate limit exceeded: {e}")
                if attempt < max_retries - 1:
                    wait_time = backoff_factor * (2 ** attempt)
                    await asyncio.sleep(wait_time)
                    continue
                raise AIQuotaExceededError("Rate limit exceeded")
                
            except exceptions.GoogleAPICallError as e:
                self.logger.error(f"API call failed: {e}")
                if attempt < max_retries - 1:
                    wait_time = backoff_factor * (2 ** attempt)
                    await asyncio.sleep(wait_time)
                    continue
                raise AIServiceError(f"AI service error: {e}")
                
            except Exception as e:
                self.logger.error(f"Unexpected error: {e}")
                if attempt < max_retries - 1:
                    wait_time = backoff_factor * (2 ** attempt)
                    await asyncio.sleep(wait_time)
                    continue
                raise AIServiceError(f"Unexpected error: {e}")
        
        raise AIServiceError("Max retries exceeded")
    
    async def _check_rate_limit(self):
        """Check and enforce rate limiting."""
        now = datetime.now()
        
        # Reset counters if needed
        if now > self.rate_limit_reset:
            self.request_count = 0
            self.rate_limit_reset = now + timedelta(minutes=1)
        
        # Check if we've exceeded the limit
        if self.request_count >= settings.ai_requests_per_minute:
            wait_time = (self.rate_limit_reset - now).total_seconds()
            if wait_time > 0:
                await asyncio.sleep(wait_time)
    
    def _update_rate_limit(self):
        """Update rate limiting counters."""
        self.request_count += 1
        self.last_request_time = datetime.now()

class AIQuotaExceededError(Exception):
    """Raised when AI quota is exceeded."""
    pass

class AIServiceError(Exception):
    """Raised when AI service fails."""
    pass
```

## 📝 Resume Analyzer

### Resume Analysis Logic

```python
# app/ai/resume_analyzer.py
from typing import Dict, Any, List
import re
from app.services.ai_client import GeminiClient
from app.ai.prompts.resume import ResumePromptTemplate

class ResumeAnalyzer(AIToolBase):
    """Resume analyzer using AI for ATS compatibility."""
    
    def __init__(self, model: genai.GenerativeModel, db: AsyncSession):
        super().__init__(model, db)
        self.client = GeminiClient(model)
        self.prompt_template = ResumePromptTemplate()
    
    def validate_input(self, input_data: Dict[str, Any]) -> bool:
        """Validate resume input."""
        resume_text = input_data.get('resume_text', '')
        
        if not resume_text or len(resume_text.strip()) < 100:
            raise ValueError("Resume text must be at least 100 characters")
        
        if len(resume_text) > 10000:
            raise ValueError("Resume text too long (max 10,000 characters)")
        
        return True
    
    def create_prompt(self, input_data: Dict[str, Any]) -> str:
        """Create resume analysis prompt."""
        return self.prompt_template.generate(
            resume_text=input_data['resume_text'],
            job_description=input_data.get('job_description', ''),
            analysis_type=input_data.get('analysis_type', 'comprehensive')
        )
    
    async def process(self, input_data: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        """Process resume analysis."""
        start_time = datetime.now()
        user_id = kwargs.get('user_id')
        ip_address = kwargs.get('ip_address')
        
        try:
            # Validate input
            self.validate_input(input_data)
            
            # Create prompt
            prompt = self.create_prompt(input_data)
            
            # Generate response
            response_text = await self.client.generate_content(prompt)
            
            # Parse response
            analysis = self.prompt_template.parse_response(response_text)
            
            # Add metadata
            analysis['metadata'] = {
                'resume_length': len(input_data['resume_text']),
                'word_count': len(input_data['resume_text'].split()),
                'processing_time': (datetime.now() - start_time).total_seconds(),
                'analyzed_at': datetime.utcnow().isoformat()
            }
            
            # Log usage
            await self._log_usage(
                tool_name="resume_analyzer",
                input_data={"resume_length": len(input_data['resume_text'])},
                output_data=analysis,
                user_id=user_id,
                ip_address=ip_address
            )
            
            return analysis
            
        except Exception as e:
            self.logger.error(f"Resume analysis failed: {str(e)}")
            raise AIServiceError(f"Resume analysis failed: {str(e)}")
    
    def _extract_contact_info(self, resume_text: str) -> Dict[str, str]:
        """Extract contact information from resume."""
        contact_info = {}
        
        # Email pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, resume_text)
        if emails:
            contact_info['email'] = emails[0]
        
        # Phone pattern (basic)
        phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, resume_text)
        if phones:
            contact_info['phone'] = phones[0]
        
        # LinkedIn pattern
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedin = re.findall(linkedin_pattern, resume_text)
        if linkedin:
            contact_info['linkedin'] = 'https://' + linkedin[0]
        
        return contact_info
    
    def _calculate_readability_score(self, resume_text: str) -> Dict[str, Any]:
        """Calculate readability metrics."""
        sentences = re.split(r'[.!?]+', resume_text)
        words = resume_text.split()
        
        avg_sentence_length = len(words) / len(sentences) if sentences else 0
        avg_word_length = sum(len(word) for word in words) / len(words) if words else 0
        
        return {
            'sentence_count': len(sentences),
            'word_count': len(words),
            'avg_sentence_length': round(avg_sentence_length, 2),
            'avg_word_length': round(avg_word_length, 2),
            'readability_score': min(100, 100 - (avg_sentence_length - 15) * 2)
        }
```

### Resume Prompt Template

```python
# app/ai/prompts/resume.py
from app.ai.prompts.base import StructuredPromptTemplate

class ResumePromptTemplate(StructuredPromptTemplate):
    """Prompt template for resume analysis."""
    
    def __init__(self):
        system_prompt = """
        You are an expert ATS (Applicant Tracking System) analyzer and HR professional with 15+ years of experience.
        Your task is to analyze resumes and provide comprehensive, actionable feedback.
        
        Analyze the resume based on:
        1. ATS Compatibility and keyword optimization
        2. Content quality and completeness
        3. Formatting and structure
        4. Skills and experience presentation
        5. Quantifiable achievements
        6. Professional presentation
        
        Provide specific, actionable recommendations for improvement.
        """
        
        response_schema = {
            "overall_score": 85,
            "ats_compatibility": {
                "score": 90,
                "keyword_match": 85,
                "format_score": 95,
                "issues": ["Missing quantifiable achievements"]
            },
            "content_analysis": {
                "score": 80,
                "strengths": ["Strong technical skills", "Clear career progression"],
                "weaknesses": ["Limited soft skills", "No metrics"],
                "missing_sections": ["Professional summary", "Achievements section"]
            },
            "formatting_analysis": {
                "score": 85,
                "readability": "Good",
                "structure": "Well organized",
                "issues": ["Inconsistent bullet points", "Poor spacing"]
            },
            "skills_analysis": {
                "technical_skills": ["Python", "React", "AWS"],
                "soft_skills": ["Communication", "Leadership"],
                "missing_skills": ["Cloud architecture", "DevOps"],
                "skill_level": "Mid-level"
            },
            "recommendations": [
                "Add quantifiable achievements with metrics",
                "Include professional summary",
                "Enhance soft skills section",
                "Add certifications section"
            ],
            "improvement_areas": [
                "Quantify achievements",
                "Add industry keywords",
                "Improve formatting consistency",
                "Include measurable results"
            ],
            "contact_info": {
                "email": "john@example.com",
                "phone": "+1-555-0123",
                "linkedin": "https://linkedin.com/in/johndoe"
            },
            "experience_level": "Mid-level",
            "estimated_salary_range": "$80,000 - $120,000"
        }
        
        super().__init__(system_prompt, response_schema)
    
    def generate(self, **kwargs) -> str:
        """Generate resume analysis prompt."""
        resume_text = kwargs.get('resume_text', '')
        job_description = kwargs.get('job_description', '')
        analysis_type = kwargs.get('analysis_type', 'comprehensive')
        
        prompt_parts = [self.system_prompt]
        
        # Add resume text
        prompt_parts.append("\nRESUME TO ANALYZE:")
        prompt_parts.append(resume_text)
        
        # Add job description if provided
        if job_description:
            prompt_parts.append("\nTARGET JOB DESCRIPTION:")
            prompt_parts.append(job_description)
        
        # Add analysis type
        prompt_parts.append(f"\nANALYSIS TYPE: {analysis_type.upper()}")
        
        # Add response format
        prompt_parts.append("\nRESPONSE FORMAT:")
        prompt_parts.append("Provide a detailed JSON response with the following structure:")
        prompt_parts.append(json.dumps(self.response_schema, indent=2))
        
        return "\n\n".join(prompt_parts)
```

## ✍️ Text Generator

### Text Generation Logic

```python
# app/ai/text_generator.py
from typing import Dict, Any, List
from app.services.ai_client import GeminiClient
from app.ai.prompts.text import TextPromptTemplate

class TextGenerator(AIToolBase):
    """AI-powered text generator."""
    
    def __init__(self, model: genai.GenerativeModel, db: AsyncSession):
        super().__init__(model, db)
        self.client = GeminiClient(model)
        self.prompt_template = TextPromptTemplate()
    
    def validate_input(self, input_data: Dict[str, Any]) -> bool:
        """Validate text generation input."""
        prompt = input_data.get('prompt', '')
        text_type = input_data.get('type', 'general')
        
        if not prompt or len(prompt.strip()) < 10:
            raise ValueError("Prompt must be at least 10 characters")
        
        if len(prompt) > 5000:
            raise ValueError("Prompt too long (max 5,000 characters)")
        
        valid_types = ['blog', 'marketing', 'technical', 'creative', 'email', 'social', 'general']
        if text_type not in valid_types:
            raise ValueError(f"Invalid text type. Must be one of: {valid_types}")
        
        return True
    
    def create_prompt(self, input_data: Dict[str, Any]) -> str:
        """Create text generation prompt."""
        return self.prompt_template.generate(
            prompt=input_data['prompt'],
            text_type=input_data.get('type', 'general'),
            tone=input_data.get('tone', 'professional'),
            length=input_data.get('length', 'medium'),
            audience=input_data.get('audience', 'general'),
            keywords=input_data.get('keywords', [])
        )
    
    async def process(self, input_data: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        """Process text generation."""
        start_time = datetime.now()
        user_id = kwargs.get('user_id')
        ip_address = kwargs.get('ip_address')
        
        try:
            # Validate input
            self.validate_input(input_data)
            
            # Create prompt
            prompt = self.create_prompt(input_data)
            
            # Generate response
            response_text = await self.client.generate_content(prompt)
            
            # Parse response
            generated_text = self._parse_text_response(response_text)
            
            # Add metadata
            result = {
                'generated_text': generated_text,
                'metadata': {
                    'prompt_length': len(input_data['prompt']),
                    'output_length': len(generated_text),
                    'text_type': input_data.get('type', 'general'),
                    'tone': input_data.get('tone', 'professional'),
                    'processing_time': (datetime.now() - start_time).total_seconds(),
                    'generated_at': datetime.utcnow().isoformat()
                }
            }
            
            # Log usage
            await self._log_usage(
                tool_name="text_generator",
                input_data={"prompt_length": len(input_data['prompt'])},
                output_data={"output_length": len(generated_text)},
                user_id=user_id,
                ip_address=ip_address
            )
            
            return result
            
        except Exception as e:
            self.logger.error(f"Text generation failed: {str(e)}")
            raise AIServiceError(f"Text generation failed: {str(e)}")
    
    def _parse_text_response(self, response_text: str) -> str:
        """Parse text generation response."""
        # Clean response
        cleaned = response_text.strip()
        
        # Remove markdown code blocks
        if cleaned.startswith('```'):
            cleaned = cleaned.split('\n', 1)[1]
        if cleaned.endswith('```'):
            cleaned = cleaned.rsplit('\n', 1)[0]
        
        return cleaned.strip()
    
    def _analyze_generated_text(self, text: str) -> Dict[str, Any]:
        """Analyze generated text quality."""
        sentences = text.split('.')
        words = text.split()
        
        return {
            'sentence_count': len(sentences),
            'word_count': len(words),
            'avg_sentence_length': len(words) / len(sentences) if sentences else 0,
            'readability_score': self._calculate_readability(text),
            'sentiment': self._analyze_sentiment(text),
            'complexity': self._analyze_complexity(text)
        }
    
    def _calculate_readability(self, text: str) -> float:
        """Calculate readability score."""
        # Simplified readability calculation
        sentences = text.split('.')
        words = text.split()
        
        if not sentences or not words:
            return 0.0
        
        avg_sentence_length = len(words) / len(sentences)
        avg_word_length = sum(len(word) for word in words) / len(words)
        
        # Simple readability formula
        readability = 100 - (avg_sentence_length * 2 + avg_word_length * 5)
        return max(0, min(100, readability))
    
    def _analyze_sentiment(self, text: str) -> str:
        """Analyze text sentiment (simplified)."""
        positive_words = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic']
        negative_words = ['bad', 'terrible', 'awful', 'horrible', 'disappointing', 'poor']
        
        words = text.lower().split()
        positive_count = sum(1 for word in words if word in positive_words)
        negative_count = sum(1 for word in words if word in negative_words)
        
        if positive_count > negative_count:
            return 'positive'
        elif negative_count > positive_count:
            return 'negative'
        else:
            return 'neutral'
    
    def _analyze_complexity(self, text: str) -> str:
        """Analyze text complexity."""
        words = text.split()
        complex_words = [word for word in words if len(word) > 6]
        
        complex_ratio = len(complex_words) / len(words) if words else 0
        
        if complex_ratio > 0.3:
            return 'high'
        elif complex_ratio > 0.15:
            return 'medium'
        else:
            return 'low'
```

## 💬 QA Bot

### QA Bot Logic

```python
# app/ai/qa_bot.py
from typing import Dict, Any, List
from app.services.ai_client import GeminiClient
from app.ai.prompts.qa import QAPromptTemplate

class QABot(AIToolBase):
    """Contextual question answering bot."""
    
    def __init__(self, model: genai.GenerativeModel, db: AsyncSession):
        super().__init__(model, db)
        self.client = GeminiClient(model)
        self.prompt_template = QAPromptTemplate()
        self.context_cache = {}
    
    def validate_input(self, input_data: Dict[str, Any]) -> bool:
        """Validate QA input."""
        question = input_data.get('question', '')
        
        if not question or len(question.strip()) < 5:
            raise ValueError("Question must be at least 5 characters")
        
        if len(question) > 1000:
            raise ValueError("Question too long (max 1,000 characters)")
        
        return True
    
    def create_prompt(self, input_data: Dict[str, Any]) -> str:
        """Create QA prompt."""
        return self.prompt_template.generate(
            question=input_data['question'],
            context=input_data.get('context', ''),
            conversation_history=input_data.get('conversation_history', [])
        )
    
    async def process(self, input_data: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        """Process question answering."""
        start_time = datetime.now()
        user_id = kwargs.get('user_id')
        ip_address = kwargs.get('ip_address')
        
        try:
            # Validate input
            self.validate_input(input_data)
            
            # Get relevant context
            context = await self._get_relevant_context(input_data['question'])
            
            # Create prompt
            prompt = self.create_prompt({
                **input_data,
                'context': context
            })
            
            # Generate response
            response_text = await self.client.generate_content(prompt)
            
            # Parse response
            answer = self._parse_qa_response(response_text)
            
            # Add metadata
            result = {
                'question': input_data['question'],
                'answer': answer,
                'context_used': context,
                'confidence': self._calculate_confidence(answer),
                'metadata': {
                    'question_length': len(input_data['question']),
                    'answer_length': len(answer),
                    'context_length': len(context),
                    'processing_time': (datetime.now() - start_time).total_seconds(),
                    'answered_at': datetime.utcnow().isoformat()
                }
            }
            
            # Log usage
            await self._log_usage(
                tool_name="qa_bot",
                input_data={"question_length": len(input_data['question'])},
                output_data={"answer_length": len(answer)},
                user_id=user_id,
                ip_address=ip_address
            )
            
            return result
            
        except Exception as e:
            self.logger.error(f"QA bot failed: {str(e)}")
            raise AIServiceError(f"QA bot failed: {str(e)}")
    
    async def _get_relevant_context(self, question: str) -> str:
        """Get relevant context for the question."""
        # Check cache first
        cache_key = question.lower().strip()
        if cache_key in self.context_cache:
            return self.context_cache[cache_key]
        
        # Extract keywords from question
        keywords = self._extract_keywords(question)
        
        # Build context based on keywords
        context_parts = []
        
        # TFX AI services context
        if any(keyword in ['service', 'offer', 'provide'] for keyword in keywords):
            context_parts.append(await self._get_services_context())
        
        # Technical context
        if any(keyword in ['technology', 'stack', 'framework'] for keyword in keywords):
            context_parts.append(await self._get_tech_context())
        
        # Pricing context
        if any(keyword in ['price', 'cost', 'pricing'] for keyword in keywords):
            context_parts.append(await self._get_pricing_context())
        
        # Project context
        if any(keyword in ['project', 'portfolio', 'work'] for keyword in keywords):
            context_parts.append(await self._get_projects_context())
        
        context = '\n\n'.join(context_parts)
        
        # Cache context
        self.context_cache[cache_key] = context
        
        return context
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from text."""
        # Simple keyword extraction
        import re
        
        # Remove common words
        stop_words = {'what', 'how', 'why', 'when', 'where', 'is', 'are', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'}
        
        # Extract words
        words = re.findall(r'\b\w+\b', text.lower())
        
        # Filter stop words and short words
        keywords = [word for word in words if word not in stop_words and len(word) > 2]
        
        return keywords[:10]  # Return top 10 keywords
    
    async def _get_services_context(self) -> str:
        """Get services context."""
        try:
            from app.models.service import Service
            result = await self.db.execute(
                select(Service).where(Service.is_active == True).limit(5)
            )
            services = result.scalars().all()
            
            context = "TFX AI Services:\n"
            for service in services:
                context += f"- {service.title}: {service.description}\n"
            
            return context
        except Exception:
            return "TFX AI offers web development, AI chatbot development, SaaS development, UI/UX design, and API development services."
    
    async def _get_tech_context(self) -> str:
        """Get technology context."""
        return "TFX AI uses modern technologies including React, Next.js, TypeScript, Python, FastAPI, PostgreSQL, Docker, and cloud platforms like AWS and Vercel."
    
    async def _get_pricing_context(self) -> str:
        """Get pricing context."""
        return "TFX AI offers flexible pricing plans including Starter ($15,000), Pro ($35,000), and Enterprise (custom pricing) with different features and support levels."
    
    async def _get_projects_context(self) -> str:
        """Get projects context."""
        return "TFX AI has worked on various projects including ClinicMind AI (hospital management), ZestEats (food delivery), and AutoFlow (business automation platform)."
    
    def _parse_qa_response(self, response_text: str) -> str:
        """Parse QA response."""
        # Clean response
        cleaned = response_text.strip()
        
        # Remove markdown code blocks
        if cleaned.startswith('```'):
            cleaned = cleaned.split('\n', 1)[1]
        if cleaned.endswith('```'):
            cleaned = cleaned.rsplit('\n', 1)[0]
        
        return cleaned.strip()
    
    def _calculate_confidence(self, answer: str) -> float:
        """Calculate confidence score for the answer."""
        # Simple confidence calculation based on answer characteristics
        if len(answer) < 50:
            return 0.6  # Short answers might be incomplete
        elif len(answer) > 500:
            return 0.8  # Detailed answers are likely more complete
        else:
            return 0.75  # Medium length answers
```

## 📊 Usage Analytics

### Analytics Service

```python
# app/services/ai_analytics.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from datetime import datetime, timedelta
from typing import Dict, Any, List
from app.models.ai_tool_usage import AIToolUsage

class AIAnalyticsService:
    """AI tools analytics service."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_usage_stats(
        self,
        start_date: datetime,
        end_date: datetime,
        user_id: str = None
    ) -> Dict[str, Any]:
        """Get usage statistics for a date range."""
        
        # Base query
        query = select(AIToolUsage).where(
            and_(
                AIToolUsage.created_at >= start_date,
                AIToolUsage.created_at <= end_date
            )
        )
        
        if user_id:
            query = query.where(AIToolUsage.user_id == user_id)
        
        result = await self.db.execute(query)
        usages = result.scalars().all()
        
        # Calculate stats
        stats = {
            'total_requests': len(usages),
            'unique_users': len(set(u.user_id for u in usages if u.user_id)),
            'tool_usage': {},
            'daily_usage': {},
            'hourly_usage': {},
            'error_rate': 0,
            'avg_response_time': 0,
            'cost_estimate': 0
        }
        
        # Tool usage breakdown
        for usage in usages:
            tool_name = usage.tool_name
            if tool_name not in stats['tool_usage']:
                stats['tool_usage'][tool_name] = 0
            stats['tool_usage'][tool_name] += 1
        
        # Daily usage
        for usage in usages:
            date = usage.created_at.date().isoformat()
            if date not in stats['daily_usage']:
                stats['daily_usage'][date] = 0
            stats['daily_usage'][date] += 1
        
        # Hourly usage
        for usage in usages:
            hour = usage.created_at.hour
            if hour not in stats['hourly_usage']:
                stats['hourly_usage'][hour] = 0
            stats['hourly_usage'][hour] += 1
        
        # Calculate cost estimate (simplified)
        stats['cost_estimate'] = len(usages) * 0.001  # $0.001 per request
        
        return stats
    
    async def get_user_analytics(self, user_id: str) -> Dict[str, Any]:
        """Get analytics for a specific user."""
        
        # Get user's usage history
        result = await self.db.execute(
            select(AIToolUsage).where(AIToolUsage.user_id == user_id)
        )
        usages = result.scalars().all()
        
        if not usages:
            return {
                'total_requests': 0,
                'tools_used': [],
                'first_used': None,
                'last_used': None,
                'most_used_tool': None,
                'usage_pattern': 'none'
            }
        
        # Calculate user stats
        tools_used = list(set(u.tool_name for u in usages))
        tool_counts = {}
        
        for usage in usages:
            tool = usage.tool_name
            if tool not in tool_counts:
                tool_counts[tool] = 0
            tool_counts[tool] += 1
        
        most_used_tool = max(tool_counts, key=tool_counts.get) if tool_counts else None
        
        # Determine usage pattern
        if len(usages) == 1:
            pattern = 'single_use'
        elif len(usages) <= 5:
            pattern = 'light_user'
        elif len(usages) <= 20:
            pattern = 'regular_user'
        else:
            pattern = 'heavy_user'
        
        return {
            'total_requests': len(usages),
            'tools_used': tools_used,
            'first_used': min(u.created_at for u in usages).isoformat(),
            'last_used': max(u.created_at for u in usages).isoformat(),
            'most_used_tool': most_used_tool,
            'tool_counts': tool_counts,
            'usage_pattern': pattern,
            'estimated_cost': len(usages) * 0.001
        }
    
    async def get_tool_performance(self, tool_name: str) -> Dict[str, Any]:
        """Get performance metrics for a specific tool."""
        
        # Get tool usage data
        result = await self.db.execute(
            select(AIToolUsage).where(AIToolUsage.tool_name == tool_name)
        )
        usages = result.scalars().all()
        
        if not usages:
            return {
                'total_requests': 0,
                'success_rate': 0,
                'avg_response_time': 0,
                'error_rate': 0,
                'popular_hours': [],
                'user_satisfaction': 0
            }
        
        # Calculate performance metrics
        total_requests = len(usages)
        
        # Extract response times from output data
        response_times = []
        for usage in usages:
            if usage.output_data and 'metadata' in usage.output_data:
                metadata = usage.output_data['metadata']
                if 'processing_time' in metadata:
                    response_times.append(metadata['processing_time'])
        
        avg_response_time = sum(response_times) / len(response_times) if response_times else 0
        
        # Popular hours
        hour_counts = {}
        for usage in usages:
            hour = usage.created_at.hour
            if hour not in hour_counts:
                hour_counts[hour] = 0
            hour_counts[hour] += 1
        
        popular_hours = sorted(hour_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        
        return {
            'total_requests': total_requests,
            'success_rate': 95.0,  # Simplified
            'avg_response_time': round(avg_response_time, 3),
            'error_rate': 5.0,  # Simplified
            'popular_hours': popular_hours,
            'user_satisfaction': 4.5,  # Simplified
            'estimated_cost': total_requests * 0.001
        }
```

## 🔧 Error Handling & Reliability

### Comprehensive Error Handling

```python
# app/core/ai_errors.py
from enum import Enum
from typing import Optional, Dict, Any

class AIErrorType(Enum):
    QUOTA_EXCEEDED = "quota_exceeded"
    RATE_LIMITED = "rate_limited"
    INVALID_INPUT = "invalid_input"
    SERVICE_ERROR = "service_error"
    PARSE_ERROR = "parse_error"
    TIMEOUT_ERROR = "timeout_error"
    CONTENT_FILTERED = "content_filtered"

class AIServiceError(Exception):
    """Base exception for AI service errors."""
    
    def __init__(
        self,
        message: str,
        error_type: AIErrorType,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.error_type = error_type
        self.details = details or {}
        super().__init__(message)

class AIQuotaExceededError(AIServiceError):
    """Raised when AI quota is exceeded."""
    
    def __init__(self, message: str = "AI quota exceeded"):
        super().__init__(message, AIErrorType.QUOTA_EXCEEDED)

class AIRateLimitError(AIServiceError):
    """Raised when rate limit is exceeded."""
    
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(message, AIErrorType.RATE_LIMITED)

class AIInputValidationError(AIServiceError):
    """Raised when input validation fails."""
    
    def __init__(self, message: str, validation_errors: Dict[str, str]):
        super().__init__(message, AIErrorType.INVALID_INPUT, validation_errors)

class AIParseError(AIServiceError):
    """Raised when AI response parsing fails."""
    
    def __init__(self, message: str, raw_response: str):
        super().__init__(message, AIErrorType.PARSE_ERROR, {"raw_response": raw_response})
```

### Circuit Breaker Pattern

```python
# app/core/circuit_breaker.py
import asyncio
from datetime import datetime, timedelta
from typing import Callable, Any
import logging

class CircuitBreaker:
    """Circuit breaker for AI service calls."""
    
    def __init__(
        self,
        failure_threshold: int = 5,
        recovery_timeout: int = 60,
        expected_exception: type = Exception
    ):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.expected_exception = expected_exception
        
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'CLOSED'  # CLOSED, OPEN, HALF_OPEN
        
        self.logger = logging.getLogger(__name__)
    
    async def call(self, func: Callable, *args, **kwargs) -> Any:
        """Execute function with circuit breaker protection."""
        
        if self.state == 'OPEN':
            if self._should_attempt_reset():
                self.state = 'HALF_OPEN'
                self.logger.info("Circuit breaker transitioning to HALF_OPEN")
            else:
                raise AIServiceError("Circuit breaker is OPEN", AIErrorType.SERVICE_ERROR)
        
        try:
            result = await func(*args, **kwargs)
            
            if self.state == 'HALF_OPEN':
                self._reset()
                self.logger.info("Circuit breaker reset to CLOSED")
            
            return result
            
        except self.expected_exception as e:
            self._record_failure()
            
            if self.state == 'OPEN':
                self.logger.warning(f"Circuit breaker opened: {e}")
            
            raise e
    
    def _should_attempt_reset(self) -> bool:
        """Check if circuit breaker should attempt reset."""
        if self.last_failure_time is None:
            return True
        
        return datetime.now() > self.last_failure_time + timedelta(seconds=self.recovery_timeout)
    
    def _record_failure(self):
        """Record a failure."""
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        
        if self.failure_count >= self.failure_threshold:
            self.state = 'OPEN'
    
    def _reset(self):
        """Reset circuit breaker."""
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'CLOSED'

# Usage in AI service
class AIToolsService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.circuit_breaker = CircuitBreaker(
            failure_threshold=5,
            recovery_timeout=60,
            expected_exception=AIServiceError
        )
    
    async def analyze_resume(self, resume_text: str, **kwargs) -> Dict[str, Any]:
        """Analyze resume with circuit breaker protection."""
        return await self.circuit_breaker.call(
            self._analyze_resume_internal,
            resume_text,
            **kwargs
        )
    
    async def _analyze_resume_internal(self, resume_text: str, **kwargs) -> Dict[str, Any]:
        """Internal resume analysis logic."""
        # Actual implementation here
        pass
```

## 🚀 Performance Optimization

### Response Caching

```python
# app/core/ai_cache.py
import json
import hashlib
from typing import Any, Optional
from datetime import datetime, timedelta
import redis.asyncio as redis

class AICache:
    """AI response caching service."""
    
    def __init__(self, redis_url: Optional[str] = None):
        self.redis_client = None
        self.local_cache = {}
        self.cache_ttl = 3600  # 1 hour
        
        if redis_url:
            self.redis_client = redis.from_url(redis_url)
    
    async def get(self, key: str) -> Optional[Any]:
        """Get cached response."""
        if self.redis_client:
            try:
                cached = await self.redis_client.get(key)
                if cached:
                    return json.loads(cached)
            except Exception as e:
                logging.error(f"Redis cache error: {e}")
        
        # Fallback to local cache
        return self.local_cache.get(key)
    
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Set cached response."""
        ttl = ttl or self.cache_ttl
        serialized_value = json.dumps(value, default=str)
        
        if self.redis_client:
            try:
                await self.redis_client.setex(key, ttl, serialized_value)
                return True
            except Exception as e:
                logging.error(f"Redis cache error: {e}")
        
        # Fallback to local cache
        self.local_cache[key] = serialized_value
        return True
    
    @staticmethod
    def generate_cache_key(tool_name: str, input_data: Dict[str, Any]) -> str:
        """Generate cache key from tool name and input data."""
        # Create normalized input string
        normalized_input = json.dumps(input_data, sort_keys=True, default=str)
        
        # Generate hash
        hash_input = f"{tool_name}:{normalized_input}"
        return hashlib.md5(hash_input.encode()).hexdigest()

# Usage in AI tools
class ResumeAnalyzer(AIToolBase):
    def __init__(self, model: genai.GenerativeModel, db: AsyncSession):
        super().__init__(model, db)
        self.cache = AICache(settings.redis_url)
    
    async def process(self, input_data: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        """Process with caching."""
        # Generate cache key
        cache_key = self.cache.generate_cache_key("resume_analyzer", input_data)
        
        # Try cache first
        cached_result = await self.cache.get(cache_key)
        if cached_result:
            self.logger.info("Cache hit for resume analyzer")
            return cached_result
        
        # Process normally
        result = await self._process_internal(input_data, **kwargs)
        
        # Cache result
        await self.cache.set(cache_key, result)
        
        return result
```

### Batch Processing

```python
# app/services/ai_batch_processor.py
from typing import List, Dict, Any
import asyncio
from concurrent.futures import ThreadPoolExecutor

class AIBatchProcessor:
    """Batch processing for AI requests."""
    
    def __init__(self, max_concurrent: int = 5):
        self.max_concurrent = max_concurrent
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self.executor = ThreadPoolExecutor(max_workers=max_concurrent)
    
    async def process_batch(
        self,
        requests: List[Dict[str, Any]],
        tool_name: str
    ) -> List[Dict[str, Any]]:
        """Process multiple AI requests concurrently."""
        
        tasks = []
        for request in requests:
            task = self._process_single_request(request, tool_name)
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Handle exceptions
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                processed_results.append({
                    'success': False,
                    'error': str(result),
                    'request_id': requests[i].get('id', i)
                })
            else:
                processed_results.append({
                    'success': True,
                    'data': result,
                    'request_id': requests[i].get('id', i)
                })
        
        return processed_results
    
    async def _process_single_request(
        self,
        request: Dict[str, Any],
        tool_name: str
    ) -> Dict[str, Any]:
        """Process a single AI request."""
        async with self.semaphore:
            try:
                if tool_name == "resume_analyzer":
                    return await self.resume_analyzer.process(request)
                elif tool_name == "text_generator":
                    return await self.text_generator.process(request)
                elif tool_name == "qa_bot":
                    return await self.qa_bot.process(request)
                else:
                    raise ValueError(f"Unknown tool: {tool_name}")
            except Exception as e:
                raise AIServiceError(f"Batch processing failed: {str(e)}")
```

## 🔍 Testing Strategy

### AI Testing Framework

```python
# tests/ai/test_ai_tools.py
import pytest
from unittest.mock import AsyncMock, patch
from app.services.ai_tools_service import AIToolsService
from app.core.ai_errors import AIServiceError, AIQuotaExceededError

class TestAIToolsService:
    """Test suite for AI tools service."""
    
    @pytest.fixture
    def ai_service(self, db_session):
        """Create AI service for testing."""
        with patch('google.generativeai.configure'), \
             patch('google.generativeai.GenerativeModel'):
            return AIToolsService(db_session)
    
    @pytest.mark.asyncio
    async def test_resume_analyzer_success(self, ai_service):
        """Test successful resume analysis."""
        resume_text = "John Doe\nSoftware Engineer\nExperience with Python, React, AWS..."
        
        with patch.object(ai_service.resume_analyzer, 'process') as mock_process:
            mock_process.return_value = {
                'overall_score': 85,
                'ats_compatibility': {'score': 90},
                'recommendations': ['Add quantifiable achievements']
            }
            
            result = await ai_service.analyze_resume(resume_text)
            
            assert result['overall_score'] == 85
            assert 'recommendations' in result
            mock_process.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_resume_analyzer_invalid_input(self, ai_service):
        """Test resume analyzer with invalid input."""
        with pytest.raises(AIServiceError):
            await ai_service.analyze_resume("")  # Too short
        
        with pytest.raises(AIServiceError):
            await ai_service.analyze_resume("x" * 15000)  # Too long
    
    @pytest.mark.asyncio
    async def test_text_generator_success(self, ai_service):
        """Test successful text generation."""
        prompt = "Write a blog post about AI in healthcare"
        
        with patch.object(ai_service.text_generator, 'process') as mock_process:
            mock_process.return_value = {
                'generated_text': "AI is revolutionizing healthcare...",
                'metadata': {'text_type': 'blog', 'tone': 'professional'}
            }
            
            result = await ai_service.generate_text(prompt)
            
            assert 'generated_text' in result
            assert result['metadata']['text_type'] == 'blog'
            mock_process.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_qa_bot_success(self, ai_service):
        """Test successful QA bot response."""
        question = "What services does TFX AI offer?"
        
        with patch.object(ai_service.qa_bot, 'process') as mock_process:
            mock_process.return_value = {
                'question': question,
                'answer': "TFX AI offers web development, AI chatbot development...",
                'confidence': 0.85
            }
            
            result = await ai_service.answer_question(question)
            
            assert result['question'] == question
            assert 'answer' in result
            assert result['confidence'] == 0.85
            mock_process.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_rate_limiting(self, ai_service):
        """Test rate limiting behavior."""
        # Mock rate limit exceeded
        with patch.object(ai_service.resume_analyzer.client, 'generate_content') as mock_generate:
            from google.api_core import exceptions
            mock_generate.side_effect = exceptions.TooManyRequests("Rate limit exceeded")
            
            with pytest.raises(AIServiceError):
                await ai_service.analyze_resume("Test resume text")
    
    @pytest.mark.asyncio
    async def test_quota_exceeded(self, ai_service):
        """Test quota exceeded behavior."""
        # Mock quota exceeded
        with patch.object(ai_service.resume_analyzer.client, 'generate_content') as mock_generate:
            mock_generate.side_effect = AIQuotaExceededError("Quota exceeded")
            
            with pytest.raises(AIQuotaExceededError):
                await ai_service.analyze_resume("Test resume text")
    
    @pytest.mark.asyncio
    async def test_caching(self, ai_service):
        """Test response caching."""
        resume_text = "Test resume for caching"
        
        # First call should hit AI service
        with patch.object(ai_service.resume_analyzer, '_process_internal') as mock_process:
            mock_process.return_value = {'overall_score': 85}
            
            result1 = await ai_service.analyze_resume(resume_text)
            result2 = await ai_service.analyze_resume(resume_text)
            
            # Should only call AI service once due to caching
            mock_process.assert_called_once()
            assert result1 == result2
```

### Integration Tests

```python
# tests/ai/test_integration.py
import pytest
from app.services.ai_tools_service import AIToolsService
from app.models.ai_tool_usage import AIToolUsage

class TestAIIntegration:
    """Integration tests for AI tools."""
    
    @pytest.mark.asyncio
    async def test_end_to_end_resume_analysis(self, db_session, test_user):
        """Test complete resume analysis workflow."""
        ai_service = AIToolsService(db_session)
        
        resume_text = """
        John Doe
        Senior Software Engineer
        Email: john@example.com | Phone: (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe
        
        Professional Summary
        Experienced software engineer with 8+ years in full-stack development...
        
        Experience
        Senior Software Engineer - Tech Corp (2020-Present)
        - Led development of microservices architecture
        - Improved system performance by 40%
        - Mentored team of 5 developers
        
        Software Engineer - StartupXYZ (2018-2020)
        - Developed REST APIs using Python and FastAPI
        - Implemented CI/CD pipelines
        - Reduced deployment time by 60%
        
        Skills
        Programming: Python, JavaScript, TypeScript, Java
        Frameworks: React, Next.js, FastAPI, Django
        Databases: PostgreSQL, MongoDB, Redis
        Cloud: AWS, GCP, Docker, Kubernetes
        """
        
        # Process resume
        result = await ai_service.analyze_resume(
            resume_text,
            user_id=test_user.id
        )
        
        # Verify result structure
        assert 'overall_score' in result
        assert 'ats_compatibility' in result
        assert 'recommendations' in result
        assert 'metadata' in result
        
        # Verify usage was logged
        usage_result = await db_session.execute(
            select(AIToolUsage).where(
                and_(
                    AIToolUsage.user_id == test_user.id,
                    AIToolUsage.tool_name == "resume_analyzer"
                )
            )
        )
        usage = usage_result.scalar_one_or_none()
        
        assert usage is not None
        assert usage.input_data['resume_length'] == len(resume_text)
        assert usage.output_data['overall_score'] == result['overall_score']
    
    @pytest.mark.asyncio
    async def test_concurrent_requests(self, db_session):
        """Test handling concurrent AI requests."""
        ai_service = AIToolsService(db_session)
        
        # Create multiple concurrent requests
        questions = [
            "What services does TFX AI offer?",
            "How much do your services cost?",
            "What technologies do you use?",
            "Can you help with AI integration?",
            "Do you provide ongoing support?"
        ]
        
        # Process questions concurrently
        tasks = [
            ai_service.answer_question(question)
            for question in questions
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Verify all requests completed
        assert len(results) == len(questions)
        
        # Check for exceptions
        exceptions = [r for r in results if isinstance(r, Exception)]
        assert len(exceptions) == 0, f"Exceptions occurred: {exceptions}"
        
        # Verify results
        for i, result in enumerate(results):
            assert isinstance(result, dict)
            assert 'answer' in result
            assert result['question'] == questions[i]
```

---

## 📚 Summary

This AI tools integration documentation provides:

1. **🎯 Complete Architecture** - AI system design and components
2. **🔧 Integration Details** - Google Gemini AI setup and configuration
3. **📝 Tool Implementations** - Resume analyzer, text generator, QA bot
4. **📊 Analytics System** - Usage tracking and performance monitoring
5. **🔧 Error Handling** - Comprehensive error management and reliability
6. **🚀 Performance** - Caching, rate limiting, and optimization
7. **🔍 Testing** - Unit tests and integration tests

This documentation enables developers to:
- Understand the complete AI integration architecture
- Modify and extend AI tools
- Implement new AI features
- Debug and optimize AI services
- Monitor AI usage and costs

---

<div align="center">
  <p>🤖 AI tools integration designed for scalability and reliability</p>
  <p>📖 Comprehensive documentation for developer productivity</p>
</div>
