# Playwright Test Setup for Pilatis Form Redirects

## Prerequisites

✅ Playwright is already installed in this directory
✅ Test files created:
- `test-pilatis-redirects.spec.js` - Main test suite
- `playwright.config.js` - Playwright configuration

## Setup Steps

### 1. Install @playwright/test (if not already installed)

```bash
npm install --save-dev @playwright/test
```

### 2. Set WordPress Admin Credentials

You have two options:

**Option A: Environment Variables (Recommended)**
```bash
# Windows PowerShell
$env:WP_ADMIN_USER="your_admin_username"
$env:WP_ADMIN_PASS="your_admin_password"

# Windows CMD
set WP_ADMIN_USER=your_admin_username
set WP_ADMIN_PASS=your_admin_password

# Linux/Mac
export WP_ADMIN_USER="your_admin_username"
export WP_ADMIN_PASS="your_admin_password"
```

**Option B: Edit the test file directly**
Edit `test-pilatis-redirects.spec.js` lines 12-13:
```javascript
const ADMIN_USERNAME = 'your_actual_username';
const ADMIN_PASSWORD = 'your_actual_password';
```

### 3. Verify WordPress URLs

Make sure these URLs are correct in `test-pilatis-redirects.spec.js`:
- `ADMIN_URL` (line 11): https://1.michal-stern.com/wp-admin
- `FORM_URL` (line 17): https://1.michal-stern.com/join/course3/

## Running Tests

### Run all tests (headless)
```bash
npx playwright test test-pilatis-redirects.spec.js
```

### Run with visible browser (see what's happening)
```bash
npx playwright test test-pilatis-redirects.spec.js --headed
```

### Run in debug mode (step through tests)
```bash
npx playwright test test-pilatis-redirects.spec.js --debug
```

### Run specific test
```bash
npx playwright test test-pilatis-redirects.spec.js -g "Condition 01"
```

### View HTML report after tests
```bash
npx playwright show-report
```

## What the Tests Do

The test suite will automatically:

1. ✅ **Login to WordPress admin**
2. ✅ **Verify stern_sports account is selected**
3. ✅ **Test all 5 redirect conditions**:
   - Condition 00: אחר (Other)
   - Condition 01: מאוחדת + סדרה קצרה
   - Condition 02: מאוחדת + סדרה ארוכה
   - Condition 03: NOT מאוחדת + סדרה ארוכה
   - Condition 04: NOT מאוחדת + סדרה קצרה
4. ✅ **Test negative case** (wrong payment method)
5. ✅ **Verify generated URLs** match expected patterns

## Expected Results

For **stern_sports** account, all URLs should contain:
- Base ID: `e5bzq5`
- Correct path for each condition
- Proper `additems=1` parameter (except condition 00)
- User data in URL parameters

### Condition 00 (אחר)
```
Expected: https://pay.sumit.co.il/e5bzq5/juakea/juaky6/payment/?name=...
```

### Condition 01 (מאוחדת + קצרה)
```
Expected: https://pay.sumit.co.il/e5bzq5/jdnhkh/c/payment/?additems=1&name=...
```

### Condition 02 (מאוחדת + ארוכה)
```
Expected: https://pay.sumit.co.il/e5bzq5/jdni0u/c/payment/?additems=1&name=...
```

### Condition 03 (NOT מאוחדת + ארוכה)
```
Expected: https://pay.sumit.co.il/e5bzq5/jdnexa/c/payment/?additems=1&name=...
```

### Condition 04 (NOT מאוחדת + קצרה)
```
Expected: https://pay.sumit.co.il/e5bzq5/jdhga1/c/payment/?additems=1&name=...
```

## Test Output

You'll see detailed console output for each test:
```
🧪 Testing: Condition 01: מאוחדת + סדרה קצרה
  Input: team="סדרה קצרה - Sunday morning", kupa="מאוחדת"
  Expected path: jdnhkh/c
  Generated URL: https://pay.sumit.co.il/e5bzq5/jdnhkh/c/payment/...
  ✅ Contains base: e5bzq5
  ✅ Contains path: jdnhkh/c
  ✅ Contains: additems=1
  ✅ User data included in URL
  ✅ URL matches expected pattern
  ✅ PASSED: Condition 01: מאוחדת + סדרה קצרה
```

## Troubleshooting

### Test fails with "Page not found"
- Check that WordPress URLs are correct
- Verify the Testing Tool page exists at the correct URL

### Login fails
- Verify WordPress admin credentials
- Check if site requires special authentication

### Tests timeout
- Increase timeout in `playwright.config.js` (line 11)
- Check network connection

### Selector not found
- WordPress admin structure may have changed
- Update selectors in test file

## After Stern Sports Tests Pass

1. Switch to **stern_fitness** account in WordPress admin:
   - Navigate to: Form Redirect → Sumit Accounts
   - Select: שטרן - כושר לנשים ונערות
   - Click: Save Sumit Account

2. Run tests again to verify stern_fitness account
   - Expected base changes to: `4kpof9`
   - All other test logic remains the same

## Files Created

- ✅ `test-pilatis-redirects.spec.js` - Playwright test suite
- ✅ `playwright.config.js` - Configuration
- ✅ `PLAYWRIGHT-SETUP.md` - This setup guide (you're reading it)
- ✅ `test-pilatis-stern-sports.js` - Test data definitions
- ✅ `TESTING-PILATIS-STERN-SPORTS.md` - Manual testing guide

## Quick Start

```bash
# 1. Set credentials (choose one method from above)
$env:WP_ADMIN_USER="admin"
$env:WP_ADMIN_PASS="password"

# 2. Run tests
npx playwright test test-pilatis-redirects.spec.js --headed

# 3. View report
npx playwright show-report
```

---

**Note**: The test suite uses the WordPress Testing Tool (admin page) to verify redirects, which is more reliable than testing the actual form submission since it doesn't require bypassing Elementor's JavaScript validation.
