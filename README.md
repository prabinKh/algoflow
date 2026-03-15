# AlgoFlow - Algorithm Learning Platform

A comprehensive platform for learning, visualizing, and mastering algorithms.

---

## Quick Start

### Important: How to Run Commands

**You MUST include the script name:**

```bash
# CORRECT
./docker-control.sh start
./docker-control.sh stop
./docker-control.sh status

# WRONG - These won't work
start
stop
status
```

### Optional: Add Shortcuts

#### For Mac (zsh):
```bash
echo "" >> ~/.zshrc
echo "alias aos='./docker-control.sh start'" >> ~/.zshrc
echo "alias aop='./docker-control.sh stop'" >> ~/.zshrc
source ~/.zshrc

# Now use:
aos    # Start
aop    # Stop
```

#### For Linux (bash):
```bash
echo "" >> ~/.bashrc
echo "alias aos='./docker-control.sh start'" >> ~/.bashrc
echo "alias aop='./docker-control.sh stop'" >> ~/.bashrc
source ~/.bashrc
```

---

### Start with Docker

```bash
cd algoflow

# Linux/Mac:
./docker-control.sh start

# Windows:
docker-control.bat
```

**Access Points:**
- Frontend: http://localhost
- Backend API: http://localhost:8000/api
- Django Admin: http://localhost:8000/admin

---

## Features

### Frontend
- Modern React 19 + TypeScript
- Responsive design (Mobile, Tablet, Desktop)
- Dark/Light theme support
- Real-time code execution
- Interactive visualizations
- Role-based access control

### Backend
- Django 5 + Django REST Framework
- JWT authentication
- Email verification
- Password reset
- Staff/Admin permissions
- Rate limiting
- CORS enabled

### Algorithm Management
- CRUD operations
- Multi-language support (Python, C++, C, Rust)
- Separate outcome/runtime for each implementation
- Category management
- Asset attachments
- Quiz system

---

## Architecture

```
┌─────────────────────────────────────┐
│        Frontend (React 19)          │
│  Login | Dashboard | Algorithms     │
│  Register | Forge | AI Assist       │
└──────────────┬──────────────────────┘
               │ HTTP/HTTPS (JSON)
               ▼
┌─────────────────────────────────────┐
│     Backend (Django REST)           │
│  Auth | Algorithms | Categories     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│        Database (SQLite)            │
└─────────────────────────────────────┘
```

---

## Docker Commands

### All Commands

```bash
./docker-control.sh start       # Start containers
./docker-control.sh stop        # Stop containers
./docker-control.sh restart     # Restart containers
./docker-control.sh logs        # View logs
./docker-control.sh status      # Check status
./docker-control.sh clean       # Remove all (WARNING!)
./docker-control.sh superuser   # Create admin
./docker-control.sh migrate     # Run migrations
./docker-control.sh help        # Show help
```

### Common Workflows

**First Time:**
```bash
./docker-control.sh start
./docker-control.sh superuser
./docker-control.sh status
```

**Daily:**
```bash
# Morning
./docker-control.sh start

# Evening
./docker-control.sh stop
```

**Troubleshooting:**
```bash
./docker-control.sh status
./docker-control.sh logs
./docker-control.sh restart
```

---

## Installation

### Requirements
- Docker & Docker Compose
- OR Python 3.11+ and Node.js 20+

### Docker Setup

```bash
cd algoflow
./docker-control.sh start
```

### Manual Setup

**Backend:**
```bash
cd algoflow_django
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend:**
```bash
cd algoflow_frontend
npm install
npm run dev
```

---

## Usage

### User Roles

| Feature | Anonymous | User | Staff | Admin |
|---------|-----------|------|-------|-------|
| View | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ❌ | ✅ | ✅ | ✅ |
| Create | ❌ | ❌ | ✅ | ✅ |
| Admin Panel | ❌ | ❌ | ✅ | ✅ |

### Create Algorithm

1. Login as staff/admin
2. Go to Forge (`/forge`)
3. Enter algorithm details
4. Click Initialize
5. View in library

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register |
| POST | `/api/auth/login/` | Login |
| POST | `/api/auth/logout/` | Logout |
| GET | `/api/auth/check/` | Check auth |

### Algorithms

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/algorithms/` | List all |
| POST | `/api/algorithms/` | Create |
| GET | `/api/algorithms/<id>/` | Get one |
| PUT | `/api/algorithms/<id>/` | Update |
| DELETE | `/api/algorithms/<id>/` | Delete |

---

## Development

### Project Structure

```
algoflow/
├── algoflow_django/         # Backend
│   ├── account/            # Auth app
│   ├── algorithms/         # Algorithms app
│   └── manage.py
├── algoflow_frontend/       # Frontend
│   ├── src/
│   └── package.json
├── docker-compose.yml
├── docker-control.sh       # Linux/Mac
└── docker-control.bat      # Windows
```

---

## Testing

**Backend:**
```bash
cd algoflow_django
python manage.py test
```

**Frontend:**
```bash
cd algoflow_frontend
npm test
```

---

## Troubleshooting

### Backend Not Starting
```bash
docker-compose logs backend
docker-compose exec backend python manage.py migrate
```

### Frontend Issues
```bash
docker-compose logs frontend
docker-compose up -d --build frontend
```

### Database Reset
```bash
# WARNING: Deletes all data
docker-compose down -v
docker-compose up -d
./docker-control.sh migrate
```

### Port Conflicts
```bash
# Find process on port 8000
lsof -i :8000
kill -9 <PID>
```

---

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push and open Pull Request

---

## License

MIT License

---

## Support

- Documentation: See `README.md`
- Quick Reference: See `QUICKSTART.md`
- Issues: GitHub Issues

---

**Made with ❤️ by the AlgoFlow Team**
