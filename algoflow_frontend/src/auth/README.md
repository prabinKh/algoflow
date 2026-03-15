# 🔐 Authentication Module

Complete authentication system for React + Django REST Framework projects with JWT.

## 📁 Module Structure

```
src/auth/
├── index.ts              # Main export file
├── api.ts                # API functions and types
├── AuthContext.tsx       # React context and provider
├── ProtectedRoute.tsx    # Route protection component
└── pages/
    ├── Login.tsx         # Login page
    ├── Register.tsx      # Registration page
    ├── VerifyEmail.tsx   # Email verification page
    └── ResetPassword.tsx # Password reset page
```

## 🚀 Quick Start

### 1. Copy the Auth Module

Copy the entire `src/auth` folder to your new project's `src` directory.

### 2. Install Dependencies

```bash
npm install motion react-router-dom lucide-react
```

### 3. Setup Provider

Wrap your app with `AuthProvider` in `main.tsx`:

```tsx
import { AuthProvider } from './auth';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
```

### 4. Use Authentication

```tsx
import { useAuth } from './auth';

function MyComponent() {
  const { user, login, isAuthenticated, isAdmin } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <button onClick={() => navigate('/login')}>Login</button>
      )}
    </div>
  );
}
```

### 5. Protect Routes

```tsx
import { ProtectedRoute } from './auth';

// Require authentication (default)
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

// Require email verification
<Route path="/premium" element={
  <ProtectedRoute requireVerified>
    <PremiumContent />
  </ProtectedRoute>
} />

// Require staff or superuser
<Route path="/admin" element={
  <ProtectedRoute requireStaff>
    <AdminPanel />
  </ProtectedRoute>
} />

// Require superuser only
<Route path="/super-admin" element={
  <ProtectedRoute requireSuperuser>
    <SuperAdminPanel />
  </ProtectedRoute>
} />
```

### 6. Add Auth Pages

```tsx
import { LoginPage, RegisterPage, VerifyEmailPage, ResetPasswordPage } from './auth';

<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
<Route path="/verify-email" element={<VerifyEmailPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
```

## 📦 Exports

### Components

| Component | Description |
|-----------|-------------|
| `AuthProvider` | Context provider - wrap your app |
| `ProtectedRoute` | Route protection wrapper |
| `LoginPage` | Login form with password reset |
| `RegisterPage` | Registration form |
| `VerifyEmailPage` | Email verification page |
| `ResetPasswordPage` | Password reset form |

### Hooks

| Hook | Description |
|------|-------------|
| `useAuth()` | Access auth state and methods |

### API Functions

| Function | Description |
|----------|-------------|
| `apiFetch()` | Fetch wrapper with auth headers |
| `loginApi()` | Login user |
| `registerApi()` | Register new user |
| `logoutApi()` | Logout user |
| `checkAuthApi()` | Check authentication status |
| `refreshTokenApi()` | Refresh access token |
| `resetPasswordApi()` | Request password reset |
| `verifyEmailApi()` | Verify email with token |
| `resendVerificationApi()` | Resend verification email |

### Utilities

| Function | Description |
|----------|-------------|
| `getBackendUrl()` | Get API backend URL |
| `getApiConfig()` | Get stored API config |
| `saveApiConfig()` | Save API config to localStorage |

## ⚙️ Configuration

### Backend URL

By default, the module expects Django at `http://localhost:8000`.

**Option 1: Environment Variable**
```env
VITE_API_URL=http://your-backend.com
```

**Option 2: localStorage**
```javascript
saveApiConfig({ backendUrl: 'http://your-backend.com' });
```

## 🔧 Backend Requirements

Your Django backend must have these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Login |
| POST | `/api/auth/register/` | Register |
| POST | `/api/auth/logout/` | Logout |
| POST | `/api/auth/token/refresh/` | Refresh token |
| GET | `/api/auth/check/` | Check auth |
| POST | `/api/auth/verify-email/` | Verify email |
| POST | `/api/auth/resend-verification/` | Resend verification |
| POST | `/api/auth/password-reset/` | Request reset |
| POST | `/api/auth/password-reset/confirm/` | Confirm reset |

### Expected Request/Response Format

**Login Request:**
```json
POST /api/auth/login/
{ "email": "user@example.com", "password": "password123" }
```

**Login Response:**
```json
{
  "success": true,
  "access": "jwt_token",
  "refresh": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "email_verified": true,
    "is_staff": false,
    "is_superuser": false
  }
}
```

## 📝 Usage Examples

### Login Form

```tsx
import { useAuth } from './auth';

function CustomLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect or show success
    } catch (error) {
      // Show error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Protected Component

```tsx
import { useAuth } from './auth';

function AdminOnly() {
  const { isAdmin, isStaff } = useAuth();

  if (!isAdmin && !isStaff) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Content</div>;
}
```

### Conditional Rendering

```tsx
import { useAuth } from './auth';

function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </>
      )}
    </nav>
  );
}
```

## 🎨 Customization

### Styling

The components use Tailwind CSS classes. Customize by:

1. **Override with CSS**: Target the class names
2. **Modify component styles**: Edit the TSX files
3. **Use your UI components**: Replace the UI imports

### Custom Auth Flow

Extend the `AuthContext` by adding your own methods:

```tsx
// In AuthContext.tsx
const customMethod = async () => {
  // Your custom logic
};

return (
  <AuthContext.Provider
    value={{
      // ... existing values
      customMethod,
    }}
  >
    {children}
  </AuthContext.Provider>
);
```

## 🔒 Security Features

- ✅ JWT tokens in HTTP-only cookies
- ✅ Automatic token refresh
- ✅ Email verification required
- ✅ Password validation
- ✅ CSRF protection
- ✅ Rate limiting support (backend)

## 📄 License

MIT License - Free to use in personal and commercial projects.

## 🆘 Troubleshooting

**Issue: "useAuth must be used within AuthProvider"**
- Make sure you wrapped your app with `<AuthProvider>`

**Issue: "401 Unauthorized"**
- Check if backend is running
- Verify CORS settings in Django
- Ensure cookies are being set

**Issue: "Network Error"**
- Check backend URL configuration
- Verify CORS_ALLOW_ALL_ORIGINS = True in Django

## 📞 Support

For issues or questions, check the backend Django settings:
- CORS configuration
- JWT token lifetime
- Email verification settings
