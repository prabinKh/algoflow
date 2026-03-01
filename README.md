# AlgoFlow

A full-stack algorithm visualization and management platform with role-based access control.

## Project Structure

```
algoflow/
├── src/                          # Frontend (React + TypeScript)
│   ├── components/               # React components
│   ├── context/                  # AuthContext for authentication
│   ├── pages/                    # Page components
│   ├── data/                     # Static data
│   ├── lib/                      # Utility functions
│   └── types/                    # TypeScript types
├── algoflow_django/              # Backend (Django + Django REST Framework)
│   ├── accounts/                 # User authentication app
│   ├── algorithms/               # Algorithm management app
│   ├── algoflow_django/          # Django project settings
│   └── manage.py                 # Django management script
├── package.json                  # Frontend dependencies
├── vite.config.ts               # Vite configuration
└── requirements.txt             # Backend dependencies
```

## Frontend

**Technology Stack:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Framer Motion (animations)

**Features:**
- Algorithm visualization viewer
- Category and algorithm management
- Role-based UI (admin/user)
- Dark mode support
- Responsive design

## Backend

**Technology Stack:**
- Django 5.x
- Django REST Framework
- Django CORS Headers
- Token Authentication
- SQLite (default database)

**Features:**
- Custom User model with role field (admin/user)
- Token-based authentication
- RESTful API for algorithms and categories
- Role-based permissions
- Admin-only write operations

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- pip

### Backend Setup

1. Navigate to the Django project:
   ```bash
   cd algoflow_django
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create demo users (optional):
   ```bash
   python manage.py shell
   >>> from accounts.models import User
   >>> User.objects.create_superuser('admin', 'admin@example.com', 'admin123', role='admin')
   >>> User.objects.create_user('user', 'user@example.com', 'user123', role='user')
   >>> exit()
   ```

7. Start the Django server:
   ```bash
   python manage.py runserver 8000
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev:vite
   ```

3. Open your browser at `http://localhost:3001`

## Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| User | `user` | `user123` |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (returns token)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/check-admin` - Check if user is admin

### Algorithms
- `GET /api/algorithms` - List all algorithms (public)
- `POST /api/algorithms` - Create algorithm (admin only)
- `GET /api/algorithms/:id` - Get algorithm details (public)
- `PUT /api/algorithms/:id` - Update algorithm (admin only)
- `DELETE /api/algorithms/:id` - Delete algorithm (admin only)

### Categories
- `GET /api/categories` - List all categories (public)
- `POST /api/categories` - Create category (admin only)

## Development

### Frontend Development
- The frontend runs on port 3001
- Vite proxy forwards `/api` requests to Django backend (port 8000)
- Hot module replacement (HMR) enabled

### Backend Development
- Django runs on port 8000
- Token authentication is used for API access
- CORS is configured for cross-origin requests

## License

MIT
