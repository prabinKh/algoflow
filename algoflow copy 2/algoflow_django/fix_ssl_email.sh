#!/bin/bash

# Fix SSL Email Issue - Quick Install Script
echo "🔧 Fixing SSL Certificate Issue for Email..."
echo ""

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo "❌ Please run this script from the algoflow_django directory"
    echo "   cd algoflow/algoflow_django"
    exit 1
fi

echo "✅ In correct directory: $(pwd)"
echo ""

# Install certifi
echo "📦 Installing certifi package..."
pip install certifi

if [ $? -eq 0 ]; then
    echo "✅ certifi installed successfully!"
else
    echo "❌ Failed to install certifi"
    echo "   Try: pip3 install certifi"
    exit 1
fi

echo ""
echo "🎉 SSL fix applied successfully!"
echo ""
echo "Next steps:"
echo "1. Restart Django server: python manage.py runserver"
echo "2. Test registration on frontend"
echo "3. Check your inbox for verification email"
echo ""
echo "For more details, see: ../SSL_EMAIL_FIX.md"
