"""
Application configuration using Pydantic BaseSettings.
"""

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )
    
    # App Configuration
    app_name: str = Field(default="TFX AI", description="Application name")
    app_env: str = Field(default="development", description="Application environment")
    app_port: int = Field(default=8000, description="Application port")
    client_url: str = Field(default="http://localhost:3000", description="Frontend URL")
    secret_key: str = Field(alias="SECRET_KEY", description="Application secret key")
    
    # Database Configuration
    database_url: str = Field(alias="DATABASE_URL", description="NeonDB database URL")
    
    # JWT Configuration
    jwt_secret: str = Field(alias="JWT_SECRET", description="JWT secret key")
    jwt_algorithm: str = Field(default="HS256", description="JWT algorithm")
    access_token_expire_minutes: int = Field(default=15, description="Access token expiration in minutes")
    refresh_token_expire_days: int = Field(default=7, description="Refresh token expiration in days")
    
    # Cloudinary Configuration
    cloudinary_cloud_name: Optional[str] = Field(default=None, description="Cloudinary cloud name")
    cloudinary_api_key: Optional[str] = Field(default=None, description="Cloudinary API key")
    cloudinary_api_secret: Optional[str] = Field(default=None, description="Cloudinary API secret")
    
    # Email Configuration
    mail_username: Optional[str] = Field(default=None, description="Email username")
    mail_password: Optional[str] = Field(default=None, description="Email password")
    mail_from: Optional[str] = Field(default=None, description="From email address")
    mail_server: str = Field(default="smtp.gmail.com", description="SMTP server")
    mail_port: int = Field(default=587, description="SMTP port")
    mail_starttls: bool = Field(default=True, description="Use STARTTLS")
    mail_ssl_tls: bool = Field(default=False, description="Use SSL/TLS")
    
    # Gemini AI Configuration
    gemini_api_key: Optional[str] = Field(default=None, description="Google Gemini API key")
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._validate_required_fields()
    
    def _validate_required_fields(self):
        """
        Validate that all required fields are present.
        """
        required_fields = [
            "secret_key",
            "database_url", 
            "jwt_secret"
        ]
        
        missing_fields = []
        for field in required_fields:
            value = getattr(self, field)
            if not value:
                missing_fields.append(field)
        
        if missing_fields:
            raise ValueError(
                f"Missing or invalid required environment variables: {', '.join(missing_fields)}. "
                f"Please check your .env file."
            )
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.app_env.lower() == "development"
    
    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.app_env.lower() == "production"
    
    @property
    def cors_origins(self) -> list[str]:
        """Get CORS allowed origins."""
        return [self.client_url, "http://localhost:3000"]


# Create global settings instance
settings = Settings()
