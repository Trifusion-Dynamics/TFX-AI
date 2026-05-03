"""
Custom exception handlers for the application.
"""

from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from typing import Optional, Any, Dict, List
import logging

logger = logging.getLogger(__name__)


class AppException(Exception):
    """
    Custom application exception.
    """
    
    def __init__(
        self,
        status_code: int,
        message: str,
        errors: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None
    ):
        self.status_code = status_code
        self.message = message
        self.errors = errors
        self.headers = headers
        super().__init__(message)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """
    Handler for custom AppException.
    """
    logger.error(f"AppException: {exc.message} - Status: {exc.status_code}")
    
    response_data = {
        "success": False,
        "message": exc.message,
        "errors": exc.errors
    }
    
    return JSONResponse(
        status_code=exc.status_code,
        content=response_data,
        headers=exc.headers
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """
    Handler for request validation errors.
    """
    logger.error(f"Validation error: {exc.errors()}")
    
    # Format validation errors
    formatted_errors = {}
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"])
        formatted_errors[field] = error["msg"]
    
    response_data = {
        "success": False,
        "message": "Validation failed",
        "errors": formatted_errors
    }
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=response_data
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """
    Handler for HTTPException.
    """
    logger.error(f"HTTPException: {exc.detail} - Status: {exc.status_code}")
    
    response_data = {
        "success": False,
        "message": str(exc.detail),
        "errors": None
    }
    
    return JSONResponse(
        status_code=exc.status_code,
        content=response_data
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Handler for general exceptions.
    """
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    
    response_data = {
        "success": False,
        "message": "Internal server error",
        "errors": None
    }
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=response_data
    )


def register_exception_handlers(app):
    """
    Register all exception handlers with the FastAPI app.
    """
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
