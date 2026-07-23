/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import { MOCK_TEMPLATES, mockTemplatesCloudRoutes } from '../config/mocks';

// The tiob-plugin dashboard only exists for "legacy Templates Cloud" installs;
// without the Neve theme it exposes the My Library and Settings tabs (the
// starter-sites grid is hidden and is covered by the onboarding spec instead).
test.describe('Templates Cloud dashboard', () => {
    const DASHBOARD_URL = 'admin.php?page=tiob-plugin';

    test.beforeAll(async ({ requestUtils }) => {
        await requestUtils.rest({
            path: '/tpc-e2e/v1/legacy-tc',
            method: 'POST',
            data: { enabled: true },
        });
    });

    test.afterAll(async ({ requestUtils }) => {
        await requestUtils.rest({
            path: '/tpc-e2e/v1/legacy-tc',
            method: 'POST',
            data: { enabled: false },
        });
    });

    test.beforeEach(async ({ page }) => {
        await mockTemplatesCloudRoutes(page);
    });

    test('My Library lists mocked cloud templates', async ({ page, admin }) => {
        await admin.visitAdminPage(DASHBOARD_URL);

        for (const template of MOCK_TEMPLATES) {
            await expect(page.getByText(template.template_name)).toBeVisible();
        }
        await expect(page.getByRole('button', { name: 'Import' })).toHaveCount(
            MOCK_TEMPLATES.length,
        );
    });

    // Tab navigation happens via the admin sidebar links, which use URL hashes.
    test('Settings tab renders general and feedback panels', async ({ page, admin }) => {
        await admin.visitAdminPage(`${DASHBOARD_URL}#settings`);

        await expect(page.getByRole('heading', { name: 'Useful links' })).toBeVisible();

        await page.getByRole('button', { name: 'Feedback' }).click();
        await expect(
            page.getByRole('heading', {
                name: "What's one thing you need in Templates Cloud?",
            }),
        ).toBeVisible();
    });
});
