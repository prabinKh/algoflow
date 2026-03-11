# 🔌 Connecting Frontend to Django Backend

## Overview
The frontend authentication pages (Login, Register, Password Reset) are now connected to your Django backend account API.

## Backend Setup (Django)

### 1. Install Dependencies
```bash
cd algoflow/algoflow_django
pip install-r requirements.txt
```

### 2. Run Migrations
```bash
python manage.py migrate
```

### 3. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 4. Start Django Server
```bash
python manage.py runserver
```

The backend will run on `http://localhost:8000`

## Frontend Setup (React)

### 1. Configure Backend URL

The frontend is configured by default to connect to: `http://localhost:8000/api`

If you need to change this:
- Open the app in your browser
- Look for API configuration settings (or check browser console)
- Or modify the default in `/src/lib/api.ts`:
  ```typescript
 return config.backendUrl || 'http://localhost:8000/api';
  ```

### 2. Install Dependencies
```bash
cd algoflow/remix_-algoflow_-visualize-•-code-•-master
npm install
```

### 3. Start Frontend
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Authentication Flow

### Registration
1. User fills registration form
2. Frontend sends POST to `/api/auth/register/`
3. Backend creates user with `email_verified=False`
4. Backend sends verification email (console output in development)
5. User redirected to login with success message

### Email Verification
1. User receives email with verification link
2. Link contains token: `/verify-email?token=xxx`
3. Frontend sends POST to `/api/auth/verify-email/` with token
4. Backend validates token and sets `email_verified=True`
5. User can now log in

### Login
1. User enters email/password
2. Frontend sends POST to `/api/auth/login/`
3. Backend validates credentials and checks email verification
4. Backend returns JWT tokens (access + refresh)
5. Tokens stored in HTTP-only cookies
6. User data stored in AuthContext

### Password Reset
1. User clicks "Forgot Password"
2. Enters email address
3. Frontend sends POST to `/api/auth/password-reset/`
4. Backend sends reset email with token
5. User clicks reset link
6. Frontend sends POST to `/api/auth/password-reset/confirm/` with new password
7. Password updated, user can log in

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/check/` - Check if authenticated
- `POST /api/auth/verify-email/` - Verify email
- `POST /api/auth/resend-verification/` - Resend verification email

### Password Management
- `POST /api/auth/password-reset/` - Request password reset
- `POST /api/auth/password-reset/confirm/` - Confirm password reset
- `POST /api/auth/change-password/` - Change password (authenticated)

### User Profile
- `GET /api/auth/profile/` - Get user profile
- `PATCH /api/auth/profile/` - Update user profile

## Features Implemented

✅ **Registration** with email verification
✅ **Login** with JWT tokens in cookies
✅ **Password Reset** flow
✅ **Error Handling** with user-friendly messages
✅ **Loading States** during API calls
✅ **Success Messages** after actions
✅ **Form Validation** (passwords match, length, etc.)
✅ **Auto-redirect** after registration
✅ **Cookie-based** authentication
✅ **CSRF protection** enabled

## Testing

### Test Registration
1. Go to `/register`
2. Fill in name, email, password
3. Submit form
4. Check terminal/console for verification email
5. Click verification link or use token
6. Redirected to login

### Test Login
1. Go to `/login`
2. Enter verified email and password
3. Submit form
4. Should redirect to dashboard

### Test Password Reset
1. Go to `/login`
2. Click "Forgot Password"
3. Enter email
4. Check console for reset email
5. Use token to reset password

## Troubleshooting

### CORS Issues
Make sure Django has CORS enabled:
```python
# settings.py
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
```

### Cookies Not Setting
Check that CSRF settings are correct:
```python
CSRF_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_HTTPONLY = False
```

### Email Not Sending
In development, emails print to console. Check Django server logs.

For production, configure SMTP in settings.py.

### Token Errors
Clear browser cookies and try again. The app handles token refresh automatically.

## Next Steps

1. ✅ **Done**: Connect auth pages to backend
2. ⏳ **TODO**: Create email verification page component
3. ⏳ **TODO**: Add user profile page
4. ⏳ **TODO**: Add logout button in UI
5. ⏳ **TODO**: Protect routes with authentication

## Security Notes

- JWT tokens stored in HTTP-only cookies (not accessible to JavaScript)
- Access token expires in 5 minutes
- Refresh token expires in 24 hours
- Automatic token refresh implemented
- Password validation enforced (min 8 characters)
- Email verification required before login
- Rate limiting on login attempts (backend)
