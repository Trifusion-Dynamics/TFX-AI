"""
Email service for sending emails.
"""

import logging
from typing import Optional
import aiosmtplib
from email.message import EmailMessage
from app.core.config import settings

logger = logging.getLogger(__name__)


async def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    from_email: Optional[str] = None
) -> bool:
    """
    Send email using SMTP.
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML content of the email
        from_email: Sender email (optional, uses default from settings)
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    if not settings.mail_username or not settings.mail_password:
        logger.warning("Email settings not configured, skipping email send")
        return False
    
    try:
        # Create email message
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = from_email or settings.mail_from
        msg["To"] = to_email
        msg.set_content(html_content, subtype="html")
        
        # Send email
        await aiosmtplib.send(
            msg,
            hostname=settings.mail_server,
            port=settings.mail_port,
            start_tls=settings.mail_starttls,
            username=settings.mail_username,
            password=settings.mail_password,
        )
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False
