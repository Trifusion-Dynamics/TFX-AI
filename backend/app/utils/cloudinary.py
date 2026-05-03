"""
Cloudinary utility functions for file uploads.
"""

import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from app.core.config import settings
from app.core.exceptions import AppException
import logging

logger = logging.getLogger(__name__)

# Configure cloudinary on import
if all([settings.cloudinary_cloud_name, settings.cloudinary_api_key, settings.cloudinary_api_secret]):
    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret
    )
else:
    logger.warning("Cloudinary configuration incomplete. Upload service will be disabled.")


class CloudinaryService:
    """
    Cloudinary service for file uploads.
    """
    
    def __init__(self):
        if not all([settings.cloudinary_cloud_name, settings.cloudinary_api_key, settings.cloudinary_api_secret]):
            logger.warning("Cloudinary configuration incomplete. Upload service will be disabled.")
            self.enabled = False
            return
        
        cloudinary.config(
            cloud_name=settings.cloudinary_cloud_name,
            api_key=settings.cloudinary_api_key,
            api_secret=settings.cloudinary_api_secret
        )
        self.enabled = True
    
    async def upload_file(
        self,
        file_path: str,
        folder: str = "tfxai",
        resource_type: str = "auto"
    ) -> dict:
        """
        Upload file to Cloudinary.
        """
        if not self.enabled:
            raise Exception("Cloudinary service is disabled")
        
        try:
            result = cloudinary.uploader.upload(
                file_path,
                folder=folder,
                resource_type=resource_type
            )
            
            logger.info(f"File uploaded successfully: {result['public_id']}")
            return result
            
        except Exception as e:
            logger.error(f"Failed to upload file: {e}")
            raise
    
    async def delete_file(self, public_id: str) -> bool:
        """
        Delete file from Cloudinary.
        """
        if not self.enabled:
            return False
        
        try:
            result = cloudinary.uploader.destroy(public_id)
            success = result.get("result") == "ok"
            
            if success:
                logger.info(f"File deleted successfully: {public_id}")
            else:
                logger.warning(f"Failed to delete file: {public_id}")
            
            return success
            
        except Exception as e:
            logger.error(f"Error deleting file {public_id}: {e}")
            return False


async def upload_image(file: UploadFile, folder: str) -> str:
    """
    Upload image to Cloudinary and return secure_url.
    Validates file type and size, raises AppException if invalid.
    """
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise AppException(400, "Invalid file type. Only JPEG, PNG, and WebP images are allowed.")
    
    # Validate file size (5MB max)
    max_size = 5 * 1024 * 1024  # 5MB in bytes
    file_content = await file.read()
    if len(file_content) > max_size:
        raise AppException(400, "File size too large. Maximum size is 5MB.")
    
    # Reset file position
    await file.seek(0)
    
    try:
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file_content,
            folder=folder,
            resource_type="image",
            format=file.content_type.split("/")[-1]
        )
        
        logger.info(f"Image uploaded successfully: {result['public_id']}")
        return result["secure_url"]
        
    except Exception as e:
        logger.error(f"Failed to upload image: {e}")
        raise AppException(500, "Failed to upload image to cloud storage")


async def delete_image(public_id: str) -> None:
    """
    Delete image from Cloudinary by public_id.
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        success = result.get("result") == "ok"
        
        if success:
            logger.info(f"Image deleted successfully: {public_id}")
        else:
            logger.warning(f"Failed to delete image: {public_id}")
        
    except Exception as e:
        logger.error(f"Error deleting image {public_id}: {e}")
        # Don't raise exception for delete operations, just log it
