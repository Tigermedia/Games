@echo off
REM Playwright Test Runner for Pilatis Form Redirects
REM
REM Usage:
REM   run-tests.bat              - Run all tests (headless)
REM   run-tests.bat headed       - Run with visible browser
REM   run-tests.bat debug        - Run in debug mode
REM   run-tests.bat report       - Show HTML report

echo.
echo ================================================================================
echo PILATIS FORM REDIRECT TESTS - STERN SPORTS ACCOUNT
echo ================================================================================
echo.

REM Check if credentials are set
if "%WP_ADMIN_USER%"=="" (
    echo WARNING: WP_ADMIN_USER environment variable not set!
    echo.
    echo Please set your WordPress admin credentials:
    echo   set WP_ADMIN_USER=your_username
    echo   set WP_ADMIN_PASS=your_password
    echo.
    echo Or edit the credentials in test-pilatis-redirects.spec.js
    echo.
    pause
    exit /b 1
)

if "%WP_ADMIN_PASS%"=="" (
    echo WARNING: WP_ADMIN_PASS environment variable not set!
    echo.
    echo Please set your WordPress admin credentials:
    echo   set WP_ADMIN_USER=your_username
    echo   set WP_ADMIN_PASS=your_password
    echo.
    echo Or edit the credentials in test-pilatis-redirects.spec.js
    echo.
    pause
    exit /b 1
)

echo Admin User: %WP_ADMIN_USER%
echo Password: ********
echo.
echo ================================================================================
echo.

REM Check command line argument
if "%1"=="headed" (
    echo Running tests with visible browser...
    echo.
    npx playwright test test-pilatis-redirects.spec.js --headed
) else if "%1"=="debug" (
    echo Running tests in debug mode...
    echo.
    npx playwright test test-pilatis-redirects.spec.js --debug
) else if "%1"=="report" (
    echo Opening HTML report...
    echo.
    npx playwright show-report
) else (
    echo Running tests in headless mode...
    echo.
    npx playwright test test-pilatis-redirects.spec.js
)

echo.
echo ================================================================================
echo TESTS COMPLETED
echo ================================================================================
echo.
echo To view detailed HTML report, run: run-tests.bat report
echo.
pause
