"""
Email service for sending notifications.
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import os
from app.core.config import settings


class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.admin_email = os.getenv("ADMIN_EMAIL", "admin@tfxai.com")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@tfxai.com")

    async def send_admin_notification(self, applicant_name: str, applicant_email: str, job_title: str, application_id: str):
        """Send email notification to admin about new job application."""
        subject = f"New Job Application: {applicant_name} for {job_title}"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
                <h1 style="color: white; margin: 0; font-size: 28px;">TFX AI - New Job Application</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">A new candidate has applied for a position</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Application Details</h2>
                
                <div style="margin-bottom: 15px;">
                    <strong style="color: #555;">Applicant Name:</strong>
                    <span style="color: #333; margin-left: 10px;">{applicant_name}</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong style="color: #555;">Email Address:</strong>
                    <span style="color: #333; margin-left: 10px;">{applicant_email}</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong style="color: #555;">Applied Position:</strong>
                    <span style="color: #333; margin-left: 10px;">{job_title}</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong style="color: #555;">Application ID:</strong>
                    <span style="color: #333; margin-left: 10px;">{application_id}</span>
                </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://tfxai.com/admin/applications" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                    View Application in Admin Panel
                </a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
                <p>This email was sent automatically by TFX AI Application System.</p>
                <p>Please do not reply to this email.</p>
            </div>
        </body>
        </html>
        """
        
        await self._send_email(self.admin_email, subject, html_content)

    async def send_application_confirmation(self, applicant_email: str, applicant_name: str, job_title: str):
        """Send confirmation email to applicant."""
        subject = f"Application Received - {job_title} at TFX AI"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Applying!</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">TFX AI</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #333; margin-top: 0;">Dear {applicant_name},</h2>
                
                <p style="color: #555; line-height: 1.6;">
                    Thank you for your interest in the <strong>{job_title}</strong> position at TFX AI. 
                    We have successfully received your application and our team will review it carefully.
                </p>
                
                <p style="color: #555; line-height: 1.6;">
                    Our hiring team will review your application and contact you within 3-5 business days 
                    if your profile matches our requirements. All applicants will be notified of their 
                    application status via email.
                </p>
                
                <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #2c5aa0; margin-top: 0;">Next Steps:</h3>
                    <ul style="color: #555; line-height: 1.6;">
                        <li>Application review by our hiring team</li>
                        <li>Shortlisted candidates will be contacted for interviews</li>
                        <li>All applicants will receive status updates</li>
                    </ul>
                </div>
                
                <p style="color: #555; line-height: 1.6;">
                    For any questions about your application, please contact us at careers@tfxai.com
                </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <div style="color: #666; font-size: 14px;">
                    <p>Follow us on social media for updates</p>
                    <div style="margin: 15px 0;">
                        <a href="#" style="margin: 0 10px; color: #667eea;">LinkedIn</a> •
                        <a href="#" style="margin: 0 10px; color: #667eea;">Twitter</a> •
                        <a href="#" style="margin: 0 10px; color: #667eea;">GitHub</a>
                    </div>
                </div>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
                <p>© 2024 TFX AI. All rights reserved.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </body>
        </html>
        """
        
        await self._send_email(applicant_email, subject, html_content)

    async def _send_email(self, to_email: str, subject: str, html_content: str):
        """Send email using SMTP."""
        if not all([self.smtp_username, self.smtp_password]):
            print("Email credentials not configured. Skipping email send.")
            return

        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.from_email
            msg['To'] = to_email

            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)

            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(msg)
            server.quit()
            
            print(f"Email sent successfully to {to_email}")
            
        except Exception as e:
            print(f"Failed to send email: {str(e)}")


# Global email service instance
email_service = EmailService()
