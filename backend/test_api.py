#!/usr/bin/env python3
"""
Simple test script for Photo Pass API
"""

import requests
import json
import os

BASE_URL = "http://localhost:8000/api/v1"

def test_health():
    """Test the health endpoint"""
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"Health check: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Server not running. Start with: python run.py")
        return False

def test_list_images():
    """Test listing images endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/list")
        print(f"List images: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error testing list images: {e}")
        return False

def test_api_docs():
    """Test if API documentation is accessible"""
    try:
        response = requests.get("http://localhost:8000/docs")
        print(f"API docs: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error testing API docs: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Photo Pass API...")
    print("=" * 40)
    
    tests = [
        ("Health Check", test_health),
        ("API Documentation", test_api_docs),
        ("List Images", test_list_images),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Testing: {test_name}")
        if test_func():
            print(f"✅ {test_name} passed")
            passed += 1
        else:
            print(f"❌ {test_name} failed")
    
    print("\n" + "=" * 40)
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! API is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the server logs.")

if __name__ == "__main__":
    main()
