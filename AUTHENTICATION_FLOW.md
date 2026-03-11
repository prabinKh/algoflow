# 🔐 AlgoFlow Authentication Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Login      │  │   Register   │  │  Reset Pwd   │      │
│  │    Page      │  │     Page     │  │     Page     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┴──────────────────┘               │
│                           │                                  │
│                  ┌────────▼────────┐                         │
│                  │  AuthContext    │                         │
│                  │  - login()      │                         │
│                  │  - register()   │                         │
│                  │  - resetPwd()   │                         │
│                  │  - logout()     │                         │
│                  │  - checkAuth()  │                         │
│                  └────────┬────────┘                         │
│                           │                                  │
│                  ┌────────▼────────┐                         │
│                  │   apiFetch()    │                         │
│                  │  - Add cookies  │                         │
│                  │  - Add headers  │                         │
│                  │  - Handle CORS  │                         │
│                  └────────┬────────┘                         │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼ HTTP/HTTPS (JSON)
┌─────────────────────────────────────────────────────────────┐
│                Backend (Django REST Framework)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              URL Routing                              │  │
│  │  /api/auth/* → account.urls                          │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                       │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │                   Views                               │  │
│  │  • UserRegistrationView                              │  │
│  │  • CustomTokenObtainPairView(Login)                 │  │
│  │  • PasswordResetRequestView                          │  │
│  │  • EmailVerificationView                             │  │
│  │  • LogoutView                                        │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                       │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │              Serializers                              │  │
│  │  • Validate input                                     │  │
│  │  • Create/update users                                │  │
│  │  • Generate tokens                                    │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                       │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │                  Models                               │  │
│  │  • MyUser(Custom User Model)                        │  │
│  │  • EmailVerificationToken                            │  │
│  │  • PasswordResetToken                                │  │
│  │  • LoginAttempt                                      │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                       │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │              EmailService                             │  │
│  │  • Send verification emails                          │  │
│  │  • Send password reset emails                        │  │
│  │  • Send welcome emails                               │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              JWT Authentication                       │ │
│  │  • Access Token (5 min) - in cookie                  │ │
│  │  • Refresh Token (24 hrs) - in cookie                │ │
│  │  • Automatic refresh on expiry                       │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Registration Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Fills registration form
     ▼
┌─────────────────────────────────┐
│  Register Page                  │
│  - Validates passwords match    │
│  - Validates length >= 8        │
└────────────┬────────────────────┘
             │ 2. POST /api/auth/register/
             │    {name, email, password, password2}
             ▼
┌─────────────────────────────────┐
│  Django Backend                 │
│  UserRegistrationView           │
│  - Validates data               │
│  - Checks email uniqueness      │
│  - Validates password strength  │
└────────────┬────────────────────┘
             │ 3. Create user (email_verified=False)
             ▼
┌─────────────────────────────────┐
│  Database                       │
│  - Creates MyUser record        │
│  - Sets is_active=True          │
│  - Sets email_verified=False    │
└────────────┬────────────────────┘
             │ 4. Generate verification token
             ▼
┌─────────────────────────────────┐
│  EmailVerificationToken Model   │
│  - Creates token (24h expiry)   │
│  - Links to user                │
└────────────┬────────────────────┘
             │ 5. Send verification email
             ▼
┌─────────────────────────────────┐
│  EmailService                   │
│  - Sends email with link        │
│  - Console output (dev)         │
│  - SMTP (production)            │
└────────────┬────────────────────┘
             │ 6. Return success
             ▼
┌─────────────────────────────────┐
│  Frontend                       │
│  - Shows success message        │
│  - Auto-redirect to /login      │
│  - Delay: 2 seconds             │
└─────────────────────────────────┘
```

## Login Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Enters credentials
     ▼
┌─────────────────────────────────┐
│  Login Page                     │
│  - Email & Password             │
│  - Forgot Password link         │
└────────────┬────────────────────┘
             │ 2. POST /api/auth/login/
             │    {email, password}
             ▼
┌─────────────────────────────────┐
│  Django Backend                 │
│  CustomTokenObtainPairView      │
│  - Finds user by email          │
│  - Checks email_verified        │
│  - Authenticates password        │
│  - Checks is_active             │
└────────────┬────────────────────┘
             │ 3. Generate JWT tokens
             ▼
┌─────────────────────────────────┐
│  SimpleJWT                      │
│  - Access Token (5 min)         │
│  - Refresh Token (24 hrs)       │
└────────────┬────────────────────┘
             │ 4. Return response with cookies
             ▼
┌─────────────────────────────────┐
│  Response                       │
│  {                              │
│   success: true,               │
│   access: "token",             │
│    refresh: "token",            │
│    user: {...}                  │
│  }                              │
│  Set-Cookie: access_token=...   │
│  Set-Cookie: refresh_token=...  │
└────────────┬────────────────────┘
             │ 5. Store user in context
             ▼
┌─────────────────────────────────┐
│  AuthContext                    │
│  - setUser(userData)            │
│  - isAuthenticated = true       │
└────────────┬────────────────────┘
             │ 6. Navigate to dashboard
             ▼
┌─────────────────────────────────┐
│  Dashboard/Home Page            │
│  - User sees personalized content│
└─────────────────────────────────┘
```

## Password Reset Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Clicks "Forgot Password"
     ▼
┌─────────────────────────────────┐
│  Login Page (Reset Mode)        │
│  - Enter email address          │
└────────────┬────────────────────┘
             │ 2. POST /api/auth/password-reset/
             │    {email}
             ▼
┌─────────────────────────────────┐
│  Django Backend                 │
│  PasswordResetRequestView       │
│  - Finds user                   │
│  - Checks email_verified        │
│  - Generates reset token        │
└────────────┬────────────────────┘
             │ 3. Create reset token
             ▼
┌─────────────────────────────────┐
│  PasswordResetToken Model       │
│  - Creates token (2h expiry)    │
│  - Invalidates old tokens       │
└────────────┬────────────────────┘
             │ 4. Send reset email
             ▼
┌─────────────────────────────────┐
│  EmailService                   │
│  - Sends email with reset link  │
│  - Contains token               │
└────────────┬────────────────────┘
             │ 5. Return success
             ▼
┌─────────────────────────────────┐
│  Frontend                       │
│  - Shows success message        │
│  - "Check your email"           │
└────────────┬────────────────────┘
             │ 6. User clicks email link
             ▼
┌─────────────────────────────────┐
│  Reset Password Page            │
│  - Enter new password           │
│  - Confirm password             │
│  - Token from URL               │
└────────────┬────────────────────┘
             │ 7. POST /api/auth/password-reset/confirm/
             │    {token, password, password2}
             ▼
┌─────────────────────────────────┐
│  Django Backend                 │
│  PasswordResetConfirmView       │
│  - Validates token              │
│  - Checks expiry                │
│  - Validates passwords          │
└────────────┬────────────────────┘
             │ 8. Update password
             ▼
┌─────────────────────────────────┐
│  Database                       │
│  - Sets new password (hashed)   │
│  - Marks token as used          │
└────────────┬────────────────────┘
             │ 9. Send confirmation email
             ▼
┌─────────────────────────────────┐
│  EmailService                   │
│  - Sends"Password Changed"     │
│    notification email           │
└────────────┬────────────────────┘
             │ 10. Return success
             ▼
┌─────────────────────────────────┐
│  Frontend                       │
│  - Shows success message        │
│  - Redirect to /login           │
└─────────────────────────────────┘
```

## Token Refresh Flow

```
┌─────────────────────────────────┐
│  Frontend Request               │
│  - Access token expired         │
│  - API call fails (401)         │
└────────────┬────────────────────┘
             │ 1. Detect 401 Unauthorized
             ▼
┌─────────────────────────────────┐
│  AuthContext.refreshToken()     │
│  - Called automatically         │
└────────────┬────────────────────┘
             │ 2. POST /api/auth/token/refresh/
             │    Cookies: refresh_token
             ▼
┌─────────────────────────────────┐
│  Django Backend                 │
│  CustomRefreshTokenView         │
│  - Validates refresh token      │
│  - Checks expiry                │
│  - Generates new access token   │
└────────────┬────────────────────┘
             │ 3. Return new access token
             ▼
┌─────────────────────────────────┐
│  Response                       │
│  Set-Cookie: access_token=...   │
│  (5 more minutes validity)      │
└────────────┬────────────────────┘
             │ 4. Retry original request
             ▼
┌─────────────────────────────────┐
│  Original API Call              │
│  - Retries with new token       │
│  - Succeeds                     │
└─────────────────────────────────┘
```

## Cookie Configuration

```javascript
// Access Token Cookie
{
  name: 'access_token',
  value: jwt_token,
  httpOnly: true,      // Not accessible via JS
  secure: false,       // Set true in production(HTTPS)
  sameSite: 'Lax',     // CSRF protection
  maxAge: 300          // 5 minutes
}

// Refresh Token Cookie
{
  name: 'refresh_token',
  value: jwt_token,
  httpOnly: true,      // Not accessible via JS
  secure: false,       // Set true in production (HTTPS)
  sameSite: 'Lax',     // CSRF protection
  maxAge: 86400        // 24 hours
}
```

## Security Features

### XSS Protection
- ✅ HTTP-only cookies (JavaScript can't access)
- ✅ No tokens in localStorage
- ✅ Sanitized user inputs

### CSRF Protection
- ✅ SameSite=Lax cookies
- ✅ CSRF tokens for mutations
- ✅ Trusted origins configured

### Brute Force Protection
- ✅ Rate limiting on login
- ✅ Login attempt tracking
- ✅ Account lockout (configurable)

### Token Security
- ✅ Short-lived access tokens (5 min)
- ✅ Longer refresh tokens (24 hrs)
- ✅ Automatic rotation
- ✅ Signature verification

### Password Security
- ✅ Minimum 8 characters
- ✅ Django validators
- ✅ Hashed storage (PBKDF2)
- ✅ Confirmation matching

### Email Verification
- ✅ Required before login
- ✅ 24-hour token expiry
- ✅ Single-use tokens
- ✅ Resend capability

---

**Last Updated**: March 10, 2026  
**Version**: 1.0
