@echo off
REM AlgoFlow Docker Management Script for Windows
REM Usage: docker-control.bat [start|stop|restart|logs|status|clean]

setlocal enabledelayedexpansion

cd /d "%~dp0"

:menu
cls
echo ╔══════════════════════════════════════════════════════════╗
echo ║           AlgoFlow Docker Management                     ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo 1. Start Containers
echo 2. Stop Containers
echo 3. Restart Containers
echo 4. View Logs
echo 5. Show Status
echo 6. Clean All
echo 7. Create Superuser
echo 8. Run Migrations
echo 9. Help
echo 0. Exit
echo.
set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto status
if "%choice%"=="6" goto clean
if "%choice%"=="7" goto superuser
if "%choice%"=="8" goto migrate
if "%choice%"=="9" goto help
if "%choice%"=="0" goto end
goto menu

:start
echo.
echo Starting AlgoFlow containers...
echo.

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please review .env file with your configuration
    echo.
)

docker-compose up -d --build

echo.
echo Containers started successfully!
echo.
echo Access points:
echo   Frontend: http://localhost
echo   Backend API: http://localhost:8000/api
echo   Django Admin: http://localhost:8000/admin
echo.
echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul
echo.
docker-compose ps
echo.
pause
goto menu

:stop
echo.
echo Stopping AlgoFlow containers...
echo.
docker-compose down
echo.
echo Containers stopped successfully!
echo.
pause
goto menu

:restart
echo.
echo Restarting AlgoFlow containers...
echo.
docker-compose restart
echo.
echo Containers restarted successfully!
echo.
pause
goto menu

:logs
echo.
echo Showing container logs (Press Ctrl+C to stop)...
echo.
docker-compose logs -f
goto menu

:status
echo.
echo Container Status:
echo.
docker-compose ps
echo.
echo Access points:
echo   Frontend: http://localhost
echo   Backend API: http://localhost:8000/api
echo   Django Admin: http://localhost:8000/admin
echo.
pause
goto menu

:clean
echo.
echo WARNING: This will delete all containers, volumes, and images!
set /p confirm="Are you sure? (y/n): "
if /i "%confirm%"=="y" (
    docker-compose down -v --rmi all
    echo.
    echo Cleanup completed!
    echo.
) else (
    echo.
    echo Cleanup cancelled
    echo.
)
pause
goto menu

:superuser
echo.
echo Creating Django superuser...
echo.
docker-compose exec backend python manage.py createsuperuser
echo.
pause
goto menu

:migrate
echo.
echo Running database migrations...
echo.
docker-compose exec backend python manage.py migrate
echo.
echo Migrations completed!
echo.
pause
goto menu

:help
echo.
echo Usage: docker-control.bat [command]
echo.
echo Commands:
echo   start       - Build and start all containers
echo   stop        - Stop all containers
echo   restart     - Restart all containers
echo   logs        - Show container logs
echo   status      - Show container status
echo   clean       - Remove all containers and volumes
echo   superuser   - Create Django superuser
echo   migrate     - Run database migrations
echo.
pause
goto menu

:end
echo.
echo Goodbye!
echo.
exit /b 0
