#!/bin/bash

# ============================================
# SCRIPT KIỂM TRA TRẠNG THÁI SAU KHI DEPLOY
# ============================================
# Chạy script này trên VPS để kiểm tra mọi thứ

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
echo -e "${BLUE}  CHECKING DEPLOYMENT STATUS${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# ============================================
# 1. CHECK DIRECTORIES
# ============================================
echo -e "${YELLOW}[1/8] Checking directories...${NC}"

if [ -d "$BACKEND_DIR" ]; then
    echo -e "${GREEN}✓ Backend directory exists${NC}"
else
    echo -e "${RED}✗ Backend directory missing: $BACKEND_DIR${NC}"
fi

if [ -d "$FRONTEND_DIR" ]; then
    echo -e "${GREEN}✓ Frontend directory exists${NC}"
else
    echo -e "${RED}✗ Frontend directory missing: $FRONTEND_DIR${NC}"
fi

if [ -d "$BACKEND_DIR/dist" ]; then
    echo -e "${GREEN}✓ Backend dist/ exists${NC}"
else
    echo -e "${RED}✗ Backend dist/ missing${NC}"
fi

if [ -d "$FRONTEND_DIR/.next" ]; then
    echo -e "${GREEN}✓ Frontend .next/ exists${NC}"
else
    echo -e "${RED}✗ Frontend .next/ missing${NC}"
fi

echo ""

# ============================================
# 2. CHECK FILES
# ============================================
echo -e "${YELLOW}[2/8] Checking required files...${NC}"

if [ -f "$BACKEND_DIR/package.json" ]; then
    echo -e "${GREEN}✓ Backend package.json exists${NC}"
else
    echo -e "${RED}✗ Backend package.json missing${NC}"
fi

if [ -f "$BACKEND_DIR/dist/index.js" ]; then
    echo -e "${GREEN}✓ Backend index.js exists${NC}"
else
    echo -e "${RED}✗ Backend index.js missing${NC}"
fi

if [ -f "$FRONTEND_DIR/package.json" ]; then
    echo -e "${GREEN}✓ Frontend package.json exists${NC}"
else
    echo -e "${RED}✗ Frontend package.json missing${NC}"
fi

if [ -f "$FRONTEND_DIR/next.config.mjs" ]; then
    echo -e "${GREEN}✓ Frontend next.config.mjs exists${NC}"
else
    echo -e "${RED}✗ Frontend next.config.mjs missing${NC}"
fi

echo ""

# ============================================
# 3. CHECK ENVIRONMENT FILES
# ============================================
echo -e "${YELLOW}[3/8] Checking environment files...${NC}"

if [ -f "$BACKEND_DIR/.env.local" ]; then
    echo -e "${GREEN}✓ Backend .env.local exists${NC}"
    
    # Check important variables
    if grep -q "DB_PASSWORD" "$BACKEND_DIR/.env.local"; then
        echo -e "${GREEN}✓ DB_PASSWORD is set${NC}"
    else
        echo -e "${RED}✗ DB_PASSWORD not found${NC}"
    fi
    
    if grep -q "JWT_SECRET" "$BACKEND_DIR/.env.local"; then
        echo -e "${GREEN}✓ JWT_SECRET is set${NC}"
    else
        echo -e "${RED}✗ JWT_SECRET not found${NC}"
    fi
else
    echo -e "${RED}✗ Backend .env.local missing!${NC}"
    echo -e "${YELLOW}  Create it from .env.example${NC}"
fi

if [ -f "$FRONTEND_DIR/.env.local" ]; then
    echo -e "${GREEN}✓ Frontend .env.local exists${NC}"
    
    if grep -q "NEXT_PUBLIC_API_URL" "$FRONTEND_DIR/.env.local"; then
        echo -e "${GREEN}✓ NEXT_PUBLIC_API_URL is set${NC}"
    else
        echo -e "${RED}✗ NEXT_PUBLIC_API_URL not found${NC}"
    fi
else
    echo -e "${RED}✗ Frontend .env.local missing!${NC}"
    echo -e "${YELLOW}  Create it from .env.example${NC}"
fi

echo ""

# ============================================
# 4. CHECK NODE MODULES
# ============================================
echo -e "${YELLOW}[4/8] Checking node_modules...${NC}"

if [ -d "$BACKEND_DIR/node_modules" ]; then
    echo -e "${GREEN}✓ Backend node_modules exists${NC}"
else
    echo -e "${RED}✗ Backend node_modules missing${NC}"
    echo -e "${YELLOW}  Run: cd $BACKEND_DIR && npm install --omit=dev${NC}"
fi

if [ -d "$FRONTEND_DIR/node_modules" ]; then
    echo -e "${GREEN}✓ Frontend node_modules exists${NC}"
else
    echo -e "${RED}✗ Frontend node_modules missing${NC}"
    echo -e "${YELLOW}  Run: cd $FRONTEND_DIR && npm install --omit=dev${NC}"
fi

echo ""

# ============================================
# 5. CHECK PM2 SERVICES
# ============================================
echo -e "${YELLOW}[5/8] Checking PM2 services...${NC}"

if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✓ PM2 is installed${NC}"
    
    # Check if services are running
    if pm2 list | grep -q "ecommerce-backend"; then
        BACKEND_STATUS=$(pm2 jlist | jq -r '.[] | select(.name=="ecommerce-backend") | .pm2_env.status' 2>/dev/null || echo "unknown")
        if [ "$BACKEND_STATUS" = "online" ]; then
            echo -e "${GREEN}✓ Backend service is running${NC}"
        else
            echo -e "${RED}✗ Backend service status: $BACKEND_STATUS${NC}"
            echo -e "${YELLOW}  Run: pm2 restart ecommerce-backend${NC}"
        fi
    else
        echo -e "${RED}✗ Backend service not found in PM2${NC}"
        echo -e "${YELLOW}  Run: pm2 start ecosystem.config.js${NC}"
    fi
    
    if pm2 list | grep -q "ecommerce-frontend"; then
        FRONTEND_STATUS=$(pm2 jlist | jq -r '.[] | select(.name=="ecommerce-frontend") | .pm2_env.status' 2>/dev/null || echo "unknown")
        if [ "$FRONTEND_STATUS" = "online" ]; then
            echo -e "${GREEN}✓ Frontend service is running${NC}"
        else
            echo -e "${RED}✗ Frontend service status: $FRONTEND_STATUS${NC}"
            echo -e "${YELLOW}  Run: pm2 restart ecommerce-frontend${NC}"
        fi
    else
        echo -e "${RED}✗ Frontend service not found in PM2${NC}"
        echo -e "${YELLOW}  Run: pm2 start ecosystem.config.js${NC}"
    fi
else
    echo -e "${RED}✗ PM2 is not installed${NC}"
    echo -e "${YELLOW}  Install: npm install -g pm2${NC}"
fi

echo ""

# ============================================
# 6. CHECK PORTS
# ============================================
echo -e "${YELLOW}[6/8] Checking ports...${NC}"

if netstat -tuln 2>/dev/null | grep -q ":3012"; then
    echo -e "${GREEN}✓ Port 3012 (backend) is in use${NC}"
else
    echo -e "${RED}✗ Port 3012 (backend) is not in use${NC}"
    echo -e "${YELLOW}  Backend may not be running${NC}"
fi

if netstat -tuln 2>/dev/null | grep -q ":3000"; then
    echo -e "${GREEN}✓ Port 3000 (frontend) is in use${NC}"
else
    echo -e "${RED}✗ Port 3000 (frontend) is not in use${NC}"
    echo -e "${YELLOW}  Frontend may not be running${NC}"
fi

echo ""

# ============================================
# 7. CHECK DATABASE CONNECTION
# ============================================
echo -e "${YELLOW}[7/8] Checking database connection...${NC}"

if [ -f "$BACKEND_DIR/.env.local" ]; then
    source <(grep -E '^DB_' "$BACKEND_DIR/.env.local" | sed 's/^/export /')
    
    if [ ! -z "$DB_PASSWORD" ]; then
        if PGPASSWORD="$DB_PASSWORD" psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Database connection successful${NC}"
        else
            echo -e "${RED}✗ Database connection failed${NC}"
            echo -e "${YELLOW}  Check DB credentials in .env.local${NC}"
        fi
    else
        echo -e "${RED}✗ DB_PASSWORD not set${NC}"
    fi
else
    echo -e "${RED}✗ Cannot check database (no .env.local)${NC}"
fi

echo ""

# ============================================
# 8. CHECK NGINX
# ============================================
echo -e "${YELLOW}[8/8] Checking Nginx...${NC}"

if command -v nginx &> /dev/null; then
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✓ Nginx is running${NC}"
        
        if nginx -t 2>/dev/null; then
            echo -e "${GREEN}✓ Nginx config is valid${NC}"
        else
            echo -e "${RED}✗ Nginx config has errors${NC}"
            echo -e "${YELLOW}  Run: sudo nginx -t${NC}"
        fi
    else
        echo -e "${RED}✗ Nginx is not running${NC}"
        echo -e "${YELLOW}  Run: sudo systemctl start nginx${NC}"
    fi
else
    echo -e "${RED}✗ Nginx is not installed${NC}"
fi

echo ""

# ============================================
# SUMMARY
# ============================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  QUICK FIXES${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}If services are not running, try:${NC}"
echo ""
echo "1. Install dependencies:"
echo "   cd $BACKEND_DIR && npm install --omit=dev"
echo "   cd $FRONTEND_DIR && npm install --omit=dev"
echo ""
echo "2. Restart PM2 services:"
echo "   pm2 restart all"
echo ""
echo "3. Check PM2 logs:"
echo "   pm2 logs"
echo ""
echo "4. Check Nginx:"
echo "   sudo systemctl status nginx"
echo "   sudo nginx -t"
echo ""
echo -e "${GREEN}Check completed!${NC}"









