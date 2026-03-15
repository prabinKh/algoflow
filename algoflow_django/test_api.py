#!/usr/bin/env python
"""
Test script to verify Django backend API endpoints
Run this to check if your backend is working correctly
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_endpoint(method, endpoint, data=None, expected_status=200):
    """Test a single API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method == "GET":
            response = requests.get(url, timeout=5)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=5)
        
        status = "✅" if response.status_code == expected_status else "❌"
        print(f"{status} {method} {endpoint}")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            try:
                print(f"   Response: {json.dumps(response.json(), indent=2)[:200]}")
            except:
                print(f"   Response: {response.text[:200]}")
        print()
        return response.status_code == expected_status
    except requests.exceptions.ConnectionError:
        print(f"❌ {method} {endpoint}")
        print(f"   ERROR: Could not connect to {BASE_URL}")
        print(f"   Make sure Django server is running: python manage.py runserver")
        return False
    except Exception as e:
        print(f"❌ {method} {endpoint}")
        print(f"   ERROR: {str(e)}")
        return False

def main():
    print("=" * 60)
    print("Testing AlgoFlow Django Backend API")
    print("=" * 60)
    print()
    
    # Test basic connectivity
    print("1. Testing Basic Connectivity...")
    print("-" * 60)
    test_endpoint("GET", "/api/algorithms/", expected_status=200)
    
    # Test categories
    print("2. Testing Categories...")
    print("-" * 60)
    test_endpoint("GET", "/api/categories/", expected_status=200)
    
    # Test auth endpoints (without auth)
    print("3. Testing Auth Endpoints (public)...")
    print("-" * 60)
    test_endpoint("GET", "/api/auth/check/", expected_status=401)  # Should return 401 without auth
    
    print("=" * 60)
    print("Testing Complete!")
    print("=" * 60)
    print()
    print("If you see ❌ CONNECTION errors:")
    print("1. Make sure Django is running: cd algoflow_django && python manage.py runserver")
    print("2. Check Django is on port 8000")
    print("3. Try accessing http://localhost:8000/admin in your browser")
    print()
    print("If you see ❌ 404 errors:")
    print("1. Check URL patterns in algoflow_django/algoflow_django/urls.py")
    print("2. Make sure migrations are run: python manage.py migrate")
    print()

if __name__ == "__main__":
    main()
