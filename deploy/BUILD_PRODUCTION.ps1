# ============================================
# SCRIPT BUILD PRODUCTION ĐẦY ĐỦ
# ============================================
# Script này sẽ build và copy đầy đủ tất cả files cần thiết
# Chạy: .\BUILD_PRODUCTION.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BUILD PRODUCTION - ĐẦY ĐỦ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ROOT_DIR = Split-Path -Parent $PSScriptRoot
$BACKEND_DIR = Join-Path $ROOT_DIR "backend"
$FRONTEND_DIR = Join-Path $ROOT_DIR "frontend"
$DEPLOY_BACKEND = Join-Path $PSScriptRoot "backend"
$DEPLOY_FRONTEND = Join-Path $PSScriptRoot "frontend"

# ============================================
# 1. BUILD BACKEND
# ============================================
Write-Host "[1/6] Building backend..." -ForegroundColor Yellow
Set-Location $BACKEND_DIR
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Backend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Backend built successfully" -ForegroundColor Green
Write-Host ""

# ============================================
# 2. CHECK ENVIRONMENT VARIABLES & BUILD FRONTEND
# ============================================
Write-Host "[2/6] Checking environment variables and building frontend..." -ForegroundColor Yellow
Set-Location $FRONTEND_DIR

# Check for .env.local
$ENV_LOCAL = Join-Path $FRONTEND_DIR ".env.local"
$ENV_PRODUCTION = Join-Path $FRONTEND_DIR ".env.production"

# Check if production env vars are set
$API_DOMAIN = $env:NEXT_PUBLIC_API_DOMAIN
$API_URL = $env:NEXT_PUBLIC_API_URL
$NODE_ENV = $env:NODE_ENV

if (-not $API_DOMAIN -and -not $API_URL) {
    # Try to read from .env.local
    if (Test-Path $ENV_LOCAL) {
        Write-Host "  [INFO] Found .env.local, checking for API domain..." -ForegroundColor Cyan
        $envContent = Get-Content $ENV_LOCAL -Raw
        if ($envContent -match "NEXT_PUBLIC_API_DOMAIN=(.+)") {
            $API_DOMAIN = $matches[1].Trim()
            # Check if it's localhost
            if ($API_DOMAIN -match "localhost") {
                Write-Host "" -ForegroundColor Red
                Write-Host "========================================" -ForegroundColor Red
                Write-Host "  ERROR: localhost detected in .env.local!" -ForegroundColor Red
                Write-Host "========================================" -ForegroundColor Red
                Write-Host ""
                Write-Host "File frontend/.env.local contains:" -ForegroundColor Yellow
                Write-Host "  NEXT_PUBLIC_API_DOMAIN=localhost:3012" -ForegroundColor Gray
                Write-Host ""
                Write-Host "This will cause errors on production!" -ForegroundColor Yellow
                Write-Host ""
                Write-Host "SOLUTION:" -ForegroundColor Cyan
                Write-Host "1. Edit frontend/.env.local and change:" -ForegroundColor White
                Write-Host "   FROM: NEXT_PUBLIC_API_DOMAIN=localhost:3012" -ForegroundColor Gray
                Write-Host "   TO:   NEXT_PUBLIC_API_DOMAIN=banyco.vn" -ForegroundColor Green
                Write-Host ""
                Write-Host "   FROM: NODE_ENV=development" -ForegroundColor Gray
                Write-Host "   TO:   NODE_ENV=production" -ForegroundColor Green
                Write-Host ""
                Write-Host "2. Then run this script again" -ForegroundColor White
                Write-Host ""
                Write-Host "[CANCELLED] Please fix .env.local first!" -ForegroundColor Red
                exit 1
            } else {
                Write-Host "  [OK] Found NEXT_PUBLIC_API_DOMAIN=$API_DOMAIN in .env.local" -ForegroundColor Green
            }
        } elseif ($envContent -match "NEXT_PUBLIC_API_URL=(.+)") {
            $API_URL = $matches[1].Trim()
            if ($API_URL -match "localhost") {
                Write-Host "" -ForegroundColor Red
                Write-Host "========================================" -ForegroundColor Red
                Write-Host "  ERROR: localhost detected in .env.local!" -ForegroundColor Red
                Write-Host "========================================" -ForegroundColor Red
                Write-Host ""
                Write-Host "File frontend/.env.local contains localhost!" -ForegroundColor Yellow
                Write-Host ""
                Write-Host "SOLUTION:" -ForegroundColor Cyan
                Write-Host "1. Edit frontend/.env.local and change:" -ForegroundColor White
                Write-Host "   FROM: NEXT_PUBLIC_API_URL=http://localhost:3012/api" -ForegroundColor Gray
                Write-Host "   TO:   NEXT_PUBLIC_API_URL=https://banyco.vn/api" -ForegroundColor Green
                Write-Host ""
                Write-Host "   FROM: NODE_ENV=development" -ForegroundColor Gray
                Write-Host "   TO:   NODE_ENV=production" -ForegroundColor Green
                Write-Host ""
                Write-Host "2. Then run this script again" -ForegroundColor White
                Write-Host ""
                Write-Host "[CANCELLED] Please fix .env.local first!" -ForegroundColor Red
                exit 1
            } else {
                Write-Host "  [OK] Found NEXT_PUBLIC_API_URL=$API_URL in .env.local" -ForegroundColor Green
            }
        }
    }
}

if (-not $API_DOMAIN -and -not $API_URL) {
    Write-Host "" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  WARNING: Missing Production API Domain!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Next.js will embed NEXT_PUBLIC_* variables into the build." -ForegroundColor Yellow
    Write-Host "Without production API domain, the app will use localhost!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "SOLUTION:" -ForegroundColor Cyan
    Write-Host "1. Create frontend/.env.local with:" -ForegroundColor White
    Write-Host "   NEXT_PUBLIC_API_DOMAIN=banyco.vn" -ForegroundColor Gray
    Write-Host "   NODE_ENV=production" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Or set environment variables before building:" -ForegroundColor White
    Write-Host "   `$env:NEXT_PUBLIC_API_DOMAIN='banyco.vn'" -ForegroundColor Gray
    Write-Host "   `$env:NODE_ENV='production'" -ForegroundColor Gray
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "[CANCELLED] Please set production environment variables first" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Set NODE_ENV if not set
if (-not $NODE_ENV) {
    $env:NODE_ENV = "production"
    Write-Host "  [INFO] Set NODE_ENV=production" -ForegroundColor Cyan
}

# Build frontend
Write-Host "  [INFO] Building with environment variables..." -ForegroundColor Cyan
if ($API_DOMAIN) {
    Write-Host "  [INFO] NEXT_PUBLIC_API_DOMAIN=$API_DOMAIN" -ForegroundColor Cyan
    $env:NEXT_PUBLIC_API_DOMAIN = $API_DOMAIN
}
if ($API_URL) {
    Write-Host "  [INFO] NEXT_PUBLIC_API_URL=$API_URL" -ForegroundColor Cyan
    $env:NEXT_PUBLIC_API_URL = $API_URL
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Frontend built successfully" -ForegroundColor Green
Write-Host ""

# ============================================
# 3. PREPARE BACKEND DEPLOY
# ============================================
Write-Host "[3/6] Preparing backend for deployment..." -ForegroundColor Yellow

# Create directory
New-Item -ItemType Directory -Force -Path $DEPLOY_BACKEND | Out-Null

# Copy dist
$BACKEND_DIST = Join-Path $BACKEND_DIR "dist"
$DEPLOY_DIST = Join-Path $DEPLOY_BACKEND "dist"
if (Test-Path $DEPLOY_DIST) {
    Remove-Item -Recurse -Force $DEPLOY_DIST
}
Copy-Item -Recurse $BACKEND_DIST $DEPLOY_DIST
Write-Host "  [OK] Copied dist/" -ForegroundColor Green

# Copy package files
Copy-Item (Join-Path $BACKEND_DIR "package.json") $DEPLOY_BACKEND -Force
Copy-Item (Join-Path $BACKEND_DIR "package-lock.json") $DEPLOY_BACKEND -Force -ErrorAction SilentlyContinue
Write-Host "  [OK] Copied package.json" -ForegroundColor Green

# Copy migration SQL files
$BACKEND_MIGRATIONS = Join-Path $BACKEND_DIR "src\migrations"
if (Test-Path $BACKEND_MIGRATIONS) {
    $DEPLOY_MIGRATIONS = Join-Path $DEPLOY_BACKEND "migrations"
    New-Item -ItemType Directory -Force -Path $DEPLOY_MIGRATIONS | Out-Null
    Get-ChildItem -Path $BACKEND_MIGRATIONS -Filter "*.sql" | Copy-Item -Destination $DEPLOY_MIGRATIONS -Force
    Write-Host "  [OK] Copied migration SQL files" -ForegroundColor Green
}

# Copy uploads folder (IMAGES - QUAN TRỌNG!)
$BACKEND_UPLOADS = Join-Path $BACKEND_DIR "storage\uploads"
$DEPLOY_UPLOADS = Join-Path $PSScriptRoot "uploads"
if (Test-Path $BACKEND_UPLOADS) {
    $fileCount = (Get-ChildItem -Path $BACKEND_UPLOADS -Recurse -File | Measure-Object).Count
    Write-Host "  [INFO] Found $fileCount image files in storage/uploads" -ForegroundColor Cyan
    if (Test-Path $DEPLOY_UPLOADS) {
        Remove-Item -Recurse -Force $DEPLOY_UPLOADS
    }
    Copy-Item -Recurse $BACKEND_UPLOADS $DEPLOY_UPLOADS
    Write-Host "  [OK] Copied uploads/ folder ($fileCount files) - REQUIRED for images!" -ForegroundColor Green
} else {
    Write-Host "  [WARNING] No uploads folder found in backend/storage/uploads" -ForegroundColor Yellow
}

Write-Host "[OK] Backend prepared" -ForegroundColor Green
Write-Host ""

# ============================================
# 4. PREPARE FRONTEND DEPLOY (ĐẦY ĐỦ)
# ============================================
Write-Host "[4/6] Preparing frontend for deployment (FULL)..." -ForegroundColor Yellow

# Create directory
New-Item -ItemType Directory -Force -Path $DEPLOY_FRONTEND | Out-Null

# Copy .next (build output)
$FRONTEND_NEXT = Join-Path $FRONTEND_DIR ".next"
$DEPLOY_NEXT = Join-Path $DEPLOY_FRONTEND ".next"
if (Test-Path $DEPLOY_NEXT) {
    Remove-Item -Recurse -Force $DEPLOY_NEXT
}
Copy-Item -Recurse $FRONTEND_NEXT $DEPLOY_NEXT
Write-Host "  [OK] Copied .next/" -ForegroundColor Green

# Copy app/ folder (QUAN TRỌNG - Next.js cần để chạy!)
$FRONTEND_APP = Join-Path $FRONTEND_DIR "app"
$DEPLOY_APP = Join-Path $DEPLOY_FRONTEND "app"
if (Test-Path $DEPLOY_APP) {
    Remove-Item -Recurse -Force $DEPLOY_APP
}
Copy-Item -Recurse $FRONTEND_APP $DEPLOY_APP
Write-Host "  [OK] Copied app/ folder (REQUIRED!)" -ForegroundColor Green

# Copy public
$FRONTEND_PUBLIC = Join-Path $FRONTEND_DIR "public"
$DEPLOY_PUBLIC = Join-Path $DEPLOY_FRONTEND "public"
if (Test-Path $DEPLOY_PUBLIC) {
    Remove-Item -Recurse -Force $DEPLOY_PUBLIC
}
Copy-Item -Recurse $FRONTEND_PUBLIC $DEPLOY_PUBLIC
Write-Host "  [OK] Copied public/" -ForegroundColor Green

# Copy package files
Copy-Item (Join-Path $FRONTEND_DIR "package.json") $DEPLOY_FRONTEND -Force
Copy-Item (Join-Path $FRONTEND_DIR "package-lock.json") $DEPLOY_FRONTEND -Force -ErrorAction SilentlyContinue
Write-Host "  [OK] Copied package.json" -ForegroundColor Green

# Copy config files
Copy-Item (Join-Path $FRONTEND_DIR "next.config.mjs") $DEPLOY_FRONTEND -Force
Write-Host "  [OK] Copied next.config.mjs" -ForegroundColor Green

# Copy middleware.ts (nếu có)
$FRONTEND_MIDDLEWARE = Join-Path $FRONTEND_DIR "middleware.ts"
if (Test-Path $FRONTEND_MIDDLEWARE) {
    Copy-Item $FRONTEND_MIDDLEWARE $DEPLOY_FRONTEND -Force
    Write-Host "  [OK] Copied middleware.ts" -ForegroundColor Green
}

# Copy tsconfig.json (nếu có)
$FRONTEND_TSCONFIG = Join-Path $FRONTEND_DIR "tsconfig.json"
if (Test-Path $FRONTEND_TSCONFIG) {
    Copy-Item $FRONTEND_TSCONFIG $DEPLOY_FRONTEND -Force
    Write-Host "  [OK] Copied tsconfig.json" -ForegroundColor Green
}

# Copy components/ folder (QUAN TRỌNG - Next.js cần để chạy!)
$FRONTEND_COMPONENTS = Join-Path $FRONTEND_DIR "components"
$DEPLOY_COMPONENTS = Join-Path $DEPLOY_FRONTEND "components"
if (Test-Path $DEPLOY_COMPONENTS) {
    Remove-Item -Recurse -Force $DEPLOY_COMPONENTS
}
if (Test-Path $FRONTEND_COMPONENTS) {
    Copy-Item -Recurse $FRONTEND_COMPONENTS $DEPLOY_COMPONENTS
    Write-Host "  [OK] Copied components/ folder (REQUIRED!)" -ForegroundColor Green
}

# Copy lib/ folder (QUAN TRỌNG - Chứa API clients, utils, stores)
$FRONTEND_LIB = Join-Path $FRONTEND_DIR "lib"
$DEPLOY_LIB = Join-Path $DEPLOY_FRONTEND "lib"
if (Test-Path $DEPLOY_LIB) {
    Remove-Item -Recurse -Force $DEPLOY_LIB
}
if (Test-Path $FRONTEND_LIB) {
    Copy-Item -Recurse $FRONTEND_LIB $DEPLOY_LIB
    Write-Host "  [OK] Copied lib/ folder (REQUIRED!)" -ForegroundColor Green
}

# Copy config/ folder
$FRONTEND_CONFIG = Join-Path $FRONTEND_DIR "config"
$DEPLOY_CONFIG = Join-Path $DEPLOY_FRONTEND "config"
if (Test-Path $DEPLOY_CONFIG) {
    Remove-Item -Recurse -Force $DEPLOY_CONFIG
}
if (Test-Path $FRONTEND_CONFIG) {
    Copy-Item -Recurse $FRONTEND_CONFIG $DEPLOY_CONFIG
    Write-Host "  [OK] Copied config/ folder" -ForegroundColor Green
}

# Copy tailwind.config.ts
$FRONTEND_TAILWIND = Join-Path $FRONTEND_DIR "tailwind.config.ts"
if (Test-Path $FRONTEND_TAILWIND) {
    Copy-Item $FRONTEND_TAILWIND $DEPLOY_FRONTEND -Force
    Write-Host "  [OK] Copied tailwind.config.ts" -ForegroundColor Green
}

# Copy postcss.config.js
$FRONTEND_POSTCSS = Join-Path $FRONTEND_DIR "postcss.config.js"
if (Test-Path $FRONTEND_POSTCSS) {
    Copy-Item $FRONTEND_POSTCSS $DEPLOY_FRONTEND -Force
    Write-Host "  [OK] Copied postcss.config.js" -ForegroundColor Green
}

# Copy .env.local if exists (for reference, not used in production)
$FRONTEND_ENV_LOCAL = Join-Path $FRONTEND_DIR ".env.local"
if (Test-Path $FRONTEND_ENV_LOCAL) {
    Copy-Item $FRONTEND_ENV_LOCAL "$DEPLOY_FRONTEND/.env.local.example" -Force
    Write-Host "  [OK] Copied .env.local as .env.local.example" -ForegroundColor Green
}

Write-Host "[OK] Frontend prepared (FULL)" -ForegroundColor Green
Write-Host ""

# ============================================
# 5. VERIFICATION
# ============================================
Write-Host "[5/6] Verifying deployment package..." -ForegroundColor Yellow

$ERRORS = @()

# Check backend
if (-not (Test-Path "$DEPLOY_BACKEND\dist\index.js")) {
    $ERRORS += "Backend dist/index.js missing"
}

# Check frontend - QUAN TRỌNG
if (-not (Test-Path "$DEPLOY_FRONTEND\.next")) {
    $ERRORS += "Frontend .next/ missing"
}

if (-not (Test-Path "$DEPLOY_FRONTEND\app")) {
    $ERRORS += "Frontend app/ missing (REQUIRED!)"
}

if (-not (Test-Path "$DEPLOY_FRONTEND\app\layout.tsx")) {
    $ERRORS += "Frontend app/layout.tsx missing"
}

if (-not (Test-Path "$DEPLOY_FRONTEND\package.json")) {
    $ERRORS += "Frontend package.json missing"
}

if (-not (Test-Path "$DEPLOY_FRONTEND\next.config.mjs")) {
    $ERRORS += "Frontend next.config.mjs missing"
}

if (-not (Test-Path "$DEPLOY_FRONTEND\components")) {
    $ERRORS += "Frontend components/ missing (REQUIRED!)"
}

if (-not (Test-Path "$DEPLOY_FRONTEND\lib")) {
    $ERRORS += "Frontend lib/ missing (REQUIRED!)"
}

if ($ERRORS.Count -gt 0) {
    Write-Host "[ERROR] Verification failed:" -ForegroundColor Red
    foreach ($error in $ERRORS) {
        Write-Host "  - $error" -ForegroundColor Red
    }
    exit 1
}

Write-Host "[OK] All required files present" -ForegroundColor Green
Write-Host ""

# ============================================
# 6. SUMMARY
# ============================================
Write-Host "[6/6] Build summary..." -ForegroundColor Yellow

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  BUILD COMPLETED SUCCESSFULLY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Backend files:" -ForegroundColor Cyan
Write-Host "  [OK] dist/ folder"
Write-Host "  [OK] package.json"
Write-Host "  [OK] migrations/ (if any)"
Write-Host ""
Write-Host "Uploads (Images):" -ForegroundColor Cyan
Write-Host "  [OK] uploads/ folder (REQUIRED for images!)"
Write-Host "  [INFO] Upload this to /var/www/banyco.vn/ecommerce-uploads/ on VPS"
Write-Host ""

Write-Host "Frontend files:" -ForegroundColor Cyan
Write-Host "  [OK] .next/ folder (build output)"
Write-Host "  [OK] app/ folder (REQUIRED for Next.js!)"
Write-Host "  [OK] components/ folder (REQUIRED!)"
Write-Host "  [OK] lib/ folder (REQUIRED!)"
Write-Host "  [OK] config/ folder"
Write-Host "  [OK] public/ folder"
Write-Host "  [OK] middleware.ts"
Write-Host "  [OK] tsconfig.json"
Write-Host "  [OK] tailwind.config.ts"
Write-Host "  [OK] postcss.config.js"
Write-Host "  [OK] package.json"
Write-Host "  [OK] next.config.mjs"
Write-Host ""

Write-Host "Deployment package ready in: $PSScriptRoot" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next step: Upload to VPS using WinSCP" -ForegroundColor Yellow
Write-Host ""

Set-Location $ROOT_DIR

