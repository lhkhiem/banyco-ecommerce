# Script to setup .env.local for local development
# This script creates .env.local with localhost configuration

$envFile = ".env.local"
$envContent = @"
# API Configuration for Local Development
NEXT_PUBLIC_API_URL=http://localhost:3012/api

# Alternative: You can also use NEXT_PUBLIC_API_DOMAIN
# NEXT_PUBLIC_API_DOMAIN=localhost:3012

# Frontend Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
"@

if (Test-Path $envFile) {
    Write-Host "WARNING: File $envFile already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Cancelled. File not modified." -ForegroundColor Red
        exit
    }
}

try {
    $envContent | Out-File -FilePath $envFile -Encoding utf8 -NoNewline
    Write-Host "SUCCESS: Created $envFile successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Restart your Next.js dev server (Ctrl+C then 'npm run dev')" -ForegroundColor White
    Write-Host "   2. Check Network tab in DevTools to verify API calls go to localhost:3012" -ForegroundColor White
} catch {
    Write-Host "ERROR: Error creating $envFile : $_" -ForegroundColor Red
    exit 1
}

