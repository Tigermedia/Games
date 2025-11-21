# Pilatis Form Redirect Testing

## Quick Start (Playwright Automated Tests)

### 1. Set your WordPress credentials

**PowerShell:**
```powershell
$env:WP_ADMIN_USER="your_username"
$env:WP_ADMIN_PASS="your_password"
```

**CMD:**
```cmd
set WP_ADMIN_USER=your_username
set WP_ADMIN_PASS=your_password
```

### 2. Run the tests

**Using PowerShell (Recommended):**
```powershell
.\run-tests.ps1                 # Run headless
.\run-tests.ps1 -Mode headed    # See browser
.\run-tests.ps1 -Mode debug     # Debug mode
.\run-tests.ps1 -Mode report    # View HTML report
```

**Using Batch File:**
```cmd
run-tests.bat           # Run headless
run-tests.bat headed    # See browser
run-tests.bat debug     # Debug mode
run-tests.bat report    # View HTML report
```

**Direct npx command:**
```bash
npx playwright test test-pilatis-redirects.spec.js --headed
```

## What Gets Tested

✅ **Stern Sports Account (e5bzq5)**
- Condition 00: אחר → juakea/juaky6
- Condition 01: מאוחדת + קצרה → jdnhkh/c
- Condition 02: מאוחדת + ארוכה → jdni0u/c
- Condition 03: NOT מאוחדת + ארוכה → jdnexa/c
- Condition 04: NOT מאוחדת + קצרה → jdhga1/c
- Negative test: Wrong payment method

## Files

| File | Purpose |
|------|---------|
| `test-pilatis-redirects.spec.js` | Main Playwright test suite |
| `playwright.config.js` | Playwright configuration |
| `run-tests.ps1` | PowerShell test runner |
| `run-tests.bat` | Batch file test runner |
| `PLAYWRIGHT-SETUP.md` | Detailed setup instructions |
| `TESTING-PILATIS-STERN-SPORTS.md` | Manual testing guide |
| `test-pilatis-stern-sports.js` | Test data definitions |

## Expected Results

All tests should pass with green checkmarks ✅

If any test fails, check:
1. WordPress admin credentials are correct
2. Plugin is activated
3. stern_sports account is selected in Sumit Accounts page
4. Debug logging is enabled to see detailed error messages

## Next Steps

1. ✅ Run tests for **stern_sports** account (current)
2. ✅ Verify all tests pass
3. 🔄 Switch to **stern_fitness** account in WordPress admin
4. ✅ Run tests again to verify new account
5. ✅ Verify base ID changes to `4kpof9`

## Switching Accounts

To test stern_fitness account:

1. Navigate to: **WordPress Admin → Form Redirect → Sumit Accounts**
2. Select: **שטרן - כושר לנשים ונערות**
3. Click: **Save Sumit Account**
4. Run tests again (same commands as above)

## Troubleshooting

### "Cannot find module @playwright/test"
```bash
npm install --save-dev @playwright/test
```

### Tests timeout
Increase timeout in `playwright.config.js` line 11

### Login fails
Check credentials or update them in the test file directly (lines 12-13)

## Documentation

For detailed documentation, see:
- [PLAYWRIGHT-SETUP.md](PLAYWRIGHT-SETUP.md) - Complete setup guide
- [TESTING-PILATIS-STERN-SPORTS.md](TESTING-PILATIS-STERN-SPORTS.md) - Manual testing checklist
- [PILATIS-FORM-CONFIG.md](elementor-form-dynamic-redirect/PILATIS-FORM-CONFIG.md) - Plugin configuration

---

**Current Status**: 🧪 Ready to test stern_sports account
**Next**: Run tests and report results
