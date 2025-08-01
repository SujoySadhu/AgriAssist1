#!/usr/bin/env python
"""
Test script for Gemini service
Run this script to test the Gemini API integration
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

def test_gemini_service():
    """Test the Gemini service with sample data"""
    print("Testing Gemini Service...")
    
    # Initialize the service
    gemini_service = GeminiService()
    
    # Test disease information
    print("\n1. Testing disease information...")
    disease_info = gemini_service.get_disease_info("টমেটো", "প্রাথমিক ছত্রাকজনিত রোগ")
    print("Disease Info:")
    print(f"Description: {disease_info.get('description', 'N/A')}")
    print("Remedies:")
    for i, remedy in enumerate(disease_info.get('remedies', []), 1):
        print(f"  {i}. {remedy}")
    
    # Test healthy plant information
    print("\n2. Testing healthy plant information...")
    healthy_info = gemini_service.get_healthy_plant_info("টমেটো")
    print("Healthy Plant Info:")
    print(f"Description: {healthy_info.get('description', 'N/A')}")
    print("Care Tips:")
    for i, tip in enumerate(healthy_info.get('care_tips', []), 1):
        print(f"  {i}. {tip}")
    
    print("\nTest completed!")

if __name__ == "__main__":
    test_gemini_service() 