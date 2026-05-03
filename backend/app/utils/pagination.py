"""
Pagination utility functions.
"""

from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import Query
import math
import logging

logger = logging.getLogger(__name__)


def create_pagination_meta(
    total: int,
    page: int,
    limit: int
) -> Dict[str, Any]:
    """
    Create pagination metadata.
    """
    total_pages = math.ceil(total / limit) if limit > 0 else 0
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages
    }


def calculate_offset(page: int, limit: int) -> int:
    """
    Calculate database offset for pagination.
    """
    return (page - 1) * limit if page > 1 else 0


def validate_pagination_params(
    page: int = 1,
    limit: int = 10,
    max_limit: int = 100
) -> tuple[int, int]:
    """
    Validate and normalize pagination parameters.
    """
    # Validate page
    if page < 1:
        page = 1
    
    # Validate limit
    if limit < 1:
        limit = 10
    elif limit > max_limit:
        limit = max_limit
    
    return page, limit


def get_pagination_links(
    base_url: str,
    total: int,
    page: int,
    limit: int
) -> Dict[str, Optional[str]]:
    """
    Generate pagination links for API responses.
    """
    total_pages = math.ceil(total / limit) if limit > 0 else 0
    
    links = {
        "first": f"{base_url}?page=1&limit={limit}" if total_pages > 0 else None,
        "last": f"{base_url}?page={total_pages}&limit={limit}" if total_pages > 0 else None,
        "prev": f"{base_url}?page={page-1}&limit={limit}" if page > 1 else None,
        "next": f"{base_url}?page={page+1}&limit={limit}" if page < total_pages else None,
    }
    
    return links


async def paginate(query, page: int, limit: int, db: AsyncSession):
    """
    Paginate a database query and return data with metadata.
    """
    # Count total items
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Calculate offset and apply pagination
    offset = (page - 1) * limit
    paginated_query = query.offset(offset).limit(limit)
    
    # Execute paginated query
    result = await db.execute(paginated_query)
    data = result.scalars().all()
    
    # Calculate total pages
    total_pages = math.ceil(total / limit) if limit > 0 else 0
    
    return {
        "data": list(data),
        "meta": {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        }
    }


def get_pagination_params(page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)):
    """
    Get pagination parameters for FastAPI endpoints.
    """
    return {"page": page, "limit": limit}
