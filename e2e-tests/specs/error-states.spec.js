/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import { mockOnboardingRoutes } from '../config/mocks';

const setApiMode = (requestUtils, mode) =>
    requestUtils.rest({
        path: '/tpc-e2e/v1/api-mode',
        method: 'POST',
        data: { mode },
    });

const setLegacyTc = (requestUtils, enabled) =>
    requestUtils.rest({
        path: '/tpc-e2e/v1/legacy-tc',
        method: 'POST',
        data: { enabled },
    });

// Error-scenario coverage: the mu-plugin serves failure responses for the
// ThemeIsle APIs based on the tpc_e2e_api_mode option (Otter pattern).
test.describe('API error states', () => {
    test.afterEach(async ({ requestUtils }) => {
        await setApiMode(requestUtils, '');
        await setLegacyTc(requestUtils, false);
    });

    test('onboarding shows an error when the demo data fetch fails', async ({ page, admin }) => {
        await mockOnboardingRoutes(page);
        // Later-registered routes win: override the demo-data mock with a 500.
        await page.route('**/wp-json/ti-demo-data/data*', (route) =>
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Internal Server Error' }),
            }),
        );

        await admin.visitAdminPage('themes.php?page=neve-onboarding');
        await page.locator('.ss-card-wrap').first().click();

        await expect(page.locator('.ob-error-wrap')).toBeVisible();
    });

    test('onboarding lists no sites when the sites feed is down', async ({
        page,
        admin,
        requestUtils,
    }) => {
        await setApiMode(requestUtils, 'down');
        await mockOnboardingRoutes(page);

        await admin.visitAdminPage('themes.php?page=neve-onboarding');

        await expect(page.locator('.ss-card-wrap')).toHaveCount(0);
    });

    test('an invalid license shows the activate UI in dashboard settings', async ({
        page,
        admin,
        requestUtils,
    }) => {
        await setLegacyTc(requestUtils, true);
        await setApiMode(requestUtils, 'invalid');

        await admin.visitAdminPage('admin.php?page=tiob-plugin#settings');

        await expect(page.getByText('License Key')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Activate' })).toBeVisible();
    });

    test('starter_order degrades gracefully when the ranking API is down', async ({
        requestUtils,
    }) => {
        await setApiMode(requestUtils, 'down');

        const res = await requestUtils.rest({
            path: '/ti-sites-lib/v1/starter_order',
            method: 'GET',
            params: { builder: 'gutenberg' },
        });

        expect(res.success).toBe(true);
        expect(res.order).toEqual([]);
    });
});
