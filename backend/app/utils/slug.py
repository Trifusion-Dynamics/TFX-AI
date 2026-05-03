"""
Slug generation utility functions.
"""

import re
import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from slugify import slugify
import logging

logger = logging.getLogger(__name__)


def generate_slug(title: str) -> str:
    """
    Generate URL-friendly slug from title using python_slugify.
    """
    return slugify(title)


def generate_unique_slug(title: str, existing_slugs: List[str] = None) -> str:
    """
    Generate unique slug by adding number if it exists.
    """
    base_slug = generate_slug(title)
    slug = base_slug
    
    if existing_slugs:
        counter = 1
        while slug in existing_slugs:
            slug = f"{base_slug}-{counter}"
            counter += 1
    
    return slug


def validate_slug(slug: str) -> tuple[bool, Optional[str]]:
    """
    Validate slug format.
    """
    errors = []
    
    if len(slug) < 2:
        errors.append("Slug must be at least 2 characters long")
    
    if len(slug) > 255:
        errors.append("Slug must be less than 255 characters long")
    
    # Only allow lowercase letters, numbers, and hyphens
    if not re.match(r'^[a-z0-9-]+$', slug):
        errors.append("Slug can only contain lowercase letters, numbers, and hyphens")
    
    # Cannot start or end with hyphen
    if slug.startswith('-') or slug.endswith('-'):
        errors.append("Slug cannot start or end with a hyphen")
    
    # Cannot have consecutive hyphens
    if '--' in slug:
        errors.append("Slug cannot contain consecutive hyphens")
    
    return len(errors) == 0, "; ".join(errors) if errors else None


async def generate_unique_slug_db(title: str, model_class, db: AsyncSession) -> str:
    """
    Generate unique slug from title, checking database for uniqueness.
    """
    base_slug = generate_slug(title)
    slug = base_slug
    counter = 2
    
    while True:
        # Check if slug exists in database
        result = await db.execute(
            select(model_class).where(model_class.slug == slug)
        )
        existing = result.scalar_one_or_none()
        
        if not existing:
            return slug
        
        slug = f"{base_slug}-{counter}"
        counter += 1
