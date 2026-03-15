# AlgoFlow - Quick Start Guide

## Running Commands

### Linux/Mac
```bash
./docker-control.sh start
./docker-control.sh stop
./docker-control.sh status
```

### Windows
```cmd
docker-control.bat
```

## First Time Setup

1. **Start containers:**
   ```bash
   ./docker-control.sh start
   ```

2. **Create admin user:**
   ```bash
   ./docker-control.sh superuser
   ```

3. **Access the app:**
   - Frontend: http://localhost
   - Admin: http://localhost:8000/admin

## Common Commands

| Command | What it does |
|---------|-------------|
| `./docker-control.sh start` | Start the app |
| `./docker-control.sh stop` | Stop the app |
| `./docker-control.sh status` | Check if running |
| `./docker-control.sh logs` | View logs |
| `./docker-control.sh superuser` | Create admin |

## Need Help?

```bash
./docker-control.sh help
```

---

For full documentation, see [README.md](README.md)
