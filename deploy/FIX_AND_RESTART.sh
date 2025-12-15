#!/bin/bash

# ============================================
# SCRIPT FIX VÀ RESTART SAU KHI DEPLOY
# ============================================
# Chạy script này để tự động fix và restart services

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

BACKEND_DIR="/var/www/banyco.vn/ecommerce-backend"
FRONTEND_DIR="/var/www/banyco.vn/ecommerce-frontend"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  FIX AND RESTART SERVICES${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# ============================================
# 1. INSTALL DEPENDENCIES
# ============================================
echo -e "${YELLOW}[1/5] Installing dependencies...${NC}"

# Backend
if [ -f "$BACKEND_DIR/package.json" ]; then
    echo "Installing backend dependencies..."
    cd "$BACKEND_DIR"
    npm install --omit=dev
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Backend package.json not found${NC}"
fi

# Frontend
if [ -f "$FRONTEND_DIR/package.json" ]; then
    echo "Installing frontend dependencies..."
    cd "$FRONTEND_DIR"
    npm install --omit=dev
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}✗ Frontend package.json not found${NC}"
fi

echo ""

# ============================================
# 2. CHECK ENVIRONMENT FILES
# ============================================
echo -e "${YELLOW}[2/5] Checking environment files...${NC}"

if [ ! -f "$BACKEND_DIR/.env.local" ]; then
    echo -e "${RED}✗ Backend .env.local missing!${NC}"
    echo -e "${YELLOW}  Please create $BACKEND_DIR/.env.local${NC}"
    echo -e "${YELLOW}  See README.md for template${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Backend .env.local exists${NC}"
fi

if [ ! -f "$FRONTEND_DIR/.env.local" ]; then
    echo -e "${RED}✗ Frontend .env.local missing!${NC}"
    echo -e "${YELLOW}  Please create $FRONTEND_DIR/.env.local${NC}"
    echo -e "${YELLOW}  See README.md for template${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Frontend .env.local exists${NC}"
fi

echo ""

# ============================================
# 3. STOP EXISTING SERVICES
# ============================================
echo -e "${YELLOW}[3/5] Stopping existing services...${NC}"

if command -v pm2 &> /dev/null; then
    pm2 delete ecommerce-backend 2>/dev/null || true
    pm2 delete ecommerce-frontend 2>/dev/null || true
    echo -e "${GREEN}✓ Stopped existing services${NC}"
else
    echo -e "${YELLOW}⚠ PM2 not found, skipping${NC}"
fi

echo ""

# ============================================
# 4. START SERVICES
# ============================================
echo -e "${YELLOW}[4/5] Starting services...${NC}"

if [ -f "/var/www/ecosystem.config.js" ]; then
    cd /var/www
    pm2 start ecosystem.config.js
    pm2 save
    echo -e "${GREEN}✓ Services started${NC}"
else
    echo -e "${RED}✗ ecosystem.config.js not found${NC}"
    echo -e "${YELLOW}  Creating ecosystem.config.js...${NC}"
    
    cat > /var/www/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'ecommerce-backend',
      script: './dist/index.js',
      cwd: '/var/www/banyco.vn/ecommerce-backend',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3012
      },
      error_file: '/var/log/ecommerce-backend/error.log',
      out_file: '/var/log/ecommerce-backend/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G'
    },
    {
      name: 'ecommerce-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/banyco.vn/ecommerce-frontend',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/ecommerce-frontend/error.log',
      out_file: '/var/log/ecommerce-frontend/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G'
    }
  ]
};
EOF
    
    # Create log directories
    mkdir -p /var/log/ecommerce-backend
    mkdir -p /var/log/ecommerce-frontend
    
    cd /var/www
    pm2 start ecosystem.config.js
    pm2 save
    echo -e "${GREEN}✓ Services started with new config${NC}"
fi

echo ""

# ============================================
# 5. CHECK SERVICES STATUS
# ============================================
echo -e "${YELLOW}[5/5] Checking services status...${NC}"

sleep 3

pm2 status

echo ""
echo -e "${YELLOW}Testing endpoints...${NC}"

# Test backend
if curl -s http://localhost:3012/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is responding${NC}"
else
    echo -e "${RED}✗ Backend is not responding${NC}"
    echo -e "${YELLOW}  Check logs: pm2 logs ecommerce-backend${NC}"
fi

# Test frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend is responding${NC}"
else
    echo -e "${RED}✗ Frontend is not responding${NC}"
    echo -e "${YELLOW}  Check logs: pm2 logs ecommerce-frontend${NC}"
fi

echo ""

# ============================================
# SUMMARY
# ============================================
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  FIX COMPLETED${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Check PM2 logs: pm2 logs"
echo "2. Check service status: pm2 status"
echo "3. If still not working, check:"
echo "   - Environment variables in .env.local"
echo "   - Database connection"
echo "   - Nginx configuration"
echo ""
echo -e "${GREEN}Done!${NC}"









