#!/bin/bash

# AlgoFlow Docker Management Script
# Usage: ./docker-control.sh [start|stop|restart|logs|status|clean|superuser|migrate]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

print_banner() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║           AlgoFlow Docker Management                     ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

start_containers() {
    echo -e "${GREEN}Starting AlgoFlow containers...${NC}"
    
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}Creating .env file from template...${NC}"
        cp .env.example .env
        echo -e "${YELLOW}Please review .env file with your configuration${NC}"
    fi
    
    docker-compose up -d --build
    
    echo -e "${GREEN}✓ Containers started successfully!${NC}"
    echo ""
    echo -e "${BLUE}Access points:${NC}"
    echo "  Frontend: http://localhost"
    echo "  Backend API: http://localhost:8000/api"
    echo "  Django Admin: http://localhost:8000/admin"
    echo ""
    
    echo -e "${YELLOW}Waiting for services to be ready...${NC}"
    sleep 10
    
    docker-compose ps
}

stop_containers() {
    echo -e "${YELLOW}Stopping AlgoFlow containers...${NC}"
    docker-compose down
    echo -e "${GREEN}✓ Containers stopped successfully!${NC}"
}

restart_containers() {
    echo -e "${YELLOW}Restarting AlgoFlow containers...${NC}"
    docker-compose restart
    echo -e "${GREEN}✓ Containers restarted successfully!${NC}"
}

show_logs() {
    echo -e "${BLUE}Showing container logs...${NC}"
    docker-compose logs -f
}

show_status() {
    echo -e "${BLUE}Container Status:${NC}"
    docker-compose ps
    echo ""
    echo -e "${BLUE}Access points:${NC}"
    echo "  Frontend: http://localhost"
    echo "  Backend API: http://localhost:8000/api"
    echo "  Django Admin: http://localhost:8000/admin"
}

clean_all() {
    echo -e "${RED}Cleaning all containers, volumes, and images...${NC}"
    read -p "Are you sure? This will delete all data! (y/n): " confirm
    if [ "$confirm" = "y" ]; then
        docker-compose down -v --rmi all
        echo -e "${GREEN}✓ Cleanup completed!${NC}"
    else
        echo -e "${YELLOW}Cleanup cancelled${NC}"
    fi
}

create_superuser() {
    echo -e "${GREEN}Creating Django superuser...${NC}"
    docker-compose exec backend python manage.py createsuperuser
}

run_migrations() {
    echo -e "${GREEN}Running database migrations...${NC}"
    docker-compose exec backend python manage.py migrate
    echo -e "${GREEN}✓ Migrations completed!${NC}"
}

show_help() {
    echo -e "${BLUE}Usage: ./docker-control.sh [command]${NC}"
    echo ""
    echo "Commands:"
    echo "  start       - Build and start all containers"
    echo "  stop        - Stop all containers"
    echo "  restart     - Restart all containers"
    echo "  logs        - Show container logs (follow mode)"
    echo "  status      - Show container status"
    echo "  clean       - Remove all containers, volumes, and images"
    echo "  superuser   - Create Django superuser"
    echo "  migrate     - Run database migrations"
    echo "  help        - Show this help message"
    echo ""
}

print_banner

case "${1:-help}" in
    start)
        start_containers
        ;;
    stop)
        stop_containers
        ;;
    restart)
        restart_containers
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    clean)
        clean_all
        ;;
    superuser)
        create_superuser
        ;;
    migrate)
        run_migrations
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac
