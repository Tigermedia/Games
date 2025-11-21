/**
 * Playwright Test for Course 2 (Hazaka) Form Conditional Redirects
 * Tests that the form redirects to the correct Sumit URL based on:
 * - Team selection (Evening/ערב vs Morning/בוקר)
 * - Kupa (Meuhedet vs Other)
 *
 * Note: This form uses HARDCODED Stern Sports account (e5bzq5) regardless of plugin settings.
 *
 * Run with: npx playwright test test-course2-conditional-redirects.spec.js --headed
 */

const { test, expect } = require('@playwright/test');

// Form URL
const FORM_URL = 'https://1.michal-stern.com/join/course2/';

// Expected base for all redirects (Hardcoded in plugin for Hazaka)
const EXPECTED_BASE = 'e5bzq5';

// Test cases
const testCases = [
    {
        id: 'evening-meuhedet',
        name: 'ערב + מאוחדת (Evening + Meuhedet)',
        formData: {
            first_name: 'Sarah',
            last_name: 'Cohen',
            id_number: '987654321',
            email: 'sarah@example.com',
            parents_phone: '0507654321',
            kupa: 'מאוחדת',
            team: 'ערב', // Partial match string
            payment_method: 'אשראי'
        },
        expected: {
            base: EXPECTED_BASE,
            path: 'jswwda/jswwdc',
            description: 'Evening with Meuhedet should use partial price path'
        }
    },
    {
        id: 'evening-other',
        name: 'ערב + כללית (Evening + Other Kupa)',
        formData: {
            first_name: 'David',
            last_name: 'Israeli',
            id_number: '444555666',
            email: 'david@example.com',
            parents_phone: '0531234567',
            kupa: 'כללית',
            team: 'ערב',
            payment_method: 'אשראי'
        },
        expected: {
            base: EXPECTED_BASE,
            path: 'jd8qad/jd8qae',
            description: 'Evening with other kupa should use full price path'
        }
    },
    {
        id: 'morning-meuhedet',
        name: 'בוקר + מאוחדת (Morning + Meuhedet)',
        formData: {
            first_name: 'Rachel',
            last_name: 'Levi',
            id_number: '111222333',
            email: 'rachel@example.com',
            parents_phone: '0521234567',
            kupa: 'מאוחדת',
            team: 'בוקר',
            payment_method: 'אשראי'
        },
        expected: {
            base: EXPECTED_BASE,
            path: 'jszy01/jszzqt',
            description: 'Morning with Meuhedet should use partial price path'
        }
    },
    {
        id: 'morning-other',
        name: 'בוקר + מכבי (Morning + Other Kupa)',
        formData: {
            first_name: 'Miriam',
            last_name: 'Goldberg',
            id_number: '777888999',
            email: 'miriam@example.com',
            parents_phone: '0541234567',
            kupa: 'מכבי',
            team: 'בוקר',
            payment_method: 'אשראי'
        },
        expected: {
            base: EXPECTED_BASE,
            path: 'jszwxe/jszyda',
            description: 'Morning with other kupa should use full price path'
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

test.describe('Course 2 (Hazaka) Conditional Redirect Tests', () => {

    test.beforeAll(async () => {
        console.log('\n' + '='.repeat(80));
        console.log('COURSE 2 CONDITIONAL REDIRECT TESTS');
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

                // Select Kupa
                await page.check(`input[name="form_fields[kupa]"][value="${testCase.formData.kupa}"]`);

                // Select Team (Partial match logic)
                const teamRadios = await page.locator('input[name="form_fields[team]"]').all();
                let found = false;
                for (const radio of teamRadios) {
                    const value = await radio.getAttribute('value');
                    if (value && value.includes(testCase.formData.team)) {
                        await radio.check();
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    // Fallback: try to click the label containing the text
                    await page.locator('label').filter({ hasText: testCase.formData.team }).first().click();
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

                expect(redirectUrl).toContain('sumit.co.il');
                expect(redirectUrl).toContain(testCase.expected.base);
                expect(redirectUrl).toContain(testCase.expected.path);

                // Check user data
                expect(redirectUrl).toContain(`emailaddress=${encodeURIComponent(testCase.formData.email)}`);

                console.log(`  ✅ PASSED: ${testCase.name}\n`);

            } catch (error) {
                console.error(`  ❌ FAILED: ${error.message}`);
                await page.screenshot({ path: `test-results/failure-course2-${testCase.id}.png`, fullPage: true });
                throw error;
            }
        });
    }
});
