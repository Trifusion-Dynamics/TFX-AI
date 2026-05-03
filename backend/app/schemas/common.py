"""
Common Pydantic schemas for API responses.
"""

from pydantic import BaseModel, Field
from typing import TypeVar, Generic, Optional, List
from pydantic import ConfigDict


T = TypeVar('T')


class ApiResponse(BaseModel, Generic[T]):
    """
    Standard API response wrapper.
    """
    model_config = ConfigDict(from_attributes=True)
    
    success: bool = True
    message: str
    data: Optional[T] = None


class PaginationMeta(BaseModel):
    """
    Pagination metadata.
    """
    model_config = ConfigDict(from_attributes=True)
    
    total: int = Field(description="Total number of items")
    page: int = Field(description="Current page number")
    limit: int = Field(description="Number of items per page")
    total_pages: int = Field(description="Total number of pages")


class PaginatedResponse(BaseModel, Generic[T]):
    """
    Paginated API response wrapper.
    """
    model_config = ConfigDict(from_attributes=True)
    
    success: bool = True
    data: List[T] = Field(description="List of items")
    meta: PaginationMeta = Field(description="Pagination metadata")


class SuccessResponse(BaseModel):
    """
    Simple success response.
    """
    model_config = ConfigDict(from_attributes=True)
    
    success: bool = True
    message: str


class ErrorResponse(BaseModel):
    """
    Error response model.
    """
    model_config = ConfigDict(from_attributes=True)
    
    success: bool = False
    message: str
    errors: Optional[dict] = None


class HealthResponse(BaseModel):
    """
    Health check response.
    """
    model_config = ConfigDict(from_attributes=True)
    
    status: str
    timestamp: str
