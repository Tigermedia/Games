@echo off
REM Quick test runner for Course 3 form redirects
REM No permission prompts will appear!

echo ========================================
echo Course 3 Form Redirect Testing
echo ========================================
echo.

:menu
echo Choose an option:
echo 1. Run tests (visible browser)
echo 2. Run tests (headless)
echo 3. Run specific test
echo 4. View test report
echo 5. Debug mode
echo 6. Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto headed
if "%choice%"=="2" goto headless
if "%choice%"=="3" goto specific
if "%choice%"=="4" goto report
if "%choice%"=="5" goto debug
if "%choice%"=="6" goto end

echo Invalid choice. Please try again.
echo.
goto menu

:headed
echo.
echo Running tests with visible browser...
npx playwright test test-course3-conditional-redirects.spec.js --headed
goto end

:headless
echo.
echo Running tests in headless mode...
npx playwright test test-course3-conditional-redirects.spec.js
goto end

:specific
echo.
echo Running Conditional Redirect Tests...
npx playwright test test-course3-conditional-redirects.spec.js --headed
goto end

:report
echo.
echo Opening test report...
npx playwright show-report
goto end

:debug
echo.
echo Running in debug mode (with Playwright Inspector)...
npx playwright test test-course3-conditional-redirects.spec.js --debug
goto end

:end
echo.
echo Done!
pause
