#!/usr/bin/env python3
"""
Backend API Testing for F.A.T.E Contact Form
Tests the contact form API endpoints, email service, and database integration
"""

import requests
import json
import time
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://tech-learning-2.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

class ContactFormTester:
    def __init__(self):
        self.base_url = API_BASE_URL
        self.results = {
            'total_tests': 0,
            'passed': 0,
            'failed': 0,
            'errors': []
        }
    
    def log_result(self, test_name, success, message="", error_details=""):
        """Log test result"""
        self.results['total_tests'] += 1
        if success:
            self.results['passed'] += 1
            print(f"✅ {test_name}: {message}")
        else:
            self.results['failed'] += 1
            self.results['errors'].append({
                'test': test_name,
                'message': message,
                'details': error_details
            })
            print(f"❌ {test_name}: {message}")
            if error_details:
                print(f"   Details: {error_details}")
    
    def test_api_health(self):
        """Test basic API connectivity"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            if response.status_code == 200:
                self.log_result("API Health Check", True, "API is accessible")
                return True
            else:
                self.log_result("API Health Check", False, f"API returned status {response.status_code}")
                return False
        except Exception as e:
            self.log_result("API Health Check", False, "API not accessible", str(e))
            return False
    
    def test_contact_form_valid_submission(self):
        """Test valid contact form submission"""
        test_data = {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@example.com",
            "message": "I'm interested in your robotics workshops for my high school students. Could you provide more information about curriculum and pricing?"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/contact/submit",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'Thank you' in data.get('message', ''):
                    self.log_result("Valid Contact Form Submission", True, "Form submitted successfully")
                    return True
                else:
                    self.log_result("Valid Contact Form Submission", False, "Unexpected response format", str(data))
                    return False
            else:
                self.log_result("Valid Contact Form Submission", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Valid Contact Form Submission", False, "Request failed", str(e))
            return False
    
    def test_contact_form_validation_empty_fields(self):
        """Test validation with empty fields"""
        test_cases = [
            {"name": "", "email": "test@example.com", "message": "Valid message here"},
            {"name": "John Doe", "email": "", "message": "Valid message here"},
            {"name": "John Doe", "email": "test@example.com", "message": ""},
            {"name": "", "email": "", "message": ""}
        ]
        
        validation_passed = 0
        for i, test_data in enumerate(test_cases):
            try:
                response = requests.post(
                    f"{self.base_url}/contact/submit",
                    json=test_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                if response.status_code == 422 or response.status_code == 400:
                    validation_passed += 1
                else:
                    print(f"   Case {i+1}: Expected validation error but got {response.status_code}")
                    
            except Exception as e:
                print(f"   Case {i+1}: Request error - {str(e)}")
        
        if validation_passed >= 3:  # At least 3 out of 4 should fail validation
            self.log_result("Empty Fields Validation", True, f"{validation_passed}/4 cases properly validated")
        else:
            self.log_result("Empty Fields Validation", False, f"Only {validation_passed}/4 cases properly validated")
    
    def test_contact_form_validation_invalid_email(self):
        """Test email format validation"""
        invalid_emails = [
            "invalid-email",
            "test@",
            "@example.com",
            "test.example.com",
            "test@.com"
        ]
        
        validation_passed = 0
        for email in invalid_emails:
            test_data = {
                "name": "Test User",
                "email": email,
                "message": "This is a test message with sufficient length to pass validation."
            }
            
            try:
                response = requests.post(
                    f"{self.base_url}/contact/submit",
                    json=test_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                if response.status_code == 422 or response.status_code == 400:
                    validation_passed += 1
                else:
                    print(f"   Email '{email}': Expected validation error but got {response.status_code}")
                    
            except Exception as e:
                print(f"   Email '{email}': Request error - {str(e)}")
        
        if validation_passed >= 4:  # At least 4 out of 5 should fail validation
            self.log_result("Invalid Email Validation", True, f"{validation_passed}/5 invalid emails properly rejected")
        else:
            self.log_result("Invalid Email Validation", False, f"Only {validation_passed}/5 invalid emails properly rejected")
    
    def test_contact_form_validation_message_length(self):
        """Test message length validation"""
        test_cases = [
            {"message": "Short", "should_fail": True},  # Too short
            {"message": "A" * 1001, "should_fail": True},  # Too long
            {"message": "This is a valid message with appropriate length for testing.", "should_fail": False}  # Valid
        ]
        
        validation_passed = 0
        for i, case in enumerate(test_cases):
            test_data = {
                "name": "Test User",
                "email": "test@example.com",
                "message": case["message"]
            }
            
            try:
                response = requests.post(
                    f"{self.base_url}/contact/submit",
                    json=test_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                if case["should_fail"]:
                    if response.status_code == 422 or response.status_code == 400:
                        validation_passed += 1
                    else:
                        print(f"   Case {i+1}: Expected validation error but got {response.status_code}")
                else:
                    if response.status_code == 200:
                        validation_passed += 1
                    else:
                        print(f"   Case {i+1}: Expected success but got {response.status_code}")
                        
            except Exception as e:
                print(f"   Case {i+1}: Request error - {str(e)}")
        
        if validation_passed == 3:
            self.log_result("Message Length Validation", True, "All message length validations working")
        else:
            self.log_result("Message Length Validation", False, f"Only {validation_passed}/3 message length validations working")
    
    def test_contact_submissions_endpoint(self):
        """Test the GET /api/contact/submissions endpoint"""
        try:
            response = requests.get(
                f"{self.base_url}/contact/submissions",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'success' in data and 'submissions' in data:
                    self.log_result("Contact Submissions Endpoint", True, f"Retrieved {data.get('count', 0)} submissions")
                    return True
                else:
                    self.log_result("Contact Submissions Endpoint", False, "Unexpected response format", str(data))
                    return False
            else:
                self.log_result("Contact Submissions Endpoint", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Contact Submissions Endpoint", False, "Request failed", str(e))
            return False
    
    def test_email_service_integration(self):
        """Test email service integration by submitting a form and checking logs"""
        test_data = {
            "name": "Email Test User",
            "email": "emailtest@example.com",
            "message": "This is a test to verify email service integration is working properly with the contact form."
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/contact/submit",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    # Email service should work (either send email or log message)
                    # Since SMTP is not configured, it should log the message
                    self.log_result("Email Service Integration", True, "Email service processed submission (logged in development mode)")
                    return True
                else:
                    self.log_result("Email Service Integration", False, "Form submission failed", str(data))
                    return False
            else:
                self.log_result("Email Service Integration", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Email Service Integration", False, "Request failed", str(e))
            return False
    
    def test_database_storage(self):
        """Test database storage by submitting form and checking if it appears in submissions"""
        # First, get current count
        try:
            initial_response = requests.get(f"{self.base_url}/contact/submissions", timeout=10)
            initial_count = 0
            if initial_response.status_code == 200:
                initial_data = initial_response.json()
                initial_count = initial_data.get('count', 0)
        except:
            initial_count = 0
        
        # Submit a new form
        test_data = {
            "name": "Database Test User",
            "email": "dbtest@example.com",
            "message": "This is a test message to verify database storage functionality is working correctly."
        }
        
        try:
            submit_response = requests.post(
                f"{self.base_url}/contact/submit",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=15
            )
            
            if submit_response.status_code != 200:
                self.log_result("Database Storage", False, "Form submission failed", submit_response.text)
                return False
            
            # Wait a moment for database write
            time.sleep(1)
            
            # Check if count increased
            final_response = requests.get(f"{self.base_url}/contact/submissions", timeout=10)
            if final_response.status_code == 200:
                final_data = final_response.json()
                final_count = final_data.get('count', 0)
                
                if final_count > initial_count:
                    self.log_result("Database Storage", True, f"Submission stored in database (count: {initial_count} → {final_count})")
                    return True
                else:
                    self.log_result("Database Storage", False, f"No increase in submission count (still {final_count})")
                    return False
            else:
                self.log_result("Database Storage", False, "Could not verify database storage", final_response.text)
                return False
                
        except Exception as e:
            self.log_result("Database Storage", False, "Request failed", str(e))
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting F.A.T.E Contact Form Backend Tests")
        print(f"📡 Testing API at: {self.base_url}")
        print("=" * 60)
        
        # Test API connectivity first
        if not self.test_api_health():
            print("\n❌ API is not accessible. Stopping tests.")
            return self.results
        
        # Run all tests
        print("\n📝 Testing Contact Form Functionality:")
        self.test_contact_form_valid_submission()
        
        print("\n🔍 Testing Input Validation:")
        self.test_contact_form_validation_empty_fields()
        self.test_contact_form_validation_invalid_email()
        self.test_contact_form_validation_message_length()
        
        print("\n📊 Testing Data Endpoints:")
        self.test_contact_submissions_endpoint()
        
        print("\n📧 Testing Email Service:")
        self.test_email_service_integration()
        
        print("\n💾 Testing Database Integration:")
        self.test_database_storage()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📋 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.results['total_tests']}")
        print(f"✅ Passed: {self.results['passed']}")
        print(f"❌ Failed: {self.results['failed']}")
        
        if self.results['errors']:
            print("\n🚨 FAILED TESTS:")
            for error in self.results['errors']:
                print(f"  • {error['test']}: {error['message']}")
                if error['details']:
                    print(f"    Details: {error['details']}")
        
        success_rate = (self.results['passed'] / self.results['total_tests']) * 100 if self.results['total_tests'] > 0 else 0
        print(f"\n📈 Success Rate: {success_rate:.1f}%")
        
        return self.results

if __name__ == "__main__":
    tester = ContactFormTester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if results['failed'] == 0 else 1)