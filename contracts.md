# F.A.T.E Landing Page - API Contracts & Integration Guide

## Overview
This document outlines the API contracts and integration plan for the F.A.T.E (From Ashes To Empire) EdTech landing page backend implementation.

## Current Mock Data (to be replaced)

### Frontend Mock Implementation
- **File**: `/app/frontend/src/mockData.js`
- **Mock Function**: `mockFormSubmission.submitFeedback()`
- **Current Behavior**: Console logs form data, shows success message after 1-second delay

### Form Data Structure
```javascript
{
  name: string,
  email: string, 
  message: string
}
```

## Backend API Requirements

### 1. Contact Form Submission Endpoint

**Endpoint**: `POST /api/contact/submit`

**Request Body**:
```json
{
  "name": "string (required, 2-50 chars)",
  "email": "string (required, valid email format)",
  "message": "string (required, 10-1000 chars)"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Your message has been sent successfully!"
}
```

**Response Error (400/500)**:
```json
{
  "success": false,
  "error": "Error message description"
}
```

### 2. Email Integration Requirements

**Target Email**: `fateunite1807@gmail.com`

**Email Template**:
- **Subject**: `New Contact Form Submission from F.A.T.E Website`
- **Body**: Should include sender name, email, message, and timestamp
- **From**: System email (to be configured)
- **Reply-To**: Sender's email for easy response

### 3. Database Schema

**Collection**: `contact_submissions`

**Document Structure**:
```javascript
{
  _id: ObjectId,
  name: string,
  email: string,
  message: string,
  submittedAt: Date,
  status: string, // 'sent', 'failed', 'pending'
  emailSentAt: Date (optional),
  ipAddress: string (optional)
}
```

## Frontend Integration Changes

### Files to Update
1. **`/app/frontend/src/components/FateLandingPage.jsx`**
   - Replace mock `handleFormSubmit` with actual API call
   - Add proper error handling and loading states
   - Update success/error message display

### Integration Points

**Current Mock Code** (to replace):
```javascript
const handleFormSubmit = (e) => {
  e.preventDefault();
  console.log('Form submitted:', formData);
  setIsSubmitted(true);
  setTimeout(() => setIsSubmitted(false), 3000);
  setFormData({ name: '', email: '', message: '' });
};
```

**New API Integration**:
```javascript
const handleFormSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const response = await axios.post(`${API}/contact/submit`, formData);
    if (response.data.success) {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    }
  } catch (error) {
    setError(error.response?.data?.error || 'Failed to send message');
  } finally {
    setIsLoading(false);
  }
};
```

## Technical Implementation Plan

### Backend Components to Implement
1. **Email Service**: Configure SMTP or email service for sending emails
2. **Contact Controller**: Handle form validation and email sending
3. **Contact Model**: MongoDB schema for storing submissions
4. **Input Validation**: Sanitize and validate form inputs
5. **Rate Limiting**: Prevent spam submissions
6. **Error Handling**: Comprehensive error responses

### Environment Variables Needed
- Email service configuration (SMTP settings or service API key)
- Email sender details
- Rate limiting settings

### Security Considerations
- Input sanitization for XSS prevention
- Email validation
- Rate limiting to prevent spam
- CORS configuration
- Request size limits

## Testing Requirements

### Backend Testing
- Contact form submission with valid data
- Input validation (empty fields, invalid email, long messages)
- Email delivery verification
- Database storage verification
- Error handling scenarios

### Frontend Integration Testing  
- Form submission with loading states
- Success message display
- Error message handling
- Form field validation
- Network error scenarios

## Deployment Considerations
- Email service configuration in production
- Environment variable management
- Database permissions for contact collection
- SMTP/email service credentials security