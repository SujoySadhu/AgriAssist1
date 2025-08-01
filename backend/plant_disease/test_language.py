#!/usr/bin/env python
"""
Test script for language switching functionality
Run this script to test both English and Bangla responses
"""

import os
import sys
import django

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from plant_disease.services import GeminiService

def test_language_functionality():
    """Test the Gemini service with different languages"""
    print("Testing Language Switching Functionality...")
    
    # Initialize the service
    gemini_service = GeminiService()
    
    # Test Bangla (default)
    print("\n1. Testing Bangla language...")
    disease_info_bn = gemini_service.get_disease_info("টমেটো", "প্রাথমিক ছত্রাকজনিত রোগ", "bn")
    print("Bangla Disease Info:")
    print(f"Description: {disease_info_bn.get('description', 'N/A')[:100]}...")
    print("Remedies:")
    for i, remedy in enumerate(disease_info_bn.get('remedies', [])[:2], 1):
        print(f"  {i}. {remedy[:80]}...")
    
    # Test English
    print("\n2. Testing English language...")
    disease_info_en = gemini_service.get_disease_info("Tomato", "Early blight", "en")
    print("English Disease Info:")
    print(f"Description: {disease_info_en.get('description', 'N/A')[:100]}...")
    print("Remedies:")
    for i, remedy in enumerate(disease_info_en.get('remedies', [])[:2], 1):
        print(f"  {i}. {remedy[:80]}...")
    
    print("\nLanguage switching test completed!")

if __name__ == "__main__":
    test_language_functionality() 