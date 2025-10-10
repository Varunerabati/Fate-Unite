from fastapi import APIRouter, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from typing import Dict, Any
import logging
import asyncio

from models.contact import ContactSubmission, ContactSubmissionCreate, ContactResponse
from services.email_service import email_service

logger = logging.getLogger(__name__)
contact_router = APIRouter(prefix="/contact", tags=["contact"])

def init_contact_routes(db: AsyncIOMotorDatabase):
    """Initialize contact routes with database dependency"""
    
    @contact_router.post("/submit", response_model=ContactResponse)
    async def submit_contact_form(
        contact_request: ContactSubmissionCreate,
        request: Request
    ):
        """
        Handle contact form submission
        - Validates input data
        - Stores submission in database
        - Sends email notification
        """
        try:
            # Get client IP address
            client_ip = request.client.host if request.client else "unknown"
            
            # Create contact submission record
            contact_data = ContactSubmission(
                **contact_request.dict(),
                ip_address=client_ip
            )
            
            # Store in database
            submission_dict = contact_data.dict()
            result = await db.contact_submissions.insert_one(submission_dict)
            
            if not result.inserted_id:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to store contact submission"
                )
            
            # Send email notification asynchronously
            email_data = {
                'name': contact_data.name,
                'email': contact_data.email,
                'message': contact_data.message
            }
            
            # Run email sending in background
            email_success = await asyncio.get_event_loop().run_in_executor(
                None, email_service.send_contact_form_email, email_data
            )
            
            # Update submission status
            update_data = {
                'status': 'sent' if email_success else 'failed'
            }
            
            if email_success:
                update_data['email_sent_at'] = datetime.utcnow()
            
            await db.contact_submissions.update_one(
                {'id': contact_data.id},
                {'$set': update_data}
            )
            
            if not email_success:
                logger.warning(f"Email sending failed for contact submission {contact_data.id}")
                # Still return success to user since form was submitted and stored
            
            logger.info(f"Contact form submitted successfully by {contact_data.name} ({contact_data.email})")
            
            return ContactResponse(
                success=True,
                message="Thank you for your message! We'll get back to you soon."
            )
            
        except ValueError as e:
            logger.error(f"Validation error in contact form: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Invalid input: {str(e)}"
            )
        except Exception as e:
            logger.error(f"Unexpected error in contact form submission: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="An error occurred while processing your request. Please try again."
            )
    
    @contact_router.get("/submissions")
    async def get_contact_submissions(skip: int = 0, limit: int = 50):
        """
        Get contact form submissions (for admin use)
        """
        try:
            submissions = await db.contact_submissions.find(
                {},
                {'_id': 0}  # Exclude MongoDB _id field
            ).skip(skip).limit(limit).sort("submitted_at", -1).to_list(limit)
            
            return {
                'success': True,
                'submissions': submissions,
                'count': len(submissions)
            }
            
        except Exception as e:
            logger.error(f"Error fetching contact submissions: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to fetch submissions"
            )
    
    return contact_router