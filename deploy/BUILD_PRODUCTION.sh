#!/bin/bash

# ============================================
# SCRIPT BUILD PRODUCTION ĐẦY ĐỦ
# ============================================
# Script này sẽ build và copy đầy đủ tất cả files cần thiết
# Chạy: bash BUILD_PRODUCTION.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
DEPLOY_BACKEND="$SCRIPT_DIR/backend"
DEPLOY_FRONTEND="$SCRIPT_DIR/frontend"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  BUILD PRODUCTION - ĐẦY ĐỦ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# ============================================
# 1. BUILD BACKEND
# ============================================
echo -e "${YELLOW}[1/6] Building backend...${NC}"
cd "$BACKEND_DIR"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Backend build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}[OK] Backend built successfully${NC}"
echo ""

# ============================================
# 2. CHECK ENVIRONMENT VARIABLES & BUILD FRONTEND
# ============================================
echo -e "${YELLOW}[2/6] Checking environment variables and building frontend...${NC}"
cd "$FRONTEND_DIR"

# Check for .env.local
ENV_LOCAL="$FRONTEND_DIR/.env.local"
ENV_PRODUCTION="$FRONTEND_DIR/.env.production"

# Check if production env vars are set
API_DOMAIN="$NEXT_PUBLIC_API_DOMAIN"
API_URL="$NEXT_PUBLIC_API_URL"
NODE_ENV_VAR="$NODE_ENV"

if [ -z "$API_DOMAIN" ] && [ -z "$API_URL" ]; then
    # Try to read from .env.local
    if [ -f "$ENV_LOCAL" ]; then
        echo -e "  ${BLUE}[INFO] Found .env.local, checking for API domain...${NC}"
        if grep -q "NEXT_PUBLIC_API_DOMAIN=" "$ENV_LOCAL"; then
            API_DOMAIN=$(grep "NEXT_PUBLIC_API_DOMAIN=" "$ENV_LOCAL" | cut -d '=' -f2 | tr -d ' "'"'"' | head -1)
            # Check if it's localhost
            if echo "$API_DOMAIN" | grep -q "localhost"; then
                echo -e "  ${RED}[WARNING] Found localhost in NEXT_PUBLIC_API_DOMAIN!${NC}"
                echo -e "  ${RED}[WARNING] This will cause errors on production!${NC}"
                echo ""
                echo -e "  ${YELLOW}Please update frontend/.env.local with:${NC}"
                echo -e "    ${GRAY}NEXT_PUBLIC_API_DOMAIN=banyco.vn${NC}"
                echo -e "    ${GRAY}NODE_ENV=production${NC}"
                echo ""
                read -p "Continue anyway? (y/N): " continue_build
                if [ "$continue_build" != "y" ] && [ "$continue_build" != "Y" ]; then
                    echo -e "${RED}[CANCELLED] Please update .env.local with production domain first${NC}"
                    exit 1
                fi
            else
                echo -e "  ${GREEN}[OK] Found NEXT_PUBLIC_API_DOMAIN=$API_DOMAIN in .env.local${NC}"
            fi
        elif grep -q "NEXT_PUBLIC_API_URL=" "$ENV_LOCAL"; then
            API_URL=$(grep "NEXT_PUBLIC_API_URL=" "$ENV_LOCAL" | cut -d '=' -f2 | tr -d ' "'"'"' | head -1)
            if echo "$API_URL" | grep -q "localhost"; then
                echo -e "  ${RED}[WARNING] Found localhost in NEXT_PUBLIC_API_URL!${NC}"
                echo -e "  ${RED}[WARNING] This will cause errors on production!${NC}"
                echo ""
                echo -e "  ${YELLOW}Please update frontend/.env.local with:${NC}"
                echo -e "    ${GRAY}NEXT_PUBLIC_API_URL=https://banyco.vn/api${NC}"
                echo -e "    ${GRAY}NODE_ENV=production${NC}"
                echo ""
                read -p "Continue anyway? (y/N): " continue_build
                if [ "$continue_build" != "y" ] && [ "$continue_build" != "Y" ]; then
                    echo -e "${RED}[CANCELLED] Please update .env.local with production domain first${NC}"
                    exit 1
                fi
            else
                echo -e "  ${GREEN}[OK] Found NEXT_PUBLIC_API_URL=$API_URL in .env.local${NC}"
            fi
        fi
    fi
fi

if [ -z "$API_DOMAIN" ] && [ -z "$API_URL" ]; then
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}  WARNING: Missing Production API Domain!${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo -e "${YELLOW}Next.js will embed NEXT_PUBLIC_* variables into the build.${NC}"
    echo -e "${YELLOW}Without production API domain, the app will use localhost!${NC}"
    echo ""
    echo -e "${BLUE}SOLUTION:${NC}"
    echo -e "${WHITE}1. Create frontend/.env.local with:${NC}"
    echo -e "${GRAY}   NEXT_PUBLIC_API_DOMAIN=banyco.vn${NC}"
    echo -e "${GRAY}   NODE_ENV=production${NC}"
    echo ""
    echo -e "${WHITE}2. Or set environment variables before building:${NC}"
    echo -e "${GRAY}   export NEXT_PUBLIC_API_DOMAIN=banyco.vn${NC}"
    echo -e "${GRAY}   export NODE_ENV=production${NC}"
    echo ""
    read -p "Continue anyway? (y/N): " continue_build
    if [ "$continue_build" != "y" ] && [ "$continue_build" != "Y" ]; then
        echo -e "${RED}[CANCELLED] Please set production environment variables first${NC}"
        exit 1
    fi
    echo ""
fi

# Set NODE_ENV if not set
if [ -z "$NODE_ENV_VAR" ]; then
    export NODE_ENV="production"
    echo -e "  ${BLUE}[INFO] Set NODE_ENV=production${NC}"
fi

# Build frontend
echo -e "  ${BLUE}[INFO] Building with environment variables...${NC}"
if [ -n "$API_DOMAIN" ]; then
    echo -e "  ${BLUE}[INFO] NEXT_PUBLIC_API_DOMAIN=$API_DOMAIN${NC}"
    export NEXT_PUBLIC_API_DOMAIN="$API_DOMAIN"
fi
if [ -n "$API_URL" ]; then
    echo -e "  ${BLUE}[INFO] NEXT_PUBLIC_API_URL=$API_URL${NC}"
    export NEXT_PUBLIC_API_URL="$API_URL"
fi

npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Frontend build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}[OK] Frontend built successfully${NC}"
echo ""

# ============================================
# 3. PREPARE BACKEND DEPLOY
# ============================================
echo -e "${YELLOW}[3/6] Preparing backend for deployment...${NC}"

# Create directory
mkdir -p "$DEPLOY_BACKEND"

# Copy dist
if [ -d "$DEPLOY_BACKEND/dist" ]; then
    rm -rf "$DEPLOY_BACKEND/dist"
fi
cp -r "$BACKEND_DIR/dist" "$DEPLOY_BACKEND/"
echo -e "  ${GREEN}[OK] Copied dist/${NC}"

# Copy package files
cp "$BACKEND_DIR/package.json" "$DEPLOY_BACKEND/"
cp "$BACKEND_DIR/package-lock.json" "$DEPLOY_BACKEND/" 2>/dev/null || true
echo -e "  ${GREEN}[OK] Copied package.json${NC}"

# Copy migration SQL files
if [ -d "$BACKEND_DIR/src/migrations" ]; then
    mkdir -p "$DEPLOY_BACKEND/migrations"
    cp "$BACKEND_DIR/src/migrations"/*.sql "$DEPLOY_BACKEND/migrations/" 2>/dev/null || true
    echo -e "  ${GREEN}[OK] Copied migration SQL files${NC}"
fi

# Copy uploads folder (IMAGES - QUAN TRỌNG!)
BACKEND_UPLOADS="$BACKEND_DIR/storage/uploads"
DEPLOY_UPLOADS="$SCRIPT_DIR/uploads"
if [ -d "$BACKEND_UPLOADS" ]; then
    fileCount=$(find "$BACKEND_UPLOADS" -type f | wc -l)
    echo -e "  ${BLUE}[INFO] Found $fileCount image files in storage/uploads${NC}"
    if [ -d "$DEPLOY_UPLOADS" ]; then
        rm -rf "$DEPLOY_UPLOADS"
    fi
    cp -r "$BACKEND_UPLOADS" "$DEPLOY_UPLOADS"
    echo -e "  ${GREEN}[OK] Copied uploads/ folder ($fileCount files) - REQUIRED for images!${NC}"
else
    echo -e "  ${YELLOW}[WARNING] No uploads folder found in backend/storage/uploads${NC}"
fi

echo -e "${GREEN}[OK] Backend prepared${NC}"
echo ""

# ============================================
# 4. PREPARE FRONTEND DEPLOY (ĐẦY ĐỦ)
# ============================================
echo -e "${YELLOW}[4/6] Preparing frontend for deployment (FULL)...${NC}"

# Create directory
mkdir -p "$DEPLOY_FRONTEND"

# Copy .next (build output)
if [ -d "$DEPLOY_FRONTEND/.next" ]; then
    rm -rf "$DEPLOY_FRONTEND/.next"
fi
cp -r "$FRONTEND_DIR/.next" "$DEPLOY_FRONTEND/"
echo -e "  ${GREEN}[OK] Copied .next/${NC}"

# Copy app/ folder (QUAN TRỌNG - Next.js cần để chạy!)
if [ -d "$DEPLOY_FRONTEND/app" ]; then
    rm -rf "$DEPLOY_FRONTEND/app"
fi
cp -r "$FRONTEND_DIR/app" "$DEPLOY_FRONTEND/"
echo -e "  ${GREEN}[OK] Copied app/ folder (REQUIRED!)${NC}"

# Copy public
if [ -d "$DEPLOY_FRONTEND/public" ]; then
    rm -rf "$DEPLOY_FRONTEND/public"
fi
cp -r "$FRONTEND_DIR/public" "$DEPLOY_FRONTEND/"
echo -e "  ${GREEN}[OK] Copied public/${NC}"

# Copy package files
cp "$FRONTEND_DIR/package.json" "$DEPLOY_FRONTEND/"
cp "$FRONTEND_DIR/package-lock.json" "$DEPLOY_FRONTEND/" 2>/dev/null || true
echo -e "  ${GREEN}[OK] Copied package.json${NC}"

# Copy config files
cp "$FRONTEND_DIR/next.config.mjs" "$DEPLOY_FRONTEND/"
echo -e "  ${GREEN}[OK] Copied next.config.mjs${NC}"

# Copy middleware.ts (nếu có)
if [ -f "$FRONTEND_DIR/middleware.ts" ]; then
    cp "$FRONTEND_DIR/middleware.ts" "$DEPLOY_FRONTEND/"
    echo -e "  ${GREEN}[OK] Copied middleware.ts${NC}"
fi

# Copy tsconfig.json (nếu có)
if [ -f "$FRONTEND_DIR/tsconfig.json" ]; then
    cp "$FRONTEND_DIR/tsconfig.json" "$DEPLOY_FRONTEND/"
    echo -e "  ${GREEN}[OK] Copied tsconfig.json${NC}"
fi

# Copy components/ folder (QUAN TRỌNG - Next.js cần để chạy!)
if [ -d "$DEPLOY_FRONTEND/components" ]; then
    rm -rf "$DEPLOY_FRONTEND/components"
fi
if [ -d "$FRONTEND_DIR/components" ]; then
    cp -r "$FRONTEND_DIR/components" "$DEPLOY_FRONTEND/"
    echo -e "  ${GREEN}[OK] Copied components/ folder (REQUIRED!)${NC}"
fi

# Copy lib/ folder (QUAN TRỌNG - Chứa API clients, utils, stores)
if [ -d "$DEPLOY_FRONTEND/lib" ]; then
    rm -rf "$DEPLOY_FRONTEND/lib"
fi
if [ -d "$FRONTEND_DIR/lib" ]; then
    cp -r "$FRONTEND_DIR/lib" "$DEPLOY_FRONTEND/"
    echo -e "  ${GREEN}[OK] Copied lib/ folder (REQUIRED!)${NC}"
fi

# Copy config/ folder
if [ -d "$DEPLOY_FRONTEND/config" ]; then
    rm -rf "$DEPLOY_FRONTEND/config"
fi
if [ -d "$FRONTEND_DIR/config" ]; then
    cp -r "$FRONTEND_DIR/config" "$DEPLOY_FRONTEND/"
    echo -e "  ${GREEN}[OK] Copied config/ folder${NC}"
fi

# Copy tailwind.config.ts
if [ -f "$FRONTEND_DIR/tailwind.config.ts" ]; then
    cp "$FRONTEND_DIR/tailwind.config.ts" "$DEPLOY_FRONTEND/"
    echo -e "  ${GREEN}[OK] Copied tailwind.config.ts${NC}"
fi

# Copy postcss.config.js
if [ -f "$FRONTEND_DIR/postcss.config.js" ]; then
    cp "$FRONTEND_DIR/postcss.config.js" "$DEPLOY_FRONTEND/"
    echo -e "  ${GREEN}[OK] Copied postcss.config.js${NC}"
fi

# Copy .env.local if exists (for reference, not used in production)
if [ -f "$FRONTEND_DIR/.env.local" ]; then
    cp "$FRONTEND_DIR/.env.local" "$DEPLOY_FRONTEND/.env.local.example"
    echo -e "  ${GREEN}[OK] Copied .env.local as .env.local.example${NC}"
fi

echo -e "${GREEN}[OK] Frontend prepared (FULL)${NC}"
echo ""

# ============================================
# 5. VERIFICATION
# ============================================
echo -e "${YELLOW}[5/6] Verifying deployment package...${NC}"

ERRORS=0

# Check backend
if [ ! -f "$DEPLOY_BACKEND/dist/index.js" ]; then
    echo -e "${RED}[ERROR] Backend dist/index.js missing${NC}"
    ERRORS=1
fi

# Check frontend - QUAN TRỌNG
if [ ! -d "$DEPLOY_FRONTEND/.next" ]; then
    echo -e "${RED}[ERROR] Frontend .next/ missing${NC}"
    ERRORS=1
fi

if [ ! -d "$DEPLOY_FRONTEND/app" ]; then
    echo -e "${RED}[ERROR] Frontend app/ missing (REQUIRED!)${NC}"
    ERRORS=1
fi

if [ ! -f "$DEPLOY_FRONTEND/app/layout.tsx" ]; then
    echo -e "${RED}[ERROR] Frontend app/layout.tsx missing${NC}"
    ERRORS=1
fi

if [ ! -f "$DEPLOY_FRONTEND/package.json" ]; then
    echo -e "${RED}[ERROR] Frontend package.json missing${NC}"
    ERRORS=1
fi

if [ ! -f "$DEPLOY_FRONTEND/next.config.mjs" ]; then
    echo -e "${RED}[ERROR] Frontend next.config.mjs missing${NC}"
    ERRORS=1
fi

if [ ! -d "$DEPLOY_FRONTEND/components" ]; then
    echo -e "${RED}[ERROR] Frontend components/ missing (REQUIRED!)${NC}"
    ERRORS=1
fi

if [ ! -d "$DEPLOY_FRONTEND/lib" ]; then
    echo -e "${RED}[ERROR] Frontend lib/ missing (REQUIRED!)${NC}"
    ERRORS=1
fi

if [ $ERRORS -eq 1 ]; then
    echo -e "${RED}[ERROR] Verification failed!${NC}"
    exit 1
fi

echo -e "${GREEN}[OK] All required files present${NC}"
echo ""

# ============================================
# 6. SUMMARY
# ============================================
echo -e "${YELLOW}[6/6] Build summary...${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  BUILD COMPLETED SUCCESSFULLY${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

echo -e "${BLUE}Backend files:${NC}"
echo "  ✓ dist/ folder"
echo "  ✓ package.json"
echo "  ✓ migrations/ (if any)"
echo ""
echo -e "${BLUE}Uploads (Images):${NC}"
echo "  ✓ uploads/ folder (REQUIRED for images!)"
echo -e "  ${YELLOW}[INFO] Upload this to /var/www/banyco.vn/ecommerce-uploads/ on VPS${NC}"
echo ""

echo -e "${BLUE}Frontend files:${NC}"
echo "  ✓ .next/ folder (build output)"
echo "  ✓ app/ folder (REQUIRED for Next.js!)"
echo "  ✓ components/ folder (REQUIRED!)"
echo "  ✓ lib/ folder (REQUIRED!)"
echo "  ✓ config/ folder"
echo "  ✓ public/ folder"
echo "  ✓ middleware.ts"
echo "  ✓ tsconfig.json"
echo "  ✓ tailwind.config.ts"
echo "  ✓ postcss.config.js"
echo "  ✓ package.json"
echo "  ✓ next.config.mjs"
echo ""

echo -e "${YELLOW}Deployment package ready in: $SCRIPT_DIR${NC}"
echo ""
echo -e "${YELLOW}Next step: Upload to VPS using WinSCP${NC}"
echo ""

cd "$ROOT_DIR"

