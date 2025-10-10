from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional
import uuid

class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    message: str = Field(..., min_length=10, max_length=1000)
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="pending")  # pending, sent, failed
    email_sent_at: Optional[datetime] = None
    ip_address: Optional[str] = None

class ContactSubmissionCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=50, description="Full name")
    email: EmailStr = Field(..., description="Valid email address")
    message: str = Field(..., min_length=10, max_length=1000, description="Message content")

class ContactResponse(BaseModel):
    success: bool
    message: str
    error: Optional[str] = None