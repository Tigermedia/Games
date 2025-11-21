# Course 3 Conditional Redirect Testing - Complete Guide

## ✅ What We Accomplished

### 1. **Permission Bypass - SUCCESS!** 🎉
- Configured Playwright to grant ALL browser permissions automatically
- **NO permission prompts** appear during test execution
- Permissions granted: geolocation, notifications, camera, microphone, clipboard

### 2. **Form Field Discovery - SUCCESS!** 🔍
Used Playwright MCP (browser subagent) to inspect the actual form and discovered:

#### Text/Email/Tel Fields:
- `form_fields[first_name]` - required
- `form_fields[last_name]` - required  
- `form_fields[id_number]` - required
- `form_fields[email]` - required
- `form_fields[parents_phone]` - required
- `form_fields[birthdate]` - optional
- `form_fields[job]` - optional

#### Radio Button Groups:
- **`form_fields[kupa]`** (Health Fund):
  - כללית
  - מכבי
  - **מאוחדת** ← Different pricing!
  - לאומית

- **`form_fields[team]`** (Course Type):
  - סדרה קצרה - 18 שיעורים - ₪1,170
  - סדרה ארוכה - 36 שיעורים - ₪1,980
  - אחר - לשימוש פנימי בלבד

- **`form_fields[day]`** (Day/Time):
  - יום ראשון 20:00 - ביה"ס רמות פולין באולם רמות ד
  - יום שלישי 19:30 - ביה"ס "נועם" באולם רח מעוז 1 רמות א
  - יום שלישי 20:20 - ביה"ס "נועם" באולם רח מעוז 1 רמות א

- **`form_fields[payment_method]`**:
  - **אשראי** ← Required for redirect
  - העברה בנקאית
  - מזומן

#### Checkbox:
- `form_fields[approval]` - required

---

## 🎯 Conditional Redirect Logic

Based on your CSV files and form structure, the redirect logic is:

### Condition 1: מאוחדת (Meuhedet) Health Fund
**Redirect to:** `https://pay.sumit.co.il/e5bzq5/ic7jaq/c/payment/?additems=1&...`
- Path: `ic7jaq/c`
- Special pricing for Meuhedet members
- Applies to BOTH short and long series

### Condition 2: Other Health Funds (כללית, מכבי, לאומית)
**Redirect to:** `https://pay.sumit.co.il/e5bzq5/ic788r/c/payment/?additems=1&...`
- Path: `ic788r/c`
- Full price
- Applies to BOTH short and long series

### Additional Parameters:
- `additems=1` - Always included
- `name=[first_name] [last_name]` - User's full name
- `emailaddress=[email]` - User's email
- `phone=[parents_phone]` - User's phone
- `companynumber=[id_number]` - User's ID number
- `couponcode=lessonXf` or `lessonXm` - Based on lesson number (from CSV)

---

## 📝 Test Cases Created

### Test 1: Form Structure Validation ✅
- Verifies form loads correctly
- Checks all required fields are present
- **Status:** PASSED

### Test 2: Short Series + Meuhedet
- **Input:** סדרה קצרה + מאוחדת
- **Expected:** Redirect to `ic7jaq/c` (Meuhedet pricing)
- **Status:** Needs verification

### Test 3: Short Series + Other Kupa
- **Input:** סדרה קצרה + כללית
- **Expected:** Redirect to `ic788r/c` (Full price)
- **Status:** Needs verification

### Test 4: Long Series + Meuhedet
- **Input:** סדרה ארוכה + מאוחדת
- **Expected:** Redirect to `ic7jaq/c` (Meuhedet pricing)
- **Status:** Needs verification

### Test 5: Long Series + Other Kupa
- **Input:** סדרה ארוכה + מכבי
- **Expected:** Redirect to `ic788r/c` (Full price)
- **Status:** Needs verification

---

## 🚀 How to Run Tests

### Run all tests with visible browser:
```bash
npx playwright test test-course3-conditional-redirects.spec.js --headed
```

### Run all tests headless:
```bash
npx playwright test test-course3-conditional-redirects.spec.js
```

### Run a specific test:
```bash
npx playwright test test-course3-conditional-redirects.spec.js -g "מאוחדת"
```

### View test report:
```bash
npx playwright show-report
```

### Debug mode (step through tests):
```bash
npx playwright test test-course3-conditional-redirects.spec.js --debug
```

---

## 🔧 Files Created

1. **`test-course3-conditional-redirects.spec.js`** - Main test file with conditional logic
2. **`playwright.config.js`** - Updated with permission grants
3. **`COURSE3-TESTING-GUIDE.md`** - General testing guide
4. **`TEST-RESULTS-COURSE3.md`** - Test results documentation
5. **`test-course3.bat`** - Easy Windows batch script for running tests

---

## ✅ Permission Bypass Configuration

### In `playwright.config.js`:
```javascript
use: {
  permissions: [
    'geolocation',
    'notifications',
    'camera',
    'microphone',
    'clipboard-read',
    'clipboard-write'
  ],
  acceptDownloads: true,
  locale: 'he-IL',
  timezoneId: 'Asia/Jerusalem',
}
```

### In test file:
```javascript
test.beforeEach(async ({ page, context }) => {
  await context.grantPermissions([
    'geolocation',
    'notifications',
    'camera',
    'microphone',
    'clipboard-read',
    'clipboard-write'
  ]);
});
```

### Browser launch args:
```javascript
launchOptions: {
  args: [
    '--disable-blink-features=AutomationControlled',
    '--disable-notifications',
  ]
}
```

---

## 📊 Next Steps

1. **Review test results** - Check which tests passed/failed
2. **Verify redirect URLs** - Ensure they match your expected Sumit URLs
3. **Add more test cases** - Test edge cases like:
   - Wrong payment method (should NOT redirect)
   - Missing required fields (should show validation)
   - Different day selections
4. **Integrate with CI/CD** - Run tests automatically on deployment

---

## 🎉 Key Achievement

**You can now test your form's conditional redirects WITHOUT any browser permission prompts!**

The tests will:
- ✅ Fill out the form automatically
- ✅ Select different combinations of kupa and team
- ✅ Submit the form
- ✅ Verify the correct Sumit URL is generated
- ✅ Check that all user data is included in the URL
- ✅ **Never show permission popups!**

---

## 📞 Support

If tests fail, check:
1. Form field names haven't changed
2. Redirect URLs match expected patterns
3. Payment method is set to "אשראי" (required for redirect)
4. All required fields are filled

Screenshots and videos are automatically saved to `test-results/` on failure.
