# Security Check Script for Windows
# Checks for critical security issues in the project

Write-Host "🔒 Security Check Script" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

$issues = @()
$warnings = @()

# 1. Check Next.js version
Write-Host "1. Checking Next.js version..." -ForegroundColor Yellow
$packageJson = Get-Content "frontend\package.json" | ConvertFrom-Json
$nextVersion = $packageJson.dependencies.next

if ($nextVersion -match "^16\.0\.[0-6]$" -or $nextVersion -eq "16.0.0") {
    $issues += "❌ CRITICAL: Next.js $nextVersion is VULNERABLE to CVE-2025-55182. Update to 16.0.7+"
    Write-Host "   ❌ VULNERABLE: $nextVersion" -ForegroundColor Red
} elseif ($nextVersion -match "^16\.0\.([7-9]|[1-9][0-9])") {
    Write-Host "   ✅ SAFE: $nextVersion" -ForegroundColor Green
} else {
    $warnings += "⚠️  Next.js version $nextVersion - verify if it's patched"
    Write-Host "   ⚠️  Version: $nextVersion (verify)" -ForegroundColor Yellow
}

# 2. Check React version
Write-Host "2. Checking React version..." -ForegroundColor Yellow
$reactVersion = $packageJson.dependencies.react
$reactDomVersion = $packageJson.dependencies."react-dom"

if ($reactVersion -match "^19\.2\.[0-1]$" -or $reactVersion -eq "19.2.0") {
    $warnings += "⚠️  React $reactVersion - consider updating to 19.2.1+"
    Write-Host "   ⚠️  React: $reactVersion (consider update)" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ React: $reactVersion" -ForegroundColor Green
}

# 3. Check security headers in next.config.ts
Write-Host "3. Checking security headers..." -ForegroundColor Yellow
$nextConfig = Get-Content "frontend\next.config.ts" -Raw
if ($nextConfig -notmatch "async headers|headers\(\)") {
    $warnings += "⚠️  Missing security headers in next.config.ts"
    Write-Host "   ⚠️  Security headers not found" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Security headers configured" -ForegroundColor Green
}

# 4. Check rate limiting in middleware
Write-Host "4. Checking rate limiting..." -ForegroundColor Yellow
$middleware = Get-Content "frontend\middleware.ts" -Raw
if ($middleware -notmatch "rateLimit|rate.limit|429") {
    $warnings += "⚠️  Missing rate limiting in middleware.ts"
    Write-Host "   ⚠️  Rate limiting not found" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Rate limiting configured" -ForegroundColor Green
}

# 5. Check database config
Write-Host "5. Checking database configuration..." -ForegroundColor Yellow
$dbConfig = Get-Content "backend\src\config\database.ts" -Raw
if ($dbConfig -match "host.*localhost") {
    Write-Host "   ✅ Database configured for localhost" -ForegroundColor Green
} else {
    $warnings += "⚠️  Database host may not be localhost - verify configuration"
    Write-Host "   ⚠️  Verify database host configuration" -ForegroundColor Yellow
}

# 6. Check for .env files in git (basic check)
Write-Host "6. Checking .gitignore for .env files..." -ForegroundColor Yellow
if (Test-Path ".gitignore") {
    $gitignore = Get-Content ".gitignore" -Raw
    if ($gitignore -match "\.env") {
        Write-Host "   ✅ .env files in .gitignore" -ForegroundColor Green
    } else {
        $warnings += "⚠️  .env files may not be in .gitignore"
        Write-Host "   ⚠️  Verify .env files are in .gitignore" -ForegroundColor Yellow
    }
} else {
    $warnings += "⚠️  .gitignore file not found"
    Write-Host "   ⚠️  .gitignore not found" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "========================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

if ($issues.Count -gt 0) {
    Write-Host "🔴 CRITICAL ISSUES FOUND:" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host "   $issue" -ForegroundColor Red
    }
    Write-Host ""
}

if ($warnings.Count -gt 0) {
    Write-Host "🟡 WARNINGS:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   $warning" -ForegroundColor Yellow
    }
    Write-Host ""
}

if ($issues.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "✅ No critical issues found!" -ForegroundColor Green
} elseif ($issues.Count -eq 0) {
    Write-Host "✅ No critical issues, but review warnings above" -ForegroundColor Green
} else {
    Write-Host "❌ CRITICAL ISSUES DETECTED - ACTION REQUIRED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "See SECURITY_AUDIT_REPORT.md for detailed fixes" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "For detailed report, see: docs check security\SECURITY_AUDIT_REPORT.md" -ForegroundColor Cyan

