"""
Email utility functions.
"""

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """
    Email service for sending notifications.
    """
    
    def __init__(self):
        if not all([settings.mail_username, settings.mail_password, settings.mail_from]):
            logger.warning("Email configuration incomplete. Email service will be disabled.")
            self.enabled = False
            return
        
        self.conf = ConnectionConfig(
            MAIL_USERNAME=settings.mail_username,
            MAIL_PASSWORD=settings.mail_password,
            MAIL_FROM=settings.mail_from,
            MAIL_PORT=settings.mail_port,
            MAIL_SERVER=settings.mail_server,
            MAIL_STARTTLS=settings.mail_starttls,
            MAIL_SSL_TLS=settings.mail_ssl_tls,
            USE_CREDENTIALS=True,
            VALIDATE_CERTS=True
        )
        self.fm = FastMail(self.conf)
        self.enabled = True
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_body: str = None,
        body: str = None
    ) -> bool:
        """
        Send email.
        """
        if not self.enabled:
            logger.warning("Email service is disabled. Skipping email send.")
            return False
        
        try:
            message = MessageSchema(
                subject=subject,
                recipients=[to_email],
                body=body or html_body,
                subtype="html" if html_body else "plain"
            )
            
            await self.fm.send_message(message)
            logger.info(f"Email sent successfully to: {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            return False


# Create global email service instance
email_service = EmailService()


async def send_email(to: str, subject: str, body: str) -> None:
    """
    Send a simple email.
    """
    await email_service.send_email(to, subject, body=body)


async def send_verification_email(email: str, name: str, token: str) -> None:
    """
    Send email verification email with HTML template.
    """
    verify_url = f"{settings.client_url}/verify-email?token={token}"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - TFX AI</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #ffffff;
                background-color: #1a1a1a;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                text-align: center;
                padding: 30px 0;
                border-bottom: 2px solid #333;
            }}
            .logo {{
                font-size: 32px;
                font-weight: bold;
                color: #00ff88;
                margin-bottom: 10px;
            }}
            .content {{
                padding: 30px 0;
                text-align: center;
            }}
            .button {{
                display: inline-block;
                padding: 15px 30px;
                background-color: #00ff88;
                color: #1a1a1a;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                padding: 20px 0;
                border-top: 2px solid #333;
                color: #888;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">TFX AI</div>
                <p>Artificial Intelligence Solutions</p>
            </div>
            <div class="content">
                <h2>Verify Your Email Address</h2>
                <p>Hi {name},</p>
                <p>Thank you for signing up with TFX AI! Please click the button below to verify your email address and activate your account.</p>
                <a href="{verify_url}" class="button">Verify Email</a>
                <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                <p style="word-break: break-all;">{verify_url}</p>
                <p>This link will expire in 24 hours.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 TFX AI. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    await email_service.send_email(email, "Verify Your Email - TFX AI", html_body=html_body)


async def send_password_reset_email(email: str, name: str, token: str) -> None:
    """
    Send password reset email with HTML template.
    """
    reset_url = f"{settings.client_url}/reset-password?token={token}"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - TFX AI</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #ffffff;
                background-color: #1a1a1a;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                text-align: center;
                padding: 30px 0;
                border-bottom: 2px solid #333;
            }}
            .logo {{
                font-size: 32px;
                font-weight: bold;
                color: #00ff88;
                margin-bottom: 10px;
            }}
            .content {{
                padding: 30px 0;
                text-align: center;
            }}
            .button {{
                display: inline-block;
                padding: 15px 30px;
                background-color: #00ff88;
                color: #1a1a1a;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                padding: 20px 0;
                border-top: 2px solid #333;
                color: #888;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">TFX AI</div>
                <p>Artificial Intelligence Solutions</p>
            </div>
            <div class="content">
                <h2>Reset Your Password</h2>
                <p>Hi {name},</p>
                <p>We received a request to reset your password. Click the button below to set a new password.</p>
                <a href="{reset_url}" class="button">Reset Password</a>
                <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                <p style="word-break: break-all;">{reset_url}</p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this password reset, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 TFX AI. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    await email_service.send_email(email, "Reset Your Password - TFX AI", html_body=html_body)


async def send_welcome_email(email: str, name: str) -> None:
    """
    Send welcome email with HTML template.
    """
    site_url = settings.client_url
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to TFX AI</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #ffffff;
                background-color: #1a1a1a;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                text-align: center;
                padding: 30px 0;
                border-bottom: 2px solid #333;
            }}
            .logo {{
                font-size: 32px;
                font-weight: bold;
                color: #00ff88;
                margin-bottom: 10px;
            }}
            .content {{
                padding: 30px 0;
                text-align: center;
            }}
            .button {{
                display: inline-block;
                padding: 15px 30px;
                background-color: #00ff88;
                color: #1a1a1a;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                padding: 20px 0;
                border-top: 2px solid #333;
                color: #888;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">TFX AI</div>
                <p>Artificial Intelligence Solutions</p>
            </div>
            <div class="content">
                <h2>Welcome to TFX AI!</h2>
                <p>Hi {name},</p>
                <p>Welcome aboard! We're excited to have you as part of the TFX AI community.</p>
                <p>Your account has been successfully verified and you're now ready to explore our AI-powered solutions.</p>
                <a href="{site_url}" class="button">Visit TFX AI</a>
                <p>If you have any questions, feel free to reach out to our support team.</p>
                <p>Best regards,<br>The TFX AI Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 TFX AI. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    await email_service.send_email(email, "Welcome to TFX AI!", html_body=html_body)


async def send_contact_confirmation(email: str, name: str, subject: str) -> None:
    """
    Send contact form confirmation email.
    """
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Confirmation - TFX AI</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #ffffff;
                background-color: #1a1a1a;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                text-align: center;
                padding: 30px 0;
                border-bottom: 2px solid #333;
            }}
            .logo {{
                font-size: 32px;
                font-weight: bold;
                color: #00ff88;
                margin-bottom: 10px;
            }}
            .content {{
                padding: 30px 0;
            }}
            .footer {{
                text-align: center;
                padding: 20px 0;
                border-top: 2px solid #333;
                color: #888;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">TFX AI</div>
                <p>Artificial Intelligence Solutions</p>
            </div>
            <div class="content">
                <h2>Thank You for Contacting Us!</h2>
                <p>Hi {name},</p>
                <p>We've received your message regarding: <strong>{subject}</strong></p>
                <p>Our team will review your inquiry and get back to you within 24 hours.</p>
                <p>We appreciate your interest in TFX AI and look forward to assisting you.</p>
                <p>Best regards,<br>The TFX AI Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 TFX AI. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    await email_service.send_email(email, "Contact Confirmation - TFX AI", html_body=html_body)


async def send_admin_lead_notification(lead_data: dict) -> None:
    """
    Send lead notification to admin email.
    """
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Lead Notification - TFX AI</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #ffffff;
                background-color: #1a1a1a;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                text-align: center;
                padding: 30px 0;
                border-bottom: 2px solid #333;
            }}
            .logo {{
                font-size: 32px;
                font-weight: bold;
                color: #00ff88;
                margin-bottom: 10px;
            }}
            .content {{
                padding: 30px 0;
            }}
            .lead-info {{
                background-color: #2a2a2a;
                padding: 20px;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .lead-info h3 {{
                color: #00ff88;
                margin-top: 0;
            }}
            .footer {{
                text-align: center;
                padding: 20px 0;
                border-top: 2px solid #333;
                color: #888;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">TFX AI</div>
                <p>Artificial Intelligence Solutions</p>
            </div>
            <div class="content">
                <h2>New Lead Received!</h2>
                <p>A new lead has submitted through the website contact form:</p>
                
                <div class="lead-info">
                    <h3>Lead Details</h3>
                    <p><strong>Name:</strong> {lead_data.get('name', 'N/A')}</p>
                    <p><strong>Email:</strong> {lead_data.get('email', 'N/A')}</p>
                    <p><strong>Phone:</strong> {lead_data.get('phone', 'N/A')}</p>
                    <p><strong>Company:</strong> {lead_data.get('company', 'N/A')}</p>
                    <p><strong>Service:</strong> {lead_data.get('service', 'N/A')}</p>
                    <p><strong>Message:</strong></p>
                    <p>{lead_data.get('message', 'N/A')}</p>
                </div>
                
                <p>Please follow up with this lead as soon as possible.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 TFX AI. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    await email_service.send_email(settings.mail_from, "New Lead Notification - TFX AI", html_body=html_body)
