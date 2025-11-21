/**
 * Playwright Test for Course 1 (Girls) Form - CSV Logic
 * Tests that the form redirects based on Day selection (Sunday/Tuesday) -> CSV Lookup.
 *
 * Note: This form uses HARDCODED Stern Sports account (e5bzq5).
 * The actual redirect URL depends on the CSV file content for the current date.
 *
 * Run with: npx playwright test test-course1-conditional-redirects.spec.js --headed
 */

const { test, expect } = require('@playwright/test');

// Form URL
const FORM_URL = 'https://1.michal-stern.com/join/course1/';

// Expected base for all redirects (Hardcoded in plugin for Girls01)
const EXPECTED_BASE = 'e5bzq5';

// Test cases
const testCases = [
    {
        id: 'sunday-class',
        name: 'יום ראשון (Sunday Class)',
        formData: {
            first_name: 'Sarah',
            last_name: 'Sunday',
            id_number: '987654321',
            email: 'sarah.sunday@example.com',
            parents_phone: '0507654321',
            birthdate: '02-11-2012',
            kupa: 'מאוחדת',
            team: 'יום ראשון', // Partial match string
            payment_method: 'אשראי'
        },
        expected: {
            base: EXPECTED_BASE,
            description: 'Sunday class should trigger Sunday CSV logic'
        }
    },
    {
        id: 'tuesday-class',
        name: 'יום שלישי (Tuesday Class)',
        formData: {
            first_name: 'David',
            last_name: 'Tuesday',
            id_number: '444555666',
            email: 'david.tuesday@example.com',
            parents_phone: '0531234567',
            birthdate: '02-11-2012',
            kupa: 'כללית',
            team: 'יום שלישי', // Partial match string
            payment_method: 'אשראי'
        },
        expected: {
            base: EXPECTED_BASE,
            description: 'Tuesday class should trigger Tuesday CSV logic'
        }
    }
];

// Grant all permissions to bypass prompts
test.use({
    permissions: ['geolocation', 'notifications', 'camera', 'microphone', 'clipboard-read', 'clipboard-write'],
    acceptDownloads: true,
    locale: 'he-IL',
    timezoneId: 'Asia/Jerusalem'
});

test.describe('Course 1 (Girls) CSV Redirect Tests', () => {

    test.beforeAll(async () => {
        console.log('\n' + '='.repeat(80));
        console.log('COURSE 1 CSV REDIRECT TESTS');
        console.log('='.repeat(80));
        console.log(`Form URL: ${FORM_URL}`);
        console.log(`Expected Base: ${EXPECTED_BASE}`);
        console.log('='.repeat(80) + '\n');
    });

    test.beforeEach(async ({ page, context }) => {
        await context.grantPermissions(['geolocation', 'notifications', 'camera', 'microphone', 'clipboard-read', 'clipboard-write']);
    });

    test('Form loads correctly', async ({ page }) => {
        await page.goto(FORM_URL);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('form').first()).toBeVisible();
    });

    for (const testCase of testCases) {
        test(`${testCase.name}`, async ({ page }) => {
            console.log(`\n🧪 Testing: ${testCase.name}`);

            await page.goto(FORM_URL);
            await page.waitForLoadState('networkidle');

            try {
                // Fill basic fields
                await page.fill('input[name="form_fields[first_name]"]', testCase.formData.first_name);
                await page.fill('input[name="form_fields[last_name]"]', testCase.formData.last_name);
                await page.fill('input[name="form_fields[id_number]"]', testCase.formData.id_number);
                await page.fill('input[name="form_fields[email]"]', testCase.formData.email);
                await page.fill('input[name="form_fields[parents_phone]"]', testCase.formData.parents_phone);

                // Fill birthdate using JavaScript (date picker field)
                await page.locator('input[name="form_fields[birthdate]"]').evaluate((el, value) => {
                    el.value = value;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                }, testCase.formData.birthdate);

                // Select Kupa
                await page.check(`input[name="form_fields[kupa]"][value="${testCase.formData.kupa}"]`);

                // Select Place/Institution (מקום לימודים) - required field
                // Try multiple possible field names
                let placeSelected = false;
                const possibleFieldNames = ['place', 'location', 'school', 'institution', 'venue'];

                for (const fieldName of possibleFieldNames) {
                    const fieldSelector = `input[name="form_fields[${fieldName}]"]`;
                    const radios = await page.locator(fieldSelector).all();
                    if (radios.length > 0) {
                        await radios[0].check();
                        console.log(`  ✓ Selected ${fieldName} option`);
                        placeSelected = true;
                        break;
                    }
                }

                if (!placeSelected) {
                    console.warn('  ⚠️ Could not find place/institution field - trying generic approach');
                    // Try to find any radio group that hasn't been selected yet (excluding kupa, team, payment)
                    const allRadios = await page.locator('input[type="radio"]:not([name*="kupa"]):not([name*="team"]):not([name*="payment"])').all();
                    for (const radio of allRadios) {
                        const isChecked = await radio.isChecked();
                        if (!isChecked) {
                            await radio.check();
                            console.log(`  ✓ Selected radio option (generic)`);
                            placeSelected = true;
                            break;
                        }
                    }
                }

                // Select Team (Partial match logic)
                // We look for a radio button whose value contains the team string (e.g., "יום ראשון")
                const teamRadios = await page.locator('input[name="form_fields[team]"]').all();
                let found = false;
                for (const radio of teamRadios) {
                    const value = await radio.getAttribute('value');
                    if (value && value.includes(testCase.formData.team)) {
                        await radio.check();
                        console.log(`  ✓ Selected team option: ${value}`);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    // Fallback: try to click the label containing the text
                    const label = page.locator('label').filter({ hasText: testCase.formData.team }).first();
                    if (await label.isVisible()) {
                        await label.click();
                        console.log(`  ✓ Clicked label containing: ${testCase.formData.team}`);
                        found = true;
                    }
                }

                if (!found) {
                    throw new Error(`Could not find team option containing "${testCase.formData.team}"`);
                }

                // Select Payment Method
                await page.check(`input[name="form_fields[payment_method]"][value="${testCase.formData.payment_method}"]`);

                // Check Approval
                await page.check('input[name="form_fields[approval]"]');

                // Submit
                const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();

                const navigationPromise = page.waitForURL(url => url.includes('sumit.co.il'), { timeout: 30000 })
                    .catch(async () => { await page.waitForTimeout(2000); return null; });

                await submitButton.click();
                await navigationPromise;

                const redirectUrl = page.url();
                console.log(`  📍 Redirected to: ${redirectUrl}`);

                // Verify it's a Sumit URL
                expect(redirectUrl).toContain('sumit.co.il');
                expect(redirectUrl).toContain(testCase.expected.base);

                // Check user data
                expect(redirectUrl).toContain(`emailaddress=${encodeURIComponent(testCase.formData.email)}`);

                console.log(`  ✅ PASSED: ${testCase.name}\n`);

            } catch (error) {
                console.error(`  ❌ FAILED: ${error.message}`);
                await page.screenshot({ path: `test-results/failure-course1-${testCase.id}.png`, fullPage: true });
                throw error;
            }
        });
    }
});
