/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import {
    MOCK_TEMPLATES,
    TEMPLATE_CONTENT_TEXT,
    mockTemplatesCloudRoutes,
} from '../config/mocks';

// The plugin also portals a "Templates Cloud" button into
// `.edit-post-header__center`, but that element no longer exists in current
// WordPress (renamed to `.editor-header__center`), so the button cannot be
// tested until the plugin is updated. The block path below covers the same
// import modal.
test.describe('Templates Cloud in the block editor', () => {
    // The editor integration only loads for "legacy Templates Cloud" installs.
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

    test('inserting the block opens the library modal with cloud templates', async ({
        page,
        admin,
        editor,
    }) => {
        await admin.createNewPost();

        // The block's edit component auto-opens the import modal.
        await editor.insertBlock({ name: 'ti-tpc/templates-cloud' });

        const modal = page.locator('.tpc-template-cloud-modal');
        await expect(modal).toBeVisible();
        await expect(modal.locator('.table-grid')).toHaveCount(
            MOCK_TEMPLATES.length
        );
        await expect(
            modal.getByText(MOCK_TEMPLATES[0].template_name)
        ).toBeVisible();
    });

    test('importing a template inserts its blocks into the post', async ({
        page,
        admin,
        editor,
    }) => {
        await admin.createNewPost();
        await editor.insertBlock({ name: 'ti-tpc/templates-cloud' });

        const modal = page.locator('.tpc-template-cloud-modal');
        await modal
            .locator('.table-grid')
            .first()
            .getByRole('button', { name: 'Import' })
            .click();

        await expect(
            editor.canvas.getByText(TEMPLATE_CONTENT_TEXT)
        ).toBeVisible();
    });
});
