/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import {
    AGENCY_LICENSE,
    MOCK_TEMPLATES,
    PERSONAL_LICENSE,
    mockTemplatesCloudRoutes,
} from '../config/mocks';

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

// The license panel lives in the tiob-plugin dashboard settings, which only
// exists for "legacy Templates Cloud" installs. The 'invalid' API mode drops the
// license the mu-plugin seeds, so the activation form is the starting state.
test.describe('License activation', () => {
    const SETTINGS_URL = 'admin.php?page=tiob-plugin#settings';

    test.beforeEach(async ({ requestUtils }) => {
        await setLegacyTc(requestUtils, true);
        await setApiMode(requestUtils, 'invalid');
    });

    test.afterEach(async ({ requestUtils }) => {
        await setApiMode(requestUtils, '');
        await setLegacyTc(requestUtils, false);
    });

    test('not activating personal plan', async ({
        page,
        admin,
    }) => {
        await mockTemplatesCloudRoutes(page, MOCK_TEMPLATES, PERSONAL_LICENSE);
        await admin.visitAdminPage(SETTINGS_URL);

        await page.getByLabel('License Key').fill(PERSONAL_LICENSE.key);
        await page.getByRole('button', { name: 'Activate' }).click();

        await expect(
            page.locator('#tpc-app').getByText('Can not activate this license!', { exact: true })
        ).toBeVisible();
    });

    test('activating an agency plan', async ({
        page,
        admin,
    }) => {
        await mockTemplatesCloudRoutes(page, MOCK_TEMPLATES, AGENCY_LICENSE);
        await admin.visitAdminPage(SETTINGS_URL);

        await page.getByLabel('License Key').fill(AGENCY_LICENSE.key);
        await page.getByRole('button', { name: 'Activate' }).click();

        await expect(page.getByRole('button', { name: 'Deactivate' })).toBeVisible();
    });
});
