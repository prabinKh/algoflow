# 🔧 SSL Certificate Error Fix for Email Sending

## Problem
```
ERROR Failed to send email: [SSL: CERTIFICATE_VERIFY_FAILED] 
certificate verify failed: unable to get local issuer certificate (_ssl.c:1028)
```

This error occurs because Python can't verify Gmail's SSL certificate on macOS.

---

## ✅ Solution Applied

### 1. **Updated Email Backend** (Already Done)
Changed from standard SMTP backend to custom `PatchedEmailBackend` that handles SSL certificates properly:

```python
# settings.py
EMAIL_BACKEND = 'algoflow_django.settings.PatchedEmailBackend'
```

### 2. **Added Required Packages** (Already Done)
Added `certifi` and `python-dotenv` to requirements.txt:
```
certifi>=2024.0.0
python-dotenv>=1.0.0
```

---

## 🚀 Steps to Fix

### Step 1: Install Required Package
```bash
cd algoflow/algoflow_django
pip install certifi
```

Or install all requirements:
```bash
pip install-r requirements.txt
```

### Step 2: Restart Django Server
```bash
# Stop current server (Ctrl+C)
# Then restart
python manage.py runserver
```

### Step 3: Test Registration Again
1. Go to frontend registration page
2. Register with your email
3. Check Django terminal - should see:
   ```
   INFO Email sent successfully to djangoforgithub@gmail.com
   ```
4. Check your inbox - you should receive the verification email!

---

## 🔍 How It Works

The `PatchedEmailBackend` class in `settings.py` fixes SSL by:

```python
class PatchedEmailBackend(EmailBackend):
   def __init__(self, *args, **kwargs):
       super().__init__(*args, **kwargs)
        try:
            import certifi
            # Use Mozilla's certificate bundle
            self.ssl_context = ssl.create_default_context(cafile=certifi.where())
        except ImportError:
            # Fallback to unverified context (not recommended)
            self.ssl_context = ssl._create_unverified_context()
```

### What is `certifi`?
- Mozilla's carefully curated collection of Root Certificates
- Used for verifying SSL/TLS connections
- Solves macOS Python SSL verification issues

---

## ⚠️ If Still Not Working

### Option A: Use Unverified SSL Context (Development Only!)

If `certifi` doesn't work, you can temporarily disable SSL verification:

```python
# In settings.py, modify PatchedEmailBackend:
class PatchedEmailBackend(EmailBackend):
   def __init__(self, *args, **kwargs):
       super().__init__(*args, **kwargs)
        # DISABLE SSL VERIFICATION (NOT RECOMMENDED FOR PRODUCTION)
        self.ssl_context = ssl._create_unverified_context()
```

⚠️ **Warning:** This is insecure for production but acceptable for local development.

### Option B: Install Certificates on macOS

If you're on macOS, Python might not have access to system certificates:

```bash
# Run the certificate installation script
/Applications/Python\ 3.x/Install\ Certificates.command
```

Or manually:
```bash
pip install --upgrade certifi
echo "import certifi; print(certifi.where())" | python
```

### Option C: Use Console Backend (Development)

For development, you can just use console backend (emails print to terminal):

```python
# In settings.py
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

---

## ✅ Expected Output After Fix

### Django Terminal:
```
DEBUG (0.001) INSERT INTO "account_emailverificationtoken" ...
INFO Email sent successfully to djangoforgithub@gmail.com
INFO "POST /api/auth/register/ HTTP/1.1" 201 162
```

### Your Inbox (djangoforgithub@gmail.com):
```
Subject: Verify Your Email Address
From: djangoforgithub123@gmail.com

Hello prabin,

Thank you for registering! Please verify your email address by clicking the link below:
http://localhost:3003/verify-email?token=...

This link will expire in 24 hours.
```

---

## 🎯 Quick Fix Command Summary

```bash
# Navigate to Django directory
cd algoflow/algoflow_django

# Install certifi package
pip install certifi

# Restart Django server
python manage.py runserver
```

That's it! The SSL error should be resolved now. 🎉

---

## Security Notes

✅ **Development:** Using `certifi` or unverified SSL is acceptable  
✅ **Production:** Always use proper SSL verification with valid certificates  
✅ **App Passwords:** Never commit Gmail app passwords to version control  

---

**Last Updated:** March 10, 2026  
**Status:** ✅ Fixed - Install certifi package
