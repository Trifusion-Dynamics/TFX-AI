"""
Authentication schemas.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
from pydantic import ConfigDict
from app.schemas.user import UserResponse


class RegisterRequest(BaseModel):
    """User registration request."""
    model_config = ConfigDict(from_attributes=True)
    
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=255)
    password: str = Field(..., min_length=8, max_length=255)
    confirm_password: str = Field(..., min_length=8, max_length=255)
    
    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v):
        import re
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v
    
    @field_validator('confirm_password')
    @classmethod
    def passwords_match(cls, v, info):
        if 'password' in info.data and v != info.data['password']:
            raise ValueError('Passwords do not match')
        return v


class LoginRequest(BaseModel):
    """User login request."""
    model_config = ConfigDict(from_attributes=True)
    
    email: str = Field(..., min_length=5, max_length=255)
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    """Token response schema."""
    model_config = ConfigDict(from_attributes=True)
    
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Optional[UserResponse] = None


class ForgotPasswordRequest(BaseModel):
    """Forgot password request."""
    model_config = ConfigDict(from_attributes=True)
    
    email: str = Field(..., min_length=5, max_length=255)


class ResetPasswordRequest(BaseModel):
    """Reset password request."""
    model_config = ConfigDict(from_attributes=True)
    
    token: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=255)
    confirm_password: str = Field(..., min_length=8, max_length=255)
    
    @field_validator('new_password')
    @classmethod
    def validate_password_strength(cls, v):
        import re
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v
    
    @field_validator('confirm_password')
    @classmethod
    def passwords_match(cls, v, info):
        if 'new_password' in info.data and v != info.data['new_password']:
            raise ValueError('Passwords do not match')
        return v


class ChangePasswordRequest(BaseModel):
    """Change password request."""
    model_config = ConfigDict(from_attributes=True)
    
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=255)
    confirm_password: str = Field(..., min_length=8, max_length=255)
    
    @field_validator('new_password')
    @classmethod
    def validate_password_strength(cls, v):
        import re
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v
    
    @field_validator('confirm_password')
    @classmethod
    def passwords_match(cls, v, info):
        if 'new_password' in info.data and v != info.data['new_password']:
            raise ValueError('Passwords do not match')
        return v
