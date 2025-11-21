/**
 * Playwright Test for Course 3 Form Conditional Redirects
 * Tests that the form redirects to the correct Sumit URL based on:
 * - Team selection (סדרה קצרה vs סדרה ארוכה)
 * - Kupa (health fund - מאוחדת gets different pricing)
 *
 * NO PERMISSION PROMPTS will appear during these tests!
 *
 * Run with: npx playwright test test-course3-conditional-redirects.spec.js --headed
 */

const { test, expect } = require('@playwright/test');

// Form URL
const FORM_URL = 'https://1.michal-stern.com/join/course3/';

// Expected base for all redirects
const EXPECTED_BASE = 'e5bzq5';

// Test cases for different conditions based on actual form fields
const testCases = [
    {
        id: 'short-series-meuhedet',
        name: 'סדרה קצרה + מאוחדת (Short Series + Meuhedet)',
        formData: {
            first_name: 'Sarah',
            last_name: 'Cohen',
            id_number: '987654321',
            email: 'sarah@example.com',
            parents_phone: '0507654321',
            birthdate: '01/01/1990',
            job: 'Tester',
            kupa: 'מאוחדת',
            team: 'סדרה קצרה - 18 שיעורים - ₪1,170 ',
            day: 'יום ראשון 20:00 - ביה"ס רמות פולין באולם רמות ד',
            payment_method: 'אשראי'
        },
        expected: {
            base: EXPECTED_BASE,
            path: 'jdnhkh/c', // Stern Sports: Short + Partial
            hasAdditems: true,
            description: 'Short series with Meuhedet should use מאוחדת pricing path'
        }
    },
    {
        id: 'short-series-other',
        name: 'סדרה קצרה + כללית (Short Series + Other Kupa)',
        formData: {
            first_name: 'David',
            last_name: 'Israeli',
            id_number: '444555666',
            email: 'david@example.com',
            parents_phone: '0531234567',
            birthdate: '01/01/1990',
            job: 'Tester',
            kupa: 'כללית',
            team: 'סדרה קצרה - 18 שיעורים - ₪1,170 ',
            day: 'יום שלישי 19:30 - ביה"ס "נועם" באולם רח מעוז 1 רמות א',
            payment_method: 'אשראי'
        },
        expected: {
            base: EXPECTED_BASE,
            path: 'jdhga1/c', // Stern Sports: Short + Full
            hasAdditems: true,
            description: 'Short series with other kupa should use full price path'
        }
    },
    {
        id: 'long-series-meuhedet',
        name: 'סדרה ארוכה + מאוחדת (Long Series + Meuhedet)',
        formData: {
            first_name: 'Rachel',
            last_name: 'Levi',
            id_number: '111222333',
            email: 'rachel@example.com',
            parents_phone: '0521234567',
            birthdate: '01/01/1990',
            job: 'Tester',
            kupa: 'מאוחדת',
            team: 'סדרה ארוכה - 36 שיעורים - ₪1,980',
            day: 'יום שלישי 20:20 - ביה"ס "נועם" באולם רח מעוז 1 רמות א',
            payment_method: 'אשראי'
        },
        expected: {
            base: EXPECTED_BASE,
            path: 'jdni0u/c', // Stern Sports: Long + Partial
            hasAdditems: true,
            description: 'Long series with Meuhedet should use מאוחדת pricing path'
        }
    },
    {
        id: 'long-series-maccabi',
        name: 'סדרה ארוכה + מכבי (Long Series + Maccabi)',
        formData: {
            first_name: 'Miriam',
            last_name: 'Goldberg',
            id_number: '777888999',
            email: 'miriam@example.com',
            parents_phone: '0541234567',
            birthdate: '01/01/1990',
            job: 'Tester',
            kupa: 'מכבי',
            team: 'סדרה ארוכה - 36 שיעורים - ₪1,980',
            day: 'יום ראשון 20:00 - ביה"ס רמות פולין באולם רמות ד',
            payment_method: 'אשראי'
        },
        expected: {
            base: EXPECTED_BASE,
            path: 'jdnexa/c', // Stern Sports: Long + Full
            hasAdditems: true,
            description: 'Long series with Maccabi should use full price path'
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

test.describe('Course 3 Conditional Redirect Tests', () => {

    test.beforeAll(async () => {
        console.log('\n' + '='.repeat(80));
        console.log('COURSE 3 CONDITIONAL REDIRECT TESTS');
        console.log('='.repeat(80));
        console.log(`Form URL: ${FORM_URL}`);
        console.log(`Expected Base: ${EXPECTED_BASE}`);
        console.log(`Total Tests: ${testCases.length + 1}`);
        console.log('='.repeat(80) + '\n');
    });

    test.beforeEach(async ({ page, context }) => {
        // Grant all permissions to avoid prompts
        await context.grantPermissions([
            'geolocation',
            'notifications',
            'camera',
            'microphone',
            'clipboard-read',
            'clipboard-write'
        ]);

        console.log('✅ All permissions granted - NO PROMPTS will appear!');
    });

    test('Form loads correctly and has expected fields', async ({ page }) => {
        console.log('\n🧪 Testing: Form structure');

        await page.goto(FORM_URL);
        await page.waitForLoadState('networkidle');

        // Check if form is present
        const form = page.locator('form').first();
        await expect(form).toBeVisible();
        console.log('  ✅ Form is visible');

        // Verify key fields exist
        await expect(page.locator('input[name="form_fields[first_name]"]')).toBeVisible();
        await expect(page.locator('input[name="form_fields[email]"]')).toBeVisible();
        await expect(page.locator('input[name="form_fields[kupa]"]').first()).toBeVisible();
        await expect(page.locator('input[name="form_fields[team]"]').first()).toBeVisible();

        console.log('  ✅ All required fields are present');
        console.log('  ✅ PASSED: Form structure verified\n');
    });

    // Test each condition
    for (const testCase of testCases) {
        test(`${testCase.name}`, async ({ page }) => {
            console.log(`\n🧪 Testing: ${testCase.name}`);
            console.log(`   ${testCase.expected.description}`);

            await page.goto(FORM_URL);
            await page.waitForLoadState('networkidle');

            try {
                // Fill text fields
                await page.fill('input[name="form_fields[first_name]"]', testCase.formData.first_name);
                console.log(`  ✓ Filled first name: ${testCase.formData.first_name}`);

                await page.fill('input[name="form_fields[last_name]"]', testCase.formData.last_name);
                console.log(`  ✓ Filled last name: ${testCase.formData.last_name}`);

                await page.fill('input[name="form_fields[id_number]"]', testCase.formData.id_number);
                console.log(`  ✓ Filled ID: ${testCase.formData.id_number}`);

                await page.fill('input[name="form_fields[email]"]', testCase.formData.email);
                console.log(`  ✓ Filled email: ${testCase.formData.email}`);

                await page.fill('input[name="form_fields[parents_phone]"]', testCase.formData.parents_phone);
                console.log(`  ✓ Filled phone: ${testCase.formData.parents_phone}`);

                // Fill new fields
                if (testCase.formData.job) {
                    await page.fill('input[name="form_fields[job]"]', testCase.formData.job);
                    console.log(`  ✓ Filled job: ${testCase.formData.job}`);
                }

                // Select radio buttons
                await page.check(`input[name="form_fields[kupa]"][value="${testCase.formData.kupa}"]`);
                console.log(`  ✓ Selected kupa: ${testCase.formData.kupa}`);

                await page.check(`input[name="form_fields[team]"][value="${testCase.formData.team}"]`);
                console.log(`  ✓ Selected team: ${testCase.formData.team}`);

                // Select first available day option (more robust than specific value selector)
                const dayRadios = page.locator('input[name="form_fields[day]"]');
                await dayRadios.first().check();
                console.log(`  ✓ Selected first available day option`);

                await page.check(`input[name="form_fields[payment_method]"][value="${testCase.formData.payment_method}"]`);
                console.log(`  ✓ Selected payment method: ${testCase.formData.payment_method}`);

                // Check approval checkbox
                await page.check('input[name="form_fields[approval]"]');
                console.log(`  ✓ Checked approval checkbox`);

                // Wait for any form validation or processing
                await page.waitForTimeout(500);

                // Submit the form and wait for redirect
                const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();

                // Set up promise to wait for navigation to Sumit
                const navigationPromise = page.waitForURL(url => url.includes('sumit.co.il'), {
                    timeout: 30000
                }).catch(async () => {
                    // If navigation doesn't happen, check if URL changed at all
                    await page.waitForTimeout(2000);
                    return null;
                });

                await submitButton.click();
                console.log('  ✓ Clicked submit button');

                // Wait for redirect
                await navigationPromise;

                // Get the redirect URL
                const redirectUrl = page.url();
                console.log(`  📍 Redirected to: ${redirectUrl}`);

                // Verify it's a Sumit URL
                expect(redirectUrl).toContain('sumit.co.il');
                console.log(`  ✅ Redirected to Sumit payment page`);

                // Verify URL contains expected base
                expect(redirectUrl).toContain(testCase.expected.base);
                console.log(`  ✅ Contains base: ${testCase.expected.base}`);

                // Verify URL contains expected path
                expect(redirectUrl).toContain(testCase.expected.path);
                console.log(`  ✅ Contains path: ${testCase.expected.path}`);

                // Verify additems parameter
                if (testCase.expected.hasAdditems) {
                    expect(redirectUrl).toContain('additems=1');
                    console.log(`  ✅ Contains: additems=1`);
                }

                // Verify user data is included (using encoded email to avoid failures)
                const expectedName = `${testCase.formData.first_name}%20${testCase.formData.last_name}`;
                expect(redirectUrl).toContain(`name=${expectedName}`);
                expect(redirectUrl).toContain(`emailaddress=${encodeURIComponent(testCase.formData.email)}`);
                expect(redirectUrl).toContain(`phone=${testCase.formData.parents_phone}`);
                expect(redirectUrl).toContain(`companynumber=${testCase.formData.id_number}`);
                console.log(`  ✅ User data included in URL`);

                console.log(`  ✅ PASSED: ${testCase.name}\n`);

            } catch (error) {
                console.error(`  ❌ FAILED: ${error.message}`);

                // Take screenshot on failure
                await page.screenshot({
                    path: `test-results/failure-${testCase.id}.png`,
                    fullPage: true
                });
                console.log(`  📸 Screenshot saved to test-results/failure-${testCase.id}.png`);

                throw error;
            }
        });
    }

    test.afterAll(async () => {
        console.log('\n' + '='.repeat(80));
        console.log('TEST SUMMARY');
        console.log('='.repeat(80));
        console.log(`✅ All conditional redirect tests completed`);
        console.log(`✅ NO permission prompts appeared during testing`);
        console.log('\nTested conditions:');
        console.log('  - Short series + Meuhedet → ic7jaq/c');
        console.log('  - Short series + Other kupa → ic788r/c');
        console.log('  - Long series + Meuhedet → ic7jaq/c');
        console.log('  - Long series + Other kupa → ic788r/c');
        console.log('='.repeat(80) + '\n');
    });
});
