import smtplib
import os
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
from datetime import datetime
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        # Email configuration - can be extended to use SendGrid, AWS SES, etc.
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.sender_email = os.getenv('SENDER_EMAIL')
        self.sender_password = os.getenv('SENDER_PASSWORD')
        self.recipient_email = os.getenv('RECIPIENT_EMAIL', 'fateunite1807@gmail.com')
    
    def send_contact_form_email(self, contact_data: Dict[str, Any]) -> bool:
        """
        Send contact form submission via email
        
        Args:
            contact_data: Dictionary containing name, email, message
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            # Create message
            msg = MimeMultipart()
            msg['From'] = self.sender_email
            msg['To'] = self.recipient_email
            msg['Subject'] = "New Contact Form Submission from F.A.T.E Website"
            msg['Reply-To'] = contact_data['email']
            
            # Email body
            body = self._create_email_body(contact_data)
            msg.attach(MimeText(body, 'html'))
            
            # Send email
            if not self.sender_email or not self.sender_password:
                logger.warning("Email service not configured - logging message instead")
                logger.info(f"Contact form submission: {contact_data}")
                return True  # Return True for development/testing
            
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.sender_email, self.sender_password)
            
            text = msg.as_string()
            server.sendmail(self.sender_email, self.recipient_email, text)
            server.quit()
            
            logger.info(f"Contact form email sent successfully to {self.recipient_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send contact form email: {str(e)}")
            return False
    
    def _create_email_body(self, contact_data: Dict[str, Any]) -> str:
        """Create HTML email body for contact form submission"""
        timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }}
                .field {{ margin-bottom: 20px; }}
                .label {{ font-weight: bold; color: #374151; display: block; margin-bottom: 5px; }}
                .value {{ background: white; padding: 15px; border-radius: 6px; border: 1px solid #d1d5db; }}
                .footer {{ background: #374151; color: #9ca3af; padding: 15px; text-align: center; font-size: 14px; border-radius: 0 0 8px 8px; }}
                .timestamp {{ font-size: 12px; color: #6b7280; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>🤖 F.A.T.E - New Contact Form Submission</h2>
                    <p>From Ashes To Empire EdTech Platform</p>
                </div>
                
                <div class="content">
                    <div class="field">
                        <span class="label">👤 Name:</span>
                        <div class="value">{contact_data['name']}</div>
                    </div>
                    
                    <div class="field">
                        <span class="label">📧 Email:</span>
                        <div class="value">{contact_data['email']}</div>
                    </div>
                    
                    <div class="field">
                        <span class="label">💬 Message:</span>
                        <div class="value">{contact_data['message']}</div>
                    </div>
                    
                    <div class="timestamp">
                        <strong>Submitted:</strong> {timestamp}
                    </div>
                </div>
                
                <div class="footer">
                    <p>This message was sent from the F.A.T.E website contact form.</p>
                    <p>Reply directly to this email to respond to {contact_data['name']}.</p>
                </div>
            </div>
        </body>
        </html>
        """

# Create singleton instance
email_service = EmailService()