# Playwright Test Runner for Pilatis Form Redirects
#
# Usage:
#   .\run-tests.ps1              - Run all tests (headless)
#   .\run-tests.ps1 -Mode headed - Run with visible browser
#   .\run-tests.ps1 -Mode debug  - Run in debug mode
#   .\run-tests.ps1 -Mode report - Show HTML report

param(
    [ValidateSet('headless', 'headed', 'debug', 'report')]
    [string]$Mode = 'headless'
)

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "PILATIS FORM REDIRECT TESTS - STERN SPORTS ACCOUNT" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""

# Check if credentials are set
$adminUser = $env:WP_ADMIN_USER
$adminPass = $env:WP_ADMIN_PASS

if (-not $adminUser) {
    Write-Host "WARNING: WP_ADMIN_USER environment variable not set!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set your WordPress admin credentials:" -ForegroundColor Yellow
    Write-Host '  $env:WP_ADMIN_USER="your_username"' -ForegroundColor Yellow
    Write-Host '  $env:WP_ADMIN_PASS="your_password"' -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or edit the credentials in test-pilatis-redirects.spec.js" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not $adminPass) {
    Write-Host "WARNING: WP_ADMIN_PASS environment variable not set!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set your WordPress admin credentials:" -ForegroundColor Yellow
    Write-Host '  $env:WP_ADMIN_USER="your_username"' -ForegroundColor Yellow
    Write-Host '  $env:WP_ADMIN_PASS="your_password"' -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or edit the credentials in test-pilatis-redirects.spec.js" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Admin User: $adminUser" -ForegroundColor Green
Write-Host "Password: ********" -ForegroundColor Green
Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""

# Run tests based on mode
switch ($Mode) {
    'headed' {
        Write-Host "Running tests with visible browser..." -ForegroundColor Yellow
        Write-Host ""
        npx playwright test test-pilatis-redirects.spec.js --headed
    }
    'debug' {
        Write-Host "Running tests in debug mode..." -ForegroundColor Yellow
        Write-Host ""
        npx playwright test test-pilatis-redirects.spec.js --debug
    }
    'report' {
        Write-Host "Opening HTML report..." -ForegroundColor Yellow
        Write-Host ""
        npx playwright show-report
    }
    default {
        Write-Host "Running tests in headless mode..." -ForegroundColor Yellow
        Write-Host ""
        npx playwright test test-pilatis-redirects.spec.js
    }
}

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "TESTS COMPLETED" -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view detailed HTML report, run: " -NoNewline
Write-Host ".\run-tests.ps1 -Mode report" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
