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

// The 'personal' API mode is the state inherit_license_from_neve() stores for a
// Neve Personal key: the license is valid, its tier is not eligible. The panel
// has to treat it as a stored license and still say why Templates Cloud is locked.
test.describe('A stored license on an ineligible plan', () => {
    const SETTINGS_URL = 'admin.php?page=tiob-plugin#settings';

    test.beforeEach(async ({ requestUtils, admin }) => {
        await setLegacyTc(requestUtils, true);
        await setApiMode(requestUtils, 'personal');
        await admin.visitAdminPage(SETTINGS_URL);
    });

    test.afterEach(async ({ requestUtils }) => {
        await setApiMode(requestUtils, '');
        await setLegacyTc(requestUtils, false);
    });

    test('can be deactivated', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Deactivate' })).toBeVisible();
    });

    test('is masked in the license field', async ({ page }) => {
        await expect(page.getByLabel('License Key')).toHaveValue(
            '******************************l-key',
        );
    });

    test('is not reported as verified', async ({ page }) => {
        await expect(page.getByText('Verified - Expires at')).toBeHidden();
    });

    test('explains that the plan does not include Templates Cloud', async ({ page }) => {
        await expect(
            page.getByText(
                'Your license is valid, but Templates Cloud is not included in your plan.',
            ),
        ).toBeVisible();
    });
});
